import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-7 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-sm text-white/55">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
