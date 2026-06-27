"use client";

import { motion } from "framer-motion";
import {
  Flame,
  TrendingUp,
  GraduationCap,
  Trophy,
  Sparkles,
  Bot,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Progress";

function PreviewCard({
  children,
  className,
  delay = 0,
  float = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  float?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.6, 0.35, 1] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, float, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="glass-strong rounded-2xl p-4 shadow-float"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-radial-glow" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-capital-400/20 bg-capital-400/10 px-3.5 py-1.5 text-xs font-medium text-capital-300"
          >
            <Star className="h-3.5 w-3.5 fill-capital-300" />
            The financial network of the next generation
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl"
          >
            The investing app built for{" "}
            <span className="text-gradient-capital">students</span> before they
            have money.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/60"
          >
            Campus Capital teaches investing through student life — internships,
            rent, financial aid, side hustles, scholarships, student debt, and
            first paychecks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.19 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button href="/signup" size="lg">
              Start Learning <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/signup?step=3" size="lg" variant="secondary">
              <GraduationCap className="h-4 w-4" /> Join Your Campus
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/45"
          >
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold text-white">11</span>{" "}
              campuses competing
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold text-white">20</span>{" "}
              student-native lessons
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-bold text-white">$0</span>{" "}
              real money at risk
            </div>
          </motion.div>
        </div>

        {/* Animated dashboard preview */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="grid grid-cols-2 gap-3.5">
            <PreviewCard delay={0.25} float={-8} className="col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/45">Campus rank</span>
                <span className="text-lg">🐻</span>
              </div>
              <div className="mt-1 font-display text-2xl font-bold text-white">
                #4 <span className="text-sm font-medium text-white/40">UCLA</span>
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-xs text-capital-300">
                <TrendingUp className="h-3 w-3" /> +2 this week
              </div>
            </PreviewCard>

            <PreviewCard delay={0.33} float={9} className="col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/45">Learning streak</span>
                <Flame className="h-4 w-4 text-orange-400" />
              </div>
              <div className="mt-1 font-display text-2xl font-bold text-white">
                12 days
              </div>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i < 6 ? "bg-orange-400" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </PreviewCard>

            <PreviewCard delay={0.41} float={7} className="col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-capital-300" />
                  <span className="text-sm font-medium text-white">
                    Portfolio simulator
                  </span>
                </div>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                  Mock · $0 real
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div className="font-display text-2xl font-bold text-white">
                    $10,420
                  </div>
                  <div className="text-xs text-capital-300">+$420 (4.2%)</div>
                </div>
                <svg viewBox="0 0 120 40" className="h-12 w-32">
                  <defs>
                    <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#39f5ac" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#39f5ac" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 32 L20 28 L40 30 L60 20 L80 22 L100 10 L120 6"
                    fill="none"
                    stroke="#39f5ac"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 32 L20 28 L40 30 L60 20 L80 22 L100 10 L120 6 L120 40 L0 40 Z"
                    fill="url(#spark)"
                  />
                </svg>
              </div>
            </PreviewCard>

            <PreviewCard delay={0.49} float={-7} className="col-span-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-white">
                  Today&apos;s 5-minute lesson
                </span>
              </div>
              <p className="mt-2 text-sm text-white/55">
                The Roth IRA: a student&apos;s secret weapon
              </p>
              <div className="mt-3 flex items-center gap-3">
                <ProgressBar value={60} className="h-1.5" />
                <span className="shrink-0 text-xs text-capital-300">+80 XP</span>
              </div>
            </PreviewCard>

            <PreviewCard delay={0.57} float={8} className="col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/45">Campus XP</span>
                <Trophy className="h-4 w-4 text-amber-300" />
              </div>
              <div className="mt-1 font-display text-2xl font-bold text-white">
                4,820
              </div>
              <div className="text-xs text-white/40">Level 7 · Investor</div>
            </PreviewCard>

            <PreviewCard delay={0.65} float={-9} className="col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-capital-gradient">
                  <Bot className="h-4 w-4 text-ink-950" />
                </div>
                <span className="text-sm font-medium text-white">
                  Capital Coach
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-white/50">
                &ldquo;I only have $50. Should I invest?&rdquo;
              </p>
              <div className="mt-1.5 text-xs text-capital-300">Ask anything →</div>
            </PreviewCard>
          </div>
        </div>
      </div>
    </section>
  );
}
