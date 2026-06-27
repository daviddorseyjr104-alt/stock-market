"use client";

import { cn } from "@/lib/utils";

export function Toggle({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-all duration-300 focus-visible:ring-focus",
        checked
          ? "border-transparent bg-capital-gradient shadow-[0_0_14px_rgba(57,245,172,0.45)]"
          : "border-white/10 bg-white/8 hover:bg-white/12",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300",
          checked ? "translate-x-6 bg-ink-950" : "translate-x-1",
        )}
      />
    </button>
  );
}
