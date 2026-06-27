"use client";

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
import {
  portfolioValue,
  dayChange,
  riskScore,
  riskLabel,
  diversificationScore,
} from "@/lib/portfolio-utils";
import { formatCurrency, timeAgo, cn } from "@/lib/utils";

function nextLesson(isLessonComplete: (id: string) => boolean) {
  for (const m of modules) {
    for (const l of lessonsByModule(m.id)) {
      if (!isLessonComplete(l.id)) return l;
    }
  }
  return lessonById("portfolio-allocation")!;
}

const watchlist = [
  { ticker: "VTI", name: "Total US Market", price: 268.4, change: 0.8 },
  { ticker: "VOO", name: "S&P 500 ETF", price: 512.1, change: 1.1 },
  { ticker: "SCHD", name: "Dividend ETF", price: 81.7, change: -0.3 },
  { ticker: "QQQ", name: "Nasdaq-100", price: 484.2, change: 1.6 },
];

export default function DashboardPage() {
  const { profile, posts, portfolio, isLessonComplete } = useAppState();
  const school = schoolById(profile.schoolId)!;
  const lesson = nextLesson(isLessonComplete);
  const lessonModule = modules.find((m) => m.id === lesson.moduleId);
  const challenge = challenges.find((c) => c.progress > 0) ?? challenges[0];
  const value = portfolioValue(portfolio);
  const change = dayChange(portfolio);
  const rScore = riskScore(portfolio.holdings);
  const dScore = diversificationScore(portfolio.holdings);
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
              </div>
              <div className="flex gap-3">
                <MiniStat label="Risk" value={riskLabel(rScore)} tone="amber" />
                <MiniStat label="Diversification" value={`${dScore}/100`} tone="capital" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {portfolio.holdings.slice(0, 3).map((h) => (
                <div key={h.id} className="flex items-center gap-3">
                  <span className="w-12 font-mono text-xs font-semibold text-white/70">{h.ticker}</span>
                  <ProgressBar value={h.allocation * 2.4} className="h-1.5 flex-1" />
                  <span className="w-9 text-right text-xs text-white/45">{h.allocation}%</span>
                </div>
              ))}
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
              <span>{challenge.progress}% complete</span>
              <span className="inline-flex items-center gap-1">
                <Flame className="h-3 w-3 text-orange-400" /> {challenge.deadlineDays}d left
              </span>
            </div>
            <ProgressBar value={challenge.progress} className="mt-2" />
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
              {watchlist.map((w) => (
                <div key={w.ticker} className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-white/[0.03]">
                  <div>
                    <p className="font-mono text-sm font-semibold text-white">{w.ticker}</p>
                    <p className="text-xs text-white/40">{w.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">${w.price.toFixed(2)}</p>
                    <p className={cn("text-xs font-medium", w.change >= 0 ? "text-capital-300" : "text-rose-400")}>
                      {w.change >= 0 ? "+" : ""}
                      {w.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-[11px] text-white/30">
              Illustrative prices · educational only
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
