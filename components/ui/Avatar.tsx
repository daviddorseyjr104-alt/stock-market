import { cn, initials } from "@/lib/utils";

const sizes = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

export function Avatar({
  name,
  gradient,
  size = "md",
  ring,
  className,
}: {
  name: string;
  gradient: string;
  size?: keyof typeof sizes;
  ring?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-ink-950",
        gradient,
        sizes[size],
        ring && "ring-2 ring-white/10 ring-offset-2 ring-offset-ink-950",
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
