"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Clock,
  FolderHeart,
  FlaskConical,
  Radio,
  Sparkles,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pill } from "@/components/ui/Pill";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { sims, simById, type SimMeta } from "@/components/sim/registry";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useAppState } from "@/lib/store";
import { cn, timeAgo } from "@/lib/utils";

/** Tone-tinted hover glows, pre-composed so Tailwind can see them. */
const TONE_GLOW: Record<SimMeta["tone"], string> = {
  capital: "hover:shadow-[0_24px_70px_-24px_rgba(57,245,172,0.35)]",
  violet: "hover:shadow-[0_24px_70px_-24px_rgba(124,92,255,0.4)]",
  amber: "hover:shadow-[0_24px_70px_-24px_rgba(251,191,36,0.32)]",
  rose: "hover:shadow-[0_24px_70px_-24px_rgba(251,113,133,0.35)]",
  sky: "hover:shadow-[0_24px_70px_-24px_rgba(56,189,248,0.35)]",
};

const TONE_TEXT: Record<SimMeta["tone"], string> = {
  capital: "text-capital-300",
  violet: "text-violet-400",
  amber: "text-amber-300",
  rose: "text-rose-400",
  sky: "text-sky-300",
};

function simIcon(name: string): LucideIcon {
  return (icons as unknown as Record<string, LucideIcon>)[name] ?? icons.Sparkles;
}

function simHref(id: string): string {
  return id === "portfolio" ? "/simulator/portfolio" : `/simulator/${id}`;
}

export default function SimulatorHubPage() {
  const { hydrated, savedProjects, deleteProject } = useAppState();

  const featured = simById("portfolio")!;
  const rest = sims.filter((s) => s.id !== "portfolio");
  const FeaturedIcon = simIcon(featured.icon);

  return (
    <div className="space-y-8">
      <PageHeader
        title={
          <>
            The <span className="text-gradient-capital text-glow">Simulation Lab</span>
          </>
        }
        subtitle="Real money math, zero real money. Run the decision before life makes you run it for real, then save the result to your profile."
        action={
          <Pill tone="capital">
            <FlaskConical className="h-3.5 w-3.5" /> {sims.length} hands-on sims
          </Pill>
        }
      />

      {/* Featured: the live trading simulator */}
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Link
          href={simHref(featured.id)}
          className={cn(
            "gradient-border sheen card-lift group relative block overflow-hidden rounded-3xl p-6 sm:p-7",
            TONE_GLOW[featured.tone],
          )}
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-capital-400/10 blur-3xl animate-breathe" />
          <div className="relative flex flex-wrap items-center gap-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-capital-400/10 text-capital-300 glow-ring transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110">
              <FeaturedIcon className="h-8 w-8" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {featured.title}
                </h2>
                <Pill tone="capital">
                  <Radio className="h-3 w-3 animate-pulse" /> Live prices
                </Pill>
              </div>
              <p className="mt-1 max-w-xl text-sm text-white/60">{featured.pitch}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/40">
                <span className="rounded-full bg-white/[0.05] px-2.5 py-1">$10,000 paper money</span>
                <span className="rounded-full bg-white/[0.05] px-2.5 py-1">Any US stock or ETF</span>
                <span className="rounded-full bg-white/[0.05] px-2.5 py-1">~{featured.minutes} min</span>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-capital-300">
              Start trading
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </motion.div>

      {/* The 7 scenario sims */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {rest.map((s) => {
          const Icon = simIcon(s.icon);
          return (
            <motion.div key={s.id} variants={fadeUp}>
              <Link
                href={simHref(s.id)}
                className={cn(
                  "glass card-lift sheen group flex h-full flex-col rounded-3xl p-5 transition-colors",
                  s.hoverClass,
                  TONE_GLOW[s.tone],
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110",
                      s.iconClass,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <Pill tone={s.tone}>{s.skill}</Pill>
                </div>
                <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-white">
                  {s.title}
                </h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-white/55">{s.pitch}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
                  <span className="flex items-center gap-1.5 text-white/40">
                    <Clock className="h-3.5 w-3.5" /> ~{s.minutes} min
                  </span>
                  <span className={cn("flex items-center gap-1 font-semibold", TONE_TEXT[s.tone])}>
                    Run it
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Saved projects */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white">
              <FolderHeart className="h-5 w-5 text-capital-300" /> Your saved projects
            </h2>
            <p className="mt-0.5 text-sm text-white/50">
              Every plan you save from a sim lands here, budgets, payoff plans, pitches, all of it.
            </p>
          </div>
          {hydrated && savedProjects.length > 0 && (
            <Pill tone="capital">{savedProjects.length} saved</Pill>
          )}
        </div>

        {!hydrated ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : savedProjects.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="h-7 w-7" />}
            title="Nothing saved yet"
            description="Run any simulation above and hit “Save to profile”, your results will collect here like a portfolio of decisions."
          />
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {savedProjects.map((p) => {
                const meta = simById(p.kind);
                const Icon = simIcon(meta?.icon ?? "Sparkles");
                return (
                  <motion.div
                    key={p.id}
                    layout
                    variants={fadeUp}
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
                    className="glass card-lift sheen group relative rounded-3xl p-5"
                  >
                    <div className="flex items-start gap-3.5">
                      <span
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                          meta?.iconClass ?? "bg-white/5 text-capital-300",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="truncate font-display text-sm font-semibold text-white">{p.title}</h3>
                          <button
                            type="button"
                            onClick={() => deleteProject(p.id)}
                            title="Delete this project"
                            aria-label={`Delete ${p.title}`}
                            className="shrink-0 rounded-lg p-1.5 text-white/30 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/55">{p.summary}</p>
                        <div className="mt-2.5 flex items-center justify-between text-[11px]">
                          <span className="text-white/35">Saved {timeAgo(p.createdAt)}</span>
                          {meta && (
                            <Link
                              href={simHref(meta.id)}
                              className={cn("flex items-center gap-1 font-semibold hover:underline", TONE_TEXT[meta.tone])}
                            >
                              Rerun sim <ArrowRight className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <Disclaimer />
    </div>
  );
}
