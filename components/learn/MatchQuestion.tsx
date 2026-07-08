"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchPair } from "@/lib/types";

/** Deterministic string hash (djb2), keeps the shuffle stable across SSR/CSR. */
function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}

/** Seeded shuffle so the right column order is stable but not aligned with the left. */
function seededOrder(pairs: MatchPair[]): number[] {
  const seedBase = hash(pairs.map((p) => p.right).join("|"));
  return pairs
    .map((p, i) => ({ i, k: hash(p.right + i) ^ seedBase }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.i);
}

type Side = "left" | "right";

/**
 * Tap-to-match question: connect each term on the left to its meaning on the
 * right. A correct pair locks in green; a wrong tap flashes red and counts a
 * miss. When every pair is matched, resolves, correct only if there were no
 * misses (so hearts + combos stay meaningful).
 */
export function MatchQuestion({
  pairs,
  onResolve,
  disabled,
}: {
  pairs: MatchPair[];
  onResolve: (correct: boolean) => void;
  disabled?: boolean;
}) {
  const rightOrder = useMemo(() => seededOrder(pairs), [pairs]);
  const [selected, setSelected] = useState<{ side: Side; index: number } | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set()); // left indices matched
  const [wrong, setWrong] = useState<{ left: number; right: number } | null>(null);
  const [misses, setMisses] = useState(0);
  const resolved = useRef(false);
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lockedRightPositions = useMemo(() => {
    // A right slot is locked once its underlying pair index is matched.
    const set = new Set<number>();
    rightOrder.forEach((pairIdx, pos) => {
      if (matched.has(pairIdx)) set.add(pos);
    });
    return set;
  }, [matched, rightOrder]);

  function tryMatch(leftIdx: number, rightPos: number) {
    const rightPairIdx = rightOrder[rightPos];
    if (leftIdx === rightPairIdx) {
      const next = new Set(matched);
      next.add(leftIdx);
      setMatched(next);
      setSelected(null);
      if (next.size === pairs.length && !resolved.current) {
        resolved.current = true;
        onResolve(misses === 0);
      }
    } else {
      setMisses((m) => m + 1);
      setWrong({ left: leftIdx, right: rightPos });
      setSelected(null);
      if (wrongTimer.current) clearTimeout(wrongTimer.current);
      wrongTimer.current = setTimeout(() => setWrong(null), 500);
    }
  }

  function pick(side: Side, index: number) {
    if (disabled || resolved.current) return;
    if (side === "left" && matched.has(index)) return;
    if (side === "right" && lockedRightPositions.has(index)) return;

    if (!selected) {
      setSelected({ side, index });
      return;
    }
    if (selected.side === side) {
      setSelected({ side, index }); // switch selection within the same column
      return;
    }
    const leftIdx = side === "left" ? index : selected.index;
    const rightPos = side === "right" ? index : selected.index;
    tryMatch(leftIdx, rightPos);
  }

  const cellBase =
    "flex min-h-[52px] items-center justify-center rounded-2xl border px-3 py-2.5 text-center text-sm font-semibold leading-snug transition-all duration-200 focus-visible:ring-focus";

  return (
    <div className="grid grid-cols-2 gap-2.5" role="group" aria-label="Match the pairs">
      {/* Left column: terms */}
      <div className="space-y-2.5">
        {pairs.map((p, i) => {
          const isMatched = matched.has(i);
          const isSel = selected?.side === "left" && selected.index === i;
          const isWrong = wrong?.left === i;
          return (
            <motion.button
              key={`l-${i}`}
              type="button"
              disabled={disabled || isMatched}
              onClick={() => pick("left", i)}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className={cn(
                cellBase,
                isMatched
                  ? "border-capital-400/50 bg-capital-400/10 text-capital-200"
                  : isWrong
                    ? "border-rose-500/60 bg-rose-500/10 text-rose-300"
                    : isSel
                      ? "border-violet-400/70 bg-violet-500/15 text-white ring-1 ring-violet-400/50"
                      : "border-white/12 bg-white/[0.04] text-white/85 hover:border-white/25 active:scale-[0.98]",
              )}
            >
              <span className="min-w-0">{p.left}</span>
              {isMatched && <Check className="ml-1.5 h-4 w-4 shrink-0 text-capital-300" strokeWidth={3} aria-hidden />}
            </motion.button>
          );
        })}
      </div>

      {/* Right column: meanings (shuffled) */}
      <div className="space-y-2.5">
        {rightOrder.map((pairIdx, pos) => {
          const isMatched = lockedRightPositions.has(pos);
          const isSel = selected?.side === "right" && selected.index === pos;
          const isWrong = wrong?.right === pos;
          return (
            <motion.button
              key={`r-${pos}`}
              type="button"
              disabled={disabled || isMatched}
              onClick={() => pick("right", pos)}
              animate={isWrong ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className={cn(
                cellBase,
                isMatched
                  ? "border-capital-400/50 bg-capital-400/10 text-capital-200"
                  : isWrong
                    ? "border-rose-500/60 bg-rose-500/10 text-rose-300"
                    : isSel
                      ? "border-violet-400/70 bg-violet-500/15 text-white ring-1 ring-violet-400/50"
                      : "border-white/12 bg-white/[0.04] text-white/85 hover:border-white/25 active:scale-[0.98]",
              )}
            >
              <span className="min-w-0">{pairs[pairIdx].right}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
