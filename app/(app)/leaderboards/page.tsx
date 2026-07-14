"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Trophy,
  Sparkles,
  ArrowUpRight,
  Check,
  Crown,
  Flame,
  Link2,
  Users,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Avatar } from "@/components/ui/Avatar";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { LeaderRows } from "@/components/leaderboards/LeaderboardTable";
import { schools, schoolById } from "@/lib/data/schools";
import { clubs } from "@/lib/data/clubs";
import { useAppState } from "@/lib/store";
import { getStudentLeaders, getClubStats, socialIsReal, type LeaderProfile } from "@/lib/social";
import { fadeUp, staggerContainer, springSoft } from "@/lib/motion";
import { cn, formatCompact } from "@/lib/utils";
import type { LeaderRow } from "@/lib/types";

type BoardKey = "campus" | "student" | "clubs" | "streaks";

interface Board {
  key: BoardKey;
  label: string;
  rows: LeaderRow[];
  unit?: string;
  highlightLabel: string;
  blurb: string;
}

const PODIUM_ORDER = [2, 1, 3]; // visual left-to-right: 2nd, 1st, 3rd

export default function LeaderboardsPage() {
  const { profile, hydrated, updateProfile } = useAppState();
  const [active, setActive] = useState<BoardKey>("campus");
  const [students, setStudents] = useState<LeaderProfile[]>([]);
  const [clubStats, setClubStats] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Only real students ever appear on a board. Without a live backend there
    // are no other students to show, never fall back to fabricated ones.
    if (!socialIsReal) return;
    let alive = true;
    const load = () => {
      getStudentLeaders().then((s) => alive && setStudents(s));
      getClubStats().then((c) => alive && setClubStats(c));
    };
    load();
    // Keep the boards live without a reload as students earn XP.
    const id = setInterval(load, 45_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  function copyInvite() {
    const url = `${window.location.origin}/signup`;
    navigator.clipboard
      ?.writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  // Real students from the database, with the signed-in user merged in.
  const roster: LeaderProfile[] = useMemo(() => {
    const me: LeaderProfile = {
      id: profile.id,
      fullName: profile.fullName,
      avatarColor: profile.avatarColor,
      xp: profile.xp,
      streak: profile.streak,
      schoolId: profile.schoolId,
      major: profile.major,
    };
    const has = students.some((s) => s.id === profile.id);
    return has ? students.map((s) => (s.id === profile.id ? me : s)) : [...students, me];
  }, [students, profile]);

  // No other real students yet → boards are honest about being just you.
  const solo = roster.length <= 1;

  const studentRows: LeaderRow[] = useMemo(
    () =>
      [...roster]
        .sort((a, b) => b.xp - a.xp)
        .map((p, i) => ({
          rank: i + 1,
          name: p.fullName,
          meta: `${schoolById(p.schoolId ?? "")?.shortName ?? ""}${p.major ? ` · ${p.major}` : ""}`,
          xp: p.xp,
          delta: 0,
          avatarColor: p.avatarColor,
          highlight: p.id === profile.id,
        })),
    [roster, profile.id],
  );

  const streakRows: LeaderRow[] = useMemo(
    () =>
      [...roster]
        .sort((a, b) => b.streak - a.streak)
        .slice(0, 10)
        .map((p, i) => ({
          rank: i + 1,
          name: p.fullName,
          meta: `${p.streak}-day streak 🔥`,
          xp: p.streak,
          delta: 0,
          avatarColor: p.avatarColor,
          highlight: p.id === profile.id,
        })),
    [roster, profile.id],
  );

  // Real campus XP = sum of every student's XP at that school. Schools with
  // no students yet aren't ranked, no fabricated standings.
  const schoolAgg = useMemo(() => {
    const m: Record<string, { xp: number; students: number }> = {};
    for (const p of roster) {
      if (!p.schoolId) continue;
      (m[p.schoolId] ??= { xp: 0, students: 0 }).xp += p.xp;
      m[p.schoolId].students += 1;
    }
    return m;
  }, [roster]);

  const campusData = useMemo(
    () =>
      schools
        .filter((s) => (schoolAgg[s.id]?.students ?? 0) > 0)
        .map((s) => ({
          school: s,
          xp: schoolAgg[s.id]?.xp ?? 0,
          students: schoolAgg[s.id]?.students ?? 0,
          highlight: s.id === profile.schoolId,
        }))
        .sort((a, b) => b.xp - a.xp || a.school.shortName.localeCompare(b.school.shortName)),
    [schoolAgg, profile.schoolId],
  );

  const campusRows: LeaderRow[] = useMemo(
    () =>
      campusData.map((d, i) => ({
        rank: i + 1,
        name: d.school.name,
        meta: d.students === 1 ? "1 student" : `${d.students} students`,
        xp: d.xp,
        delta: 0,
        avatarColor: d.school.color,
        highlight: d.highlight,
      })),
    [campusData],
  );

  // Club standings, straight from `club_members`.
  //
  // This used to add `+1` for each club you'd joined, on the assumption your own
  // membership was tracked only locally. It isn't — joinClub() writes to
  // club_members, which is exactly what getClubStats() counts — so you were
  // counted twice, and a solo member saw "2 members" on a board whose own copy
  // promises "every member is a real student".
  const clubRows: LeaderRow[] = useMemo(
    () =>
      clubs
        .map((c) => ({ c, members: clubStats[c.id] ?? 0 }))
        .filter((x) => x.members > 0)
        .sort((a, b) => b.members - a.members)
        .map((x, i) => ({
          rank: i + 1,
          name: x.c.name,
          meta: x.members === 1 ? "1 member" : `${x.members} members`,
          xp: x.members,
          delta: 0,
          avatarColor: x.c.color,
          highlight: profile.clubs.includes(x.c.id),
        })),
    [clubStats, profile.clubs],
  );

  const BOARDS: Board[] = useMemo(
    () => [
      { key: "campus", label: "Campus XP", rows: campusRows, unit: "XP", highlightLabel: "Your school", blurb: "Total knowledge earned per school. Every lesson moves your campus up." },
      { key: "student", label: "Student XP", rows: studentRows, unit: "XP", highlightLabel: "You", blurb: "The students putting in the reps. Learning compounds, just like money." },
      { key: "clubs", label: "Clubs", rows: clubRows, unit: "members", highlightLabel: "Your club", blurb: "Communities learning together. The bigger the crew, the bigger the movement." },
      { key: "streaks", label: "Streaks", rows: streakRows, unit: "days", highlightLabel: "You", blurb: "Consistency is the real flex. Show up daily and the rest takes care of itself." },
    ],
    [campusRows, studentRows, clubRows, streakRows],
  );

  const board = BOARDS.find((b) => b.key === active) ?? BOARDS[0];
  // Podium tracks the active board, always real entries, never seeded.
  const podium = board.rows.slice(0, 3);
  const podiumOrder = PODIUM_ORDER.filter((rank) => rank <= podium.length);
  const restRows = board.rows.slice(podium.length);
  const mySchool = schoolById(profile.schoolId);
  const myRank = campusData.findIndex((d) => d.highlight) + 1;
  const myStudentRank = studentRows.find((r) => r.highlight)?.rank;

  // Your rank *within your own campus*. `profile.campusRank` was hardcoded to 0
  // and never assigned anywhere, which made the "campus-top-10" badge
  // structurally unearnable. Write the real value back so it can be earned.
  const myCampusRank = useMemo(() => {
    if (!profile.schoolId) return 0;
    const sameSchool = [...roster]
      .filter((p) => p.schoolId === profile.schoolId)
      .sort((a, b) => b.xp - a.xp);
    const i = sameSchool.findIndex((p) => p.id === profile.id);
    return i < 0 ? 0 : i + 1;
  }, [roster, profile.id, profile.schoolId]);

  useEffect(() => {
    if (!hydrated || myCampusRank === profile.campusRank) return;
    updateProfile({ campusRank: myCampusRank });
  }, [hydrated, myCampusRank, profile.campusRank, updateProfile]);

  // Emoji lookups so podium cards can carry real identity (school/club marks).
  const emojiFor = (row: LeaderRow): string | undefined => {
    if (board.key === "campus") return schools.find((s) => s.name === row.name)?.emoji;
    if (board.key === "clubs") return clubs.find((c) => c.name === row.name)?.emoji;
    return undefined;
  };

  const boardEmpty: Record<BoardKey, { title: string; description: string }> = {
    campus: {
      title: "No campus standings yet",
      description: "Campuses appear here once a student from that school starts earning XP.",
    },
    student: {
      title: "No students on the board yet",
      description: "Finish a lesson and you'll be the first name up here.",
    },
    clubs: {
      title: "No club standings yet",
      description: "Join a club and it shows up here with you counted on the roster. Every member is a real student.",
    },
    streaks: {
      title: "No streaks yet",
      description: "Learn today and again tomorrow, that's a streak, and it goes straight on the board.",
    },
  };

  if (!hydrated) {
    return (
      <div className="space-y-8">
        <PageHeader title="Leaderboards" subtitle="Competition that builds wealth, not anxiety." />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Leaderboards"
        subtitle="Competition that builds wealth, not anxiety."
        action={
          <Pill tone="capital" className="px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" />
            Season 1 · Live
          </Pill>
        }
      />

      {/* Your standing, driven entirely by the live profile. */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="gradient-border glow-ring relative overflow-hidden rounded-3xl p-5 sm:p-7"
      >
        <div className="pointer-events-none absolute inset-0 animate-aurora bg-aurora" />
        <div className="pointer-events-none absolute inset-0 bg-noise" />
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 animate-breathe rounded-full bg-capital-400/10 blur-3xl" />

        <div className="relative space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springSoft}
                className="glow-ring flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-3xl"
              >
                {mySchool?.emoji ?? "🎓"}
              </motion.div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-capital-300/80">
                  Your standing
                </p>
                <p className="mt-0.5 font-display text-lg font-bold tracking-tight text-white sm:text-xl">
                  {solo ? (
                    <>
                      You&apos;re{" "}
                      <span className="text-gradient-capital text-glow">first on the board</span> 
                      every leaderboard starts with someone.
                    </>
                  ) : (
                    <>
                      {myStudentRank ? (
                        <>
                          You&apos;re{" "}
                          <span className="text-gradient-capital text-glow">#{myStudentRank}</span>{" "}
                          of {studentRows.length} students
                        </>
                      ) : (
                        <>You&apos;re on the board</>
                      )}
                      {mySchool && myRank > 0 && (
                        <>
                          {" "}
                          · {mySchool.shortName} sits at{" "}
                          <span className="text-gradient-capital text-glow">#{myRank}</span>
                        </>
                      )}
                    </>
                  )}
                </p>
                <p className="mt-1 max-w-md text-xs text-white/55">
                  {solo
                    ? `Every rank here is earned by a real student, no filler names. Finish lessons to stack XP${mySchool ? ` for ${mySchool.shortName}` : ""} and invite friends to race you.`
                    : `Every lesson lifts you and ${mySchool ? mySchool.shortName : "your campus"} at the same time.`}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Button variant="outline" size="sm" onClick={copyInvite}>
                {copied ? (
                  <>
                    Link copied
                    <Check className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" />
                    Invite friends
                  </>
                )}
              </Button>
              <Button variant="primary" size="sm" href="/learn">
                Earn XP
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
          >
            <StandingStat
              icon={<Zap className="h-3.5 w-3.5" />}
              label="Total XP"
              value={<AnimatedNumber value={profile.xp} />}
            />
            <StandingStat
              icon={<Flame className="h-3.5 w-3.5" />}
              label="Streak"
              value={
                <>
                  <AnimatedNumber value={profile.streak} />{" "}
                  {profile.streak === 1 ? "day" : "days"}
                </>
              }
            />
            <StandingStat
              icon={<Crown className="h-3.5 w-3.5" />}
              label="Level"
              value={<AnimatedNumber value={profile.level} />}
            />
            <StandingStat
              icon={<Trophy className="h-3.5 w-3.5" />}
              label="Student rank"
              value={myStudentRank ? `#${myStudentRank}` : "—"}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Board switcher + podium + rows */}
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Card className="p-4 sm:p-6">
          <div className="-mx-1 mb-5 overflow-x-auto px-1">
            <div className="inline-flex min-w-full gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur sm:min-w-0">
              {BOARDS.map((b) => {
                const isActive = active === b.key;
                return (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => setActive(b.key)}
                    aria-pressed={isActive}
                    className={cn(
                      "relative whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-ink-950" : "text-white/55 hover:text-white",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="board-pill"
                        transition={springSoft}
                        className="absolute inset-0 rounded-xl bg-capital-gradient shadow-glow"
                      />
                    )}
                    <span className="relative z-10">{b.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-5 flex items-start justify-between gap-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={board.key}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="max-w-xl text-sm text-white/55"
              >
                {board.blurb}
              </motion.p>
            </AnimatePresence>
            <span className="hidden shrink-0 text-xs font-medium text-white/35 sm:block">
              {board.rows.length} ranked
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={board.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {board.rows.length > 0 ? (
                <div className="space-y-6">
                  {/* Podium, only real entries ever stand here. */}
                  <div
                    className={cn(
                      "grid items-end gap-3 sm:gap-5",
                      podium.length === 3 && "grid-cols-3",
                      podium.length === 2 && "grid-cols-2",
                      podium.length === 1 && "mx-auto w-full max-w-xs grid-cols-1",
                    )}
                  >
                    {podiumOrder.map((rank, i) => {
                      const row = podium[rank - 1];
                      if (!row) return null;
                      const isFirst = rank === 1;
                      const emoji = emojiFor(row);
                      return (
                        <motion.div
                          key={`${board.key}-${row.rank}-${row.name}`}
                          initial={{ opacity: 0, y: 28, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ ...springSoft, delay: 0.08 * i + 0.1 }}
                        >
                          <div
                            className={cn(
                              "sheen card-lift glass relative flex flex-col items-center overflow-hidden rounded-3xl text-center",
                              isFirst
                                ? cn(
                                    "glow-ring border-capital-400/30 bg-gradient-to-b from-capital-400/[0.1] to-transparent px-3 pb-6 pt-7",
                                    podium.length > 1 && "sm:-translate-y-3",
                                  )
                                : "px-3 pb-5 pt-5",
                              row.highlight && !isFirst && "ring-1 ring-capital-400/30",
                            )}
                          >
                            {isFirst && (
                              <>
                                <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 animate-breathe rounded-full bg-capital-400/20 blur-3xl" />
                                <Crown className="absolute right-4 top-4 h-4 w-4 text-amber-300" />
                              </>
                            )}

                            <div className={cn("mb-2", isFirst && "animate-float")}>
                              {emoji ? (
                                <span className="text-2xl sm:text-3xl">{emoji}</span>
                              ) : (
                                <Avatar
                                  name={row.name}
                                  gradient={row.avatarColor}
                                  size={isFirst ? "md" : "sm"}
                                  ring
                                />
                              )}
                            </div>

                            <div className="mb-2 text-2xl leading-none sm:text-3xl">
                              {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                            </div>

                            <p
                              className={cn(
                                "max-w-full truncate px-1 text-sm font-bold",
                                isFirst ? "text-gradient-capital text-glow" : "text-white",
                              )}
                              title={row.name}
                            >
                              {row.name}
                            </p>

                            <p
                              className={cn(
                                "mt-2 font-display font-bold tabular-nums text-white",
                                isFirst ? "text-xl sm:text-2xl" : "text-base sm:text-lg",
                              )}
                            >
                              {board.unit === "XP" ? (
                                formatCompact(row.xp)
                              ) : (
                                <AnimatedNumber value={row.xp} />
                              )}
                              <span className="ml-1 text-xs font-medium text-white/40">
                                {board.unit}
                              </span>
                            </p>

                            <Pill tone="default" className="mt-2 max-w-full">
                              <span className="truncate">{row.meta}</span>
                            </Pill>

                            {row.highlight && (
                              <span className="mt-2 text-[11px] font-semibold text-capital-300">
                                {board.highlightLabel}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {restRows.length > 0 && (
                    <LeaderRows
                      key={`rows-${board.key}`}
                      rows={restRows}
                      unit={board.unit}
                      highlightLabel={board.highlightLabel}
                    />
                  )}
                </div>
              ) : (
                <BoardEmpty
                  title={boardEmpty[board.key].title}
                  description={boardEmpty[board.key].description}
                  action={
                    board.key === "clubs" ? (
                      <Button variant="primary" size="sm" href="/clubs">
                        Browse clubs
                      </Button>
                    ) : (
                      <Button variant="primary" size="sm" href="/learn">
                        Start a lesson
                      </Button>
                    )
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Honest growth CTA while the campus is still small. */}
          {solo && board.rows.length > 0 && (
            <div className="sheen relative mt-6 overflow-hidden rounded-2xl border border-dashed border-white/10 bg-white/[0.015]">
              <div className="pointer-events-none absolute inset-0 bg-mesh" />
              <div className="relative flex flex-col items-center gap-3 px-6 py-8 text-center">
                <div className="glow-ring flex h-12 w-12 animate-float items-center justify-center rounded-2xl bg-capital-400/10 text-capital-300">
                  <Users className="h-5 w-5" />
                </div>
                <p className="font-display text-sm font-semibold text-white">
                  Leaderboards fill up as students join your campus
                </p>
                <p className="max-w-sm text-xs text-white/50">
                  Every spot here is a real student, nothing is seeded or simulated. Bring your
                  friends and race them up the board.
                </p>
                <div className="flex flex-wrap justify-center gap-2.5">
                  <Button size="sm" variant="primary" onClick={copyInvite}>
                    {copied ? (
                      <>
                        Link copied
                        <Check className="h-3.5 w-3.5" />
                      </>
                    ) : (
                      <>
                        <Link2 className="h-3.5 w-3.5" />
                        Invite friends
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" href="/campus">
                    Explore campus
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      <p className="text-center text-xs text-white/35">
        Boards update live as students earn XP. Every spot is earned, never bought.
      </p>
    </div>
  );
}

/* ── Bits ─────────────────────────────────────────────────────────────── */

function StandingStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="card-lift flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-capital-400/10 text-capital-300">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-display text-sm font-bold tabular-nums text-white">
          {value}
        </span>
        <span className="block text-[11px] font-medium text-white/40">{label}</span>
      </span>
    </motion.div>
  );
}

function BoardEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/10 bg-white/[0.015]">
      <div className="pointer-events-none absolute inset-0 bg-mesh" />
      <div className="relative flex flex-col items-center justify-center px-6 py-14 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={springSoft}
          className="glow-ring mb-4 flex h-16 w-16 animate-float items-center justify-center rounded-2xl bg-capital-400/10 text-capital-300"
        >
          <Users className="h-7 w-7" />
        </motion.div>
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1.5 max-w-sm text-sm text-white/50">{description}</p>
        <div className="mt-6">{action}</div>
      </div>
    </div>
  );
}
