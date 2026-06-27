"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { useAppState } from "@/lib/store";

/**
 * Client auth guard for the authenticated app shell.
 *
 * It renders `children` UNCONDITIONALLY (so server-side `notFound()` and SSR
 * status codes propagate correctly) and shows a full-screen overlay until the
 * store has hydrated and confirmed a session. Unauthenticated visitors are
 * redirected to /login. Real authorization is enforced by Supabase RLS on the
 * backend; this is the UX gate.
 */
export function AppGate({ children }: { children: React.ReactNode }) {
  const { hydrated, authed } = useAppState();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !authed) router.replace("/login");
  }, [hydrated, authed, router]);

  const blocking = !hydrated || !authed;

  return (
    <>
      {children}
      {blocking && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-ink-950">
          <LogoMark className="h-12 w-12 animate-pulse-glow" />
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Loader2 className="h-4 w-4 animate-spin" />
            {hydrated ? "Redirecting to sign in..." : "Loading your campus..."}
          </div>
        </div>
      )}
    </>
  );
}
