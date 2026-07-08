import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { Footer } from "@/components/landing/Footer";
import {
  StatBand,
  CourseMarquee,
  LearnSection,
  SimulatorsSection,
  CompeteSection,
  CoachSection,
  FinalCTA,
  type LandingStats,
  type MarqueeCourse,
} from "@/components/landing/Sections";
import { courses, allCourseLessons, lessonsForCourse } from "@/lib/data/courses";
import { sims } from "@/components/sim/registry";

/**
 * Server component: every stat below is computed from the real catalog at
 * build time, so the landing page can never drift out of sync (or lie).
 * Only the numbers cross to the client, course content stays server-side.
 */
export default function LandingPage() {
  const stats: LandingStats = {
    courses: courses.length,
    lessons: allCourseLessons.length,
    simulators: sims.length,
    questions: allCourseLessons.reduce(
      (sum, l) => sum + l.cards.filter((c) => c.kind === "question").length,
      0,
    ),
    totalXp: allCourseLessons.reduce((sum, l) => sum + l.xp, 0),
  };

  const marqueeCourses: MarqueeCourse[] = courses.map((c) => ({
    id: c.id,
    title: c.title,
    tagline: c.tagline,
    icon: c.icon,
    color: c.color,
    lessons: lessonsForCourse(c.id).length,
  }));

  return (
    <main className="relative">
      <LandingNav />
      <Hero />
      <StatBand stats={stats} />
      <CourseMarquee items={marqueeCourses} />
      <LearnSection stats={stats} />
      <SimulatorsSection />
      <CompeteSection />
      <CoachSection />
      <FinalCTA stats={stats} />
      <Footer />
    </main>
  );
}
