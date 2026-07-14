import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// ──────────────────────────────────────────────────────────────────────────
// Shared gate for the API routes that spend money on our behalf.
//
// /api/quotes, /api/history and /api/symbol-search each proxy a metered
// upstream (Finnhub, Yahoo) using OUR key, and all three shipped with no auth
// and no rate limit — open to the whole internet. `middleware.ts` matches /api
// but its PROTECTED list only names page routes, so it never covered them.
//
// The limiter is per-instance and in-memory. That is deliberately modest: it is
// an abuse brake, not a billing guarantee. It stops a single client hammering a
// warm instance; it does not coordinate across serverless instances. If this
// ever runs at scale, move the counter to Postgres or Redis.
// ──────────────────────────────────────────────────────────────────────────

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const BUCKETS_MAX = 5_000;

function hit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || now >= b.resetAt) {
    if (buckets.size >= BUCKETS_MAX) {
      // Evict anything already expired before falling back to oldest-first.
      for (const [k, v] of Array.from(buckets.entries())) {
        if (now >= v.resetAt) buckets.delete(k);
        if (buckets.size < BUCKETS_MAX) break;
      }
      if (buckets.size >= BUCKETS_MAX) {
        const oldest = buckets.keys().next().value;
        if (oldest !== undefined) buckets.delete(oldest);
      }
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  b.count += 1;
  if (b.count > limit) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

export interface GuardOptions {
  /** Requests allowed per window, per user. */
  limit: number;
  windowMs?: number;
  /** Distinguishes buckets between routes. */
  route: string;
}

/**
 * Requires a signed-in user and applies a per-user rate limit.
 * Returns a NextResponse to send back on rejection, or null to proceed.
 */
export async function guardApi(opts: GuardOptions): Promise<NextResponse | null> {
  const { limit, windowMs = 60_000, route } = opts;

  // Keyless demo builds have no auth to check and no key to spend.
  if (!isSupabaseConfigured) return null;

  const supabase = createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to use market data." }, { status: 401 });
  }

  const { ok, retryAfter } = hit(`${route}:${user.id}`, limit, windowMs);
  if (!ok) {
    return NextResponse.json(
      { error: "You're making requests too quickly. Give it a moment." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  return null;
}
