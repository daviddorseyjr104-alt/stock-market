"use client";

import Link from "next/link";
import {
  Award,
  BookOpen,
  Compass,
  Crown,
  Flame,
  GraduationCap,
  Lock,
  MapPin,
  Medal,
  PieChart,
  PiggyBank,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Avatar } from "@/components/ui/Avatar";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { schoolById } from "@/lib/data/schools";
import { badges, badgeById } from "@/lib/data/badges";
import { lessonById } from "@/lib/data/lessons";
import { clubById } from "@/lib/data/clubs";
import { useAppState, levelForXp } from "@/lib/store";
import { cn, timeAgo } from "@/lib/utils";
import type { Badge } from "@/lib/types";

// Map lucide icon-name strings (from badges.ts) to components.
const badgeIcons: Record<string, LucideIcon> = {
  Sparkles,
  Compass,
  Crown,
  Wallet,
  ShieldCheck,
  PiggyBank,
  Medal,
  Flame,
  Zap,
  PieChart,
};

const rarityTone = {
  Common: "default",
  Rare: "sky",
  Epic: "violet",
  Legendary: "amber",
} as const;

function BadgeCard({ badge, earned }: { badge: Badge; earned: boolean }) {
  const Icon = badgeIcons[badge.icon] ?? Sparkles;
  return (
    <Card
      hover={earned}
      className={cn(
        "flex flex-col gap-3 p-4",
        !earned && "opacity-45 grayscale",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-ink-950 shadow-card",
            badge.color,
          )}
        >
          {earned ? (
            <Icon className="h-5 w-5" />
          ) : (
            <Lock className="h-5 w-5" />
          )}
        </div>
        <Pill tone={rarityTone[badge.rarity]}>{badge.rarity}</Pill>
      </div>
      <div>
        <p className="font-display text-sm font-semibold text-white">
          {badge.name}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-white/50">
          {badge.description}
        </p>
      </div>
      {!earned && (
        <span className="mt-auto text-[10px] font-semibold uppercase tracking-wide text-white/35">
          Locked
        </span>
      )}
    </Card>
  );
}

export default function ProfilePage() {
  const { profile: user, posts } = useAppState();
  const school = schoolById(user.schoolId);
  const earnedBadges = user.badges
    .map((id) => badgeById(id))
    .filter((b): b is Badge => Boolean(b));
  const lockedBadges = badges.filter((b) => !user.badges.includes(b.id));
  const completed = user.completedLessons
    .map((id) => lessonById(id))
    .filter((l): l is NonNullable<ReturnType<typeof lessonById>> => Boolean(l));
  const userClubs = user.clubs
    .map((id) => clubById(id))
    .filter((c): c is NonNullable<ReturnType<typeof clubById>> => Boolean(c));
  const myPosts = posts
    .filter((p) => p.authorId === user.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="space-y-6">
      {/* Cover / banner card */}
      <Card glow className="relative overflow-hidden p-0">
        <div className="h-28 w-full bg-capital-gradient opacity-90 sm:h-32" />
        <div className="absolute right-5 top-5">
          <Button variant="secondary" size="sm" href="/settings">
            <Settings className="h-4 w-4" />
            Edit profile
          </Button>
        </div>

        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">
            <Avatar
              name={user.fullName}
              gradient={user.avatarColor}
              size="xl"
              ring
              className="shadow-float"
            />
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:pb-1">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {user.fullName}
                  </h1>
                  <Pill tone="capital">{user.investingLevel}</Pill>
                </div>
                <p className="mt-0.5 text-sm text-white/50">@{user.username}</p>
              </div>
              <div className="flex items-center gap-5 text-sm">
                <div>
                  <span className="font-display text-lg font-bold text-white">
                    {user.followers.toLocaleString()}
                  </span>{" "}
                  <span className="text-white/45">followers</span>
                </div>
                <div>
                  <span className="font-display text-lg font-bold text-white">
                    {user.following.toLocaleString()}
                  </span>{" "}
                  <span className="text-white/45">following</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meta row */}
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
              {user.major}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-white/35" />
              Class of {user.gradYear} · {user.studentType}
            </span>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
            {user.bio}
          </p>
        </div>
      </Card>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Level"
          value={`Lv. ${levelForXp(user.xp)}`}
          sub={`${user.xp.toLocaleString()} XP`}
          icon={<Trophy className="h-4 w-4" />}
          tone="capital"
        />
        <StatCard
          label="Learning streak"
          value={`${user.streak} days`}
          sub="Keep the flame alive"
          icon={<Flame className="h-4 w-4" />}
          tone="amber"
        />
        <StatCard
          label="Campus rank"
          value={user.campusRank > 0 ? `#${user.campusRank}` : "—"}
          sub={school ? school.shortName : "On campus"}
          icon={<Medal className="h-4 w-4" />}
          tone="violet"
        />
        <StatCard
          label="National rank"
          value={user.nationalRank > 0 ? `#${user.nationalRank}` : "—"}
          sub="Across all campuses"
          icon={<TrendingUp className="h-4 w-4" />}
          tone="rose"
        />
      </div>

      {/* Badges */}
      <Card>
        <CardHeader
          title="Badges"
          subtitle={`${earnedBadges.length} of ${badges.length} earned`}
          icon={<Award className="h-4 w-4" />}
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {earnedBadges.map((b) => (
            <BadgeCard key={b.id} badge={b} earned />
          ))}
          {lockedBadges.map((b) => (
            <BadgeCard key={b.id} badge={b} earned={false} />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Completed lessons */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Completed lessons"
            subtitle={`${completed.length} lessons finished`}
            icon={<BookOpen className="h-4 w-4" />}
          />
          {completed.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="h-7 w-7" />}
              title="No lessons yet"
              description="Start your first lesson to begin earning XP and badges."
              action={
                <Button href="/learn" size="sm">
                  Browse lessons
                </Button>
              }
            />
          ) : (
            <div className="divide-y divide-white/5">
              {completed.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/learn/${lesson.id}`}
                  className="group flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white group-hover:text-capital-300">
                      {lesson.title}
                    </p>
                    <p className="text-xs text-white/45">
                      {lesson.difficulty} · {lesson.minutes} min
                    </p>
                  </div>
                  <Pill tone="capital">+{lesson.xp} XP</Pill>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Clubs + Interests */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Clubs" icon={<Users className="h-4 w-4" />} />
            <div className="flex flex-wrap gap-2">
              {userClubs.map((club) => (
                <Link
                  key={club.id}
                  href={`/clubs/${club.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/75 transition-colors hover:border-capital-400/40 hover:text-capital-300"
                >
                  <span className="text-base leading-none">{club.emoji}</span>
                  {club.name}
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Interests"
              icon={<Sparkles className="h-4 w-4" />}
            />
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <Pill key={interest} tone="violet">
                  {interest}
                </Pill>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent posts */}
      <Card>
        <CardHeader
          title="Recent posts"
          subtitle="What you've shared on Campus"
          icon={<Sparkles className="h-4 w-4" />}
          action={
            <Button variant="ghost" size="sm" href="/campus">
              View feed
            </Button>
          }
        />
        {myPosts.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="h-7 w-7" />}
            title="No posts yet"
            description="Share an insight or a question with your campus to get started."
            action={
              <Button href="/campus" size="sm">
                Go to Campus
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {myPosts.map((post) => (
              <Link
                key={post.id}
                href="/campus"
                className="block rounded-2xl border border-white/8 bg-white/[0.02] p-4 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Pill tone="capital">{post.category}</Pill>
                  <span className="text-xs text-white/40">
                    {timeAgo(post.createdAt)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-white/75">
                  {post.body}
                </p>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
