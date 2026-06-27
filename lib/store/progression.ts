import type { Position, Profile } from "@/lib/types";
import { lessons } from "@/lib/data/lessons";

export const XP_PER_LEVEL = 1000;

/** Level is derived from total XP so it can never disagree with XP. */
export function levelForXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpProgressInLevel(xp: number): { inLevel: number; pct: number } {
  const inLevel = xp % XP_PER_LEVEL;
  return { inLevel, pct: (inLevel / XP_PER_LEVEL) * 100 };
}

/** Local date key (YYYY-MM-DD) for streak comparisons. */
export function dateKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Returns the next streak value given the last active date. */
export function nextStreak(current: number, lastActive: string | null): number {
  const today = dateKey();
  if (lastActive === today) return current; // already counted today
  if (!lastActive) return Math.max(1, current);
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (lastActive === dateKey(y)) return current + 1; // consecutive day
  return 1; // streak broken — restart
}

/**
 * Recomputes the full set of earned badge ids from the user's real state.
 * This is the single source of truth for badges — no hardcoded awards.
 */
export function computeBadges(profile: Profile, positions: Position[]): string[] {
  const done = new Set(profile.completedLessons);
  const earned = new Set<string>();

  if (done.size >= 1) earned.add("first-lesson");
  if (done.has("etfs") && done.has("index-funds")) earned.add("etf-explorer");
  if (done.has("compound-interest")) earned.add("compound-king");
  if (done.has("budgeting-college")) earned.add("budget-builder");
  if (done.has("roth-ira")) earned.add("roth-rookie");
  if (done.has("risk-explained") && done.has("portfolio-allocation"))
    earned.add("risk-manager");
  if (profile.streak >= 7) earned.add("streak-7");
  if (profile.streak >= 30) earned.add("streak-30");
  if (profile.campusRank > 0 && profile.campusRank <= 10) earned.add("campus-top-10");

  const assetTypes = new Set(positions.map((p) => p.assetType));
  if (assetTypes.size >= 4) earned.add("diversified");

  return Array.from(earned);
}

export const TOTAL_LESSON_XP = lessons.reduce((s, l) => s + l.xp, 0);
export const TOTAL_LESSONS = lessons.length;
