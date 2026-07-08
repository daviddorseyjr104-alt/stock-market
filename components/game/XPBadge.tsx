"use client";

import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared XP chip, a Zap bolt + formatted XP total, violet accent.
 * Used in HUDs, completion screens, and leaderboard rows.
 */
export function XPBadge({
  value,
  size = "md",
  className,
}: {
  value: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const sm = size === "sm";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-violet-500/25 bg-violet-500/10 font-semibold text-violet-400",
        sm ? "gap-1 px-2 py-0.5 text-[11px]" : "gap-1.5 px-3 py-1 text-sm",
        className,
      )}
      title={`${value.toLocaleString()} XP`}
    >
      <Zap
        className={sm ? "h-3 w-3" : "h-4 w-4"}
        fill="currentColor"
        aria-hidden
      />
      <span className="font-display font-bold text-white">
        {value.toLocaleString()}
      </span>
      <span
        className={cn(
          "font-bold uppercase tracking-wider text-violet-400/80",
          sm ? "text-[9px]" : "text-[10px]",
        )}
      >
        XP
      </span>
    </span>
  );
}
