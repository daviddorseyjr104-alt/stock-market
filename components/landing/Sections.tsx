"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  CandlestickChart,
  Check,
  CreditCard,
  Crown,
  Flame,
  GraduationCap,
  Handshake,
  Heart,
  Landmark,
  LineChart,
  Presentation,
  Rocket,
  Sparkles,
  Tags,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { sims } from "@/components/sim/registry";
import { fadeUp, pop, staggerContainer, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CoachDemo } from "./CoachDemo";

/* Icon names stored in data → components (course + sim registries). */
const ICONS: Record<string, LucideIcon> = {
  Wallet,
  CreditCard,
  LineChart,
  Building2,
  Rocket,
  Handshake,
  Briefcase,
  Landmark,
  CandlestickChart,
  Tags,
  Presentation,
};

/* Data passed down from the server page so course content stays out of the
   client bundle. Every number is computed from the real catalog. */
export interface LandingStats {
  courses: number;
  lessons: number;
  simulators: number;
  questions: number;
  totalXp: number;
}

export interface MarqueeCourse {
  id: string;
  title: string;
  tagline: string;
  icon: string; // lucide icon name
  color: string; // tailwind gradient classes
  lessons: number;
}

/* ── Shared bits ─────────────────────────────────────────────────────── */

function SectionShell({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("relative scroll-mt-24 py-20 sm:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

function SectionIntro({
  pill,
  icon: Icon,
  title,
  copy,
  center,
}: {
  pill: string;
  icon?: LucideIcon;
  title: React.ReactNode;
  copy?: string;
  center?: boolean;
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={cn("max-w-2xl", center && "mx-auto text-center")}
    >
      <motion.div variants={fadeUp}>
        <Pill tone="capital" className="mb-4">
          {Icon && <Icon className="h-3.5 w-3.5" />} {pill}
        </Pill>
      </motion.div>
      <motion.h2
        variants={fadeUp}
        className="font-display text-3xl font-bold tracking-tight text-white sm:text-[2.6rem] sm:leading-[1.1]"
      >
        {title}
      </motion.h2>
      {copy && (
        <motion.p variants={fadeUp} className="mt-4 text-white/55">
          {copy}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ── 1 · Honest stat band ────────────────────────────────────────────── */

export function StatBand({ stats }: { stats: LandingStats }) {
  const tiles = [
    { value: stats.courses, label: "Courses", sub: "money to venture capital", icon: BookOpen, tone: "text-capital-300" },
    { value: stats.lessons, label: "Bite-size lessons", sub: "with XP on every one", icon: Zap, tone: "text-violet-400" },
    { value: stats.simulators, label: "Simulators", sub: "zero real dollars", icon: TrendingUp, tone: "text-sky-300" },
    { value: stats.questions, label: "Practice questions", sub: "5 question formats", icon: Check, tone: "text-amber-300" },
    { value: stats.totalXp, label: "XP up for grabs", sub: "hearts, streaks & badges", icon: Flame, tone: "text-orange-400" },
  ];
  return (
    <SectionShell id="stats" className="py-14 sm:py-16">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="gradient-border rounded-[2rem] p-2 shadow-glow-soft"
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {tiles.map((t, i) => (
            <motion.div
              key={t.label}
              variants={pop}
              className={cn(
                "rounded-3xl bg-white/[0.02] p-5 text-center",
                i === tiles.length - 1 && "col-span-2 sm:col-span-1",
              )}
            >
              <t.icon className={cn("mx-auto h-5 w-5", t.tone)} />
              <div className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
                <AnimatedNumber value={t.value} />
              </div>
              <p className="mt-1 text-sm font-semibold text-white/80">{t.label}</p>
              <p className="text-xs text-white/40">{t.sub}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-4 text-center text-xs text-white/35"
      >
        Every number above is counted live from the real curriculum, no made-up
        user stats, ever.
      </motion.p>
    </SectionShell>
  );
}

/* ── 2 · Course marquee ──────────────────────────────────────────────── */

function MarqueeCard({ course }: { course: MarqueeCourse }) {
  const Icon = ICONS[course.icon] ?? BookOpen;
  return (
    <div className="glass sheen card-lift mx-2 flex w-[290px] shrink-0 items-center gap-3.5 rounded-3xl p-4">
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-ink-950",
          course.color,
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-bold text-white">
          {course.title}
        </p>
        <p className="truncate text-xs text-white/45">{course.tagline}</p>
        <p className="mt-0.5 text-[11px] font-semibold text-capital-300">
          {course.lessons} lessons
        </p>
      </div>
    </div>
  );
}

export function CourseMarquee({ items }: { items: MarqueeCourse[] }) {
  const reduce = useReducedMotion();
  const row = [...items, ...items]; // duplicate for the seamless -50% loop
  return (
    <section id="courses" className="scroll-mt-24 py-10">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto mb-8 max-w-2xl px-4 text-center sm:px-6"
      >
        <Pill tone="violet" className="mb-3">
          <GraduationCap className="h-3.5 w-3.5" /> The catalog
        </Pill>
        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-[2.6rem]">
          {items.length} courses. One financial{" "}
          <span className="text-gradient-capital">head start.</span>
        </h2>
      </motion.div>

      <div
        className="group relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          className={cn(
            "flex w-max py-2 group-hover:[animation-play-state:paused]",
            !reduce && "animate-marquee",
          )}
        >
          {row.map((c, i) => (
            <MarqueeCard key={`${c.id}-${i}`} course={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 3 · The learn path ──────────────────────────────────────────────── */

const MECHANICS = [
  { icon: Heart, tone: "text-rose-400 bg-rose-500/10", title: "5 hearts", text: "Miss a question, lose a heart. Finish clean, feel unstoppable." },
  { icon: Zap, tone: "text-capital-300 bg-capital-400/10", title: "XP everywhere", text: "Every answer, lesson, and challenge pays out experience." },
  { icon: Flame, tone: "text-orange-400 bg-orange-400/10", title: "Daily streaks", text: "Five minutes a day keeps the flame, and the habit, alive." },
];

export function LearnSection({ stats }: { stats: LandingStats }) {
  return (
    <SectionShell id="learn">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <SectionIntro
            pill="The learn path"
            icon={BookOpen}
            title={
              <>
                A game you play for five minutes.{" "}
                <span className="text-gradient-capital">
                  A skill you keep for life.
                </span>
              </>
            }
            copy={`${stats.lessons} lessons across ${stats.courses} courses, each one a quick run of teach cards and questions, multiple choice, true/false, scenarios, fill-ins, and matching. Explained through rent splits, financial aid, and first paychecks, not textbook jargon.`}
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-8 grid gap-3 sm:grid-cols-3"
          >
            {MECHANICS.map((m) => (
              <motion.div
                key={m.title}
                variants={fadeUp}
                className="glass card-lift rounded-3xl p-4"
              >
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", m.tone)}>
                  <m.icon className="h-[18px] w-[18px]" />
                </div>
                <p className="mt-3 font-display text-sm font-bold text-white">{m.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/50">{m.text}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-8"
          >
            <Button href="/signup" variant="outline">
              See the full curriculum <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Visual: a lesson question card, mid-play */}
        <motion.div
          variants={pop}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="glass-hi rounded-[2rem] p-6 shadow-glow-soft sm:p-7">
            <div className="flex items-center justify-between">
              <div className="flex flex-1 items-center gap-2 pr-4">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
                  <div className="h-full w-3/5 rounded-full bg-capital-gradient" />
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                <Heart className="h-3.5 w-3.5 fill-rose-400" /> 5
              </span>
            </div>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-violet-400">
              Scenario
            </p>
            <p className="mt-2 font-display text-lg font-bold leading-snug text-white">
              Your internship pays $2,400/month. Rent is $900. What does 50/30/20
              say your &ldquo;wants&rdquo; budget is?
            </p>
            <div className="mt-4 space-y-2.5">
              {[
                { label: "$480", state: "idle" },
                { label: "$720", state: "correct" },
                { label: "$1,200", state: "idle" },
              ].map((o) => (
                <div
                  key={o.label}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold",
                    o.state === "correct"
                      ? "border-capital-400/50 bg-capital-400/10 text-capital-300 shadow-glow"
                      : "border-white/10 bg-white/[0.02] text-white/70",
                  )}
                >
                  {o.label}
                  {o.state === "correct" && <Check className="h-4 w-4" />}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-capital-400/[0.06] px-4 py-3">
              <span className="text-sm font-semibold text-capital-300">
                Nice, that&apos;s 30% of $2,400.
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-capital-300">
                <Zap className="h-3.5 w-3.5" /> +10 XP
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}

/* ── 4 · Simulators ──────────────────────────────────────────────────── */

export function SimulatorsSection() {
  return (
    <SectionShell id="simulators" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-mesh opacity-70" />
      <SectionIntro
        center
        pill={`${sims.length} simulators`}
        icon={TrendingUp}
        title={
          <>
            Make every money mistake{" "}
            <span className="text-gradient-capital">where it&apos;s free.</span>
          </>
        }
        copy="Trade real tickers with fake money, negotiate a salary, price a product, pitch an investor. Real mechanics, real numbers, zero real dollars."
      />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {sims.map((s) => {
          const Icon = ICONS[s.icon] ?? Sparkles;
          return (
            <motion.div
              key={s.id}
              variants={fadeUp}
              className="glass sheen card-lift flex h-full flex-col rounded-3xl p-5"
            >
              <div className="flex items-center justify-between">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", s.iconClass)}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/40">
                  ~{s.minutes} min
                </span>
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-white">
                {s.title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-white/50">
                {s.pitch}
              </p>
              <p className="mt-3 text-xs font-semibold text-capital-300">{s.skill}</p>
            </motion.div>
          );
        })}
      </motion.div>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mt-10 flex flex-col items-center gap-4"
      >
        <Button href="/signup" size="lg" className="shadow-glow-lg">
          Try the simulators free <ArrowRight className="h-4 w-4" />
        </Button>
        <p className="max-w-md text-center text-xs text-white/40">
          <strong className="text-white/60">No real trading.</strong> No brokerage
          integration. Simulated portfolios for education only.
        </p>
      </motion.div>
    </SectionShell>
  );
}

/* ── 5 · Compete (leaderboards & streaks) ────────────────────────────── */

const BOARDS = [
  { icon: Trophy, label: "Student XP", text: "Who's putting in the most reps this week." },
  { icon: GraduationCap, label: "Campus vs. campus", text: "Your school's collective XP, ranked nationally." },
  { icon: Users, label: "Club vs. club", text: "Investing clubs and finance societies climb together." },
  { icon: Flame, label: "Streak boards", text: "Consistency is the real flex." },
];

export function CompeteSection() {
  return (
    <SectionShell id="compete">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Visual: podium mock */}
        <motion.div
          variants={pop}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="order-2 mx-auto w-full max-w-md lg:order-1"
        >
          <div className="glass-hi rounded-[2rem] p-6 shadow-glow-soft sm:p-7">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                Campus leaderboard
              </p>
              <Pill>How it works</Pill>
            </div>
            <div className="mt-6 flex items-end justify-center gap-3">
              {[
                { place: 2, h: "h-20", label: "Rival campus", tone: "bg-white/10" },
                { place: 1, h: "h-28", label: "Your campus", tone: "bg-capital-gradient", crown: true },
                { place: 3, h: "h-14", label: "That other school", tone: "bg-white/10" },
              ].map((p) => (
                <div key={p.place} className="flex w-24 flex-col items-center gap-2">
                  {p.crown && <Crown className="h-5 w-5 text-amber-300" />}
                  <div
                    className={cn(
                      "flex w-full items-start justify-center rounded-t-2xl pt-2 font-display text-lg font-extrabold",
                      p.h,
                      p.tone,
                      p.crown ? "text-ink-950 shadow-glow" : "text-white/50",
                    )}
                  >
                    {p.place}
                  </div>
                  <p className="text-center text-[11px] leading-tight text-white/45">
                    {p.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2">
              {[
                { rank: "You", xp: "Every lesson counts here", you: true },
                { rank: "Your club", xp: "Weekly challenges add up" },
                { rank: "Your school", xp: "Rise as your campus learns" },
              ].map((r) => (
                <div
                  key={r.rank}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm",
                    r.you
                      ? "border border-capital-400/30 bg-capital-400/[0.07] font-semibold text-capital-300"
                      : "bg-white/[0.02] text-white/60",
                  )}
                >
                  <span>{r.rank}</span>
                  <span className="text-xs text-white/40">{r.xp}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[11px] text-white/30">
              Illustration, real boards fill in as students learn.
            </p>
          </div>
        </motion.div>

        <div className="order-1 lg:order-2">
          <SectionIntro
            pill="Compete"
            icon={Trophy}
            title={
              <>
                Competition that builds wealth,{" "}
                <span className="text-gradient-capital">not anxiety.</span>
              </>
            }
            copy="XP turns learning into a sport. Rep your campus, rally your club, and defend your streak, a healthy race that makes showing up daily irresistible."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-8 grid gap-3 sm:grid-cols-2"
          >
            {BOARDS.map((b) => (
              <motion.div
                key={b.label}
                variants={fadeUp}
                className="glass card-lift rounded-3xl p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-capital-300">
                  <b.icon className="h-[18px] w-[18px]" />
                </div>
                <p className="mt-3 font-display text-sm font-bold text-white">{b.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/50">{b.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionShell>
  );
}

/* ── 6 · Capital Coach ───────────────────────────────────────────────── */

export function CoachSection() {
  return (
    <SectionShell id="coach">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionIntro
            pill="Capital Coach"
            icon={Bot}
            title={
              <>
                An AI money tutor that speaks{" "}
                <span className="text-gradient-capital">student, not Wall Street.</span>
              </>
            }
            copy="Ask anything about money in plain language. Capital Coach explains it simply, points you to the right lesson next, and never pretends a guess is a guarantee."
          />
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-6 text-sm font-semibold text-capital-300"
          >
            This demo is wired to the real coach, go ahead, ask it something.
          </motion.p>
        </div>
        <motion.div
          variants={pop}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <CoachDemo />
        </motion.div>
      </div>
    </SectionShell>
  );
}

/* ── 7 · Final CTA ───────────────────────────────────────────────────── */

export function FinalCTA({ stats }: { stats: LandingStats }) {
  return (
    <SectionShell className="pb-28">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <div className="gradient-border relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center shadow-glow-soft sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -inset-[10%] bg-aurora animate-aurora" />
          <div className="pointer-events-none absolute inset-0 bg-noise" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-capital-400/20 bg-capital-400/10 px-3.5 py-1.5 text-xs font-semibold text-capital-300">
              <Sparkles className="h-3.5 w-3.5" /> Free forever · No credit card
            </span>
            <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
              Your first lesson takes{" "}
              <span className="text-gradient-capital text-glow">
                five minutes.
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/55">
              {stats.courses} courses, {stats.lessons} lessons, and{" "}
              {stats.simulators} simulators are waiting. The best time to learn
              money was before you had any, that&apos;s now.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/signup" size="lg" className="shadow-glow-lg">
                Start free <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/login" size="lg" variant="secondary">
                Log in
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </SectionShell>
  );
}
