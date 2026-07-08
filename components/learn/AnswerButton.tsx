"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type AnswerButtonState = "idle" | "selected" | "correct" | "wrong" | "muted";

const surface: Record<AnswerButtonState, string> = {
  idle: "border-white/12 bg-white/[0.04] text-white/85 hover:border-white/25 hover:bg-white/[0.07] active:scale-[0.99]",
  selected: "border-violet-400/60 bg-violet-500/10 text-white",
  correct:
    "border-capital-400/70 bg-capital-400/10 text-capital-200 shadow-[0_0_24px_-8px_rgba(57,245,172,0.5)]",
  wrong: "border-rose-500/60 bg-rose-500/10 text-rose-300",
  muted: "border-white/8 bg-white/[0.02] text-white/35",
};

const chip: Record<AnswerButtonState, string> = {
  idle: "border-white/15 bg-white/5 text-white/60",
  selected: "border-violet-400/50 bg-violet-500/15 text-violet-400",
  correct: "border-capital-400/50 bg-capital-400/15 text-capital-300",
  wrong: "border-rose-500/50 bg-rose-500/15 text-rose-400",
  muted: "border-white/8 bg-white/[0.03] text-white/25",
};

/**
 * Duolingo-style answer choice with an optional letter chip (A/B/C/…).
 * Purely presentational, state is driven by the parent.
 */
export function AnswerButton({
  label,
  index,
  state,
  onClick,
  disabled,
}: {
  label: string;
  index?: number;
  state: "idle" | "selected" | "correct" | "wrong" | "muted";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const letter = index !== undefined ? String.fromCharCode(65 + index) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={state === "selected"}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-medium",
        "shadow-[inset_0_-3px_0_rgba(0,0,0,0.28)] transition-all duration-200 focus-visible:ring-focus",
        surface[state],
        disabled && "pointer-events-none",
      )}
    >
      {letter !== null && (
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition-colors",
            chip[state],
          )}
          aria-hidden
        >
          {letter}
        </span>
      )}
      <span className="min-w-0 flex-1 leading-snug">{label}</span>
      {state === "correct" && (
        <Check className="h-5 w-5 shrink-0 text-capital-300" strokeWidth={3} aria-hidden />
      )}
      {state === "wrong" && (
        <X className="h-5 w-5 shrink-0 text-rose-400" strokeWidth={3} aria-hidden />
      )}
    </button>
  );
}
