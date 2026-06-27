import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Flame, TrendingUp, Trophy, Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden border-r border-white/8 p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-glow" />
        <div className="pointer-events-none absolute -left-20 top-1/3 -z-10 h-96 w-96 rounded-full bg-capital-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 bottom-10 -z-10 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />

        <Logo size="lg" />

        <div>
          <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-white">
            The financial future,{" "}
            <span className="text-gradient-capital">starts on campus.</span>
          </h2>
          <p className="mt-4 max-w-md text-white/55">
            Join your school&apos;s investing community. Build streaks, climb the
            leaderboard, and learn the market through the life you actually live.
          </p>

          <div className="mt-10 space-y-3">
            {[
              { icon: Sparkles, text: "20 student-native lessons", tone: "text-capital-300" },
              { icon: TrendingUp, text: "$10,000 mock portfolio simulator", tone: "text-violet-400" },
              { icon: Flame, text: "Streaks & XP that build the habit", tone: "text-orange-400" },
              { icon: Trophy, text: "School-vs-school leaderboards", tone: "text-amber-300" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-sm text-white/70">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                  <f.icon className={`h-4 w-4 ${f.tone}`} />
                </span>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/35">
          Educational only · Not financial advice · No real trading
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between lg:hidden">
          <Logo />
          <Link href="/" className="text-sm text-white/50 hover:text-white">
            ← Home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md py-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
