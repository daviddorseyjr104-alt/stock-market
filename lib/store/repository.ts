import type {
  Certificate,
  CoachNote,
  Notification,
  Portfolio,
  Post,
  Profile,
  SavedProject,
} from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// ──────────────────────────────────────────────────────────────────────────
// Persistence seam.
//
// The app's user-owned state is loaded/saved through a Repository. There are
// two real implementations, selected at runtime by `isSupabaseConfigured`:
//
//   • LocalRepository, localStorage snapshot. The working default; full
//                          round-trip, survives refresh, zero backend.
//   • SupabaseRepository, real upserts/selects against the schema in
//                          /supabase/schema.sql, gated by RLS. Used the moment
//                          NEXT_PUBLIC_SUPABASE_* keys are present.
//
// This is what makes the database non-decorative: the same Snapshot flows
// through whichever adapter is live.
// ──────────────────────────────────────────────────────────────────────────

export const STORAGE_KEY = "cc_state_v1";

/** Current snapshot schema version. Mismatched persisted snapshots are
 *  discarded on load and the app falls back to a fresh demo snapshot. */
export const SNAPSHOT_VERSION = 4 as const;

export interface EquityPoint {
  t: number; // epoch ms
  v: number; // total account value at that time
}

/** What the user has opted into being notified about. */
export interface NotifyPrefs {
  streak: boolean;
  lessons: boolean;
  social: boolean;
  rank: boolean;
}

export const DEFAULT_NOTIFY: NotifyPrefs = {
  streak: true,
  lessons: true,
  social: true,
  rank: false,
};

/** Per-day activity counters; reset when the local day changes. */
export interface DailyXp {
  date: string; // local dateKey "YYYY-MM-DD"
  xp: number;
  correct: number;
  lessons: number;
  minutes: number;
}

export interface Snapshot {
  v: typeof SNAPSHOT_VERSION;
  authed: boolean;
  /** True only when the backend confirms the address (or in keyless demo mode).
   *  Gates the features that represent a person to other people: clubs, posting. */
  emailVerified: boolean;
  profile: Profile;
  posts: Post[];
  portfolio: Portfolio;
  notifications: Notification[];
  challengeProgress: Record<string, number>;
  lastActiveDate: string | null;
  equityHistory: EquityPoint[];
  // ── v2: course-engine + gamified state ────────────────────────────────────
  /** Epoch ms the heart-regen clock last advanced; null when hearts are full. */
  heartsUpdatedAt: number | null;
  dailyXp: DailyXp;
  /** Progress per active daily-quest id; reset daily. */
  questProgress: Record<string, number>;
  coachNotes: CoachNote[];
  savedProjects: SavedProject[];
  certificates: Certificate[];
  /** False until the user has picked a username + avatar. Drives the onboarding gate. */
  onboarded: boolean;
  notifyPrefs: NotifyPrefs;
}

export interface Repository {
  /** `base` is a fresh, unauthed snapshot the adapter can build on when there is
   *  no usable cached one (new device, or a cache belonging to another account). */
  load(base: Snapshot): Promise<Snapshot | null>;
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
      // Version mismatch → discard; the provider falls back to demoSnapshot.
      if (parsed.v !== SNAPSHOT_VERSION) return null;
      // Forward-compat: fill any missing collections defensively.
      if (!Array.isArray(parsed.equityHistory)) parsed.equityHistory = [];
      if (!Array.isArray(parsed.coachNotes)) parsed.coachNotes = [];
      if (!Array.isArray(parsed.savedProjects)) parsed.savedProjects = [];
      if (!Array.isArray(parsed.certificates)) parsed.certificates = [];
      if (!parsed.questProgress || typeof parsed.questProgress !== "object")
        parsed.questProgress = {};
      parsed.notifyPrefs = { ...DEFAULT_NOTIFY, ...(parsed.notifyPrefs ?? {}) };
      return parsed;
    } catch {
      return null;
    }
  }
  async save(snap: Snapshot): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
    } catch {
      /* quota / privacy mode, non-fatal */
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

  async load(base: Snapshot): Promise<Snapshot | null> {
    const supabase = await this.client();
    const cached = await this.local.load();
    if (!supabase) return cached;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // The Supabase session is the sole authority on identity. A cached snapshot
    // with `authed: true` but no session is a stale/forged one; never honour it.
    if (!user) return cached ? { ...cached, authed: false, emailVerified: false } : null;

    // A snapshot cached by a *different* account on this device must not bleed
    // into this one, so fall back to a fresh base and rebuild from the backend.
    const isMine = cached && (!cached.profile.id || cached.profile.id === user.id);
    const snap: Snapshot = isMine && cached ? { ...cached } : { ...base };
    snap.authed = true;
    snap.emailVerified = Boolean(user.email_confirmed_at);
    snap.profile = { ...snap.profile, id: user.id, email: user.email ?? snap.profile.email };

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
        avatarUrl: profile.avatar_url ?? snap.profile.avatarUrl,
        completedChallenges:
          profile.completed_challenges ?? snap.profile.completedChallenges ?? [],
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
        positions: (accounts.portfolio_holdings ?? []).map(
          (h: {
            id: string;
            ticker: string;
            name: string;
            asset_type: Portfolio["positions"][number]["assetType"];
            shares: number;
            avg_cost: number;
            risk: Portfolio["positions"][number]["risk"];
            lesson_id?: string;
          }) => ({
            id: h.id,
            ticker: h.ticker,
            name: h.name,
            assetType: h.asset_type,
            shares: Number(h.shares),
            avgCost: Number(h.avg_cost),
            risk: h.risk,
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

    // Writing an unauthenticated snapshot would upsert placeholder identity
    // ("Guest", xp 0) over the signed-in user's real row. Never persist one.
    if (!snap.authed) return;

    const supabase = await this.client();
    if (!supabase) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    // The snapshot in hand belongs to someone else (mid-account-switch); dropping
    // the write is always safe — the correct snapshot saves on the next tick.
    if (snap.profile.id && snap.profile.id !== user.id) return;

    const p = snap.profile;
    // Durable, normalized projection (RLS ensures users only write their own rows).
    const { error: profileError } = await supabase.from("profiles").upsert({
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
      avatar_url: p.avatarUrl ?? null,
      completed_challenges: p.completedChallenges ?? [],
      updated_at: new Date().toISOString(),
    });

    // `username` is UNIQUE. A collision (or any RLS rejection) used to be
    // swallowed here, so the write vanished and the user saw stale data forever.
    if (profileError) {
      console.error("[repository] profile upsert failed:", profileError.message);
    }

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

    // Portfolio account + holdings.
    const { data: account, error: accountError } = await supabase
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

    // This error was discarded, so a failed account upsert meant holdings were
    // never written at all — silently. The local snapshot still looked right,
    // and the loss only surfaced on another device.
    if (accountError || !account) {
      console.error(
        "[repository] portfolio account upsert failed:",
        accountError?.message ?? "no row returned",
      );
      return;
    }

    // Replace-on-save, but insert FIRST and only then delete what's stale.
    //
    // This used to DELETE every holding and then INSERT the new set, with both
    // errors discarded. If the insert failed (an FK violation on lesson_id was
    // enough), the delete had already committed and the user's entire portfolio
    // was gone from the database with nothing surfaced. Writing first means a
    // failed insert leaves the previous rows intact.
    const stamp = new Date().toISOString();
    if (snap.portfolio.positions.length) {
      const { error: insertError } = await supabase.from("portfolio_holdings").insert(
        snap.portfolio.positions.map((h) => ({
          account_id: account.id,
          ticker: h.ticker,
          name: h.name,
          asset_type: h.assetType,
          shares: h.shares,
          avg_cost: h.avgCost,
          risk: h.risk,
          lesson_id: h.lessonId ?? null,
          updated_at: stamp,
        })),
      );
      if (insertError) {
        console.error("[repository] holdings insert failed:", insertError.message);
        return; // Leave the previous rows in place rather than destroy them.
      }
    }

    // Drop only the rows this save superseded. Concurrent saves (the store
    // debounces at 350ms, so two quick trades can overlap) can no longer
    // interleave into duplicate tickers, because each save deletes exactly the
    // generation that preceded it.
    const { error: deleteError } = await supabase
      .from("portfolio_holdings")
      .delete()
      .eq("account_id", account.id)
      .lt("updated_at", stamp);
    if (deleteError) {
      console.error("[repository] stale holdings cleanup failed:", deleteError.message);
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
