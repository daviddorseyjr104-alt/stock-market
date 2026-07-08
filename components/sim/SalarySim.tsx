"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Handshake, MessageSquareQuote, RotateCcw, TrendingUp } from "lucide-react";
import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { StatCard } from "@/components/ui/StatCard";
import { CountUp, NumberField, PopReveal, SaveProjectButton, TOOLTIP_STYLE } from "@/components/sim/shared";
import { fadeUp, staggerContainer, springSoft } from "@/lib/motion";
import { cn, formatCurrency } from "@/lib/utils";

interface Choice {
  label: string;
  /** fraction of the remaining gap to market you capture (0-1), can be negative */
  effect: number;
  note: string;
  script?: string;
}
interface Step {
  id: string;
  recruiterLine: string;
  choices: Choice[];
}

// A 3-round scenario. Each choice moves the offer a fraction of the way toward
// (or away from) the market rate. Effects are applied to the CURRENT gap.
const STEPS: Step[] = [
  {
    id: "opener",
    recruiterLine: "\"We're excited to offer you the role. The starting salary is on the offer letter, how does it look?\"",
    choices: [
      { label: "\"I'm thrilled, I accept!\"", effect: 0, note: "Accepting on the spot leaves every dollar of the gap on the table. Recruiters expect a counter.", script: "Thanks so much, I'm excited. Can I take a day to review the full package?" },
      { label: "Express excitement, then ask for time", effect: 0.15, note: "Good. Enthusiasm + a pause signals you're serious but thoughtful. It also buys room to research.", script: "I'm really excited about this. Could I have 2-3 days to review everything before I respond?" },
      { label: "\"That's below what I expected.\"", effect: 0.05, note: "Honest, but leading with a complaint and no number puts the recruiter on the defensive.", script: "I appreciate the offer. Based on my research, it's a bit below what I'd expected for this role." },
    ],
  },
  {
    id: "counter",
    recruiterLine: "\"Sure, take your time. Did you have a specific number in mind?\"",
    choices: [
      { label: "Anchor at market rate, backed by research", effect: 0.6, note: "Strong. A specific, researched number anchors the negotiation near market, the single highest-leverage move.", script: "Based on market data for this role and my experience, I was targeting around {market}. Is there flexibility to get there?" },
      { label: "Ask them to 'do their best'", effect: 0.2, note: "Passive. Without a number, you let them anchor low. Always name a figure.", script: "Whatever you think is fair, I'd just love for you to do your best." },
      { label: "Anchor 20% ABOVE market", effect: 0.45, note: "Aiming high can work, but overreaching without justification risks credibility. Anchor high but defensible.", script: "I was hoping for something closer to {stretch}, given the scope of the role." },
    ],
  },
  {
    id: "close",
    recruiterLine: "\"That's above our band, but I have some room. Can we meet partway?\"",
    choices: [
      { label: "Accept the midpoint gracefully", effect: 0.5, note: "Solid close. Meeting in the middle from a strong anchor still captures most of the gap.", script: "That works for me, I appreciate you advocating for it. Let's move forward." },
      { label: "Hold, and ask for a signing bonus too", effect: 0.7, note: "Skilled. Trading a small hold for a one-time bonus often unlocks money outside the salary band.", script: "I understand the band. Could we bridge the rest with a signing bonus? That helps us both." },
      { label: "Refuse to budge from your number", effect: 0.25, note: "Rigid. Digging in after they've shown flexibility can stall or sour the deal.", script: "I really can't go lower than my number." },
    ],
  },
];

export function SalarySim() {
  const [offer, setOffer] = useState(58000); // typical new-grad offer
  const [market, setMarket] = useState(70000);
  const [col, setCol] = useState(100); // cost-of-living index, 100 = national avg

  const [picks, setPicks] = useState<(number | null)[]>([null, null, null]);
  const step = picks.findIndex((p) => p === null);
  const activeStep = step === -1 ? STEPS.length : step;

  const r = useMemo(() => {
    const gap = Math.max(0, market - offer);
    // Walk each answered step: each captures `effect` of the CURRENT remaining gap.
    let current = offer;
    let remaining = gap;
    const trajectory: { round: string; value: number }[] = [{ round: "Offer", value: offer }];
    for (let i = 0; i < STEPS.length; i++) {
      const p = picks[i];
      if (p === null) break;
      const eff = STEPS[i].choices[p].effect;
      const delta = remaining * eff;
      current += delta;
      remaining = Math.max(0, market - current); // recompute gap toward market
      trajectory.push({ round: `Round ${i + 1}`, value: Math.round(current) });
    }
    const finalOffer = Math.round(current / 500) * 500; // round to nearest $500
    const gained = finalOffer - offer;
    const pctToMarket = gap > 0 ? Math.min(100, ((finalOffer - offer) / gap) * 100) : 100;

    // Real cost-of-living adjustment: nominal / (COL index / 100).
    const adjusted = Math.round(finalOffer / (col / 100));

    // Expected value of negotiating: studies find ~$5k average lift; here we
    // report the concrete gained amount over a naive accept.
    return { gap, finalOffer, gained, pctToMarket, adjusted, trajectory };
  }, [offer, market, col, picks]);

  const done = activeStep >= STEPS.length;

  function choose(choiceIdx: number) {
    setPicks((p) => {
      const next = [...p];
      next[activeStep] = choiceIdx;
      return next;
    });
  }
  function reset() {
    setPicks([null, null, null]);
  }

  function fillScript(s: string) {
    return s.replace("{market}", formatCurrency(market)).replace("{stretch}", formatCurrency(Math.round((market * 1.2) / 500) * 500));
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <motion.div variants={fadeUp}>
        <Card>
          <CardHeader title="The offer" subtitle="Set the stage" icon={<Handshake className="h-4 w-4" />} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <NumberField label="Their offer" prefix="$" value={offer} onChange={setOffer} max={1000000} step={1000} />
            <NumberField label="Market rate" prefix="$" value={market} onChange={setMarket} max={1000000} step={1000} hint="Check Levels.fyi / Glassdoor." />
            <NumberField label="Cost-of-living index" value={col} onChange={setCol} min={50} max={200} step={1} hint="100 = US avg; NYC ≈ 155." />
          </div>
          {r.gap === 0 && <p className="mt-3 text-xs text-amber-300">Offer already meets or beats market, set a market rate above the offer to practice negotiating.</p>}
        </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
        <Card glow className="glass-hi">
          <CardHeader
            title="The conversation"
            subtitle={done ? "Negotiation complete" : `Round ${activeStep + 1} of ${STEPS.length}`}
            icon={<MessageSquareQuote className="h-4 w-4" />}
            action={picks.some((p) => p !== null) ? (
              <button onClick={reset} className="inline-flex items-center gap-1.5 text-xs text-white/45 hover:text-white">
                <RotateCcw className="h-3.5 w-3.5" /> Restart
              </button>
            ) : undefined}
          />

          {/* History of answered rounds */}
          <div className="space-y-4">
            {STEPS.map((s, i) => {
              if (i > activeStep) return null;
              const picked = picks[i];
              return (
                <div key={s.id} className="space-y-2">
                  <div className="rounded-2xl rounded-tl-sm bg-white/[0.04] px-4 py-2.5 text-sm text-white/75">{s.recruiterLine}</div>
                  {picked === null ? (
                    <motion.div
                      className="space-y-2"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="show"
                    >
                      {s.choices.map((c, ci) => (
                        <motion.button
                          key={ci}
                          variants={fadeUp}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          transition={springSoft}
                          onClick={() => choose(ci)}
                          className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 px-4 py-3 text-left text-sm text-white/75 transition-colors hover:border-capital-400/40 hover:bg-capital-400/[0.04]"
                        >
                          <span>{c.label}</span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-white/30 transition-colors group-hover:text-capital-300" />
                        </motion.button>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      <motion.div
                        initial={{ opacity: 0, x: 16, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={springSoft}
                        className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-capital-400/10 px-4 py-2.5 text-right text-sm text-capital-100"
                      >
                        {s.choices[picked].label}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...springSoft, delay: 0.12 }}
                        className="rounded-2xl bg-white/[0.02] px-4 py-2.5 text-xs text-white/55"
                      >
                        <span className={cn("font-semibold", s.choices[picked].effect >= 0.5 ? "text-capital-300" : s.choices[picked].effect >= 0.2 ? "text-amber-300" : "text-rose-400")}>
                          {s.choices[picked].effect >= 0.5 ? "Strong move. " : s.choices[picked].effect >= 0.2 ? "Decent. " : "Weak. "}
                        </span>
                        {s.choices[picked].note}
                        {s.choices[picked].script && (
                          <p className="mt-2 rounded-xl bg-white/[0.03] px-3 py-2 italic text-white/60">&ldquo;{fillScript(s.choices[picked].script!)}&rdquo;</p>
                        )}
                      </motion.div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
        </motion.div>
      </div>

      <div className="space-y-6 lg:col-span-2">
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
          <StatCard label="Final offer" value={<CountUp value={r.finalOffer} prefix="$" className={done ? "text-glow" : undefined} />} sub={done ? "negotiated result" : "so far"} tone="capital" icon={<TrendingUp className="h-4 w-4" />} />
          <StatCard label="You gained" value={<CountUp value={r.gained} prefix={r.gained > 0 ? "+$" : "$"} />} sub={`${r.pctToMarket.toFixed(0)}% of the gap closed`} tone={r.gained > 0 ? "capital" : "amber"} />
          <StatCard label="Real value (COL-adj)" value={<CountUp value={r.adjusted} prefix="$" />} sub={`at index ${col}`} tone="violet" />
          <StatCard label="Over a 5-yr career" value={<CountUp value={r.gained * 5} prefix="$" />} sub="ignoring raises & compounding" tone="amber" />
        </motion.div>

        {/* Offer trajectory, every round you play redraws the climb */}
        <motion.div variants={fadeUp}>
        <Card glow className="glass-hi">
          <CardHeader
            title="Your climb to market"
            subtitle="Offer after each round vs the market rate"
            icon={<TrendingUp className="h-4 w-4" />}
            action={r.gap > 0 ? <Pill tone={done ? "capital" : "default"}>{r.pctToMarket.toFixed(0)}% closed</Pill> : undefined}
          />
          <div className="h-40 sm:h-44">
            <ResponsiveContainer>
              <LineChart data={r.trajectory} margin={{ top: 8, right: 12, bottom: 0, left: 12 }}>
                <XAxis dataKey="round" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis hide domain={[(dataMin: number) => dataMin * 0.985, () => Math.max(market * 1.01, r.finalOffer * 1.01)]} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(v: number) => [formatCurrency(v), "Offer"]}
                />
                <ReferenceLine
                  y={market}
                  stroke="rgba(124,92,255,0.55)"
                  strokeDasharray="4 4"
                  label={{ value: `market ${formatCurrency(market)}`, fill: "rgba(124,92,255,0.8)", fontSize: 10, position: "insideBottomRight" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#39f5ac"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#39f5ac", strokeWidth: 0 }}
                  animationDuration={700}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        </motion.div>

        <PopReveal revealKey={r.gained > 0 ? "gained" : "flat"}>
        <Card className="border-capital-400/15 bg-capital-400/[0.03]">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-capital-300">Why it&apos;s worth it</p>
          <p className="text-sm text-white/70">
            {r.gained > 0 ? (
              <>
                One conversation moved your offer <strong className="text-white">{formatCurrency(r.gained)}</strong>. Because future raises are usually a
                percentage of your base, that gap compounds every year, negotiating the first offer is one of the highest-ROI hours of your career.
              </>
            ) : (
              <>Negotiating is nearly free to attempt and the downside is tiny, a well-researched counter almost never gets an offer rescinded. Play a round above to see the upside.</>
            )}
          </p>
        </Card>
        </PopReveal>

        {done && (
          <motion.div initial={{ opacity: 0, scale: 0.94, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={springSoft}>
          <SaveProjectButton
            kind="salary"
            title={`Salary negotiation, ${formatCurrency(r.finalOffer)}`}
            getSummary={() => `Negotiated ${formatCurrency(offer)} → ${formatCurrency(r.finalOffer)} (+${formatCurrency(r.gained)}, ${r.pctToMarket.toFixed(0)}% of gap to market)`}
            getData={() => ({
              offer,
              market,
              colIndex: col,
              choices: picks.map((p, i) => (p === null ? null : STEPS[i].choices[p].label)),
              finalOffer: r.finalOffer,
              gained: r.gained,
              pctToMarket: Math.round(r.pctToMarket),
              colAdjusted: r.adjusted,
            })}
          />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
