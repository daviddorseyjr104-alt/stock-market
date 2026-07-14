"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Building2,
  MessageSquare,
  Search as SearchIcon,
  SearchX,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { allCourseLessons, courseById } from "@/lib/data/courses";
import { schools } from "@/lib/data/schools";
import { clubs } from "@/lib/data/clubs";
import {
  getFeed,
  getStudentLeaders,
  schoolShort,
  type FeedPost,
  type LeaderProfile,
} from "@/lib/social";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────────────────────────────────
// Search used to index `lib/data/people` and `lib/data/posts` — the invented
// roster (Maya Lin, Andre Diallo, …) that the leaderboards deliberately refuse
// to show — and present them as real students with levels and majors. It also
// indexed the OLD 23-lesson curriculum, so the 96 real lessons were unsearchable
// and every hit sent you into a parallel lesson product.
//
// Everything here now comes from real sources: course lessons, and students and
// posts from the database.
// ──────────────────────────────────────────────────────────────────────────

const popularTopics = ["ETFs", "Roth IRA", "Budget", "Compound", "Credit"];

const suggestedLessonIds = [
  "money-basics-u1-l1", // Needs vs. Wants
  "investing-u1-l2", // ETFs, Index Funds & Mutual Funds
  "investing-u3-l1", // Compound Growth
];

type ResultGroup = {
  key: string;
  label: string;
  icon: LucideIcon;
  items: React.ReactNode[];
};

function ResultRow({
  href,
  leading,
  title,
  meta,
}: {
  href: string;
  leading: React.ReactNode;
  title: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3.5 rounded-2xl border border-white/8 bg-white/[0.02] p-3.5 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.04]"
    >
      {leading}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white group-hover:text-capital-300">
          {title}
        </p>
        <p className="truncate text-xs text-white/45">{meta}</p>
      </div>
    </Link>
  );
}

function LessonIcon() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-capital-400/10 text-capital-300">
      <BookOpen className="h-5 w-5" />
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState<LeaderProfile[]>([]);
  const [posts, setPosts] = useState<FeedPost[]>([]);

  const q = query.trim().toLowerCase();
  const hasQuery = q.length > 0;

  // Real students and real posts, from the database.
  useEffect(() => {
    let alive = true;
    Promise.all([getStudentLeaders(), getFeed()]).then(([people, feed]) => {
      if (!alive) return;
      setStudents(people);
      setPosts(feed);
    });
    return () => {
      alive = false;
    };
  }, []);

  const groups = useMemo<ResultGroup[]>(() => {
    if (!hasQuery) return [];
    const match = (...fields: (string | undefined)[]) =>
      fields.some((f) => (f ?? "").toLowerCase().includes(q));

    const result: ResultGroup[] = [];

    const lessonHits = allCourseLessons.filter((l) => match(l.title, l.summary));
    if (lessonHits.length)
      result.push({
        key: "lessons",
        label: "Lessons",
        icon: BookOpen,
        items: lessonHits.slice(0, 12).map((l) => (
          <ResultRow
            key={l.id}
            href={`/learn/lesson/${l.id}`}
            leading={<LessonIcon />}
            title={l.title}
            meta={`${courseById(l.courseId)?.title ?? "Course"} · ${l.difficulty} · +${l.xp} XP`}
          />
        )),
      });

    const studentHits = students.filter((p) => match(p.fullName, p.major));
    if (studentHits.length)
      result.push({
        key: "people",
        label: "Students",
        icon: Users,
        items: studentHits.slice(0, 10).map((p) => (
          <ResultRow
            key={p.id}
            href="/leaderboards"
            leading={
              <Avatar
                name={p.fullName}
                gradient={p.avatarColor}
                src={p.avatarUrl}
                size="md"
              />
            }
            title={p.fullName}
            meta={[schoolShort(p.schoolId), p.major, `${p.xp.toLocaleString()} XP`]
              .filter(Boolean)
              .join(" · ")}
          />
        )),
      });

    const schoolHits = schools.filter((s) => match(s.name, s.shortName));
    if (schoolHits.length)
      result.push({
        key: "schools",
        label: "Schools",
        icon: Building2,
        items: schoolHits.map((s) => (
          <ResultRow
            key={s.id}
            href="/leaderboards"
            leading={
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg",
                  s.color,
                )}
              >
                {s.emoji}
              </div>
            }
            title={s.name}
            meta={s.location}
          />
        )),
      });

    const clubHits = clubs.filter((c) => match(c.name, c.tagline));
    if (clubHits.length)
      result.push({
        key: "clubs",
        label: "Clubs",
        icon: Sparkles,
        items: clubHits.map((c) => (
          <ResultRow
            key={c.id}
            href={`/clubs/${c.id}`}
            leading={
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg",
                  c.color,
                )}
              >
                {c.emoji}
              </div>
            }
            title={c.name}
            meta={c.tagline}
          />
        )),
      });

    const postHits = posts.filter((p) => match(p.body));
    if (postHits.length)
      result.push({
        key: "posts",
        label: "Campus posts",
        icon: MessageSquare,
        items: postHits.slice(0, 10).map((p) => (
          <ResultRow
            key={p.id}
            href="/campus"
            leading={
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                <MessageSquare className="h-5 w-5" />
              </div>
            }
            title={p.body}
            meta={`${p.author.name} · ${p.category}`}
          />
        )),
      });

    return result;
  }, [hasQuery, q, students, posts]);

  const totalResults = groups.reduce((n, g) => n + g.items.length, 0);

  const suggested = suggestedLessonIds
    .map((id) => allCourseLessons.find((l) => l.id === id))
    .filter((l): l is (typeof allCourseLessons)[number] => Boolean(l));

  return (
    <div>
      <PageHeader
        title="Search"
        subtitle="Find lessons, students, schools, clubs, and topics."
      />

      {/* Search input */}
      <div className="relative mb-7">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Campus Capital..."
          autoFocus
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-12 pr-4 text-base text-white placeholder:text-white/35 transition-colors focus:border-capital-400/40 focus:bg-white/[0.05] focus:outline-none focus-visible:ring-focus"
        />
      </div>

      {!hasQuery ? (
        <div className="space-y-7">
          <Card>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
              Popular topics
            </p>
            <div className="flex flex-wrap gap-2">
              {popularTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setQuery(topic)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-white/75 transition-colors hover:border-capital-400/40 hover:text-capital-300"
                >
                  {topic}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
              Suggested lessons
            </p>
            <div className="space-y-2.5">
              {suggested.map((l) => (
                <ResultRow
                  key={l.id}
                  href={`/learn/lesson/${l.id}`}
                  leading={<LessonIcon />}
                  title={l.title}
                  meta={`${courseById(l.courseId)?.title ?? "Course"} · +${l.xp} XP`}
                />
              ))}
            </div>
          </Card>
        </div>
      ) : totalResults === 0 ? (
        <EmptyState
          icon={<SearchX className="h-7 w-7" />}
          title={`No results for "${query}"`}
          description="Try a lesson topic like ETFs, budgeting, or credit."
        />
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.key}>
              <div className="mb-3 flex items-center gap-2">
                <group.icon className="h-4 w-4 text-capital-300" />
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white/60">
                  {group.label}
                </h2>
                <span className="text-xs text-white/35">{group.items.length}</span>
              </div>
              <div className="space-y-2.5">{group.items}</div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
