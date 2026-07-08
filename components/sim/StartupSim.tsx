"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ClipboardCheck, LineChart as LineIcon, Rocket, Target, Timer } from "lucide-react";
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { ProgressBar } from "@/components/ui/Progress";
import { StatCard } from "@/components/ui/StatCard";
import { ChoiceChips, CountUp, NumberField, PopReveal, SliderField, SaveProjectButton, TOOLTIP_STYLE } from "@/components/sim/shared";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

/** Preset campus-scale ideas with believable starting numbers. */
const IDEAS = [
  { id: "mealprep", name: "Dorm meal-prep boxes", price: 12, cost: 7, fixed: 400, market: 900 },
  { id: "tutoring", name: "Exam-cram tutoring", price: 30, cost: 18, fixed: 150, market: 500 },
  { id: "laundry", name: "Laundry pickup service", price: 15, cost: 9, fixed: 250, market: 1200 },
  { id: "notes", name: "Study-guide subscriptions", price: 8, cost: 1, fixed: 300, market: 2000 },
  { id: "custom", name: "My own idea", price: 20, cost: 10, fixed: 300, market: 800 },
] as const;

type IdeaId = (typeof IDEAS)[number]["id"];

const CHECKLIST = [
  { id: "talked", label: "Talked to 10+ potential customers about the problem" },
  { id: "presold", label: "Pre-sold or got a waitlist signup before building" },
  { id: "competitors", label: "Listed 3 competitors and why you're different" },
  { id: "costs", label: "Priced out real costs (not guesses) for one unit" },
  { id: "time", label: "Blocked 5+ hrs/week you can actually commit" },
  { id: "legal", label: "Checked campus rules / permits for selling" },
];

export function StartupSim() {
  const [ideaId, setIdeaId] = useState<IdeaId>("mealprep");
  const [name, setName] = useState<string>(IDEAS[0].name);
  const [price, setPrice] = useState<number>(IDEAS[0].price);
  const [cost, setCost] = useState<number>(IDEAS[0].cost);
  const [fixed, setFixed] = useState<number>(IDEAS[0].fixed);
  const [cash, setCash] = useState(1500);
  const [units, setUnits] = useState(60); // expected sales per month
  const [market, setMarket] = useState<number>(IDEAS[0].market);
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  function pickIdea(id: IdeaId) {
    const idea = IDEAS.find((i) => i.id === id)!;
    setIdeaId(id);
    setName(idea.id === "custom" ? "" : idea.name);
    setPrice(idea.price);
    setCost(idea.cost);
    setFixed(idea.fixed);
    setMarket(idea.market);
  }

  const r = useMemo(() => {
    // Unit economics:
    //   unit margin ($)  = price − variable cost per unit
    //   gross margin (%) = unit margin / price
    const unitMargin = price - cost;
    const marginPct = price > 0 ? (unitMargin / price) * 100 : 0;

    // Break-even: fixed monthly costs / unit margin → units you must sell
    // each month before you make a single dollar of profit.
    const breakEven = unitMargin > 0 ? Math.ceil(fixed / unitMargin) : Infinity;

    // Monthly P&L at your expected volume.
    const revenue = units * price;
    const profit = units * unitMargin - fixed;

    // Runway: months of cash left at the current net burn.
    //   burn = fixed − (units × unit margin);  runway = cash / burn
    // If profit ≥ 0 there is no burn, runway is effectively unlimited.
    const runway = profit >= 0 ? Infinity : Math.floor(cash / -profit);

    // What slice of the reachable market break-even requires.
    const shareNeeded = market > 0 && Number.isFinite(breakEven) ? (breakEven / market) * 100 : 0;

    const done = CHECKLIST.filter((c) => checks[c.id]).length;
    return { unitMargin, marginPct, breakEven, revenue, profit, runway, shareNeeded, done };
  }, [price, cost, fixed, units, cash, market, checks]);

  const viable = Number.isFinite(r.breakEven) && r.shareNeeded <= 25;
  const displayName = name.trim() || "Untitled venture";

  // Revenue vs total-cost curves across a sales range, the lines cross at
  // break-even. Pure presentation: reuses the same unit economics as above.
  const beChart = useMemo(() => {
    const be = Number.isFinite(r.breakEven) ? (r.breakEven as number) : 0;
    const maxU = Math.max(20, Math.ceil(Math.max(units * 1.6, be * 1.6)));
    const steps = 24;
    return Array.from({ length: steps + 1 }, (_, k) => {
      const u = Math.round((maxU * k) / steps);
      return { u, revenue: Math.round(u * price), cost: Math.round(fixed + u * cost) };
    });
  }, [units, price, cost, fixed, r.breakEven]);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <motion.div variants={fadeUp}>
        <Card>
          <CardHeader title="The idea" subtitle="Start from a preset or bring your own" icon={<Rocket className="h-4 w-4" />} />
          <ChoiceChips
            className="mb-4"
            value={ideaId}
            onChange={pickIdea}
            options={IDEAS.map((i) => ({ value: i.id, label: i.name }))}
          />
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/40">Venture name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bruin Bites"
              className="w-full rounded-xl border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-capital-400/50 focus:outline-none"
            />
          </label>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <NumberField label="Price / unit" prefix="$" value={price} onChange={setPrice} max={1000} step={1} />
            <NumberField label="Cost / unit" prefix="$" value={cost} onChange={setCost} max={1000} step={1} hint="Ingredients, packaging, gas…" />
            <NumberField label="Fixed costs / mo" prefix="$" value={fixed} onChange={setFixed} max={20000} step={25} hint="Subscriptions, booth fees, ads" />
            <NumberField label="Starting cash" prefix="$" value={cash} onChange={setCash} max={100000} step={100} />
            <NumberField label="Reachable market" value={market} onChange={setMarket} max={100000} step={50} suffix="ppl" hint="Customers you can realistically reach" />
          </div>
          <SliderField
            className="mt-5"
            label="Expected sales per month"
            value={units}
            onChange={setUnits}
            min={0}
            max={Math.max(market, 50)}
            step={5}
            format={(n) => `${n} units`}
          />
          {Number.isFinite(r.breakEven) && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-white/45">
                <span>Progress to break-even</span>
                <span className="font-mono">
                  {units} / {r.breakEven} units
                </span>
              </div>
              <ProgressBar value={r.breakEven > 0 ? (units / r.breakEven) * 100 : 100} />
            </div>
          )}
        </Card>
        </motion.div>

        {/* Break-even chart: revenue vs total cost, crossing at break-even */}
        <motion.div variants={fadeUp}>
        <Card glow className="glass-hi">
          <CardHeader
            title="Where the lines cross"
            subtitle="Revenue vs total cost as sales grow, the gap past the cross is profit"
            icon={<LineIcon className="h-4 w-4" />}
            action={
              Number.isFinite(r.breakEven) ? (
                <Pill tone={units >= r.breakEven ? "capital" : "amber"}>Break-even @ {r.breakEven} units</Pill>
              ) : (
                <Pill tone="rose">No break-even</Pill>
              )
            }
          />
          <div className="h-52 sm:h-60">
            <ResponsiveContainer>
              <AreaChart data={beChart} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
                <defs>
                  <linearGradient id="startupRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#39f5ac" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#39f5ac" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="startupCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb7185" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#fb7185" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="u"
                  type="number"
                  domain={[0, "dataMax"]}
                  tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(u) => `${u}`}
                />
                <YAxis hide domain={[0, "dataMax"]} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  labelFormatter={(u) => `${u} sales/mo`}
                  formatter={(v: number, key: string) => [formatCurrency(v), key === "revenue" ? "Revenue" : "Total cost"]}
                />
                {Number.isFinite(r.breakEven) && r.breakEven <= beChart[beChart.length - 1].u && (
                  <ReferenceLine
                    x={r.breakEven}
                    stroke="rgba(255,255,255,0.35)"
                    strokeDasharray="4 4"
                    label={{ value: "break-even", fill: "rgba(255,255,255,0.45)", fontSize: 10, position: "insideTopRight" }}
                  />
                )}
                <ReferenceLine
                  x={units}
                  stroke="rgba(57,245,172,0.4)"
                  strokeDasharray="2 4"
                  label={{ value: "your plan", fill: "rgba(57,245,172,0.7)", fontSize: 10, position: "insideTopLeft" }}
                />
                <Area type="monotone" dataKey="cost" stroke="#fb7185" strokeWidth={2} fill="url(#startupCost)" animationDuration={900} animationEasing="ease-out" />
                <Area type="monotone" dataKey="revenue" stroke="#39f5ac" strokeWidth={2.5} fill="url(#startupRev)" animationDuration={1100} animationEasing="ease-out" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/5 pt-3 text-[11px] text-white/50">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#39f5ac]" /> Revenue ({formatCurrency(price)}/unit)</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#fb7185]" /> Total cost ({formatCurrency(fixed)} fixed + {formatCurrency(cost)}/unit)</span>
          </div>
        </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
        <Card>
          <CardHeader
            title="Validation checklist"
            subtitle="Cheap proof beats expensive building"
            icon={<ClipboardCheck className="h-4 w-4" />}
            action={<Pill tone={r.done >= 4 ? "capital" : "default"}>{r.done}/{CHECKLIST.length} done</Pill>}
          />
          <div className="space-y-1">
            {CHECKLIST.map((c) => {
              const on = !!checks[c.id];
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChecks((s) => ({ ...s, [c.id]: !s[c.id] }))}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors",
                    on ? "bg-capital-400/10 text-white" : "text-white/60 hover:bg-white/[0.04]",
                  )}
                >
                  {on ? <CheckCircle2 className="h-4 w-4 shrink-0 text-capital-300" /> : <Circle className="h-4 w-4 shrink-0 text-white/25" />}
                  {c.label}
                </button>
              );
            })}
          </div>
        </Card>
        </motion.div>
      </div>

      <div className="space-y-6 lg:col-span-2">
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
          <StatCard label="Unit margin" value={<CountUp value={r.unitMargin} prefix="$" />} sub={`${formatPercent(r.marginPct, 0)} of price`} tone={r.unitMargin > 0 ? "capital" : "rose"} />
          <StatCard
            label="Break-even"
            value={Number.isFinite(r.breakEven) ? <CountUp value={r.breakEven} suffix="/mo" /> : "never"}
            sub={Number.isFinite(r.breakEven) ? `${r.shareNeeded.toFixed(1)}% of your market` : "price must exceed cost"}
            tone={Number.isFinite(r.breakEven) ? "violet" : "rose"}
            icon={<Target className="h-4 w-4" />}
          />
          <StatCard
            label="Monthly profit"
            value={<CountUp value={Math.round(r.profit)} prefix="$" />}
            sub={`on ${formatCurrency(r.revenue)} revenue`}
            tone={r.profit >= 0 ? "capital" : "amber"}
          />
          <StatCard
            label="Runway"
            value={r.runway === Infinity ? "∞" : <CountUp value={r.runway} suffix=" mo" />}
            sub={r.runway === Infinity ? "profitable, no burn" : `burning ${formatCurrency(-r.profit)}/mo`}
            tone={r.runway === Infinity ? "capital" : r.runway >= 6 ? "amber" : "rose"}
            icon={<Timer className="h-4 w-4" />}
          />
        </motion.div>

        <PopReveal revealKey={r.unitMargin <= 0 ? "negative" : viable ? "viable" : "heavy"}>
        <Card glow className={cn("sheen", viable ? "border-capital-400/25 shadow-glow-soft" : "border-amber-400/20")}>
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">Verdict on {displayName}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            {r.unitMargin <= 0 ? (
              <>You lose money on every sale, raise the price or cut unit costs before anything else. No volume fixes a negative margin.</>
            ) : viable ? (
              <>
                Selling <strong className="text-white">{r.breakEven} units/mo</strong> ({r.shareNeeded.toFixed(1)}% of your reachable market) covers your
                costs, that&apos;s a realistic bar for a campus launch. At {units} sales/mo you {r.profit >= 0 ? "already pocket" : "would still burn"}{" "}
                <strong className={r.profit >= 0 ? "text-capital-300" : "text-amber-300"}>{formatCurrency(Math.abs(r.profit))}</strong>/mo
                {r.profit >= 0 ? "." : ` with ${r.runway === Infinity ? "no" : `${r.runway} months of`} runway.`}
              </>
            ) : (
              <>
                Break-even needs <strong className="text-white">{r.shareNeeded.toFixed(0)}%</strong> of your reachable market every month, that&apos;s a
                heavy lift. Improve the margin (price up, cost down), cut fixed costs, or widen who you can reach.
              </>
            )}
          </p>
        </Card>
        </PopReveal>

        <SaveProjectButton
          kind="startup"
          title={`Startup plan, ${displayName}`}
          disabled={price <= 0}
          getSummary={() =>
            `${formatCurrency(price)} price, ${formatPercent(r.marginPct, 0)} margin, break-even ${Number.isFinite(r.breakEven) ? `${r.breakEven} units/mo` : "n/a"}, runway ${r.runway === Infinity ? "∞" : `${r.runway} mo`} · ${r.done}/${CHECKLIST.length} validation steps`
          }
          getData={() => ({
            name: displayName,
            ideaId,
            price,
            cost,
            fixedMonthly: fixed,
            startingCash: cash,
            expectedUnits: units,
            marketSize: market,
            unitMargin: r.unitMargin,
            marginPct: Math.round(r.marginPct),
            breakEvenUnits: Number.isFinite(r.breakEven) ? r.breakEven : null,
            monthlyProfit: Math.round(r.profit),
            runwayMonths: r.runway === Infinity ? null : r.runway,
            checklistDone: CHECKLIST.filter((c) => checks[c.id]).map((c) => c.id),
          })}
        />
      </div>
    </motion.div>
  );
}
