"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe, Loader2, Sparkles, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { springSoft } from "@/lib/motion";
import { useAppState } from "@/lib/store";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { Club } from "@/lib/types";

export function ClubCard({ club }: { club: Club }) {
  const { toggleClub, isClubMember, hydrated } = useAppState();
  const joined = hydrated && isClubMember(club.id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin(e: MouseEvent<HTMLButtonElement>) {
    // The whole card is a link, keep the Join click from navigating.
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    setError(null);
    const result = await toggleClub(club.id);
    setBusy(false);
    if (result.ok) {
      if (!joined) track("club_joined", { club: club.id });
      return;
    }
    setError(
      result.reason === "verify"
        ? "Confirm your email to join clubs."
        : (result.message ?? "That didn't work. Try again."),
    );
  }

  return (
    <Link href={`/clubs/${club.id}`} className="group block h-full">
      <Card
        hover
        className={cn(
          "relative flex h-full flex-col overflow-hidden",
          joined && "border-capital-400/30 shadow-glow-soft",
        )}
      >
        {/* Club-color ambient glow, brightens on hover */}
        <div
          className={cn(
            "pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-gradient-to-br blur-2xl transition-opacity duration-500",
            club.color,
            joined ? "opacity-30" : "opacity-15 group-hover:opacity-30",
          )}
        />

        {club.featured && (
          <div className="absolute -right-9 top-4 rotate-45 bg-capital-gradient px-10 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-950 shadow-glow">
            Featured
          </div>
        )}

        <div className="relative flex items-start justify-between gap-3">
          <motion.div
            whileHover={{ rotate: -6, scale: 1.06 }}
            transition={springSoft}
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-card",
              club.color,
            )}
          >
            {club.emoji}
          </motion.div>
          <div className={cn("flex flex-col items-end gap-1.5", club.featured && "mt-6")}>
            {club.category && <Pill tone="violet">{club.category}</Pill>}
            {club.schoolScope === "national" && (
              <Pill tone="sky">
                <Globe className="h-3 w-3" />
                National
              </Pill>
            )}
          </div>
        </div>

        <h3 className="relative mt-4 font-display text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-capital-300">
          {club.name}
        </h3>
        <p className="mt-1 text-sm text-white/55">{club.tagline}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <AnimatePresence mode="wait" initial={false}>
            {joined ? (
              <motion.span
                key="member"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-capital-300"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={springSoft}
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-capital-400/20"
                >
                  <Check className="h-3 w-3" />
                </motion.span>
                You&apos;re a member
              </motion.span>
            ) : (
              <motion.span
                key="early"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white/45"
              >
                <Sparkles className="h-3.5 w-3.5 text-white/30" />
                New club, be an early member
              </motion.span>
            )}
          </AnimatePresence>
          <Button
            size="sm"
            variant={joined ? "secondary" : "primary"}
            onClick={handleJoin}
            disabled={!hydrated || busy}
            aria-pressed={joined}
            className={cn(joined && "border-capital-400/30 text-capital-300")}
          >
            <AnimatePresence mode="wait" initial={false}>
              {busy ? (
                <motion.span key="busy" className="inline-flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {joined ? "Leaving" : "Joining"}
                </motion.span>
              ) : joined ? (
                <motion.span
                  key="joined"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={springSoft}
                  className="inline-flex items-center gap-1.5"
                >
                  Joined <Check className="h-3.5 w-3.5" />
                </motion.span>
              ) : (
                <motion.span
                  key="join"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={springSoft}
                  className="inline-flex items-center gap-1.5"
                >
                  <Star className="h-3.5 w-3.5" />
                  Join
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {error && (
          <p
            role="alert"
            className="relative mt-3 rounded-xl bg-rose-500/10 px-3 py-2 text-xs text-rose-300"
          >
            {error}
          </p>
        )}
      </Card>
    </Link>
  );
}
