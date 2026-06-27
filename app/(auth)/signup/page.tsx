"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { schools } from "@/lib/data/schools";
import { clubs } from "@/lib/data/clubs";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useAppState } from "@/lib/store";
import { track } from "@/lib/analytics";
import type { Goal, Interest, InvestingLevel, StudentType } from "@/lib/types";

const studentTypes: StudentType[] = [
  "freshman",
  "sophomore",
  "junior",
  "senior",
  "transfer",
  "grad student",
];
const levels: InvestingLevel[] = [
  "beginner",
  "some knowledge",
  "intermediate",
  "advanced",
];
const goals: Goal[] = [
  "Learn basics",
  "Build first portfolio",
  "Understand ETFs",
  "Prepare for finance career",
  "Build wealth long-term",
  "Learn before investing real money",
];
const interests: Interest[] = [
  "Stocks",
  "ETFs",
  "Roth IRA",
  "Budgeting",
  "Credit",
  "Real estate",
  "Entrepreneurship",
  "Finance careers",
  "Crypto education only",
  "Economic news",
];
const gradYears = [2025, 2026, 2027, 2028, 2029, 2030];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-3.5 py-2 text-sm font-medium capitalize transition-all active:scale-95",
        active
          ? "border-capital-400/50 bg-capital-400/10 text-capital-200 shadow-glow"
          : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function SignupInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { signUp } = useAppState();
  const initialStep = params.get("step") === "3" ? 3 : 1;
  const [step, setStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);

  // form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolId, setSchoolId] = useState(schools[0].id);
  const [major, setMajor] = useState("");
  const [gradYear, setGradYear] = useState(2027);
  const [studentType, setStudentType] = useState<StudentType>("sophomore");
  const [level, setLevel] = useState<InvestingLevel>("beginner");
  const [goal, setGoal] = useState<Goal>("Learn basics");
  const [club, setClub] = useState<string | null>(null);
  const [picked, setPicked] = useState<Interest[]>([]);

  const toggleInterest = (i: Interest) =>
    setPicked((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );

  const canNext =
    step === 1
      ? fullName.trim() && email.trim() && password.length >= 6
      : step === 2
        ? major.trim()
        : picked.length >= 1;

  async function finish() {
    setLoading(true);
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, school_id: schoolId } },
      });
    } else {
      await new Promise((r) => setTimeout(r, 800));
    }
    // Write the real, per-user profile from everything onboarding collected.
    signUp({
      fullName,
      email,
      schoolId,
      major,
      gradYear,
      studentType,
      investingLevel: level,
      goal,
      interests: picked,
      clubId: club,
    });
    track("signup_completed", { school: schoolId, level });
    router.push("/dashboard");
  }

  return (
    <div>
      {/* Stepper */}
      <div className="mb-8 flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all",
                s < step
                  ? "bg-capital-gradient text-ink-950"
                  : s === step
                    ? "border-2 border-capital-400 text-capital-300"
                    : "border border-white/15 text-white/40",
              )}
            >
              {s < step ? <Check className="h-4 w-4" /> : s}
            </div>
            {s < 3 && (
              <div
                className={cn(
                  "h-0.5 flex-1 rounded-full transition-all",
                  s < step ? "bg-capital-400" : "bg-white/10",
                )}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
        >
          {step === 1 && (
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white">
                Create your account
              </h1>
              <p className="mt-2 text-white/55">
                Start learning the market through your real student life.
              </p>
              <div className="mt-7 space-y-4">
                <Input icon={<User className="h-4 w-4" />} label="Full name" value={fullName} onChange={setFullName} placeholder="Davon Carter" />
                <Input icon={<Mail className="h-4 w-4" />} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@school.edu" />
                <Input icon={<Lock className="h-4 w-4" />} label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white">
                Tell us about you
              </h1>
              <p className="mt-2 text-white/55">
                We&apos;ll tailor lessons to your year and goals.
              </p>
              <div className="mt-6 space-y-5">
                <div>
                  <Label>School</Label>
                  <select
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-ink-800 px-3.5 py-3 text-sm text-white focus:border-capital-400/50 focus:outline-none"
                  >
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.emoji} {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Major" value={major} onChange={setMajor} placeholder="Economics" />
                  <div>
                    <Label>Graduation year</Label>
                    <select
                      value={gradYear}
                      onChange={(e) => setGradYear(Number(e.target.value))}
                      className="w-full rounded-2xl border border-white/10 bg-ink-800 px-3.5 py-3 text-sm text-white focus:border-capital-400/50 focus:outline-none"
                    >
                      {gradYears.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Student type</Label>
                  <div className="flex flex-wrap gap-2">
                    {studentTypes.map((t) => (
                      <Chip key={t} active={studentType === t} onClick={() => setStudentType(t)}>{t}</Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Investing level</Label>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((l) => (
                      <Chip key={l} active={level === l} onClick={() => setLevel(l)}>{l}</Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Main goal</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {goals.map((g) => (
                      <Chip key={g} active={goal === g} onClick={() => setGoal(g)}>{g}</Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white">
                Join your community
              </h1>
              <p className="mt-2 text-white/55">
                Pick a club to start with and the topics you care about.
              </p>

              <div className="mt-6">
                <Label>
                  <GraduationCap className="mr-1 inline h-3.5 w-3.5" /> Campus community
                </Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {clubs.slice(0, 4).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setClub(club === c.id ? null : c.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left transition-all",
                        club === c.id
                          ? "border-capital-400/50 bg-capital-400/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20",
                      )}
                    >
                      <span className="text-xl">{c.emoji}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-white">{c.name}</span>
                        <span className="block truncate text-xs text-white/45">{c.members.toLocaleString()} members</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <Label>
                  <Sparkles className="mr-1 inline h-3.5 w-3.5" /> Interests
                  <span className="ml-1 text-white/35">(pick at least 1)</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {interests.map((i) => (
                    <Chip key={i} active={picked.includes(i)} onClick={() => toggleInterest(i)}>{i}</Chip>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {!isSupabaseConfigured && step === 1 && (
        <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-xs text-white/50">
          Running in <strong className="text-capital-300">demo mode</strong>, your
          account is created locally so you can explore the full product instantly.
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        {step > 1 && (
          <Button variant="secondary" size="lg" onClick={() => setStep(step - 1)}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        )}
        {step < 3 ? (
          <Button
            size="lg"
            className="flex-1"
            disabled={!canNext}
            onClick={() => setStep(step + 1)}
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="lg" className="flex-1" disabled={!canNext || loading} onClick={finish}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating your account...
              </>
            ) : (
              <>
                Enter Campus Capital <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-white/50">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-capital-300 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-sm font-medium text-white/70">{children}</span>
  );
}

function Input({
  icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  icon?: React.ReactNode;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <span className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.02] px-3.5 transition-colors focus-within:border-capital-400/50">
        {icon && <span className="text-white/35">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
        />
      </span>
    </label>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="text-white/40">Loading...</div>}>
      <SignupInner />
    </Suspense>
  );
}
