import type { LearningModule } from "@/lib/types";

export const modules: LearningModule[] = [
  { id: "start-here", letter: "A", title: "Start Here", description: "The mindset and first principles of investing, built for someone who has never bought a stock.", color: "from-capital-400 to-capital-600", icon: "Rocket" },
  { id: "money-foundation", letter: "B", title: "Student Money Foundation", description: "Budgeting, debt, credit and income, the financial floor you stand on before investing a dollar.", color: "from-sky-400 to-violet-500", icon: "Wallet" },
  { id: "market-basics", letter: "C", title: "Market Basics", description: "Stocks, ETFs, index funds, bonds and dividends, what the market is actually made of.", color: "from-amber-400 to-orange-500", icon: "LineChart" },
  { id: "wealth-early", letter: "D", title: "Building Wealth Early", description: "Roth IRAs, brokerage accounts, dollar-cost averaging and automation, your unfair advantage is time.", color: "from-fuchsia-500 to-violet-600", icon: "TrendingUp" },
  { id: "advanced-path", letter: "E", title: "Advanced Student Path", description: "Valuation, financial statements, allocation and behavioral finance, for the future analyst.", color: "from-rose-500 to-fuchsia-500", icon: "BrainCircuit" },
];

export const moduleById = (id: string) => modules.find((m) => m.id === id);
