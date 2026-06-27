import type { Holding, Portfolio } from "@/lib/types";

const RISK_WEIGHT: Record<Holding["risk"], number> = {
  Low: 20,
  Medium: 55,
  High: 90,
};

/** 0–100 weighted risk score based on each holding's allocation and risk label. */
export function riskScore(holdings: Holding[]): number {
  const total = holdings.reduce((s, h) => s + h.allocation, 0);
  if (total === 0) return 0;
  const weighted = holdings.reduce(
    (s, h) => s + RISK_WEIGHT[h.risk] * h.allocation,
    0,
  );
  return Math.round(weighted / total);
}

export function riskLabel(score: number): "Conservative" | "Balanced" | "Aggressive" {
  if (score < 40) return "Conservative";
  if (score < 70) return "Balanced";
  return "Aggressive";
}

/**
 * 0–100 diversification score. Rewards spreading across asset types and not
 * over-concentrating in a single position (Herfindahl-style penalty).
 */
export function diversificationScore(holdings: Holding[]): number {
  if (holdings.length === 0) return 0;
  const total = holdings.reduce((s, h) => s + h.allocation, 0) || 1;

  // Concentration: sum of squared weights (lower = more diversified)
  const hhi = holdings.reduce((s, h) => {
    const w = h.allocation / total;
    return s + w * w;
  }, 0);
  const spread = (1 - hhi) * 100; // 0..100

  // Variety bonus for distinct asset types
  const types = new Set(holdings.map((h) => h.assetType)).size;
  const variety = Math.min(types / 4, 1) * 20;

  return Math.min(100, Math.round(spread * 0.85 + variety));
}

export function biggestPosition(holdings: Holding[]): Holding | null {
  if (holdings.length === 0) return null;
  return holdings.reduce((max, h) => (h.allocation > max.allocation ? h : max));
}

export function portfolioValue(p: Portfolio): number {
  // Mock value: starting balance nudged by weighted daily change.
  const invested = p.startingBalance - p.cash;
  const drift = p.holdings.reduce(
    (s, h) => s + (h.changePct / 100) * (h.allocation / 100) * invested,
    0,
  );
  return p.startingBalance + drift;
}

export function dayChange(p: Portfolio): number {
  return portfolioValue(p) - p.startingBalance;
}

/** A student-friendly recommendation derived from the current portfolio. */
export function learningRecommendation(holdings: Holding[]): {
  text: string;
  lessonId: string;
} {
  const div = diversificationScore(holdings);
  const types = new Set(holdings.map((h) => h.assetType));
  const big = biggestPosition(holdings);

  if (holdings.length === 0)
    return { text: "Start by adding a broad ETF — it's instant diversification in one click.", lessonId: "etfs" };
  if (big && big.allocation > 30 && big.assetType === "Stock")
    return { text: `${big.ticker} is a big single-stock bet. Learn why spreading out lowers risk.`, lessonId: "stocks" };
  if (div < 50)
    return { text: "Your portfolio is concentrated. ETFs and index funds can smooth the ride.", lessonId: "etfs" };
  if (!types.has("Bond"))
    return { text: "Consider adding bonds to steady your portfolio's swings.", lessonId: "bonds" };
  return { text: "Solid diversification! Next, learn about rebalancing and allocation.", lessonId: "portfolio-allocation" };
}
