import { people } from "./people";
import { schools } from "./schools";
import { clubs } from "./clubs";
import { schoolById } from "./schools";
import type { LeaderRow } from "@/lib/types";

export const studentXpLeaders: LeaderRow[] = [...people]
  .sort((a, b) => b.xp - a.xp)
  .map((p, i) => ({
    rank: i + 1,
    name: p.fullName,
    meta: `${schoolById(p.schoolId)?.shortName ?? ""} · ${p.major}`,
    xp: p.xp,
    delta: [2, 0, 1, -1, 3, 0, -2, 1, 0, -1, 2][i] ?? 0,
    avatarColor: p.avatarColor,
    highlight: p.id === "u-davon",
  }));

export const streakLeaders: LeaderRow[] = [...people]
  .sort((a, b) => b.streak - a.streak)
  .slice(0, 8)
  .map((p, i) => ({
    rank: i + 1,
    name: p.fullName,
    meta: `${p.streak}-day streak 🔥`,
    xp: p.streak,
    delta: 0,
    avatarColor: p.avatarColor,
    highlight: p.id === "u-davon",
  }));

export const schoolLeaders: LeaderRow[] = [...schools]
  .sort((a, b) => b.totalXp - a.totalXp)
  .map((s, i) => ({
    rank: i + 1,
    name: s.name,
    meta: `${s.activeStudents.toLocaleString()} active · top: ${s.topStudent}`,
    xp: s.totalXp,
    delta: Math.round(s.weeklyGrowth),
    avatarColor: s.color,
    highlight: s.id === "ucla",
  }));

export const weeklyLeaders: LeaderRow[] = [...schools]
  .sort((a, b) => b.weeklyGrowth - a.weeklyGrowth)
  .map((s, i) => ({
    rank: i + 1,
    name: s.shortName,
    meta: `${s.location}`,
    xp: Math.round(s.weeklyGrowth * 1000),
    delta: Math.round(s.weeklyGrowth),
    avatarColor: s.color,
    highlight: s.id === "ucla",
  }));

export const clubLeaders: LeaderRow[] = [...clubs]
  .sort((a, b) => b.totalXp - a.totalXp)
  .map((c, i) => ({
    rank: i + 1,
    name: c.name,
    meta: `${c.members.toLocaleString()} members`,
    xp: c.totalXp,
    delta: [3, 1, 2, 0, -1, 1, 0, 2][i] ?? 0,
    avatarColor: c.color,
  }));

// Simulator performance, mock returns for a friendly competition.
export const simulatorLeaders: LeaderRow[] = [
  { rank: 1, name: "Andre Diallo", meta: "Berkeley · Balanced Growth", xp: 142, delta: 1, avatarColor: "from-blue-500 to-capital-400" },
  { rank: 2, name: "Maya Lin", meta: "USC · Dividend Focus", xp: 128, delta: 2, avatarColor: "from-rose-400 to-fuchsia-500" },
  { rank: 3, name: "Jordan Banks", meta: "Howard · Index Core", xp: 119, delta: 0, avatarColor: "from-red-500 to-blue-600" },
  { rank: 4, name: "Davon Carter", meta: "UCLA · Diversified Growth", xp: 111, delta: 4, avatarColor: "from-capital-400 to-violet-500", highlight: true },
  { rank: 5, name: "Imani Brooks", meta: "Spelman · Long-Term Wealth", xp: 104, delta: -1, avatarColor: "from-fuchsia-500 to-violet-600" },
  { rank: 6, name: "Priya Raman", meta: "Stanford · Tech Tilt", xp: 98, delta: 1, avatarColor: "from-amber-400 to-rose-500" },
];
