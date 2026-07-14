"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AvatarPicker } from "@/components/profile/AvatarPicker";
import { useAppState } from "@/lib/store";
import {
  checkUsername,
  normalizeUsername,
  suggestUsername,
  validateUsername,
  type UsernameStatus,
} from "@/lib/username";
import { cn, initials } from "@/lib/utils";
import type { Profile } from "@/lib/types";

/**
 * Catches signed-in accounts that never chose a handle or picture.
 *
 * Usernames used to be auto-derived from the email local-part and there was no
 * avatar field at all, so anyone who signed up before that changed is sitting on
 * a machine-generated identity they never agreed to. Rather than silently
 * keeping it, ask once, here, before they use the app.
 */
export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { hydrated, authed, onboarded, profile } = useAppState();

  if (!hydrated || !authed || onboarded) return <>{children}</>;
  return <OnboardingForm profile={profile} />;
}

function OnboardingForm({ profile }: { profile: Profile }) {
  const { completeOnboarding } = useAppState();
  const [username, setUsername] = useState(() =>
    // A handle they already picked is a fine starting point; a derived one isn't.
    profile.username && profile.username !== "guest"
      ? profile.username
      : suggestUsername(profile.fullName || profile.email),
  );
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [status, setStatus] = useState<UsernameStatus>({ state: "idle" });

  useEffect(() => {
    const invalid = validateUsername(username);
    if (invalid) {
      setStatus({ state: "invalid", message: invalid });
      return;
    }
    setStatus({ state: "checking" });
    const id = setTimeout(() => {
      checkUsername(username, profile.id).then(setStatus);
    }, 400);
    return () => clearTimeout(id);
  }, [username, profile.id]);

  const ready = status.state === "available";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-ink-950 p-5">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">
          Set up your profile
        </h1>
        <p className="mt-2 text-sm text-white/55">
          This is how other students see you on the feed and leaderboards.
        </p>

        <div className="mt-7 space-y-5">
          <AvatarPicker
            value={avatarUrl}
            onChange={setAvatarUrl}
            userId={profile.id}
            fallback={initials(profile.fullName)}
            gradient={profile.avatarColor}
          />

          <div>
            <label
              htmlFor="onboarding-username"
              className="mb-1.5 block text-sm font-medium text-white/70"
            >
              Username
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 focus-within:border-capital-400/50">
              <span className="text-white/40">@</span>
              <input
                id="onboarding-username"
                value={username}
                onChange={(e) => setUsername(normalizeUsername(e.target.value))}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
              {status.state === "checking" && (
                <Loader2
                  className="h-4 w-4 shrink-0 animate-spin text-white/40"
                  aria-hidden
                />
              )}
            </div>
            <p
              className={cn(
                "mt-1.5 text-xs",
                status.state === "taken" || status.state === "invalid"
                  ? "text-rose-400"
                  : "text-white/35",
              )}
            >
              {status.state === "taken" || status.state === "invalid"
                ? status.message
                : "Letters, numbers and underscores."}
            </p>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={!ready}
            onClick={() => completeOnboarding({ username, avatarUrl })}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
