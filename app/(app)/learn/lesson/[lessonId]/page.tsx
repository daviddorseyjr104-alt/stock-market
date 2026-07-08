"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, HeartCrack, Lightbulb, Sparkles, X } from "lucide-react";

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Progress";
import { HeartCounter } from "@/components/game/HeartCounter";
import { ComboMeter } from "@/components/game/ComboMeter";
import { AchievementModal } from "@/components/game/AchievementModal";
import { QuizCard } from "@/components/learn/QuizCard";
import { CompletionScreen } from "@/components/learn/CompletionScreen";
import { courseLessonById, courseById } from "@/lib/data/courses";
import { useAppState, type LessonReward } from "@/lib/store";
import type { LessonCard } from "@/lib/types";

export default function LessonPlayerPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const lesson = courseLessonById(params.lessonId);
  if (!lesson) notFound();

  const course = courseById(lesson.courseId);
  const cards = lesson.cards;
  const totalQuestions = useMemo(
    () => cards.filter((c) => c.kind === "question").length,
    [cards],
  );

  const { hearts, recordAnswer, completeLesson, profile } = useAppState();

  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false); // current question resolved?
  const [correctCount, setCorrectCount] = useState(0);
  const [questionXp, setQuestionXp] = useState(0);
  const [combo, setCombo] = useState(0); // consecutive correct answers
  const [pop, setPop] = useState<{ id: number; amount: number } | null>(null); // floating +XP
  const [shake, setShake] = useState(0); // bump to trigger a wrong-answer shake
  const [reward, setReward] = useState<LessonReward | null>(null);
  const [newBadgeId, setNewBadgeId] = useState<string | null>(null);
  const finishedRef = useRef(false);
  const popId = useRef(0);

  const card = cards[index];
  const isLast = index >= cards.length - 1;
  const dead = hearts <= 0 && !reward; // ran out mid-lesson
  const progressPct = reward
    ? 100
    : Math.round((index / Math.max(1, cards.length)) * 100);

  function finish() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const r = completeLesson(lesson!.id);
    setReward(r);
    if (r.newBadgeIds.length > 0) setNewBadgeId(r.newBadgeIds[0]);
  }

  function advance() {
    if (isLast) {
      finish();
    } else {
      setIndex((i) => i + 1);
      setAnswered(false);
    }
  }

  function onAnswer(correct: boolean) {
    const c = card as Extract<LessonCard, { kind: "question" }>;
    const base = c.xp ?? 10;
    setAnswered(true);
    if (correct) {
      const nextCombo = combo + 1;
      // Combo bonus: +2 XP per streak step past the first, capped at +10.
      const bonus = Math.min(10, Math.max(0, nextCombo - 1) * 2);
      const gained = base + bonus;
      recordAnswer(true, gained);
      setCombo(nextCombo);
      setCorrectCount((n) => n + 1);
      setQuestionXp((x) => x + gained);
      popId.current += 1;
      setPop({ id: popId.current, amount: gained });
    } else {
      recordAnswer(false, base);
      setCombo(0);
      setShake((s) => s + 1);
    }
  }

  function retry() {
    finishedRef.current = false;
    setReward(null);
    setNewBadgeId(null);
    setIndex(0);
    setAnswered(false);
    setCorrectCount(0);
    setQuestionXp(0);
    setCombo(0);
    setPop(null);
  }

  // ── Completion ──────────────────────────────────────────────────────────
  if (reward) {
    return (
      <div className="mx-auto max-w-xl">
        <TopBar progressPct={100} hearts={hearts} maxHearts={profile.maxHearts ?? 5} />
        <div className="mt-6">
          <CompletionScreen
            reward={reward}
            correct={correctCount}
            total={totalQuestions}
            hearts={hearts}
            maxHearts={profile.maxHearts ?? 5}
            streak={profile.streak}
            questionXp={questionXp}
            onRetry={retry}
          />
        </div>
        <AchievementModal
          badgeId={newBadgeId}
          open={newBadgeId !== null}
          onClose={() => setNewBadgeId(null)}
        />
      </div>
    );
  }

  // ── Out of hearts ───────────────────────────────────────────────────────
  if (dead) {
    return (
      <div className="mx-auto max-w-xl">
        <TopBar progressPct={progressPct} hearts={0} maxHearts={profile.maxHearts ?? 5} />
        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-rose-500/25 bg-rose-500/[0.06] p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400">
            <HeartCrack className="h-8 w-8" aria-hidden />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">
            Out of hearts
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            You ran out of hearts, so this attempt didn&apos;t finish. Your hearts
            refill tomorrow, come back and run it again to lock in the XP.
          </p>
          <div className="mt-1 flex flex-col gap-2.5 sm:flex-row">
            <Button href="/learn" size="lg">
              Back to path
            </Button>
            <Button variant="outline" size="lg" onClick={retry}>
              Try from the top
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Playing ─────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-xl">
      <TopBar progressPct={progressPct} hearts={hearts} maxHearts={profile.maxHearts ?? 5} />

      <div className="mt-3 flex min-h-[26px] items-center justify-center">
        <ComboMeter combo={combo} />
      </div>

      {course && (
        <p className="mt-1 text-center text-xs font-semibold uppercase tracking-wider text-white/40">
          {course.title} · {lesson.title}
        </p>
      )}

      <motion.div
        // Re-key on `shake` to replay the shake animation on each wrong answer.
        key={shake}
        animate={shake > 0 ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="relative mt-4 rounded-3xl border border-white/8 bg-white/[0.03] p-5 shadow-card sm:p-7"
      >
        {/* Floating +XP burst on a correct answer */}
        <AnimatePresence>
          {pop && (
            <motion.div
              key={pop.id}
              initial={{ opacity: 0, y: 8, scale: 0.7 }}
              animate={{ opacity: 1, y: -18, scale: 1 }}
              exit={{ opacity: 0, y: -44 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              onAnimationComplete={() => setPop(null)}
              className="pointer-events-none absolute right-5 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-violet-500/90 px-2.5 py-1 text-sm font-extrabold text-white shadow-glow-violet"
            >
              <Zap className="h-3.5 w-3.5" fill="currentColor" aria-hidden />+{pop.amount} XP
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -22 }}
            transition={{ duration: 0.28, ease: [0.21, 0.6, 0.35, 1] }}
          >
            {card.kind === "teach" ? (
              <TeachView card={card} />
            ) : (
              <QuizCard question={card} onAnswer={onAnswer} disabled={answered} />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="text-xs text-white/40">
            {index + 1} / {cards.length}
          </span>
          {card.kind === "teach" ? (
            <Button onClick={advance} size="md">
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          ) : (
            <Button onClick={advance} size="md" disabled={!answered}>
              {isLast ? "Finish lesson" : "Continue"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function TopBar({
  progressPct,
  hearts,
  maxHearts,
}: {
  progressPct: number;
  hearts: number;
  maxHearts: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/learn"
        aria-label="Exit lesson"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-focus"
      >
        <X className="h-5 w-5" aria-hidden />
      </Link>
      <ProgressBar value={progressPct} className="flex-1" />
      <HeartCounter hearts={hearts} max={maxHearts} className="shrink-0" />
    </div>
  );
}

function TeachView({
  card,
}: {
  card: Extract<LessonCard, { kind: "teach" }>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-capital-300">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-capital-400/15">
          <Sparkles className="h-4 w-4" aria-hidden />
        </span>
        <span className="text-xs font-bold uppercase tracking-wider">Learn</span>
      </div>
      <h1 className="font-display text-xl font-bold leading-snug tracking-tight text-white">
        {card.title}
      </h1>
      <p className="text-[15px] leading-relaxed text-white/75">{card.body}</p>
      {card.example && (
        <div className="rounded-2xl border border-capital-400/20 bg-capital-400/[0.06] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-capital-300">
            For example
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-white/80">{card.example}</p>
        </div>
      )}
      {card.analogy && (
        <div className="flex gap-3 rounded-2xl border border-violet-500/20 bg-violet-500/[0.06] p-4">
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" aria-hidden />
          <p className="text-sm italic leading-relaxed text-white/75">{card.analogy}</p>
        </div>
      )}
    </div>
  );
}
