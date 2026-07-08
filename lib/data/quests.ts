import type { DailyQuest, WeeklyGoal } from "@/lib/types";

// ── Daily quests ───────────────────────────────────────────────────────────
// The full pool. Three are active per day, chosen deterministically by
// `dailyQuestsFor(dateKey)` so server and client always agree.

export const dailyQuests: DailyQuest[] = [
  {
    id: "dq-lessons-2",
    title: "Finish 2 lessons",
    description: "Complete any 2 lessons on your path today.",
    metric: "lessons",
    goal: 2,
    xpReward: 20,
    icon: "BookOpen",
  },
  {
    id: "dq-xp-60",
    title: "Earn 60 XP",
    description: "Stack 60 XP from lessons and correct answers.",
    metric: "xp",
    goal: 60,
    xpReward: 15,
    icon: "Zap",
  },
  {
    id: "dq-correct-10",
    title: "Answer 10 correct",
    description: "Get 10 questions right, any course counts.",
    metric: "correct",
    goal: 10,
    xpReward: 15,
    icon: "Target",
  },
  {
    id: "dq-streak-keep",
    title: "Keep your streak",
    description: "Complete at least 1 lesson so the flame stays lit.",
    metric: "lessons",
    goal: 1,
    xpReward: 10,
    icon: "Flame",
  },
  {
    id: "dq-minutes-10",
    title: "Study 10 minutes",
    description: "Put in 10 focused minutes of learning today.",
    metric: "minutes",
    goal: 10,
    xpReward: 15,
    icon: "Timer",
  },
];

export const dailyQuestById = (id: string) =>
  dailyQuests.find((q) => q.id === id);

/** Small deterministic string hash (djb2), stable across server/client. */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}

/**
 * Deterministically picks 3 of the 5 daily quests for a given local date key
 * ("YYYY-MM-DD"). No Math.random / Date.now, same input, same quests.
 */
export function dailyQuestsFor(dateKey: string): DailyQuest[] {
  const n = dailyQuests.length;
  const start = hashString(dateKey) % n;
  const step = (hashString(`${dateKey}:step`) % (n - 1)) + 1; // 1..n-1, coprime-ish walk
  const picked: DailyQuest[] = [];
  const seen = new Set<number>();
  let i = start;
  while (picked.length < 3) {
    if (!seen.has(i)) {
      seen.add(i);
      picked.push(dailyQuests[i]);
    }
    i = (i + step) % n;
    if (seen.size >= n) break; // safety, can't happen with n=5
  }
  return picked;
}

// ── Weekly goals ───────────────────────────────────────────────────────────

export const weeklyGoals: WeeklyGoal[] = [
  { id: "wg-xp-300", title: "Earn 300 XP this week", metric: "xp", goal: 300, icon: "Zap" },
  { id: "wg-lessons-8", title: "Complete 8 lessons this week", metric: "lessons", goal: 8, icon: "BookOpen" },
  { id: "wg-xp-600", title: "Go big: 600 XP this week", metric: "xp", goal: 600, icon: "Trophy" },
];

export const weeklyGoalById = (id: string) =>
  weeklyGoals.find((g) => g.id === id);
