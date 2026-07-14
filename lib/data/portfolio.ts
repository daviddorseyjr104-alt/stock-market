import type { AssetType, Portfolio, RiskLabel } from "@/lib/types";

/**
 * A brand-new paper-trading account: $10,000, all in cash.
 *
 * This used to ship five hardcoded positions (VTI/VXUS/SPY/BND/AAPL) that the
 * user never bought. The consequences were all wrong:
 *   • the UI promised "$10,000 of fake money" while buying power was $3,120.50;
 *   • cost basis + cash came to $10,567 against a $10,000 baseline, so every
 *     account showed a ~+$567 all-time gain before the market had moved;
 *   • the seed contained exactly 4 distinct asset types, which is the threshold
 *     for the "diversified" badge — so every user was handed it at signup;
 *   • the "Buy your first position" empty state was unreachable.
 *
 * You now start with nothing and buy your own first position.
 */
export const defaultPortfolio: Portfolio = {
  startingBalance: 10000,
  cash: 10000,
  positions: [],
};

// Curated "featured" tickers students can browse and buy. They can also search
// and buy any valid ticker the data provider recognizes.
export const tickerCatalog: {
  ticker: string;
  name: string;
  assetType: AssetType;
  risk: RiskLabel;
  lessonId: string;
}[] = [
  { ticker: "VTI", name: "Vanguard Total US Market ETF", assetType: "ETF", risk: "Medium", lessonId: "investing-u1-l2" },
  { ticker: "VOO", name: "Vanguard S&P 500 ETF", assetType: "ETF", risk: "Medium", lessonId: "investing-u1-l2" },
  { ticker: "VXUS", name: "Vanguard International Stocks ETF", assetType: "ETF", risk: "Medium", lessonId: "investing-u1-l2" },
  { ticker: "QQQ", name: "Invesco Nasdaq-100 ETF", assetType: "ETF", risk: "High", lessonId: "investing-u1-l2" },
  { ticker: "SPY", name: "S&P 500 Index ETF", assetType: "Index Fund", risk: "Medium", lessonId: "investing-u1-l2" },
  { ticker: "BND", name: "Vanguard Total Bond Market", assetType: "Bond", risk: "Low", lessonId: "investing-u2-l2" },
  { ticker: "VWO", name: "Vanguard Emerging Markets ETF", assetType: "ETF", risk: "High", lessonId: "investing-u1-l2" },
  { ticker: "SCHD", name: "Schwab US Dividend Equity ETF", assetType: "ETF", risk: "Medium", lessonId: "investing-u2-l1" },
  { ticker: "AAPL", name: "Apple Inc.", assetType: "Stock", risk: "High", lessonId: "investing-u1-l1" },
  { ticker: "MSFT", name: "Microsoft Corp.", assetType: "Stock", risk: "High", lessonId: "investing-u1-l1" },
  { ticker: "NVDA", name: "NVIDIA Corp.", assetType: "Stock", risk: "High", lessonId: "investing-u1-l1" },
  { ticker: "VT", name: "Vanguard Total World Stock ETF", assetType: "ETF", risk: "Medium", lessonId: "investing-u1-l2" },
];

export const catalogByTicker = (t: string) =>
  tickerCatalog.find((c) => c.ticker === t.toUpperCase());
