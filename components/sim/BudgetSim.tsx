"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Lightbulb, PieChart as PieIcon, Scale, Sparkles } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { AnimatedRing, CountUp, NumberField, SliderField, SaveProjectButton, TOOLTIP_STYLE } from "@/components/sim/shared";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn, formatCurrency } from "@/lib/utils";

type CatKey = "rent" | "food" | "transport" | "fun" | "savings" | "debt";

const CATS: { key: CatKey; label: string; group: "needs" | "wants" | "future"; color: string }[] = [
  { key: "rent", label: "Rent & utilities", group: "needs", color: "#38bdf8" },
  { key: "food", label: "Food & groceries", group: "needs", color: "#60a5fa" },
  { key: "transport", label: "Transport", group: "needs", color: "#c084fc" },
  { key: "fun", label: "Fun & eating out", group: "wants", color: "#fbbf24" },
  { key: "savings", label: "Savings", group: "future", color: "#39f5ac" },
  { key: "debt", label: "Debt payments", group: "future", color: "#34d399" },
];

const GROUP_LABEL = { needs: "Needs", wants: "Wants", future: "Savings + debt" } as const;

export function BudgetSim() {
  // Realistic student-scale defaults: part-time job + some help ≈ $1,600/mo.
  const [income, setIncome] = useState(1600);
  const [alloc, setAlloc] = useState<Record<CatKey, number>>({
    rent: 700,
    food: 300,
    transport: 80,
    fun: 200,
    savings: 150,
    debt: 50,
  });

  const set = (k: CatKey) => (n: number) => setAlloc((a) => ({ ...a, [k]: n }));

  const r = useMemo(() => {
    const total = CATS.reduce((s, c) => s + alloc[c.key], 0);
    const leftover = income - total;

    // Group totals for the 50/30/20 rule: needs 50%, wants 30%, savings+debt 20%.
    const groups = { needs: 0, wants: 0, future: 0 };
    for (const c of CATS) groups[c.group] += alloc[c.key];
    const pct = (n: number) => (income > 0 ? (n / income) * 100 : 0);
    const needsPct = pct(groups.needs);
    const wantsPct = pct(groups.wants);
    const futurePct = pct(groups.future);

    // 50/30/20 score: start at 100, lose 1.25 pts per percentage-point of
    // deviation from the 50/30/20 targets, plus 1 pt per % of income left
    // unassigned (a budget should give every dollar a job). Clamped 0-100.
    const deviation = Math.abs(needsPct - 50) + Math.abs(wantsPct - 30) + Math.abs(futurePct - 20);
    const unassignedPct = Math.max(0, pct(leftover));
    const score = Math.max(0, Math.min(100, Math.round(100 - deviation * 1.25 - unassignedPct)));

    return { total, leftover, groups, needsPct, wantsPct, futurePct, score, unassignedPct };
  }, [alloc, income]);

  const over = r.leftover < 0;

  // Rule-based tips, ordered by impact.
  const tips = useMemo(() => {
    const t: string[] = [];
    if (over) t.push(`You're ${formatCurrency(-r.leftover)} over budget, trim the biggest category first, not the small stuff.`);
    if (alloc.rent > income * 0.4) t.push("Rent is over 40% of income. A roommate or cheaper place is the single biggest lever a student has.");
    if (r.futurePct < 10 && !over) t.push("Less than 10% is going to savings + debt. Even $50/mo builds the habit, automate it on payday.");
    if (r.wantsPct > 35) t.push("Wants are above 35%. Try a weekly \"fun cap\" instead of cutting it to zero, budgets you hate get abandoned.");
    if (r.leftover > 0) t.push(`${formatCurrency(r.leftover)} has no job yet. Assign it (savings counts!) so it doesn't quietly become DoorDash.`);
    if (t.length === 0) t.push("This is a genuinely balanced budget. Revisit it whenever your income changes, the ratios matter more than the dollars.");
    return t.slice(0, 3);
  }, [alloc.rent, income, over, r.futurePct, r.wantsPct, r.leftover]);

  const chartData = [
    ...CATS.map((c) => ({ name: c.label, value: alloc[c.key], color: c.color })),
    ...(r.leftover > 0 ? [{ name: "Unassigned", value: r.leftover, color: "rgba(255,255,255,0.14)" }] : []),
  ].filter((d) => d.value > 0);

  const scoreTone = r.score >= 80 ? "text-capital-300" : r.score >= 55 ? "text-amber-300" : "text-rose-400";
  const GROUP_COLOR = { needs: "#38bdf8", wants: "#fbbf24", future: "#39f5ac" } as const;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-6 lg:grid-cols-5">
      {/* Left: inputs */}
      <motion.div variants={fadeUp} className="lg:col-span-3">
      <Card className="h-full">
        <CardHeader
          title="Your monthly plan"
          subtitle="Give every dollar a job"
          icon={<Scale className="h-4 w-4" />}
          action={<Pill tone={over ? "rose" : "capital"}>{over ? "Over budget" : `${formatCurrency(Math.max(0, r.leftover))} left`}</Pill>}
        />
        <NumberField label="Monthly income" prefix="$" value={income} onChange={setIncome} max={20000} hint="Part-time job, aid refund, family help, everything that hits your account." className="mb-5 max-w-xs" />
        <div className="space-y-4">
          {CATS.map((c) => (
            <SliderField
              key={c.key}
              label={c.label}
              value={alloc[c.key]}
              onChange={set(c.key)}
              min={0}
              max={Math.max(income, 100)}
              step={10}
              format={(n) => formatCurrency(n)}
            />
          ))}
        </div>
        <div className={cn("mt-5 flex items-center justify-between rounded-2xl px-4 py-3 text-sm", over ? "bg-rose-500/10 text-rose-300" : "bg-white/[0.03] text-white/70")}>
          <span className="flex items-center gap-2">
            {over && <AlertTriangle className="h-4 w-4" />}
            Allocated <CountUp value={r.total} prefix="$" className="font-semibold text-white" /> of {formatCurrency(income)}
          </span>
          <span className={cn("font-semibold", over ? "text-rose-300" : "text-capital-300")}>
            <CountUp value={Math.abs(r.leftover)} prefix={over ? "-$" : "$"} suffix={over ? "" : " free"} />
          </span>
        </div>
      </Card>
      </motion.div>

      {/* Right: score + breakdown + tips */}
      <div className="space-y-6 lg:col-span-2">
        <motion.div variants={fadeUp}>
        <Card glow className="glass-hi">
          <CardHeader title="50/30/20 score" subtitle="Needs 50 · Wants 30 · Future 20" icon={<Sparkles className="h-4 w-4" />} />
          <div className="flex items-center gap-5">
            <AnimatedRing value={r.score} size={104} stroke={9}>
              <span className={cn("font-display text-3xl font-bold text-glow", scoreTone)}>
                <CountUp value={r.score} />
              </span>
            </AnimatedRing>
            <div className="flex-1 space-y-3">
              {(["needs", "wants", "future"] as const).map((g) => {
                const target = g === "needs" ? 50 : g === "wants" ? 30 : 20;
                const actual = g === "needs" ? r.needsPct : g === "wants" ? r.wantsPct : r.futurePct;
                const scaleMax = 70; // bars share one 0-70% scale so widths compare honestly
                return (
                  <div key={g}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/55">{GROUP_LABEL[g]}</span>
                      <span className="font-mono tabular-nums text-white">
                        {actual.toFixed(0)}% <span className="text-white/35">/ {target}%</span>
                      </span>
                    </div>
                    <div className="relative mt-1 h-2 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: GROUP_COLOR[g] }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (actual / scaleMax) * 100)}%` }}
                        transition={{ type: "spring", stiffness: 160, damping: 26 }}
                      />
                      {/* target tick */}
                      <div
                        className="absolute top-0 h-full w-0.5 bg-white/50"
                        style={{ left: `${(target / scaleMax) * 100}%` }}
                        title={`Target ${target}%`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
        <Card hover>
          <CardHeader title="Where it goes" subtitle="Breakdown of your income" icon={<PieIcon className="h-4 w-4" />} />
          {chartData.length > 0 ? (
            <div className="flex items-center gap-4">
              <div className="relative h-40 w-40 shrink-0">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      innerRadius={46}
                      outerRadius={68}
                      paddingAngle={3}
                      cornerRadius={4}
                      stroke="none"
                      animationDuration={700}
                      animationEasing="ease-out"
                    >
                      {chartData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase tracking-wider text-white/35">Income</span>
                  <span className="font-display text-sm font-bold text-white">{formatCurrency(income)}</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {chartData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
                    <span className="truncate text-white/60">{d.name}</span>
                    <span className="ml-auto font-mono tabular-nums text-white/80">{income > 0 ? ((d.value / income) * 100).toFixed(0) : 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/45">Move a slider to see your breakdown.</p>
          )}
        </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
        <Card className="border-capital-400/15 bg-capital-400/[0.03]">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-capital-300">
            <Lightbulb className="h-3.5 w-3.5" /> Coach tips
          </p>
          <ul className="space-y-2 text-sm text-white/70">
            {tips.map((t) => (
              <motion.li
                key={t}
                layout
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-capital-300" />
                {t}
              </motion.li>
            ))}
          </ul>
        </Card>
        </motion.div>

        <SaveProjectButton
          kind="budget"
          title={`Monthly budget, ${formatCurrency(income)}/mo`}
          disabled={income <= 0}
          getSummary={() =>
            `${formatCurrency(income)}/mo split ${r.needsPct.toFixed(0)}/${r.wantsPct.toFixed(0)}/${r.futurePct.toFixed(0)} across needs/wants/future · 50/30/20 score ${r.score}`
          }
          getData={() => ({ income, allocations: alloc, score: r.score, needsPct: r.needsPct, wantsPct: r.wantsPct, futurePct: r.futurePct, leftover: r.leftover })}
        />
      </div>
    </motion.div>
  );
}
