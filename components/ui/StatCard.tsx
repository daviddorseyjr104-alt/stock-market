import { cn } from "@/lib/utils";
import { Card } from "./Card";

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "capital",
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "capital" | "violet" | "amber" | "rose";
  className?: string;
}) {
  const glow = {
    capital: "text-capital-300",
    violet: "text-violet-400",
    amber: "text-amber-300",
    rose: "text-rose-400",
  }[tone];
  return (
    <Card hover className={cn("p-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-white/40">
          {label}
        </span>
        {icon && <span className={glow}>{icon}</span>}
      </div>
      <div className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
        {value}
      </div>
      {sub && <div className="mt-0.5 text-xs text-white/50">{sub}</div>}
    </Card>
  );
}
