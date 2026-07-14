"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  AtSign,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  MailCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AvatarPicker } from "@/components/profile/AvatarPicker";
import { schools } from "@/lib/data/schools";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useAppState } from "@/lib/store";
import { track } from "@/lib/analytics";
import {
  checkUsername,
  normalizeUsername,
  suggestUsername,
  validateUsername,
  type UsernameStatus,
} from "@/lib/username";
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

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function SignupInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { signUp } = useAppState();
  const initialStep = params.get("step") === "3" ? 3 : 1;
  const [step, setStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  // form state
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [nameStatus, setNameStatus] = useState<UsernameStatus>({ state: "idle" });
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolId, setSchoolId] = useState(schools[0].id);
  const [major, setMajor] = useState("");
  const [gradYear, setGradYear] = useState(2027);
  const [studentType, setStudentType] = useState<StudentType>("sophomore");
  const [level, setLevel] = useState<InvestingLevel>("beginner");
  const [goal, setGoal] = useState<Goal>("Learn basics");
  const [picked, setPicked] = useState<Interest[]>([]);

  // Offer a handle derived from their name, but only until they take control of
  // the field — otherwise typing a name would overwrite a username they chose.
  const suggested = usernameTouched ? username : suggestUsername(fullName);

  useEffect(() => {
    const name = suggested;
    if (!name) {
      setNameStatus({ state: "idle" });
      return;
    }
    const invalid = validateUsername(name);
    if (invalid) {
      setNameStatus({ state: "invalid", message: invalid });
      return;
    }
    setNameStatus({ state: "checking" });
    // Debounce so we aren't querying on every keystroke.
    const id = setTimeout(() => {
      checkUsername(name).then(setNameStatus);
    }, 400);
    return () => clearTimeout(id);
  }, [suggested]);

  const toggleInterest = (i: Interest) =>
    setPicked((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );

  const emailValid = EMAIL_SHAPE.test(email.trim());

  const canNext =
    step === 1
      ? Boolean(
          fullName.trim() &&
            emailValid &&
            password.length >= 6 &&
            nameStatus.state === "available",
        )
      : step === 2
        ? Boolean(major.trim())
        : picked.length >= 1;

  async function finish() {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    if (!supabase) {
      await new Promise((r) => setTimeout(r, 800));
      signUp({
        fullName,
        username: suggested,
        avatarUrl,
        email,
        schoolId,
        major,
        gradYear,
        studentType,
        investingLevel: level,
        goal,
        interests: picked,
      });
      track("signup_completed", { school: schoolId, level });
      router.push("/dashboard");
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        // Without this, Supabase never sends a confirmation link at all.
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: fullName, username: suggested, school_id: schoolId },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // With email confirmation on, Supabase returns a user but NO session. The
    // old code pushed to /dashboard anyway, so unverified accounts walked
    // straight in. Hold them here until they click the link instead.
    if (!data.session) {
      setSentTo(email.trim());
      setLoading(false);
      return;
    }

    signUp({
      id: data.user?.id,
      fullName,
      username: suggested,
      avatarUrl,
      email: email.trim(),
      emailVerified: Boolean(data.user?.email_confirmed_at),
      schoolId,
      major,
      gradYear,
      studentType,
      investingLevel: level,
      goal,
      interests: picked,
    });
    track("signup_completed", { school: schoolId, level });
    router.push("/dashboard");
  }

  if (sentTo) return <CheckYourEmail email={sentTo} />;

  return (
    <div>
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200"
        >
          {error}
        </div>
      )}

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
              <div className="mt-7 space-y-5">
                <div>
                  <Label>Profile picture</Label>
                  <AvatarPicker
                    value={avatarUrl}
                    onChange={setAvatarUrl}
                    fallback={(fullName.trim()[0] ?? "?").toUpperCase()}
                  />
                </div>

                <Input icon={<User className="h-4 w-4" />} label="Full name" value={fullName} onChange={setFullName} placeholder="Davon Carter" />

                <div>
                  <Label>Username</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40">
                      <AtSign className="h-4 w-4" />
                    </span>
                    <input
                      value={suggested}
                      onChange={(e) => {
                        setUsernameTouched(true);
                        setUsername(normalizeUsername(e.target.value));
                      }}
                      placeholder="davon_c"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      aria-invalid={nameStatus.state === "invalid" || nameStatus.state === "taken"}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-10 text-sm text-white placeholder:text-white/25 focus:border-capital-400/50 focus:outline-none"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      {nameStatus.state === "checking" && (
                        <Loader2 className="h-4 w-4 animate-spin text-white/40" aria-hidden />
                      )}
                      {nameStatus.state === "available" && (
                        <Check className="h-4 w-4 text-capital-300" aria-hidden />
                      )}
                      {(nameStatus.state === "taken" || nameStatus.state === "invalid") && (
                        <X className="h-4 w-4 text-rose-400" aria-hidden />
                      )}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mt-1.5 text-xs",
                      nameStatus.state === "taken" || nameStatus.state === "invalid"
                        ? "text-rose-400"
                        : "text-white/35",
                    )}
                  >
                    {nameStatus.state === "taken" || nameStatus.state === "invalid"
                      ? nameStatus.message
                      : "This is how you'll show up on the feed and leaderboards."}
                  </p>
                </div>

                <Input icon={<Mail className="h-4 w-4" />} label="Email" type="email" value={email} onChange={setEmail} placeholder="you@school.edu" />
                {email.trim() && !emailValid && (
                  <p className="-mt-2.5 text-xs text-rose-400">
                    That doesn&apos;t look like a valid email address.
                  </p>
                )}
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
                What do you want to learn?
              </h1>
              <p className="mt-2 text-white/55">
                We&apos;ll order your path around the topics you pick.
              </p>

              <div className="mt-6">
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

              <p className="mt-6 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-white/45">
                Clubs are opt-in once your email is confirmed — join them from the
                Clubs tab. Membership shows other students you&apos;re a real
                person, so we don&apos;t hand it out at signup.
              </p>
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

/**
 * Terminal state for a signup that created a user but no session, i.e. Supabase
 * is waiting on the confirmation link. The account genuinely does not work until
 * the link is clicked, so there is deliberately no "skip" out of this screen.
 */
function CheckYourEmail({ email }: { email: string }) {
  const [resent, setResent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function resend() {
    const supabase = createClient();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setBusy(false);
    if (resendError) setError(resendError.message);
    else setResent(true);
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-capital-400/12 text-capital-300">
        <MailCheck className="h-8 w-8" aria-hidden />
      </div>
      <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-white">
        Confirm your email
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/55">
        We sent a link to{" "}
        <strong className="font-semibold text-white">{email}</strong>. Click it to
        activate your account, then come back and log in.
      </p>

      {error && (
        <p role="alert" className="mt-4 text-sm text-rose-400">
          {error}
        </p>
      )}

      <div className="mt-7 flex flex-col items-center gap-3">
        <Button href="/login" size="lg" className="w-full">
          Back to log in
        </Button>
        {resent ? (
          <p className="text-xs text-white/40">
            Sent again — check your spam folder if it&apos;s not there.
          </p>
        ) : (
          <button
            type="button"
            onClick={resend}
            disabled={busy}
            className="text-sm font-semibold text-capital-300 hover:underline disabled:opacity-50"
          >
            {busy ? "Sending..." : "Resend the link"}
          </button>
        )}
      </div>
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
