import type { Course, CourseLesson, Unit } from "@/lib/types";
import { moneyBasicsCourse } from "@/lib/course-data/money-basics";
import { creditDebtCourse } from "@/lib/course-data/credit-debt";
import { investingCourse } from "@/lib/course-data/investing";
import { realEstateCourse } from "@/lib/course-data/real-estate";
import { startupBuildingCourse } from "@/lib/course-data/startup-building";
import { salesNetworkingCourse } from "@/lib/course-data/sales-networking";
import { careerCapitalCourse } from "@/lib/course-data/career-capital";
import { ventureCapitalCourse } from "@/lib/course-data/venture-capital";

// ──────────────────────────────────────────────────────────────────────────
// The course catalog. Each course lives in its own file under
// lib/course-data/<course-id>.ts and is assembled here in display order.
// ──────────────────────────────────────────────────────────────────────────

export const courses: Course[] = [
  moneyBasicsCourse,
  creditDebtCourse,
  investingCourse,
  realEstateCourse,
  startupBuildingCourse,
  salesNetworkingCourse,
  careerCapitalCourse,
  ventureCapitalCourse,
].sort((a, b) => a.order - b.order);

// ── Accessors ──────────────────────────────────────────────────────────────

const courseMap = new Map<string, Course>(courses.map((c) => [c.id, c]));

const unitMap = new Map<string, Unit>(
  courses.flatMap((c) => c.units.map((u) => [u.id, u] as const)),
);

/** Every lesson, flat, in course → unit → lesson order. */
export const allCourseLessons: CourseLesson[] = courses.flatMap((c) =>
  [...c.units]
    .sort((a, b) => a.order - b.order)
    .flatMap((u) => [...u.lessons].sort((a, b) => a.order - b.order)),
);

const lessonMap = new Map<string, CourseLesson>(
  allCourseLessons.map((l) => [l.id, l]),
);

export function courseById(id: string): Course | undefined {
  return courseMap.get(id);
}

export function unitById(id: string): Unit | undefined {
  return unitMap.get(id);
}

export function courseLessonById(id: string): CourseLesson | undefined {
  return lessonMap.get(id);
}

/** All lessons of a course, flat, in unit → lesson order. */
export function lessonsForCourse(courseId: string): CourseLesson[] {
  return allCourseLessons.filter((l) => l.courseId === courseId);
}

export function firstLessonOfCourse(courseId: string): CourseLesson | undefined {
  return lessonsForCourse(courseId)[0];
}

/**
 * The next lesson after `lessonId` within the SAME course (unit boundaries
 * are crossed). Returns undefined for unknown ids or the last lesson.
 */
export function nextLessonId(lessonId: string): string | undefined {
  const lesson = lessonMap.get(lessonId);
  if (!lesson) return undefined;
  const flat = lessonsForCourse(lesson.courseId);
  const i = flat.findIndex((l) => l.id === lessonId);
  if (i < 0 || i === flat.length - 1) return undefined;
  return flat[i + 1].id;
}
