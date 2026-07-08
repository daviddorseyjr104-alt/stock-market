"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Area, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DollarSign, LineChart, Tags, Target } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { StatCard } from "@/components/ui/StatCard";
import { CountUp, NumberField, SliderField, SaveProjectButton, TOOLTIP_STYLE } from "@/components/sim/shared";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

export function PricingSim() {
  // Student-scale product: a $6-to-make item, competitor around $18.
  const [cost, setCost] = useState(6);
  const [targetMargin, setTargetMargin] = useState(60); // desired gross margin %
  const [competitor, setCompetitor] = useState(18);
  const [wtp, setWtp] = useState(22); // max willingness-to-pay
  const [baseVolume, setBaseVolume] = useState(120); // units/mo at the competitor price

  const r = useMemo(() => {
    // 1) Cost-plus price to hit the target margin:
    //    price = cost / (1 − margin)   because margin = (price − cost)/price
    const marginFrac = Math.min(0.95, targetMargin / 100);
    const costPlus = cost / (1 - marginFrac);

    // 2) Suggested price = blend of cost-plus and the market ceiling
    //    (competitor & willingness-to-pay), clamped so we never price below
    //    cost or above what people will pay.
    const ceiling = Math.max(cost + 0.5, (competitor + wtp) / 2);
    const suggested = Math.round(Math.min(Math.max(costPlus, cost * 1.1), ceiling) * 100) / 100;

    // 3) Linear demand model anchored on two known points:
    //    at the competitor price → baseVolume, at willingness-to-pay → 0.
    //    slope = baseVolume / (competitor − wtp).  Demand is clamped at 0.
    const span = Math.max(0.5, wtp - competitor);
    const volumeAt = (p: number) => Math.max(0, Math.round(baseVolume * (1 - (p - competitor) / span)));

    const marginPctAt = (p: number) => (p > 0 ? ((p - cost) / p) * 100 : 0);
    const profitAt = (p: number) => volumeAt(p) * (p - cost);

    // Price points to compare: cheaper, competitor, suggested, premium, ceiling.
    const raw = [
      { label: "Budget", price: Math.max(cost + 1, competitor - 4) },
      { label: "Competitor", price: competitor },
      { label: "Suggested", price: suggested },
      { label: "Premium", price: (suggested + wtp) / 2 },
      { label: "Max WTP", price: wtp },
    ];
    // De-dup by rounded price, keep order.
    const seen = new Set<number>();
    const points = raw
      .map((p) => ({ ...p, price: Math.round(p.price * 100) / 100 }))
      .filter((p) => {
        const k = Math.round(p.price * 100);
        if (seen.has(k) || p.price <= cost) return false;
        seen.add(k);
        return true;
      })
      .map((p) => ({
        ...p,
        volume: volumeAt(p.price),
        revenue: Math.round(volumeAt(p.price) * p.price),
        profit: Math.round(profitAt(p.price)),
        marginPct: marginPctAt(p.price),
      }));

    // Profit-maximizing price across the realistic band (cost → wtp).
    let best = suggested;
    let bestProfit = -Infinity;
    for (let p = cost + 0.5; p <= wtp; p += 0.5) {
      const pr = profitAt(p);
      if (pr > bestProfit) {
        bestProfit = pr;
        best = Math.round(p * 100) / 100;
      }
    }

    // Continuous revenue/profit curve over the same band, presentation only,
    // built from the exact demand/profit functions above.
    const curve: { price: number; revenue: number; profit: number }[] = [];
    for (let p = cost + 0.5; p <= wtp + 0.001; p += 0.5) {
      const pp = Math.round(p * 100) / 100;
      curve.push({ price: pp, revenue: Math.round(volumeAt(pp) * pp), profit: Math.round(profitAt(pp)) });
    }

    return {
      curve,
      costPlus: Math.round(costPlus * 100) / 100,
      suggested,
      suggestedMargin: marginPctAt(suggested),
      suggestedVolume: volumeAt(suggested),
      suggestedProfit: Math.round(profitAt(suggested)),
      points,
      best,
      bestProfit: Math.round(Math.max(0, bestProfit)),
    };
  }, [cost, targetMargin, competitor, wtp, baseVolume]);

  const strategyNote =
    r.suggested < competitor
      ? "You're undercutting the competitor, a penetration play. Great for grabbing share fast, but leaves margin on the table if buyers would pay more."
      : r.suggested > competitor
        ? "You're priced above the competitor, that only works if buyers see you as clearly better (quality, convenience, brand). Justify the premium or you'll lose volume."
        : "You're matching the market. Safe, but you're competing on everything except price, make sure something else makes you the obvious pick.";

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-6 lg:grid-cols-5">
      <motion.div variants={fadeUp} className="lg:col-span-2">
      <Card className="h-full">
        <CardHeader title="Your product" subtitle="Cost, market and demand" icon={<Tags className="h-4 w-4" />} />
        <div className="space-y-4">
          <NumberField label="Cost to make (per unit)" prefix="$" value={cost} onChange={setCost} max={5000} step={0.5} />
          <SliderField label="Target gross margin" value={targetMargin} onChange={setTargetMargin} min={10} max={90} step={5} format={(n) => `${n}%`} hint="Retail goods often aim for 50-70%." />
          <NumberField label="Competitor price" prefix="$" value={competitor} onChange={setCompetitor} max={5000} step={0.5} />
          <NumberField label="Willingness to pay (max)" prefix="$" value={wtp} onChange={setWtp} max={5000} step={0.5} hint="The most a typical buyer would pay." />
          <SliderField label="Sales/mo at competitor price" value={baseVolume} onChange={setBaseVolume} min={0} max={1000} step={10} format={(n) => `${n} units`} />
        </div>
      </Card>
      </motion.div>

      <div className="space-y-6 lg:col-span-3">
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Suggested price" value={<CountUp value={r.suggested} prefix="$" decimals={2} />} sub={`${formatPercent(r.suggestedMargin, 0)} margin`} icon={<DollarSign className="h-4 w-4" />} />
          <StatCard label="Cost-plus price" value={<CountUp value={r.costPlus} prefix="$" decimals={2} />} sub={`hits ${targetMargin}% target`} tone="violet" />
          <StatCard label="Est. volume" value={<CountUp value={r.suggestedVolume} suffix="/mo" />} sub="at suggested price" tone="amber" />
          <StatCard label="Profit-max price" value={<CountUp value={r.best} prefix="$" decimals={2} className="text-glow" />} sub={`${formatCurrency(r.bestProfit)}/mo profit`} tone="capital" icon={<Target className="h-4 w-4" />} />
        </motion.div>

        <motion.div variants={fadeUp}>
        <Card glow className="glass-hi">
          <CardHeader
            title="The revenue curve"
            subtitle="Higher price, fewer sales, the sweet spot is where profit peaks"
            icon={<LineChart className="h-4 w-4" />}
            action={<Pill tone="capital">Peak profit @ {formatCurrency(r.best)}</Pill>}
          />
          {r.curve.length >= 2 ? (
            <div className="h-56 sm:h-64">
              <ResponsiveContainer>
                <ComposedChart data={r.curve} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
                  <defs>
                    <linearGradient id="priceRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c5cff" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#7c5cff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="price"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(p) => `$${p}`}
                  />
                  <YAxis hide domain={["auto", "dataMax"]} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    labelFormatter={(p) => `Price ${formatCurrency(Number(p))}`}
                    formatter={(v: number, key: string) => [formatCurrency(v), key === "revenue" ? "Revenue/mo" : "Profit/mo"]}
                  />
                  <ReferenceLine
                    x={r.best}
                    stroke="rgba(57,245,172,0.5)"
                    strokeDasharray="4 4"
                    label={{ value: "profit peak", fill: "rgba(57,245,172,0.75)", fontSize: 10, position: "insideTopRight" }}
                  />
                  <ReferenceLine
                    x={competitor}
                    stroke="rgba(255,255,255,0.25)"
                    strokeDasharray="2 4"
                    label={{ value: "competitor", fill: "rgba(255,255,255,0.4)", fontSize: 10, position: "insideTopLeft" }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#7c5cff" strokeWidth={2} fill="url(#priceRev)" animationDuration={900} animationEasing="ease-out" />
                  <Line type="monotone" dataKey="profit" stroke="#39f5ac" strokeWidth={2.5} dot={false} animationDuration={1100} animationEasing="ease-out" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-white/45">
              Set willingness-to-pay above your unit cost to draw the curve.
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/5 pt-3 text-[11px] text-white/50">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#7c5cff]" /> Revenue/mo</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#39f5ac]" /> Profit/mo</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-3">
            {r.points.map((p) => (
              <div key={p.label} className="flex justify-between gap-2">
                <span className="text-white/50">{p.label}</span>
                <span className="font-mono tabular-nums text-white/80">
                  {formatCurrency(p.price)} → {formatCurrency(p.profit)}
                </span>
              </div>
            ))}
          </div>
        </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
        <Card className={cn("border-capital-400/15 bg-capital-400/[0.03]")}>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-capital-300">Pricing strategy</p>
          <p className="text-sm text-white/70">{strategyNote}</p>
        </Card>
        </motion.div>

        <SaveProjectButton
          kind="pricing"
          title={`Pricing, ${formatCurrency(r.suggested)} @ ${formatPercent(r.suggestedMargin, 0)}`}
          disabled={cost <= 0}
          getSummary={() => `Suggested ${formatCurrency(r.suggested)} (${formatPercent(r.suggestedMargin, 0)} margin) · profit-max at ${formatCurrency(r.best)} = ${formatCurrency(r.bestProfit)}/mo`}
          getData={() => ({
            cost,
            targetMargin,
            competitor,
            willingnessToPay: wtp,
            baseVolume,
            suggestedPrice: r.suggested,
            suggestedMarginPct: Math.round(r.suggestedMargin),
            profitMaxPrice: r.best,
            profitMaxMonthly: r.bestProfit,
            pricePoints: r.points,
          })}
        />
      </div>
    </motion.div>
  );
}
