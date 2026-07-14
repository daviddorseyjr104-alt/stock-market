import { NextResponse } from "next/server";
import { searchSymbols } from "@/lib/market";
import { guardApi } from "@/lib/api-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUERY = 40;

// GET /api/symbol-search?q=tesla → { results: [{ symbol, description }] }
export async function GET(req: Request) {
  const denied = await guardApi({ route: "symbol-search", limit: 30 });
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  // Uncapped queries meant `q=a`, `q=aa`, `q=aaa`… was an unbounded stream of
  // distinct upstream calls on our key.
  const q = (searchParams.get("q") ?? "").trim().slice(0, MAX_QUERY);
  if (q.length < 1) return NextResponse.json({ results: [] });
  return NextResponse.json({ results: await searchSymbols(q) });
}
