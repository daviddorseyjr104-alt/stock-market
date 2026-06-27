import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function Disclaimer({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-white/45",
        className,
      )}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/35" />
      <span>
        {children ?? (
          <>
            <strong className="font-semibold text-white/60">Educational simulation only.</strong>{" "}
            Campus Capital is not financial advice, involves no real money or
            trading, and uses simulated portfolios. Always do your own research
            before investing.
          </>
        )}
      </span>
    </div>
  );
}
