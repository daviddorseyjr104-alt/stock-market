"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Flame, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/game/Confetti";

/** Streak values worth celebrating. */
const MILESTONES = [3, 7, 30] as const;

const MILESTONE_COPY: Record<number, { headline: string; body: string }> = {
  3: {
    headline: "3-day streak!",
    body: "Three days in a row, you're officially building a habit. Keep the flame alive.",
  },
  7: {
    headline: "One full week!",
    body: "Seven straight days of learning. That's top-tier consistency, most people never get here.",
  },
  30: {
    headline: "30-day streak!",
    body: "A full month, every single day. You're in rare company, this is how wealth habits are built.",
  },
};

/**
 * Celebratory modal that fires once per session when the user's REAL streak
 * lands exactly on a milestone (3 / 7 / 30 days). Session-deduped via
 * sessionStorage keyed by the streak value.
 */
export function StreakMilestone({ streak }: { streak: number }) {
  const reduceMotion = useReducedMotion();
  const [milestone, setMilestone] = useState<number | null>(null);

  useEffect(() => {
    if (!MILESTONES.includes(streak as (typeof MILESTONES)[number])) return;
    const key = `cc_streak_milestone_${streak}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable (private mode etc.), skip rather than loop.
      return;
    }
    setMilestone(streak);
  }, [streak]);

  const close = () => setMilestone(null);
  const copy = milestone !== null ? MILESTONE_COPY[milestone] : undefined;

  return (
    <AnimatePresence>
      {milestone !== null && copy && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={copy.headline}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Dismiss celebration"
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm"
            onClick={close}
          />

          <motion.div
            className="glass-strong relative w-full max-w-sm overflow-hidden rounded-3xl p-8 text-center shadow-glow"
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 24 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
          >
            <Confetti />

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <motion.div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/15 text-amber-400 shadow-[0_0_40px_-6px_rgba(251,191,36,0.55)]"
              animate={
                reduceMotion
                  ? undefined
                  : { scale: [1, 1.12, 1], rotate: [0, -5, 5, 0] }
              }
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Flame className="h-10 w-10" fill="currentColor" />
            </motion.div>

            <p className="mt-5 font-display text-4xl font-bold text-white">
              {milestone}
              <span className="ml-1.5 text-lg font-semibold text-white/50">days</span>
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-gradient-capital">
              {copy.headline}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">{copy.body}</p>

            <div className="mt-6 flex flex-col gap-2">
              <Button href="/learn" size="md" className="w-full">
                Keep the streak going
              </Button>
              <Button variant="ghost" size="sm" className="w-full" onClick={close}>
                Back to dashboard
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
