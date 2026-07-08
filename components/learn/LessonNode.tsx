"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Crown, Lock, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CourseLesson } from "@/lib/types";

export type NodeState = "completed" | "active" | "locked";

/**
 * One stop on the winding course path.
 * - completed → brand-gradient circle with a check (crown for bosses), links to review
 * - active    → course-gradient circle, pulsing ring + START bubble
 * - locked    → muted circle; click shows an unlock hint
 * Unit-final `kind:"challenge"` lessons render as a bigger BOSS node.
 */
export function LessonNode({
  lesson,
  state,
  courseColor,
  offset,
  index,
  hint = "Finish the lesson before this to unlock",
}: {
  lesson: CourseLesson;
  state: NodeState;
  courseColor: string;
  offset: number;
  index: number;
  hint?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [showHint, setShowHint] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boss = lesson.kind === "challenge";

  useEffect(
    () => () => {
      if (hintTimer.current) clearTimeout(hintTimer.current);
    },
    [],
  );

  const onLockedClick = () => {
    setShowHint(true);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setShowHint(false), 2400);
  };

  const stateLabel =
    state === "completed"
      ? "completed, tap to review"
      : state === "active"
        ? "current lesson, tap to start"
        : "locked";
  const ariaLabel = `${boss ? "Boss challenge" : "Lesson"}: ${lesson.title} (${stateLabel})`;

  const sizeClasses = boss ? "h-[88px] w-[88px]" : "h-[76px] w-[76px]";

  const circleClasses = cn(
    "relative flex items-center justify-center rounded-full transition-transform duration-200 focus-visible:ring-focus",
    sizeClasses,
    state === "completed" &&
      "bg-capital-gradient text-ink-950 shadow-[inset_0_-6px_0_rgba(0,0,0,0.22),0_0_0_1px_rgba(57,245,172,0.18),0_8px_40px_-8px_rgba(57,245,172,0.35)] hover:scale-105 active:scale-95",
    state === "active" &&
      !boss &&
      `bg-gradient-to-br ${courseColor} text-ink-950 shadow-[inset_0_-6px_0_rgba(0,0,0,0.25),0_8px_40px_-8px_rgba(57,245,172,0.45)] hover:scale-105 active:scale-95`,
    state === "active" &&
      boss &&
      "bg-gradient-to-br from-amber-300 to-orange-500 text-ink-950 shadow-[inset_0_-6px_0_rgba(0,0,0,0.25),0_8px_40px_-8px_rgba(251,191,36,0.55)] hover:scale-105 active:scale-95",
    state === "locked" &&
      "border border-white/10 bg-white/5 text-white/30 shadow-[inset_0_-5px_0_rgba(0,0,0,0.35)]",
  );

  const iconSize = boss ? "h-9 w-9" : "h-8 w-8";
  const icon = boss ? (
    state === "locked" ? (
      <Crown className={iconSize} strokeWidth={2.2} aria-hidden />
    ) : (
      <Crown className={iconSize} fill="currentColor" strokeWidth={0} aria-hidden />
    )
  ) : state === "locked" ? (
    <Lock className="h-7 w-7" strokeWidth={2.4} aria-hidden />
  ) : state === "active" ? (
    <Star className={iconSize} fill="currentColor" strokeWidth={0} aria-hidden />
  ) : (
    <Check className={iconSize} strokeWidth={3.5} aria-hidden />
  );

  const circleInner = (
    <>
      {/* Static halo ring around the active node */}
      {state === "active" && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-2 rounded-full border-[3px]",
            boss ? "border-amber-300/50" : "border-capital-300/45",
          )}
        />
      )}
      {/* Pulsing ring */}
      {state === "active" && !reduceMotion && (
        <motion.span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full border-2",
            boss ? "border-amber-300" : "border-capital-300",
          )}
          animate={{ scale: [1, 1.45], opacity: [0.8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      {icon}
    </>
  );

  return (
    <div
      className={cn("relative flex justify-center", showHint && "z-10")}
      style={{ transform: `translateX(${offset}px)` }}
    >
      <motion.div
        className="relative flex flex-col items-center"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.7, y: 16 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{
          duration: 0.4,
          delay: (index % 4) * 0.05,
          ease: [0.21, 0.6, 0.35, 1],
        }}
      >
        {/* Floating START bubble above the active node */}
        {state === "active" && (
          <div
            aria-hidden
            className="pointer-events-none absolute -top-11 left-1/2 z-10 -translate-x-1/2 animate-float"
          >
            <div
              className={cn(
                "relative rounded-2xl border bg-ink-900 px-3.5 py-1.5",
                boss
                  ? "border-amber-400/50 shadow-[0_0_0_1px_rgba(251,191,36,0.2),0_8px_40px_-8px_rgba(251,191,36,0.4)]"
                  : "border-capital-400/40 shadow-glow",
              )}
            >
              <span
                className={cn(
                  "text-xs font-extrabold uppercase tracking-[0.18em]",
                  boss ? "text-amber-300" : "text-capital-300",
                )}
              >
                {boss ? "Boss" : "Start"}
              </span>
              <span
                className={cn(
                  "absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r bg-ink-900",
                  boss ? "border-amber-400/50" : "border-capital-400/40",
                )}
              />
            </div>
          </div>
        )}

        {/* Locked hint tooltip */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              role="status"
              className="absolute -top-12 left-1/2 z-20 -translate-x-1/2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18 }}
            >
              <div className="relative whitespace-nowrap rounded-xl glass-strong px-3 py-1.5 text-xs font-medium text-white/85 shadow-float">
                {hint}
                <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-ink-900" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {state === "locked" ? (
          <button
            type="button"
            onClick={onLockedClick}
            aria-label={ariaLabel}
            aria-disabled="true"
            className={cn(circleClasses, "cursor-not-allowed")}
          >
            {circleInner}
          </button>
        ) : (
          <Link
            href={`/learn/lesson/${lesson.id}`}
            aria-label={ariaLabel}
            className={circleClasses}
          >
            {circleInner}
          </Link>
        )}

        {/* Caption */}
        <div className="mt-2 flex flex-col items-center gap-0.5">
          {boss && (
            <span
              className={cn(
                "rounded-full border px-2 py-px text-[9px] font-extrabold uppercase tracking-[0.15em]",
                state === "locked"
                  ? "border-white/10 text-white/25"
                  : "border-amber-400/30 bg-amber-400/10 text-amber-300",
              )}
            >
              Challenge
            </span>
          )}
          <span
            className={cn(
              "max-w-[130px] truncate text-center text-[11px] font-medium",
              state === "locked" ? "text-white/30" : "text-white/65",
            )}
          >
            {lesson.title}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[10px] font-semibold",
              state === "locked" ? "text-white/25" : "text-violet-400",
            )}
          >
            <Zap className="h-2.5 w-2.5" fill="currentColor" aria-hidden />+
            {lesson.xp} XP
          </span>
        </div>
      </motion.div>
    </div>
  );
}
