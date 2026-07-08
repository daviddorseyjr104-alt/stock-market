"use client";

import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Check, Clock, MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { springSoft } from "@/lib/motion";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { CampusEvent } from "@/lib/types";

const KIND_META: Record<
  CampusEvent["kind"],
  {
    label: string;
    tone: "sky" | "amber" | "violet" | "capital";
    hairline: string; // kind-colored top accent
    iconTile: string; // kind-colored icon chip
    blob: string; // ambient corner glow
  }
> = {
  event: {
    label: "Event",
    tone: "sky",
    hairline: "from-sky-400/60 via-sky-400/15 to-transparent",
    iconTile: "bg-sky-400/10 text-sky-300",
    blob: "bg-sky-400/10",
  },
  competition: {
    label: "Competition",
    tone: "amber",
    hairline: "from-amber-400/60 via-amber-400/15 to-transparent",
    iconTile: "bg-amber-400/10 text-amber-300",
    blob: "bg-amber-400/10",
  },
  "office-hours": {
    label: "Office hours",
    tone: "violet",
    hairline: "from-violet-500/60 via-violet-500/15 to-transparent",
    iconTile: "bg-violet-500/10 text-violet-400",
    blob: "bg-violet-500/10",
  },
  opportunity: {
    label: "Opportunity",
    tone: "capital",
    hairline: "from-capital-400/60 via-capital-400/15 to-transparent",
    iconTile: "bg-capital-400/10 text-capital-300",
    blob: "bg-capital-400/10",
  },
};

/** "2026-09-18" → "Fri, Sep 18" without timezone drift. */
function formatEventDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function CampusEventCard({ event }: { event: CampusEvent }) {
  const { toggleRsvp, hasRsvp, hydrated } = useAppState();
  const going = hydrated && hasRsvp(event.id);
  const kind = KIND_META[event.kind];
  const Icon = (icons as unknown as Record<string, LucideIcon>)[event.icon] ?? icons.Sparkles;

  return (
    <Card
      hover
      className={cn(
        "relative flex h-full flex-col overflow-hidden",
        going && "border-capital-400/25",
      )}
    >
      {/* Kind-colored accents */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r",
          kind.hairline,
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl transition-opacity duration-500",
          kind.blob,
          going ? "opacity-90" : "opacity-50",
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
            kind.iconTile,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <Pill tone={kind.tone}>{kind.label}</Pill>
      </div>

      <h3 className="relative mt-3 font-display text-base font-semibold leading-snug tracking-tight text-white">
        {event.title}
      </h3>
      <p className="mt-0.5 text-xs font-medium text-white/45">{event.org}</p>

      <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-white/60">
        {event.description}
      </p>

      <div className="mt-4 space-y-1.5 text-xs text-white/55">
        <p className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-white/35" />
          {formatEventDate(event.date)}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 shrink-0 text-white/35" />
          {event.time}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-white/35" />
          <span className="truncate">{event.location}</span>
        </p>
      </div>

      {event.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-medium text-white/55"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <AnimatePresence mode="wait" initial={false}>
          {going ? (
            <motion.span
              key="going"
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
              You&apos;re going
            </motion.span>
          ) : (
            <motion.span
              key="first"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white/45"
            >
              <Users className="h-3.5 w-3.5 text-white/30" />
              Be the first to RSVP
            </motion.span>
          )}
        </AnimatePresence>
        <Button
          size="sm"
          variant={going ? "secondary" : "primary"}
          onClick={() => toggleRsvp(event.id)}
          disabled={!hydrated}
          aria-pressed={going}
          className={cn(going && "border-capital-400/30 text-capital-300")}
        >
          <AnimatePresence mode="wait" initial={false}>
            {going ? (
              <motion.span
                key="rsvp-on"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={springSoft}
                className="inline-flex items-center gap-1.5"
              >
                You&apos;re going <Check className="h-3.5 w-3.5" />
              </motion.span>
            ) : (
              <motion.span
                key="rsvp-off"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={springSoft}
              >
                RSVP
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </Card>
  );
}
