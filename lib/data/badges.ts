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
];

export const badgeById = (id: string) => badges.find((b) => b.id === id);
