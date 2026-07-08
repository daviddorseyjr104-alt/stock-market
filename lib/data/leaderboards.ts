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

// ── Seeded leaderboard boards (demo rows for the other students) ───────────
// These are realistic seeded rows, NOT the live user. Pages can merge the
// live profile into these boards; rows are pre-sorted DESC by xp.

export const uclaLeaders: LeaderRow[] = [
  { rank: 1, name: "Lena Okafor", meta: "UCLA · Applied Math", xp: 12140, delta: 1, avatarColor: "from-sky-400 to-violet-500" },
  { rank: 2, name: "Diego Fuentes", meta: "UCLA · Economics", xp: 11380, delta: -1, avatarColor: "from-amber-400 to-orange-500" },
  { rank: 3, name: "Grace Park", meta: "UCLA · Statistics", xp: 10920, delta: 2, avatarColor: "from-fuchsia-500 to-violet-600" },
  { rank: 4, name: "Noah Bennett", meta: "UCLA · Computer Science", xp: 9870, delta: 0, avatarColor: "from-blue-400 to-capital-400" },
  { rank: 5, name: "Aaliyah Simmons", meta: "UCLA · Business Econ", xp: 9310, delta: 3, avatarColor: "from-rose-400 to-fuchsia-500" },
  { rank: 6, name: "Kevin Tran", meta: "UCLA · Bioengineering", xp: 8640, delta: -2, avatarColor: "from-emerald-400 to-teal-500" },
  { rank: 7, name: "Sara Haddad", meta: "UCLA · Political Science", xp: 7980, delta: 1, avatarColor: "from-violet-400 to-indigo-500" },
  { rank: 8, name: "Marcus Webb", meta: "UCLA · Sociology", xp: 7350, delta: 0, avatarColor: "from-cyan-400 to-blue-500" },
  { rank: 9, name: "Emily Nakamura", meta: "UCLA · Cognitive Science", xp: 6890, delta: -1, avatarColor: "from-amber-300 to-rose-500" },
  { rank: 10, name: "Tomás Rivera", meta: "UCLA · History", xp: 6420, delta: 2, avatarColor: "from-capital-400 to-emerald-500" },
];

export const nationalLeaders: LeaderRow[] = [
  { rank: 1, name: "Jordan Banks", meta: "Howard · Economics", xp: 13200, delta: 0, avatarColor: "from-red-500 to-blue-600" },
  { rank: 2, name: "Lena Okafor", meta: "UCLA · Applied Math", xp: 12140, delta: 2, avatarColor: "from-sky-400 to-violet-500" },
  { rank: 3, name: "Andre Diallo", meta: "Berkeley · Data Science", xp: 11800, delta: -1, avatarColor: "from-blue-500 to-capital-400" },
  { rank: 4, name: "Wei Chen", meta: "Michigan · Financial Math", xp: 11260, delta: 1, avatarColor: "from-blue-700 to-amber-400" },
  { rank: 5, name: "Imani Brooks", meta: "Spelman · Finance", xp: 10350, delta: -2, avatarColor: "from-fuchsia-500 to-violet-600" },
  { rank: 6, name: "Hannah Goldberg", meta: "NYU · Finance", xp: 9940, delta: 3, avatarColor: "from-violet-500 to-fuchsia-500" },
  { rank: 7, name: "Maya Lin", meta: "USC · Business Admin", xp: 9240, delta: 0, avatarColor: "from-rose-400 to-fuchsia-500" },
  { rank: 8, name: "Caleb Ortiz", meta: "UT Austin · Finance", xp: 8720, delta: 1, avatarColor: "from-orange-500 to-amber-400" },
  { rank: 9, name: "Zoe Williams", meta: "Stanford · Econ", xp: 8310, delta: -1, avatarColor: "from-amber-400 to-rose-500" },
  { rank: 10, name: "Malik Johnson", meta: "Morehouse · Business", xp: 7960, delta: 2, avatarColor: "from-rose-600 to-amber-500" },
];

export const friendsLeaders: LeaderRow[] = [
  { rank: 1, name: "Maya Lin", meta: "USC · 31-day streak", xp: 9240, delta: 1, avatarColor: "from-rose-400 to-fuchsia-500" },
  { rank: 2, name: "Marcus Hill", meta: "Georgia State · Accounting", xp: 8100, delta: -1, avatarColor: "from-blue-600 to-sky-400" },
  { rank: 3, name: "Elijah Grant", meta: "Morehouse · Poli Sci", xp: 7800, delta: 0, avatarColor: "from-rose-600 to-amber-500" },
  { rank: 4, name: "Priya Raman", meta: "Stanford · SymSys", xp: 6900, delta: 2, avatarColor: "from-amber-400 to-rose-500" },
  { rank: 5, name: "Sofia Russo", meta: "NYU · Mathematics", xp: 5600, delta: 0, avatarColor: "from-violet-500 to-fuchsia-500" },
  { rank: 6, name: "Tyler Novak", meta: "Michigan · MechE", xp: 3900, delta: -2, avatarColor: "from-blue-700 to-amber-400" },
  { rank: 7, name: "Camila Reyes", meta: "UT Austin · Marketing", xp: 3100, delta: 1, avatarColor: "from-orange-500 to-amber-400" },
  { rank: 8, name: "Jasmine Cole", meta: "Spelman · CS", xp: 2750, delta: 0, avatarColor: "from-fuchsia-400 to-rose-500" },
  { rank: 9, name: "Omar Farouk", meta: "UCLA · Econ", xp: 2210, delta: 1, avatarColor: "from-cyan-400 to-blue-500" },
  { rank: 10, name: "Ben Whitfield", meta: "Berkeley · Physics", xp: 1840, delta: -1, avatarColor: "from-emerald-400 to-teal-500" },
];

// This week's XP only (resets Monday), hence the smaller numbers.
export const weeklyXpLeaders: LeaderRow[] = [
  { rank: 1, name: "Grace Park", meta: "UCLA · 14 lessons this week", xp: 640, delta: 4, avatarColor: "from-fuchsia-500 to-violet-600" },
  { rank: 2, name: "Wei Chen", meta: "Michigan · 12 lessons this week", xp: 590, delta: 1, avatarColor: "from-blue-700 to-amber-400" },
  { rank: 3, name: "Aaliyah Simmons", meta: "UCLA · 11 lessons this week", xp: 545, delta: 2, avatarColor: "from-rose-400 to-fuchsia-500" },
  { rank: 4, name: "Jordan Banks", meta: "Howard · 10 lessons this week", xp: 510, delta: -2, avatarColor: "from-red-500 to-blue-600" },
  { rank: 5, name: "Hannah Goldberg", meta: "NYU · 10 lessons this week", xp: 480, delta: 0, avatarColor: "from-violet-500 to-fuchsia-500" },
  { rank: 6, name: "Caleb Ortiz", meta: "UT Austin · 9 lessons this week", xp: 430, delta: 3, avatarColor: "from-orange-500 to-amber-400" },
  { rank: 7, name: "Imani Brooks", meta: "Spelman · 8 lessons this week", xp: 395, delta: -1, avatarColor: "from-fuchsia-500 to-violet-600" },
  { rank: 8, name: "Noah Bennett", meta: "UCLA · 8 lessons this week", xp: 370, delta: 0, avatarColor: "from-blue-400 to-capital-400" },
  { rank: 9, name: "Zoe Williams", meta: "Stanford · 7 lessons this week", xp: 340, delta: -3, avatarColor: "from-amber-400 to-rose-500" },
  { rank: 10, name: "Malik Johnson", meta: "Morehouse · 7 lessons this week", xp: 315, delta: 1, avatarColor: "from-rose-600 to-amber-500" },
];

// Ranked by streak length; xp column carries the streak (days) for display.
export const streakRankLeaders: LeaderRow[] = [
  { rank: 1, name: "Jordan Banks", meta: "Howard · never misses", xp: 52, delta: 0, avatarColor: "from-red-500 to-blue-600" },
  { rank: 2, name: "Andre Diallo", meta: "Berkeley · morning learner", xp: 44, delta: 0, avatarColor: "from-blue-500 to-capital-400" },
  { rank: 3, name: "Grace Park", meta: "UCLA · lunch-break lessons", xp: 39, delta: 2, avatarColor: "from-fuchsia-500 to-violet-600" },
  { rank: 4, name: "Wei Chen", meta: "Michigan · library regular", xp: 35, delta: -1, avatarColor: "from-blue-700 to-amber-400" },
  { rank: 5, name: "Maya Lin", meta: "USC · 31 days strong", xp: 31, delta: 1, avatarColor: "from-rose-400 to-fuchsia-500" },
  { rank: 6, name: "Imani Brooks", meta: "Spelman · between classes", xp: 28, delta: -1, avatarColor: "from-fuchsia-500 to-violet-600" },
  { rank: 7, name: "Hannah Goldberg", meta: "NYU · subway sessions", xp: 26, delta: 0, avatarColor: "from-violet-500 to-fuchsia-500" },
  { rank: 8, name: "Elijah Grant", meta: "Morehouse · nightly ritual", xp: 22, delta: 1, avatarColor: "from-rose-600 to-amber-500" },
  { rank: 9, name: "Marcus Hill", meta: "Georgia State · before work", xp: 19, delta: 0, avatarColor: "from-blue-600 to-sky-400" },
  { rank: 10, name: "Priya Raman", meta: "Stanford · post-lecture", xp: 16, delta: -2, avatarColor: "from-amber-400 to-rose-500" },
];

// Standings in the current campus competition (points this round).
export const campusCompetitionLeaders: LeaderRow[] = [
  { rank: 1, name: "UCLA Student Investors", meta: "Team · 48 members active", xp: 4820, delta: 1, avatarColor: "from-sky-400 to-amber-400" },
  { rank: 2, name: "Women in Investing", meta: "Team · 44 members active", xp: 4560, delta: -1, avatarColor: "from-fuchsia-500 to-violet-600" },
  { rank: 3, name: "Black Wealth Builders", meta: "Team · 41 members active", xp: 4310, delta: 0, avatarColor: "from-amber-400 to-rose-500" },
  { rank: 4, name: "First-Gen Finance", meta: "Team · 39 members active", xp: 3980, delta: 2, avatarColor: "from-capital-400 to-emerald-500" },
  { rank: 5, name: "Consulting Society", meta: "Team · 33 members active", xp: 3640, delta: 0, avatarColor: "from-blue-400 to-indigo-500" },
  { rank: 6, name: "Entrepreneurship & Markets", meta: "Team · 30 members active", xp: 3390, delta: -2, avatarColor: "from-violet-500 to-fuchsia-500" },
  { rank: 7, name: "USC Market Movers", meta: "Team · 28 members active", xp: 3120, delta: 1, avatarColor: "from-rose-500 to-amber-400" },
  { rank: 8, name: "Data & Money Lab", meta: "Team · 24 members active", xp: 2870, delta: 0, avatarColor: "from-cyan-400 to-blue-500" },
  { rank: 9, name: "Real Estate Association", meta: "Team · 21 members active", xp: 2540, delta: 1, avatarColor: "from-emerald-400 to-teal-500" },
  { rank: 10, name: "ATL Campus Collective", meta: "Team · 19 members active", xp: 2310, delta: -1, avatarColor: "from-orange-500 to-rose-500" },
];

// Simulator performance, mock returns for a friendly competition.
export const simulatorLeaders: LeaderRow[] = [
  { rank: 1, name: "Andre Diallo", meta: "Berkeley · Balanced Growth", xp: 142, delta: 1, avatarColor: "from-blue-500 to-capital-400" },
  { rank: 2, name: "Maya Lin", meta: "USC · Dividend Focus", xp: 128, delta: 2, avatarColor: "from-rose-400 to-fuchsia-500" },
  { rank: 3, name: "Jordan Banks", meta: "Howard · Index Core", xp: 119, delta: 0, avatarColor: "from-red-500 to-blue-600" },
  { rank: 4, name: "Davon Carter", meta: "UCLA · Diversified Growth", xp: 111, delta: 4, avatarColor: "from-capital-400 to-violet-500", highlight: true },
  { rank: 5, name: "Imani Brooks", meta: "Spelman · Long-Term Wealth", xp: 104, delta: -1, avatarColor: "from-fuchsia-500 to-violet-600" },
  { rank: 6, name: "Priya Raman", meta: "Stanford · Tech Tilt", xp: 98, delta: 1, avatarColor: "from-amber-400 to-rose-500" },
];
