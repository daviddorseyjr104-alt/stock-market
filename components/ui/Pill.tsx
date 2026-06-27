import { cn } from "@/lib/utils";

type Tone = "default" | "capital" | "violet" | "amber" | "rose" | "sky" | "low" | "medium" | "high";

const tones: Record<Tone, string> = {
  default: "bg-white/5 text-white/70 border-white/10",
  capital: "bg-capital-400/10 text-capital-300 border-capital-400/20",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  amber: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  sky: "bg-sky-400/10 text-sky-300 border-sky-400/20",
  low: "bg-capital-400/10 text-capital-300 border-capital-400/20",
  medium: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  high: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export function Pill({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
