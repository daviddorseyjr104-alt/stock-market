import { NextResponse } from "next/server";
import { guardApi } from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Price history for the simulator's time-range chart (1D/1W/1M/3M/1Y/ALL).
// Sourced from Yahoo Finance's public chart endpoint (no API key). Returns a
// per-symbol series of { t (epoch ms), c (close) } that the client turns into
// a portfolio-value curve.

interface Bar {
  t: number;
  c: number;
}

const RANGE_MAP: Record<string, { r: string; i: string }> = {
  "1D": { r: "1d", i: "5m" },
  "1W": { r: "5d", i: "30m" },
  "1M": { r: "1mo", i: "1d" },
  "3M": { r: "3mo", i: "1d" },
  "1Y": { r: "1y", i: "1d" },
  ALL: { r: "5y", i: "1wk" },
};

const cache = new Map<string, { rows: Bar[]; at: number }>();
const TTL_MS = 10 * 60 * 1000;
/** Keyed by caller-supplied symbols; cap it so it can't grow without bound. */
const CACHE_MAX = 400;

async function fetchYahoo(symbol: string, r: string, i: string): Promise<Bar[]> {
  const key = `${symbol.toUpperCase()}:${r}:${i}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.rows;

  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${r}&interval=${i}`,
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 300 } },
    );
    if (!res.ok) return [];
    const j = (await res.json()) as {
      chart?: { result?: { timestamp?: number[]; indicators?: { quote?: { close?: (number | null)[] }[] } }[] };
    };
    const result = j?.chart?.result?.[0];
    const ts = result?.timestamp ?? [];
    const closes = result?.indicators?.quote?.[0]?.close ?? [];
    const rows: Bar[] = [];
    let last: number | null = null;
    for (let k = 0; k < ts.length; k++) {
      const close: number | null = closes[k] ?? last;
      if (close == null) continue;
      last = close;
      rows.push({ t: ts[k] * 1000, c: Math.round(close * 100) / 100 });
    }
    if (cache.size >= CACHE_MAX) {
      const oldest = cache.keys().next().value;
      if (oldest !== undefined) cache.delete(oldest);
    }
    cache.set(key, { rows, at: Date.now() });
    return rows;
  } catch {
    return [];
  }
}

// GET /api/history?symbols=AAPL,VTI&range=1M
export async function GET(req: Request) {
  const denied = await guardApi({ route: "history", limit: 30 });
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const symbols = (searchParams.get("symbols") ?? "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter((s) => s && s !== "CASH")
    .slice(0, 25);
  const rangeKey = (searchParams.get("range") ?? "1M").toUpperCase();
  const { r, i } = RANGE_MAP[rangeKey] ?? RANGE_MAP["1M"];

  const entries = await Promise.all(
    symbols.map(async (sym) => [sym, await fetchYahoo(sym, r, i)] as const),
  );
  const history: Record<string, Bar[]> = {};
  for (const [sym, rows] of entries) history[sym] = rows;
  return NextResponse.json({ history });
}
