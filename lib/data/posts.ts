import type { Post } from "@/lib/types";

// Timestamps are relative to a fixed "now" so the feed always looks fresh in demo.
const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 3600_000).toISOString();

export const posts: Post[] = [
  {
    id: "p1",
    authorId: "u-imani",
    category: "Lesson insight",
    body: "Just finished the Roth IRA lesson and my mind is blown 🤯 The fact that I can put internship money in NOW and never pay tax on the growth? Why is this not taught in high school. Starting mine this summer.",
    schoolId: "spelman",
    likes: 142,
    liked: false,
    createdAt: hoursAgo(2),
    attachment: { kind: "lesson", label: "The Roth IRA: a student's secret weapon", meta: "+80 XP · Intermediate" },
    comments: [
      { id: "c1", authorId: "u-marcus", body: "Same! The 'low tax bracket' point finally clicked for me.", createdAt: hoursAgo(1.5) },
      { id: "c2", authorId: "u-davon", body: "Doing this with my café paychecks. Let's gooo.", createdAt: hoursAgo(1) },
    ],
  },
  {
    id: "p2",
    authorId: "u-tyler",
    category: "Question",
    body: "Genuinely confused, if index funds just 'match the market,' how is that good? Don't I want to BEAT the market? What am I missing here 😅",
    schoolId: "michigan",
    likes: 38,
    liked: false,
    createdAt: hoursAgo(4),
    comments: [
      { id: "c3", authorId: "u-andre", body: "The twist: matching the market quietly beats ~90% of pros over time. Trying to beat it usually means higher fees + worse results.", createdAt: hoursAgo(3.5) },
      { id: "c4", authorId: "u-maya", body: "Boring wins. The market itself has historically gone up over long periods, you just ride it cheaply.", createdAt: hoursAgo(3) },
    ],
  },
  {
    id: "p3",
    authorId: "u-davon",
    category: "Portfolio simulator",
    body: "Rebuilt my mock portfolio to be way more diversified. Went from 80% in one stock (yikes) to a mix of broad ETFs + a little bond exposure. Diversification score jumped from 41 → 88 📈 Feels way less stressful.",
    schoolId: "ucla",
    likes: 96,
    liked: true,
    createdAt: hoursAgo(6),
    attachment: { kind: "portfolio", label: "Diversified Growth (Mock)", meta: "Risk: Medium · Div score 88" },
    comments: [
      { id: "c5", authorId: "u-priya", body: "This is the way. One-stock portfolios are a heart attack waiting to happen.", createdAt: hoursAgo(5) },
    ],
  },
  {
    id: "p4",
    authorId: "u-maya",
    category: "Finance career",
    body: "PSA for anyone recruiting for finance: knowing how to actually READ a 10-K and talk about valuation > memorizing buzzwords. The advanced track here is genuinely solid prep. Did 3 lessons before my coffee chat and it showed.",
    schoolId: "usc",
    likes: 174,
    liked: false,
    createdAt: hoursAgo(9),
    comments: [
      { id: "c6", authorId: "u-jordan", body: "Co-sign. Interviewers can tell in 30 seconds who actually understands the statements.", createdAt: hoursAgo(8) },
    ],
  },
  {
    id: "p5",
    authorId: "u-camila",
    category: "Budgeting",
    body: "Transfer life update: moved to Austin, rent is real now 😭 Used the 50/30/20 lesson to actually map out my aid refund across the whole semester instead of nuking it in month one. First time money hasn't felt like a mystery.",
    schoolId: "texas",
    likes: 61,
    liked: false,
    createdAt: hoursAgo(12),
    comments: [
      { id: "c7", authorId: "u-sofia", body: "NYC rent solidarity 🫠 The budget lesson saved me too.", createdAt: hoursAgo(11) },
    ],
  },
  {
    id: "p6",
    authorId: "u-elijah",
    category: "Campus club",
    body: "ATL Campus Collective is officially #1 in the regional school-vs-school race this week 🍑🔥 Spelman, Morehouse, and Georgia State carrying. Keep the streaks alive this weekend, we're 4,000 XP ahead and I want to keep it that way.",
    schoolId: "morehouse",
    clubId: "atlanta-collective",
    likes: 208,
    liked: false,
    createdAt: hoursAgo(14),
    comments: [
      { id: "c8", authorId: "u-imani", body: "💙 Spelman pulling our weight. Let's close it out.", createdAt: hoursAgo(13) },
      { id: "c9", authorId: "u-marcus", body: "🐾 GSU on the grind. Don't sleep on us.", createdAt: hoursAgo(12.5) },
    ],
  },
  {
    id: "p7",
    authorId: "u-sofia",
    category: "Internship money",
    body: "Landed a summer internship 🎉 First real paycheck incoming. Plan: emergency fund first, then a Roth, then automate a small index-fund contribution. The 'internship paycheck plan' challenge basically wrote my roadmap for me.",
    schoolId: "nyu",
    likes: 119,
    liked: false,
    createdAt: hoursAgo(20),
    comments: [
      { id: "c10", authorId: "u-davon", body: "Congrats!! Emergency fund first is so underrated. Future you says thanks.", createdAt: hoursAgo(19) },
    ],
  },
  {
    id: "p8",
    authorId: "u-andre",
    category: "Lesson insight",
    body: "Behavioral finance lesson hit different. The biggest risk to your returns isn't the market, it's panic-selling at the bottom. Wrote my 'rules for a crash' down today while calm so future-me can't do anything dumb.",
    schoolId: "berkeley",
    likes: 153,
    liked: true,
    createdAt: hoursAgo(26),
    attachment: { kind: "lesson", label: "Behavioral finance & economic cycles", meta: "+90 XP · Advanced" },
    comments: [
      { id: "c11", authorId: "u-priya", body: "Writing rules while calm is elite. Stealing this.", createdAt: hoursAgo(25) },
    ],
  },
];

export const postsBySchool = (schoolId: string) =>
  posts.filter((p) => p.schoolId === schoolId);
export const postsByClub = (clubId: string) =>
  posts.filter((p) => p.clubId === clubId);
