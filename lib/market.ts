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
  open: number; // today's opening price
  live: boolean; // true if from a real data provider
}

const FINNHUB_URL = "https://finnhub.io/api/v1/quote";

// In-memory cache (per warm serverless instance) to respect rate limits.
//
// The TTL must exceed the client's poll interval (see POLL_MS in use-quotes.ts)
// or the cache never hits: at TTL 15s against a 30s poll, EVERY refresh went to
// Finnhub, ~52 calls/min against a 60/min free-tier ceiling. Blowing that
// ceiling is what made the mock-price fallback fire in normal use.
const cache = new Map<string, { q: Quote; at: number }>();
const TTL_MS = 45_000;
/** Keyed by caller-supplied symbols, so it must not grow without bound. */
const CACHE_MAX = 500;

function cacheSet(t: string, q: Quote, at: number) {
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(t, { q, at });
}

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
    return { ticker: t, price: 1, change: 0, changePct: 0, prevClose: 1, open: 1, live: false };
  }
  // Base price 20-600, daily change -3%..+3% that shifts each day.
  const base = 20 + hash01(t) * 580;
  const day = Math.floor(Date.now() / 86_400_000);
  const changePct = (hash01(t, day) - 0.5) * 6;
  const prevClose = Math.round(base * 100) / 100;
  const price = Math.round(prevClose * (1 + changePct / 100) * 100) / 100;
  // Open somewhere between prevClose and current, for a believable intraday shape.
  const open = Math.round((prevClose + (price - prevClose) * 0.45) * 100) / 100;
  return {
    ticker: t,
    price,
    change: Math.round((price - prevClose) * 100) / 100,
    changePct: Math.round(changePct * 100) / 100,
    prevClose,
    open,
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
    const d = (await res.json()) as { c?: number; d?: number; dp?: number; pc?: number; o?: number };
    if (!d || typeof d.c !== "number" || d.c === 0) return null; // 0 = unknown symbol
    return {
      ticker: ticker.toUpperCase(),
      price: d.c,
      change: d.d ?? 0,
      changePct: d.dp ?? 0,
      prevClose: d.pc ?? d.c,
      open: d.o ?? d.pc ?? d.c,
      live: true,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch quotes for many tickers.
 *
 * When a provider call fails (rate limit, outage, unknown symbol) this falls
 * back to `mockQuote`, whose price is derived from a hash of the ticker string.
 * That fallback is legitimate — the simulator has to keep working — but the
 * resulting quote carries `live: false` and callers MUST NOT present it as a
 * real market price. Teaching students to read a P/L computed from a hash of
 * the letters "NVDA" is worse than showing them nothing.
 */
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
      cacheSet(t, quote, now);
      out[t] = quote;
    }),
  );

  return out;
}

/** Whether a provider is *configured*. Says nothing about whether it answered —
 *  read `Quote.live` per quote for that. */
export const isMarketConfigured = () => Boolean(process.env.FINNHUB_API_KEY);

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
      // US common stocks / ETFs only, drop foreign/OTC dotted symbols.
      .filter((r) => r.symbol && !r.symbol.includes(".") && !r.symbol.includes(":"))
      .slice(0, 10)
      .map((r) => ({ symbol: r.symbol, description: r.description || r.symbol }));
  } catch {
    return [];
  }
}
