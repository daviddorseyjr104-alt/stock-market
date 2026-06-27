// ──────────────────────────────────────────────────────────────────────────
// Market data layer.
//
// Returns LIVE quotes from Finnhub when FINNHUB_API_KEY is set; otherwise a
// deterministic, realistic mock so the simulator works with zero config.
// Educational paper-trading only, these prices drive a SIMULATED portfolio
// with fake money. No real orders are ever placed.
// ──────────────────────────────────────────────────────────────────────────

export interface Quote {
  ticker: string;
  price: number; // current price
  change: number; // absolute change today
  changePct: number; // percent change today
  prevClose: number;
  live: boolean; // true if from a real data provider
}

const FINNHUB_URL = "https://finnhub.io/api/v1/quote";

// Small in-memory cache (per warm serverless instance) to respect rate limits.
const cache = new Map<string, { q: Quote; at: number }>();
const TTL_MS = 15_000;

/** Deterministic pseudo-random in [0,1) from a string + salt. */
function hash01(s: string, salt = 0): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

/** A plausible, stable mock quote for a ticker (used without an API key). */
function mockQuote(ticker: string): Quote {
  const t = ticker.toUpperCase();
  if (t === "CASH") {
    return { ticker: t, price: 1, change: 0, changePct: 0, prevClose: 1, live: false };
  }
  // Base price 20-600, daily change -3%..+3% that shifts each day.
  const base = 20 + hash01(t) * 580;
  const day = Math.floor(Date.now() / 86_400_000);
  const changePct = (hash01(t, day) - 0.5) * 6;
  const prevClose = Math.round(base * 100) / 100;
  const price = Math.round(prevClose * (1 + changePct / 100) * 100) / 100;
  return {
    ticker: t,
    price,
    change: Math.round((price - prevClose) * 100) / 100,
    changePct: Math.round(changePct * 100) / 100,
    prevClose,
    live: false,
  };
}

async function fetchFinnhub(ticker: string, token: string): Promise<Quote | null> {
  try {
    const res = await fetch(`${FINNHUB_URL}?symbol=${encodeURIComponent(ticker)}&token=${token}`, {
      // Revalidate often; this is live market data.
      next: { revalidate: 15 },
    });
    if (!res.ok) return null;
    const d = (await res.json()) as { c?: number; d?: number; dp?: number; pc?: number };
    if (!d || typeof d.c !== "number" || d.c === 0) return null; // 0 = unknown symbol
    return {
      ticker: ticker.toUpperCase(),
      price: d.c,
      change: d.d ?? 0,
      changePct: d.dp ?? 0,
      prevClose: d.pc ?? d.c,
      live: true,
    };
  } catch {
    return null;
  }
}

/** Fetch quotes for many tickers. Live when configured, mock otherwise. */
export async function getQuotes(tickers: string[]): Promise<Record<string, Quote>> {
  const token = process.env.FINNHUB_API_KEY;
  const unique = Array.from(new Set(tickers.map((t) => t.toUpperCase()))).filter(Boolean);
  const out: Record<string, Quote> = {};
  const now = Date.now();

  await Promise.all(
    unique.map(async (t) => {
      const cached = cache.get(t);
      if (cached && now - cached.at < TTL_MS) {
        out[t] = cached.q;
        return;
      }
      let q: Quote | null = null;
      if (token && t !== "CASH") q = await fetchFinnhub(t, token);
      const quote = q ?? mockQuote(t);
      cache.set(t, { q: quote, at: now });
      out[t] = quote;
    }),
  );

  return out;
}

export const isMarketLive = () => Boolean(process.env.FINNHUB_API_KEY);

// ── Symbol search ───────────────────────────────────────────────────────────
export interface SymbolResult {
  symbol: string;
  description: string;
}

/** Search real tradable US symbols by ticker or company name. */
export async function searchSymbols(q: string): Promise<SymbolResult[]> {
  const query = q.trim();
  if (!query) return [];
  const token = process.env.FINNHUB_API_KEY;

  // No key → search the curated catalog so the UX still works.
  if (!token) {
    const { tickerCatalog } = await import("@/lib/data/portfolio");
    const ql = query.toLowerCase();
    return tickerCatalog
      .filter((c) => (c.ticker + c.name).toLowerCase().includes(ql))
      .slice(0, 10)
      .map((c) => ({ symbol: c.ticker, description: c.name }));
  }

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${token}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      result?: { symbol: string; description: string; type?: string }[];
    };
    return (data.result ?? [])
      // US common stocks / ETFs only — drop foreign/OTC dotted symbols.
      .filter((r) => r.symbol && !r.symbol.includes(".") && !r.symbol.includes(":"))
      .slice(0, 10)
      .map((r) => ({ symbol: r.symbol, description: r.description || r.symbol }));
  } catch {
    return [];
  }
}
