"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { badgeById } from "@/lib/data/badges";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Confetti } from "./Confetti";

const rarityTone: Record<string, "default" | "sky" | "violet" | "amber"> = {
  Common: "default",
  Rare: "sky",
  Epic: "violet",
  Legendary: "amber",
};

function iconFor(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Award;
}

/**
 * Badge celebration modal, confetti burst, badge art, dismiss button.
 * No-op when `badgeId` is null (renders nothing even if `open`).
 */
export function AchievementModal({
  badgeId,
  open,
  onClose,
}: {
  badgeId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const badge = badgeId ? badgeById(badgeId) : undefined;
  const show = open && !!badge;

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && badge && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Badge unlocked: ${badge.name}`}
        >
          <motion.div
            className="glass-strong relative w-full max-w-sm overflow-hidden rounded-3xl p-7 text-center shadow-float"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 28 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Confetti />

            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-capital-300">
              Badge unlocked
            </p>

            {/* Badge art */}
            <motion.div
              className={`mx-auto mt-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${badge.color} text-ink-950 shadow-glow`}
              initial={reduceMotion ? false : { scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.12 }}
            >
              {(() => {
                const Icon = iconFor(badge.icon);
                return <Icon className="h-11 w-11" strokeWidth={2.2} aria-hidden />;
              })()}
            </motion.div>

            <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-white">
              {badge.name}
            </h2>
            <div className="mt-2 flex justify-center">
              <Pill tone={rarityTone[badge.rarity] ?? "default"}>{badge.rarity}</Pill>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              {badge.description}
            </p>

            <Button className="mt-6 w-full" size="lg" onClick={onClose}>
              Claim badge
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
