import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  barClassName,
  showGlow = true,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  showGlow?: boolean;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-white/8", className)}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full bg-capital-gradient transition-[width] duration-700 ease-out",
          showGlow && "shadow-[0_0_12px_rgba(57,245,172,0.5)]",
          barClassName,
        )}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

export function RingProgress({
  value,
  size = 72,
  stroke = 7,
  children,
  trackClass = "text-white/8",
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
  trackClass?: string;
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className={trackClass} stroke="currentColor" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          stroke="url(#ringGrad)"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#39f5ac" />
            <stop offset="100%" stopColor="#7c5cff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
