"use client";

import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Flame, Lock } from "lucide-react";

import { RingProgress } from "@/components/ui/Progress";
import { XPBadge } from "@/components/game/XPBadge";
import { HeartCounter } from "@/components/game/HeartCounter";
import { CoursePath } from "@/components/learn/CoursePath";
import { courses, lessonsForCourse } from "@/lib/data/courses";
import { useAppState, xpProgressInLevel } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Course } from "@/lib/types";

function iconFor(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;
}

const ordered = [...courses].sort((a, b) => a.order - b.order);

export default function LearnPage() {
  const { hydrated, profile, hearts, isCourseUnlocked, isLessonComplete } =
    useAppState();
  const [picked, setPicked] = useState<string | null>(null);

  // Per-course progress from real completion state.
  const progressById = useMemo(() => {
    const map: Record<string, { done: number; total: number; pct: number }> = {};
    for (const c of ordered) {
      const lessons = lessonsForCourse(c.id);
      const done = lessons.filter((l) => isLessonComplete(l.id)).length;
      const total = lessons.length;
      map[c.id] = { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.completedLessons]);

  // Default: the furthest unlocked course still in progress, else the first
  // unlocked course that isn't finished, else the first unlocked course.
  const defaultId = useMemo(() => {
    const unlocked = ordered.filter((c) => isCourseUnlocked(c.id));
    const inProgress = unlocked.find((c) => {
      const p = progressById[c.id];
      return p.done > 0 && p.done < p.total;
    });
    if (inProgress) return inProgress.id;
    const unfinished = unlocked.find(
      (c) => progressById[c.id].done < progressById[c.id].total,
    );
    return (unfinished ?? unlocked[0] ?? ordered[0]).id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressById]);

  const selectedId = picked ?? defaultId;
  const selected = ordered.find((c) => c.id === selectedId) ?? ordered[0];
  const selectedUnlocked = isCourseUnlocked(selected.id);
  const { pct: levelPct } = xpProgressInLevel(profile.xp);

  if (!hydrated) return <LearnSkeleton />;

  return (
    <div className="mx-auto w-full max-w-lg pb-[calc(2rem+env(safe-area-inset-bottom))]">
      {/* ── Sticky gamified HUD ─────────────────────────────────────────── */}
      <div className="sticky top-[60px] z-20">
        <div className="glass-strong flex items-center justify-between gap-2 rounded-3xl px-4 py-2.5 shadow-card">
          <div className="flex items-center gap-1.5" title={`${profile.streak}-day streak`}>
            <Flame
              className={cn(
                "h-5 w-5",
                profile.streak > 0 ? "text-amber-400" : "text-white/25",
              )}
              fill={profile.streak > 0 ? "currentColor" : "none"}
              aria-hidden
            />
            <span className="font-display text-base font-bold text-white">
              {profile.streak}
            </span>
          </div>
          <XPBadge value={profile.xp} />
          <HeartCounter hearts={hearts} max={profile.maxHearts ?? 5} />
          <RingProgress value={levelPct} size={40} stroke={4}>
            <span className="text-[9px] font-bold leading-none text-white">
              Lv {profile.level}
            </span>
          </RingProgress>
        </div>
      </div>

      {/* ── Course switcher ─────────────────────────────────────────────── */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold tracking-tight text-white">
            Courses
          </h1>
          <span className="text-xs font-medium text-white/40">
            {ordered.filter((c) => isCourseUnlocked(c.id)).length}/{ordered.length} unlocked
          </span>
        </div>
        <div className="-mx-1 flex snap-x gap-2.5 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ordered.map((c) => (
            <CourseChip
              key={c.id}
              course={c}
              locked={!isCourseUnlocked(c.id)}
              active={c.id === selectedId}
              pct={progressById[c.id].pct}
              onSelect={() => setPicked(c.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Selected course header + path ───────────────────────────────── */}
      <div className="mt-4">
        {selectedUnlocked ? (
          <>
            <div className="mb-5 flex items-start gap-3 rounded-3xl border border-white/8 bg-white/[0.03] p-4">
              <CourseGlyph course={selected} />
              <div className="min-w-0">
                <h2 className="font-display text-base font-bold tracking-tight text-white">
                  {selected.title}
                </h2>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-white/55">
                  {selected.tagline}
                </p>
                <p className="mt-1.5 text-[11px] font-semibold text-white/40">
                  {progressById[selected.id].done}/{progressById[selected.id].total} lessons ·{" "}
                  {progressById[selected.id].pct}%
                </p>
              </div>
            </div>
            <CoursePath course={selected} />
          </>
        ) : (
          <LockedCourse course={selected} />
        )}
      </div>
    </div>
  );
}

function CourseGlyph({ course }: { course: Course }) {
  const Icon = iconFor(course.icon);
  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-ink-950 shadow-card",
        course.color,
      )}
    >
      <Icon className="h-6 w-6" strokeWidth={2.2} aria-hidden />
    </div>
  );
}

function CourseChip({
  course,
  locked,
  active,
  pct,
  onSelect,
}: {
  course: Course;
  locked: boolean;
  active: boolean;
  pct: number;
  onSelect: () => void;
}) {
  const Icon = iconFor(course.icon);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "flex w-[132px] shrink-0 snap-start flex-col items-start gap-2 rounded-2xl border p-3 text-left transition-all focus-visible:ring-focus",
        active
          ? "border-capital-400/50 bg-capital-400/[0.08]"
          : "border-white/8 bg-white/[0.03] hover:border-white/20",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-ink-950",
          course.color,
          locked && "opacity-40 grayscale",
        )}
      >
        {locked ? (
          <Lock className="h-4 w-4" strokeWidth={2.4} aria-hidden />
        ) : (
          <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden />
        )}
      </span>
      <span className="line-clamp-1 text-xs font-bold text-white">{course.title}</span>
      {locked ? (
        <span className="text-[10px] font-semibold text-white/40">
          Reach Lv {course.unlockLevel}
        </span>
      ) : (
        <span className="text-[10px] font-semibold text-capital-300">{pct}% done</span>
      )}
    </button>
  );
}

function LockedCourse({ course }: { course: Course }) {
  return (
    <div className="glass flex flex-col items-center gap-3 rounded-3xl p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white/40">
        <Lock className="h-7 w-7" aria-hidden />
      </div>
      <h2 className="font-display text-lg font-bold tracking-tight text-white">
        {course.title} is locked
      </h2>
      <p className="max-w-sm text-sm leading-relaxed text-white/55">
        Reach <span className="font-semibold text-capital-300">level {course.unlockLevel}</span> to
        unlock this course. Keep finishing lessons in your unlocked courses to earn the XP.
      </p>
    </div>
  );
}

function LearnSkeleton() {
  return (
    <div className="mx-auto w-full max-w-lg space-y-5" aria-busy="true">
      <div className="skeleton h-[60px] w-full rounded-3xl" />
      <div className="flex gap-2.5 overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-[104px] w-[132px] shrink-0 rounded-2xl" />
        ))}
      </div>
      <div className="skeleton h-24 w-full rounded-3xl" />
      <div className="skeleton h-28 w-full rounded-3xl" />
    </div>
  );
}
