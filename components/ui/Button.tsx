"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-2xl transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-focus whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-capital-gradient text-ink-950 shadow-glow hover:shadow-[0_10px_50px_-8px_rgba(57,245,172,0.6)] hover:brightness-110",
  secondary:
    "glass text-white hover:bg-white/10 hover:border-white/20",
  ghost: "text-white/70 hover:text-white hover:bg-white/5",
  outline:
    "border border-white/15 text-white hover:border-capital-400/60 hover:bg-capital-400/5",
  danger: "bg-rose-500/90 text-white hover:bg-rose-500",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3.5 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, children, ...props }, ref) => {
    const classes = cn(base, variants[variant], sizes[size], className);
    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
