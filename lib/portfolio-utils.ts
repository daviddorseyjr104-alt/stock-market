import type { Position, Portfolio } from "@/lib/types";
import type { Quote } from "@/lib/market";

const RISK_WEIGHT: Record<Position["risk"], number> = {
  Low: 20,
  Medium: 55,
  High: 90,
};

export type PriceOf = (ticker: string) => number;

/** Build a price lookup from a quotes map, falling back to a position's avgCost. */
export function priceFromQuotes(
  quotes: Record<string, Quote> | undefined,
  positions: Position[],
): PriceOf {
  const fallback = new Map(positions.map((p) => [p.ticker.toUpperCase(), p.avgCost]));
  return (ticker: string) => {
    const t = ticker.toUpperCase();
    return quotes?.[t]?.price ?? fallback.get(t) ?? 0;
  };
}

export function positionValue(p: Position, priceOf: PriceOf): number {
  return p.shares * priceOf(p.ticker);
}

export function positionCost(p: Position): number {
  return p.shares * p.avgCost;
}

export function positionPL(p: Position, priceOf: PriceOf): { abs: number; pct: number } {
  const value = positionValue(p, priceOf);
  const cost = positionCost(p);
  return { abs: value - cost, pct: cost > 0 ? (value / cost - 1) * 100 : 0 };
}

export function investedValue(positions: Position[], priceOf: PriceOf): number {
  return positions.reduce((s, p) => s + positionValue(p, priceOf), 0);
}

export function totalValue(p: Portfolio, priceOf: PriceOf): number {
  return p.cash + investedValue(p.positions, priceOf);
}

/** All-time gain vs the fake starting balance. */
export function totalGain(p: Portfolio, priceOf: PriceOf): { abs: number; pct: number } {
  const value = totalValue(p, priceOf);
  const abs = value - p.startingBalance;
  return { abs, pct: p.startingBalance > 0 ? (abs / p.startingBalance) * 100 : 0 };
}

/** 0-100 weighted risk score across invested positions (by market value). */
export function riskScore(positions: Position[], priceOf: PriceOf): number {
  const total = investedValue(positions, priceOf);
  if (total === 0) return 0;
  const weighted = positions.reduce(
    (s, p) => s + RISK_WEIGHT[p.risk] * positionValue(p, priceOf),
    0,
  );
  return Math.round(weighted / total);
}

export function riskLabel(score: number): "Conservative" | "Balanced" | "Aggressive" {
  if (score < 40) return "Conservative";
  if (score < 70) return "Balanced";
  return "Aggressive";
}

/** 0-100 diversification score: spread across positions + asset-type variety. */
export function diversificationScore(positions: Position[], priceOf: PriceOf): number {
  if (positions.length === 0) return 0;
  const total = investedValue(positions, priceOf) || 1;
  const hhi = positions.reduce((s, p) => {
    const w = positionValue(p, priceOf) / total;
    return s + w * w;
  }, 0);
  const spread = (1 - hhi) * 100;
  const types = new Set(positions.map((p) => p.assetType)).size;
  const variety = Math.min(types / 4, 1) * 20;
  return Math.min(100, Math.round(spread * 0.85 + variety));
}

export function biggestPosition(positions: Position[], priceOf: PriceOf): Position | null {
  if (positions.length === 0) return null;
  return positions.reduce((max, p) =>
    positionValue(p, priceOf) > positionValue(max, priceOf) ? p : max,
  );
}

/** Percent of the invested book a position represents (for breakdown charts). */
export function allocationPct(p: Position, positions: Position[], priceOf: PriceOf): number {
  const total = investedValue(positions, priceOf);
  return total > 0 ? (positionValue(p, priceOf) / total) * 100 : 0;
}

export function learningRecommendation(
  positions: Position[],
  priceOf: PriceOf,
): { text: string; lessonId: string } {
  const div = diversificationScore(positions, priceOf);
  const types = new Set(positions.map((p) => p.assetType));
  const big = biggestPosition(positions, priceOf);
  const invested = investedValue(positions, priceOf);
  const bigPct = big && invested > 0 ? (positionValue(big, priceOf) / invested) * 100 : 0;

  if (positions.length === 0)
    return { text: "Start with a broad ETF like VTI, instant diversification in one buy.", lessonId: "etfs" };
  if (big && bigPct > 35 && big.assetType === "Stock")
    return { text: `${big.ticker} is a large single-stock bet. Learn why spreading out lowers risk.`, lessonId: "stocks" };
  if (div < 50)
    return { text: "Your book is concentrated. ETFs and index funds smooth out the ride.", lessonId: "etfs" };
  if (!types.has("Bond"))
    return { text: "Consider adding bonds (e.g. BND) to steady your portfolio's swings.", lessonId: "bonds" };
  return { text: "Solid diversification! Next, learn about rebalancing and allocation.", lessonId: "portfolio-allocation" };
}
