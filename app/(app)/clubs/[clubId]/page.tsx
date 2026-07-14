"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Crown, Globe, Star, Target, Trophy, Users } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Avatar } from "@/components/ui/Avatar";
import { ClubFeed } from "@/components/campus/ClubFeed";
import { clubById } from "@/lib/data/clubs";
import { schoolById } from "@/lib/data/schools";
import { getClubMembers, socialIsReal, type ClubMember } from "@/lib/social";
import { useAppState } from "@/lib/store";
import { fadeUp, staggerContainer, springSoft } from "@/lib/motion";
import { cn, formatCompact } from "@/lib/utils";

export default function ClubDetailPage({ params }: { params: { clubId: string } }) {
  const club = clubById(params.clubId);
  const { profile, toggleClub, isClubMember, hydrated } = useAppState();
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [joinError, setJoinError] = useState<string | null>(null);

  async function handleToggle() {
    if (!club) return;
    setJoinError(null);
    const result = await toggleClub(club.id);
    if (result.ok) return;
    setJoinError(
      result.reason === "verify"
        ? "Confirm your email to join clubs."
        : (result.message ?? "That didn't work. Try again."),
    );
  }

  useEffect(() => {
    // Only real members are ever shown. Without a live backend there are no
    // other members to fetch, never fall back to fabricated ones.
    if (!club || !socialIsReal) return;
    let alive = true;
    getClubMembers(club.id).then((m) => alive && setMembers(m));
    return () => {
      alive = false;
    };
  }, [club]);

  if (!club) notFound();

  const joined = hydrated && isClubMember(club.id);
  // Real members from the database, excluding the signed-in user (their
  // membership is tracked locally and rendered as the "You" row).
  const others = members.filter((m) => m.id !== profile.id);
  // Rank real members only; your row uses your live XP. Shown once the club
  // has more people than just you, a leaderboard of one is just a mirror.
  const leaderboard = [
    ...others,
    ...(joined
      ? [
          {
            id: profile.id,
            fullName: profile.fullName,
            avatarColor: profile.avatarColor,
            xp: profile.xp,
            schoolId: profile.schoolId,
            major: profile.major,
          } satisfies ClubMember,
        ]
      : []),
  ]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 8);
  // Real count: database members plus the live membership toggle.
  const count = others.length + (joined ? 1 : 0);
  const countLabel =
    count === 0 ? "No members yet" : count === 1 ? "1 member" : `${count.toLocaleString()} members`;

  return (
    <div className="space-y-6">
      <Link
        href="/clubs"
        className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        All clubs
      </Link>

      {/* Hero, premium gradient-border shell around the club's own colors. */}
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <div
          className={cn(
            "gradient-border sheen relative overflow-hidden rounded-3xl",
            joined && "glow-ring",
          )}
        >
          <div className={cn("relative h-28 w-full overflow-hidden bg-gradient-to-br", club.color)}>
            <div className="pointer-events-none absolute inset-0 bg-noise" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
          </div>
          <div className="relative px-5 pb-5">
            <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 animate-breathe rounded-full bg-capital-400/10 blur-3xl" />
            <div className="relative -mt-10 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ ...springSoft, delay: 0.1 }}
                  className={cn(
                    "flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br text-4xl shadow-float ring-4 ring-ink-950",
                    club.color,
                  )}
                >
                  {club.emoji}
                </motion.div>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl font-bold tracking-tight text-white text-glow">
                      {club.name}
                    </h1>
                    {club.featured && (
                      <Pill tone="capital">
                        <Star className="h-3 w-3" />
                        Featured
                      </Pill>
                    )}
                    {club.category && <Pill tone="violet">{club.category}</Pill>}
                    {club.schoolScope === "national" ? (
                      <Pill tone="sky">
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
              <Button
                variant={joined ? "secondary" : "primary"}
                onClick={handleToggle}
                disabled={!hydrated}
                aria-pressed={joined}
                className={cn(joined && "border-capital-400/30 text-capital-300")}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {joined ? (
                    <motion.span
                      key="joined"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={springSoft}
                      className="inline-flex items-center gap-1.5"
                    >
                      Joined <Check className="h-4 w-4" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="join"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={springSoft}
                    >
                      Join club
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>

            {joinError && (
              <p
                role="alert"
                className="relative mt-4 rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
              >
                {joinError}
              </p>
            )}

            <div className="relative mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-white/40" />
                {countLabel}
              </span>
              {joined && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center gap-1.5 text-capital-300"
                >
                  <Check className="h-4 w-4" />
                  You&apos;re a member
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          {/* About */}
          <motion.div variants={fadeUp}>
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
          </motion.div>

          {/* This week's challenge */}
          <motion.div variants={fadeUp}>
            <Card glow className="sheen relative overflow-hidden bg-capital-400/[0.04]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 animate-breathe rounded-full bg-capital-400/10 blur-2xl" />
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
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Button variant="primary" size="sm" href="/learn">
                  Start a lesson
                </Button>
                <Button variant="outline" size="sm" href="/campus">
                  Share your progress
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Club feed */}
          <motion.div variants={fadeUp}>
            <h2 className="mb-3 font-display text-lg font-semibold tracking-tight text-white">
              Club feed
            </h2>
            <ClubFeed club={club} />
          </motion.div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Members */}
          <motion.div variants={fadeUp}>
            <Card>
              <CardHeader title="Members" subtitle={countLabel} icon={<Users className="h-4 w-4" />} />
              {others.length === 0 && !joined ? (
                <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/10 px-4 py-6 text-center">
                  <div className="pointer-events-none absolute inset-0 bg-mesh" />
                  <div className="relative">
                    <div className="mx-auto mb-2 flex h-10 w-10 animate-float items-center justify-center rounded-xl bg-capital-400/10 text-capital-300">
                      <Users className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-white/70">No members yet.</p>
                    <p className="mt-1 text-xs text-white/40">
                      Join to be the first and bring your friends.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="space-y-3.5">
                  {joined && (
                    <motion.li
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={springSoft}
                      className="flex items-center gap-3 rounded-2xl bg-capital-400/[0.06] px-2 py-1.5"
                    >
                      <Avatar
                        name={profile.fullName}
                        gradient={profile.avatarColor}
                        src={profile.avatarUrl}
                        size="sm"
                        ring
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{profile.fullName}</p>
                        <p className="truncate text-xs text-white/45">
                          {schoolById(profile.schoolId)?.shortName ?? "Campus"}
                          {profile.major ? ` · ${profile.major}` : ""}
                        </p>
                      </div>
                      <Pill tone="capital">You</Pill>
                    </motion.li>
                  )}
                  {others.slice(0, 8).map((member) => {
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
          </motion.div>

          {/* Leaderboard */}
          {others.length > 0 && leaderboard.length > 0 && (
            <motion.div variants={fadeUp}>
              <Card>
                <CardHeader
                  title="Club leaderboard"
                  subtitle="Top members by XP"
                  icon={<Crown className="h-4 w-4" />}
                />
                <ol className="space-y-2.5">
                  {leaderboard.map((member, i) => {
                    const rank = i + 1;
                    const isYou = member.id === profile.id;
                    return (
                      <li
                        key={member.id}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors hover:bg-white/[0.03]",
                          rank === 1 && "sheen bg-amber-400/[0.06]",
                          isYou && "bg-capital-400/[0.06]",
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
                          {isYou && (
                            <Pill tone="capital" className="ml-2 align-middle">
                              You
                            </Pill>
                          )}
                        </span>
                        <span className="text-xs font-semibold tabular-nums text-capital-300">
                          {formatCompact(member.xp)}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </Card>
            </motion.div>
          )}
        </aside>
      </motion.div>
    </div>
  );
}
