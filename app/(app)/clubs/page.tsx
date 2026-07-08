"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Star, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { ClubCard } from "@/components/clubs/ClubCard";
import { clubs } from "@/lib/data/clubs";
import { useAppState } from "@/lib/store";
import { fadeUp, staggerContainer, springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ALL = "All";

export default function ClubsPage() {
  const { profile, hydrated } = useAppState();
  const [category, setCategory] = useState<string>(ALL);
  const [onlyMine, setOnlyMine] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const c of clubs) if (c.category) set.add(c.category);
    return [ALL, ...Array.from(set).sort()];
  }, []);

  const featured = useMemo(() => clubs.filter((c) => c.featured), []);

  const filtered = useMemo(() => {
    return clubs.filter((c) => {
      if (category !== ALL && c.category !== category) return false;
      if (onlyMine && !profile.clubs.includes(c.id)) return false;
      return true;
    });
  }, [category, onlyMine, profile.clubs]);

  const joinedCount = profile.clubs.length;

  if (!hydrated) {
    return (
      <div>
        <PageHeader title="Clubs" subtitle="Find your people. Learn money together and build wealth as a community." />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Clubs"
        subtitle="Find your people. Learn money together, compete campus-vs-campus, and build wealth as a community."
        action={
          joinedCount > 0 ? (
            <Button variant="outline" onClick={() => setOnlyMine((v) => !v)}>
              <Star className="h-4 w-4" />
              {onlyMine ? "Show all clubs" : `My clubs (${joinedCount})`}
            </Button>
          ) : (
            <Button variant="outline" href="/campus">
              <Sparkles className="h-4 w-4" />
              Start one in your feed
            </Button>
          )
        }
      />

      {/* Featured row */}
      {!onlyMine && category === ALL && featured.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-capital-300" />
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white/60">
              Featured clubs
            </h2>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {featured.map((club) => (
              <motion.div key={club.id} variants={fadeUp} className="h-full">
                <ClubCard club={club} />
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Category filters, animated active pill */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="flex w-max gap-1.5">
          {categories.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                aria-pressed={isActive}
                className={cn(
                  "relative whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-transparent text-capital-300"
                    : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="club-category-pill"
                    transition={springSoft}
                    className="glow-ring absolute inset-0 rounded-full border border-capital-400/40 bg-capital-400/10"
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-capital-300" />
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white/60">
              {onlyMine ? "My clubs" : category === ALL ? "All clubs" : `${category} clubs`}
            </h2>
          </div>
          <span className="text-xs font-medium text-white/35">
            {filtered.length} {filtered.length === 1 ? "club" : "clubs"}
          </span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${category}-${onlyMine}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {filtered.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {filtered.map((club) => (
                  <motion.div key={club.id} variants={fadeUp} className="h-full">
                    <ClubCard club={club} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/10 bg-white/[0.015]">
                <div className="pointer-events-none absolute inset-0 bg-mesh" />
                <div className="relative flex flex-col items-center justify-center px-6 py-14 text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={springSoft}
                    className="glow-ring mb-4 flex h-16 w-16 animate-float items-center justify-center rounded-2xl bg-capital-400/10 text-capital-300"
                  >
                    <Users className="h-7 w-7" />
                  </motion.div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {onlyMine ? "You haven't joined a club yet" : "No clubs in this category yet"}
                  </h3>
                  <p className="mt-1.5 max-w-sm text-sm text-white/50">
                    {onlyMine
                      ? "Browse the directory and join a crew that matches your goals, your dashboard tracks them all."
                      : "Try another category, or start the conversation in your campus feed."}
                  </p>
                  <div className="mt-6">
                    {onlyMine ? (
                      <Button variant="primary" onClick={() => setOnlyMine(false)}>
                        Browse all clubs
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={() => setCategory(ALL)}>
                        Show all clubs
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
