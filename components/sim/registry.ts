/**
 * Simulator registry, single source of truth for the /simulator hub and the
 * per-sim routes. Icon is a lucide icon NAME (render via dynamic lookup, per
 * APP_CONTRACT.md §5). Class strings are pre-composed so Tailwind can see them.
 */
export interface SimMeta {
  id: string;
  title: string;
  pitch: string;
  icon: string; // lucide icon name, e.g. "Wallet"
  skill: string; // skill tag shown on the card
  tone: "capital" | "violet" | "amber" | "rose" | "sky";
  /** icon tile classes (bg + text), pre-composed */
  iconClass: string;
  /** hover border accent for the hub card, pre-composed */
  hoverClass: string;
  minutes: number; // rough time to finish
}

export const sims: SimMeta[] = [
  {
    id: "portfolio",
    title: "Trading Simulator",
    pitch: "Buy and sell real tickers at live market prices with $10,000 of fake money.",
    icon: "CandlestickChart",
    skill: "Investing",
    tone: "capital",
    iconClass: "bg-capital-400/10 text-capital-300",
    hoverClass: "hover:border-capital-400/40",
    minutes: 5,
  },
  {
    id: "budget",
    title: "Build a Monthly Budget",
    pitch: "Split a real student income across rent, food and fun, and get a 50/30/20 score.",
    icon: "Wallet",
    skill: "Money",
    tone: "capital",
    iconClass: "bg-capital-400/10 text-capital-300",
    hoverClass: "hover:border-capital-400/40",
    minutes: 3,
  },
  {
    id: "strategy",
    title: "Choose an Investment Strategy",
    pitch: "Pick a risk profile, mix stocks, bonds, cash and crypto, and see 30 years of compounding.",
    icon: "LineChart",
    skill: "Investing",
    tone: "violet",
    iconClass: "bg-violet-500/10 text-violet-400",
    hoverClass: "hover:border-violet-500/40",
    minutes: 3,
  },
  {
    id: "debt",
    title: "Manage Credit Card Debt",
    pitch: "See exactly how long minimum payments trap you, and what an extra $50 a month saves.",
    icon: "CreditCard",
    skill: "Credit",
    tone: "amber",
    iconClass: "bg-amber-400/10 text-amber-300",
    hoverClass: "hover:border-amber-400/40",
    minutes: 2,
  },
  {
    id: "startup",
    title: "Launch a Startup Idea",
    pitch: "Run the unit economics on a campus business: margin, break-even and runway.",
    icon: "Rocket",
    skill: "Startups",
    tone: "rose",
    iconClass: "bg-rose-500/10 text-rose-400",
    hoverClass: "hover:border-rose-500/40",
    minutes: 4,
  },
  {
    id: "pricing",
    title: "Price a Product",
    pitch: "Find the profit-maximizing price from cost, competitors and what buyers will pay.",
    icon: "Tags",
    skill: "Startups",
    tone: "sky",
    iconClass: "bg-sky-400/10 text-sky-300",
    hoverClass: "hover:border-sky-400/40",
    minutes: 3,
  },
  {
    id: "pitch",
    title: "Pitch to an Investor",
    pitch: "Build a 5-part pitch with a live rubric, and learn what your ask implies about valuation.",
    icon: "Presentation",
    skill: "Fundraising",
    tone: "violet",
    iconClass: "bg-violet-500/10 text-violet-400",
    hoverClass: "hover:border-violet-500/40",
    minutes: 4,
  },
  {
    id: "salary",
    title: "Negotiate a Salary",
    pitch: "Play out a real negotiation, choose your responses, and see what one email is worth.",
    icon: "Handshake",
    skill: "Career",
    tone: "amber",
    iconClass: "bg-amber-400/10 text-amber-300",
    hoverClass: "hover:border-amber-400/40",
    minutes: 3,
  },
];

export function simById(id: string): SimMeta | undefined {
  return sims.find((s) => s.id === id);
}
