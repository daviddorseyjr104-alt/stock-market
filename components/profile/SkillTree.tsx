"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RingProgress } from "@/components/ui/Progress";
import { pop, staggerContainer } from "@/lib/motion";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

function skillIcon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;
}

/**
 * The 8-skill tree: one node per course, showing real completion percent.
 * Rings sweep in from 0 on mount; locked courses (level-gated) render
 * dimmed with a lock.
 */
export function SkillTree() {
  const { skillProgress, isCourseUnlocked } = useAppState();
  const rows = skillProgress();

  // Mount rings at 0 then set the real value so the stroke animates in.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {rows.map((row) => {
        const unlocked = isCourseUnlocked(row.course.id);
        const started = row.done > 0;
        const complete = row.total > 0 && row.done === row.total;
        const Icon = skillIcon(row.skill.icon);

        return (
          <motion.div key={row.skill.id} variants={pop} className="min-w-0">
            <Link
              href={unlocked ? `/learn?course=${row.course.id}` : "/learn"}
              className={cn(
                "group flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-4 text-center transition-all duration-300",
                unlocked
                  ? "sheen card-lift hover:border-white/20 hover:bg-white/[0.04]"
                  : "opacity-50",
              )}
            >
              <RingProgress value={ready ? row.pct : 0} size={64} stroke={5}>
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br transition-shadow duration-300",
                    started
                      ? cn(row.course.color, "text-ink-950", complete && "shadow-glow")
                      : "from-white/10 to-white/5 text-white/40",
                  )}
                >
                  {unlocked ? <Icon className="h-5 w-5" /> : <Icons.Lock className="h-4 w-4" />}
                </span>
              </RingProgress>
              <div className="min-w-0 self-stretch">
                <p className="truncate text-sm font-semibold text-white">{row.skill.name}</p>
                <p className="mt-0.5 text-[11px] tabular-nums text-white/45">
                  {!unlocked ? (
                    <>Unlocks at Lv. {row.course.unlockLevel}</>
                  ) : complete ? (
                    <span className="font-semibold text-capital-300">Mastered</span>
                  ) : (
                    <>
                      {row.done}/{row.total} · {row.pct}%
                    </>
                  )}
                </p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
