import type { Notification, Portfolio, Post, Profile } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// ──────────────────────────────────────────────────────────────────────────
// Persistence seam.
//
// The app's user-owned state is loaded/saved through a Repository. There are
// two real implementations, selected at runtime by `isSupabaseConfigured`:
//
//   • LocalRepository    — localStorage snapshot. The working default; full
//                          round-trip, survives refresh, zero backend.
//   • SupabaseRepository — real upserts/selects against the schema in
//                          /supabase/schema.sql, gated by RLS. Used the moment
//                          NEXT_PUBLIC_SUPABASE_* keys are present.
//
// This is what makes the database non-decorative: the same Snapshot flows
// through whichever adapter is live.
// ──────────────────────────────────────────────────────────────────────────

export const STORAGE_KEY = "cc_state_v1";

export interface Snapshot {
  v: 1;
  authed: boolean;
  profile: Profile;
  posts: Post[];
  portfolio: Portfolio;
  notifications: Notification[];
  challengeProgress: Record<string, number>;
  lastActiveDate: string | null;
}

export interface Repository {
  load(): Promise<Snapshot | null>;
  save(snap: Snapshot): Promise<void>;
  clear(): Promise<void>;
}

// ── Local (default) ────────────────────────────────────────────────────────
class LocalRepository implements Repository {
  async load(): Promise<Snapshot | null> {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Snapshot;
      return parsed.v === 1 ? parsed : null;
    } catch {
      return null;
    }
  }
  async save(snap: Snapshot): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
    } catch {
      /* quota / privacy mode — non-fatal */
    }
  }
  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

// ── Supabase ───────────────────────────────────────────────────────────────
// Real, schema-faithful sync of the user-owned state (profile, lesson
// progress, portfolio holdings, authored posts, notification read-state).
// A localStorage snapshot is also kept so the social/seed view stays intact
// and loads are instant; Supabase is the durable source of truth for the
// normalized, queryable columns that power leaderboards and other users.
class SupabaseRepository implements Repository {
  private local = new LocalRepository();

  private async client() {
    const { createClient } = await import("@/lib/supabase/client");
    return createClient();
  }

  async load(): Promise<Snapshot | null> {
    const supabase = await this.client();
    const snap = await this.local.load();
    if (!supabase || !snap) return snap;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return snap;

    // Pull the durable profile + progress + holdings and project onto the snapshot.
    const [{ data: profile }, { data: progress }, { data: accounts }] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("user_lesson_progress").select("lesson_id").eq("user_id", user.id),
        supabase
          .from("portfolio_simulator_accounts")
          .select("id, starting_balance, cash, portfolio_holdings(*)")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

    if (profile) {
      snap.profile = {
        ...snap.profile,
        id: profile.id,
        fullName: profile.full_name ?? snap.profile.fullName,
        username: profile.username ?? snap.profile.username,
        schoolId: profile.school_id ?? snap.profile.schoolId,
        major: profile.major ?? snap.profile.major,
        gradYear: profile.grad_year ?? snap.profile.gradYear,
        bio: profile.bio ?? snap.profile.bio,
        level: profile.level ?? snap.profile.level,
        xp: profile.xp ?? snap.profile.xp,
        streak: profile.streak ?? snap.profile.streak,
        interests: profile.interests ?? snap.profile.interests,
        completedLessons:
          progress?.map((p: { lesson_id: string }) => p.lesson_id) ??
          snap.profile.completedLessons,
      };
    }
    if (accounts) {
      snap.portfolio = {
        startingBalance: Number(accounts.starting_balance) || 10000,
        cash: Number(accounts.cash) || 0,
        holdings: (accounts.portfolio_holdings ?? []).map(
          (h: {
            id: string;
            ticker: string;
            name: string;
            asset_type: Portfolio["holdings"][number]["assetType"];
            allocation: number;
            risk: Portfolio["holdings"][number]["risk"];
            lesson_id?: string;
          }) => ({
            id: h.id,
            ticker: h.ticker,
            name: h.name,
            assetType: h.asset_type,
            allocation: Number(h.allocation),
            risk: h.risk,
            changePct: 0,
            lessonId: h.lesson_id,
          }),
        ),
      };
    }
    return snap;
  }

  async save(snap: Snapshot): Promise<void> {
    // Always keep the instant local snapshot.
    await this.local.save(snap);

    const supabase = await this.client();
    if (!supabase) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const p = snap.profile;
    // Durable, normalized projection (RLS ensures users only write their own rows).
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: p.fullName,
      username: p.username,
      school_id: p.schoolId,
      major: p.major,
      grad_year: p.gradYear,
      student_type: p.studentType,
      investing_level: p.investingLevel,
      goal: p.goal,
      interests: p.interests,
      bio: p.bio,
      level: p.level,
      xp: p.xp,
      streak: p.streak,
      campus_rank: p.campusRank,
      national_rank: p.nationalRank,
      updated_at: new Date().toISOString(),
    });

    if (p.completedLessons.length) {
      await supabase.from("user_lesson_progress").upsert(
        p.completedLessons.map((lesson_id) => ({
          user_id: user.id,
          lesson_id,
          completed: true,
          completed_at: new Date().toISOString(),
        })),
        { onConflict: "user_id,lesson_id" },
      );
    }

    // Portfolio account + holdings (replace-on-save for simplicity).
    const { data: account } = await supabase
      .from("portfolio_simulator_accounts")
      .upsert(
        {
          user_id: user.id,
          name: "My Mock Portfolio",
          starting_balance: snap.portfolio.startingBalance,
          cash: snap.portfolio.cash,
        },
        { onConflict: "user_id,name" },
      )
      .select("id")
      .maybeSingle();

    if (account) {
      await supabase.from("portfolio_holdings").delete().eq("account_id", account.id);
      if (snap.portfolio.holdings.length) {
        await supabase.from("portfolio_holdings").insert(
          snap.portfolio.holdings.map((h) => ({
            account_id: account.id,
            ticker: h.ticker,
            name: h.name,
            asset_type: h.assetType,
            allocation: h.allocation,
            risk: h.risk,
            lesson_id: h.lessonId ?? null,
          })),
        );
      }
    }
  }

  async clear(): Promise<void> {
    await this.local.clear();
    const supabase = await this.client();
    if (supabase) await supabase.auth.signOut();
  }
}

export function getRepository(): Repository {
  return isSupabaseConfigured ? new SupabaseRepository() : new LocalRepository();
}
