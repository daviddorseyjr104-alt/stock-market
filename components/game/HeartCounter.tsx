"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared hearts (lives) display: `hearts` filled rose hearts out of `max`.
 * When a heart flips filled ↔ empty the changed heart re-mounts and "pops",
 * so gains and losses both animate. Reduced-motion aware.
 */
export function HeartCounter({
  hearts,
  max = 5,
  className,
}: {
  hearts: number;
  max?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const safeMax = Math.max(1, max);
  const filledCount = Math.max(0, Math.min(safeMax, hearts));

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="img"
      aria-label={`${filledCount} of ${safeMax} hearts remaining`}
    >
      {Array.from({ length: safeMax }, (_, i) => {
        const filled = i < filledCount;
        return (
          <motion.span
            // Re-mount when this heart's filled state flips → pop animation
            key={`${i}-${filled ? "full" : "empty"}`}
            initial={
              reduceMotion ? false : { scale: filled ? 0.3 : 1.45, opacity: 0.5 }
            }
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 520, damping: 20 }}
            className="inline-flex"
            aria-hidden
          >
            <Heart
              className={cn(
                "h-5 w-5",
                filled
                  ? "text-rose-400 drop-shadow-[0_0_6px_rgba(251,113,133,0.5)]"
                  : "text-white/15",
              )}
              fill={filled ? "currentColor" : "none"}
              strokeWidth={filled ? 0 : 2}
            />
          </motion.span>
        );
      })}
    </div>
  );
}
