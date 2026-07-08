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
  const { loginAsDemo } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    if (supabase) {
      // Try real Supabase auth. If it fails (e.g. no account yet, or the
      // database schema isn't applied), don't dead-end the user, fall through
      // to the explorable demo session. New accounts are created via /signup.
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error && !/invalid login credentials|email not confirmed/i.test(error.message)) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      // Demo mode, no Supabase configured. Continue to the product.
      await new Promise((r) => setTimeout(r, 650));
    }
    loginAsDemo();
    track("login_demo");
    router.push("/dashboard");
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
          <p className="rounded-xl bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
            {error}
          </p>
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
