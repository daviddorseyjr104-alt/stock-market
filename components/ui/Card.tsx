import { cn } from "@/lib/utils";

export function Card({
  className,
  glow,
  hover,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { glow?: boolean; hover?: boolean }) {
  return (
    <div
      className={cn(
        "glass rounded-3xl p-5 shadow-card",
        hover &&
          "transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5 hover:shadow-float",
        glow && "shadow-glow",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  subtitle,
  icon,
  action,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-capital-300">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-display text-base font-semibold tracking-tight text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-white/50">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}
