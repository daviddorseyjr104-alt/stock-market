"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Crown, Globe, Target, Trophy, Users } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Avatar } from "@/components/ui/Avatar";
import { ClubFeed } from "@/components/campus/ClubFeed";
import { clubById } from "@/lib/data/clubs";
import { schoolById } from "@/lib/data/schools";
import { getClubMembers, joinClub, leaveClub, type ClubMember } from "@/lib/social";
import { useAppState } from "@/lib/store";
import { cn, formatCompact } from "@/lib/utils";

export default function ClubDetailPage({ params }: { params: { clubId: string } }) {
  const club = clubById(params.clubId);
  const { profile, updateProfile } = useAppState();
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!club) return;
    let alive = true;
    getClubMembers(club.id).then((m) => alive && setMembers(m));
    return () => {
      alive = false;
    };
  }, [club]);

  if (!club) notFound();

  const joined = profile.clubs.includes(club.id);
  const leaderboard = [...members].sort((a, b) => b.xp - a.xp).slice(0, 8);
  const count = members.length;
  const countLabel =
    count === 0 ? "No members yet" : count === 1 ? "1 member" : `${count.toLocaleString()} members`;

  async function toggleJoin() {
    if (!club || busy) return;
    setBusy(true);
    const next = joined
      ? profile.clubs.filter((c) => c !== club.id)
      : [...profile.clubs, club.id];
    updateProfile({ clubs: next });
    try {
      if (joined) await leaveClub(club.id);
      else await joinClub(club.id);
      setMembers(await getClubMembers(club.id));
    } finally {
      setBusy(false);
    }
  }

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
            <Button variant={joined ? "secondary" : "primary"} onClick={toggleJoin} disabled={busy}>
              {joined ? "Joined" : "Join club"}
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/55">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-white/40" />
              {countLabel}
            </span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          {/* About */}
          <Card>
            <CardHeader title="About this club" icon={<Users className="h-4 w-4" />} />
            <p className="text-sm leading-relaxed text-white/75">{club.description}</p>
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-capital-400/10 text-capital-300">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                  Learning goal
                </p>
                <p className="mt-0.5 text-sm font-medium text-white/85">{club.learningGoal}</p>
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
            <p className="font-display text-lg font-semibold text-white">{club.weeklyChallenge}</p>
            <p className="mt-1.5 text-sm text-white/55">
              Complete it before the week resets to earn XP for {club.name} and climb the club
              leaderboard.
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
            <ClubFeed clubId={club.id} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Members */}
          <Card>
            <CardHeader title="Members" subtitle={countLabel} icon={<Users className="h-4 w-4" />} />
            {members.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-center">
                <p className="text-sm text-white/55">
                  {joined ? "You're the first one here." : "No members yet."}
                </p>
                <p className="mt-1 text-xs text-white/35">
                  {joined
                    ? "Invite a few classmates and start the challenge together."
                    : "Join to be the first and bring your friends."}
                </p>
              </div>
            ) : (
              <ul className="space-y-3.5">
                {members.slice(0, 8).map((member) => {
                  const school = schoolById(member.schoolId ?? "");
                  return (
                    <li key={member.id} className="flex items-center gap-3">
                      <Avatar name={member.fullName} gradient={member.avatarColor} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{member.fullName}</p>
                        <p className="truncate text-xs text-white/45">
                          {school?.shortName ?? "Campus"}
                          {member.major ? ` · ${member.major}` : ""}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* Leaderboard */}
          {leaderboard.length > 0 && (
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
                      <Avatar name={member.fullName} gradient={member.avatarColor} size="xs" />
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
          )}
        </aside>
      </div>
    </div>
  );
}
