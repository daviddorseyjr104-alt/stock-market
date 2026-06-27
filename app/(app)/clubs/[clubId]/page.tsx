import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  Globe,
  MessageSquareDashed,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { PostCard } from "@/components/campus/PostCard";
import { clubById } from "@/lib/data/clubs";
import { currentUser, people } from "@/lib/data/people";
import { postsByClub } from "@/lib/data/posts";
import { schoolById } from "@/lib/data/schools";
import { cn, formatCompact } from "@/lib/utils";

export default function ClubDetailPage({
  params,
}: {
  params: { clubId: string };
}) {
  const club = clubById(params.clubId);
  if (!club) notFound();

  const joined = currentUser.clubs.includes(club.id);
  const clubPosts = postsByClub(club.id);

  // Members shown for this club, pull from the people directory.
  const members = people
    .filter((p) => p.id !== currentUser.id)
    .slice(0, 6);
  const leaderboard = [...members]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <Link
        href="/clubs"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        All clubs
      </Link>

      {/* Hero */}
      <Card className="relative overflow-hidden p-0">
        <div className={cn("h-28 w-full bg-gradient-to-br", club.color)} />
        <div className="px-5 pb-5">
          <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br text-4xl shadow-float ring-4 ring-ink-950",
                  club.color,
                )}
              >
                {club.emoji}
              </div>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                    {club.name}
                  </h1>
                  {club.schoolScope === "national" ? (
                    <Pill tone="violet">
                      <Globe className="h-3 w-3" />
                      National
                    </Pill>
                  ) : (
                    <Pill tone="sky">Single campus</Pill>
                  )}
                </div>
                <p className="mt-1 text-sm text-white/55">{club.tagline}</p>
              </div>
            </div>
            <Button variant={joined ? "secondary" : "primary"}>
              {joined ? "Joined" : "Join club"}
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/55">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-white/40" />
              {club.members.toLocaleString()} members
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-300" />
              {formatCompact(club.totalXp)} total XP
            </span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          {/* About */}
          <Card>
            <CardHeader
              title="About this club"
              icon={<Users className="h-4 w-4" />}
            />
            <p className="text-sm leading-relaxed text-white/75">
              {club.description}
            </p>
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-capital-400/10 text-capital-300">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                  Learning goal
                </p>
                <p className="mt-0.5 text-sm font-medium text-white/85">
                  {club.learningGoal}
                </p>
              </div>
            </div>
          </Card>

          {/* This week's challenge */}
          <Card glow className="bg-capital-400/[0.04]">
            <CardHeader
              title="This week's challenge"
              subtitle="Take it on with the club"
              icon={<Trophy className="h-4 w-4" />}
              action={<Pill tone="capital">Live</Pill>}
            />
            <p className="font-display text-lg font-semibold text-white">
              {club.weeklyChallenge}
            </p>
            <p className="mt-1.5 text-sm text-white/55">
              Complete it before the week resets to earn XP for {club.name} and
              climb the club leaderboard.
            </p>
            <div className="mt-4">
              <Button variant="outline" size="sm" href="/campus">
                Share your progress
              </Button>
            </div>
          </Card>

          {/* Club feed */}
          <div>
            <h2 className="mb-3 font-display text-lg font-semibold tracking-tight text-white">
              Club feed
            </h2>
            {clubPosts.length > 0 ? (
              <div className="space-y-5">
                {clubPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<MessageSquareDashed className="h-7 w-7" />}
                title="No club posts yet"
                description="Posts tagged to this club appear here. Kick things off by sharing a win or a question with your community."
                action={
                  <Button variant="outline" size="sm" href="/campus">
                    Post to the feed
                  </Button>
                }
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Members */}
          <Card>
            <CardHeader
              title="Members"
              subtitle={`${club.members.toLocaleString()} learning together`}
              icon={<Users className="h-4 w-4" />}
            />
            <ul className="space-y-3.5">
              {members.map((member) => {
                const school = schoolById(member.schoolId);
                return (
                  <li key={member.id} className="flex items-center gap-3">
                    <Avatar
                      name={member.fullName}
                      gradient={member.avatarColor}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {member.fullName}
                      </p>
                      <p className="truncate text-xs text-white/45">
                        {school?.shortName} · Level {member.level}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader
              title="Club leaderboard"
              subtitle="Top members by XP"
              icon={<Crown className="h-4 w-4" />}
            />
            <ol className="space-y-2.5">
              {leaderboard.map((member, i) => {
                const rank = i + 1;
                return (
                  <li
                    key={member.id}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-2 py-1.5",
                      rank === 1 && "bg-amber-400/[0.06]",
                    )}
                  >
                    <span
                      className={cn(
                        "w-5 text-center text-sm font-bold tabular-nums",
                        rank === 1
                          ? "text-amber-300"
                          : rank === 2
                            ? "text-white/70"
                            : rank === 3
                              ? "text-orange-300"
                              : "text-white/35",
                      )}
                    >
                      {rank}
                    </span>
                    <Avatar
                      name={member.fullName}
                      gradient={member.avatarColor}
                      size="xs"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                      {member.fullName}
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-capital-300">
                      {formatCompact(member.xp)}
                    </span>
                  </li>
                );
              })}
            </ol>
          </Card>
        </aside>
      </div>
    </div>
  );
}
