import { NextResponse } from "next/server";
import { getQuotes, isMarketLive } from "@/lib/market";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/quotes?symbols=AAPL,VTI,SPY → { live, quotes: { AAPL: {...}, ... } }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbols = (searchParams.get("symbols") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);

  if (symbols.length === 0) {
    return NextResponse.json({ live: isMarketLive(), quotes: {} });
  }

  const quotes = await getQuotes(symbols);
  return NextResponse.json({ live: isMarketLive(), quotes });
}
