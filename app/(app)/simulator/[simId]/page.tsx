"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pill } from "@/components/ui/Pill";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { simById } from "@/components/sim/registry";
import { BudgetSim } from "@/components/sim/BudgetSim";
import { StrategySim } from "@/components/sim/StrategySim";
import { DebtSim } from "@/components/sim/DebtSim";
import { StartupSim } from "@/components/sim/StartupSim";
import { PricingSim } from "@/components/sim/PricingSim";
import { PitchSim } from "@/components/sim/PitchSim";
import { SalarySim } from "@/components/sim/SalarySim";

const SIMS: Record<string, () => JSX.Element> = {
  budget: BudgetSim,
  strategy: StrategySim,
  debt: DebtSim,
  startup: StartupSim,
  pricing: PricingSim,
  pitch: PitchSim,
  salary: SalarySim,
};

export default function SimPage({ params }: { params: { simId: string } }) {
  const { simId } = params;
  const meta = simById(simId);
  const Sim = SIMS[simId];
  // "portfolio" lives at its own route; only the 7 interactive sims render here.
  if (!meta || !Sim) notFound();

  const Icon = (icons as unknown as Record<string, LucideIcon>)[meta.icon] ?? icons.Sparkles;

  return (
    <div className="space-y-6">
      <Link href="/simulator" className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white">
        <ArrowLeft className="h-4 w-4" /> All simulations
      </Link>

      <PageHeader
        title={
          <span className="flex items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${meta.iconClass}`}>
              <Icon className="h-5 w-5" />
            </span>
            {meta.title}
          </span>
        }
        subtitle={meta.pitch}
        action={
          <div className="flex items-center gap-2">
            <Pill tone={meta.tone}>{meta.skill}</Pill>
            <Pill tone="default">
              <Clock className="h-3.5 w-3.5" /> ~{meta.minutes} min
            </Pill>
          </div>
        }
      />

      <Disclaimer />

      <Sim />
    </div>
  );
}
