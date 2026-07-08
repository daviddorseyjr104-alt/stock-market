import type { Badge } from "@/lib/types";

export const badges: Badge[] = [
  { id: "first-lesson", name: "First Lesson", description: "Completed your very first Campus Capital lesson.", icon: "Sparkles", color: "from-capital-400 to-capital-600", rarity: "Common" },
  { id: "etf-explorer", name: "ETF Explorer", description: "Finished the full ETF & index fund track.", icon: "Compass", color: "from-sky-400 to-violet-500", rarity: "Rare" },
  { id: "compound-king", name: "Compound King", description: "Mastered compound interest and time-in-market.", icon: "Crown", color: "from-amber-400 to-amber-600", rarity: "Epic" },
  { id: "budget-builder", name: "Budget Builder", description: "Built your first student budget plan.", icon: "Wallet", color: "from-emerald-400 to-capital-500", rarity: "Common" },
  { id: "risk-manager", name: "Risk Manager", description: "Learned to size positions and manage risk.", icon: "ShieldCheck", color: "from-blue-400 to-indigo-500", rarity: "Rare" },
  { id: "roth-rookie", name: "Roth Rookie", description: "Opened your first mock Roth IRA strategy.", icon: "PiggyBank", color: "from-rose-400 to-fuchsia-500", rarity: "Common" },
  { id: "campus-top-10", name: "Campus Top 10", description: "Reached the top 10 on your campus leaderboard.", icon: "Medal", color: "from-amber-300 to-orange-500", rarity: "Epic" },
  { id: "streak-7", name: "7-Day Streak", description: "Learned 7 days in a row. Habit unlocked.", icon: "Flame", color: "from-orange-400 to-rose-500", rarity: "Rare" },
  { id: "streak-30", name: "30-Day Streak", description: "A full month of daily learning. Elite focus.", icon: "Zap", color: "from-fuchsia-500 to-violet-600", rarity: "Legendary" },
  { id: "diversified", name: "Diversified", description: "Built a simulator portfolio across 4+ asset types.", icon: "PieChart", color: "from-capital-300 to-sky-500", rarity: "Rare" },
  // ── Course-engine era badges ─────────────────────────────────────────────
  { id: "first-course", name: "Course Finisher", description: "Completed every lesson in a full course.", icon: "GraduationCap", color: "from-capital-400 to-teal-500", rarity: "Rare" },
  { id: "perfect-lesson", name: "Flawless", description: "Finished a lesson without losing a single heart.", icon: "Heart", color: "from-rose-400 to-rose-600", rarity: "Rare" },
  { id: "quiz-ace", name: "Quiz Ace", description: "Answered 10 questions correctly in a single day.", icon: "Target", color: "from-amber-300 to-amber-500", rarity: "Rare" },
  { id: "level-5", name: "Rising Star", description: "Reached level 5. The habit is real now.", icon: "Star", color: "from-sky-400 to-capital-400", rarity: "Rare" },
  { id: "level-10", name: "Campus Legend", description: "Reached level 10. Certified money brain.", icon: "Crown", color: "from-amber-400 to-fuchsia-500", rarity: "Epic" },
  { id: "money-master", name: "Money Master", description: "Completed every Money course, budgets to credit.", icon: "Wallet", color: "from-capital-400 to-capital-600", rarity: "Epic" },
  { id: "investing-master", name: "Market Master", description: "Completed every Investing course, ETFs to VC.", icon: "LineChart", color: "from-amber-400 to-orange-500", rarity: "Epic" },
  { id: "startup-master", name: "Founder Mode", description: "Completed every Startups course.", icon: "Rocket", color: "from-fuchsia-500 to-violet-600", rarity: "Epic" },
  { id: "career-master", name: "Career Climber", description: "Completed every Career course.", icon: "Briefcase", color: "from-violet-400 to-indigo-500", rarity: "Epic" },
  { id: "first-trade", name: "First Trade", description: "Placed your first mock trade in the simulator.", icon: "CandlestickChart", color: "from-sky-400 to-violet-500", rarity: "Common" },
];

export const badgeById = (id: string) => badges.find((b) => b.id === id);
