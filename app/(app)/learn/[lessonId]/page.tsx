import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { LessonQuiz } from "@/components/learn/LessonQuiz";
import { lessonById, lessonsByModule } from "@/lib/data/lessons";
import { modules, moduleById } from "@/lib/data/modules";
import type { Difficulty, Lesson } from "@/lib/types";

const difficultyTone: Record<Difficulty, "low" | "medium" | "high"> = {
  Beginner: "low",
  Intermediate: "medium",
  Advanced: "high",
};

// Next lesson: by order in same module, else first lesson of the next module.
function findNextLesson(lesson: Lesson): Lesson | null {
  const siblings = lessonsByModule(lesson.moduleId);
  const idx = siblings.findIndex((l) => l.id === lesson.id);
  if (idx !== -1 && idx < siblings.length - 1) {
    return siblings[idx + 1];
  }
  const moduleIdx = modules.findIndex((m) => m.id === lesson.moduleId);
  for (let i = moduleIdx + 1; i < modules.length; i++) {
    const first = lessonsByModule(modules[i].id)[0];
    if (first) return first;
  }
  return null;
}

export default function LessonPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const lesson = lessonById(params.lessonId);
  if (!lesson) notFound();

  const module = moduleById(lesson.moduleId);
  const next = findNextLesson(lesson);
  const nextModule = next ? moduleById(next.moduleId) : null;

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="space-y-4">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Learning Hub
        </Link>

        {module && (
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${module.color} font-display text-sm font-bold text-ink-950`}
            >
              {module.letter}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-white/45">
              {module.title}
            </span>
          </div>
        )}

        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
          {lesson.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <Pill tone={difficultyTone[lesson.difficulty]}>{lesson.difficulty}</Pill>
          <Pill tone="default">
            <Clock className="h-3.5 w-3.5" />
            {lesson.minutes} min
          </Pill>
          <Pill tone="violet">
            <Zap className="h-3.5 w-3.5" />+{lesson.xp} XP
          </Pill>
        </div>
      </header>

      {/* ── Student-life example ────────────────────────────────────────── */}
      <Card className="border-capital-400/20 bg-capital-400/[0.06]">
        <div className="flex items-center gap-2 text-capital-300">
          <GraduationCap className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Student-life example
          </span>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-white/80">
          {lesson.studentExample}
        </p>
      </Card>

      {/* ── Main explanation ────────────────────────────────────────────── */}
      <section className="space-y-5">
        {lesson.body.map((paragraph, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-white/70">
            {paragraph}
          </p>
        ))}
      </section>

      {/* ── Visual analogy ──────────────────────────────────────────────── */}
      <Card className="border-violet-500/20 bg-violet-500/[0.06]">
        <div className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
            <Lightbulb className="h-5 w-5" />
          </span>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Visual analogy
            </span>
            <p className="mt-1.5 text-[15px] italic leading-relaxed text-white/75">
              {lesson.analogy}
            </p>
          </div>
        </div>
      </Card>

      {/* ── Quiz ────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-capital-300" />
          <h2 className="font-display text-xl font-bold tracking-tight text-white">
            Test yourself
          </h2>
        </div>
        <LessonQuiz quiz={lesson.quiz} xp={lesson.xp} lessonId={lesson.id} />
      </section>

      {/* ── Key takeaway ────────────────────────────────────────────────── */}
      <Card glow className="border-capital-400/25 bg-capital-400/[0.07]">
        <div className="flex gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-capital-gradient text-ink-950 shadow-glow">
            <Star className="h-5 w-5" />
          </span>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-capital-300">
              Key takeaway
            </span>
            <p className="mt-1.5 font-display text-lg font-semibold leading-snug tracking-tight text-white">
              {lesson.takeaway}
            </p>
          </div>
        </div>
      </Card>

      {/* ── Next lesson ─────────────────────────────────────────────────── */}
      {next ? (
        <Link
          href={`/learn/${next.id}`}
          className="group block focus-visible:outline-none"
        >
          <Card hover className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                Up next{nextModule ? ` · Module ${nextModule.letter}` : ""}
              </span>
              <p className="mt-1 truncate font-display text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-capital-300">
                {next.title}
              </p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-capital-gradient text-ink-950 shadow-glow transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="h-5 w-5" />
            </span>
          </Card>
        </Link>
      ) : (
        <Card glow className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-capital-gradient text-ink-950 shadow-glow">
            <GraduationCap className="h-6 w-6" />
          </span>
          <p className="font-display text-lg font-bold tracking-tight text-white">
            You finished the track! 🎓
          </p>
          <p className="max-w-sm text-sm text-white/55">
            That&apos;s every lesson across all five modules. Time to put it into
            practice, and keep that streak alive.
          </p>
          <Button href="/learn" variant="secondary" size="md" className="mt-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Learning Hub
          </Button>
        </Card>
      )}
    </article>
  );
}
