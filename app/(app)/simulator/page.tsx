"use client";

import { useMemo, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Layers,
  PieChart as PieChartIcon,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pill } from "@/components/ui/Pill";
import { StatCard } from "@/components/ui/StatCard";
import { tickerCatalog } from "@/lib/data/portfolio";
import {
  biggestPosition,
  dayChange,
  diversificationScore,
  learningRecommendation,
  portfolioValue,
  riskLabel,
  riskScore,
} from "@/lib/portfolio-utils";
import { useAppState } from "@/lib/store";
import type { AssetType, Holding, RiskLabel } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

// ── Brand palette for the breakdown chart ──────────────────────────────────
const SLICE_COLORS = [
  "#39f5ac", // capital green
  "#7c5cff", // violet
  "#38bdf8", // sky
  "#fbbf24", // amber
  "#fb7185", // rose
  "#a78bfa", // soft violet
  "#34d399", // emerald
  "#f472b6", // pink
];
const CASH_COLOR = "#8b95a7"; // muted gray for cash

const ASSET_TYPES: AssetType[] = ["Stock", "ETF", "Index Fund", "Bond", "Cash"];
const RISK_OPTIONS: RiskLabel[] = ["Low", "Medium", "High"];

// Deterministic mock daily change so adds feel "live" without randomness drift.
const CHANGE_BY_TYPE: Record<AssetType, number> = {
  Stock: 2.1,
  ETF: 0.9,
  "Index Fund": 1.1,
  Bond: 0.2,
  Cash: 0.0,
};

function riskTone(risk: RiskLabel): "low" | "medium" | "high" {
  return risk === "Low" ? "low" : risk === "Medium" ? "medium" : "high";
}

function assetTone(type: AssetType): "capital" | "violet" | "sky" | "amber" | "default" {
  switch (type) {
    case "ETF":
      return "capital";
    case "Index Fund":
      return "sky";
    case "Stock":
      return "violet";
    case "Bond":
      return "amber";
    default:
      return "default";
  }
}

function colorForHolding(h: Holding, index: number): string {
  return h.assetType === "Cash" ? CASH_COLOR : SLICE_COLORS[index % SLICE_COLORS.length];
}

const MANUAL = "__manual__";

export default function SimulatorPage() {
  // The store is the single source of truth — edits persist across refresh.
  const {
    portfolio,
    setPortfolio,
    addHolding: addHoldingToStore,
    removeHolding: removeHoldingFromStore,
    resetPortfolio: resetPortfolioInStore,
  } = useAppState();
  const holdings = portfolio.holdings;

  // Add-investment form state
  const [catalogKey, setCatalogKey] = useState<string>(tickerCatalog[0].ticker);
  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const [assetType, setAssetType] = useState<AssetType>("ETF");
  const [risk, setRisk] = useState<RiskLabel>("Medium");
  const [allocation, setAllocation] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);

  const isManual = catalogKey === MANUAL;

  const value = portfolioValue(portfolio);
  const change = dayChange(portfolio);
  const rScore = riskScore(holdings);
  const rLabel = riskLabel(rScore);
  const divScore = diversificationScore(holdings);
  const biggest = biggestPosition(holdings);
  const totalAllocation = holdings.reduce((s, h) => s + h.allocation, 0);
  const allocationOff = holdings.length > 0 && totalAllocation !== 100;
  const recommendation = learningRecommendation(holdings);

  const isUp = change >= 0;
  const riskToneStat: "capital" | "amber" | "rose" =
    rLabel === "Conservative" ? "capital" : rLabel === "Balanced" ? "amber" : "rose";

  const chartData = useMemo(
    () =>
      holdings.map((h, i) => ({
        name: h.ticker,
        value: h.allocation,
        fill: colorForHolding(h, i),
      })),
    [holdings],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  function onCatalogChange(key: string) {
    setCatalogKey(key);
    setError(null);
    if (key === MANUAL) {
      setTicker("");
      setName("");
      return;
    }
    const entry = tickerCatalog.find((t) => t.ticker === key);
    if (entry) {
      setTicker(entry.ticker);
      setName(entry.name);
      setAssetType(entry.assetType);
      setRisk(entry.risk);
    }
  }

  function addHolding() {
    const finalTicker = (isManual ? ticker : catalogKey).trim().toUpperCase();
    const catalogEntry = tickerCatalog.find((t) => t.ticker === catalogKey);
    const finalName = (isManual ? name.trim() : catalogEntry?.name ?? "") || finalTicker;

    if (!finalTicker) {
      setError("Enter a ticker symbol.");
      return;
    }
    if (!Number.isFinite(allocation) || allocation < 1 || allocation > 100) {
      setError("Allocation must be between 1% and 100%.");
      return;
    }

    const newHolding: Holding = {
      id: `h-${Date.now()}`,
      ticker: finalTicker,
      name: finalName,
      assetType,
      allocation: Math.round(allocation),
      risk,
      changePct: CHANGE_BY_TYPE[assetType],
      lessonId: isManual ? undefined : catalogEntry?.lessonId,
    };

    addHoldingToStore(newHolding);
    setError(null);
    setAllocation(5);
  }

  function removeHolding(id: string) {
    removeHoldingFromStore(id);
  }

  function resetPortfolio() {
    resetPortfolioInStore();
    setError(null);
  }

  // Proportionally rescale every holding so allocations sum to exactly 100%.
  function normalizeAllocations() {
    if (holdings.length === 0 || totalAllocation === 0) return;
    let running = 0;
    const rescaled = holdings.map((h, i) => {
      const exact = (h.allocation / totalAllocation) * 100;
      // Round each slice, then give the last holding the remainder so the
      // displayed integers always add up to exactly 100.
      const alloc =
        i === holdings.length - 1 ? 100 - running : Math.round(exact);
      running += alloc;
      return { ...h, allocation: alloc };
    });
    setPortfolio({ ...portfolio, holdings: rescaled });
    setError(null);
  }

  function addStarterEtf() {
    const starter = tickerCatalog.find((t) => t.ticker === "VTI")!;
    setPortfolio({
      ...portfolio,
      holdings: [
        {
          id: `h-${Date.now()}`,
          ticker: starter.ticker,
          name: starter.name,
          assetType: starter.assetType,
          allocation: 100,
          risk: starter.risk,
          changePct: CHANGE_BY_TYPE[starter.assetType],
          lessonId: starter.lessonId,
        },
      ],
    });
  }

  const isEmpty = holdings.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Simulator"
        subtitle="Build a $10,000 mock portfolio. Zero real money. Make every mistake here — it's free."
        action={
          <Button variant="secondary" size="sm" onClick={resetPortfolio}>
            <RotateCcw className="h-4 w-4" />
            Reset to sample
          </Button>
        }
      />

      <Disclaimer />

      {/* ── Top stat row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Fake balance"
          value={formatCurrency(value)}
          icon={<Sparkles className="h-4 w-4" />}
          tone="capital"
          sub={
            <span
              className={cn(
                "inline-flex items-center gap-1 font-medium",
                isUp ? "text-capital-300" : "text-rose-400",
              )}
            >
              {isUp ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {isUp ? "+" : "-"}
              {formatCurrency(Math.abs(change))} today
            </span>
          }
        />
        <StatCard
          label="Risk score"
          value={
            <span
              className={cn(
                riskToneStat === "capital" && "text-capital-300",
                riskToneStat === "amber" && "text-amber-300",
                riskToneStat === "rose" && "text-rose-400",
              )}
            >
              {rScore}
            </span>
          }
          icon={<ShieldCheck className="h-4 w-4" />}
          tone={riskToneStat}
          sub={rLabel}
        />
        <StatCard
          label="Diversification"
          value={`${divScore}/100`}
          icon={<Layers className="h-4 w-4" />}
          tone="violet"
          sub={
            divScore >= 70
              ? "Well spread out"
              : divScore >= 45
                ? "Could spread more"
                : "Concentrated"
          }
        />
        <StatCard
          label="Biggest position"
          value={biggest ? biggest.ticker : "—"}
          icon={<Trophy className="h-4 w-4" />}
          tone="amber"
          sub={biggest ? `${biggest.allocation}% of portfolio` : "No holdings yet"}
        />
      </div>

      {isEmpty ? (
        <EmptyState
          icon={<PieChartIcon className="h-7 w-7" />}
          title="Your portfolio is empty"
          description="A portfolio is just a collection of investments. Add a broad ETF to get instant diversification in one click, or load the sample to see how it's done."
          action={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="primary" size="sm" onClick={addStarterEtf}>
                <Plus className="h-4 w-4" />
                Add a starter ETF (VTI)
              </Button>
              <Button variant="outline" size="sm" onClick={resetPortfolio}>
                <RotateCcw className="h-4 w-4" />
                Load sample portfolio
              </Button>
            </div>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* ── Breakdown chart ──────────────────────────────────────────── */}
          <Card className="lg:col-span-2">
            <CardHeader
              title="Allocation breakdown"
              subtitle="Where your fake money lives"
              icon={<PieChartIcon className="h-4 w-4" />}
            />
            <div className="relative h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={96}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {chartData.map((slice) => (
                      <Cell key={slice.name} fill={slice.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      background: "rgba(13, 17, 23, 0.92)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 14,
                      color: "#fff",
                      fontSize: 12,
                      backdropFilter: "blur(8px)",
                    }}
                    formatter={(val: number, nm: string) => [`${val}%`, nm]}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                  Total value
                </span>
                <span className="font-display text-xl font-bold tracking-tight text-white">
                  {formatCurrency(value)}
                </span>
                <span className="mt-0.5 text-[11px] text-white/40">
                  {totalAllocation}% allocated
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {holdings.map((h, i) => (
                <div key={h.id} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: colorForHolding(h, i) }}
                  />
                  <span className="truncate font-medium text-white/80">{h.ticker}</span>
                  <span className="ml-auto text-white/40">{h.allocation}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* ── Holdings list ────────────────────────────────────────────── */}
          <Card className="lg:col-span-3">
            <CardHeader
              title="Your holdings"
              subtitle={`${holdings.length} position${holdings.length === 1 ? "" : "s"}`}
              icon={<Layers className="h-4 w-4" />}
            />

            {/* Allocation total readout — turns amber/rose when ≠ 100% */}
            <div
              className={cn(
                "mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-3.5 py-2.5",
                allocationOff
                  ? totalAllocation > 100
                    ? "border-rose-400/25 bg-rose-500/[0.06]"
                    : "border-amber-400/25 bg-amber-500/[0.06]"
                  : "border-capital-400/20 bg-capital-400/[0.05]",
              )}
            >
              <span className="text-xs text-white/55">
                Total allocated:{" "}
                <span
                  className={cn(
                    "font-display text-sm font-semibold",
                    allocationOff
                      ? totalAllocation > 100
                        ? "text-rose-400"
                        : "text-amber-300"
                      : "text-capital-300",
                  )}
                >
                  {totalAllocation}%
                </span>
              </span>
              {allocationOff && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={normalizeAllocations}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Normalize to 100%
                </Button>
              )}
            </div>

            <div className="space-y-2.5">
              {holdings.map((h, i) => {
                const positive = h.changePct >= 0;
                return (
                  <div
                    key={h.id}
                    className="group rounded-2xl border border-white/8 bg-white/[0.02] p-3.5 transition-colors hover:border-white/15"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-9 w-1 shrink-0 rounded-full"
                        style={{ background: colorForHolding(h, i) }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-semibold tracking-tight text-white">
                            {h.ticker}
                          </span>
                          <Pill tone={assetTone(h.assetType)}>{h.assetType}</Pill>
                          <Pill tone={riskTone(h.risk)}>{h.risk} risk</Pill>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-white/45">{h.name}</p>
                      </div>

                      <div className="text-right">
                        <div className="font-display text-sm font-semibold text-white">
                          {h.allocation}%
                        </div>
                        <div
                          className={cn(
                            "text-xs font-medium",
                            positive ? "text-capital-300" : "text-rose-400",
                          )}
                        >
                          {positive ? "+" : ""}
                          {h.changePct.toFixed(1)}%
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeHolding(h.id)}
                        aria-label={`Remove ${h.ticker}`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Allocation bar */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, h.allocation)}%`,
                            background: colorForHolding(h, i),
                          }}
                        />
                      </div>
                      {h.lessonId && (
                        <a
                          href={`/learn/${h.lessonId}`}
                          className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-capital-300/80 transition-colors hover:text-capital-300"
                        >
                          <BookOpen className="h-3 w-3" />
                          Learn: {h.ticker} {h.assetType}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {totalAllocation !== 100 && (
              <p className="mt-3 text-center text-[11px] text-white/35">
                {totalAllocation < 100
                  ? `${100 - totalAllocation}% still in cash — that's fine while you learn.`
                  : `You're ${totalAllocation - 100}% over-allocated — trim a position to stay at 100%.`}
              </p>
            )}
          </Card>
        </div>
      )}

      {/* ── Add investment + learning recommendation ──────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Add investment */}
        <Card className="lg:col-span-3">
          <CardHeader
            title="Add an investment"
            subtitle="Pick from the catalog or enter your own"
            icon={<Plus className="h-4 w-4" />}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Catalog / ticker */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/55">Investment</label>
              <select
                value={catalogKey}
                onChange={(e) => onCatalogChange(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-capital-400/50"
              >
                {tickerCatalog.map((t) => (
                  <option key={t.ticker} value={t.ticker} className="bg-ink-950">
                    {t.ticker} — {t.name}
                  </option>
                ))}
                <option value={MANUAL} className="bg-ink-950">
                  ✏️ Enter manually…
                </option>
              </select>
            </div>

            {/* Allocation */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/55">Allocation %</label>
              <input
                type="number"
                min={1}
                max={100}
                value={allocation}
                onChange={(e) => setAllocation(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-capital-400/50"
              />
            </div>

            {/* Manual ticker + name */}
            {isManual && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/55">Ticker</label>
                  <input
                    type="text"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    placeholder="e.g. MSFT"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-capital-400/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/55">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Software Company"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-capital-400/50"
                  />
                </div>
              </>
            )}

            {/* Asset type */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/55">Asset type</label>
              <select
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as AssetType)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-capital-400/50"
              >
                {ASSET_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-ink-950">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-white/55">Risk level</label>
              <select
                value={risk}
                onChange={(e) => setRisk(e.target.value as RiskLabel)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-capital-400/50"
              >
                {RISK_OPTIONS.map((r) => (
                  <option key={r} value={r} className="bg-ink-950">
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="mt-3 text-xs font-medium text-rose-400">{error}</p>
          )}

          <div className="mt-4 flex items-center justify-end">
            <Button variant="primary" size="sm" onClick={addHolding}>
              <Plus className="h-4 w-4" />
              Add to portfolio
            </Button>
          </div>
        </Card>

        {/* Learning recommendation */}
        <Card glow className="lg:col-span-2 flex flex-col">
          <CardHeader
            title="Coach tip"
            subtitle="Updates as your mix changes"
            icon={<GraduationCap className="h-4 w-4" />}
          />
          <div className="flex flex-1 flex-col">
            <div className="rounded-2xl border border-capital-400/15 bg-capital-400/[0.04] p-4">
              <p className="text-sm leading-relaxed text-white/80">
                {recommendation.text}
              </p>
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                href={`/learn/${recommendation.lessonId}`}
                className="w-full"
              >
                <BookOpen className="h-4 w-4" />
                Open the lesson
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Disclaimer className="mt-2" />
    </div>
  );
}
