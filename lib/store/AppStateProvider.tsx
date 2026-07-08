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
  Course,
  DailyQuest,
  Interest,
  InvestingLevel,
  Notification,
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
import { currentUser as demoPersona } from "@/lib/data/people";
import { posts as seedPosts } from "@/lib/data/posts";
import { defaultPortfolio } from "@/lib/data/portfolio";
import { lessonById, lessons } from "@/lib/data/lessons";
import { badgeById } from "@/lib/data/badges";
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
  computeBadges,
  computeSkills,
  courseProgress,
  dateKey,
  levelForXp,
  nextStreak,
} from "./progression";
import {
  getRepository,
  SNAPSHOT_VERSION,
  type DailyXp,
  type Snapshot,
  type EquityPoint,
} from "./repository";

export const MAX_HEARTS = 5;

// A single honest welcome notification (no fabricated social/rank events).
function welcomeNote(createdAt: string): Notification {
  return {
    id: "welcome",
    type: "lesson",
    title: "Welcome to Campus Capital 🎉",
    body: "Start with “What is investing, really?” to earn your first badge.",
    createdAt,
    read: false,
    href: "/learn/what-is-investing",
  };
}

function freshDailyXp(date = dateKey()): DailyXp {
  return { date, xp: 0, correct: 0, lessons: 0, minutes: 0 };
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
    profile: freshDemoProfile(),
    posts: seedPosts,
    portfolio: structuredClonePortfolio(defaultPortfolio),
    notifications: [welcomeNote("2026-01-05T17:00:00.000Z")],
    challengeProgress: {},
    lastActiveDate: null,
    equityHistory: [],
    heartsLastRefill: null,
    dailyXp: freshDailyXp("1970-01-01"),
    questProgress: {},
    coachNotes: [],
    savedProjects: [],
    rsvps: [],
    certificates: [],
  };
}

function structuredClonePortfolio(p: Portfolio): Portfolio {
  return { ...p, positions: p.positions.map((h) => ({ ...h })) };
}

// ── Daily rollover (pure) ──────────────────────────────────────────────────
// On a new local day: hearts refill to max, dailyXp counters and quest
// progress reset. Idempotent, applied during hydrate and on every reconcile.
function rolloverDay(s: Snapshot): Snapshot {
  const today = dateKey();
  let next = s;
  if (s.dailyXp.date !== today) {
    next = { ...next, dailyXp: freshDailyXp(today), questProgress: {} };
  }
  if (s.heartsLastRefill !== today) {
    next = {
      ...next,
      heartsLastRefill: today,
      profile: {
        ...next.profile,
        hearts: next.profile.maxHearts ?? MAX_HEARTS,
        maxHearts: next.profile.maxHearts ?? MAX_HEARTS,
      },
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
  fullName: string;
  email: string;
  schoolId: string;
  major: string;
  gradYear: number;
  studentType: StudentType;
  investingLevel: InvestingLevel;
  goal: Goal;
  interests: Interest[];
  clubId?: string | null;
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
  challengeProgress: Record<string, number>;
  dailyXp: DailyXp;
  coachNotes: CoachNote[];
  savedProjects: SavedProject[];
  rsvps: string[];
  certificates: Certificate[];

  // auth
  loginAsDemo: () => void;
  signUp: (input: SignupInput) => void;
  logout: () => void;

  // learning
  isCourseUnlocked: (courseId: string) => boolean;
  isLessonUnlocked: (lessonId: string) => boolean;
  isLessonComplete: (lessonId: string) => boolean;
  completeLesson: (lessonId: string) => LessonReward;
  skillProgress: () => SkillProgressRow[];

  // hearts + answers
  hearts: number;
  loseHeart: () => number;
  refillHearts: () => void;
  recordAnswer: (correct: boolean, xp?: number) => { hearts: number };

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

  // campus + clubs
  toggleRsvp: (eventId: string) => void;
  hasRsvp: (eventId: string) => boolean;
  joinClub: (clubId: string) => void;
  leaveClub: (clubId: string) => void;
  toggleClub: (clubId: string) => void;
  isClubMember: (clubId: string) => boolean;

  // social
  toggleLike: (postId: string) => void;
  addPost: (body: string, category: PostCategory, clubId?: string) => void;
  addComment: (postId: string, body: string) => void;

  // portfolio (paper trading)
  equityHistory: EquityPoint[];
  buy: (order: BuyOrder) => { ok: boolean; reason?: string };
  sell: (positionId: string, shares: number, price: number) => void;
  resetPortfolio: () => void;
  recordEquity: (value: number) => void;

  // misc
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setChallengeProgress: (id: string, value: number) => void;
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
    const rolled = rolloverDay(s);
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
    repo.load().then((loaded) => {
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

  // ── Auth ─────────────────────────────────────────────────────────────────
  const loginAsDemo = useCallback(() => {
    patch(() => reconcile({ ...demoSnapshot(), authed: true }));
  }, [patch, reconcile]);

  const signUp = useCallback(
    (input: SignupInput) => {
      const username = input.email.split("@")[0] || "student";
      const fresh: Profile = {
        id: `u-${username}-${dateKey().replace(/-/g, "")}`,
        fullName: input.fullName,
        username,
        email: input.email,
        avatarColor: "from-capital-400 to-violet-500",
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
        clubs: input.clubId ? [input.clubId] : [],
        joinedAt: new Date().toISOString(),
        hearts: MAX_HEARTS,
        maxHearts: MAX_HEARTS,
        skills: [],
      };
      patch(() => ({
        v: SNAPSHOT_VERSION,
        authed: true,
        profile: fresh,
        posts: seedPosts, // the campus feed is shared/social content
        portfolio: structuredClonePortfolio(defaultPortfolio),
        notifications: [welcomeNote(new Date().toISOString())],
        challengeProgress: {},
        lastActiveDate: null,
        equityHistory: [],
        heartsLastRefill: dateKey(),
        dailyXp: freshDailyXp(),
        questProgress: {},
        coachNotes: [],
        savedProjects: [],
        rsvps: [],
        certificates: [],
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
      const done = new Set(snap.profile.completedLessons);
      const courseLesson = courseLessonById(lessonId);
      if (courseLesson) {
        const flat = lessonsForCourse(courseLesson.courseId);
        const i = flat.findIndex((l) => l.id === lessonId);
        if (i === 0) return true; // first lesson of its course
        return i > 0 && done.has(flat[i - 1].id);
      }
      // Legacy path lessons: sequential unlock in authored order.
      const li = lessons.findIndex((l) => l.id === lessonId);
      if (li === 0) return true;
      return li > 0 && done.has(lessons[li - 1].id);
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
      const legacy = lessonById(lessonId);
      const courseLesson = courseLessonById(lessonId);
      if (!legacy && !courseLesson)
        return { xpGained: 0, leveledUp: false, newBadgeIds: [], alreadyDone: true };

      const xpBonus = courseLesson?.xp ?? legacy?.xp ?? 0;
      const minutesSpent =
        legacy?.minutes ??
        Math.max(3, Math.round((courseLesson?.cards.length ?? 5) * 0.8));

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
        const s = rolloverDay(raw);
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
        return { ...next, notifications: [...notes, ...next.notifications] };
      });

      return reward;
    },
    [patch, reconcile],
  );

  // ── Hearts + answers ───────────────────────────────────────────────────────
  const loseHeart = useCallback((): number => {
    let remaining = 0;
    patch((raw) => {
      const s = rolloverDay(raw);
      const current = s.profile.hearts ?? MAX_HEARTS;
      remaining = Math.max(0, current - 1);
      return { ...s, profile: { ...s.profile, hearts: remaining } };
    });
    return remaining;
  }, [patch]);

  const refillHearts = useCallback(() => {
    patch((s) => ({
      ...s,
      heartsLastRefill: dateKey(),
      profile: { ...s.profile, hearts: s.profile.maxHearts ?? MAX_HEARTS },
    }));
  }, [patch]);

  const recordAnswer = useCallback(
    (correct: boolean, xp = 10): { hearts: number } => {
      let hearts = 0;
      patch((raw) => {
        const s = rolloverDay(raw);
        if (!correct) {
          const remaining = Math.max(0, (s.profile.hearts ?? MAX_HEARTS) - 1);
          hearts = remaining;
          return { ...s, profile: { ...s.profile, hearts: remaining } };
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

  // ── Campus events + clubs ──────────────────────────────────────────────────
  const toggleRsvp = useCallback(
    (eventId: string) =>
      patch((s) => ({
        ...s,
        rsvps: s.rsvps.includes(eventId)
          ? s.rsvps.filter((id) => id !== eventId)
          : [...s.rsvps, eventId],
      })),
    [patch],
  );

  const hasRsvp = useCallback(
    (eventId: string) => snap.rsvps.includes(eventId),
    [snap.rsvps],
  );

  const joinClub = useCallback(
    (clubId: string) =>
      patch((s) =>
        s.profile.clubs.includes(clubId)
          ? s
          : { ...s, profile: { ...s.profile, clubs: [...s.profile.clubs, clubId] } },
      ),
    [patch],
  );

  const leaveClub = useCallback(
    (clubId: string) =>
      patch((s) => ({
        ...s,
        profile: { ...s.profile, clubs: s.profile.clubs.filter((c) => c !== clubId) },
      })),
    [patch],
  );

  const toggleClub = useCallback(
    (clubId: string) =>
      patch((s) => ({
        ...s,
        profile: {
          ...s.profile,
          clubs: s.profile.clubs.includes(clubId)
            ? s.profile.clubs.filter((c) => c !== clubId)
            : [...s.profile.clubs, clubId],
        },
      })),
    [patch],
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
    (positionId: string, shares: number, price: number) => {
      patch((s) => {
        const pos = s.portfolio.positions.find((p) => p.id === positionId);
        if (!pos || shares <= 0) return s;
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
  const setChallengeProgress = useCallback(
    (id: string, value: number) =>
      patch((s) => ({ ...s, challengeProgress: { ...s.challengeProgress, [id]: value } })),
    [patch],
  );
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
    challengeProgress: snap.challengeProgress,
    dailyXp: snap.dailyXp,
    coachNotes: snap.coachNotes,
    savedProjects: snap.savedProjects,
    rsvps: snap.rsvps,
    certificates: snap.certificates,
    loginAsDemo,
    signUp,
    logout,
    isCourseUnlocked,
    isLessonUnlocked,
    isLessonComplete,
    completeLesson,
    skillProgress,
    hearts: snap.profile.hearts ?? MAX_HEARTS,
    loseHeart,
    refillHearts,
    recordAnswer,
    questProgressFor,
    addCoachNote,
    deleteCoachNote,
    saveProject,
    deleteProject,
    toggleRsvp,
    hasRsvp,
    joinClub,
    leaveClub,
    toggleClub,
    isClubMember,
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
    setChallengeProgress,
    updateProfile,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within <AppStateProvider>");
  return ctx;
}
