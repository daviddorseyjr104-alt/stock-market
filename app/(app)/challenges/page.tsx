"use client";

import {
  Award,
  Briefcase,
  CalendarClock,
  Check,
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
import { badgeById } from "@/lib/data/badges";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ChallengeStatus } from "@/lib/types";

// ──────────────────────────────────────────────────────────────────────────
// Every card here used to advertise XP and a badge that nothing ever awarded,
// four challenges were pinned at 0% forever, and the "3 days left" countdown was
// a static number that never moved. Progress now comes from the store, derived
// from real state, and the store pays the reward out exactly once.
// ──────────────────────────────────────────────────────────────────────────

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
  Award,
};

/** Where each challenge sends you to make progress. */
const challengeHrefs: Record<string, string> = {
  "first-mock-etf": "/simulator/portfolio",
  "diversified-book": "/simulator/portfolio",
  "compound-5min": "/learn/lesson/investing-u3-l1",
  "100-month-plan": "/learn/lesson/investing-u2-l3",
  "save-vs-invest": "/learn/lesson/money-basics-u2-l3",
  "roth-basics": "/learn/lesson/investing-u3-l2",
  "debt-vs-invest-tree": "/learn/lesson/credit-debt-u2-l2",
  "internship-paycheck": "/learn/lesson/money-basics-u3-l1",
  "explain-diversification": "/learn/lesson/investing-u2-l1",
  "7-day-streak": "/learn",
  "budget-builder-challenge": "/learn/lesson/money-basics-u1-l4",
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
    default:
      return "default" as const;
  }
};

export default function ChallengesPage() {
  const { challengeStatuses, hydrated } = useAppState();
  const statuses = challengeStatuses();

  const completed = statuses.filter((s) => s.complete);
  const totalXpEarned = completed.reduce((n, s) => n + s.challenge.xp, 0);

  // Featured: the challenge you're furthest into but haven't finished.
  const featured = [...statuses]
    .filter((s) => !s.complete)
    .sort((a, b) => b.progress - a.progress)[0];

  return (
    <div>
      <PageHeader
        title="Challenges"
        subtitle="Missions that turn what you've learned into XP and badges."
        action={
          hydrated ? (
            <Pill tone="capital" className="px-3 py-1">
              <Check className="h-3.5 w-3.5" />
              {completed.length} of {statuses.length} · {totalXpEarned.toLocaleString()} XP
            </Pill>
          ) : undefined
        }
      />

      {featured && <FeaturedChallenge status={featured} />}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {statuses.map((status) => (
          <ChallengeCard key={status.challenge.id} status={status} />
        ))}
      </div>
    </div>
  );
}

function FeaturedChallenge({ status }: { status: ChallengeStatus }) {
  const { challenge, progress } = status;
  const Icon = challengeIcons[challenge.icon] ?? Target;
  const badge = challenge.badgeId ? badgeById(challenge.badgeId) : undefined;
  // Steps are illustrative; the `goal` is what's actually checked.
  const stepsDone = Math.round((progress / 100) * challenge.steps.length);

  return (
    <Card glow className="mb-7 overflow-hidden">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <Pill tone="capital">
              <Flame className="h-3 w-3" />
              Closest to done
            </Pill>
            <Pill tone={categoryTone(challenge.category)}>{challenge.category}</Pill>
          </div>

          <div className="mt-4 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-capital-gradient text-ink-950 shadow-glow">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-white">
                {challenge.title}
              </h2>
              <p className="mt-1 text-sm text-white/55">{challenge.description}</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-capital-300">
              What counts
            </p>
            <p className="mt-0.5 text-sm text-white/75">{challenge.goal}</p>
          </div>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-white/55">Progress</span>
              <span className="font-semibold text-capital-300">{progress}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
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
            </div>
            <Button href={hrefFor(challenge.id)} size="sm">
              {progress > 0 ? "Continue" : "Start"}
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
            Steps
          </p>
          <ul className="space-y-2.5">
            {challenge.steps.map((step, i) => {
              const done = i < stepsDone;
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
                      done ? "text-white/45 line-through" : "text-white/75",
                    )}
                  >
                    {step}
                  </span>
                </li>
              );
            })}
          </ul>
          {badge && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/5 px-3 py-2">
              <Award className="h-4 w-4 text-amber-300" />
              <span className="text-xs text-white/70">
                Earns the{" "}
                <strong className="font-semibold text-amber-300">{badge.name}</strong>{" "}
                badge
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function ChallengeCard({ status }: { status: ChallengeStatus }) {
  const { challenge, progress, complete } = status;
  const Icon = challengeIcons[challenge.icon] ?? Target;
  const badge = challenge.badgeId ? badgeById(challenge.badgeId) : undefined;

  return (
    <Card
      hover
      className={cn(
        "flex h-full flex-col",
        complete && "border-capital-400/30 shadow-glow-soft",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-ink-950 shadow-card",
            complete ? "from-capital-300 to-capital-500" : "from-capital-400 to-violet-500",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {complete ? (
          <Pill tone="capital">
            <Check className="h-3 w-3" />
            Complete
          </Pill>
        ) : (
          <Pill tone={categoryTone(challenge.category)}>{challenge.category}</Pill>
        )}
      </div>

      <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-white">
        {challenge.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-white/55">
        {challenge.description}
      </p>
      <p className="mt-2 text-xs text-white/40">{challenge.goal}</p>

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
        <div className="mb-1.5 flex items-center justify-end text-xs">
          <span className="font-semibold text-capital-300">{progress}%</span>
        </div>
        <ProgressBar value={progress} />
        {complete ? (
          <p className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-capital-400/10 py-2 text-xs font-semibold text-capital-300">
            <Check className="h-3.5 w-3.5" />
            Earned +{challenge.xp} XP
          </p>
        ) : (
          <Button
            href={hrefFor(challenge.id)}
            variant={progress > 0 ? "primary" : "outline"}
            size="sm"
            className="mt-4 w-full"
          >
            {progress > 0 ? "Continue" : "Start"}
          </Button>
        )}
      </div>
    </Card>
  );
}
