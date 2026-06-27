import { NextResponse } from "next/server";
import { searchSymbols } from "@/lib/market";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/symbol-search?q=tesla → { results: [{ symbol, description }] }
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (q.length < 1) return NextResponse.json({ results: [] });
  return NextResponse.json({ results: await searchSymbols(q) });
}
