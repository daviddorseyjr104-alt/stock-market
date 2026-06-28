"use client";

import { useEffect, useMemo, useState } from "react";
import { Trophy, Sparkles, ArrowUpRight, Crown, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";
import { LeaderRows } from "@/components/leaderboards/LeaderboardTable";
import { schools, schoolById } from "@/lib/data/schools";
import { clubs } from "@/lib/data/clubs";
import { useAppState } from "@/lib/store";
import { getStudentLeaders, getClubStats, type LeaderProfile } from "@/lib/social";
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
  const { profile } = useAppState();
  const [active, setActive] = useState<BoardKey>("campus");
  const [students, setStudents] = useState<LeaderProfile[]>([]);
  const [clubStats, setClubStats] = useState<Record<string, number>>({});

  useEffect(() => {
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

  // Real campus XP = sum of every student's XP at that school.
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

  const clubRows: LeaderRow[] = useMemo(
    () =>
      clubs
        .map((c) => ({ c, members: clubStats[c.id] ?? 0 }))
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
  const podium = campusData.slice(0, 3);
  const mySchool = schoolById(profile.schoolId);
  const myCampus = campusData.find((d) => d.highlight);
  const myRank = campusData.findIndex((d) => d.highlight) + 1;
  const myStudentRank = studentRows.find((r) => r.highlight)?.rank;

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

      {/* Your-school callout, driven entirely by real campus data. */}
      {myCampus && mySchool && (
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-capital-400/20 bg-gradient-to-r from-capital-400/[0.08] via-violet-500/[0.05] to-transparent p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-capital-400/10 blur-3xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                  {mySchool.emoji}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {mySchool.shortName} sits at{" "}
                    <span className="text-gradient-capital">#{myRank}</span> in Campus XP
                  </p>
                  <p className="mt-1 max-w-md text-xs text-white/55">
                    {myCampus.students <= 1
                      ? `You're the first student here. Every lesson you finish puts ${mySchool.shortName} on the board.`
                      : `${myCampus.students} students learning here${myStudentRank ? `, you're #${myStudentRank}` : ""}. Every lesson lifts the whole campus.`}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" href="/learn">
                Earn XP for {mySchool.shortName}
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Reveal>
      )}

      {/* Podium hero, top 3 schools */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-capital-300" />
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white/60">
            Top Campuses
          </h2>
        </div>

        <div className="grid grid-cols-3 items-end gap-3 sm:gap-5">
          {PODIUM_ORDER.map((rank, i) => {
            const d = podium[rank - 1];
            if (!d) return null;
            const isFirst = rank === 1;
            return (
              <Reveal key={d.school.id} delay={0.08 * i}>
                <Card
                  glow={isFirst}
                  className={cn(
                    "relative flex flex-col items-center overflow-hidden text-center transition-all duration-300",
                    isFirst
                      ? "border-capital-400/30 bg-gradient-to-b from-capital-400/[0.1] to-transparent pt-7 pb-6 sm:-translate-y-3"
                      : "pt-5 pb-5",
                    d.highlight && "ring-1 ring-capital-400/30",
                  )}
                >
                  {isFirst && (
                    <>
                      <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-capital-400/20 blur-3xl" />
                      <Crown className="absolute right-4 top-4 h-4 w-4 text-amber-300" />
                    </>
                  )}

                  <div className={cn("mb-2 text-2xl sm:text-3xl", isFirst && "animate-float")}>
                    {d.school.emoji}
                  </div>

                  <div className="mb-2 text-2xl leading-none sm:text-3xl">
                    {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                  </div>

                  <p
                    className={cn("max-w-full truncate px-1 text-sm font-bold", isFirst ? "text-gradient-capital" : "text-white")}
                    title={d.school.name}
                  >
                    {d.school.shortName}
                  </p>

                  <p className={cn("mt-2 font-display font-bold tabular-nums text-white", isFirst ? "text-xl sm:text-2xl" : "text-base sm:text-lg")}>
                    {formatCompact(d.xp)}
                    <span className="ml-1 text-xs font-medium text-white/40">XP</span>
                  </p>

                  <Pill tone="default" className="mt-2">
                    <Users className="h-3 w-3" />
                    {d.students === 1 ? "1 student" : `${d.students} students`}
                  </Pill>

                  {d.highlight && (
                    <span className="mt-2 text-[11px] font-semibold text-capital-300">Your school</span>
                  )}
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Tab switcher + selected board */}
      <Reveal>
        <Card className="p-4 sm:p-6">
          <div className="-mx-1 mb-5 overflow-x-auto px-1">
            <div className="inline-flex min-w-full gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur sm:min-w-0">
              {BOARDS.map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => setActive(b.key)}
                  aria-pressed={active === b.key}
                  className={cn(
                    "whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-all",
                    active === b.key ? "bg-capital-gradient text-ink-950 shadow-glow" : "text-white/55 hover:text-white",
                  )}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 flex items-start justify-between gap-3">
            <p className="max-w-xl text-sm text-white/55">{board.blurb}</p>
            <span className="hidden shrink-0 text-xs font-medium text-white/35 sm:block">
              {board.rows.length} ranked
            </span>
          </div>

          <LeaderRows rows={board.rows} unit={board.unit} highlightLabel={board.highlightLabel} />
        </Card>
      </Reveal>

      <p className="text-center text-xs text-white/35">
        Ranks refresh weekly. Compete with your campus, learn at your own pace. Every spot is earned, never bought.
      </p>
    </div>
  );
}
