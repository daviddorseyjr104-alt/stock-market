import Link from "next/link";
import { Globe, Sparkles, Trophy, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { clubs } from "@/lib/data/clubs";
import { currentUser } from "@/lib/data/people";
import { cn, formatCompact } from "@/lib/utils";

export default function ClubsPage() {
  return (
    <div>
      <PageHeader
        title="Clubs"
        subtitle="Find your people. Learn money together, compete campus-vs-campus, and build wealth as a community."
        action={
          <Button variant="outline" href="/campus">
            <Sparkles className="h-4 w-4" />
            Start one in your feed
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {clubs.map((club) => {
          const joined = currentUser.clubs.includes(club.id);
          return (
            <Link key={club.id} href={`/clubs/${club.id}`} className="group">
              <Card
                hover
                className={cn(
                  "flex h-full flex-col",
                  joined && "border-capital-400/30",
                )}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-card",
                      club.color,
                    )}
                  >
                    {club.emoji}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {club.schoolScope === "national" ? (
                      <Pill tone="violet">
                        <Globe className="h-3 w-3" />
                        National
                      </Pill>
                    ) : (
                      <Pill tone="sky">Single campus</Pill>
                    )}
                    {joined && <Pill tone="capital">Joined</Pill>}
                  </div>
                </div>

                {/* Body */}
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-white group-hover:text-capital-300">
                  {club.name}
                </h3>
                <p className="mt-1 text-sm text-white/55">{club.tagline}</p>

                {/* Stats */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/50">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-white/40" />
                    {club.members.toLocaleString()} members
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Trophy className="h-3.5 w-3.5 text-amber-300" />
                    {formatCompact(club.totalXp)} XP
                  </span>
                </div>

                {/* Weekly challenge */}
                <div className="mt-auto pt-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-capital-300">
                      This week
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-white/80">
                      {club.weeklyChallenge}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
