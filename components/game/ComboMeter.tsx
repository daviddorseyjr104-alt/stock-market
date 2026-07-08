"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * In-lesson combo streak. Shows a flame + multiplier that pops each time the
 * combo grows, and hides below 2 (no combo yet). Purely presentational.
 */
export function ComboMeter({ combo, className }: { combo: number; className?: string }) {
  const active = combo >= 2;
  // Warmer color the higher the streak climbs.
  const tone =
    combo >= 6
      ? "from-rose-500 to-amber-400 text-ink-950"
      : combo >= 4
        ? "from-amber-400 to-orange-500 text-ink-950"
        : "from-amber-300 to-amber-500 text-ink-950";

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="combo"
          initial={{ opacity: 0, scale: 0.6, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 320, damping: 18 }}
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2.5 py-1 shadow-glow",
            tone,
            className,
          )}
        >
          <Flame className="h-3.5 w-3.5" fill="currentColor" aria-hidden />
          {/* Re-key on combo so the number itself pops on each increment. */}
          <motion.span
            key={combo}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="font-display text-xs font-extrabold"
          >
            {combo}× combo
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
