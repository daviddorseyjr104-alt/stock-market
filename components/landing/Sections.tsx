import {
  GraduationCap,
  BookOpen,
  Users,
  Flame,
  TrendingUp,
  Bot,
  Trophy,
  Wallet,
  Building2,
  Megaphone,
  Crown,
  Network,
  ArrowRight,
  Quote,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { schools } from "@/lib/data/schools";
import { lessons } from "@/lib/data/lessons";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Pill tone="capital" className="mb-4">
      {children}
    </Pill>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
      {children}
    </h2>
  );
}

// ── Product preview, feature bento ──────────────────────────────────────────
export function ProductPreview() {
  const features = [
    { icon: BookOpen, title: "Learn", text: "20 student-native lessons that explain the market through your real money.", tone: "text-capital-300" },
    { icon: TrendingUp, title: "Simulate", text: "Build a $10,000 mock portfolio with zero real-money risk.", tone: "text-violet-400" },
    { icon: Users, title: "Connect", text: "Your campus becomes a financial learning community.", tone: "text-sky-300" },
    { icon: Trophy, title: "Compete", text: "School-vs-school leaderboards and weekly challenges.", tone: "text-amber-300" },
    { icon: Bot, title: "Ask", text: "Capital Coach answers money questions in plain English.", tone: "text-capital-300" },
    { icon: Flame, title: "Habit", text: "Streaks, XP, and badges that make learning addictive.", tone: "text-orange-400" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionLabel>One platform</SectionLabel>
        <Heading>Six products, one financial home for campus.</Heading>
        <p className="mt-4 text-white/55">
          Facebook for the network. Tesla for the design. Duolingo for the habit.
          Robinhood for the simplicity. Khan Academy for the clarity.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.05}>
            <Card hover className="h-full">
              <f.icon className={`h-7 w-7 ${f.tone}`} />
              <h3 className="mt-4 font-display text-lg font-semibold text-white">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                {f.text}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── Problem section ──────────────────────────────────────────────────────────
export function Problem() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <SectionLabel>The problem</SectionLabel>
          <Heading>
            Finance sites explain investing like a textbook. Students don&apos;t
            live in a textbook.
          </Heading>
          <p className="mt-5 text-white/55">
            Investopedia and Wall Street blogs assume you already have a salary, a
            401(k), and a mortgage. Students have financial aid, a part-time job,
            rent splits, and a first paycheck they&apos;re terrified to mess up.
          </p>
          <p className="mt-4 text-white/55">
            They don&apos;t need theory. They need examples built from their actual
            money reality.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid gap-4">
            <Card className="border-rose-500/15 bg-rose-500/[0.03]">
              <div className="flex items-center gap-2 text-rose-400">
                <XCircle className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Traditional finance site
                </span>
              </div>
              <p className="mt-3 font-display text-lg text-white/80">
                &ldquo;Diversification reduces unsystematic risk across an
                uncorrelated asset basket.&rdquo;
              </p>
            </Card>
            <Card glow className="border-capital-400/20 bg-capital-400/[0.03]">
              <div className="flex items-center gap-2 text-capital-300">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Campus Capital
                </span>
              </div>
              <p className="mt-3 font-display text-lg text-white">
                &ldquo;Diversification is like not depending on one class, one
                professor, or one internship to define your whole future.&rdquo;
              </p>
            </Card>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Why students need a different app ────────────────────────────────────────
export function WhyDifferent() {
  const principles = [
    { n: "01", title: "Networks before capital", text: "Students may not have money yet, but they have campuses, clubs, and classmates. We grow through identity, not ad spend." },
    { n: "02", title: "Every school is a community", text: "Each campus becomes its own financial learning network, complete with rank, rivalry, and pride." },
    { n: "03", title: "Education that feels personal", text: "Every lesson is framed through aid, rent, internships, and first paychecks, the money students actually touch." },
    { n: "04", title: "Understandable, never intimidating", text: "Robinhood-level simplicity meets Khan Academy clarity. No jargon walls, no gatekeeping." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal className="max-w-2xl">
        <SectionLabel>Why a different app</SectionLabel>
        <Heading>Students don&apos;t need Wall Street. They need a head start.</Heading>
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {principles.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.05}>
            <Card hover className="h-full">
              <div className="flex items-start gap-5">
                <span className="font-display text-3xl font-bold text-gradient-capital">
                  {p.n}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                    {p.text}
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── Campus network ───────────────────────────────────────────────────────────
export function CampusNetwork() {
  return (
    <section id="network" className="relative scroll-mt-24 overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-glow opacity-60" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel>
            <Network className="h-3.5 w-3.5" /> Campus network
          </SectionLabel>
          <Heading>Your campus is already a financial network. We turn it on.</Heading>
          <p className="mt-4 text-white/55">
            Join your school. Follow classmates. Share what you&apos;re learning.
            Watch your campus climb the national board together.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                  Campus leaderboard
                </p>
                <Pill>Example</Pill>
              </div>
              <div className="mt-4 space-y-2.5">
                {schools.slice(0, 5).map((s, i) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 rounded-2xl bg-white/[0.02] px-3 py-2.5"
                  >
                    <span className="w-6 text-center font-display font-bold text-white/40">
                      {i + 1}
                    </span>
                    <span className="text-lg">{s.emoji}</span>
                    <span className="flex-1 text-sm font-medium text-white">
                      {s.shortName}
                    </span>
                    <span className="truncate text-xs text-white/35">{s.location}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-white/35">
                Live standings populate as students at each school start learning.
              </p>
            </Card>
            <div className="grid gap-4">
              <Card className="flex flex-col justify-center">
                <Crown className="h-6 w-6 text-amber-300" />
                <div className="mt-3 font-display text-3xl font-bold text-white">
                  {schools.length} campuses
                </div>
                <p className="text-sm text-white/50">communities you can join</p>
              </Card>
              <Card className="flex flex-col justify-center">
                <BookOpen className="h-6 w-6 text-sky-300" />
                <div className="mt-3 font-display text-3xl font-bold text-white">
                  {lessons.length} lessons
                </div>
                <p className="text-sm text-white/50">student-native, always free</p>
              </Card>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Learning system ──────────────────────────────────────────────────────────
export function LearningSystem() {
  const modules = [
    { letter: "A", title: "Start Here", text: "Investing, risk, and compounding, from zero." },
    { letter: "B", title: "Money Foundation", text: "Budgeting, debt, credit, and income." },
    { letter: "C", title: "Market Basics", text: "Stocks, ETFs, index funds, bonds." },
    { letter: "D", title: "Build Wealth Early", text: "Roth IRAs, automation, dollar-cost averaging." },
    { letter: "E", title: "Advanced Path", text: "Valuation, statements, allocation." },
  ];
  return (
    <section id="learn" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <SectionLabel>
            <BookOpen className="h-3.5 w-3.5" /> Learning system
          </SectionLabel>
          <Heading>A Duolingo-style path from broke to investor.</Heading>
          <p className="mt-4 text-white/55">
            Five modules, twenty lessons. Each one has a student-life example, a
            visual analogy, a quick quiz, and an XP reward. Build a streak. Earn
            badges. Actually remember it.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Student-life examples", "Instant-feedback quizzes", "XP & streaks", "Badges"].map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
          <Button href="/signup" className="mt-8" variant="outline">
            Explore the curriculum <ArrowRight className="h-4 w-4" />
          </Button>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-3">
            {modules.map((m, i) => (
              <Card
                key={m.letter}
                hover
                className="flex items-center gap-4"
                style={{ marginLeft: `${i * 10}px` }}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-capital-gradient font-display text-lg font-bold text-ink-950">
                  {m.letter}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white">
                    {m.title}
                  </h3>
                  <p className="text-sm text-white/50">{m.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Simulator ────────────────────────────────────────────────────────────────
export function SimulatorSection() {
  return (
    <section id="simulator" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="order-2 lg:order-1">
          <Card glow className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <Pill>Example portfolio</Pill>
              <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-white/40">
                Mock · $0 real
              </span>
            </div>
            <div>
              <p className="text-xs text-white/45">Starting balance</p>
              <p className="font-display text-3xl font-bold text-white">$10,000</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { label: "Risk score", value: "Balanced", tone: "text-amber-300" },
                { label: "Diversification", value: "88 / 100", tone: "text-capital-300" },
                { label: "Biggest position", value: "VTI · 35%", tone: "text-white" },
                { label: "Asset types", value: "4 types", tone: "text-sky-300" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/[0.02] p-3">
                  <p className="text-xs text-white/40">{s.label}</p>
                  <p className={`mt-1 font-display text-lg font-semibold ${s.tone}`}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-capital-400/15 bg-capital-400/[0.04] px-4 py-3 text-sm text-white/70">
              💡 Solid diversification! Next, learn about rebalancing and
              allocation.
            </div>
          </Card>
        </Reveal>
        <Reveal delay={0.1} className="order-1 lg:order-2">
          <SectionLabel>
            <TrendingUp className="h-3.5 w-3.5" /> Portfolio simulator
          </SectionLabel>
          <Heading>Learn by building, with $10,000 that isn&apos;t real.</Heading>
          <p className="mt-4 text-white/55">
            Add stocks, ETFs, index funds, and bonds. Get a live risk score, a
            diversification score, and a student-friendly recommendation tied to a
            lesson. Make every mistake here, where it&apos;s free.
          </p>
          <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-xs text-white/45">
            <strong className="text-white/60">No real trading.</strong> No
            brokerage integration. A simulated portfolio for education only.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── Leaderboard ──────────────────────────────────────────────────────────────
export function LeaderboardSection() {
  return (
    <section id="leaderboard" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionLabel>
          <Trophy className="h-3.5 w-3.5" /> Leaderboards
        </SectionLabel>
        <Heading>Competition that builds wealth, not anxiety.</Heading>
        <p className="mt-4 text-white/55">
          Student XP. Campus XP. School vs. school. Club vs. club. Streaks. A
          healthy race that makes showing up every day irresistible.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: Trophy, label: "Student XP", text: "Who's putting in the most reps." },
          { icon: GraduationCap, label: "Campus XP", text: "Your school's collective total." },
          { icon: Network, label: "School vs school", text: "Rep your campus nationally." },
          { icon: Users, label: "Club vs club", text: "Communities climb together." },
          { icon: Flame, label: "Streaks", text: "Consistency is the real flex." },
          { icon: TrendingUp, label: "Simulator", text: "Best paper-trading runs." },
        ].map((b, i) => (
          <Reveal key={b.label} delay={i * 0.05}>
            <Card hover className="h-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-capital-300">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-white">{b.label}</h3>
              <p className="mt-1 text-sm text-white/55">{b.text}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── AI tutor ─────────────────────────────────────────────────────────────────
export function CoachSection() {
  const qs = [
    "I only have $50. Should I invest?",
    "What should I do with internship money?",
    "How do Roth IRAs work?",
  ];
  return (
    <section id="coach" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <SectionLabel>
            <Bot className="h-3.5 w-3.5" /> Capital Coach
          </SectionLabel>
          <Heading>An AI tutor that speaks student, not Wall Street.</Heading>
          <p className="mt-4 text-white/55">
            Ask anything about money in plain language. Capital Coach explains it
            simply, recommends the right lesson next, and never pretends a guess
            is a guarantee.
          </p>
          <p className="mt-4 text-xs text-white/40">
            Works offline with a built-in knowledge engine, and plugs into
            OpenAI or Claude when you add a key.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Card className="p-5">
            <div className="space-y-3">
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-white/8 px-4 py-2.5 text-sm text-white">
                I only have $50. Should I invest?
              </div>
              <div className="flex max-w-[88%] gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-capital-gradient">
                  <Bot className="h-4 w-4 text-ink-950" />
                </div>
                <div className="rounded-2xl rounded-bl-md bg-capital-400/[0.06] px-4 py-3 text-sm leading-relaxed text-white/80">
                  Yes, $50 is a great start once two things are covered: no
                  high-interest debt, and a small emergency cushion. Then
                  fractional shares let you own a slice of hundreds of companies.
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {qs.map((q) => (
                <span
                  key={q}
                  className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 text-xs text-white/55"
                >
                  {q}
                </span>
              ))}
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

// ── Revenue / partnership vision ─────────────────────────────────────────────
export function VisionSection() {
  const items = [
    { icon: GraduationCap, title: "University partnerships", text: "White-labeled financial literacy for campuses and first-year programs." },
    { icon: Megaphone, title: "Sponsored learning", text: "Brands fund lessons and challenges. Students get free education." },
    { icon: Building2, title: "Recruiting pipeline", text: "Finance employers meet financially-literate talent, early." },
    { icon: Wallet, title: "Premium subscriptions", text: "Deeper simulators, analytics, and career prep for power users." },
    { icon: Crown, title: "Campus ambassadors", text: "Student leaders grow their school's community and earn status." },
    { icon: Network, title: "Anonymous insights", text: "Aggregate, privacy-safe student finance trends for research partners." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionLabel>The business</SectionLabel>
        <Heading>A network this loyal becomes a category-defining company.</Heading>
        <p className="mt-4 text-white/55">
          Education-first and student-loved, with six revenue paths that never
          compromise the mission.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.04}>
            <Card hover className="h-full">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-capital-300">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-white">
                {it.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                {it.text}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── Final CTA ────────────────────────────────────────────────────────────────
export function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 px-6 py-16 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-glow" />
          <Quote className="mx-auto h-8 w-8 text-capital-300/60" />
          <h2 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            This isn&apos;t just an app. It&apos;s the financial network of the
            next generation.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/55">
            Learn the market through the life you actually live, internships,
            rent, aid, side hustles, and your first real paycheck.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/signup" size="lg">
              Start Learning <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/signup?step=3" size="lg" variant="secondary">
              Join Your Campus
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
