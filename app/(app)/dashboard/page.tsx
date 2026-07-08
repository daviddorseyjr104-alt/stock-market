"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Bot,
  CalendarCheck,
  Flame,
  Heart,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { ProgressBar, RingProgress } from "@/components/ui/Progress";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton, CardSkeleton } from "@/components/ui/Skeleton";
import { Reveal } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { XPBadge } from "@/components/game/XPBadge";
import { HeartCounter } from "@/components/game/HeartCounter";
import { StreakCard } from "@/components/game/StreakCard";
import { DailyQuestCard } from "@/components/dashboard/DailyQuestCard";
import { SkillProgressCard } from "@/components/dashboard/SkillProgressCard";
import { NextLessonHero } from "@/components/dashboard/NextLessonHero";
import { StreakMilestone } from "@/components/dashboard/StreakMilestone";
import {
  allCourseLessons,
  courseById,
  courseLessonById,
} from "@/lib/data/courses";
import { badgeById } from "@/lib/data/badges";
import { schoolById } from "@/lib/data/schools";
import type { Notification } from "@/lib/types";
import {
  useAppState,
  levelForXp,
  xpProgressInLevel,
  dateKey,
  MAX_HEARTS,
  XP_PER_LEVEL,
} from "@/lib/store";
import { cn, timeAgo } from "@/lib/utils";

/** Daily XP target for the goal ring. */
const DAILY_GOAL_XP = 50;

function icon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;
}

// A single item in the derived "Recent activity" stream.
type Activity = {
  id: string;
  icon: LucideIcon;
  title: string;
  meta: string;
  when: number; // epoch ms for sorting
  href: string;
};

export default function DashboardPage() {
  const {
    hydrated,
    profile,
    dailyXp,
    hearts,
    notifications,
    savedProjects,
    certificates,
    isLessonComplete,
    isLessonUnlocked,
    questProgressFor,
    skillProgress,
  } = useAppState();

  // Hydration-safe greeting: SSR + first client render use a stable default,
  // then the time-of-day greeting swaps in after mount (belt-and-braces on top
  // of the `hydrated` gate below, which already keeps this client-only).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const greeting = mounted ? timeGreeting() : "Welcome back";

  const isGuest = profile.username === "guest";
  const firstName = profile.fullName.split(" ")[0];
  const level = levelForXp(profile.xp);
  const { inLevel, pct } = xpProgressInLevel(profile.xp);
  const school = schoolById(profile.schoolId);
  const started = profile.completedLessons.length > 0;

  // Next best action, first incomplete UNLOCKED lesson in course order.
  const nextLesson = useMemo(() => {
    for (const l of allCourseLessons) {
      if (!isLessonComplete(l.id) && isLessonUnlocked(l.id)) return l;
    }
    return undefined;
  }, [isLessonComplete, isLessonUnlocked]);

  // Daily quests for today.
  const quests = useMemo(() => questProgressFor(dateKey()), [questProgressFor]);

  // Skill progress.
  const skills = useMemo(() => skillProgress(), [skillProgress]);

  // Recent earned badges (newest first).
  const earnedBadges = useMemo(
    () =>
      [...profile.badges]
        .map((id) => badgeById(id))
        .filter((b): b is NonNullable<typeof b> => Boolean(b))
        .reverse()
        .slice(0, 6),
    [profile.badges],
  );

  // Recent activity, real notifications + completed lessons + saved projects.
  const activity = useMemo<Activity[]>(() => {
    const items: Activity[] = [];
    for (const n of notifications as Notification[]) {
      const t = new Date(n.createdAt).getTime();
      items.push({
        id: `n-${n.id}`,
        icon: n.type === "badge" ? Award : n.type === "streak" ? Flame : Sparkles,
        title: n.title,
        meta: n.body,
        when: Number.isFinite(t) ? t : 0,
        href: n.href ?? "/notifications",
      });
    }
    for (const l of profile.completedLessons) {
      const cl = courseLessonById(l);
      if (!cl) continue;
      const course = courseById(cl.courseId);
      items.push({
        id: `l-${l}`,
        icon: BookOpen,
        title: `Completed “${cl.title}”`,
        meta: `${course?.title ?? "Course"} · +${cl.xp} XP`,
        when: 0, // no timestamp stored; ordered after timestamped items
        href: `/learn/lesson/${l}`,
      });
    }
    for (const p of savedProjects) {
      const t = new Date(p.createdAt).getTime();
      items.push({
        id: `p-${p.id}`,
        icon: Icons.FolderKanban,
        title: `Saved “${p.title}”`,
        meta: p.summary,
        when: Number.isFinite(t) ? t : 0,
        href: "/profile",
      });
    }
    return items.sort((a, b) => b.when - a.when).slice(0, 6);
  }, [notifications, profile.completedLessons, savedProjects]);

  if (!hydrated) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      {/* Streak milestone celebration, only fires on real streak values */}
      <StreakMilestone streak={profile.streak} />

      {/* Dynamic greeting */}
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-white/45">
              {school?.shortName ?? "Campus"} · {profile.major}
            </p>
            <h1 className="mt-0.5 font-display text-3xl font-bold tracking-tight text-white">
              {greeting}
              {!isGuest && (
                <>
                  , <span className="text-gradient-capital">{firstName}</span>
                </>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <XPBadge value={profile.xp} />
            <HeartCounter hearts={hearts} max={profile.maxHearts ?? MAX_HEARTS} />
          </div>
        </div>
      </Reveal>

      {/* Next-best-action hero + animated daily goal ring */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal delay={0.05} className="lg:col-span-2">
          <NextLessonHero lesson={nextLesson} started={started} />
        </Reveal>
        <Reveal delay={0.1} className="h-full">
          <DailyGoalCard xpToday={dailyXp.xp} lessonsToday={dailyXp.lessons} correctToday={dailyXp.correct} />
        </Reveal>
      </div>

      {/* Momentum row */}
      <Reveal delay={0.1}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StreakCard streak={profile.streak} className="h-full" />
          <StatCard
            label="Level"
            value={
              <span className="flex items-baseline gap-2">
                <AnimatedNumber value={level} />
                <span className="text-xs font-medium text-white/40">
                  {inLevel}/{XP_PER_LEVEL} XP
                </span>
              </span>
            }
            sub={<ProgressBar value={pct} className="mt-1.5 h-1.5" />}
            icon={<TrendingUp className="h-4 w-4" />}
            tone="capital"
          />
          <StatCard
            label="Total XP"
            value={<AnimatedNumber value={profile.xp} />}
            sub="Lifetime earned"
            icon={<Zap className="h-4 w-4" fill="currentColor" />}
            tone="violet"
          />
          <StatCard
            label="Hearts"
            value={<HeartCounter hearts={hearts} max={profile.maxHearts ?? MAX_HEARTS} />}
            sub="Refill every day"
            icon={<Heart className="h-4 w-4" fill="currentColor" />}
            tone="rose"
          />
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left + center */}
        <div className="space-y-6 lg:col-span-2">
          {/* Daily quests */}
          <Reveal delay={0.05}>
            <Card hover>
              <CardHeader
                title="Daily quests"
                subtitle="Reset every day · earn bonus XP"
                icon={<Target className="h-4 w-4" />}
                action={
                  <Pill tone="capital">
                    {quests.filter((q) => q.done).length}/{quests.length} done
                  </Pill>
                }
              />
              <div className="space-y-2.5">
                {quests.map((q) => (
                  <DailyQuestCard key={q.quest.id} quest={q.quest} value={q.value} done={q.done} />
                ))}
              </div>
            </Card>
          </Reveal>

          {/* Skill progress */}
          <Reveal delay={0.1}>
            <Card>
              <CardHeader
                title="Skill progress"
                subtitle="Your mastery across all 8 courses"
                icon={<Sparkles className="h-4 w-4" />}
                action={
                  <Link href="/learn" className="text-sm text-capital-300 hover:underline">
                    All courses →
                  </Link>
                }
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {skills.map((row) => (
                  <SkillProgressCard key={row.skill.id} row={row} />
                ))}
              </div>
            </Card>
          </Reveal>

          {/* Recent activity */}
          <Reveal delay={0.15}>
            <Card>
              <CardHeader
                title="Recent activity"
                subtitle="Your latest wins"
                icon={<CalendarCheck className="h-4 w-4" />}
              />
              {activity.length > 0 ? (
                <div className="space-y-1">
                  {activity.map((a) => {
                    const Ic = a.icon;
                    return (
                      <Link
                        key={a.id}
                        href={a.href}
                        className="flex items-start gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-white/[0.03]"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 text-capital-300">
                          <Ic className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-white">{a.title}</p>
                          <p className="truncate text-xs text-white/45">{a.meta}</p>
                        </div>
                        {a.when > 0 && (
                          <span className="shrink-0 text-xs text-white/35">
                            {timeAgo(new Date(a.when).toISOString())}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={<Sparkles className="h-7 w-7" />}
                  title="Nothing here yet"
                  description="Your wins, finished lessons, badges, saved projects, will show up here as you go."
                  action={
                    <Button href="/learn" size="sm">
                      Finish your first lesson <ArrowRight className="h-4 w-4" />
                    </Button>
                  }
                />
              )}
            </Card>
          </Reveal>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          {/* Honest campus standing, no fabricated ranks */}
          <Reveal delay={0.05}>
            <Card hover glow>
              <CardHeader
                title="Campus standing"
                subtitle="Real progress only"
                icon={<Trophy className="h-4 w-4" />}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-3.5 py-3">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                    Your XP
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-gradient-capital">
                    <AnimatedNumber value={profile.xp} />
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-3.5 py-3">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                    Streak
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-white">
                    <AnimatedNumber value={profile.streak} />
                    <span className="ml-1 text-sm font-semibold text-white/50">
                      day{profile.streak === 1 ? "" : "s"}
                    </span>
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                You&apos;re building your standing, every lesson counts. Invite your
                campus and climb together.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button href="/leaderboards" variant="secondary" size="sm" className="w-full">
                  See leaderboards <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/campus" variant="ghost" size="sm" className="w-full">
                  Invite your campus
                </Button>
              </div>
            </Card>
          </Reveal>

          {/* Achievements */}
          <Reveal delay={0.1}>
            <Card hover>
              <CardHeader
                title="Achievements"
                subtitle={`${profile.badges.length} badge${profile.badges.length === 1 ? "" : "s"} earned`}
                icon={<Award className="h-4 w-4" />}
                action={
                  <Link href="/profile" className="text-sm text-capital-300 hover:underline">
                    View all →
                  </Link>
                }
              />
              {earnedBadges.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {earnedBadges.map((b) => {
                    const Ic = icon(b.icon);
                    return (
                      <Link
                        key={b.id}
                        href="/profile"
                        className="group flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.02] px-2 py-3 text-center transition-colors hover:border-white/15"
                        title={b.description}
                      >
                        <span
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br text-ink-950 shadow-card",
                            b.color,
                          )}
                        >
                          <Ic className="h-5 w-5" />
                        </span>
                        <span className="line-clamp-2 text-[11px] font-medium leading-tight text-white/70 group-hover:text-white">
                          {b.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-center">
                  <p className="text-sm text-white/55">No badges yet.</p>
                  <Link
                    href="/learn"
                    className="mt-1 inline-block text-sm font-semibold text-capital-300 hover:underline"
                  >
                    Earn your first →
                  </Link>
                </div>
              )}
            </Card>
          </Reveal>

          {/* Certificates (real state) */}
          {certificates.length > 0 && (
            <Reveal delay={0.15}>
              <Card hover>
                <CardHeader
                  title="Certificates"
                  subtitle={`${certificates.length} course${certificates.length === 1 ? "" : "s"} completed`}
                  icon={<Icons.ScrollText className="h-4 w-4" />}
                  action={
                    <Link href="/profile" className="text-sm text-capital-300 hover:underline">
                      Profile →
                    </Link>
                  }
                />
                <div className="space-y-2">
                  {certificates.slice(0, 3).map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-2.5 rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-2"
                    >
                      <Icons.Medal className="h-4 w-4 shrink-0 text-amber-300" />
                      <span className="truncate text-sm text-white/80">{c.title}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
          )}

          {/* Ask Capital Coach */}
          <Reveal delay={0.2}>
            <Card hover>
              <CardHeader title="Ask Capital Coach" icon={<Bot className="h-4 w-4" />} />
              <p className="text-sm text-white/55">
                Stuck on a money question? Ask in plain language.
              </p>
              <Button href="/coach" size="sm" className="mt-3 w-full">
                Open Capital Coach <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function timeGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

/**
 * Animated daily-goal ring: fills from 0 → today's progress on mount.
 * Goal is DAILY_GOAL_XP; copy adapts as the user closes the gap.
 */
function DailyGoalCard({
  xpToday,
  lessonsToday,
  correctToday,
}: {
  xpToday: number;
  lessonsToday: number;
  correctToday: number;
}) {
  const goalPct = Math.min(100, (xpToday / DAILY_GOAL_XP) * 100);
  const remaining = Math.max(0, DAILY_GOAL_XP - xpToday);
  const hit = remaining === 0;

  // Start at 0 and set the real value just after mount so the ring's CSS
  // stroke transition animates the fill in.
  const [ringValue, setRingValue] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setRingValue(goalPct), 180);
    return () => window.clearTimeout(t);
  }, [goalPct]);

  return (
    <Card glow className="flex h-full flex-col items-center justify-center p-6 text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-white/40">
        Today&apos;s goal
      </p>
      <div className="mt-4">
        <RingProgress value={ringValue} size={132} stroke={11}>
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-white">
              <AnimatedNumber value={xpToday} />
            </div>
            <div className="text-[10px] uppercase tracking-wider text-white/40">
              / {DAILY_GOAL_XP} XP
            </div>
          </div>
        </RingProgress>
      </div>
      <p className={cn("mt-4 text-sm font-semibold", hit ? "text-capital-300" : "text-white")}>
        {hit ? "Goal crushed, keep the momentum 🎉" : `${remaining} XP to go today`}
      </p>
      <p className="mt-1 text-xs text-white/45">
        {lessonsToday} lesson{lessonsToday === 1 ? "" : "s"} · {correctToday} correct answer
        {correctToday === 1 ? "" : "s"} today
      </p>
      {!hit && (
        <Button href="/learn" variant="ghost" size="sm" className="mt-3">
          Earn it now <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-72" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CardSkeleton />
        </div>
        <div className="glass flex items-center justify-center rounded-3xl p-6">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-20 rounded-3xl" />
        <Skeleton className="h-20 rounded-3xl" />
        <Skeleton className="h-20 rounded-3xl" />
        <Skeleton className="h-20 rounded-3xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}
