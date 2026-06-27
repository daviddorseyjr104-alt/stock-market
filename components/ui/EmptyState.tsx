import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-capital-400/10 text-capital-300 animate-float">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-white/50">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
