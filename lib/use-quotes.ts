"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Quote } from "@/lib/market";

interface QuotesState {
  quotes: Record<string, Quote>;
  live: boolean;
  loading: boolean;
  refresh: () => void;
}

/**
 * Fetches live quotes for a set of tickers from /api/quotes and refreshes them
 * on an interval. Returns a quotes map keyed by uppercase ticker.
 */
export function useQuotes(tickers: string[], intervalMs = 30_000): QuotesState {
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
      const data = (await res.json()) as { live: boolean; quotes: Record<string, Quote> };
      setQuotes(data.quotes ?? {});
      setLive(Boolean(data.live));
    } catch {
      /* keep last good quotes */
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
