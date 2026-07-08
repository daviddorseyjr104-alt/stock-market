"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gauge, Lightbulb, Sparkles } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { AnimatedRing, CountUp, NumberField, SaveProjectButton } from "@/components/sim/shared";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn, formatCurrency } from "@/lib/utils";

interface Section {
  key: string;
  label: string;
  prompt: string;
  placeholder: string;
  tip: string;
  weight: number; // rubric weight (sums to 100)
}

const SECTIONS: Section[] = [
  { key: "problem", label: "Problem", prompt: "What painful problem are you solving, and for whom?", placeholder: "Students waste 6+ hrs/week meal-planning and still overspend on takeout…", tip: "Name a specific person feeling a specific pain. Vague problems kill pitches.", weight: 20 },
  { key: "solution", label: "Solution", prompt: "What's your product, in one clear sentence?", placeholder: "A $12 weekly box of pre-portioned, dorm-microwave meals delivered Sundays…", tip: "One sentence a stranger could repeat. Avoid buzzwords.", weight: 20 },
  { key: "market", label: "Market", prompt: "How big is this, and who exactly is the customer?", placeholder: "18k students on campus, ~30% cook in dorms, $8/wk average spend…", tip: "Bottom-up numbers (users × price) beat 'it's a $1B market'.", weight: 20 },
  { key: "traction", label: "Traction", prompt: "What proof do you have that this works?", placeholder: "42 pre-orders, 3 repeat customers, $500 revenue in 2 weeks…", tip: "Any real signal, sales, signups, pilots, beats opinions.", weight: 25 },
  { key: "ask", label: "The ask", prompt: "How much are you raising and what for?", placeholder: "Raising $15k for a commercial kitchen deposit and 3 months of ads…", tip: "Be specific about the number and what it buys.", weight: 15 },
];

/** Score a section 0-1 from length + whether it contains a concrete number. */
function sectionScore(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  const words = t.split(/\s+/).length;
  const lengthScore = Math.min(1, words / 18); // ~18 words = full marks for length
  const hasNumber = /\d/.test(t) ? 0.25 : 0; // concreteness bonus
  return Math.min(1, lengthScore * 0.85 + hasNumber);
}

export function PitchSim() {
  const [text, setText] = useState<Record<string, string>>({});
  const [ask, setAsk] = useState(15000);
  const [equity, setEquity] = useState(10); // % offered

  const r = useMemo(() => {
    // Weighted readiness score: Σ (sectionScore × weight).
    let score = 0;
    const perSection: Record<string, number> = {};
    for (const s of SECTIONS) {
      const sc = sectionScore(text[s.key] ?? "");
      perSection[s.key] = sc;
      score += sc * s.weight;
    }
    const readiness = Math.round(score);

    // Implied post-money valuation from the ask & equity:
    //   equity% = investment / post-money  ⇒  post-money = investment / equity%
    //   pre-money = post-money − investment
    const eq = Math.min(0.9, Math.max(0.001, equity / 100));
    const postMoney = ask / eq;
    const preMoney = postMoney - ask;

    const weakest = SECTIONS.reduce((w, s) => (perSection[s.key] < perSection[w.key] ? s : w), SECTIONS[0]);
    return { readiness, perSection, postMoney, preMoney, weakest };
  }, [text, ask, equity]);

  const feedback =
    r.readiness >= 80
      ? "Investor-ready. Every section is concrete and backed by a number, now practice saying it out loud in 90 seconds."
      : r.readiness >= 50
        ? `Solid draft. Your weakest section is "${r.weakest.label}", tighten it with a specific number and you'll jump.`
        : "Early. Fill each section with a real, specific sentence, numbers wherever you can. Investors fund clarity, not hype.";

  const tone = r.readiness >= 80 ? "text-capital-300" : r.readiness >= 50 ? "text-amber-300" : "text-rose-400";
  const equityFlag = equity > 20;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-3">
        {SECTIONS.map((s) => {
          const sc = r.perSection[s.key];
          return (
            <motion.div key={s.key} variants={fadeUp}>
            <Card className={cn("transition-colors", sc >= 0.75 && "border-capital-400/20")}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm font-semibold text-white">{s.label}</h3>
                  <Pill tone={sc >= 0.75 ? "capital" : sc > 0 ? "amber" : "default"}>{Math.round(sc * 100)}%</Pill>
                </div>
                <span className="text-xs text-white/35">{s.weight} pts</span>
              </div>
              <p className="mb-2 text-xs text-white/50">{s.prompt}</p>
              <textarea
                value={text[s.key] ?? ""}
                onChange={(e) => setText((t) => ({ ...t, [s.key]: e.target.value }))}
                placeholder={s.placeholder}
                rows={2}
                className="w-full resize-none rounded-xl border border-white/10 bg-ink-900 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-capital-400/50 focus:outline-none"
              />
              <p className="mt-1.5 flex items-start gap-1.5 text-[11px] text-white/35">
                <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-amber-300/70" /> {s.tip}
              </p>
            </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-6 lg:col-span-2">
        <motion.div variants={fadeUp}>
        <Card glow className="glass-hi">
          <CardHeader title="Readiness score" subtitle="Weighted across all 5 sections" icon={<Gauge className="h-4 w-4" />} />
          <div className="flex items-center gap-5">
            <AnimatedRing value={r.readiness} size={104} stroke={9}>
              <span className={cn("font-display text-3xl font-bold text-glow", tone)}>
                <CountUp value={r.readiness} />
              </span>
            </AnimatedRing>
            <p className="flex-1 text-sm text-white/65">{feedback}</p>
          </div>
          {/* Per-section rubric bars */}
          <div className="mt-5 space-y-2.5 border-t border-white/5 pt-4">
            {SECTIONS.map((s) => {
              const sc = r.perSection[s.key];
              return (
                <div key={s.key}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white/50">{s.label}</span>
                    <span className="font-mono tabular-nums text-white/70">
                      {Math.round(sc * s.weight)}<span className="text-white/35">/{s.weight}</span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      className={cn("h-full rounded-full", sc >= 0.75 ? "bg-capital-400" : sc > 0 ? "bg-amber-400" : "bg-white/10")}
                      initial={{ width: 0 }}
                      animate={{ width: `${sc * 100}%` }}
                      transition={{ type: "spring", stiffness: 160, damping: 26 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
        <Card>
          <CardHeader title="Ask → valuation" subtitle="What your ask implies" icon={<Sparkles className="h-4 w-4" />} />
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Raising" prefix="$" value={ask} onChange={setAsk} max={10000000} step={1000} />
            <NumberField label="Equity offered" suffix="%" value={equity} onChange={setEquity} min={1} max={90} step={0.5} />
          </div>
          <div className="mt-4 space-y-2 rounded-2xl bg-white/[0.03] p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-white/55">Implied post-money</span>
              <span className="font-mono font-semibold text-white">
                <CountUp value={Math.round(r.postMoney)} prefix="$" className="text-glow" />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/55">Implied pre-money</span>
              <span className="font-mono font-semibold text-white">
                <CountUp value={Math.round(r.preMoney)} prefix="$" />
              </span>
            </div>
          </div>
          <AnimatePresence>
            {equityFlag && (
              <motion.p
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden rounded-2xl bg-amber-400/10 px-4 py-3 text-xs text-amber-300"
              >
                Giving up {equity}% in one round is steep, early founders usually part with 10-20%. Selling too much now leaves little for future rounds and your own motivation.
              </motion.p>
            )}
          </AnimatePresence>
          <p className="mt-3 text-[11px] text-white/35">
            Because equity% = investment ÷ post-money, offering {equity}% for {formatCurrency(ask)} values the whole company at {formatCurrency(r.postMoney)}.
          </p>
        </Card>
        </motion.div>

        <SaveProjectButton
          kind="pitch"
          title={`Investor pitch, ${formatCurrency(ask)} ask`}
          disabled={r.readiness === 0}
          getSummary={() => `Readiness ${r.readiness}/100 · raising ${formatCurrency(ask)} for ${equity}% → ${formatCurrency(r.postMoney)} post-money valuation`}
          getData={() => ({
            sections: Object.fromEntries(SECTIONS.map((s) => [s.key, text[s.key] ?? ""])),
            sectionScores: Object.fromEntries(SECTIONS.map((s) => [s.key, Math.round(r.perSection[s.key] * 100)])),
            readiness: r.readiness,
            ask,
            equityPct: equity,
            postMoney: Math.round(r.postMoney),
            preMoney: Math.round(r.preMoney),
          })}
        />
      </div>
    </motion.div>
  );
}
