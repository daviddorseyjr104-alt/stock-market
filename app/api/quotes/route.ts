import { NextResponse } from "next/server";
import { getQuotes, isMarketConfigured } from "@/lib/market";
import { guardApi } from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/quotes?symbols=AAPL,VTI,SPY → { live, quotes: { AAPL: {...}, ... } }
export async function GET(req: Request) {
  const denied = await guardApi({ route: "quotes", limit: 40 });
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const symbols = (searchParams.get("symbols") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);

  if (symbols.length === 0) {
    return NextResponse.json({ live: false, quotes: {} });
  }

  const quotes = await getQuotes(symbols);

  // `live` used to be `Boolean(FINNHUB_API_KEY)`, which reported "live" even
  // when every quote had actually fallen back to a hash-derived mock price.
  // Report what the data IS: live only when the provider genuinely answered for
  // every non-cash symbol we returned.
  const real = Object.values(quotes).filter((q) => q.ticker !== "CASH");
  const live = real.length > 0 && real.every((q) => q.live);

  return NextResponse.json({ live, configured: isMarketConfigured(), quotes });
}
