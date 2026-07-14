"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  Goal,
  AssetType,
  CoachNote,
  Certificate,
  ChallengeStatus,
  Course,
  DailyQuest,
  Interest,
  InvestingLevel,
  Notification,
  NotificationType,
  Portfolio,
  Position,
  Post,
  PostCategory,
  Profile,
  RiskLabel,
  SavedProject,
  Skill,
  StudentType,
} from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { joinClub as remoteJoinClub, leaveClub as remoteLeaveClub } from "@/lib/social";
import { currentUser as demoPersona } from "@/lib/data/people";
import { posts as seedPosts } from "@/lib/data/posts";
import { defaultPortfolio } from "@/lib/data/portfolio";
import { badgeById } from "@/lib/data/badges";
import { challenges } from "@/lib/data/challenges";
import {
  courseById,
  courseLessonById,
  firstLessonOfCourse,
  lessonsForCourse,
  nextLessonId,
} from "@/lib/data/courses";
import { skills } from "@/lib/data/skills";
import { dailyQuestsFor } from "@/lib/data/quests";
import {
  challengeProgressPct,
  computeBadges,
  computeSkills,
  courseProgress,
  dateKey,
  levelForXp,
  nextHeartAt,
  nextStreak,
  regenerateHearts,
} from "./progression";
import {
  getRepository,
  DEFAULT_NOTIFY,
  SNAPSHOT_VERSION,
  type DailyXp,
  type NotifyPrefs,
  type Snapshot,
  type EquityPoint,
} from "./repository";

export const MAX_HEARTS = 5;

// A single honest welcome notification (no fabricated social/rank events).
// The href used to be "/learn/what-is-investing", a lesson in the retired
// curriculum, so the very first CTA a new user got dropped them out of the
// course path. It points at the path itself now.
function welcomeNote(createdAt: string): Notification {
  return {
    id: "welcome",
    type: "lesson",
    title: "Welcome to Campus Capital 🎉",
    body: "Start with Money Basics to earn your first badge.",
    createdAt,
    read: false,
    href: "/learn",
  };
}

function freshDailyXp(date = dateKey()): DailyXp {
  return { date, xp: 0, correct: 0, lessons: 0, minutes: 0 };
}

/**
 * Pays out any challenge whose rule is now satisfied and that hasn't been paid
 * before. Pure and idempotent — safe to run on every reconcile.
 *
 * `profile.completedChallenges` is the durable ledger (it rides along on the
 * profile row), so a user cannot be paid twice by opening the app on a second
 * device.
 */
function applyChallengeRewards(s: Snapshot): Snapshot {
  const paid = new Set(s.profile.completedChallenges ?? []);
  const newlyDone = challenges.filter(
    (c) =>
      !paid.has(c.id) &&
      challengeProgressPct(c.rule, s.profile, s.portfolio.positions) >= 100,
  );
  if (newlyDone.length === 0) return s;

  const xpGained = newlyDone.reduce((sum, c) => sum + c.xp, 0);
  const notes: Notification[] = newlyDone.map((c) => ({
    id: `challenge-${c.id}`,
    type: "challenge",
    title: `Challenge complete: ${c.title}`,
    body: `You earned +${c.xp} XP${c.badgeId ? ` and the ${badgeById(c.badgeId)?.name ?? c.badgeId} badge` : ""}.`,
    createdAt: new Date().toISOString(),
    read: false,
    href: "/challenges",
  }));

  return {
    ...s,
    profile: {
      ...s.profile,
      xp: s.profile.xp + xpGained,
      completedChallenges: [...Array.from(paid), ...newlyDone.map((c) => c.id)],
      // Challenge badges are awarded through the same recompute as every other
      // badge (see computeBadges), so there's nothing to add here — the rules
      // that gate them are satisfied by the same state that completed this.
    },
    dailyXp: { ...s.dailyXp, xp: s.dailyXp.xp + xpGained },
    notifications: [
      ...notes.filter((n) => allowsNotification(s.notifyPrefs, n.type)),
      ...s.notifications,
    ],
  };
}

/** Maps each notification kind onto the Settings switch that governs it. */
function allowsNotification(prefs: NotifyPrefs, type: NotificationType): boolean {
  switch (type) {
    case "streak":
      return prefs.streak;
    case "lesson":
    case "badge":
    case "challenge":
      return prefs.lessons;
    case "school":
      return prefs.rank;
    case "follow":
    case "comment":
      return prefs.social;
  }
}

// The demo persona keeps their identity, but every EARNED stat starts at
// zero: xp, level, streak, badges, lessons, ranks. Progress is real, not faked.
function freshDemoProfile(): Profile {
  return {
    ...demoPersona,
    level: 1,
    xp: 0,
    streak: 0,
    campusRank: 0,
    nationalRank: 0,
    followers: 0,
    following: 0,
    badges: [],
    completedLessons: [],
    completedChallenges: [],
    hearts: MAX_HEARTS,
    maxHearts: MAX_HEARTS,
    skills: [],
  };
}

// ── Default (demo) snapshot, deterministic, SSR-safe ──────────────────────
// dailyXp.date uses a fixed sentinel so server and client render identically;
// the daily rollover (reconcile) stamps the real local date after hydration.
function demoSnapshot(): Snapshot {
  return {
    v: SNAPSHOT_VERSION,
    authed: false,
    // With no backend there is no address to confirm, so demo mode is trusted.
    // With Supabase live this is overwritten from `user.email_confirmed_at`.
    emailVerified: !isSupabaseConfigured,
    onboarded: false,
    profile: freshDemoProfile(),
    posts: seedPosts,
    portfolio: structuredClonePortfolio(defaultPortfolio),
    notifications: [welcomeNote("2026-01-05T17:00:00.000Z")],
    challengeProgress: {},
    lastActiveDate: null,
    equityHistory: [],
    heartsUpdatedAt: null,
    dailyXp: freshDailyXp("1970-01-01"),
    questProgress: {},
    coachNotes: [],
    savedProjects: [],
    certificates: [],
    notifyPrefs: DEFAULT_NOTIFY,
  };
}

function structuredClonePortfolio(p: Portfolio): Portfolio {
  return { ...p, positions: p.positions.map((h) => ({ ...h })) };
}

// ── Daily rollover + heart regen (pure) ────────────────────────────────────
// On a new local day: dailyXp counters and quest progress reset. Hearts are no
// longer tied to the calendar day — they accrue on a timer (see progression.ts)
// so running out is a short pause, never a lockout until midnight.
// Idempotent, applied during hydrate and on every reconcile.
function rolloverDay(s: Snapshot, now: number): Snapshot {
  const today = dateKey();
  let next = s;
  if (s.dailyXp.date !== today) {
    next = { ...next, dailyXp: freshDailyXp(today), questProgress: {} };
  }
  const max = next.profile.maxHearts ?? MAX_HEARTS;
  const regen = regenerateHearts(next.profile.hearts ?? max, max, next.heartsUpdatedAt, now);
  if (
    regen.hearts !== (next.profile.hearts ?? max) ||
    regen.updatedAt !== next.heartsUpdatedAt
  ) {
    next = {
      ...next,
      heartsUpdatedAt: regen.updatedAt,
      profile: { ...next.profile, hearts: regen.hearts, maxHearts: max },
    };
  }
  return next;
}

function metricValue(daily: DailyXp, metric: DailyQuest["metric"]): number {
  switch (metric) {
    case "lessons":
      return daily.lessons;
    case "xp":
      return daily.xp;
    case "correct":
      return daily.correct;
    case "minutes":
      return daily.minutes;
  }
}

// Syncs stored quest progress with today's counters and awards each active
// quest's xpReward exactly once when it crosses its goal. Loops because an
// XP reward can itself complete an "earn XP" quest.
function applyQuestProgress(s: Snapshot): Snapshot {
  const active = dailyQuestsFor(s.dailyXp.date);
  let profile = s.profile;
  let daily = s.dailyXp;
  const qp = { ...s.questProgress };
  for (let pass = 0; pass < 4; pass++) {
    let bonus = 0;
    for (const q of active) {
      const value = metricValue(daily, q.metric);
      const prev = qp[q.id] ?? 0;
      if (prev < q.goal && value >= q.goal) bonus += q.xpReward;
      qp[q.id] = value;
    }
    if (bonus === 0) break;
    profile = { ...profile, xp: profile.xp + bonus };
    daily = { ...daily, xp: daily.xp + bonus };
    for (const q of active) qp[q.id] = metricValue(daily, q.metric);
  }
  return { ...s, profile, dailyXp: daily, questProgress: qp };
}

export interface BuyOrder {
  ticker: string;
  name: string;
  assetType: AssetType;
  risk: RiskLabel;
  lessonId?: string;
  shares: number;
  price: number;
}

export interface SignupInput {
  /** Supabase auth user id, when a real session was created. */
  id?: string;
  fullName: string;
  username: string;
  avatarUrl?: string;
  email: string;
  emailVerified?: boolean;
  schoolId: string;
  major: string;
  gradYear: number;
  studentType: StudentType;
  investingLevel: InvestingLevel;
  goal: Goal;
  interests: Interest[];
  clubId?: string | null;
}

/** `reason: "verify"` means the account exists but the email isn't confirmed yet. */
export interface ClubActionResult {
  ok: boolean;
  reason?: "verify" | "error";
  message?: string;
}

export interface LessonReward {
  xpGained: number;
  leveledUp: boolean;
  newBadgeIds: string[];
  alreadyDone: boolean;
  /** The lesson unlocked by this completion (next in the course), if any. */
  unlockedLessonId?: string;
  /** Set when this completion finished the lesson's whole course. */
  courseCompletedId?: string;
}

export interface QuestStatus {
  quest: DailyQuest;
  value: number;
  done: boolean;
}

export interface SkillProgressRow {
  skill: Skill;
  course: Course;
  pct: number;
  done: number;
  total: number;
}

interface AppStateValue {
  hydrated: boolean;
  authed: boolean;
  profile: Profile;
  posts: Post[];
  portfolio: Portfolio;
  notifications: Notification[];
  unreadCount: number;
  /** Every challenge with the user's REAL progress resolved. */
  challengeStatuses: () => ChallengeStatus[];
  dailyXp: DailyXp;
  coachNotes: CoachNote[];
  savedProjects: SavedProject[];
  certificates: Certificate[];

  // auth
  /** Backend-confirmed email address. Gates clubs and posting. */
  emailVerified: boolean;
  /** Has the user picked a username + avatar yet? */
  onboarded: boolean;
  loginAsDemo: () => void;
  /** Adopt an existing Supabase session and rebuild state from the backend. */
  beginSession: () => Promise<void>;
  signUp: (input: SignupInput) => void;
  completeOnboarding: (input: { username: string; avatarUrl?: string }) => void;
  logout: () => void;

  // learning
  isCourseUnlocked: (courseId: string) => boolean;
  isLessonUnlocked: (lessonId: string) => boolean;
  isLessonComplete: (lessonId: string) => boolean;
  completeLesson: (lessonId: string) => LessonReward;
  skillProgress: () => SkillProgressRow[];

  // hearts + answers
  hearts: number;
  maxHearts: number;
  /** Epoch ms the next heart lands, or null when full. */
  nextHeartAt: number | null;
  loseHeart: () => number;
  refillHearts: () => void;
  recordAnswer: (
    correct: boolean,
    xp?: number,
    opts?: { practice?: boolean },
  ) => { hearts: number };

  // quests
  questProgressFor: (dateKey: string) => QuestStatus[];

  // coach + projects
  addCoachNote: (note: { title: string; body: string; topic: string }) => void;
  deleteCoachNote: (id: string) => void;
  saveProject: (p: {
    kind: string;
    title: string;
    summary: string;
    data: Record<string, unknown>;
  }) => SavedProject;
  deleteProject: (id: string) => void;

  // clubs
  joinClub: (clubId: string) => Promise<ClubActionResult>;
  leaveClub: (clubId: string) => Promise<ClubActionResult>;
  toggleClub: (clubId: string) => Promise<ClubActionResult>;
  isClubMember: (clubId: string) => boolean;

  // social
  toggleLike: (postId: string) => void;
  addPost: (body: string, category: PostCategory, clubId?: string) => void;
  addComment: (postId: string, body: string) => void;

  // portfolio (paper trading)
  equityHistory: EquityPoint[];
  buy: (order: BuyOrder) => { ok: boolean; reason?: string };
  sell: (positionId: string, shares: number, price: number) => { ok: boolean; reason?: string };
  resetPortfolio: () => void;
  recordEquity: (value: number) => void;

  // notification preferences
  notifyPrefs: NotifyPrefs;
  /** Returns false when the browser denied permission for a push-style pref. */
  setNotifyPref: (key: keyof NotifyPrefs, value: boolean) => Promise<boolean>;

  // misc
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateProfile: (patch: Partial<Profile>) => void;
}

const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [snap, setSnap] = useState<Snapshot>(() => demoSnapshot());
  const [hydrated, setHydrated] = useState(false);
  const repo = useMemo(() => getRepository(), []);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recompute derived progression fields (level, badges, skills) after a
  // state change, and apply the daily rollover (hearts refill, daily resets).
  const reconcile = useCallback((s: Snapshot): Snapshot => {
    const rolled = applyChallengeRewards(rolloverDay(s, Date.now()));
    const level = levelForXp(rolled.profile.xp);
    const badges = computeBadges(rolled.profile, rolled.portfolio.positions, {
      dailyCorrect: rolled.dailyXp.correct,
    });
    const skillIds = computeSkills(rolled.profile);
    return {
      ...rolled,
      profile: { ...rolled.profile, level, badges, skills: skillIds },
    };
  }, []);

  // Hydrate from persistence once on mount.
  useEffect(() => {
    let alive = true;
    repo.load(demoSnapshot()).then((loaded) => {
      if (!alive) return;
      // Reconcile either the loaded snapshot or the in-memory demo one so the
      // daily rollover (hearts refill, dailyXp date) runs client-side.
      setSnap((s) => reconcile(loaded ?? s));
      setHydrated(true);
    });
    return () => {
      alive = false;
    };
  }, [repo, reconcile]);

  // Debounced persistence after hydration.
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => repo.save(snap), 350);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [snap, hydrated, repo]);

  const patch = useCallback((updater: (s: Snapshot) => Snapshot) => {
    setSnap((s) => updater(s));
  }, []);

  // Hearts accrue with wall-clock time, but nothing re-renders on its own while
  // the user sits on the out-of-hearts screen. Tick reconcile while below max so
  // the refill actually lands (and the countdown resolves) without a reload.
  const heartsNow = snap.profile.hearts ?? MAX_HEARTS;
  const heartsMax = snap.profile.maxHearts ?? MAX_HEARTS;
  useEffect(() => {
    if (!hydrated || heartsNow >= heartsMax) return;
    const id = setInterval(() => {
      // Returning the same reference when nothing changed avoids a re-render
      // and, with it, a pointless save every tick.
      patch((s) => {
        const next = reconcile(s);
        return next.profile.hearts === s.profile.hearts ? s : next;
      });
    }, 15_000);
    return () => clearInterval(id);
  }, [hydrated, heartsNow, heartsMax, patch, reconcile]);

  // ── Auth ─────────────────────────────────────────────────────────────────
  // Keyless demo only: hand the visitor a fresh, explorable session. This must
  // never run on a real login — it would replace the signed-in user's profile
  // with a blank "Guest" and then autosave that over their row in the database.
  const loginAsDemo = useCallback(() => {
    patch(() => reconcile({ ...demoSnapshot(), authed: true, onboarded: true }));
  }, [patch, reconcile]);

  // Real login: the Supabase session already exists, so re-read through the
  // repository, which rebuilds the snapshot from the backend for *this* user.
  const beginSession = useCallback(async () => {
    const loaded = await repo.load(demoSnapshot());
    patch((s) => reconcile(loaded ?? { ...s, authed: true }));
  }, [patch, reconcile, repo]);

  const signUp = useCallback(
    (input: SignupInput) => {
      const username = input.username.trim() || input.email.split("@")[0] || "student";
      const fresh: Profile = {
        id: input.id ?? `u-${username}-${dateKey().replace(/-/g, "")}`,
        fullName: input.fullName,
        username,
        email: input.email,
        avatarColor: "from-capital-400 to-violet-500",
        avatarUrl: input.avatarUrl,
        schoolId: input.schoolId,
        major: input.major,
        gradYear: input.gradYear,
        studentType: input.studentType,
        investingLevel: input.investingLevel,
        goal: input.goal,
        interests: input.interests,
        bio: "New to Campus Capital, learning to build wealth before I have any. 🌱",
        level: 1,
        xp: 0,
        streak: 0,
        campusRank: 0,
        nationalRank: 0,
        followers: 0,
        following: 0,
        badges: [],
        completedLessons: [],
        completedChallenges: [],
        // Club membership is earned after verification, never granted at signup.
        clubs: [],
        joinedAt: new Date().toISOString(),
        hearts: MAX_HEARTS,
        maxHearts: MAX_HEARTS,
        skills: [],
      };
      patch(() => ({
        v: SNAPSHOT_VERSION,
        authed: true,
        emailVerified: input.emailVerified ?? !isSupabaseConfigured,
        onboarded: true,
        profile: fresh,
        posts: seedPosts, // the campus feed is shared/social content
        portfolio: structuredClonePortfolio(defaultPortfolio),
        notifications: [welcomeNote(new Date().toISOString())],
        challengeProgress: {},
        lastActiveDate: null,
        equityHistory: [],
        heartsUpdatedAt: null,
        dailyXp: freshDailyXp(),
        questProgress: {},
        coachNotes: [],
        savedProjects: [],
        certificates: [],
        notifyPrefs: DEFAULT_NOTIFY,
      }));
    },
    [patch],
  );

  // Streak reminders are the one pref that needs to leave the app, so turning it
  // on asks the browser for permission. A denied prompt reports back as `false`
  // instead of leaving a switch flipped on that can never fire anything.
  const setNotifyPref = useCallback(
    async (key: keyof NotifyPrefs, value: boolean): Promise<boolean> => {
      if (value && key === "streak" && typeof window !== "undefined" && "Notification" in window) {
        const permission =
          Notification.permission === "default"
            ? await Notification.requestPermission()
            : Notification.permission;
        if (permission !== "granted") {
          patch((s) => ({ ...s, notifyPrefs: { ...s.notifyPrefs, streak: false } }));
          return false;
        }
      }
      patch((s) => ({ ...s, notifyPrefs: { ...s.notifyPrefs, [key]: value } }));
      return true;
    },
    [patch],
  );

  const completeOnboarding = useCallback(
    (input: { username: string; avatarUrl?: string }) => {
      patch((s) => ({
        ...s,
        onboarded: true,
        profile: {
          ...s.profile,
          username: input.username,
          avatarUrl: input.avatarUrl ?? s.profile.avatarUrl,
        },
      }));
    },
    [patch],
  );

  const logout = useCallback(() => {
    repo.clear();
    patch(() => demoSnapshot());
  }, [patch, repo]);

  // ── Learning: locks ────────────────────────────────────────────────────────
  const isLessonComplete = useCallback(
    (lessonId: string) => snap.profile.completedLessons.includes(lessonId),
    [snap.profile.completedLessons],
  );

  const isCourseUnlocked = useCallback(
    (courseId: string) => {
      const course = courseById(courseId);
      if (!course) return false;
      return snap.profile.level >= course.unlockLevel;
    },
    [snap.profile.level],
  );

  const isLessonUnlocked = useCallback(
    (lessonId: string) => {
      const courseLesson = courseLessonById(lessonId);
      if (!courseLesson) return false;
      const done = new Set(snap.profile.completedLessons);
      const flat = lessonsForCourse(courseLesson.courseId);
      const i = flat.findIndex((l) => l.id === lessonId);
      if (i === 0) return true; // first lesson of its course
      return i > 0 && done.has(flat[i - 1].id);
    },
    [snap.profile.completedLessons],
  );

  const skillProgress = useCallback((): SkillProgressRow[] => {
    const done = new Set(snap.profile.completedLessons);
    return skills
      .map((skill) => {
        const course = courseById(skill.courseId);
        if (!course) return null;
        const p = courseProgress(course.id, done);
        return { skill, course, pct: p.pct, done: p.done, total: p.total };
      })
      .filter((r): r is SkillProgressRow => r !== null);
  }, [snap.profile.completedLessons]);

  // ── Learning: completion ───────────────────────────────────────────────────
  const completeLesson = useCallback(
    (lessonId: string): LessonReward => {
      // There used to be a second, legacy curriculum here whose lessons awarded
      // XP and streak but cost no hearts and advanced no course or skill — a
      // heart-free XP farm reachable from search, ⌘K, Coach and the welcome
      // notification. It's gone; the course engine is the only lesson source.
      const courseLesson = courseLessonById(lessonId);
      if (!courseLesson)
        return { xpGained: 0, leveledUp: false, newBadgeIds: [], alreadyDone: true };

      const xpBonus = courseLesson.xp ?? 0;
      const minutesSpent = Math.max(3, Math.round(courseLesson.cards.length * 0.8));

      let reward: LessonReward = {
        xpGained: 0,
        leveledUp: false,
        newBadgeIds: [],
        alreadyDone: false,
      };

      patch((raw) => {
        if (raw.profile.completedLessons.includes(lessonId)) {
          reward = { xpGained: 0, leveledUp: false, newBadgeIds: [], alreadyDone: true };
          return raw;
        }
        const s = rolloverDay(raw, Date.now());
        const prevLevel = levelForXp(s.profile.xp);
        const prevBadges = new Set(s.profile.badges);

        const streak = nextStreak(s.profile.streak, s.lastActiveDate);
        const xp = s.profile.xp + xpBonus;

        // Heart-perfect lesson: finished with a full set of hearts. Sticky
        // event badge, computeBadges preserves it from profile.badges.
        const perfect =
          (s.profile.hearts ?? MAX_HEARTS) >= (s.profile.maxHearts ?? MAX_HEARTS);
        const badgesWithEvents = perfect
          ? Array.from(new Set([...s.profile.badges, "perfect-lesson"]))
          : s.profile.badges;

        const interim: Profile = {
          ...s.profile,
          xp,
          streak,
          badges: badgesWithEvents,
          completedLessons: [...s.profile.completedLessons, lessonId],
        };
        const daily: DailyXp = {
          ...s.dailyXp,
          xp: s.dailyXp.xp + xpBonus,
          lessons: s.dailyXp.lessons + 1,
          minutes: s.dailyXp.minutes + minutesSpent,
        };

        let next = reconcile(
          applyQuestProgress({
            ...s,
            profile: interim,
            dailyXp: daily,
            lastActiveDate: dateKey(),
          }),
        );

        // Course completion → certificate (idempotent per course).
        let courseCompletedId: string | undefined;
        const notes: Notification[] = [];
        if (courseLesson) {
          const course = courseById(courseLesson.courseId);
          const p = courseProgress(courseLesson.courseId, next.profile.completedLessons);
          if (course && p.total > 0 && p.done === p.total) {
            courseCompletedId = course.id;
            if (!next.certificates.some((c) => c.courseId === course.id)) {
              const cert: Certificate = {
                id: `cert-${course.id}`,
                courseId: course.id,
                title: `${course.title} Certificate`,
                earnedAt: new Date().toISOString(),
              };
              next = { ...next, certificates: [...next.certificates, cert] };
              notes.push({
                id: `cert-${course.id}-${Date.now()}`,
                type: "badge",
                title: `Course complete: ${course.title} 🎓`,
                body: "You finished every lesson. Certificate added to your profile.",
                createdAt: new Date().toISOString(),
                read: false,
                href: "/profile",
              });
            }
          }
        }

        const newBadgeIds = next.profile.badges.filter((b) => !prevBadges.has(b));
        const leveledUp = levelForXp(next.profile.xp) > prevLevel;
        reward = {
          xpGained: xpBonus,
          leveledUp,
          newBadgeIds,
          alreadyDone: false,
          unlockedLessonId: courseLesson ? nextLessonId(lessonId) : undefined,
          courseCompletedId,
        };

        // Surface notifications for level-ups and each newly-earned badge.
        if (leveledUp) {
          notes.push({
            id: `level-${levelForXp(next.profile.xp)}-${Date.now()}`,
            type: "streak",
            title: `Level up! You reached level ${levelForXp(next.profile.xp)} ⚡`,
            body: "New courses may have unlocked on your Learn path.",
            createdAt: new Date().toISOString(),
            read: false,
            href: "/learn",
          });
        }
        for (const id of newBadgeIds) {
          notes.push({
            id: `badge-${id}-${Date.now()}`,
            type: "badge",
            title: `Badge earned: ${badgeById(id)?.name ?? id}`,
            body: badgeById(id)?.description ?? "Nice work!",
            createdAt: new Date().toISOString(),
            read: false,
            href: "/profile",
          });
        }
        // The bell used to fire regardless of what the user had switched off in
        // Settings; the toggles now actually decide what gets generated.
        const allowed = notes.filter((n) => allowsNotification(next.notifyPrefs, n.type));
        return { ...next, notifications: [...allowed, ...next.notifications] };
      });

      return reward;
    },
    [patch, reconcile],
  );

  // ── Hearts + answers ───────────────────────────────────────────────────────
  // Dropping below max starts the regen clock if it isn't already running;
  // leaving an already-running clock alone means losing a second heart doesn't
  // reset the progress made toward the first one.
  function spendHeart(s: Snapshot, now: number): { next: Snapshot; remaining: number } {
    const max = s.profile.maxHearts ?? MAX_HEARTS;
    const remaining = Math.max(0, (s.profile.hearts ?? max) - 1);
    return {
      next: {
        ...s,
        heartsUpdatedAt: s.heartsUpdatedAt ?? now,
        profile: { ...s.profile, hearts: remaining, maxHearts: max },
      },
      remaining,
    };
  }

  const loseHeart = useCallback((): number => {
    let remaining = 0;
    patch((raw) => {
      const now = Date.now();
      const r = spendHeart(rolloverDay(raw, now), now);
      remaining = r.remaining;
      return r.next;
    });
    return remaining;
  }, [patch]);

  const refillHearts = useCallback(() => {
    patch((s) => ({
      ...s,
      heartsUpdatedAt: null,
      profile: { ...s.profile, hearts: s.profile.maxHearts ?? MAX_HEARTS },
    }));
  }, [patch]);

  const recordAnswer = useCallback(
    (correct: boolean, xp = 10, opts?: { practice?: boolean }): { hearts: number } => {
      let hearts = 0;
      patch((raw) => {
        const now = Date.now();
        const s = rolloverDay(raw, now);
        // Practice runs are for learning, not scoring: no hearts spent, no XP earned.
        if (opts?.practice) {
          hearts = s.profile.hearts ?? MAX_HEARTS;
          return s;
        }
        if (!correct) {
          const r = spendHeart(s, now);
          hearts = r.remaining;
          return r.next;
        }
        hearts = s.profile.hearts ?? MAX_HEARTS;
        const withXp: Snapshot = {
          ...s,
          profile: { ...s.profile, xp: s.profile.xp + xp },
          dailyXp: {
            ...s.dailyXp,
            xp: s.dailyXp.xp + xp,
            correct: s.dailyXp.correct + 1,
          },
        };
        return reconcile(applyQuestProgress(withXp));
      });
      return { hearts };
    },
    [patch, reconcile],
  );

  // ── Quests ─────────────────────────────────────────────────────────────────
  const questProgressFor = useCallback(
    (dk: string): QuestStatus[] => {
      const active = dailyQuestsFor(dk);
      return active.map((quest) => {
        const value =
          dk === snap.dailyXp.date
            ? Math.max(
                metricValue(snap.dailyXp, quest.metric),
                snap.questProgress[quest.id] ?? 0,
              )
            : 0;
        return { quest, value, done: value >= quest.goal };
      });
    },
    [snap.dailyXp, snap.questProgress],
  );

  // ── Coach notes + saved projects ───────────────────────────────────────────
  const addCoachNote = useCallback(
    (note: { title: string; body: string; topic: string }) => {
      patch((s) => ({
        ...s,
        coachNotes: [
          {
            id: `note-${Date.now()}`,
            title: note.title,
            body: note.body,
            topic: note.topic,
            createdAt: new Date().toISOString(),
          },
          ...s.coachNotes,
        ],
      }));
    },
    [patch],
  );

  const deleteCoachNote = useCallback(
    (id: string) =>
      patch((s) => ({ ...s, coachNotes: s.coachNotes.filter((n) => n.id !== id) })),
    [patch],
  );

  const saveProject = useCallback(
    (p: {
      kind: string;
      title: string;
      summary: string;
      data: Record<string, unknown>;
    }): SavedProject => {
      const project: SavedProject = {
        id: `proj-${Date.now()}`,
        kind: p.kind,
        title: p.title,
        summary: p.summary,
        createdAt: new Date().toISOString(),
        data: p.data,
      };
      patch((s) => ({ ...s, savedProjects: [project, ...s.savedProjects] }));
      return project;
    },
    [patch],
  );

  const deleteProject = useCallback(
    (id: string) =>
      patch((s) => ({
        ...s,
        savedProjects: s.savedProjects.filter((p) => p.id !== id),
      })),
    [patch],
  );

  // ── Clubs ──────────────────────────────────────────────────────────────────
  // Membership is a claim about a real person, so it requires a confirmed email
  // and is written through to `club_members` — not just held in local state.
  const joinClub = useCallback(
    async (clubId: string) => {
      if (!snap.emailVerified) return { ok: false, reason: "verify" as const };
      patch((s) =>
        s.profile.clubs.includes(clubId)
          ? s
          : { ...s, profile: { ...s.profile, clubs: [...s.profile.clubs, clubId] } },
      );
      const err = await remoteJoinClub(clubId);
      if (err) {
        // Roll the optimistic membership back rather than show a join that never landed.
        patch((s) => ({
          ...s,
          profile: { ...s.profile, clubs: s.profile.clubs.filter((c) => c !== clubId) },
        }));
        return { ok: false, reason: "error" as const, message: err };
      }
      return { ok: true as const };
    },
    [patch, snap.emailVerified],
  );

  const leaveClub = useCallback(
    async (clubId: string) => {
      patch((s) => ({
        ...s,
        profile: { ...s.profile, clubs: s.profile.clubs.filter((c) => c !== clubId) },
      }));
      await remoteLeaveClub(clubId);
      return { ok: true as const };
    },
    [patch],
  );

  const toggleClub = useCallback(
    (clubId: string) =>
      snap.profile.clubs.includes(clubId) ? leaveClub(clubId) : joinClub(clubId),
    [snap.profile.clubs, joinClub, leaveClub],
  );

  const isClubMember = useCallback(
    (clubId: string) => snap.profile.clubs.includes(clubId),
    [snap.profile.clubs],
  );

  // ── Social ─────────────────────────────────────────────────────────────────
  const toggleLike = useCallback(
    (postId: string) => {
      patch((s) => ({
        ...s,
        posts: s.posts.map((p) =>
          p.id === postId
            ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
            : p,
        ),
      }));
    },
    [patch],
  );

  const addPost = useCallback(
    (body: string, category: PostCategory, clubId?: string) => {
      patch((s) => {
        const post: Post = {
          id: `p-${Date.now()}`,
          authorId: s.profile.id,
          category,
          body,
          schoolId: s.profile.schoolId,
          clubId,
          likes: 0,
          liked: false,
          comments: [],
          createdAt: new Date().toISOString(),
        };
        return { ...s, posts: [post, ...s.posts] };
      });
    },
    [patch],
  );

  const addComment = useCallback(
    (postId: string, body: string) => {
      patch((s) => ({
        ...s,
        posts: s.posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: [
                  ...p.comments,
                  {
                    id: `c-${Date.now()}`,
                    authorId: s.profile.id,
                    body,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : p,
        ),
      }));
    },
    [patch],
  );

  // ── Portfolio (paper trading: real prices, fake money) ──────────────────────
  const buy = useCallback(
    (order: BuyOrder): { ok: boolean; reason?: string } => {
      const cost = order.shares * order.price;
      let result: { ok: boolean; reason?: string } = { ok: true };
      patch((s) => {
        if (order.shares <= 0 || order.price <= 0) {
          result = { ok: false, reason: "Enter a valid amount." };
          return s;
        }
        if (cost > s.portfolio.cash + 1e-6) {
          result = { ok: false, reason: "Not enough buying power." };
          return s;
        }
        const positions = [...s.portfolio.positions];
        const i = positions.findIndex(
          (p) => p.ticker.toUpperCase() === order.ticker.toUpperCase(),
        );
        if (i >= 0) {
          const prev = positions[i];
          const totalShares = prev.shares + order.shares;
          const avgCost = (prev.shares * prev.avgCost + cost) / totalShares;
          positions[i] = { ...prev, shares: totalShares, avgCost };
        } else {
          const pos: Position = {
            id: `pos-${Date.now()}`,
            ticker: order.ticker.toUpperCase(),
            name: order.name,
            assetType: order.assetType,
            risk: order.risk,
            shares: order.shares,
            avgCost: order.price,
            lessonId: order.lessonId,
          };
          positions.push(pos);
        }
        return reconcile({
          ...s,
          portfolio: { ...s.portfolio, cash: s.portfolio.cash - cost, positions },
        });
      });
      return result;
    },
    [patch, reconcile],
  );

  const sell = useCallback(
    (positionId: string, shares: number, price: number): { ok: boolean; reason?: string } => {
      let result: { ok: boolean; reason?: string } = { ok: true };
      patch((s) => {
        const pos = s.portfolio.positions.find((p) => p.id === positionId);
        if (!pos) {
          result = { ok: false, reason: "That position no longer exists." };
          return s;
        }
        if (shares <= 0) {
          result = { ok: false, reason: "Enter how many shares to sell." };
          return s;
        }
        // There was no price guard here, only a shares check. `priceOf` falls
        // back to avgCost, and avg_cost defaults to 0 in the schema — so a
        // position whose price resolved to 0 was liquidated for $0 of proceeds.
        if (!Number.isFinite(price) || price <= 0) {
          result = { ok: false, reason: "No price available for this ticker right now." };
          return s;
        }
        const qty = Math.min(shares, pos.shares);
        const proceeds = qty * price;
        const remaining = pos.shares - qty;
        const positions =
          remaining > 1e-6
            ? s.portfolio.positions.map((p) =>
                p.id === positionId ? { ...p, shares: remaining } : p,
              )
            : s.portfolio.positions.filter((p) => p.id !== positionId);
        return reconcile({
          ...s,
          portfolio: { ...s.portfolio, cash: s.portfolio.cash + proceeds, positions },
        });
      });
      return result;
    },
    [patch, reconcile],
  );

  const resetPortfolio = useCallback(
    () =>
      patch((s) =>
        reconcile({ ...s, portfolio: structuredClonePortfolio(defaultPortfolio), equityHistory: [] }),
      ),
    [patch, reconcile],
  );

  // Records a point on the equity curve. Throttled to one point per minute and
  // capped, so the chart shows the portfolio's real value over time.
  const recordEquity = useCallback(
    (value: number) => {
      if (!Number.isFinite(value) || value <= 0) return;
      patch((s) => {
        const last = s.equityHistory[s.equityHistory.length - 1];
        const now = Date.now();
        if (last && now - last.t < 60_000) return s;
        const next = [...s.equityHistory, { t: now, v: Math.round(value * 100) / 100 }];
        return { ...s, equityHistory: next.slice(-240) };
      });
    },
    [patch],
  );

  // ── Misc ───────────────────────────────────────────────────────────────────
  const markNotificationRead = useCallback(
    (id: string) =>
      patch((s) => ({
        ...s,
        notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      })),
    [patch],
  );
  const markAllNotificationsRead = useCallback(
    () => patch((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
    [patch],
  );
  // `setChallengeProgress` used to live here and was never called from anywhere,
  // so `challengeProgress` stayed {} for every user and no challenge ever moved.
  // Progress is now derived from real state and rewards are paid in reconcile().
  const challengeStatuses = useCallback((): ChallengeStatus[] => {
    const paid = new Set(snap.profile.completedChallenges ?? []);
    return challenges.map((challenge) => {
      const progress = challengeProgressPct(
        challenge.rule,
        snap.profile,
        snap.portfolio.positions,
      );
      return {
        challenge,
        progress,
        complete: progress >= 100,
        claimed: paid.has(challenge.id),
      };
    });
  }, [snap.profile, snap.portfolio.positions]);
  const updateProfile = useCallback(
    (p: Partial<Profile>) => patch((s) => reconcile({ ...s, profile: { ...s.profile, ...p } })),
    [patch, reconcile],
  );

  const value: AppStateValue = {
    hydrated,
    authed: snap.authed,
    profile: snap.profile,
    posts: snap.posts,
    portfolio: snap.portfolio,
    notifications: snap.notifications,
    unreadCount: snap.notifications.filter((n) => !n.read).length,
    challengeStatuses,
    dailyXp: snap.dailyXp,
    coachNotes: snap.coachNotes,
    savedProjects: snap.savedProjects,
    certificates: snap.certificates,
    emailVerified: snap.emailVerified,
    onboarded: snap.onboarded,
    loginAsDemo,
    beginSession,
    signUp,
    completeOnboarding,
    logout,
    isCourseUnlocked,
    isLessonUnlocked,
    isLessonComplete,
    completeLesson,
    skillProgress,
    hearts: heartsNow,
    maxHearts: heartsMax,
    nextHeartAt: nextHeartAt(heartsNow, heartsMax, snap.heartsUpdatedAt),
    loseHeart,
    refillHearts,
    recordAnswer,
    questProgressFor,
    addCoachNote,
    deleteCoachNote,
    saveProject,
    deleteProject,
    joinClub,
    leaveClub,
    toggleClub,
    isClubMember,
    notifyPrefs: snap.notifyPrefs,
    setNotifyPref,
    toggleLike,
    addPost,
    addComment,
    equityHistory: snap.equityHistory,
    buy,
    sell,
    resetPortfolio,
    recordEquity,
    markNotificationRead,
    markAllNotificationsRead,
    updateProfile,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within <AppStateProvider>");
  return ctx;
}
