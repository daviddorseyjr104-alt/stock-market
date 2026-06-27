"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  LogOut,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Goal, InvestingLevel, Interest } from "@/lib/types";

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
  const router = useRouter();
  const { profile, updateProfile, logout } = useAppState();

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

  // Notification toggles
  const [notify, setNotify] = useState({
    streak: true,
    lessons: true,
    social: true,
    rank: false,
  });

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
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile, learning, and notifications." />

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader
            title="Profile"
            subtitle="How you appear across Campus Capital"
            icon={<User className="h-4 w-4" />}
          />
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
            {profileSaved && (
              <span className="inline-flex items-center gap-1.5 text-sm text-capital-300">
                <Check className="h-4 w-4" />
                Saved
              </span>
            )}
          </div>
        </Card>

        {/* Learning preferences */}
        <Card>
          <CardHeader
            title="Learning preferences"
            subtitle="Tailor lessons and recommendations to you"
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
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-all duration-200",
                      active
                        ? "border-transparent bg-capital-gradient font-medium text-ink-950 shadow-[0_0_14px_rgba(57,245,172,0.35)]"
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

        {/* Notifications */}
        <Card>
          <CardHeader
            title="Notifications"
            subtitle="Choose what we ping you about"
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
                  onChange={(next) =>
                    setNotify((prev) => ({ ...prev, [row.key]: next }))
                  }
                  label={row.title}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Account */}
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
              <strong className="font-semibold text-white/60">
                Demo mode.
              </strong>{" "}
              No Supabase keys are configured, so Campus Capital is running as a
              local demo. Your edits here update the current session only and
              aren&apos;t saved to a real account.
            </Disclaimer>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
