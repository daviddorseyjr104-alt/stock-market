import type { Portfolio } from "@/lib/types";

// Default mock portfolio for the demo user. EDUCATIONAL SIMULATION ONLY.
export const defaultPortfolio: Portfolio = {
  startingBalance: 10000,
  cash: 1200,
  holdings: [
    { id: "h1", ticker: "VTI", name: "Total US Market ETF", assetType: "ETF", allocation: 35, risk: "Medium", changePct: 0.8, lessonId: "etfs" },
    { id: "h2", ticker: "VXUS", name: "International Stocks ETF", assetType: "ETF", allocation: 15, risk: "Medium", changePct: -0.4, lessonId: "etfs" },
    { id: "h3", ticker: "SPY", name: "S&P 500 Index Fund", assetType: "Index Fund", allocation: 20, risk: "Medium", changePct: 1.1, lessonId: "index-funds" },
    { id: "h4", ticker: "BND", name: "Total Bond Market", assetType: "Bond", allocation: 12, risk: "Low", changePct: 0.1, lessonId: "bonds" },
    { id: "h5", ticker: "AAPL", name: "A Tech Company (single stock)", assetType: "Stock", allocation: 6, risk: "High", changePct: 2.3, lessonId: "stocks" },
  ],
};

// Catalog students can "add" from in the simulator.
export const tickerCatalog: {
  ticker: string;
  name: string;
  assetType: Portfolio["holdings"][number]["assetType"];
  risk: Portfolio["holdings"][number]["risk"];
  lessonId: string;
}[] = [
  { ticker: "VTI", name: "Total US Market ETF", assetType: "ETF", risk: "Medium", lessonId: "etfs" },
  { ticker: "VOO", name: "S&P 500 ETF", assetType: "ETF", risk: "Medium", lessonId: "index-funds" },
  { ticker: "VXUS", name: "International Stocks ETF", assetType: "ETF", risk: "Medium", lessonId: "etfs" },
  { ticker: "QQQ", name: "Nasdaq-100 ETF", assetType: "ETF", risk: "High", lessonId: "etfs" },
  { ticker: "SPY", name: "S&P 500 Index Fund", assetType: "Index Fund", risk: "Medium", lessonId: "index-funds" },
  { ticker: "BND", name: "Total Bond Market", assetType: "Bond", risk: "Low", lessonId: "bonds" },
  { ticker: "VWO", name: "Emerging Markets ETF", assetType: "ETF", risk: "High", lessonId: "etfs" },
  { ticker: "SCHD", name: "Dividend ETF", assetType: "ETF", risk: "Medium", lessonId: "dividends" },
  { ticker: "AAPL", name: "Tech Giant (single stock)", assetType: "Stock", risk: "High", lessonId: "stocks" },
  { ticker: "CASH", name: "Cash / Savings", assetType: "Cash", risk: "Low", lessonId: "saving-vs-investing" },
];
