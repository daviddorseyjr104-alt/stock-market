"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lightbulb, MessageSquareText, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question } from "@/lib/types";
import { AnswerButton, type AnswerButtonState } from "./AnswerButton";
import { MatchQuestion } from "./MatchQuestion";

/** Contract-specified fill-in normalization: case- and space-insensitive. */
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

/** The correct answer stated in plain words, shown when the learner is wrong. */
function correctAnswerLabel(q: Question): string | null {
  if (q.type === "true-false") return q.correctBool ? "True" : "False";
  if (q.type === "mcq" || q.type === "scenario")
    return q.options?.[q.correctIndex ?? -1] ?? null;
  if (q.type === "fill-in") return q.accept?.[0] ?? null;
  // "match" has no single answer; the pairs are restated separately below.
  return null;
}

/**
 * Renders ONE question of any type (mcq / scenario / true-false / fill-in),
 * manages its own answered state, shows the hint affordance and the
 * explanation after answering, and reports correctness upward exactly once.
 * Re-key with `question.id` (or rely on the internal reset) between questions.
 */
export function QuizCard({
  question,
  onAnswer,
  disabled,
  className,
}: {
  question: Question;
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [text, setText] = useState("");
  const [showHint, setShowHint] = useState(false);

  // Safety reset if the parent reuses this instance for a new question.
  useEffect(() => {
    setChoice(null);
    setAnswered(false);
    setWasCorrect(false);
    setText("");
    setShowHint(false);
  }, [question.id]);

  const locked = answered || !!disabled;

  const settle = (correct: boolean, pickedIndex: number | null) => {
    if (locked) return;
    setChoice(pickedIndex);
    setAnswered(true);
    setWasCorrect(correct);
    onAnswer(correct);
  };

  // ── option state mapping (mcq / scenario / true-false) ────────────────────
  const optionState = (i: number, correctIdx: number): AnswerButtonState => {
    if (!answered) return "idle";
    if (i === correctIdx) return "correct";
    if (i === choice) return "wrong";
    return "muted";
  };

  const isChoiceType = question.type === "mcq" || question.type === "scenario";
  const tfCorrectIdx = question.correctBool ? 0 : 1;

  const submitFillIn = () => {
    if (locked || !text.trim()) return;
    const ok = (question.accept ?? []).some((a) => norm(a) === norm(text));
    settle(ok, null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Scenario setup */}
      {question.context && (
        <div className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-300">
            <MessageSquareText className="h-3.5 w-3.5" aria-hidden />
            Scenario
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-white/75">
            {question.context}
          </p>
        </div>
      )}

      {/* Prompt */}
      <h2 className="font-display text-lg font-bold leading-snug tracking-tight text-white">
        {question.prompt}
      </h2>

      {/* Answers */}
      {isChoiceType && (
        <div className="space-y-2.5">
          {(question.options ?? []).map((opt, i) => (
            <AnswerButton
              key={i}
              label={opt}
              index={i}
              state={optionState(i, question.correctIndex ?? -1)}
              disabled={locked}
              onClick={() => settle(i === question.correctIndex, i)}
            />
          ))}
        </div>
      )}

      {question.type === "true-false" && (
        <div className="grid grid-cols-2 gap-2.5">
          {(["True", "False"] as const).map((label, i) => (
            <AnswerButton
              key={label}
              label={label}
              state={optionState(i, tfCorrectIdx)}
              disabled={locked}
              onClick={() => settle((i === 0) === question.correctBool, i)}
            />
          ))}
        </div>
      )}

      {question.type === "fill-in" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitFillIn();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={locked}
            placeholder="Type your answer…"
            aria-label="Your answer"
            className={cn(
              "min-w-0 flex-1 rounded-2xl border bg-white/[0.04] px-4 py-3 text-sm font-medium text-white placeholder:text-white/30 outline-none transition-colors focus-visible:ring-focus",
              !answered && "border-white/12 focus:border-capital-400/50",
              answered && wasCorrect && "border-capital-400/70 bg-capital-400/10 text-capital-200",
              answered && !wasCorrect && "border-rose-500/60 bg-rose-500/10 text-rose-300",
            )}
          />
          {!answered && (
            <button
              type="submit"
              disabled={locked || !text.trim()}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl bg-capital-gradient px-4 py-3 text-sm font-bold text-ink-950 shadow-glow transition-all hover:brightness-110 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-focus"
            >
              <Send className="h-4 w-4" aria-hidden />
              Check
            </button>
          )}
        </form>
      )}

      {question.type === "match" && (
        <MatchQuestion
          pairs={question.pairs ?? []}
          disabled={locked}
          onResolve={(correct) => settle(correct, null)}
        />
      )}

      {/* Hint affordance (before answering) */}
      {question.hint && !answered && (
        <div>
          <button
            type="button"
            onClick={() => setShowHint((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-400/15 focus-visible:ring-focus"
            aria-expanded={showHint}
          >
            <Lightbulb className="h-3.5 w-3.5" aria-hidden />
            {showHint ? "Hide hint" : "Need a hint?"}
          </button>
          <AnimatePresence>
            {showHint && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 overflow-hidden text-sm italic leading-relaxed text-amber-200/80"
              >
                {question.hint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Explanation after answering */}
      <AnimatePresence>
        {answered && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.6, 0.35, 1] }}
            className={cn(
              "rounded-2xl border p-4",
              wasCorrect
                ? "border-capital-400/30 bg-capital-400/[0.08]"
                : "border-rose-500/30 bg-rose-500/[0.08]",
            )}
          >
            <p
              className={cn(
                "flex items-center gap-1.5 text-sm font-bold",
                wasCorrect ? "text-capital-300" : "text-rose-400",
              )}
            >
              {wasCorrect ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                  Nice, that&apos;s right!
                </>
              ) : (
                <>
                  <X className="h-4 w-4" strokeWidth={3} aria-hidden />
                  Not quite
                </>
              )}
            </p>
            {!wasCorrect && correctAnswerLabel(question) && (
              <p className="mt-1.5 text-sm font-semibold text-white/80">
                Correct answer:{" "}
                <span className="text-capital-300">{correctAnswerLabel(question)}</span>
              </p>
            )}
            {/* A missed match resolves only once every pair is right, so the
                board alone just proves you brute-forced it. Restate the pairs. */}
            {!wasCorrect && question.type === "match" && question.pairs && (
              <dl className="mt-2 space-y-1.5">
                {question.pairs.map((pair) => (
                  <div key={pair.left} className="flex flex-wrap gap-x-1.5 text-sm">
                    <dt className="font-semibold text-capital-300">{pair.left}</dt>
                    <dd className="text-white/75">— {pair.right}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="mt-1.5 text-sm leading-relaxed text-white/75">
              {question.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
