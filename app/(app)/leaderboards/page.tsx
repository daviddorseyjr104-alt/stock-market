"use client";

import { useMemo, useState } from "react";
import {
  Trophy,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Crown,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";
import { LeaderRows } from "@/components/leaderboards/LeaderboardTable";
import {
  studentXpLeaders,
  schoolLeaders,
  weeklyLeaders,
  clubLeaders,
  streakLeaders,
  simulatorLeaders,
} from "@/lib/data/leaderboards";
import { schools } from "@/lib/data/schools";
import { cn, formatCompact, formatPercent } from "@/lib/utils";
import type { LeaderRow } from "@/lib/types";

type BoardKey =
  | "campus"
  | "student"
  | "weekly"
  | "clubs"
  | "streaks"
  | "simulator";

interface Board {
  key: BoardKey;
  label: string;
  rows: LeaderRow[];
  unit?: string;
  highlightLabel: string;
  blurb: string;
}

const BOARDS: Board[] = [
  {
    key: "campus",
    label: "Campus XP",
    rows: schoolLeaders,
    unit: "XP",
    highlightLabel: "Your school",
    blurb: "Total knowledge earned per school. Every lesson moves your campus up.",
  },
  {
    key: "student",
    label: "Student XP",
    rows: studentXpLeaders,
    unit: "XP",
    highlightLabel: "You",
    blurb: "The students putting in the reps. Learning compounds, just like money.",
  },
  {
    key: "weekly",
    label: "Weekly Growth",
    rows: weeklyLeaders,
    unit: "%",
    highlightLabel: "Your school",
    blurb: "Who's climbing fastest this week. Momentum beats starting position.",
  },
  {
    key: "clubs",
    label: "Clubs",
    rows: clubLeaders,
    unit: "XP",
    highlightLabel: "Your club",
    blurb: "Communities learning together. Find your people, grow your XP.",
  },
  {
    key: "streaks",
    label: "Streaks",
    rows: streakLeaders,
    unit: "days",
    highlightLabel: "You",
    blurb: "Consistency is the real flex. Show up daily, the rest takes care of itself.",
  },
  {
    key: "simulator",
    label: "Simulator",
    rows: simulatorLeaders,
    unit: "% return",
    highlightLabel: "You",
    blurb: "Practice-portfolio results. Paper gains only, risk-free reps that build instinct.",
  },
];

/** Look up a school's emoji by matching the leaderboard name. */
function emojiForSchool(name: string) {
  return schools.find((s) => s.name === name || s.shortName === name)?.emoji ?? "🎓";
}

const PODIUM_ORDER = [2, 1, 3]; // visual left-to-right: 2nd, 1st, 3rd

export default function LeaderboardsPage() {
  const [active, setActive] = useState<BoardKey>("campus");

  const board = useMemo(
    () => BOARDS.find((b) => b.key === active) ?? BOARDS[0],
    [active],
  );

  const podium = useMemo(() => schoolLeaders.slice(0, 3), []);
  const ucla = useMemo(
    () => schoolLeaders.find((s) => s.highlight),
    [],
  );
  const uclaSchool = schools.find((s) => s.id === "ucla");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Leaderboards"
        subtitle="Competition that builds wealth, not anxiety."
        action={
          <Pill tone="capital" className="px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" />
            Season 1 · Live
          </Pill>
        }
      />

      {/* School vs School callout */}
      {ucla && (
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-capital-400/20 bg-gradient-to-r from-capital-400/[0.08] via-violet-500/[0.05] to-transparent p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-capital-400/10 blur-3xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                  {uclaSchool?.emoji ?? "🐻"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    UCLA sits at{" "}
                    <span className="text-gradient-capital">#{ucla.rank}</span>{" "}
                    in Campus XP
                  </p>
                  <p className="mt-1 max-w-md text-xs text-white/55">
                    {ucla.delta >= 0
                      ? `Up ${formatPercent(ucla.delta)} this week and still climbing.`
                      : `Slipped ${Math.abs(ucla.delta)} spots this week.`}{" "}
                    Every lesson you finish lifts the whole campus, you&apos;re
                    {ucla.rank > 1
                      ? ` ${formatCompact(
                          (schoolLeaders[ucla.rank - 2]?.xp ?? ucla.xp) - ucla.xp,
                        )} XP from the school ahead.`
                      : " holding the top spot, keep it locked in."}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" href="/learn">
                Earn XP for UCLA
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Reveal>
      )}

      {/* Podium hero, top 3 schools */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-capital-300" />
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white/60">
            Top Campuses
          </h2>
        </div>

        <div className="grid grid-cols-3 items-end gap-3 sm:gap-5">
          {PODIUM_ORDER.map((rank, i) => {
            const row = podium[rank - 1];
            if (!row) return null;
            const isFirst = rank === 1;
            return (
              <Reveal key={row.name} delay={0.08 * i}>
                <Card
                  glow={isFirst}
                  className={cn(
                    "relative flex flex-col items-center overflow-hidden text-center transition-all duration-300",
                    isFirst
                      ? "border-capital-400/30 bg-gradient-to-b from-capital-400/[0.1] to-transparent pt-7 pb-6 sm:-translate-y-3"
                      : "pt-5 pb-5",
                    row.highlight && "ring-1 ring-capital-400/30",
                  )}
                >
                  {isFirst && (
                    <>
                      <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-capital-400/20 blur-3xl" />
                      <Crown className="absolute right-4 top-4 h-4 w-4 text-amber-300" />
                    </>
                  )}

                  <div
                    className={cn(
                      "mb-2 text-2xl sm:text-3xl",
                      isFirst && "animate-float",
                    )}
                  >
                    {emojiForSchool(row.name)}
                  </div>

                  <div className="mb-2 text-2xl leading-none sm:text-3xl">
                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                  </div>

                  <p
                    className={cn(
                      "max-w-full truncate px-1 text-sm font-bold",
                      isFirst ? "text-gradient-capital" : "text-white",
                    )}
                    title={row.name}
                  >
                    {schools.find((s) => s.name === row.name)?.shortName ??
                      row.name}
                  </p>

                  <p
                    className={cn(
                      "mt-2 font-display font-bold tabular-nums text-white",
                      isFirst ? "text-xl sm:text-2xl" : "text-base sm:text-lg",
                    )}
                  >
                    {formatCompact(row.xp)}
                    <span className="ml-1 text-xs font-medium text-white/40">
                      XP
                    </span>
                  </p>

                  <Pill
                    tone={row.delta >= 0 ? "capital" : "rose"}
                    className="mt-2"
                  >
                    <TrendingUp className="h-3 w-3" />
                    {formatPercent(row.delta)} wk
                  </Pill>

                  {row.highlight && (
                    <span className="mt-2 text-[11px] font-semibold text-capital-300">
                      Your school
                    </span>
                  )}
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Tab switcher + selected board */}
      <Reveal>
        <Card className="p-4 sm:p-6">
          <div className="-mx-1 mb-5 overflow-x-auto px-1">
            <div className="inline-flex min-w-full gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur sm:min-w-0">
              {BOARDS.map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => setActive(b.key)}
                  aria-pressed={active === b.key}
                  className={cn(
                    "whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
                    active === b.key
                      ? "bg-capital-gradient text-ink-950 shadow-glow"
                      : "text-white/55 hover:text-white",
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 flex items-start justify-between gap-3">
            <p className="max-w-xl text-sm text-white/55">{board.blurb}</p>
            <span className="hidden shrink-0 text-xs font-medium text-white/35 sm:block">
              {board.rows.length} ranked
            </span>
          </div>

          <LeaderRows
            rows={board.rows}
            unit={board.unit}
            highlightLabel={board.highlightLabel}
          />
        </Card>
      </Reveal>

      <p className="text-center text-xs text-white/35">
        Ranks refresh weekly. Compete with your campus, learn at your own pace, every spot is earned, never bought.
      </p>
    </div>
  );
}
