"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SkillProgressRow } from "@/lib/store";
import { RingProgress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

function courseIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;
}

/**
 * One skill/course progress tile for the dashboard grid. Links into the
 * Learn path filtered to the skill's course.
 */
export function SkillProgressCard({ row }: { row: SkillProgressRow }) {
  const Icon = courseIcon(row.course.icon);
  const started = row.done > 0;
  const complete = row.total > 0 && row.done === row.total;

  return (
    <Link
      href={`/learn?course=${row.course.id}`}
      className={cn(
        "glass group flex items-center gap-3.5 rounded-2xl p-4 transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-white/20 hover:shadow-float",
      )}
    >
      <RingProgress value={row.pct} size={52} stroke={5}>
        <span
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-ink-950",
            started ? row.course.color : "from-white/10 to-white/5",
          )}
        >
          <Icon className={cn("h-4 w-4", !started && "text-white/40")} />
        </span>
      </RingProgress>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white group-hover:text-capital-300">
          {row.skill.name}
        </p>
        <p className="truncate text-xs text-white/45">{row.course.title}</p>
        <p className="mt-0.5 text-[11px] font-medium tabular-nums text-white/40">
          {complete ? (
            <span className="text-capital-300">Mastered · {row.done}/{row.total}</span>
          ) : (
            <>
              {row.done}/{row.total} lessons · {row.pct}%
            </>
          )}
        </p>
      </div>
      <Icons.ChevronRight className="h-4 w-4 shrink-0 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-capital-300" />
    </Link>
  );
}
