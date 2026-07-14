"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useAppState } from "@/lib/store";
import { track } from "@/lib/analytics";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsDemo, beginSession } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setUnverified(false);
    setLoading(true);

    const supabase = createClient();

    // Keyless demo build: there is no account to authenticate against, so hand
    // the visitor a local session. This branch never runs with Supabase live.
    if (!supabase) {
      await new Promise((r) => setTimeout(r, 650));
      loginAsDemo();
      track("login_demo");
      router.push("/dashboard");
      return;
    }

    // A failed sign-in must FAIL. This used to swallow "invalid login
    // credentials" and log the user in regardless, which let anyone into any
    // account with any password, and then overwrote that account with a blank
    // "Guest" profile.
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (/email not confirmed/i.test(authError.message)) {
        setUnverified(true);
      } else if (/invalid login credentials/i.test(authError.message)) {
        setError("That email and password don't match an account.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    if (!data.user?.email_confirmed_at) {
      await supabase.auth.signOut();
      setUnverified(true);
      setLoading(false);
      return;
    }

    // Session is real: rebuild state from the backend rather than resetting it.
    await beginSession();
    track("login");
    router.push("/dashboard");
  }

  async function resendVerification() {
    const supabase = createClient();
    if (!supabase || !email) return;
    setLoading(true);
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (resendError) setError(resendError.message);
    else setResent(true);
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-white">
        Welcome back
      </h1>
      <p className="mt-2 text-white/55">
        Pick up your streak where you left off.
      </p>

      {!isSupabaseConfigured && (
        <div className="mt-5 rounded-2xl border border-capital-400/15 bg-capital-400/[0.04] px-4 py-3 text-xs text-white/60">
          <strong className="text-capital-300">Demo mode.</strong> No Supabase
          keys are configured, so any credentials will take you straight into the
          full product.
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <Field
          icon={<Mail className="h-4 w-4" />}
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@school.edu"
        />
        <Field
          icon={<Lock className="h-4 w-4" />}
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
        />

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-400"
          >
            {error}
          </p>
        )}

        {unverified && (
          <div
            role="alert"
            className="space-y-2 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-3 py-2.5 text-sm text-amber-200"
          >
            <p>
              <strong className="font-semibold">Confirm your email first.</strong>{" "}
              We sent a link to {email}. Click it to activate your account.
            </p>
            {resent ? (
              <p className="text-xs text-amber-200/70">
                Sent again — check your inbox and spam folder.
              </p>
            ) : (
              <button
                type="button"
                onClick={resendVerification}
                className="text-xs font-semibold text-amber-100 underline underline-offset-2 hover:text-white"
              >
                Resend the link
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-white/55">
            <input type="checkbox" className="accent-capital-400" defaultChecked />
            Remember me
          </label>
          <button type="button" className="text-capital-300 hover:underline">
            Forgot password?
          </button>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
            </>
          ) : (
            <>
              Log in <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        New to Campus Capital?{" "}
        <Link href="/signup" className="font-semibold text-capital-300 hover:underline">
          Create your account
        </Link>
      </p>
    </div>
  );
}

function Field({
  icon,
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-white/70">{label}</span>
      <span className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.02] px-3.5 transition-colors focus-within:border-capital-400/50">
        <span className="text-white/35">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
        />
      </span>
    </label>
  );
}
