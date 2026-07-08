"use client";

import { ChevronDown, ChevronUp, Minus, Users } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Pill } from "@/components/ui/Pill";
import { cn, formatCompact } from "@/lib/utils";
import type { LeaderRow } from "@/lib/types";

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

function Delta({ delta }: { delta: number }) {
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums text-capital-300">
        <ChevronUp className="h-3.5 w-3.5" />
        {delta}
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums text-rose-400">
        <ChevronDown className="h-3.5 w-3.5" />
        {Math.abs(delta)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-xs font-medium text-white/30">
      <Minus className="h-3.5 w-3.5" />
    </span>
  );
}

/**
 * Ranked leaderboard list for REAL rows only, pass in however many real
 * students exist (one is fine: a fresh board is just the current user).
 * Rows with `highlight: true` are the current user's row. When `rows` is
 * empty, an honest built-in empty note renders instead of filler names;
 * pass `emptyState` to replace it (e.g. an invite CTA).
 */
export function LeaderboardCard({
  rows,
  highlightRank,
  unit = "XP",
  emptyState,
}: {
  rows: LeaderRow[];
  highlightRank?: boolean;
  unit?: string;
  emptyState?: React.ReactNode;
}) {
  if (rows.length === 0) {
    return (
      <>
        {emptyState ?? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-5 py-8 text-center">
            <Users className="h-5 w-5 text-capital-300" />
            <p className="text-sm font-semibold text-white">No one on this board yet</p>
            <p className="max-w-xs text-xs text-white/50">
              Ranks appear as real students earn them, nothing here is seeded.
            </p>
          </div>
        )}
      </>
    );
  }

  return (
    <ol className="space-y-1.5">
      {rows.map((row) => {
        const isTop3 = row.rank <= 3;
        const isYou = Boolean(row.highlight);
        return (
          <li
            key={`${row.rank}-${row.name}`}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.04]",
              isYou &&
                "border-capital-400/25 bg-capital-400/[0.07] hover:border-capital-400/40 hover:bg-capital-400/10",
            )}
          >
            {/* Rank */}
            <div className="flex w-9 shrink-0 items-center justify-center">
              {MEDALS[row.rank] ? (
                <span
                  className="text-xl leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                  aria-label={`Rank ${row.rank}`}
                >
                  {MEDALS[row.rank]}
                </span>
              ) : isYou && highlightRank ? (
                <span className="rounded-lg bg-capital-gradient px-1.5 py-0.5 font-display text-xs font-bold tabular-nums text-ink-950 shadow-glow">
                  #{row.rank}
                </span>
              ) : (
                <span className="font-display text-sm font-bold tabular-nums text-white/40">
                  {row.rank}
                </span>
              )}
            </div>

            {/* Avatar */}
            <Avatar name={row.name} gradient={row.avatarColor} size="sm" ring={isTop3} />

            {/* Name + school/meta */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    "truncate text-sm font-semibold",
                    isTop3 ? "text-gradient-capital" : "text-white",
                  )}
                >
                  {row.name}
                </p>
                {isYou && (
                  <Pill tone="capital" className="shrink-0">
                    You
                  </Pill>
                )}
              </div>
              <p className="truncate text-xs text-white/45">{row.meta}</p>
            </div>

            {/* Metric + weekly movement */}
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <span className="font-display text-sm font-bold tabular-nums text-white">
                {unit === "days" || unit === "pts"
                  ? row.xp.toLocaleString()
                  : formatCompact(row.xp)}
                <span className="ml-1 text-xs font-medium text-white/40">{unit}</span>
              </span>
              <Delta delta={row.delta} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
