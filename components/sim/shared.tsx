"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useSpring } from "framer-motion";
import { Check, FolderHeart, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RingProgress } from "@/components/ui/Progress";
import { springSoft } from "@/lib/motion";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Shared recharts tooltip style (matches the portfolio sim). */
export const TOOLTIP_STYLE: React.CSSProperties = {
  background: "#11141f",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  fontSize: 12,
};

export const CHART_COLORS = ["#39f5ac", "#7c5cff", "#38bdf8", "#fbbf24", "#fb7185", "#34d399", "#c084fc", "#60a5fa"];

/**
 * Spring-driven count-up that FOLLOWS live value changes (sliders feel
 * buttery instead of snapping). Counts from 0 on mount for the reveal.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const spring = useSpring(0, { stiffness: 120, damping: 26, mass: 0.9 });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  useMotionValueEvent(spring, "change", (v) => setDisplay(v));
  const neg = display < -(0.5 / Math.pow(10, decimals));
  return (
    <span className={cn("tabular-nums", className)}>
      {neg && "-"}
      {prefix}
      {Math.abs(display).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/** RingProgress that draws in from 0 on mount, then eases to every new value. */
export function AnimatedRing({
  value,
  size = 92,
  stroke = 8,
  children,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
  className?: string;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setV(value), 80);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <RingProgress value={v} size={size} stroke={stroke} className={className}>
      {children}
    </RingProgress>
  );
}

/**
 * Springy result reveal, pops content in on mount and re-pops whenever
 * `revealKey` changes (e.g. the verdict flips from "risky" to "viable").
 */
export function PopReveal({
  children,
  revealKey,
  className,
}: {
  children: React.ReactNode;
  revealKey?: string | number;
  className?: string;
}) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={revealKey ?? "static"}
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -6 }}
        transition={springSoft}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/** Labeled numeric input with an optional prefix/suffix, student-proof clamping. */
export function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
  step,
  hint,
  className,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">{label}</span>
      <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-ink-900 px-3 transition-shadow focus-within:border-capital-400/50 focus-within:shadow-[0_0_24px_-8px_rgba(57,245,172,0.45)]">
        {prefix && <span className="text-sm text-white/40">{prefix}</span>}
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            let n = Number(e.target.value);
            if (!Number.isFinite(n)) n = min;
            if (max !== undefined) n = Math.min(max, n);
            onChange(Math.max(min, n));
          }}
          className="w-full bg-transparent py-2.5 text-sm text-white focus:outline-none"
        />
        {suffix && <span className="shrink-0 text-sm text-white/40">{suffix}</span>}
      </span>
      {hint && <span className="mt-1 block text-[11px] text-white/35">{hint}</span>}
    </label>
  );
}

/** Labeled range slider with a live formatted value. */
export function SliderField({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  format = (n: number) => String(n),
  hint,
  className,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: (n: number) => string;
  hint?: string;
  className?: string;
}) {
  const pct = max > min ? Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100)) : 0;
  return (
    <div className={cn("group", className)}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="text-sm text-white/70 transition-colors group-hover:text-white/90">{label}</span>
        <span className="rounded-lg bg-white/[0.04] px-2 py-0.5 font-mono text-sm font-semibold tabular-nums text-white">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-capital-400 transition-[filter] group-hover:brightness-110"
        style={{
          background: `linear-gradient(to right, rgba(57,245,172,0.9), rgba(124,92,255,0.85) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`,
        }}
        aria-label={label}
      />
      {hint && <p className="mt-0.5 text-[11px] text-white/35">{hint}</p>}
    </div>
  );
}

/** Segmented chip picker (single choice). */
export function ChoiceChips<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={cn(
            "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors",
            value === o.value
              ? "border-capital-400/50 bg-capital-400/10 text-capital-200"
              : "border-white/10 text-white/55 hover:border-white/25 hover:text-white",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * "Save to profile", calls the store's saveProject and confirms inline.
 * `data` is captured at click time via the getter so it's always current.
 */
export function SaveProjectButton({
  kind,
  title,
  getSummary,
  getData,
  disabled,
  className,
}: {
  kind: string;
  title: string;
  getSummary: () => string;
  getData: () => Record<string, unknown>;
  disabled?: boolean;
  className?: string;
}) {
  const { saveProject } = useAppState();
  const [saved, setSaved] = useState(false);

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <Button
        onClick={() => {
          saveProject({ kind, title, summary: getSummary(), data: getData() });
          setSaved(true);
          setTimeout(() => setSaved(false), 3200);
        }}
        disabled={disabled}
      >
        {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        {saved ? "Saved to profile" : "Save to profile"}
      </Button>
      <AnimatePresence>
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: -8, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={springSoft}
          >
            <Link href="/simulator" className="inline-flex items-center gap-1.5 text-xs font-semibold text-capital-300 hover:underline">
              <FolderHeart className="h-3.5 w-3.5" /> View in saved projects
            </Link>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
