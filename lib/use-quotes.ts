"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Quote } from "@/lib/market";

interface QuotesState {
  quotes: Record<string, Quote>;
  /** True only when the provider actually answered for every symbol. */
  live: boolean;
  loading: boolean;
  refresh: () => void;
}

/**
 * Client poll interval.
 *
 * Must stay at or above the server cache TTL (TTL_MS in market.ts). When this
 * was 30s against a 15s TTL, every single refresh missed the cache and hit
 * Finnhub, which blew the free-tier ceiling and silently degraded everyone to
 * mock prices.
 */
const POLL_MS = 60_000;

/**
 * Fetches quotes for a set of tickers from /api/quotes and refreshes them on an
 * interval. Returns a quotes map keyed by uppercase ticker.
 *
 * `live` reflects whether the data is REAL, not whether a key is configured. A
 * caller rendering a "live prices" affordance must gate it on this.
 */
export function useQuotes(tickers: string[], intervalMs = POLL_MS): QuotesState {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(tickers.length > 0);
  const key = Array.from(new Set(tickers.map((t) => t.toUpperCase()))).sort().join(",");

  const fetchQuotes = useCallback(async () => {
    if (!key) {
      setQuotes({});
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/quotes?symbols=${encodeURIComponent(key)}`);
      if (!res.ok) {
        // Rate-limited or signed out. Keep the last good quotes, but never claim
        // they're live.
        setLive(false);
        return;
      }
      const data = (await res.json()) as { live: boolean; quotes: Record<string, Quote> };
      setQuotes(data.quotes ?? {});
      setLive(Boolean(data.live));
    } catch {
      setLive(false);
    } finally {
      setLoading(false);
    }
  }, [key]);

  const savedFetch = useRef(fetchQuotes);
  savedFetch.current = fetchQuotes;

  useEffect(() => {
    savedFetch.current();
    if (!key) return;
    const id = setInterval(() => savedFetch.current(), intervalMs);
    return () => clearInterval(id);
  }, [key, intervalMs]);

  return { quotes, live, loading, refresh: fetchQuotes };
}
