"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";
import { ProgressBar } from "@/components/ui/Progress";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { StatCard } from "@/components/ui/StatCard";
import { modules } from "@/lib/data/modules";
import { lessons, lessonsByModule } from "@/lib/data/lessons";
import { useAppState } from "@/lib/store";
import type { Difficulty, Lesson } from "@/lib/types";

const difficultyTone: Record<Difficulty, "low" | "medium" | "high"> = {
  Beginner: "low",
  Intermediate: "medium",
  Advanced: "high",
};

// Ordered list of all lessons, module A→E then by lesson order within a module.
function orderedLessons(): Lesson[] {
  return modules.flatMap((m) => lessonsByModule(m.id));
}

export default function LearnPage() {
  const { profile, isLessonComplete } = useAppState();
  const ordered = orderedLessons();

  const completedCount = ordered.filter((l) => isLessonComplete(l.id)).length;
  const totalCount = ordered.length;
  const overallPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const earnedXp = ordered
    .filter((l) => isLessonComplete(l.id))
    .reduce((sum, l) => sum + l.xp, 0);
  const totalXp = ordered.reduce((sum, l) => sum + l.xp, 0);

  const modulesComplete = modules.filter((m) =>
    lessonsByModule(m.id).every((l) => isLessonComplete(l.id)),
  ).length;

  // First lesson (in module order) the user hasn't done yet; else the very first.
  const nextLesson = ordered.find((l) => !isLessonComplete(l.id)) ?? ordered[0];
  const nextModule = modules.find((m) => m.id === nextLesson.moduleId);
  const finishedTrack = ordered.every((l) => isLessonComplete(l.id));

  return (
    <div className="space-y-10">
      <PageHeader
        title="Learning Hub"
        subtitle="Bite-sized lessons that turn real student money, aid, jobs, rent, internships, into investing instincts."
        action={
          <div className="flex items-center gap-2.5">
            <Pill tone="amber" className="px-3 py-1">
              <Flame className="h-3.5 w-3.5" />
              {profile.streak} day streak
            </Pill>
            <Pill tone="capital" className="px-3 py-1">
              <Zap className="h-3.5 w-3.5" />
              {profile.xp.toLocaleString()} XP
            </Pill>
          </div>
        }
      />

      {/* ── Continue learning hero ─────────────────────────────────────── */}
      <Reveal>
        <Card glow className="relative overflow-hidden p-0">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-capital-gradient opacity-20 blur-3xl"
          />
          <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="capital">
                  <PlayCircle className="h-3.5 w-3.5" />
                  {finishedTrack ? "Keep your streak alive" : "Continue learning"}
                </Pill>
                {nextModule && (
                  <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                    Module {nextModule.letter} · {nextModule.title}
                  </span>
                )}
              </div>

              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {nextLesson.title}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
                  {nextLesson.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
                <Pill tone={difficultyTone[nextLesson.difficulty]}>
                  {nextLesson.difficulty}
                </Pill>
                <Pill tone="default">
                  <Clock className="h-3.5 w-3.5" />
                  {nextLesson.minutes} min
                </Pill>
                <Pill tone="violet">
                  <Zap className="h-3.5 w-3.5" />+{nextLesson.xp} XP
                </Pill>
              </div>

              <div className="pt-1">
                <Button href={`/learn/${nextLesson.id}`} size="lg">
                  {finishedTrack ? "Review this lesson" : "Resume lesson"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress panel */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                  Track progress
                </span>
                <GraduationCap className="h-4 w-4 text-capital-300" />
              </div>
              <div className="mt-3 flex items-end gap-2">
                <span className="font-display text-4xl font-bold tracking-tight text-white">
                  <AnimatedNumber value={overallPct} suffix="%" />
                </span>
                <span className="mb-1 text-sm text-white/45">complete</span>
              </div>
              <ProgressBar value={overallPct} className="mt-3" />
              <div className="mt-3 flex items-center justify-between text-xs text-white/50">
                <span>
                  {completedCount} of {totalCount} lessons
                </span>
                <span>
                  {modulesComplete}/{modules.length} modules
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Reveal>

      {/* ── Progress strip ─────────────────────────────────────────────── */}
      <Reveal delay={0.05}>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Lessons done"
            value={
              <span>
                {completedCount}
                <span className="text-lg text-white/35">/{totalCount}</span>
              </span>
            }
            sub={`${overallPct}% of the full track`}
            icon={<BookOpen className="h-4 w-4" />}
            tone="capital"
          />
          <StatCard
            label="Lesson XP earned"
            value={<AnimatedNumber value={earnedXp} />}
            sub={`of ${totalXp.toLocaleString()} available`}
            icon={<Zap className="h-4 w-4" />}
            tone="violet"
          />
          <StatCard
            label="Modules complete"
            value={
              <span>
                {modulesComplete}
                <span className="text-lg text-white/35">/{modules.length}</span>
              </span>
            }
            sub="A through E"
            icon={<Trophy className="h-4 w-4" />}
            tone="amber"
          />
          <StatCard
            label="Day streak"
            value={<AnimatedNumber value={profile.streak} />}
            sub="Keep it burning"
            icon={<Flame className="h-4 w-4" />}
            tone="rose"
          />
        </div>
      </Reveal>

      {/* ── Modules ────────────────────────────────────────────────────── */}
      {modules.map((m, mi) => {
        const moduleLessons = lessonsByModule(m.id);
        const moduleDone = moduleLessons.filter((l) => isLessonComplete(l.id)).length;
        const modulePct = moduleLessons.length
          ? Math.round((moduleDone / moduleLessons.length) * 100)
          : 0;

        return (
          <Reveal key={m.id} delay={0.04 * (mi % 3)}>
            <section className="space-y-5">
              <div className="flex flex-wrap items-center gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${m.color} font-display text-2xl font-bold text-ink-950 shadow-glow`}
                >
                  {m.letter}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-bold tracking-tight text-white">
                      {m.title}
                    </h2>
                    {modulePct === 100 ? (
                      <Pill tone="capital">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Complete
                      </Pill>
                    ) : (
                      <Pill tone="default">
                        {moduleDone}/{moduleLessons.length} done
                      </Pill>
                    )}
                  </div>
                  <p className="mt-1 max-w-2xl text-sm text-white/55">
                    {m.description}
                  </p>
                </div>
                <div className="hidden w-40 shrink-0 sm:block">
                  <div className="mb-1.5 text-right text-xs text-white/45">
                    {modulePct}%
                  </div>
                  <ProgressBar value={modulePct} showGlow={modulePct > 0} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {moduleLessons.map((lesson) => {
                  const completed = isLessonComplete(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/learn/${lesson.id}`}
                      className="group block focus-visible:outline-none"
                    >
                      <Card
                        hover
                        className="flex h-full flex-col gap-3 focus-visible:ring-focus"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <Pill tone={difficultyTone[lesson.difficulty]}>
                            {lesson.difficulty}
                          </Pill>
                          {completed ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-capital-300" />
                          ) : (
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/30">
                              {lesson.order
                                .toString()
                                .padStart(2, "0")}
                            </span>
                          )}
                        </div>

                        <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-white transition-colors group-hover:text-capital-300">
                          {lesson.title}
                        </h3>

                        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-white/55">
                          {lesson.summary}
                        </p>

                        <div className="mt-1 flex items-center gap-3 border-t border-white/5 pt-3 text-xs text-white/50">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {lesson.minutes} min
                          </span>
                          <span className="inline-flex items-center gap-1 text-violet-400">
                            <Zap className="h-3.5 w-3.5" />+{lesson.xp} XP
                          </span>
                          <span className="ml-auto inline-flex items-center gap-1 font-medium text-white/40 transition-colors group-hover:text-capital-300">
                            {completed ? "Review" : "Start"}
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          </Reveal>
        );
      })}

      <Reveal>
        <Card className="flex flex-col items-center gap-3 py-8 text-center">
          <Sparkles className="h-6 w-6 text-capital-300" />
          <p className="max-w-md text-sm text-white/55">
            New lessons drop every week. Keep your streak alive and you&apos;ll
            outpace investors twice your age, all before your first real dollar.
          </p>
        </Card>
      </Reveal>
    </div>
  );
}
