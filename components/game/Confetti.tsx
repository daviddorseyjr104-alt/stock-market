"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Brand palette: capital greens, violet accent, celebratory amber.
const COLORS = [
  "#39f5ac",
  "#10e29a",
  "#7dffca",
  "#7c5cff",
  "#9d7bff",
  "#fbbf24",
  "#f59e0b",
];

interface Particle {
  id: number;
  xEnd: number;
  yPeak: number;
  yEnd: number;
  rotate: number;
  delay: number;
  duration: number;
  color: string;
  w: number;
  h: number;
  round: boolean;
}

function makeParticles(count = 46): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const round = Math.random() < 0.4;
    const w = round ? 6 + Math.random() * 5 : 5 + Math.random() * 5;
    return {
      id: i,
      xEnd: (Math.random() - 0.5) * 340,
      yPeak: -(50 + Math.random() * 170),
      yEnd: 130 + Math.random() * 200,
      rotate: (Math.random() - 0.5) * 720,
      delay: Math.random() * 0.18,
      duration: 1.15 + Math.random() * 0.75,
      color: COLORS[i % COLORS.length],
      w,
      h: round ? w : 9 + Math.random() * 7,
      round,
    };
  });
}

/**
 * A confetti burst built purely with framer-motion (no library).
 * Plays on mount when `run` is omitted, or every time `run` flips to true.
 * Renders nothing for users who prefer reduced motion.
 * Positioned absolutely, give the parent `relative` + `overflow-hidden`
 * or let it fill the nearest positioned ancestor.
 */
export function Confetti({ run }: { run?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [burst, setBurst] = useState(0);
  const prevRun = useRef<boolean>(false);

  useEffect(() => {
    if (run === undefined) {
      // No control prop → single burst on mount.
      setBurst(1);
      return;
    }
    if (run && !prevRun.current) setBurst((b) => b + 1);
    prevRun.current = run;
  }, [run]);

  const particles = useMemo(
    () => (burst > 0 ? makeParticles() : []),
    [burst],
  );

  if (reduceMotion || burst === 0) return null;

  return (
    <div
      key={burst}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-[36%] block"
          style={{
            width: p.w,
            height: p.h,
            backgroundColor: p.color,
            borderRadius: p.round ? 9999 : 2,
          }}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: p.xEnd,
            y: [0, p.yPeak, p.yEnd],
            scale: [0, 1, 1],
            rotate: p.rotate,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
