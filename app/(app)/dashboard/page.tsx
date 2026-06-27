"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  TrendingUp,
  Trophy,
  Bot,
  Target,
  ArrowRight,
  Flame,
  Eye,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/Progress";
import { Avatar } from "@/components/ui/Avatar";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { personById } from "@/lib/data/people";
import { schoolById, schools } from "@/lib/data/schools";
import { modules } from "@/lib/data/modules";
import { lessonsByModule, lessonById } from "@/lib/data/lessons";
import { challenges } from "@/lib/data/challenges";
import { useAppState, levelForXp } from "@/lib/store";
import { useQuotes } from "@/lib/use-quotes";
import {
  priceFromQuotes,
  totalValue,
  totalGain,
  investedValue,
  positionValue,
  riskScore,
  riskLabel,
  diversificationScore,
} from "@/lib/portfolio-utils";
import { formatCurrency, formatPercent, timeAgo, cn } from "@/lib/utils";

function nextLesson(isLessonComplete: (id: string) => boolean) {
  for (const m of modules) {
    for (const l of lessonsByModule(m.id)) {
      if (!isLessonComplete(l.id)) return l;
    }
  }
  return lessonById("portfolio-allocation")!;
}

// Real challenge progress derived from the signed-in user's state.
const CHALLENGE_LESSON: Record<string, string> = {
  "compound-5min": "compound-interest",
  "roth-basics": "roth-ira",
  "budget-builder-challenge": "budgeting-college",
  "save-vs-invest": "saving-vs-investing",
};
function liveProgress(
  id: string,
  streak: number,
  isLessonComplete: (id: string) => boolean,
) {
  if (id === "7-day-streak") return Math.min(100, Math.round((streak / 7) * 100));
  const lesson = CHALLENGE_LESSON[id];
  if (lesson) return isLessonComplete(lesson) ? 100 : 0;
  return 0;
}

const WATCH = [
  { ticker: "VTI", name: "Total US Market" },
  { ticker: "VOO", name: "S&P 500 ETF" },
  { ticker: "SCHD", name: "Dividend ETF" },
  { ticker: "QQQ", name: "Nasdaq-100" },
];

export default function DashboardPage() {
  const { profile, posts, portfolio, isLessonComplete } = useAppState();
  const school = schoolById(profile.schoolId)!;
  const lesson = nextLesson(isLessonComplete);
  const lessonModule = modules.find((m) => m.id === lesson.moduleId);
  const scoredChallenges = challenges.map((c) => ({
    c,
    p: liveProgress(c.id, profile.streak, isLessonComplete),
  }));
  const featured =
    scoredChallenges.filter((x) => x.p < 100).sort((a, b) => b.p - a.p)[0] ??
    scoredChallenges[0];
  const challenge = featured.c;
  const challengeProg = featured.p;

  const tickers = useMemo(
    () => Array.from(new Set([...portfolio.positions.map((p) => p.ticker), ...WATCH.map((w) => w.ticker)])),
    [portfolio.positions],
  );
  const { quotes } = useQuotes(tickers, 60_000);
  const priceOf = useMemo(() => priceFromQuotes(quotes, portfolio.positions), [quotes, portfolio.positions]);

  const value = totalValue(portfolio, priceOf);
  const gain = totalGain(portfolio, priceOf);
  const invested = investedValue(portfolio.positions, priceOf);
  const change = portfolio.positions.reduce((s, p) => s + p.shares * (quotes[p.ticker.toUpperCase()]?.change ?? 0), 0);
  const rScore = riskScore(portfolio.positions, priceOf);
  const dScore = diversificationScore(portfolio.positions, priceOf);
  const schoolRank =
    [...schools].sort((a, b) => b.totalXp - a.totalXp).findIndex((s) => s.id === school.id) + 1;
  const feed = posts
    .filter((p) => p.schoolId === profile.schoolId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <WelcomeHero
        firstName={profile.fullName.split(" ")[0]}
        level={levelForXp(profile.xp)}
        xp={profile.xp}
        streak={profile.streak}
        schoolName={school.shortName}
        nextMove={{
          label: lesson.title,
          href: `/learn/${lesson.id}`,
          reason: `Today's 5-minute lesson · +${lesson.xp} XP`,
        }}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left + center column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Today's lesson */}
          <Card hover>
            <CardHeader
              title="Today's 5-minute lesson"
              subtitle={`${lessonModule?.title} · ${lesson.difficulty}`}
              icon={<BookOpen className="h-4 w-4" />}
              action={<Pill tone="capital">+{lesson.xp} XP</Pill>}
            />
            <h3 className="font-display text-xl font-semibold text-white">{lesson.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-white/55">{lesson.summary}</p>
            <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-white/65">
              <span className="text-capital-300">Student-life example · </span>
              {lesson.studentExample}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Button href={`/learn/${lesson.id}`}>
                Start lesson <ArrowRight className="h-4 w-4" />
              </Button>
              <span className="text-sm text-white/45">{lesson.minutes} min</span>
            </div>
          </Card>

          {/* Portfolio snapshot */}
          <Card hover>
            <CardHeader
              title="Your mock portfolio"
              subtitle="Educational simulation · $0 real money"
              icon={<TrendingUp className="h-4 w-4" />}
              action={
                <Link href="/simulator" className="text-sm text-capital-300 hover:underline">
                  Open simulator →
                </Link>
              }
            />
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="font-display text-3xl font-bold text-white">
                  {formatCurrency(value, { maximumFractionDigits: 0 })}
                </div>
                <div className={cn("text-sm font-medium", change >= 0 ? "text-capital-300" : "text-rose-400")}>
                  {change >= 0 ? "+" : ""}
                  {formatCurrency(change)} today
                </div>
                <div className="text-xs text-white/40">
                  All-time {gain.abs >= 0 ? "+" : ""}
                  {formatCurrency(gain.abs)} ({formatPercent(gain.pct)})
                </div>
              </div>
              <div className="flex gap-3">
                <MiniStat label="Risk" value={riskLabel(rScore)} tone="amber" />
                <MiniStat label="Diversification" value={`${dScore}/100`} tone="capital" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {portfolio.positions.slice(0, 3).map((p) => {
                const pct = invested > 0 ? (positionValue(p, priceOf) / invested) * 100 : 0;
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="w-12 font-mono text-xs font-semibold text-white/70">{p.ticker}</span>
                    <ProgressBar value={pct} className="h-1.5 flex-1" />
                    <span className="w-9 text-right text-xs text-white/45">{pct.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Campus activity feed */}
          <Card>
            <CardHeader
              title="What students at your school are learning"
              subtitle={`${school.shortName} campus feed`}
              icon={<GraduationCap className="h-4 w-4" />}
              action={
                <Link href="/campus" className="text-sm text-capital-300 hover:underline">
                  View all →
                </Link>
              }
            />
            <div className="space-y-3">
              {feed.map((post) => {
                const author = personById(post.authorId) ?? profile;
                return (
                  <Link
                    key={post.id}
                    href="/campus"
                    className="flex gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-white/[0.03]"
                  >
                    <Avatar name={author.fullName} gradient={author.avatarColor} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <span className="font-semibold text-white">{author.fullName}</span>{" "}
                        <span className="text-white/40">· {timeAgo(post.createdAt)}</span>
                      </p>
                      <p className="line-clamp-2 text-sm text-white/55">{post.body}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Rank card */}
          <Card hover glow>
            <CardHeader title="Your campus rank" icon={<Trophy className="h-4 w-4" />} />
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-4xl font-bold text-gradient-capital">
                  {profile.campusRank > 0 ? `#${profile.campusRank}` : "Climbing"}
                </div>
                <p className="text-sm text-white/45">at {school.shortName}</p>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-bold text-white">#{schoolRank}</div>
                <p className="text-xs text-white/45">school nationally</p>
              </div>
            </div>
            <Link
              href="/leaderboards"
              className="mt-4 flex items-center justify-between rounded-2xl bg-white/[0.03] px-3.5 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/[0.06]"
            >
              See leaderboards
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Card>

          {/* Weekly challenge */}
          <Card hover>
            <CardHeader
              title="Complete your weekly challenge"
              icon={<Target className="h-4 w-4" />}
              action={<Pill tone="violet">+{challenge.xp} XP</Pill>}
            />
            <h3 className="font-display font-semibold text-white">{challenge.title}</h3>
            <p className="mt-1 text-sm text-white/50">{challenge.goal}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-white/45">
              <span>{challengeProg}% complete</span>
              <span className="inline-flex items-center gap-1">
                <Flame className="h-3 w-3 text-orange-400" /> {challenge.deadlineDays}d left
              </span>
            </div>
            <ProgressBar value={challengeProg} className="mt-2" />
            <Button href="/challenges" variant="outline" size="sm" className="mt-4 w-full">
              View challenges
            </Button>
          </Card>

          {/* Ask Capital Coach */}
          <Card hover>
            <CardHeader title="Ask Capital Coach" icon={<Bot className="h-4 w-4" />} />
            <p className="text-sm text-white/55">
              Stuck on something about money? Ask in plain language.
            </p>
            <Link
              href="/coach"
              className="mt-3 block rounded-2xl border border-white/10 bg-white/[0.02] px-3.5 py-3 text-sm text-white/45 transition-colors hover:border-capital-400/40"
            >
              &ldquo;I only have $50. Should I invest?&rdquo;
            </Link>
            <Button href="/coach" size="sm" className="mt-3 w-full">
              Open Capital Coach <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>

          {/* Watchlist */}
          <Card>
            <CardHeader title="Watchlist" subtitle="Tracked for learning" icon={<Eye className="h-4 w-4" />} />
            <div className="space-y-1">
              {WATCH.map((w) => {
                const q = quotes[w.ticker.toUpperCase()];
                return (
                  <Link key={w.ticker} href="/simulator" className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-white/[0.03]">
                    <div>
                      <p className="font-mono text-sm font-semibold text-white">{w.ticker}</p>
                      <p className="text-xs text-white/40">{w.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white">{q ? formatCurrency(q.price, { maximumFractionDigits: 2 }) : "..."}</p>
                      {q && (
                        <p className={cn("text-xs font-medium", q.changePct >= 0 ? "text-capital-300" : "text-rose-400")}>
                          {formatPercent(q.changePct)}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
            <p className="mt-3 text-center text-[11px] text-white/30">
              {quotes[WATCH[0].ticker]?.live ? "Live market prices" : "Simulated prices · educational only"}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "amber" | "capital";
}) {
  const color = tone === "amber" ? "text-amber-300" : "text-capital-300";
  return (
    <div className="rounded-2xl bg-white/[0.03] px-3 py-2 text-center">
      <p className="text-[10px] uppercase tracking-wider text-white/40">{label}</p>
      <p className={cn("font-display text-sm font-bold", color)}>{value}</p>
    </div>
  );
}
