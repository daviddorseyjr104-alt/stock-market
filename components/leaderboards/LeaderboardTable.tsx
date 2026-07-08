"use client";

import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, Minus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Pill } from "@/components/ui/Pill";
import { cn, formatCompact } from "@/lib/utils";
import type { LeaderRow } from "@/lib/types";

const MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: Math.min(i * 0.05, 0.45), ease: [0.21, 0.6, 0.35, 1] as const },
  }),
};

function RankBadge({ rank }: { rank: number }) {
  if (MEDALS[rank]) {
    return (
      <span
        className="text-xl leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
        aria-label={`Rank ${rank}`}
      >
        {MEDALS[rank]}
      </span>
    );
  }
  return (
    <span className="font-display text-sm font-bold tabular-nums text-white/40">
      {rank}
    </span>
  );
}

function Delta({ delta }: { delta: number }) {
  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-capital-300 tabular-nums">
        <ChevronUp className="h-3.5 w-3.5" />
        {delta}
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-rose-400 tabular-nums">
        <ChevronDown className="h-3.5 w-3.5" />
        {Math.abs(delta)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-white/35">
      <Minus className="h-3.5 w-3.5" />
    </span>
  );
}

function formatValue(xp: number, unit?: string) {
  // Large counts read better compact; small counts (days, %, returns) read literal.
  const value =
    unit === "days" || unit === "%" || unit === "% return" || unit === "members"
      ? xp.toLocaleString()
      : formatCompact(xp);
  return unit ? `${value} ${unit}` : value;
}

/**
 * Presentational leaderboard. Stateless, pass in any LeaderRow[] and an
 * optional unit label for the value column ("XP", "days", "%", "% return").
 * Rows stagger-reveal on mount, key the component (e.g. by board id) to
 * replay the animation when the board changes.
 */
export function LeaderRows({
  rows,
  unit = "XP",
  highlightLabel = "You",
}: {
  rows: LeaderRow[];
  unit?: string;
  highlightLabel?: string;
}) {
  return (
    <ul className="space-y-1.5">
      {rows.map((row, i) => {
        const isTop3 = row.rank <= 3;
        return (
          <motion.li
            key={`${row.rank}-${row.name}`}
            custom={i}
            variants={rowVariants}
            initial="hidden"
            animate="show"
            className={cn(
              "group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.04]",
              isTop3 && "sheen",
              row.highlight &&
                "border-capital-400/25 bg-capital-400/[0.07] hover:border-capital-400/40 hover:bg-capital-400/10",
            )}
          >
            {/* Rank */}
            <div className="flex w-8 shrink-0 items-center justify-center">
              <RankBadge rank={row.rank} />
            </div>

            {/* Avatar */}
            <Avatar
              name={row.name}
              gradient={row.avatarColor}
              size="sm"
              ring={isTop3}
            />

            {/* Identity */}
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
                {row.highlight && (
                  <Pill tone="capital" className="shrink-0">
                    {highlightLabel}
                  </Pill>
                )}
              </div>
              <p className="truncate text-xs text-white/45">{row.meta}</p>
            </div>

            {/* Value + delta */}
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <span className="font-display text-sm font-bold tabular-nums text-white">
                {formatValue(row.xp, unit)}
              </span>
              <Delta delta={row.delta} />
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
