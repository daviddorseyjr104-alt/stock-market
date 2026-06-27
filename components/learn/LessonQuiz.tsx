"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/types";
import { useAppState, type LessonReward } from "@/lib/store";
import { badgeById } from "@/lib/data/badges";
import { track } from "@/lib/analytics";

export function LessonQuiz({
  quiz,
  xp,
  lessonId,
}: {
  quiz: QuizQuestion[];
  xp: number;
  lessonId: string;
}) {
  const { completeLesson } = useAppState();
  const total = quiz.length;
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [reward, setReward] = useState<LessonReward | null>(null);

  const question = quiz[step];
  const answeredIndex = answers[question?.id];
  const isAnswered = answeredIndex !== undefined;
  const isCorrect = isAnswered && answeredIndex === question.correctIndex;

  const correctCount = useMemo(
    () =>
      quiz.reduce(
        (sum, q) => sum + (answers[q.id] === q.correctIndex ? 1 : 0),
        0,
      ),
    [answers, quiz],
  );

  const progressPct = done
    ? 100
    : Math.round((Object.keys(answers).length / total) * 100);

  function submit() {
    if (selected === null || isAnswered) return;
    setAnswers((prev) => ({ ...prev, [question.id]: selected }));
  }

  function next() {
    if (step < total - 1) {
      setStep((s) => s + 1);
      setSelected(null);
    } else {
      // Finishing the quiz is what actually completes the lesson: awards XP,
      // advances the streak, and recomputes badges in the persistent store.
      const r = completeLesson(lessonId);
      setReward(r);
      setDone(true);
      track("quiz_finished", { lessonId, correct: correctCount, total });
      if (!r.alreadyDone) track("lesson_completed", { lessonId, xp: r.xpGained });
    }
  }

  function restart() {
    setStep(0);
    setSelected(null);
    setAnswers({});
    setDone(false);
  }

  const earnedXp = reward && !reward.alreadyDone ? reward.xpGained : 0;
  const newBadges = reward?.newBadgeIds ?? [];

  if (!total) return null;

  // ── Success state ────────────────────────────────────────────────────
  if (done) {
    const perfect = correctCount === total;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.6, 0.35, 1] }}
        className="relative overflow-hidden rounded-3xl border border-capital-400/25 bg-capital-400/[0.06] p-8 text-center shadow-glow"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-56 w-56 rounded-full bg-capital-gradient opacity-25 blur-3xl"
        />
        <div className="relative flex flex-col items-center gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-capital-gradient text-ink-950 shadow-glow"
          >
            <Trophy className="h-8 w-8" />
          </motion.div>

          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight text-white">
              {earnedXp > 0
                ? `Quiz complete! +${earnedXp} XP earned 🎉`
                : "Quiz complete, lesson reviewed ✅"}
            </h3>
            <p className="mt-1.5 text-sm text-white/60">
              {reward?.alreadyDone
                ? "You'd already completed this lesson, so no new XP, but great refresher."
                : perfect
                  ? "Flawless run, you nailed every question."
                  : `You got ${correctCount} of ${total} right. Review and run it back to lock it in.`}
            </p>
          </div>

          {/* Level-up + badge awards (real, from the store) */}
          {reward?.leveledUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-200"
            >
              <Trophy className="h-4 w-4" /> Level up! You reached a new level.
            </motion.div>
          )}
          {newBadges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {newBadges.map((id) => (
                <motion.span
                  key={id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm font-semibold text-violet-300"
                >
                  <Sparkles className="h-4 w-4" /> New badge: {badgeById(id)?.name ?? id}
                </motion.span>
              ))}
            </div>
          )}

          {/* Score dots */}
          <div className="flex items-center gap-1.5">
            {quiz.map((q) => {
              const ok = answers[q.id] === q.correctIndex;
              return (
                <span
                  key={q.id}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    ok ? "bg-capital-400" : "bg-rose-500/70",
                  )}
                />
              );
            })}
          </div>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-capital-400/20 bg-capital-400/10 px-3 py-1 text-sm font-semibold text-capital-300">
              <Zap className="h-4 w-4" />
              {earnedXp > 0 ? `+${earnedXp} XP` : `${xp} XP value`}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-white/70">
              <CheckCircle2 className="h-4 w-4 text-capital-300" />
              {correctCount}/{total} correct
            </span>
          </div>

          <Button variant="secondary" size="sm" onClick={restart} className="mt-1">
            <RotateCcw className="h-4 w-4" />
            Retake quiz
          </Button>
        </div>
      </motion.div>
    );
  }

  // ── Question state ───────────────────────────────────────────────────
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-card sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-white/45">
            Quick check
          </span>
        </div>
        <span className="text-xs font-medium text-white/45">
          Question {step + 1} of {total}
        </span>
      </div>

      <ProgressBar value={progressPct} className="mb-6" />

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: [0.21, 0.6, 0.35, 1] }}
        >
          <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-white">
            {question.prompt}
          </h3>

          <div className="mt-5 space-y-3">
            {question.options.map((option, i) => {
              const isPicked = isAnswered
                ? answeredIndex === i
                : selected === i;
              const isRight = i === question.correctIndex;

              const stateClass = isAnswered
                ? isRight
                  ? "border-capital-400/60 bg-capital-400/10 ring-1 ring-capital-400/50"
                  : isPicked
                    ? "border-rose-500/60 bg-rose-500/10 ring-1 ring-rose-500/50"
                    : "border-white/8 bg-white/[0.02] opacity-60"
                : isPicked
                  ? "border-capital-400/50 bg-capital-400/[0.07] ring-1 ring-capital-400/40"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5";

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => !isAnswered && setSelected(i)}
                  disabled={isAnswered}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm text-white transition-all duration-200 focus-visible:ring-focus",
                    !isAnswered && "active:scale-[0.99]",
                    stateClass,
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold",
                        isPicked && !isAnswered
                          ? "border-capital-400/50 text-capital-300"
                          : "border-white/15 text-white/50",
                      )}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </span>
                  {isAnswered && isRight && (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-capital-300" />
                  )}
                  {isAnswered && isPicked && !isRight && (
                    <XCircle className="h-5 w-5 shrink-0 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className={cn(
                    "mt-5 flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed",
                    isCorrect
                      ? "border-capital-400/20 bg-capital-400/[0.06] text-white/75"
                      : "border-rose-500/20 bg-rose-500/[0.06] text-white/75",
                  )}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-capital-300" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
                  )}
                  <div>
                    <p className="font-semibold text-white">
                      {isCorrect ? "Correct!" : "Not quite."}
                    </p>
                    <p className="mt-0.5">{question.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between gap-3">
            <span className="text-xs text-white/40">
              {correctCount} correct so far
            </span>
            {isAnswered ? (
              <Button onClick={next} size="md">
                {step < total - 1 ? "Next question" : "Finish quiz"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={submit} disabled={selected === null} size="md">
                Submit answer
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
