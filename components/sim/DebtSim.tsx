"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CreditCard, Flame, TrendingDown } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { CountUp, NumberField, SliderField, SaveProjectButton, TOOLTIP_STYLE } from "@/components/sim/shared";
import { fadeUp, staggerContainer, springSoft } from "@/lib/motion";
import { cn, formatCurrency } from "@/lib/utils";

const MAX_MONTHS = 600; // 50 years, beyond this we call it "never"

interface PayoffResult {
  months: number; // MAX_MONTHS+1 => never pays off
  totalInterest: number;
  totalPaid: number;
  series: number[]; // balance at the END of each month (index 0 = month 1)
}

/**
 * Amortize a single revolving balance month by month:
 *   interest_m = balance × (APR / 12)
 *   balance    = balance + interest_m − payment_m
 * `payment` receives the current balance so "minimum payment" plans
 * (which shrink as the balance shrinks) can be modeled.
 */
function simulate(balance0: number, aprPct: number, payment: (bal: number, interest: number) => number): PayoffResult {
  const monthlyRate = aprPct / 100 / 12;
  let bal = balance0;
  let totalInterest = 0;
  let totalPaid = 0;
  const series: number[] = [];
  for (let m = 1; m <= MAX_MONTHS; m++) {
    const interest = bal * monthlyRate;
    totalInterest += interest;
    const pay = Math.min(payment(bal, interest), bal + interest);
    totalPaid += pay;
    bal = bal + interest - pay;
    series.push(Math.max(0, Math.round(bal * 100) / 100));
    if (bal <= 0.005) return { months: m, totalInterest, totalPaid, series };
  }
  return { months: MAX_MONTHS + 1, totalInterest, totalPaid, series };
}

/** Typical card minimum: interest + 1% of the balance, floored at $25. */
function minimumPayment(bal: number, interest: number): number {
  return Math.max(25, interest + bal * 0.01);
}

function fmtMonths(m: number): string {
  if (m > MAX_MONTHS) return "never";
  if (m < 12) return `${m} mo`;
  const y = Math.floor(m / 12);
  const rem = m % 12;
  return rem === 0 ? `${y} yr` : `${y}y ${rem}m`;
}

export function DebtSim() {
  // Realistic student card debt: ~$2,400 at a typical 24.99% APR.
  const [balance, setBalance] = useState(2400);
  const [apr, setApr] = useState(24.99);
  const [payment, setPayment] = useState(90);
  const [extra, setExtra] = useState(50); // aggressive plan adds this on top

  const r = useMemo(() => {
    const minPlan = simulate(balance, apr, minimumPayment);
    const yourPlan = simulate(balance, apr, () => payment);
    const aggPlan = simulate(balance, apr, () => payment + extra);

    // First-month interest, if your payment doesn't beat this, the balance GROWS.
    const firstInterest = balance * (apr / 100 / 12);
    const growing = payment <= firstInterest;
    // "Minimum trap": your payment is within a few dollars of the typical minimum.
    const nearMinimum = !growing && payment <= minimumPayment(balance, firstInterest) + 5;

    // Merge the three curves for the chart (monthly points, trimmed to the
    // slowest finishing plan, capped for readability).
    const len = Math.min(Math.max(minPlan.series.length, yourPlan.series.length, aggPlan.series.length), MAX_MONTHS);
    const stride = len > 240 ? Math.ceil(len / 240) : 1;
    const chart: { m: number; min: number | null; yours: number | null; agg: number | null }[] = [];
    chart.push({ m: 0, min: balance, yours: balance, agg: balance });
    for (let i = 0; i < len; i += stride) {
      chart.push({
        m: i + 1,
        min: i < minPlan.series.length ? minPlan.series[i] : null,
        yours: i < yourPlan.series.length ? yourPlan.series[i] : null,
        agg: i < aggPlan.series.length ? aggPlan.series[i] : null,
      });
    }
    return { minPlan, yourPlan, aggPlan, firstInterest, growing, nearMinimum, chart };
  }, [balance, apr, payment, extra]);

  const interestSaved = r.minPlan.totalInterest - r.aggPlan.totalInterest;

  const plans = [
    { key: "min", label: "Minimum only", res: r.minPlan, color: "#fb7185", desc: "interest + 1% of balance (min $25)" },
    { key: "yours", label: "Your plan", res: r.yourPlan, color: "#fbbf24", desc: `${formatCurrency(payment)}/mo fixed` },
    { key: "agg", label: "Aggressive (avalanche)", res: r.aggPlan, color: "#39f5ac", desc: `${formatCurrency(payment + extra)}/mo fixed` },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        <motion.div variants={fadeUp} className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader title="Your card" subtitle="Enter what you owe" icon={<CreditCard className="h-4 w-4" />} />
          <div className="space-y-4">
            <NumberField label="Balance" prefix="$" value={balance} onChange={setBalance} max={50000} step={100} />
            <NumberField label="APR" suffix="%" value={apr} onChange={setApr} max={40} step={0.01} hint="Typical student card APR is 20-28%." />
            <NumberField label="Your monthly payment" prefix="$" value={payment} onChange={setPayment} max={5000} step={5} />
            <SliderField
              label="Aggressive plan: extra per month"
              value={extra}
              onChange={setExtra}
              min={10}
              max={300}
              step={10}
              format={(n) => `+${formatCurrency(n)}`}
              hint="One less takeout order a week ≈ $50/mo."
            />
          </div>

          {r.growing ? (
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Your payment doesn&apos;t even cover the {formatCurrency(r.firstInterest, { maximumFractionDigits: 2 })} of monthly interest, this
                balance <strong>grows forever</strong>. Raise the payment above the interest line.
              </span>
            </div>
          ) : r.nearMinimum ? (
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                You&apos;re basically paying the minimum. That&apos;s the trap card issuers design for: {fmtMonths(r.minPlan.months)} of payments and{" "}
                {formatCurrency(r.minPlan.totalInterest)} in interest on a {formatCurrency(balance)} balance.
              </span>
            </div>
          ) : null}
        </Card>
        </motion.div>

        <div className="space-y-6 lg:col-span-3">
          <motion.div variants={fadeUp} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {plans.map((p) => (
              <Card key={p.key} hover className={cn("p-4", p.key === "agg" && "border-capital-400/25 shadow-glow-soft")}>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color, boxShadow: `0 0 10px ${p.color}66` }} />
                  <p className="text-xs font-medium uppercase tracking-wider text-white/40">{p.label}</p>
                </div>
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={fmtMonths(p.res.months)}
                    initial={{ opacity: 0, y: 10, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={springSoft}
                    className="mt-2 font-display text-2xl font-bold text-white"
                  >
                    {fmtMonths(p.res.months)}
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs text-white/45">
                  {p.res.months > MAX_MONTHS ? (
                    "balance never hits zero"
                  ) : (
                    <>
                      <CountUp value={Math.round(p.res.totalInterest)} prefix="$" /> interest
                    </>
                  )}
                </p>
                <p className="mt-1 text-[11px] text-white/30">{p.desc}</p>
              </Card>
            ))}
          </motion.div>

          <motion.div variants={fadeUp}>
          <Card glow className="glass-hi">
            <CardHeader
              title="Payoff curves"
              subtitle="Balance remaining, month by month"
              icon={<TrendingDown className="h-4 w-4" />}
              action={interestSaved > 0 ? <Pill tone="capital">Save {formatCurrency(interestSaved)} vs minimum</Pill> : undefined}
            />
            <div className="h-56 sm:h-64">
              <ResponsiveContainer>
                <LineChart data={r.chart} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                  <XAxis
                    dataKey="m"
                    tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(m) => (m >= 12 ? `${Math.round(m / 12)}y` : `${m}m`)}
                  />
                  <YAxis hide domain={[0, "dataMax"]} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    labelFormatter={(m) => `Month ${m}`}
                    formatter={(v: number, name: string) => [
                      formatCurrency(v),
                      name === "min" ? "Minimum only" : name === "yours" ? "Your plan" : "Aggressive",
                    ]}
                  />
                  <Line type="monotone" dataKey="min" stroke="#fb7185" strokeWidth={2} dot={false} animationDuration={900} animationEasing="ease-out" connectNulls={false} />
                  <Line type="monotone" dataKey="yours" stroke="#fbbf24" strokeWidth={2} dot={false} animationDuration={1050} animationEasing="ease-out" connectNulls={false} />
                  <Line type="monotone" dataKey="agg" stroke="#39f5ac" strokeWidth={2.5} dot={false} animationDuration={1200} animationEasing="ease-out" connectNulls={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/5 pt-3">
              {plans.map((p) => (
                <span key={p.key} className="flex items-center gap-1.5 text-[11px] text-white/50">
                  <span className="h-2 w-2 rounded-full" style={{ background: p.color }} /> {p.label}
                </span>
              ))}
            </div>
          </Card>
          </motion.div>

          <motion.div variants={fadeUp}>
          <Card className="border-capital-400/15 bg-capital-400/[0.03]">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-capital-300">
              <Flame className="h-3.5 w-3.5" /> Avalanche vs snowball
            </p>
            <p className="text-sm text-white/70">
              With several debts, <strong className="text-white">avalanche</strong> = pay minimums on everything and throw every extra dollar at the
              highest-APR debt first, it&apos;s the mathematically cheapest path, and at {apr.toFixed(2)}% APR this card is almost certainly where your
              extra {formatCurrency(extra)} belongs. <strong className="text-white">Snowball</strong> = smallest balance first for quick wins and
              motivation. Either beats the minimum by years.
            </p>
          </Card>
          </motion.div>

          <SaveProjectButton
            kind="debt"
            title={`Debt payoff plan, ${formatCurrency(balance)} @ ${apr.toFixed(2)}%`}
            disabled={balance <= 0}
            getSummary={() =>
              r.growing
                ? `${formatCurrency(payment)}/mo can't beat the interest, plan needs a bigger payment`
                : `${formatCurrency(payment + extra)}/mo clears it in ${fmtMonths(r.aggPlan.months)} and saves ${formatCurrency(Math.max(0, interestSaved))} vs minimums`
            }
            getData={() => ({
              balance,
              apr,
              payment,
              extra,
              plans: {
                minimum: { months: r.minPlan.months, totalInterest: Math.round(r.minPlan.totalInterest) },
                yours: { months: r.yourPlan.months, totalInterest: Math.round(r.yourPlan.totalInterest) },
                aggressive: { months: r.aggPlan.months, totalInterest: Math.round(r.aggPlan.totalInterest) },
              },
              interestSavedVsMinimum: Math.round(interestSaved),
            })}
          />
        </div>
      </div>
    </motion.div>
  );
}
