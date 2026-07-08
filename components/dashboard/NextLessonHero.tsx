"use client";

import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Play, Trophy } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { EmptyState } from "@/components/ui/EmptyState";
import { courseById, unitById } from "@/lib/data/courses";
import type { CourseLesson } from "@/lib/types";
import { cn } from "@/lib/utils";

function icon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;
}

/**
 * Next-best-action hero, the single biggest hook on the dashboard.
 * Points the user at their current lesson (first incomplete unlocked lesson)
 * with a shimmering CTA. Falls back to a celebration card when every
 * unlocked lesson is done.
 */
export function NextLessonHero({
  lesson,
  started,
}: {
  /** First incomplete unlocked course lesson; undefined = all caught up. */
  lesson?: CourseLesson;
  /** Whether the user has completed at least one lesson ever. */
  started: boolean;
}) {
  const reduceMotion = useReducedMotion();

  if (!lesson) {
    return (
      <Card hover glow>
        <CardHeader
          title="Your next move"
          icon={<Play className="h-4 w-4" />}
        />
        <EmptyState
          icon={<Trophy className="h-7 w-7" />}
          title="Every unlocked lesson done 🎉"
          description="You're all caught up. Level up to unlock new courses, or replay a challenge to keep your streak alive."
          action={
            <Button href="/learn" size="sm">
              Explore courses <ArrowRight className="h-4 w-4" />
            </Button>
          }
        />
      </Card>
    );
  }

  const course = courseById(lesson.courseId);
  const unit = unitById(lesson.unitId);
  const CourseIcon = icon(course?.icon ?? "Sparkles");
  const isChallenge = lesson.kind === "challenge";

  return (
    <Card glow className="relative overflow-hidden p-0">
      {/* Ambient course-tinted glow */}
      <div
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-gradient-to-br opacity-20 blur-3xl",
          course?.color ?? "from-capital-400 to-capital-600",
        )}
      />
      {/* Slow shimmer sweep to draw the eye (skipped for reduced motion) */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-2/5 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
          animate={{ x: ["-130%", "300%"] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            repeatDelay: 2.4,
            ease: "easeInOut",
          }}
        />
      )}

      <div className="relative p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-capital-300">
            <Play className="h-3.5 w-3.5" fill="currentColor" />
            {started ? "Pick up where you left off" : "Your journey starts here"}
          </p>
          <Pill tone="capital">+{lesson.xp} XP</Pill>
        </div>

        <div className="mt-4 flex items-start gap-4">
          <motion.span
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-ink-950 shadow-card",
              course?.color ?? "from-capital-400 to-capital-600",
            )}
            animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <CourseIcon className="h-6 w-6" />
          </motion.span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-white/45">
              {course?.title ?? "Course"}
              {unit ? ` · ${unit.title}` : ""}
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl font-bold tracking-tight text-white">
                {lesson.title}
              </h2>
              <Pill tone={isChallenge ? "amber" : "default"}>
                {isChallenge ? "Boss challenge" : lesson.difficulty}
              </Pill>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-white/55">
              {lesson.summary}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button href={`/learn/lesson/${lesson.id}`} size="lg">
            {started ? "Continue" : "Start your first lesson"}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/learn" variant="ghost" size="lg">
            View path
          </Button>
        </div>
      </div>
    </Card>
  );
}
