"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Flame, Zap, ArrowRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { RingProgress } from "@/components/ui/Progress";

export function WelcomeHero({
  firstName,
  level,
  xp,
  streak,
  schoolName,
  nextMove,
}: {
  firstName: string;
  level: number;
  xp: number;
  streak: number;
  schoolName: string;
  nextMove: { label: string; href: string; reason: string };
}) {
  const xpInLevel = xp % 1000;
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <Card glow className="relative overflow-hidden p-6">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-capital-500/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-white/45">{part}, {schoolName} 🐻</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-white">
            Welcome back, <span className="text-gradient-capital">{firstName}</span>
          </h1>

          {/* Streak flames */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-2xl border border-orange-400/20 bg-orange-400/10 px-3 py-1.5">
              <motion.span
                animate={{ scale: [1, 1.15, 1], rotate: [0, -6, 6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <Flame className="h-4 w-4 text-orange-400" />
              </motion.span>
              <span className="text-sm font-bold text-orange-200">{streak}-day streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-white/55">
              <Zap className="h-4 w-4 text-amber-300" />
              <span className="font-semibold text-white">{xp.toLocaleString()}</span> XP
            </div>
          </div>
        </div>

        <RingProgress value={(xpInLevel / 1000) * 100} size={104} stroke={9}>
          <div className="text-center">
            <div className="font-display text-2xl font-bold text-white">{level}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/40">Level</div>
          </div>
        </RingProgress>
      </div>

      {/* Recommended next move */}
      <Link
        href={nextMove.href}
        className="group relative mt-6 flex items-center gap-3 rounded-2xl border border-capital-400/20 bg-capital-400/[0.05] px-4 py-3.5 transition-colors hover:bg-capital-400/10"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-capital-gradient">
          <Sparkles className="h-4 w-4 text-ink-950" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-capital-300">Recommended next move</p>
          <p className="truncate text-sm font-semibold text-white">{nextMove.label}</p>
          <p className="truncate text-xs text-white/45">{nextMove.reason}</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-capital-300 transition-transform group-hover:translate-x-1" />
      </Link>
    </Card>
  );
}
