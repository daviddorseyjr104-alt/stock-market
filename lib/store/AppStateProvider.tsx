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
  Interest,
  InvestingLevel,
  Notification,
  Portfolio,
  Position,
  Post,
  PostCategory,
  Profile,
  RiskLabel,
  StudentType,
} from "@/lib/types";
import { currentUser as demoPersona } from "@/lib/data/people";
import { posts as seedPosts } from "@/lib/data/posts";
import { notifications as seedNotifications } from "@/lib/data/notifications";
import { defaultPortfolio } from "@/lib/data/portfolio";
import { lessonById } from "@/lib/data/lessons";
import { badgeById } from "@/lib/data/badges";
import {
  computeBadges,
  dateKey,
  levelForXp,
  nextStreak,
} from "./progression";
import { getRepository, type Snapshot } from "./repository";

// ── Default (demo) snapshot, deterministic, SSR-safe ──────────────────────
function demoSnapshot(): Snapshot {
  return {
    v: 1,
    authed: false,
    profile: { ...demoPersona, level: levelForXp(demoPersona.xp) },
    posts: seedPosts,
    portfolio: structuredClonePortfolio(defaultPortfolio),
    notifications: seedNotifications,
    challengeProgress: {},
    lastActiveDate: null,
  };
}

function structuredClonePortfolio(p: Portfolio): Portfolio {
  return { ...p, positions: p.positions.map((h) => ({ ...h })) };
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

  // auth
  loginAsDemo: () => void;
  signUp: (input: SignupInput) => void;
  logout: () => void;

  // learning
  isLessonComplete: (lessonId: string) => boolean;
  completeLesson: (lessonId: string) => LessonReward;

  // social
  toggleLike: (postId: string) => void;
  addPost: (body: string, category: PostCategory, clubId?: string) => void;
  addComment: (postId: string, body: string) => void;

  // portfolio (paper trading)
  buy: (order: BuyOrder) => { ok: boolean; reason?: string };
  sell: (positionId: string, shares: number, price: number) => void;
  resetPortfolio: () => void;

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

  // Hydrate from persistence once on mount.
  useEffect(() => {
    let alive = true;
    repo.load().then((loaded) => {
      if (!alive) return;
      if (loaded) setSnap(loaded);
      setHydrated(true);
    });
    return () => {
      alive = false;
    };
  }, [repo]);

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

  // Recompute derived progression fields (level, badges) after a state change.
  const reconcile = useCallback((s: Snapshot): Snapshot => {
    const level = levelForXp(s.profile.xp);
    const badges = computeBadges(s.profile, s.portfolio.positions);
    return { ...s, profile: { ...s.profile, level, badges } };
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────────────
  const loginAsDemo = useCallback(() => {
    patch(() => ({ ...demoSnapshot(), authed: true }));
  }, [patch]);

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
      };
      patch(() => ({
        v: 1,
        authed: true,
        profile: fresh,
        posts: seedPosts, // the campus feed is shared/social content
        portfolio: structuredClonePortfolio(defaultPortfolio),
        notifications: [
          {
            id: "welcome",
            type: "lesson",
            title: "Welcome to Campus Capital 🎉",
            body: "Start with “What is investing, really?” to earn your first badge.",
            createdAt: new Date().toISOString(),
            read: false,
            href: "/learn/what-is-investing",
          },
        ],
        challengeProgress: {},
        lastActiveDate: null,
      }));
    },
    [patch],
  );

  const logout = useCallback(() => {
    repo.clear();
    patch(() => demoSnapshot());
  }, [patch, repo]);

  // ── Learning ───────────────────────────────────────────────────────────────
  const isLessonComplete = useCallback(
    (lessonId: string) => snap.profile.completedLessons.includes(lessonId),
    [snap.profile.completedLessons],
  );

  const completeLesson = useCallback(
    (lessonId: string): LessonReward => {
      const lesson = lessonById(lessonId);
      if (!lesson) return { xpGained: 0, leveledUp: false, newBadgeIds: [], alreadyDone: true };

      let reward: LessonReward = {
        xpGained: 0,
        leveledUp: false,
        newBadgeIds: [],
        alreadyDone: false,
      };

      patch((s) => {
        if (s.profile.completedLessons.includes(lessonId)) {
          reward = { xpGained: 0, leveledUp: false, newBadgeIds: [], alreadyDone: true };
          return s;
        }
        const prevLevel = levelForXp(s.profile.xp);
        const prevBadges = new Set(s.profile.badges);

        const streak = nextStreak(s.profile.streak, s.lastActiveDate);
        const xp = s.profile.xp + lesson.xp;
        const interim: Profile = {
          ...s.profile,
          xp,
          streak,
          completedLessons: [...s.profile.completedLessons, lessonId],
        };
        const next = reconcile({ ...s, profile: interim, lastActiveDate: dateKey() });

        const newBadgeIds = next.profile.badges.filter((b) => !prevBadges.has(b));
        reward = {
          xpGained: lesson.xp,
          leveledUp: levelForXp(xp) > prevLevel,
          newBadgeIds,
          alreadyDone: false,
        };

        // Surface a notification for each newly-earned badge.
        const badgeNotes: Notification[] = newBadgeIds.map((id) => ({
          id: `badge-${id}-${Date.now()}`,
          type: "badge",
          title: `Badge earned: ${badgeById(id)?.name ?? id}`,
          body: badgeById(id)?.description ?? "Nice work!",
          createdAt: new Date().toISOString(),
          read: false,
          href: "/profile",
        }));
        return { ...next, notifications: [...badgeNotes, ...next.notifications] };
      });

      return reward;
    },
    [patch, reconcile],
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
    () => patch((s) => reconcile({ ...s, portfolio: structuredClonePortfolio(defaultPortfolio) })),
    [patch, reconcile],
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
    loginAsDemo,
    signUp,
    logout,
    isLessonComplete,
    completeLesson,
    toggleLike,
    addPost,
    addComment,
    buy,
    sell,
    resetPortfolio,
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
