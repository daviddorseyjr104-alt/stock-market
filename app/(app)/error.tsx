"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this would report to your error tracker (Sentry, etc.).
    console.error("Campus Capital error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="mt-5 font-display text-2xl font-bold text-white">
        Something went sideways.
      </h1>
      <p className="mt-2 max-w-sm text-sm text-white/55">
        An unexpected error occurred while loading this section. Your progress is
        saved — try again.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-white/30">ref: {error.digest}</p>
      )}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Try again
        </Button>
        <Button href="/dashboard" variant="secondary">
          <Home className="h-4 w-4" /> Dashboard
        </Button>
      </div>
    </div>
  );
}
