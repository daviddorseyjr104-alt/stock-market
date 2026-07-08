"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  PieChart as PieIcon,
  Search,
  TrendingUp,
  TrendingDown,
  Wallet,
  RotateCcw,
  Radio,
  ArrowRight,
  X,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppState } from "@/lib/store";
import { track } from "@/lib/analytics";
import { useQuotes } from "@/lib/use-quotes";
import { tickerCatalog, catalogByTicker } from "@/lib/data/portfolio";
import {
  priceFromQuotes,
  totalValue,
  totalGain,
  investedValue,
  positionValue,
  positionPL,
  riskScore,
  riskLabel,
  diversificationScore,
  biggestPosition,
  allocationPct,
  learningRecommendation,
} from "@/lib/portfolio-utils";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import type { RiskLabel } from "@/lib/types";

const CHART_COLORS = ["#39f5ac", "#7c5cff", "#38bdf8", "#fbbf24", "#fb7185", "#34d399", "#c084fc", "#60a5fa"];

type RangeKey = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";
const RANGES: { key: RangeKey; sub: string }[] = [
  { key: "1D", sub: "today" },
  { key: "1W", sub: "past week" },
  { key: "1M", sub: "past month" },
  { key: "3M", sub: "past 3 months" },
  { key: "1Y", sub: "past year" },
  { key: "ALL", sub: "all-time" },
];

interface Bar {
  t: number;
  c: number;
}

/** Reconstruct portfolio value over time from per-symbol price history. */
function buildPortfolioSeries(
  history: Record<string, Bar[]>,
  positions: { ticker: string; shares: number; avgCost: number }[],
  cash: number,
): { t: number; v: number }[] {
  if (positions.length === 0) return [];
  const tset = new Set<number>();
  for (const p of positions) for (const b of history[p.ticker.toUpperCase()] ?? []) tset.add(b.t);
  const times = Array.from(tset).sort((a, b) => a - b);
  if (times.length < 2) return [];
  const ptr: Record<string, number> = {};
  const cur: Record<string, number> = {};
  for (const p of positions) {
    ptr[p.ticker.toUpperCase()] = 0;
    cur[p.ticker.toUpperCase()] = p.avgCost;
  }
  return times.map((t) => {
    let v = cash;
    for (const p of positions) {
      const sym = p.ticker.toUpperCase();
      const rows = history[sym] ?? [];
      while (ptr[sym] < rows.length && rows[ptr[sym]].t <= t) {
        cur[sym] = rows[ptr[sym]].c;
        ptr[sym]++;
      }
      v += p.shares * cur[sym];
    }
    return { t, v: Math.round(v * 100) / 100 };
  });
}

export default function PortfolioSimulatorPage() {
  const { portfolio, buy, sell, resetPortfolio, recordEquity } = useAppState();

  const [selected, setSelected] = useState(tickerCatalog[0].ticker);
  const [selectedName, setSelectedName] = useState<string>(tickerCatalog[0].name);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<{ symbol: string; description: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [mode, setMode] = useState<"shares" | "dollars">("dollars");
  const [amount, setAmount] = useState("250");
  const [flash, setFlash] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [range, setRange] = useState<RangeKey>("1M");
  const [history, setHistory] = useState<Record<string, Bar[]>>({});

  // Live symbol search (debounced), trade ANY real US stock or ETF.
  useEffect(() => {
    const q = search.trim();
    if (!q) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/symbol-search?q=${encodeURIComponent(q)}`);
        const data = (await res.json()) as { results: { symbol: string; description: string }[] };
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 280);
    return () => clearTimeout(t);
  }, [search]);

  function pickSymbol(symbol: string, name: string) {
    setSelected(symbol.toUpperCase());
    setSelectedName(name);
    setSearch("");
    setResults([]);
  }

  const tickers = useMemo(
    () =>
      Array.from(
        new Set([
          ...portfolio.positions.map((p) => p.ticker),
          ...tickerCatalog.map((c) => c.ticker),
          selected,
        ]),
      ),
    [portfolio.positions, selected],
  );
  const { quotes, live, loading } = useQuotes(tickers);
  const priceOf = useMemo(() => priceFromQuotes(quotes, portfolio.positions), [quotes, portfolio.positions]);

  const value = totalValue(portfolio, priceOf);
  const invested = investedValue(portfolio.positions, priceOf);
  const gain = totalGain(portfolio, priceOf);
  const rScore = riskScore(portfolio.positions, priceOf);
  const dScore = diversificationScore(portfolio.positions, priceOf);
  const biggest = biggestPosition(portfolio.positions, priceOf);
  const rec = learningRecommendation(portfolio.positions, priceOf);

  // Record the account value over time (kept for long-term continuity).
  useEffect(() => {
    if (!loading && value > 0) recordEquity(value);
  }, [value, loading, recordEquity]);

  const round2 = (x: number) => Math.round(x * 100) / 100;

  // Fetch real price history for the selected range whenever it (or the
  // holdings) change, then reconstruct the portfolio value over time.
  const posTickers = portfolio.positions.map((p) => p.ticker).join(",");
  useEffect(() => {
    if (!posTickers) {
      setHistory({});
      return;
    }
    let alive = true;
    fetch(`/api/history?symbols=${encodeURIComponent(posTickers)}&range=${range}`)
      .then((r) => r.json())
      .then((d: { history: Record<string, Bar[]> }) => {
        if (alive) setHistory(d.history ?? {});
      })
      .catch(() => alive && setHistory({}));
    return () => {
      alive = false;
    };
  }, [posTickers, range]);

  // Fallback curve from live quotes (yesterday's close → open → now) for when
  // history hasn't loaded yet.
  const fallbackSeries = useMemo(() => {
    const now = Date.now();
    if (portfolio.positions.length === 0) return [];
    const valWith = (pick: (q: { prevClose: number; open: number; price: number }) => number) =>
      portfolio.cash +
      portfolio.positions.reduce((s, p) => {
        const q = quotes[p.ticker.toUpperCase()];
        return s + p.shares * (q ? pick(q) : p.avgCost);
      }, 0);
    return [
      { t: now - 86_400_000, v: round2(valWith((q) => q.prevClose)) },
      { t: now - 23_400_000, v: round2(valWith((q) => q.open)) },
      { t: now, v: round2(value) },
    ];
  }, [portfolio, quotes, value]);

  const equitySeries = useMemo(() => {
    const hs = buildPortfolioSeries(history, portfolio.positions, portfolio.cash);
    if (hs.length >= 2) {
      const now = Date.now();
      if (now - hs[hs.length - 1].t > 60_000) hs.push({ t: now, v: round2(value) });
      return hs;
    }
    return fallbackSeries;
  }, [history, portfolio, value, fallbackSeries]);

  const rangeChange = equitySeries.length >= 2 ? value - equitySeries[0].v : gain.abs;
  const rangePct =
    equitySeries.length >= 2 && equitySeries[0].v > 0 ? (rangeChange / equitySeries[0].v) * 100 : gain.pct;
  const rangeSub = RANGES.find((r) => r.key === range)?.sub ?? "";
  const eqColor = rangeChange >= 0 ? "#39f5ac" : "#fb7185";

  const dayChange = portfolio.positions.reduce(
    (s, p) => s + p.shares * (quotes[p.ticker.toUpperCase()]?.change ?? 0),
    0,
  );

  const selectedQuote = quotes[selected.toUpperCase()];
  const selectedPrice = selectedQuote?.price ?? 0;
  const selectedMeta = catalogByTicker(selected);
  const selectedDisplayName = selectedMeta?.name ?? selectedName;
  const qty = Math.max(0, Number(amount) || 0);
  const orderShares = mode === "shares" ? qty : selectedPrice > 0 ? qty / selectedPrice : 0;
  const orderCost = orderShares * selectedPrice;

  function showFlash(kind: "ok" | "err", msg: string) {
    setFlash({ kind, msg });
    setTimeout(() => setFlash(null), 2600);
  }

  function handleBuy() {
    const meta = catalogByTicker(selected);
    const res = buy({
      ticker: selected.toUpperCase(),
      name: meta?.name ?? selectedName ?? selected.toUpperCase(),
      assetType: meta?.assetType ?? "Stock",
      risk: (meta?.risk ?? "High") as RiskLabel,
      lessonId: meta?.lessonId,
      shares: orderShares,
      price: selectedPrice,
    });
    if (res.ok) {
      showFlash("ok", `Bought ${orderShares.toFixed(3)} ${selected.toUpperCase()} @ ${formatCurrency(selectedPrice, { maximumFractionDigits: 2 })}`);
      track("trade_executed", { ticker: selected.toUpperCase(), cost: Math.round(orderCost) });
    } else showFlash("err", res.reason ?? "Order failed.");
  }

  const chartData = portfolio.positions
    .map((p) => ({ name: p.ticker, value: positionValue(p, priceOf) }))
    .filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trading Simulator"
        subtitle="Buy and sell real tickers at live market prices, with $10,000 of fake money. Make every mistake here; it's free."
        action={
          <Pill tone={live ? "capital" : "default"}>
            <Radio className={cn("h-3.5 w-3.5", live && "animate-pulse")} />
            {live ? "Live market prices" : "Simulated prices"}
          </Pill>
        }
      />

      <Disclaimer>
        <strong className="font-semibold text-white/60">Educational paper-trading only.</strong>{" "}
        Prices are real{live ? "" : " (simulated until a market-data key is added)"}, but the
        money and trades are simulated. No real orders are placed and this is not financial advice.
      </Disclaimer>

      {/* Portfolio value + growth chart (Robinhood-style) */}
      <Card glow className="p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/40">Portfolio value</p>
            <p className="font-display text-4xl font-bold tracking-tight text-white">
              {formatCurrency(value, { maximumFractionDigits: 2 })}
            </p>
            <p className={cn("mt-1 text-sm font-semibold", rangeChange >= 0 ? "text-capital-300" : "text-rose-400")}>
              {rangeChange >= 0 ? "▲" : "▼"} {formatCurrency(Math.abs(rangeChange))} ({formatPercent(rangePct)})
              <span className="text-white/40"> {rangeSub}</span>
            </p>
            <p className="mt-0.5 text-xs text-white/35">
              All-time {gain.abs >= 0 ? "+" : ""}
              {formatCurrency(gain.abs)} ({formatPercent(gain.pct)})
            </p>
          </div>
        </div>
        <div className="mt-4 h-40 sm:h-48">
          {equitySeries.length >= 2 ? (
            <ResponsiveContainer>
              <AreaChart data={equitySeries} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={eqColor} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={eqColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" hide />
                <YAxis hide domain={["dataMin", "dataMax"]} />
                <Tooltip
                  contentStyle={{ background: "#11141f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                  labelFormatter={(t) =>
                    new Date(t as number).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
                  }
                  formatter={(v: number) => [formatCurrency(v, { maximumFractionDigits: 2 }), "Value"]}
                />
                <Area type="monotone" dataKey="v" stroke={eqColor} strokeWidth={2} fill="url(#eq)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center">
              <p className="text-sm text-white/55">Buy a position to start your growth curve.</p>
              <p className="mt-1 max-w-xs text-xs text-white/35">
                Once you hold a stock or ETF, this chart tracks your portfolio&apos;s value in real time.
              </p>
            </div>
          )}
        </div>

        {/* Time-range tabs */}
        <div className="mt-3 flex items-center gap-1 border-t border-white/5 pt-3">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              aria-pressed={range === r.key}
              className={cn(
                "flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors sm:flex-none sm:px-4",
                range === r.key
                  ? "bg-white/10 text-white"
                  : "text-white/45 hover:bg-white/5 hover:text-white",
              )}
            >
              {r.key}
            </button>
          ))}
        </div>
      </Card>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wider text-white/40">Buying power</p>
          <p className="mt-1 font-display text-2xl font-bold text-white">{formatCurrency(portfolio.cash, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-white/45">cash to invest</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wider text-white/40">Invested</p>
          <p className="mt-1 font-display text-2xl font-bold text-white">{formatCurrency(invested, { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-white/45">across {portfolio.positions.length} positions</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wider text-white/40">Risk</p>
          <p className="mt-1 font-display text-2xl font-bold text-amber-300">{riskLabel(rScore)}</p>
          <p className="text-xs text-white/45">how aggressive your mix is</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wider text-white/40">Diversification</p>
          <p className="mt-1 font-display text-2xl font-bold text-capital-300">{dScore}/100</p>
          <p className="text-xs text-white/45">spread across assets</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader
              title="Your positions"
              subtitle={biggest ? `Biggest: ${biggest.ticker} · ${allocationPct(biggest, portfolio.positions, priceOf).toFixed(0)}% of book` : "No positions yet"}
              icon={<TrendingUp className="h-4 w-4" />}
              action={
                <button onClick={resetPortfolio} className="inline-flex items-center gap-1.5 text-xs text-white/45 hover:text-white">
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>
              }
            />
            {portfolio.positions.length === 0 ? (
              <EmptyState
                icon={<PieIcon className="h-7 w-7" />}
                title="No positions yet"
                description="Buy your first position from the trade ticket, a broad ETF like VTI is a classic first move."
                action={<Button onClick={() => setSelected("VTI")}>Pick VTI to start</Button>}
              />
            ) : (
              <div className="space-y-1.5">
                {portfolio.positions.map((p) => {
                  const q = quotes[p.ticker.toUpperCase()];
                  const price = priceOf(p.ticker);
                  const pl = positionPL(p, priceOf);
                  return (
                    <div key={p.id} className="flex items-center gap-3 rounded-2xl px-2.5 py-2.5 hover:bg-white/[0.03]">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-white">{p.ticker}</span>
                          <Pill tone={p.risk === "Low" ? "low" : p.risk === "Medium" ? "medium" : "high"}>{p.assetType}</Pill>
                        </div>
                        <p className="truncate text-xs text-white/40">
                          {p.shares.toFixed(3)} sh · avg {formatCurrency(p.avgCost, { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{formatCurrency(price, { maximumFractionDigits: 2 })}</p>
                        {q && (
                          <p className={cn("text-[11px]", q.changePct >= 0 ? "text-capital-300" : "text-rose-400")}>{formatPercent(q.changePct)}</p>
                        )}
                      </div>
                      <div className="w-24 text-right">
                        <p className="text-sm font-semibold text-white">{formatCurrency(positionValue(p, priceOf), { maximumFractionDigits: 0 })}</p>
                        <p className={cn("text-[11px]", pl.abs >= 0 ? "text-capital-300" : "text-rose-400")}>
                          {pl.abs >= 0 ? "+" : ""}
                          {formatCurrency(pl.abs)} ({formatPercent(pl.pct)})
                        </p>
                      </div>
                      <button
                        onClick={() => sell(p.id, p.shares, price)}
                        className="rounded-xl border border-white/10 px-2.5 py-1.5 text-xs text-white/60 transition-colors hover:border-rose-500/40 hover:text-rose-300"
                        title="Sell entire position at the live price"
                      >
                        Sell
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {chartData.length > 0 && (
            <Card>
              <CardHeader title="Allocation" subtitle="By live market value" icon={<PieIcon className="h-4 w-4" />} />
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="h-44 w-44 shrink-0">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={chartData} dataKey="value" innerRadius={48} outerRadius={72} paddingAngle={2} stroke="none">
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "#11141f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                        formatter={(v: number) => formatCurrency(v, { maximumFractionDigits: 0 })}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-1.5">
                  {chartData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2 text-sm">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="font-mono text-xs text-white/70">{d.name}</span>
                      <span className="ml-auto text-xs text-white/40">{invested > 0 ? ((d.value / invested) * 100).toFixed(0) : 0}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card glow>
            <CardHeader title="Trade ticket" subtitle="Buy at the live price" icon={<Wallet className="h-4 w-4" />} />

            <div className="mb-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-3">
              <Search className="h-4 w-4 text-white/35" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value.toUpperCase())}
                placeholder="Search any stock or ETF (TSLA, Apple, NVDA...)"
                className="w-full bg-transparent py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>

            {search.trim() ? (
              <div className="mb-4 max-h-56 space-y-1 overflow-y-auto no-scrollbar">
                {searching && results.length === 0 ? (
                  <p className="px-2 py-2 text-xs text-white/40">Searching the market...</p>
                ) : results.length > 0 ? (
                  results.map((r) => (
                    <button
                      key={r.symbol}
                      onClick={() => pickSymbol(r.symbol, r.description)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/8 px-3 py-2 text-left transition-colors hover:border-capital-400/40 hover:bg-white/[0.03]"
                    >
                      <span className="min-w-0">
                        <span className="font-mono text-sm font-semibold text-white">{r.symbol}</span>
                        <span className="ml-2 truncate text-xs text-white/45">{r.description}</span>
                      </span>
                      <span className="shrink-0 text-xs text-capital-300">Trade</span>
                    </button>
                  ))
                ) : (
                  <p className="px-2 py-2 text-xs text-white/40">No matches for &ldquo;{search}&rdquo;.</p>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-white/35">Popular</p>
                <div className="flex max-h-28 flex-wrap gap-1.5 overflow-y-auto no-scrollbar">
                  {tickerCatalog.map((c) => (
                    <button
                      key={c.ticker}
                      onClick={() => pickSymbol(c.ticker, c.name)}
                      className={cn(
                        "rounded-xl border px-2.5 py-1.5 font-mono text-xs transition-colors",
                        selected === c.ticker ? "border-capital-400/50 bg-capital-400/10 text-capital-200" : "border-white/10 text-white/60 hover:border-white/20",
                      )}
                    >
                      {c.ticker}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold text-white">{selected.toUpperCase()}</p>
                  <p className="truncate text-xs text-white/45">{selectedDisplayName || "Equity"}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-bold text-white">
                    {loading && !selectedQuote ? "..." : formatCurrency(selectedPrice, { maximumFractionDigits: 2 })}
                  </p>
                  {selectedQuote && (
                    <p className={cn("inline-flex items-center gap-1 text-xs", selectedQuote.changePct >= 0 ? "text-capital-300" : "text-rose-400")}>
                      {selectedQuote.changePct >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {formatPercent(selectedQuote.changePct)}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex overflow-hidden rounded-xl border border-white/10 text-xs">
                {(["dollars", "shares"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={cn("flex-1 py-2 capitalize transition-colors", mode === m ? "bg-capital-400/15 text-capital-200" : "text-white/50 hover:text-white")}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-white focus:border-capital-400/50 focus:outline-none"
                placeholder={mode === "dollars" ? "Amount in $" : "Number of shares"}
              />
              <div className="mt-2 flex justify-between text-xs text-white/45">
                <span>{mode === "dollars" ? `≈ ${orderShares.toFixed(3)} shares` : `≈ ${formatCurrency(orderCost, { maximumFractionDigits: 2 })}`}</span>
                <span>Buying power {formatCurrency(portfolio.cash, { maximumFractionDigits: 0 })}</span>
              </div>

              <Button className="mt-3 w-full" onClick={handleBuy} disabled={orderShares <= 0 || orderCost > portfolio.cash || selectedPrice <= 0}>
                Buy {selected.toUpperCase()} · {formatCurrency(orderCost, { maximumFractionDigits: 0 })}
              </Button>
            </div>

            {flash && (
              <div className={cn("mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs", flash.kind === "ok" ? "bg-capital-400/10 text-capital-200" : "bg-rose-500/10 text-rose-300")}>
                {flash.kind === "err" && <X className="h-3.5 w-3.5" />}
                {flash.msg}
              </div>
            )}
          </Card>

          <Card hover className="border-capital-400/15 bg-capital-400/[0.03]">
            <p className="text-xs font-medium uppercase tracking-wider text-capital-300">Coach tip</p>
            <p className="mt-2 text-sm text-white/70">{rec.text}</p>
            <Link href={`/learn/${rec.lessonId}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-capital-300 hover:underline">
              Learn this <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
