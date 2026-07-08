"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  ChevronsUp,
  PartyPopper,
  RotateCcw,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Confetti } from "@/components/game/Confetti";
import { HeartCounter } from "@/components/game/HeartCounter";
import { StreakCard } from "@/components/game/StreakCard";
import { badgeById } from "@/lib/data/badges";
import { courseById } from "@/lib/data/courses";
import { useAppState, type LessonReward } from "@/lib/store";
import { cn } from "@/lib/utils";

function iconFor(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Award;
}

function StatTile({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-3.5">
      {children}
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
        {label}
      </p>
    </div>
  );
}

/**
 * End-of-lesson celebration: XP earned, accuracy, hearts left, streak, plus
 * any level-up / new badges / certificate carried by the LessonReward.
 * `questionXp` is the XP already earned from correct answers this run, so the
 * headline number reflects the whole session.
 */
export function CompletionScreen({
  reward,
  correct,
  total,
  hearts,
  maxHearts = 5,
  streak,
  questionXp = 0,
  onRetry,
  className,
}: {
  reward: LessonReward;
  correct: number;
  total: number;
  hearts: number;
  maxHearts?: number;
  streak: number;
  questionXp?: number;
  onRetry: () => void;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { profile } = useAppState();

  const totalXp = reward.xpGained + questionXp;
  const perfect = total > 0 && correct === total;
  const completedCourse = reward.courseCompletedId
    ? courseById(reward.courseCompletedId)
    : undefined;
  const newBadges = reward.newBadgeIds
    .map((id) => badgeById(id))
    .filter((b): b is NonNullable<typeof b> => !!b);

  const continueHref = reward.unlockedLessonId
    ? `/learn/lesson/${reward.unlockedLessonId}`
    : "/learn";

  return (
    <Card className={cn("relative overflow-hidden p-6 sm:p-8", className)}>
      <Confetti />

      <motion.div
        className="relative flex flex-col items-center text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.21, 0.6, 0.35, 1] }}
      >
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-full bg-capital-gradient text-ink-950 shadow-glow"
          initial={reduceMotion ? false : { scale: 0, rotate: -16 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.1 }}
        >
          {perfect ? (
            <Trophy className="h-9 w-9" aria-hidden />
          ) : (
            <PartyPopper className="h-9 w-9" aria-hidden />
          )}
        </motion.div>

        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {reward.alreadyDone
            ? "Review complete!"
            : perfect
              ? "Flawless finish!"
              : "Lesson complete!"}
        </h1>
        <p className="mt-1.5 text-sm text-white/55">
          {reward.alreadyDone
            ? "Already mastered, reviewing keeps it fresh (no repeat XP)."
            : perfect
              ? "Every answer right. Certified money brain moment."
              : "Progress locked in. Keep the momentum going."}
        </p>

        {/* Stats */}
        <div className="mt-6 grid w-full grid-cols-3 gap-2.5">
          <StatTile label="XP earned">
            <p className="flex items-center gap-1 font-display text-lg font-bold text-violet-400">
              <Zap className="h-4 w-4" fill="currentColor" aria-hidden />+{totalXp}
            </p>
          </StatTile>
          <StatTile label="Correct">
            <p className="flex items-center gap-1 font-display text-lg font-bold text-capital-300">
              <Target className="h-4 w-4" aria-hidden />
              {correct}/{total}
            </p>
          </StatTile>
          <StatTile label="Hearts left">
            <HeartCounter hearts={hearts} max={maxHearts} className="scale-[0.8]" />
          </StatTile>
        </div>

        <StreakCard streak={streak} className="mt-2.5 w-full" />

        {/* Level up */}
        {reward.leveledUp && (
          <motion.div
            className="mt-2.5 flex w-full items-center gap-3 rounded-3xl border border-violet-500/30 bg-violet-500/10 p-4"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400">
              <ChevronsUp className="h-6 w-6" aria-hidden />
            </div>
            <div className="text-left">
              <p className="font-display text-base font-bold text-white">
                Level up! You&apos;re now level {profile.level}
              </p>
              <p className="text-xs text-white/55">
                New courses may have just unlocked, check the switcher.
              </p>
            </div>
          </motion.div>
        )}

        {/* Certificate */}
        {completedCourse && (
          <motion.div
            className="mt-2.5 flex w-full items-center gap-3 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300">
              <Award className="h-6 w-6" aria-hidden />
            </div>
            <div className="text-left">
              <p className="font-display text-base font-bold text-white">
                Certificate earned
              </p>
              <p className="text-xs text-white/55">
                You finished every lesson in {completedCourse.title}. It&apos;s
                saved to your profile.
              </p>
            </div>
          </motion.div>
        )}

        {/* New badges */}
        {newBadges.length > 0 && (
          <div className="mt-2.5 w-full rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/45">
              New badge{newBadges.length > 1 ? "s" : ""} unlocked
            </p>
            <div className="mt-2.5 flex flex-wrap justify-center gap-2">
              {newBadges.map((badge, i) => {
                const Icon = iconFor(badge.icon);
                return (
                  <motion.span
                    key={badge.id}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + i * 0.08 }}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${badge.color} text-ink-950`}
                    >
                      <Icon className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {badge.name}
                    </span>
                  </motion.span>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex w-full flex-col gap-2.5 sm:flex-row">
          <Button href={continueHref} size="lg" className="w-full sm:flex-1">
            {reward.unlockedLessonId ? "Continue" : "Back to path"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={onRetry}
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Retry lesson
          </Button>
        </div>
      </motion.div>
    </Card>
  );
}
