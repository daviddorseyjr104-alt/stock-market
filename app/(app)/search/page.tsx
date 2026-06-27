"use client";

import { useMemo, useState } from "react";
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
import { Pill } from "@/components/ui/Pill";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { lessons } from "@/lib/data/lessons";
import { people } from "@/lib/data/people";
import { schools } from "@/lib/data/schools";
import { clubs } from "@/lib/data/clubs";
import { posts } from "@/lib/data/posts";
import { personById } from "@/lib/data/people";
import { cn } from "@/lib/utils";

const popularTopics = [
  "ETFs",
  "Roth IRA",
  "Budgeting",
  "Compound interest",
  "Diversification",
];

const suggestedLessonIds = ["etfs", "roth-ira", "compound-interest"];

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

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const hasQuery = q.length > 0;

  const groups = useMemo<ResultGroup[]>(() => {
    if (!hasQuery) return [];
    const match = (...fields: string[]) =>
      fields.some((f) => f.toLowerCase().includes(q));

    const lessonHits = lessons.filter((l) => match(l.title, l.summary));
    const peopleHits = people.filter((p) => match(p.fullName, p.major));
    const schoolHits = schools.filter((s) => match(s.name, s.shortName));
    const clubHits = clubs.filter((c) => match(c.name, c.tagline));
    const postHits = posts.filter((p) => match(p.body));

    const result: ResultGroup[] = [];

    if (lessonHits.length)
      result.push({
        key: "lessons",
        label: "Lessons",
        icon: BookOpen,
        items: lessonHits.map((l) => (
          <ResultRow
            key={l.id}
            href={`/learn/${l.id}`}
            leading={
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-capital-400/10 text-capital-300">
                <BookOpen className="h-5 w-5" />
              </div>
            }
            title={l.title}
            meta={`${l.difficulty} · ${l.minutes} min · +${l.xp} XP`}
          />
        )),
      });

    if (peopleHits.length)
      result.push({
        key: "people",
        label: "Students",
        icon: Users,
        items: peopleHits.map((p) => (
          <ResultRow
            key={p.id}
            href="/campus"
            leading={
              <Avatar
                name={p.fullName}
                gradient={p.avatarColor}
                size="md"
              />
            }
            title={p.fullName}
            meta={`@${p.username} · ${p.major} · Level ${p.level}`}
          />
        )),
      });

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
            meta={`${s.location} · ${s.activeStudents.toLocaleString()} students`}
          />
        )),
      });

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
            meta={`${c.tagline} · ${c.members.toLocaleString()} members`}
          />
        )),
      });

    if (postHits.length)
      result.push({
        key: "posts",
        label: "Campus posts",
        icon: MessageSquare,
        items: postHits.map((p) => {
          const author = personById(p.authorId);
          return (
            <ResultRow
              key={p.id}
              href="/campus"
              leading={
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                  <MessageSquare className="h-5 w-5" />
                </div>
              }
              title={p.body}
              meta={`${author?.fullName ?? "Student"} · ${p.category}`}
            />
          );
        }),
      });

    return result;
  }, [hasQuery, q]);

  const totalResults = groups.reduce((n, g) => n + g.items.length, 0);

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
          {/* Popular topics */}
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

          {/* Suggested lessons */}
          <Card>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
              Suggested lessons
            </p>
            <div className="space-y-2.5">
              {suggestedLessonIds
                .map((id) => lessons.find((l) => l.id === id))
                .filter((l): l is (typeof lessons)[number] => Boolean(l))
                .map((l) => (
                  <ResultRow
                    key={l.id}
                    href={`/learn/${l.id}`}
                    leading={
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-capital-400/10 text-capital-300">
                        <BookOpen className="h-5 w-5" />
                      </div>
                    }
                    title={l.title}
                    meta={`${l.difficulty} · ${l.minutes} min · +${l.xp} XP`}
                  />
                ))}
            </div>
          </Card>
        </div>
      ) : totalResults === 0 ? (
        <EmptyState
          icon={<SearchX className="h-7 w-7" />}
          title="No results"
          description={`Nothing matched "${query}". Try a topic like ETFs, Roth IRA, or budgeting.`}
        />
      ) : (
        <div className="space-y-7">
          {groups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <section key={group.key}>
                <div className="mb-3 flex items-center gap-2">
                  <GroupIcon className="h-4 w-4 text-capital-300" />
                  <h2 className="font-display text-sm font-semibold text-white">
                    {group.label}
                  </h2>
                  <Pill tone="default">{group.items.length}</Pill>
                </div>
                <div className="space-y-2.5">{group.items}</div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
