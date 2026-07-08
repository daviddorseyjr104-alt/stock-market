"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Gauge, LineChart as LineIcon, PiggyBank, Shuffle } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { StatCard } from "@/components/ui/StatCard";
import { ChoiceChips, CountUp, NumberField, SliderField, SaveProjectButton, TOOLTIP_STYLE } from "@/components/sim/shared";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn, formatCurrency } from "@/lib/utils";

type Asset = "stocks" | "bonds" | "cash" | "crypto";

/**
 * Long-run planning assumptions (annual, nominal). These are the standard
 * educational figures, NOT predictions: US stocks ~7%/yr, bonds ~3.5%,
 * cash/HYSA ~2%, crypto is pure speculation, we use 12% expected with
 * enormous volatility so risk (not return) is what stands out.
 */
const ASSETS: { key: Asset; label: string; ret: number; vol: number; color: string }[] = [
  { key: "stocks", label: "Stocks (index funds)", ret: 0.07, vol: 15, color: "#39f5ac" },
  { key: "bonds", label: "Bonds", ret: 0.035, vol: 5, color: "#38bdf8" },
  { key: "cash", label: "Cash / HYSA", ret: 0.02, vol: 1, color: "#fbbf24" },
  { key: "crypto", label: "Crypto", ret: 0.12, vol: 70, color: "#c084fc" },
];

type ProfileKey = "cautious" | "balanced" | "aggressive";
const PRESETS: Record<ProfileKey, { label: string; mix: Record<Asset, number> }> = {
  cautious: { label: "Cautious", mix: { stocks: 30, bonds: 45, cash: 25, crypto: 0 } },
  balanced: { label: "Balanced", mix: { stocks: 60, bonds: 25, cash: 10, crypto: 5 } },
  aggressive: { label: "Aggressive", mix: { stocks: 75, bonds: 5, cash: 5, crypto: 15 } },
};

export function StrategySim() {
  const [profile, setProfile] = useState<ProfileKey>("balanced");
  const [mix, setMix] = useState<Record<Asset, number>>(PRESETS.balanced.mix);
  const [monthly, setMonthly] = useState(100); // student-scale contribution
  const [starting, setStarting] = useState(500);

  function pickPreset(p: ProfileKey) {
    setProfile(p);
    setMix(PRESETS[p].mix);
  }

  const r = useMemo(() => {
    // Sliders are free 0-100; weights are each value / total (always sums to 1).
    const total = ASSETS.reduce((s, a) => s + mix[a.key], 0) || 1;
    const w = (k: Asset) => mix[k] / total;

    // Portfolio expected return = weighted average of asset returns.
    const annualRet = ASSETS.reduce((s, a) => s + w(a.key) * a.ret, 0);
    // Risk score: weighted volatility mapped to 0-100 (all-cash ≈ 1, all-crypto = 100).
    const vol = ASSETS.reduce((s, a) => s + w(a.key) * a.vol, 0);
    const riskScore = Math.round(Math.min(100, (vol / 70) * 100));

    // Future value with monthly compounding, i = annual/12:
    //   FV(n) = P0·(1+i)^n  +  C·[((1+i)^n − 1) / i]   (ordinary annuity)
    const i = annualRet / 12;
    const fv = (years: number) => {
      const n = years * 12;
      const growth = Math.pow(1 + i, n);
      const annuity = i > 0 ? (growth - 1) / i : n;
      return starting * growth + monthly * annuity;
    };

    // Yearly series for the chart: projected value vs. what you actually put in.
    const series = Array.from({ length: 31 }, (_, y) => ({
      year: y,
      value: Math.round(fv(y)),
      contributed: Math.round(starting + monthly * 12 * y),
    }));

    return { weights: Object.fromEntries(ASSETS.map((a) => [a.key, w(a.key)])) as Record<Asset, number>, annualRet, riskScore, fv, series };
  }, [mix, monthly, starting]);

  const riskTone = r.riskScore >= 60 ? "rose" : r.riskScore >= 30 ? "amber" : "capital";
  const riskWord = r.riskScore >= 60 ? "High" : r.riskScore >= 30 ? "Moderate" : "Low";

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        <motion.div variants={fadeUp} className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader title="Your mix" subtitle="Sliders auto-balance to 100%" icon={<Shuffle className="h-4 w-4" />} />
          <ChoiceChips
            className="mb-5"
            value={profile}
            onChange={pickPreset}
            options={(Object.keys(PRESETS) as ProfileKey[]).map((p) => ({ value: p, label: PRESETS[p].label }))}
          />
          {/* Live allocation bar, one glance at the whole mix */}
          <div className="mb-5">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/8">
              {ASSETS.map((a) => (
                <motion.div
                  key={a.key}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{ background: a.color, marginRight: r.weights[a.key] > 0 ? 2 : 0 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${r.weights[a.key] * 100}%` }}
                  transition={{ type: "spring", stiffness: 170, damping: 26 }}
                />
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {ASSETS.map((a) => (
                <span key={a.key} className="flex items-center gap-1.5 text-[11px] text-white/50">
                  <span className="h-2 w-2 rounded-full" style={{ background: a.color }} />
                  {a.label.split(" ")[0]} <span className="font-mono tabular-nums text-white/70">{Math.round(r.weights[a.key] * 100)}%</span>
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {ASSETS.map((a) => (
              <SliderField
                key={a.key}
                label={a.label}
                value={mix[a.key]}
                onChange={(n) => setMix((m) => ({ ...m, [a.key]: n }))}
                min={0}
                max={100}
                step={5}
                format={() => `${Math.round(r.weights[a.key] * 100)}%`}
              />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <NumberField label="Starting amount" prefix="$" value={starting} onChange={setStarting} max={100000} step={100} />
            <NumberField label="Monthly invest" prefix="$" value={monthly} onChange={setMonthly} max={5000} step={25} />
          </div>
        </Card>
        </motion.div>

        <div className="space-y-6 lg:col-span-3">
          <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Expected return" value={<CountUp value={r.annualRet * 100} decimals={1} suffix="%" />} sub="per year, long-run" icon={<LineIcon className="h-4 w-4" />} />
            <StatCard label="Risk score" value={<CountUp value={r.riskScore} suffix="/100" />} sub={`${riskWord} volatility`} tone={riskTone as "capital" | "amber" | "rose"} icon={<Gauge className="h-4 w-4" />} />
            <StatCard label="In 10 years" value={<CountUp value={Math.round(r.fv(10))} prefix="$" />} sub={`put in ${formatCurrency(starting + monthly * 120)}`} tone="violet" />
            <StatCard label="In 30 years" value={<CountUp value={Math.round(r.fv(30))} prefix="$" className="text-glow" />} sub={`put in ${formatCurrency(starting + monthly * 360)}`} tone="capital" icon={<PiggyBank className="h-4 w-4" />} />
          </motion.div>

          <motion.div variants={fadeUp}>
          <Card glow className="glass-hi">
            <CardHeader
              title="30 years of compounding"
              subtitle={`${formatCurrency(monthly)}/mo at ${(r.annualRet * 100).toFixed(1)}%, the gap between the lines is growth`}
              icon={<LineIcon className="h-4 w-4" />}
              action={<Pill tone={riskTone as "capital" | "amber" | "rose"}>{riskWord} risk</Pill>}
            />
            <div className="h-56 sm:h-64">
              <ResponsiveContainer>
                <AreaChart data={r.series} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                  <defs>
                    <linearGradient id="stratVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#39f5ac" stopOpacity={0.38} />
                      <stop offset="55%" stopColor="#7c5cff" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#7c5cff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(y) => `${y}y`} />
                  <YAxis hide domain={[0, "dataMax"]} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    labelFormatter={(y) => `Year ${y}`}
                    formatter={(v: number, name: string) => [formatCurrency(v), name === "value" ? "Projected value" : "You put in"]}
                  />
                  <Area type="monotone" dataKey="contributed" stroke="rgba(255,255,255,0.35)" strokeDasharray="4 4" strokeWidth={1.5} fill="none" animationDuration={900} animationEasing="ease-out" />
                  <Area type="monotone" dataKey="value" stroke="#39f5ac" strokeWidth={2.5} fill="url(#stratVal)" animationDuration={1100} animationEasing="ease-out" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className={cn("mt-3 rounded-2xl px-4 py-3 text-sm", "bg-white/[0.03] text-white/60")}>
              By year 20 your money earns roughly{" "}
              <span className="font-semibold text-capital-300">{formatCurrency(Math.max(0, r.fv(20) - r.fv(19) - monthly * 12))}</span>{" "}
              on its own, {r.fv(20) - r.fv(19) - monthly * 12 > monthly * 12 ? "more than you contribute" : "close to what you contribute"}. That&apos;s
              compounding doing the heavy lifting, and it&apos;s why starting in college matters more than starting rich.
            </p>
          </Card>
          </motion.div>

          <SaveProjectButton
            kind="strategy"
            title={`${PRESETS[profile].label} strategy, ${formatCurrency(monthly)}/mo`}
            getSummary={() =>
              `${Math.round(r.weights.stocks * 100)}% stocks / ${Math.round(r.weights.bonds * 100)}% bonds / ${Math.round(r.weights.cash * 100)}% cash / ${Math.round(r.weights.crypto * 100)}% crypto · ~${(r.annualRet * 100).toFixed(1)}%/yr · ${formatCurrency(r.fv(30))} in 30y`
            }
            getData={() => ({
              profile,
              allocationPct: Object.fromEntries(ASSETS.map((a) => [a.key, Math.round(r.weights[a.key] * 100)])),
              monthly,
              starting,
              expectedAnnualReturn: r.annualRet,
              riskScore: r.riskScore,
              projected: { y10: Math.round(r.fv(10)), y20: Math.round(r.fv(20)), y30: Math.round(r.fv(30)) },
            })}
          />
        </div>
      </div>
    </motion.div>
  );
}
