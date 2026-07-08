"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Flame,
  Heart,
  Lock,
  Sparkles,
  Star,
  Wallet,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ── Lesson path mock ─────────────────────────────────────────────────────
   A stylized, div/SVG-only rendering of the Duolingo-style lesson path.
   Clearly labeled a product preview, no fabricated user stats. */

type NodeState = "done" | "active" | "locked";

const PATH_NODES: { state: NodeState; title: string; xp: string }[] = [
  { state: "done", title: "Needs vs. wants", xp: "+40 XP" },
  { state: "done", title: "The 50/30/20 rule", xp: "+40 XP" },
  { state: "active", title: "Where your money goes", xp: "+50 XP" },
  { state: "locked", title: "Emergency funds", xp: "+40 XP" },
  { state: "locked", title: "Unit challenge", xp: "+80 XP" },
];

/* Node horizontal offsets, the gentle Duolingo weave. */
const WEAVE = [0, 34, 10, -26, 2];

function PathNode({
  state,
  title,
  xp,
  offset,
}: {
  state: NodeState;
  title: string;
  xp: string;
  offset: number;
}) {
  return (
    <div
      className="relative flex items-center gap-3.5"
      style={{ transform: `translateX(${offset}px)` }}
    >
      <div
        className={cn(
          "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
          state === "done" && "bg-capital-gradient text-ink-950 shadow-glow",
          state === "active" &&
            "glow-ring animate-breathe bg-capital-gradient text-ink-950",
          state === "locked" && "border border-white/10 bg-white/[0.04] text-white/30",
        )}
      >
        {state === "done" && <Check className="h-5 w-5" strokeWidth={3} />}
        {state === "active" && <Star className="h-5 w-5 fill-ink-950" />}
        {state === "locked" && <Lock className="h-4 w-4" />}
        {state === "active" && (
          <span className="absolute -top-2.5 -right-2.5 flex h-5 items-center rounded-full bg-violet-500 px-1.5 text-[9px] font-bold text-white shadow-glow-violet">
            START
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "truncate text-sm font-semibold",
            state === "locked" ? "text-white/30" : "text-white",
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            "text-xs",
            state === "active" ? "text-capital-300" : "text-white/35",
          )}
        >
          {xp}
        </p>
      </div>
    </div>
  );
}

function LessonPathMock() {
  return (
    <div className="glass-hi glow-ring relative w-full max-w-sm rounded-[2rem] p-6 sm:p-7">
      {/* Top bar: course + hearts + streak */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-capital-gradient">
            <Wallet className="h-[18px] w-[18px] text-ink-950" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-white">
              Money Basics
            </p>
            <p className="text-[11px] text-white/40">Unit 1 · Budget Like a Boss</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-1 text-xs font-bold text-rose-400">
            <Heart className="h-3.5 w-3.5 fill-rose-400" /> 5
          </span>
          <span className="flex items-center gap-1 rounded-full bg-orange-400/10 px-2 py-1 text-xs font-bold text-orange-300">
            <Flame className="h-3.5 w-3.5" /> 7
          </span>
        </div>
      </div>

      {/* Winding connector + nodes */}
      <div className="relative mt-6">
        <svg
          viewBox="0 0 60 340"
          className="pointer-events-none absolute left-[7px] top-0 h-full w-[46px]"
          aria-hidden
        >
          <path
            d="M16 24 C 16 60, 50 60, 50 96 C 50 132, 26 132, 26 168 C 26 204, -8 204, -8 240 Q -8 262 18 288"
            fill="none"
            stroke="rgba(57,245,172,0.25)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1 10"
          />
        </svg>
        <div className="relative space-y-5">
          {PATH_NODES.map((n, i) => (
            <PathNode key={n.title} {...n} offset={WEAVE[i]} />
          ))}
        </div>
      </div>

      {/* Bottom: progress + continue */}
      <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/45">Unit progress</span>
          <span className="font-semibold text-capital-300">2 / 5 lessons</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
          <div className="h-full w-2/5 rounded-full bg-capital-gradient" />
        </div>
      </div>
    </div>
  );
}

/* Floating accent chips around the mock. */
function FloatChip({
  className,
  float = -8,
  duration = 5.5,
  delay = 0,
  children,
}: {
  className?: string;
  float?: number;
  duration?: number;
  delay?: number;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9 + delay, type: "spring", stiffness: 260, damping: 22 }}
      className={cn("absolute z-10", className)}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, float, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
        className="glass-strong flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-semibold text-white shadow-float"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* Pointer-tracked 3D tilt, reduced-motion aware. */
function TiltMock() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 150,
    damping: 20,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 150,
    damping: 20,
  });

  function onPointerMove(e: React.PointerEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onPointerLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.35, ease: [0.21, 0.6, 0.35, 1] }}
      className="relative mx-auto w-full max-w-sm"
      style={{ perspective: 1200 }}
    >
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative"
      >
        <motion.div style={reduce ? undefined : { rotateX: rx, rotateY: ry }}>
          <LessonPathMock />
        </motion.div>

        <FloatChip className="-right-3 top-16 sm:-right-8" float={-9} delay={0.1}>
          <Zap className="h-3.5 w-3.5 text-capital-300" />
          <span className="text-capital-300">+50 XP</span>
        </FloatChip>
        <FloatChip className="-left-2 top-1/2 sm:-left-9" float={8} duration={6.5} delay={0.35}>
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          Perfect lesson!
        </FloatChip>
        <FloatChip className="-bottom-4 right-6" float={-7} duration={7} delay={0.6}>
          <Flame className="h-3.5 w-3.5 text-orange-400" />
          Streak +1
        </FloatChip>
      </div>
    </motion.div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────── */

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden pb-24 pt-32 sm:pt-40">
      {/* Living backdrop: aurora + mesh + faint grid + noise */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -inset-[12%] bg-aurora animate-aurora" />
        <div className="absolute inset-0 bg-mesh opacity-80" />
        <div
          className="absolute inset-0 bg-grid-faint [mask-image:radial-gradient(75%_60%_at_50%_20%,black,transparent)]"
          style={{ backgroundSize: "56px 56px" }}
        />
        <div className="absolute inset-0 bg-noise" />
        <div className="absolute inset-x-0 top-0 h-[560px] bg-radial-glow" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.08fr_1fr] lg:gap-10">
        {/* Copy */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="text-center lg:text-left"
        >
          <motion.div
            variants={fadeUp}
            className="gradient-border mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-capital-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Learn money the way Duolingo taught you Spanish
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mx-auto max-w-2xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:mx-0 lg:text-7xl"
          >
            Master money{" "}
            <span className="text-gradient-capital text-glow">
              before you have any.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60 lg:mx-0"
          >
            Bite-size lessons, hearts, XP, and streaks, built around the money
            students actually touch: rent, aid, internships, and first
            paychecks. Practice in simulators where every mistake is free.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Button href="/signup" size="lg" className="w-full shadow-glow-lg sm:w-auto">
              Start free <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/login" size="lg" variant="secondary" className="w-full sm:w-auto">
              Log in
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/45 lg:justify-start"
          >
            {["Free forever", "5-minute lessons", "$0 real money at risk"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-capital-300" />
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Product preview */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mb-4 flex justify-center"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/45">
              <Sparkles className="h-3 w-3 text-capital-300" />
              Product preview · the lesson path
            </span>
          </motion.div>
          <TiltMock />
        </div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#stats"
        aria-label="Scroll to see what's inside"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/35 transition-colors hover:text-white/70 sm:flex"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
          Explore
        </span>
        <motion.span
          animate={reduce ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}
