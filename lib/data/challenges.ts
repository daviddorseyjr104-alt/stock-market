import type { Challenge } from "@/lib/types";

// ──────────────────────────────────────────────────────────────────────────
// Challenges.
//
// Every challenge here used to advertise 80–200 XP and a badge, and award
// NEITHER — `setChallengeProgress` was never called from anywhere, so four of
// them were pinned at 0% forever, the "3 days left" countdowns never moved, and
// reaching 100% produced no event at all.
//
// Each one now carries a `rule` describing exactly what it checks, evaluated
// against real persisted state (completed lessons, real holdings, real streak).
// The store pays out the XP and badge exactly once, durably. If a challenge
// can't be checked, it doesn't belong on this page.
// ──────────────────────────────────────────────────────────────────────────

export const challenges: Challenge[] = [
  {
    id: "first-mock-etf",
    title: "Build your first mock ETF portfolio",
    description:
      "Use the simulator to construct a diversified ETF-based portfolio and learn why baskets beat single bets.",
    goal: "Hold at least 3 ETF or index-fund positions in the simulator.",
    steps: [
      "Open the Portfolio Simulator",
      "Buy a broad market ETF",
      "Add 2 more ETFs or index funds",
      "Check your diversification score",
    ],
    xp: 150,
    // No badge: this used to promise "diversified", which requires FOUR distinct
    // asset types. Following this challenge exactly could never earn it.
    rule: { kind: "holdings", assetTypes: ["ETF", "Index Fund"], count: 3 },
    category: "Simulator",
    icon: "PieChart",
  },
  {
    id: "diversified-book",
    title: "Diversify across four asset types",
    description:
      "Spread your money across different kinds of assets so one bad name can't sink you.",
    goal: "Hold positions in 4 different asset types at once.",
    steps: ["Buy an ETF", "Add an index fund", "Add a bond fund", "Add a single stock"],
    xp: 160,
    badgeId: "diversified",
    rule: { kind: "assetTypes", count: 4 },
    category: "Simulator",
    icon: "Scale",
  },
  {
    id: "compound-5min",
    title: "Learn compound interest",
    description:
      "Complete the compound growth lesson and see why time is your biggest advantage.",
    goal: "Finish 'Compound Growth: Time Is Your Superpower'.",
    steps: ["Open the lesson", "Work through the teach cards", "Pass the questions"],
    xp: 100,
    badgeId: "compound-king",
    rule: { kind: "lessons", ids: ["investing-u3-l1"] },
    category: "Learning",
    icon: "Sparkles",
  },
  {
    id: "100-month-plan",
    title: "Create a $100/month investing plan",
    description:
      "Learn how automatic, boring, repeated investing beats trying to time the market.",
    goal: "Finish 'Dollar-Cost Averaging & Fees'.",
    steps: ["Open the lesson", "Learn how DCA works", "Pass the questions"],
    xp: 120,
    rule: { kind: "lessons", ids: ["investing-u2-l3"] },
    category: "Planning",
    icon: "CalendarClock",
  },
  {
    id: "save-vs-invest",
    title: "Know when to save and when to invest",
    description: "Understand which goals want a savings account and which want the market.",
    goal: "Finish 'High-Yield Savings & Your First Emergency Fund'.",
    steps: ["Open the lesson", "Learn what an emergency fund is for", "Pass the questions"],
    xp: 90,
    rule: { kind: "lessons", ids: ["money-basics-u2-l3"] },
    category: "Learning",
    icon: "PiggyBank",
  },
  {
    id: "roth-basics",
    title: "Understand Roth IRA basics",
    description:
      "Learn the student's secret weapon and why a low tax bracket makes it so powerful.",
    goal: "Finish 'The Roth IRA for Students'.",
    steps: ["Open the lesson", "Learn why the tax treatment matters", "Pass the questions"],
    xp: 130,
    badgeId: "roth-rookie",
    rule: { kind: "lessons", ids: ["investing-u3-l2"] },
    category: "Learning",
    icon: "Award",
  },
  {
    id: "debt-vs-invest-tree",
    title: "Escape the minimum payment trap",
    description: "See exactly what carrying a balance costs, and how payoff order changes it.",
    goal: "Finish 'The Minimum Payment Trap' and 'Paying It Off'.",
    steps: ["Learn what the minimum really covers", "Compare avalanche vs. snowball", "Pass both lessons"],
    xp: 140,
    rule: { kind: "lessons", ids: ["credit-debt-u2-l2", "credit-debt-u3-l3"] },
    category: "Planning",
    icon: "GitBranch",
  },
  {
    id: "internship-paycheck",
    title: "Understand your first paycheck",
    description:
      "Find out why the number on your offer letter isn't the number that hits your account.",
    goal: "Finish 'Gross Pay vs. Net Pay'.",
    steps: ["Open the lesson", "Learn what comes out of a paycheck", "Pass the questions"],
    xp: 120,
    rule: { kind: "lessons", ids: ["money-basics-u3-l1"] },
    category: "Planning",
    icon: "Briefcase",
  },
  {
    id: "explain-diversification",
    title: "Master diversification",
    description: "Learn why spreading your money out is the closest thing to a free lunch.",
    goal: "Finish 'Diversification' and 'Asset Allocation & Time Horizon'.",
    steps: ["Learn why concentration hurts", "Learn how allocation works", "Pass both lessons"],
    xp: 80,
    badgeId: "risk-manager",
    rule: { kind: "lessons", ids: ["investing-u2-l1", "investing-u2-l2"] },
    category: "Learning",
    icon: "Users",
  },
  {
    id: "7-day-streak",
    title: "Hit a 7-day learning streak",
    description: "Learn something every day for a week and build the habit that compounds.",
    goal: "Reach a 7-day streak.",
    steps: ["Learn today", "Come back tomorrow", "Keep the flame alive", "Reach 7 days"],
    xp: 200,
    badgeId: "streak-7",
    rule: { kind: "streak", days: 7 },
    category: "Habit",
    icon: "Flame",
  },
  {
    id: "budget-builder-challenge",
    title: "Build your first student budget",
    description: "Create a simple 50/30/20 budget tailored to your real college expenses.",
    goal: "Finish the Money Basics Unit 1 challenge, 'Build a Budget'.",
    steps: ["Learn needs vs. wants", "Learn the 50/30/20 rule", "Pass the unit challenge"],
    xp: 100,
    badgeId: "budget-builder",
    rule: { kind: "lessons", ids: ["money-basics-u1-l4"] },
    category: "Planning",
    icon: "Wallet",
  },
];

export const challengeById = (id: string) => challenges.find((c) => c.id === id);
