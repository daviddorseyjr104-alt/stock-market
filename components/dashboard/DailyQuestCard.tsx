"use client";

import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DailyQuest } from "@/lib/types";
import { ProgressBar } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

function questIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;
}

/**
 * One daily quest row: icon, title, progress toward the goal and the XP
 * reward. Rendered inside the "Daily quests" card on the dashboard.
 */
export function DailyQuestCard({
  quest,
  value,
  done,
}: {
  quest: DailyQuest;
  value: number;
  done: boolean;
}) {
  const Icon = questIcon(quest.icon);
  const shown = Math.min(value, quest.goal);
  const pct = quest.goal > 0 ? (shown / quest.goal) * 100 : 0;

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3.5 transition-colors",
        done
          ? "border-capital-400/25 bg-capital-400/[0.06]"
          : "border-white/8 bg-white/[0.02] hover:border-white/15",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            done ? "bg-capital-gradient text-ink-950" : "bg-white/5 text-capital-300",
          )}
        >
          {done ? <Icons.Check className="h-4 w-4" strokeWidth={3} /> : <Icon className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-semibold",
              done ? "text-capital-200" : "text-white",
            )}
          >
            {quest.title}
          </p>
          <p className="truncate text-xs text-white/45">{quest.description}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
            done
              ? "border-capital-400/25 bg-capital-400/10 text-capital-300"
              : "border-white/10 bg-white/5 text-white/60",
          )}
        >
          +{quest.xpReward} XP
        </span>
      </div>
      <div className="mt-2.5 flex items-center gap-2.5">
        <ProgressBar value={pct} className="h-1.5 flex-1" showGlow={done} />
        <span className="w-12 shrink-0 text-right text-[11px] font-medium tabular-nums text-white/45">
          {done ? "Done" : `${shown}/${quest.goal}`}
        </span>
      </div>
    </div>
  );
}
