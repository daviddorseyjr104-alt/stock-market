import type { AssetType, Portfolio, RiskLabel } from "@/lib/types";

// Default sample paper-trading account. EDUCATIONAL SIMULATION, fake money,
// real prices. avgCost values are illustrative entry prices; live value and
// P/L are computed against real-time quotes at runtime.
export const defaultPortfolio: Portfolio = {
  startingBalance: 10000,
  cash: 3120.5,
  positions: [
    { id: "h1", ticker: "VTI", name: "Vanguard Total US Market ETF", assetType: "ETF", risk: "Medium", shares: 12, avgCost: 262.4, lessonId: "etfs" },
    { id: "h2", ticker: "VXUS", name: "Vanguard International Stocks ETF", assetType: "ETF", risk: "Medium", shares: 18, avgCost: 64.1, lessonId: "etfs" },
    { id: "h3", ticker: "SPY", name: "S&P 500 ETF", assetType: "Index Fund", risk: "Medium", shares: 3, avgCost: 505.2, lessonId: "index-funds" },
    { id: "h4", ticker: "BND", name: "Vanguard Total Bond Market", assetType: "Bond", risk: "Low", shares: 10, avgCost: 73.0, lessonId: "bonds" },
    { id: "h5", ticker: "AAPL", name: "Apple Inc.", assetType: "Stock", risk: "High", shares: 4, avgCost: 224.6, lessonId: "stocks" },
  ],
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
  { ticker: "VTI", name: "Vanguard Total US Market ETF", assetType: "ETF", risk: "Medium", lessonId: "etfs" },
  { ticker: "VOO", name: "Vanguard S&P 500 ETF", assetType: "ETF", risk: "Medium", lessonId: "index-funds" },
  { ticker: "VXUS", name: "Vanguard International Stocks ETF", assetType: "ETF", risk: "Medium", lessonId: "etfs" },
  { ticker: "QQQ", name: "Invesco Nasdaq-100 ETF", assetType: "ETF", risk: "High", lessonId: "etfs" },
  { ticker: "SPY", name: "S&P 500 Index ETF", assetType: "Index Fund", risk: "Medium", lessonId: "index-funds" },
  { ticker: "BND", name: "Vanguard Total Bond Market", assetType: "Bond", risk: "Low", lessonId: "bonds" },
  { ticker: "VWO", name: "Vanguard Emerging Markets ETF", assetType: "ETF", risk: "High", lessonId: "etfs" },
  { ticker: "SCHD", name: "Schwab US Dividend Equity ETF", assetType: "ETF", risk: "Medium", lessonId: "dividends" },
  { ticker: "AAPL", name: "Apple Inc.", assetType: "Stock", risk: "High", lessonId: "stocks" },
  { ticker: "MSFT", name: "Microsoft Corp.", assetType: "Stock", risk: "High", lessonId: "stocks" },
  { ticker: "NVDA", name: "NVIDIA Corp.", assetType: "Stock", risk: "High", lessonId: "stocks" },
  { ticker: "VT", name: "Vanguard Total World Stock ETF", assetType: "ETF", risk: "Medium", lessonId: "index-funds" },
];

export const catalogByTicker = (t: string) =>
  tickerCatalog.find((c) => c.ticker === t.toUpperCase());
