import type { ChallengeRule, Position, Profile } from "@/lib/types";
import { courses, lessonsForCourse } from "@/lib/data/courses";
import { skills } from "@/lib/data/skills";

export const XP_PER_LEVEL = 1000;

/** Level is derived from total XP so it can never disagree with XP. */
export function levelForXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpProgressInLevel(xp: number): { inLevel: number; pct: number } {
  const inLevel = xp % XP_PER_LEVEL;
  return { inLevel, pct: (inLevel / XP_PER_LEVEL) * 100 };
}

// ── Challenges ──────────────────────────────────────────────────────────────
/**
 * Resolves a challenge rule against real state. Returns 0-100.
 *
 * Challenge progress used to come from `challengeProgress`, a map that nothing
 * in the app ever wrote to, so four challenges were pinned at 0% forever and
 * none of them ever paid out the XP or badge they advertised.
 */
export function challengeProgressPct(
  rule: ChallengeRule,
  profile: Profile,
  positions: Position[],
): number {
  const pct = (done: number, target: number) =>
    target <= 0 ? 100 : Math.min(100, Math.round((done / target) * 100));

  switch (rule.kind) {
    case "lessons": {
      const done = new Set(profile.completedLessons);
      return pct(rule.ids.filter((id) => done.has(id)).length, rule.ids.length);
    }
    case "holdings": {
      const matching = positions.filter(
        (p) => !rule.assetTypes || rule.assetTypes.includes(p.assetType),
      );
      return pct(matching.length, rule.count);
    }
    case "assetTypes":
      return pct(new Set(positions.map((p) => p.assetType)).size, rule.count);
    case "streak":
      return pct(profile.streak, rule.days);
  }
}

/** Local date key (YYYY-MM-DD) for streak comparisons. */
export function dateKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ── Hearts ──────────────────────────────────────────────────────────────────
// Hearts regenerate on a timer. They used to refill only at local midnight,
// which meant one bad lesson could lock a learner out of the entire app until
// the next calendar day, with no in-app way back.
export const HEART_REGEN_MINUTES = 25;
const HEART_REGEN_MS = HEART_REGEN_MINUTES * 60_000;

/** Accrues any hearts earned since `updatedAt`. Pure; caller supplies `now`. */
export function regenerateHearts(
  hearts: number,
  maxHearts: number,
  updatedAt: number | null,
  now: number,
): { hearts: number; updatedAt: number | null } {
  if (hearts >= maxHearts) return { hearts, updatedAt: null };
  // First tick below max starts the clock.
  if (updatedAt === null) return { hearts, updatedAt: now };
  const earned = Math.floor((now - updatedAt) / HEART_REGEN_MS);
  if (earned <= 0) return { hearts, updatedAt };
  const next = Math.min(maxHearts, hearts + earned);
  if (next >= maxHearts) return { hearts: next, updatedAt: null };
  // Carry the remainder forward so partial progress to the next heart survives.
  return { hearts: next, updatedAt: updatedAt + (next - hearts) * HEART_REGEN_MS };
}

/** Epoch ms when the next heart lands, or null when already full. */
export function nextHeartAt(
  hearts: number,
  maxHearts: number,
  updatedAt: number | null,
): number | null {
  if (hearts >= maxHearts || updatedAt === null) return null;
  return updatedAt + HEART_REGEN_MS;
}

/** Returns the next streak value given the last active date. */
export function nextStreak(current: number, lastActive: string | null): number {
  const today = dateKey();
  if (lastActive === today) return current; // already counted today
  if (!lastActive) return Math.max(1, current);
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (lastActive === dateKey(y)) return current + 1; // consecutive day
  return 1; // streak broken, restart
}

/** Per-course completion from a set of completed lesson ids. */
export function courseProgress(
  courseId: string,
  completed: string[] | Set<string>,
): { done: number; total: number; pct: number } {
  const doneSet = completed instanceof Set ? completed : new Set(completed);
  const all = lessonsForCourse(courseId);
  const done = all.filter((l) => doneSet.has(l.id)).length;
  const total = all.length;
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

/** Alias for {@link courseProgress}, same semantics, spec-contract name. */
export const courseCompletion = courseProgress;

/**
 * Skill ids the user has started: one skill per course, earned by completing
 * at least one lesson in that course.
 */
export function computeSkills(profile: Profile): string[] {
  const done = new Set(profile.completedLessons);
  return skills
    .filter((s) => lessonsForCourse(s.courseId).some((l) => done.has(l.id)))
    .map((s) => s.id);
}

/**
 * Extra signals for badges that can't be derived from persistent state alone.
 * Event badges (perfect-lesson) are "sticky": once present in profile.badges
 * they are preserved across recomputes.
 */
export interface BadgeSignals {
  /** Correct answers today (from dailyXp.correct). */
  dailyCorrect?: number;
}

const STICKY_BADGE_IDS = new Set(["perfect-lesson", "quiz-ace"]);

/**
 * Recomputes the full set of earned badge ids from the user's real state.
 * This is the single source of truth for badges, no hardcoded awards.
 */
export function computeBadges(
  profile: Profile,
  positions: Position[],
  signals?: BadgeSignals,
): string[] {
  const done = new Set(profile.completedLessons);
  const earned = new Set<string>();

  // ── Topic badges ──────────────────────────────────────────────────────────
  // Each of these was gated ONLY on an id from the old curriculum, which has
  // since been removed. That made five badges permanently unearnable for anyone
  // on the course path, i.e. everyone.
  //
  // Each rule now accepts the course lesson OR the retired legacy id. The legacy
  // arm is a grandfather clause: badges recompute from scratch on every load and
  // are not sticky, so dropping it would silently revoke badges from users who
  // earned them before the old lessons were removed.
  const any = (...ids: string[]) => ids.some((id) => done.has(id));
  const all = (...ids: string[]) => ids.every((id) => done.has(id));

  if (done.size >= 1) earned.add("first-lesson");
  // ETFs, Index Funds & Mutual Funds
  if (any("investing-u1-l2") || all("etfs", "index-funds")) earned.add("etf-explorer");
  // Compound Growth: Time Is Your Superpower
  if (any("investing-u3-l1", "compound-interest")) earned.add("compound-king");
  // Unit 1 Challenge: Build a Budget
  if (any("money-basics-u1-l4", "budgeting-college")) earned.add("budget-builder");
  // The Roth IRA for Students
  if (any("investing-u3-l2", "roth-ira")) earned.add("roth-rookie");
  // Diversification + Asset Allocation
  if (all("investing-u2-l1", "investing-u2-l2") || all("risk-explained", "portfolio-allocation"))
    earned.add("risk-manager");

  if (profile.streak >= 7) earned.add("streak-7");
  if (profile.streak >= 30) earned.add("streak-30");
  // campusRank was hardcoded to 0 and never assigned anywhere, so this badge was
  // structurally unreachable. The leaderboard now writes the real rank back.
  if (profile.campusRank > 0 && profile.campusRank <= 10) earned.add("campus-top-10");

  const assetTypes = new Set(positions.map((p) => p.assetType));
  if (assetTypes.size >= 4) earned.add("diversified");

  // ── Course-engine badges ─────────────────────────────────────────────────
  const completedCourseIds = courses
    .filter((c) => {
      const all = lessonsForCourse(c.id);
      return all.length > 0 && all.every((l) => done.has(l.id));
    })
    .map((c) => c.id);

  if (completedCourseIds.length >= 1) earned.add("first-course");

  const completedCourses = new Set(completedCourseIds);
  const categoryDone = (category: string) => {
    const inCat = courses.filter((c) => c.category === category);
    return inCat.length > 0 && inCat.every((c) => completedCourses.has(c.id));
  };
  if (categoryDone("Money")) earned.add("money-master");
  if (categoryDone("Investing")) earned.add("investing-master");
  if (categoryDone("Startups")) earned.add("startup-master");
  if (categoryDone("Career")) earned.add("career-master");

  const level = levelForXp(profile.xp);
  if (level >= 5) earned.add("level-5");
  if (level >= 10) earned.add("level-10");

  if (positions.length >= 1) earned.add("first-trade");

  if ((signals?.dailyCorrect ?? 0) >= 10) earned.add("quiz-ace");

  // Sticky event badges: keep any previously-earned one (e.g. perfect-lesson,
  // quiz-ace on a later day) that can't be re-derived from persistent state.
  for (const id of profile.badges) {
    if (STICKY_BADGE_IDS.has(id)) earned.add(id);
  }

  return Array.from(earned);
}

