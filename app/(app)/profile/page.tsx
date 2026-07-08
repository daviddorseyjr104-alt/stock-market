"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  Check,
  GraduationCap,
  Lock,
  MapPin,
  MessageSquareText,
  ScrollText,
  Settings,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { Reveal } from "@/components/ui/Reveal";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { SkillTree } from "@/components/profile/SkillTree";
import { AchievementModal } from "@/components/game/AchievementModal";
import { schoolById } from "@/lib/data/schools";
import { badges, badgeById } from "@/lib/data/badges";
import { clubById } from "@/lib/data/clubs";
import { courseById, courseLessonById, courses } from "@/lib/data/courses";
import { lessonById } from "@/lib/data/lessons";
import type { Badge } from "@/lib/types";
import { useAppState, levelForXp } from "@/lib/store";
import { cn, timeAgo } from "@/lib/utils";

function icon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Sparkles;
}

const rarityTone = {
  Common: "default",
  Rare: "sky",
  Epic: "violet",
  Legendary: "amber",
} as const;

export default function ProfilePage() {
  const {
    hydrated,
    profile,
    certificates,
    coachNotes,
    savedProjects,
    deleteProject,
    deleteCoachNote,
  } = useAppState();
  const school = schoolById(profile.schoolId);
  const [openBadge, setOpenBadge] = useState<string | null>(null);

  const level = levelForXp(profile.xp);
  const earnedIds = useMemo(() => new Set(profile.badges), [profile.badges]);

  // Completed lessons grouped by course (course engine lessons), plus any
  // legacy-path lessons the user finished.
  const { byCourse, legacyLessons } = useMemo(() => {
    const map = new Map<string, { title: string; xp: number }[]>();
    const legacy: { id: string; title: string; xp: number }[] = [];
    for (const id of profile.completedLessons) {
      const cl = courseLessonById(id);
      if (cl) {
        const list = map.get(cl.courseId) ?? [];
        list.push({ title: cl.title, xp: cl.xp });
        map.set(cl.courseId, list);
        continue;
      }
      const legacyLesson = lessonById(id);
      if (legacyLesson) legacy.push({ id, title: legacyLesson.title, xp: legacyLesson.xp });
    }
    return { byCourse: map, legacyLessons: legacy };
  }, [profile.completedLessons]);

  const userClubs = useMemo(
    () =>
      profile.clubs
        .map((id) => clubById(id))
        .filter((c): c is NonNullable<ReturnType<typeof clubById>> => Boolean(c)),
    [profile.clubs],
  );

  const completedCount = profile.completedLessons.length;

  if (!hydrated) return <ProfileSkeleton />;

  return (
    <div className="space-y-6">
      {/* Banner / identity */}
      <Reveal>
        <Card glow className="glass-hi relative overflow-hidden p-0">
          {/* Aurora banner */}
          <div className="relative h-28 w-full overflow-hidden sm:h-32">
            <div className="absolute inset-0 bg-capital-gradient opacity-90" />
            <div className="absolute inset-0 animate-aurora bg-mesh mix-blend-overlay" />
            <div className="absolute inset-0 bg-noise opacity-60" />
          </div>
          <div className="absolute right-5 top-5">
            <Button variant="secondary" size="sm" href="/settings">
              <Settings className="h-4 w-4" />
              Edit profile
            </Button>
          </div>
          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-11 sm:-mt-14">
              <div className="gradient-border glow-ring inline-block rounded-full p-1.5">
                <Avatar
                  name={profile.fullName}
                  gradient={profile.avatarColor}
                  size="xl"
                  className="shadow-float"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-glow font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {profile.fullName}
                  </h1>
                  <Pill tone="capital">Lv. {level}</Pill>
                  <Pill tone="violet">{profile.investingLevel}</Pill>
                </div>
                <p className="mt-1 text-sm text-white/50">@{profile.username}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/55">
              {school && (
                <Link
                  href="/leaderboards"
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-capital-300"
                >
                  <span className="text-base leading-none">{school.emoji}</span>
                  {school.shortName}
                </Link>
              )}
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-white/35" />
                {profile.major}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-white/35" />
                Class of {profile.gradYear} · {profile.studentType}
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">{profile.bio}</p>
          </div>
        </Card>
      </Reveal>

      {/* Stats */}
      <Reveal delay={0.05}>
        <ProfileStats profile={profile} />
      </Reveal>

      {/* Badges */}
      <Reveal delay={0.1}>
        <Card>
          <CardHeader
            title="Badges"
            subtitle={`${earnedIds.size} of ${badges.length} earned`}
            icon={<Award className="h-4 w-4" />}
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {badges.map((b) => (
              <BadgeCard
                key={b.id}
                badge={b}
                earned={earnedIds.has(b.id)}
                onClick={() => earnedIds.has(b.id) && setOpenBadge(b.id)}
              />
            ))}
          </div>
        </Card>
      </Reveal>

      {/* Skill tree */}
      <Reveal delay={0.1}>
        <Card>
          <CardHeader
            title="Skill tree"
            subtitle="Mastery across all 8 Campus Capital courses"
            icon={<Sparkles className="h-4 w-4" />}
            action={
              <Link href="/learn" className="text-sm text-capital-300 hover:underline">
                Go to Learn →
              </Link>
            }
          />
          <SkillTree />
        </Card>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Completed lessons by course */}
        <Reveal delay={0.1} className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Completed lessons"
              subtitle={`${completedCount} finished`}
              icon={<BookOpen className="h-4 w-4" />}
            />
            {completedCount === 0 ? (
              <EmptyState
                icon={<BookOpen className="h-7 w-7" />}
                title="No lessons yet"
                description="Start your first lesson to begin earning XP, badges and certificates."
                action={
                  <Button href="/learn" size="sm">
                    Browse courses
                  </Button>
                }
              />
            ) : (
              <div className="space-y-5">
                {courses.map((course) => {
                  const done = byCourse.get(course.id);
                  if (!done || done.length === 0) return null;
                  const Ic = icon(course.icon);
                  return (
                    <div key={course.id}>
                      <div className="mb-2 flex items-center gap-2.5">
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br text-ink-950",
                            course.color,
                          )}
                        >
                          <Ic className="h-4 w-4" />
                        </span>
                        <p className="text-sm font-semibold text-white">{course.title}</p>
                        <Pill tone="capital">{done.length} done</Pill>
                      </div>
                      <div className="space-y-1 pl-1">
                        {done.map((l, i) => (
                          <div
                            key={`${course.id}-${i}`}
                            className="flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 hover:bg-white/[0.02]"
                          >
                            <span className="inline-flex min-w-0 items-center gap-2">
                              <Check className="h-3.5 w-3.5 shrink-0 text-capital-300" strokeWidth={3} />
                              <span className="truncate text-sm text-white/75">{l.title}</span>
                            </span>
                            <span className="shrink-0 text-xs text-white/40">+{l.xp} XP</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {legacyLessons.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-semibold text-white">Other lessons</p>
                    <div className="space-y-1 pl-1">
                      {legacyLessons.map((l) => (
                        <Link
                          key={l.id}
                          href={`/learn/${l.id}`}
                          className="flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 hover:bg-white/[0.02]"
                        >
                          <span className="inline-flex min-w-0 items-center gap-2">
                            <Check className="h-3.5 w-3.5 shrink-0 text-capital-300" strokeWidth={3} />
                            <span className="truncate text-sm text-white/75">{l.title}</span>
                          </span>
                          <span className="shrink-0 text-xs text-white/40">+{l.xp} XP</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </Reveal>

        {/* Right column: certificates + clubs + interests */}
        <Reveal delay={0.15}>
          <div className="space-y-6">
            <Card>
              <CardHeader
                title="Certificates"
                subtitle={`${certificates.length} earned`}
                icon={<ScrollText className="h-4 w-4" />}
              />
              {certificates.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-white/50">
                  Finish every lesson in a course to earn its certificate.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {certificates.map((c) => {
                    const course = courseById(c.courseId);
                    return (
                      <div
                        key={c.id}
                        className={cn(
                          "sheen card-lift relative overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-ink-950 shadow-glow-soft",
                          course?.color ?? "from-amber-300 to-amber-500",
                        )}
                      >
                        <div className="absolute inset-0 bg-noise opacity-50" aria-hidden />
                        <div className="relative flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-950/15">
                            <Icons.Medal className="h-5 w-5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display text-sm font-bold">
                              {course?.title ?? c.title}
                            </p>
                            <p className="text-xs font-medium opacity-70">
                              Course certificate · Earned {timeAgo(c.earnedAt)} ago
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card>
              <CardHeader title="Clubs" icon={<Users className="h-4 w-4" />} />
              {userClubs.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-white/50">
                  You haven&apos;t joined any clubs yet.{" "}
                  <Link href="/clubs" className="font-semibold text-capital-300 hover:underline">
                    Browse clubs
                  </Link>
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userClubs.map((club) => (
                    <Link
                      key={club.id}
                      href="/clubs"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/75 transition-colors hover:border-capital-400/40 hover:text-capital-300"
                    >
                      <span className="text-base leading-none">{club.emoji}</span>
                      {club.name}
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <CardHeader title="Interests" icon={<Sparkles className="h-4 w-4" />} />
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <Pill key={interest} tone="violet">
                    {interest}
                  </Pill>
                ))}
              </div>
            </Card>
          </div>
        </Reveal>
      </div>

      {/* Saved coach notes */}
      <Reveal delay={0.1}>
        <Card>
          <CardHeader
            title="Saved coach notes"
            subtitle={`${coachNotes.length} saved`}
            icon={<MessageSquareText className="h-4 w-4" />}
            action={
              <Button variant="ghost" size="sm" href="/coach">
                Ask the coach
              </Button>
            }
          />
          {coachNotes.length === 0 ? (
            <EmptyState
              icon={<MessageSquareText className="h-7 w-7" />}
              title="No saved notes"
              description="Save answers from Capital Coach and they'll show up here for later."
              action={
                <Button href="/coach" size="sm">
                  Open Capital Coach
                </Button>
              }
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {coachNotes.map((note) => (
                <div
                  key={note.id}
                  className="sheen card-lift group relative rounded-2xl border border-white/8 bg-white/[0.02] p-4"
                >
                  <div className="mb-1.5 flex items-center gap-2 pr-8">
                    <Pill tone="capital">{note.topic}</Pill>
                    <span className="text-xs text-white/35">{timeAgo(note.createdAt)} ago</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{note.title}</p>
                  <p className="mt-1 line-clamp-3 text-sm text-white/55">{note.body}</p>
                  <button
                    onClick={() => deleteCoachNote(note.id)}
                    className="absolute right-3 top-3 rounded-lg p-1.5 text-white/25 transition hover:bg-white/5 hover:text-rose-400 focus-visible:ring-focus"
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </Reveal>

      {/* Saved projects / portfolio */}
      <Reveal delay={0.1}>
        <Card>
          <CardHeader
            title="Saved projects"
            subtitle={`${savedProjects.length} from the simulators`}
            icon={<Icons.FolderKanban className="h-4 w-4" />}
            action={
              <Button variant="ghost" size="sm" href="/simulator">
                Open simulator
              </Button>
            }
          />
          {savedProjects.length === 0 ? (
            <EmptyState
              icon={<Icons.FolderKanban className="h-7 w-7" />}
              title="No saved projects"
              description="Build a budget or startup model in the simulators and save it to your profile."
              action={
                <Button href="/simulator" size="sm">
                  Go to simulator
                </Button>
              }
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {savedProjects.map((p) => (
                <div
                  key={p.id}
                  className="sheen card-lift group relative rounded-2xl border border-white/8 bg-white/[0.02] p-4"
                >
                  <div className="mb-1.5 flex items-center gap-2 pr-8">
                    <Pill tone="violet">{p.kind}</Pill>
                    <span className="text-xs text-white/35">{timeAgo(p.createdAt)} ago</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{p.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-white/55">{p.summary}</p>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="absolute right-3 top-3 rounded-lg p-1.5 text-white/25 transition hover:bg-white/5 hover:text-rose-400 focus-visible:ring-focus"
                    aria-label="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </Reveal>

      {/* Footer settings link */}
      <div className="flex justify-center pb-2">
        <Button variant="ghost" href="/settings">
          <Settings className="h-4 w-4" />
          Account settings
        </Button>
      </div>

      <AchievementModal
        badgeId={openBadge}
        open={openBadge !== null}
        onClose={() => setOpenBadge(null)}
      />
    </div>
  );
}

function BadgeCard({
  badge,
  earned,
  onClick,
}: {
  badge: Badge;
  earned: boolean;
  onClick: () => void;
}) {
  const Icon = icon(badge.icon);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!earned}
      className={cn(
        "glass flex flex-col gap-3 rounded-3xl p-4 text-left shadow-card transition-all duration-300",
        earned
          ? "sheen card-lift shadow-glow-soft hover:border-capital-400/25"
          : "cursor-default opacity-45 grayscale",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-ink-950",
            badge.color,
            earned ? "shadow-glow" : "shadow-card",
          )}
        >
          {earned ? <Icon className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
        </div>
        <Pill tone={rarityTone[badge.rarity]}>{badge.rarity}</Pill>
      </div>
      <div>
        <p className="font-display text-sm font-semibold text-white">{badge.name}</p>
        <p className="mt-1 text-xs leading-relaxed text-white/50">{badge.description}</p>
      </div>
      <span
        className={cn(
          "mt-auto text-[10px] font-semibold uppercase tracking-wide",
          earned ? "text-capital-300" : "text-white/35",
        )}
      >
        {earned ? "Earned" : "Locked"}
      </span>
    </button>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="glass overflow-hidden rounded-3xl">
        <Skeleton className="h-32 w-full rounded-none" />
        <div className="space-y-3 p-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-3xl" />
        ))}
      </div>
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
