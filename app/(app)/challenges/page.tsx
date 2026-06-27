"use client";

import {
  Award,
  Briefcase,
  CalendarClock,
  Check,
  Clock,
  Flame,
  GitBranch,
  PieChart,
  PiggyBank,
  Scale,
  Sparkles,
  Target,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { ProgressBar } from "@/components/ui/Progress";
import { challenges } from "@/lib/data/challenges";
import { badgeById } from "@/lib/data/badges";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Challenge } from "@/lib/types";

// Challenges that are "done" when a specific lesson is completed.
const challengeLesson: Record<string, string> = {
  "compound-5min": "compound-interest",
  "save-vs-invest": "saving-vs-investing",
  "roth-basics": "roth-ira",
  "debt-vs-invest-tree": "when-not-to-invest",
  "100-month-plan": "dollar-cost-averaging",
  "budget-builder-challenge": "budgeting-college",
};

// Map lucide icon-name strings (from challenges.ts) to components.
const challengeIcons: Record<string, LucideIcon> = {
  PieChart,
  Sparkles,
  CalendarClock,
  Scale,
  PiggyBank,
  GitBranch,
  Briefcase,
  Users,
  Flame,
  Wallet,
};

// Where each challenge sends the student. Keep links non-broken.
const challengeHrefs: Record<string, string> = {
  "first-mock-etf": "/simulator",
  "compound-5min": "/learn/compound-interest",
  "100-month-plan": "/learn/dollar-cost-averaging",
  "save-vs-invest": "/learn/saving-vs-investing",
  "roth-basics": "/learn/roth-ira",
  "debt-vs-invest-tree": "/learn/when-not-to-invest",
  "internship-paycheck": "/learn",
  "explain-diversification": "/campus",
  "7-day-streak": "/learn",
  "budget-builder-challenge": "/learn/budgeting-college",
};

const hrefFor = (id: string) => challengeHrefs[id] ?? "/learn";

const categoryTone = (category: string) => {
  switch (category) {
    case "Learning":
      return "capital" as const;
    case "Simulator":
      return "sky" as const;
    case "Planning":
      return "violet" as const;
    case "Habit":
      return "amber" as const;
    case "Social":
      return "rose" as const;
    default:
      return "default" as const;
  }
};

function RewardLine({ challenge }: { challenge: Challenge }) {
  const badge = challenge.badgeId ? badgeById(challenge.badgeId) : undefined;
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <Pill tone="capital">
        <Zap className="h-3 w-3" />+{challenge.xp} XP
      </Pill>
      {badge && (
        <Pill tone="amber">
          <Award className="h-3 w-3" />
          {badge.name}
        </Pill>
      )}
      <span className="inline-flex items-center gap-1 text-white/45">
        <Clock className="h-3.5 w-3.5" />
        {challenge.deadlineDays} days left
      </span>
    </div>
  );
}

export default function ChallengesPage() {
  const { isLessonComplete, challengeProgress } = useAppState();

  // Real progress per challenge, driven by the signed-in user:
  //  - an explicit override in challengeProgress wins,
  //  - else a lesson-mapped challenge is 100% once that lesson is done,
  //  - else 0 (a brand-new user correctly shows 0% everywhere).
  const realProgress = (id: string): number => {
    if (challengeProgress[id] != null) return challengeProgress[id];
    const lesson = challengeLesson[id];
    if (lesson && isLessonComplete(lesson)) return 100;
    return 0;
  };

  const liveChallenges: Challenge[] = challenges.map((c) => ({
    ...c,
    progress: realProgress(c.id),
  }));

  // Featured: the most-progressed active challenge.
  const featured = [...liveChallenges]
    .filter((c) => c.progress > 0)
    .sort((a, b) => b.progress - a.progress)[0];

  const FeaturedIcon = featured
    ? challengeIcons[featured.icon] ?? Target
    : Target;
  const featuredBadge = featured?.badgeId
    ? badgeById(featured.badgeId)
    : undefined;
  const featuredDone = featured
    ? Math.round((featured.progress / 100) * featured.steps.length)
    : 0;

  return (
    <div>
      <PageHeader
        title="Challenges"
        subtitle="Weekly missions that turn learning into momentum."
      />

      {/* Active challenge, featured */}
      {featured && (
        <Card glow className="mb-7 overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <Pill tone="capital">
                  <Flame className="h-3 w-3" />
                  Active challenge
                </Pill>
                <Pill tone={categoryTone(featured.category)}>
                  {featured.category}
                </Pill>
              </div>

              <div className="mt-4 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-capital-gradient text-ink-950 shadow-glow">
                  <FeaturedIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-white">
                    {featured.title}
                  </h2>
                  <p className="mt-1 text-sm text-white/55">
                    {featured.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-capital-300">
                  Goal
                </p>
                <p className="mt-0.5 text-sm text-white/75">{featured.goal}</p>
              </div>

              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-white/55">Progress</span>
                  <span className="font-semibold text-capital-300">
                    {featured.progress}%
                  </span>
                </div>
                <ProgressBar value={featured.progress} />
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <RewardLine challenge={featured} />
                <Button href={hrefFor(featured.id)} size="sm">
                  Continue
                </Button>
              </div>
            </div>

            {/* Checklist */}
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
                Steps
              </p>
              <ul className="space-y-2.5">
                {featured.steps.map((step, i) => {
                  const done = i < featuredDone;
                  return (
                    <li key={step} className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                          done
                            ? "border-transparent bg-capital-gradient text-ink-950"
                            : "border-white/15 text-white/40",
                        )}
                      >
                        {done ? <Check className="h-3 w-3" /> : i + 1}
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          done
                            ? "text-white/45 line-through"
                            : "text-white/75",
                        )}
                      >
                        {step}
                      </span>
                    </li>
                  );
                })}
              </ul>
              {featuredBadge && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 px-3 py-2">
                  <Award className="h-4 w-4 text-amber-300" />
                  <span className="text-xs text-white/70">
                    Earns the{" "}
                    <strong className="font-semibold text-amber-300">
                      {featuredBadge.name}
                    </strong>{" "}
                    badge
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* All challenges grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {liveChallenges.map((challenge) => {
          const Icon = challengeIcons[challenge.icon] ?? Target;
          const badge = challenge.badgeId
            ? badgeById(challenge.badgeId)
            : undefined;
          const started = challenge.progress > 0;
          return (
            <Card key={challenge.id} hover className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-ink-950 shadow-card",
                    "from-capital-400 to-violet-500",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <Pill tone={categoryTone(challenge.category)}>
                  {challenge.category}
                </Pill>
              </div>

              <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-white">
                {challenge.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-white/55">
                {challenge.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <Pill tone="capital">
                  <Zap className="h-3 w-3" />+{challenge.xp} XP
                </Pill>
                {badge && (
                  <Pill tone="amber">
                    <Award className="h-3 w-3" />
                    {badge.name}
                  </Pill>
                )}
              </div>

              <div className="mt-auto pt-5">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-white/45">
                    <Clock className="h-3.5 w-3.5" />
                    {challenge.deadlineDays} days left
                  </span>
                  <span className="font-semibold text-capital-300">
                    {challenge.progress}%
                  </span>
                </div>
                <ProgressBar value={challenge.progress} />
                <Button
                  href={hrefFor(challenge.id)}
                  variant={started ? "primary" : "outline"}
                  size="sm"
                  className="mt-4 w-full"
                >
                  {started ? "Continue" : "Start"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
