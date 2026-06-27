import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl bg-capital-gradient shadow-glow",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[60%] w-[60%]">
        {/* Upward "capital growth" mark, a stylized C + rising bars */}
        <path
          d="M6 16.5L10 12L13.5 14.5L18.5 8"
          stroke="#05060a"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="18.5" cy="8" r="1.7" fill="#05060a" />
      </svg>
    </div>
  );
}

export function Logo({
  className,
  href = "/",
  showText = true,
  size = "md",
}: {
  className?: string;
  href?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const mark = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-11 w-11" }[size];
  const text = { sm: "text-base", md: "text-lg", lg: "text-2xl" }[size];
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn(mark, "transition-transform duration-300 group-hover:scale-105")} />
      {showText && (
        <span className={cn("font-display font-bold tracking-tight text-white", text)}>
          Campus<span className="text-gradient-capital">Capital</span>
        </span>
      )}
    </Link>
  );
}
