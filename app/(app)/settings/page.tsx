"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Check,
  LogOut,
  Mail,
  Palette,
  Sparkles,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Avatar } from "@/components/ui/Avatar";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { Reveal } from "@/components/ui/Reveal";
import { CardSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { springSoft } from "@/lib/motion";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Goal, InvestingLevel, Interest, Profile } from "@/lib/types";

const investingLevels: InvestingLevel[] = [
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

const allInterests: Interest[] = [
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

/** Same palette family as `gradientFor`, persisted via updateProfile. */
const avatarGradients = [
  "from-capital-400 to-violet-500",
  "from-violet-500 to-capital-400",
  "from-sky-400 to-capital-400",
  "from-amber-400 to-capital-500",
  "from-rose-400 to-violet-500",
  "from-capital-300 to-sky-500",
  "from-fuchsia-500 to-capital-400",
];

/* Notification preferences persist on this device (localStorage). */
const NOTIFY_KEY = "cc_notify_prefs_v1";

interface NotifyPrefs {
  streak: boolean;
  lessons: boolean;
  social: boolean;
  rank: boolean;
}

const DEFAULT_NOTIFY: NotifyPrefs = {
  streak: true,
  lessons: true,
  social: true,
  rank: false,
};

function loadNotifyPrefs(): NotifyPrefs {
  if (typeof window === "undefined") return DEFAULT_NOTIFY;
  try {
    const raw = window.localStorage.getItem(NOTIFY_KEY);
    if (raw) return { ...DEFAULT_NOTIFY, ...(JSON.parse(raw) as Partial<NotifyPrefs>) };
  } catch {
    /* corrupted prefs → defaults */
  }
  return DEFAULT_NOTIFY;
}

const fieldClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/35 transition-colors focus:border-capital-400/40 focus:bg-white/[0.05] focus:outline-none focus-visible:ring-focus";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">
      {children}
    </label>
  );
}

export default function SettingsPage() {
  const { hydrated, profile } = useAppState();

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, learning, and notifications."
      />
      {/* The form initializes local state from the persisted profile, so it
          only mounts once hydration has finished. */}
      {hydrated ? <SettingsForm profile={profile} /> : <SettingsSkeleton />}
    </div>
  );
}

function SettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const { updateProfile, logout } = useAppState();

  // Profile section
  const [fullName, setFullName] = useState(profile.fullName);
  const [major, setMajor] = useState(profile.major);
  const [gradYear, setGradYear] = useState(String(profile.gradYear));
  const [bio, setBio] = useState(profile.bio);
  const [profileSaved, setProfileSaved] = useState(false);

  // Learning preferences
  const [level, setLevel] = useState<InvestingLevel>(profile.investingLevel);
  const [goal, setGoal] = useState<Goal>(profile.goal);
  const [interests, setInterests] = useState<Interest[]>(profile.interests);

  // Notification toggles, real device preferences, persisted locally.
  const [notify, setNotifyState] = useState<NotifyPrefs>(loadNotifyPrefs);
  const setNotify = (key: keyof NotifyPrefs, value: boolean) => {
    setNotifyState((prev) => {
      const next = { ...prev, [key]: value };
      try {
        window.localStorage.setItem(NOTIFY_KEY, JSON.stringify(next));
      } catch {
        /* storage may be unavailable; the toggle still works this session */
      }
      return next;
    });
  };

  const toggleInterest = (interest: Interest) => {
    const next = interests.includes(interest)
      ? interests.filter((i) => i !== interest)
      : [...interests, interest];
    setInterests(next);
    updateProfile({ interests: next });
  };

  const saveProfile = () => {
    updateProfile({
      fullName,
      major,
      gradYear: Number(gradYear),
      bio,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2400);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="space-y-6">
      {/* Profile */}
      <Reveal>
        <Card>
          <CardHeader
            title="Profile"
            subtitle="How you appear across Campus Capital"
            icon={<User className="h-4 w-4" />}
          />

          {/* Avatar + color */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="gradient-border glow-ring inline-block shrink-0 self-start rounded-full p-1.5">
              <Avatar
                name={fullName || profile.fullName}
                gradient={profile.avatarColor}
                size="lg"
              />
            </div>
            <div className="min-w-0">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/50">
                <Palette className="h-3.5 w-3.5" />
                Avatar color
              </p>
              <div className="flex flex-wrap gap-2">
                {avatarGradients.map((g) => {
                  const active = profile.avatarColor === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => updateProfile({ avatarColor: g })}
                      aria-label={`Avatar color ${g.replace(/from-|to-/g, "").replace("-", " ")}`}
                      aria-pressed={active}
                      className={cn(
                        "h-9 w-9 rounded-full bg-gradient-to-br transition-all duration-200 focus-visible:ring-focus",
                        g,
                        active
                          ? "scale-110 ring-2 ring-white/80 ring-offset-2 ring-offset-ink-950 shadow-glow"
                          : "opacity-70 hover:scale-105 hover:opacity-100",
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Full name</Label>
              <input
                className={fieldClass}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <Label>Major</Label>
              <input
                className={fieldClass}
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />
            </div>
            <div>
              <Label>Graduation year</Label>
              <input
                type="number"
                className={fieldClass}
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Bio</Label>
              <textarea
                rows={3}
                className={cn(fieldClass, "resize-none")}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <Button onClick={saveProfile}>Save changes</Button>
            <AnimatePresence>
              {profileSaved && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.7, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={springSoft}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-capital-300"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                  Saved
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </Reveal>

      {/* Learning preferences */}
      <Reveal delay={0.05}>
        <Card>
          <CardHeader
            title="Learning preferences"
            subtitle="Tailor lessons and recommendations to you, saved instantly"
            icon={<Sparkles className="h-4 w-4" />}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Investing level</Label>
              <select
                className={fieldClass}
                value={level}
                onChange={(e) => {
                  const next = e.target.value as InvestingLevel;
                  setLevel(next);
                  updateProfile({ investingLevel: next });
                }}
              >
                {investingLevels.map((l) => (
                  <option key={l} value={l} className="bg-ink-950">
                    {l}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Goal</Label>
              <select
                className={fieldClass}
                value={goal}
                onChange={(e) => {
                  const next = e.target.value as Goal;
                  setGoal(next);
                  updateProfile({ goal: next });
                }}
              >
                {goals.map((g) => (
                  <option key={g} value={g} className="bg-ink-950">
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2">
              {allInterests.map((interest) => {
                const active = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-all duration-200 focus-visible:ring-focus",
                      active
                        ? "border-transparent bg-capital-gradient font-medium text-ink-950 shadow-glow"
                        : "border-white/10 bg-white/[0.03] text-white/65 hover:border-white/20 hover:text-white",
                    )}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </Reveal>

      {/* Notifications */}
      <Reveal delay={0.1}>
        <Card>
          <CardHeader
            title="Notifications"
            subtitle="Choose what we ping you about, saved on this device"
            icon={<Bell className="h-4 w-4" />}
          />
          <div className="divide-y divide-white/5">
            {(
              [
                {
                  key: "streak",
                  title: "Streak reminders",
                  desc: "A nudge to keep your daily learning flame alive.",
                },
                {
                  key: "lessons",
                  title: "New lessons",
                  desc: "Get notified when fresh lessons drop.",
                },
                {
                  key: "social",
                  title: "Social activity",
                  desc: "Follows, comments, and reactions on your posts.",
                },
                {
                  key: "rank",
                  title: "School rank changes",
                  desc: "When your campus moves on the national leaderboard.",
                },
              ] as const
            ).map((row) => (
              <div
                key={row.key}
                className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-medium text-white">{row.title}</p>
                  <p className="text-xs text-white/45">{row.desc}</p>
                </div>
                <Toggle
                  checked={notify[row.key]}
                  onChange={(next) => setNotify(row.key, next)}
                  label={row.title}
                />
              </div>
            ))}
          </div>
        </Card>
      </Reveal>

      {/* Account */}
      <Reveal delay={0.15}>
        <Card>
          <CardHeader
            title="Account"
            subtitle="Your sign-in and demo details"
            icon={<Mail className="h-4 w-4" />}
          />
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <div className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/70">
                <Mail className="h-4 w-4 text-white/40" />
                {profile.email}
              </div>
            </div>

            <Disclaimer>
              <strong className="font-semibold text-white/60">Demo mode.</strong>{" "}
              No Supabase keys are configured, so Campus Capital is running as a
              local demo. Your edits are saved on this device only and
              aren&apos;t synced to a real account.
            </Disclaimer>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" href="/profile">
                <User className="h-4 w-4" />
                View profile
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </Card>
      </Reveal>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="glass space-y-4 rounded-3xl p-5">
        <Skeleton className="h-6 w-40" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-9 w-64" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-11 rounded-2xl" />
          <Skeleton className="h-11 rounded-2xl" />
        </div>
      </div>
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
