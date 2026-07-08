"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared streak card, amber flame + day count on a glass surface.
 * The flame only "lights" (fills) when the streak is alive.
 */
export function StreakCard({
  streak,
  className,
}: {
  streak: number;
  className?: string;
}) {
  const active = streak > 0;
  return (
    <div
      className={cn(
        "glass flex items-center gap-3 rounded-3xl p-4 shadow-card",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
          active
            ? "bg-amber-400/15 text-amber-400 shadow-[0_0_20px_-4px_rgba(251,191,36,0.45)]"
            : "bg-white/5 text-white/25",
        )}
      >
        <Flame className="h-6 w-6" fill={active ? "currentColor" : "none"} aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="font-display text-xl font-bold leading-tight text-white">
          {streak}
          <span className="ml-1.5 text-sm font-semibold text-white/50">
            day{streak === 1 ? "" : "s"}
          </span>
        </p>
        <p
          className={cn(
            "text-[11px] font-bold uppercase tracking-wider",
            active ? "text-amber-300/90" : "text-white/40",
          )}
        >
          {active ? "Streak alive" : "Start a streak"}
        </p>
      </div>
    </div>
  );
}
