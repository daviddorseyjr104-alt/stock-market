"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Award } from "lucide-react";
import { useAppState } from "@/lib/store";
import { lessonsForCourse } from "@/lib/data/courses";
import type { Course, Unit } from "@/lib/types";
import { LessonNode, type NodeState } from "./LessonNode";

function iconFor(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;
}

// Serpentine horizontal offsets: 0 → right → right → 0 → left → left → …
const AMPLITUDE = 84;
function offsetFor(globalIndex: number): number {
  return Math.round(Math.sin((globalIndex * Math.PI) / 3) * AMPLITUDE);
}

/** Dotted trail connecting two consecutive nodes on the path. */
function Trail({
  from,
  to,
  traveled,
}: {
  from: number;
  to: number;
  traveled: boolean;
}) {
  const W = 280;
  const H = 40;
  const cx = W / 2;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto block"
      aria-hidden
    >
      <path
        d={`M ${cx + from} -4 C ${cx + from} ${H / 2}, ${cx + to} ${H / 2}, ${cx + to} ${H + 4}`}
        fill="none"
        stroke={traveled ? "rgba(16,226,154,0.65)" : "rgba(255,255,255,0.14)"}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="0.5 11"
      />
    </svg>
  );
}

/** Colored banner introducing each unit, tinted with the course gradient. */
function UnitBanner({
  course,
  unit,
  index,
  total,
  done,
  count,
}: {
  course: Course;
  unit: Unit;
  index: number;
  total: number;
  done: number;
  count: number;
}) {
  const Icon = iconFor(course.icon);
  const pct = count > 0 ? Math.round((done / count) * 100) : 0;

  return (
    <section
      className={`rounded-3xl bg-gradient-to-br ${course.color} p-5 text-ink-950 shadow-card`}
      aria-label={`Unit ${unit.order}: ${unit.title}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink-950/60">
            Unit {unit.order} · {index + 1} of {total}
          </p>
          <h2 className="mt-0.5 font-display text-lg font-bold tracking-tight">
            {unit.title}
          </h2>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-950/75">
            {unit.subtitle}
          </p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink-950/15">
          <Icon className="h-[22px] w-[22px]" strokeWidth={2.2} aria-hidden />
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-ink-950/70">
          <span>
            {done}/{count} lessons
          </span>
          <span>{pct}%</span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-ink-950/20"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-ink-950/80 transition-[width] duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * The Duolingo winding path for ONE course: 3 unit banners, each followed by
 * a serpentine trail of lesson nodes. The unit-final challenge renders as a
 * bigger boss node. States (completed / active / locked) come from the store.
 */
export function CoursePath({ course }: { course: Course }) {
  const { isLessonComplete } = useAppState();
  const reduceMotion = useReducedMotion();

  const flat = lessonsForCourse(course.id);
  const firstIncompleteIdx = flat.findIndex((l) => !isLessonComplete(l.id));
  const allDone = firstIncompleteIdx === -1;

  const stateFor = (globalIndex: number): NodeState => {
    if (isLessonComplete(flat[globalIndex].id)) return "completed";
    if (globalIndex === firstIncompleteIdx) return "active";
    return "locked";
  };

  const units = [...course.units].sort((a, b) => a.order - b.order);
  let globalIndex = 0;

  return (
    <div className="space-y-8">
      {units.map((unit, ui) => {
        const unitLessons = [...unit.lessons].sort((a, b) => a.order - b.order);
        const done = unitLessons.filter((l) => isLessonComplete(l.id)).length;
        const startIndex = globalIndex;
        globalIndex += unitLessons.length;

        return (
          <motion.section
            key={unit.id}
            className="space-y-7"
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: ui * 0.1,
              ease: [0.21, 0.6, 0.35, 1],
            }}
          >
            <UnitBanner
              course={course}
              unit={unit}
              index={ui}
              total={units.length}
              done={done}
              count={unitLessons.length}
            />

            {/* pt-6 gives the floating START/BOSS bubble room above the first node */}
            <div className="flex flex-col items-center pt-6">
              {unitLessons.map((lesson, li) => {
                const gi = startIndex + li;
                return (
                  <Fragment key={lesson.id}>
                    {li > 0 && (
                      <Trail
                        from={offsetFor(gi - 1)}
                        to={offsetFor(gi)}
                        traveled={isLessonComplete(unitLessons[li - 1].id)}
                      />
                    )}
                    <LessonNode
                      lesson={lesson}
                      state={stateFor(gi)}
                      courseColor={course.color}
                      offset={offsetFor(gi)}
                      index={gi}
                      hint={
                        lesson.kind === "challenge"
                          ? "Clear the unit's lessons to face the boss"
                          : "Finish the lesson before this to unlock"
                      }
                    />
                  </Fragment>
                );
              })}
            </div>
          </motion.section>
        );
      })}

      {allDone && (
        <div className="glass flex items-center gap-4 rounded-3xl p-5 shadow-card">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400">
            <Award className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="font-display text-base font-bold text-white">
              Course complete, certificate earned!
            </p>
            <p className="text-sm text-white/55">
              Tap any node above to review a lesson, or pick your next course
              from the switcher.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
