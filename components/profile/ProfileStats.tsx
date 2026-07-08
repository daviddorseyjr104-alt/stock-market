"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, Flame, ScrollText, Trophy, Zap } from "lucide-react";
import type { Profile } from "@/lib/types";
import { StatCard } from "@/components/ui/StatCard";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ProgressBar } from "@/components/ui/Progress";
import { pop, staggerContainer } from "@/lib/motion";
import { useAppState, levelForXp, xpProgressInLevel, XP_PER_LEVEL } from "@/lib/store";

/**
 * The profile stat row: level, XP, streak, lessons, badges and certificates.
 * Everything is read from real earned state, nothing fabricated. Numbers
 * count up as they scroll into view.
 */
export function ProfileStats({ profile }: { profile: Profile }) {
  const { certificates } = useAppState();
  const level = levelForXp(profile.xp);
  const { inLevel, pct } = xpProgressInLevel(profile.xp);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6"
    >
      <motion.div variants={pop}>
        <StatCard
          label="Level"
          value={
            <span>
              Lv. <AnimatedNumber value={level} />
            </span>
          }
          sub={
            <div className="space-y-1">
              <ProgressBar value={pct} className="h-1.5" />
              <span className="block">
                {inLevel}/{XP_PER_LEVEL} XP to next
              </span>
            </div>
          }
          icon={<Trophy className="h-4 w-4" />}
          tone="capital"
        />
      </motion.div>
      <motion.div variants={pop}>
        <StatCard
          label="Total XP"
          value={<AnimatedNumber value={profile.xp} />}
          sub="Earned from lessons"
          icon={<Zap className="h-4 w-4" />}
          tone="amber"
        />
      </motion.div>
      <motion.div variants={pop}>
        <StatCard
          label="Streak"
          value={
            <span>
              <AnimatedNumber value={profile.streak} />{" "}
              {profile.streak === 1 ? "day" : "days"}
            </span>
          }
          sub={profile.streak > 0 ? "Keep the flame alive" : "Finish a lesson to start"}
          icon={<Flame className="h-4 w-4" />}
          tone="rose"
        />
      </motion.div>
      <motion.div variants={pop}>
        <StatCard
          label="Lessons"
          value={<AnimatedNumber value={profile.completedLessons.length} />}
          sub="Completed"
          icon={<BookOpen className="h-4 w-4" />}
          tone="capital"
        />
      </motion.div>
      <motion.div variants={pop}>
        <StatCard
          label="Badges"
          value={<AnimatedNumber value={profile.badges.length} />}
          sub="Earned"
          icon={<Award className="h-4 w-4" />}
          tone="violet"
        />
      </motion.div>
      <motion.div variants={pop}>
        <StatCard
          label="Certificates"
          value={<AnimatedNumber value={certificates.length} />}
          sub="Courses finished"
          icon={<ScrollText className="h-4 w-4" />}
          tone="amber"
        />
      </motion.div>
    </motion.div>
  );
}
