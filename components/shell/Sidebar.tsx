"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/Progress";
import { primaryNav, secondaryNav } from "./nav";
import { schoolById } from "@/lib/data/schools";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all",
        active
          ? "bg-white/8 text-white"
          : "text-white/55 hover:bg-white/5 hover:text-white",
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-capital-gradient" />
      )}
      <Icon
        className={cn(
          "h-[18px] w-[18px] transition-colors",
          active ? "text-capital-300" : "text-white/45 group-hover:text-white/80",
        )}
      />
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { profile: currentUser } = useAppState();
  const school = schoolById(currentUser.schoolId);
  const xpInLevel = currentUser.xp % 1000;

  return (
    <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col gap-4 border-r border-white/8 bg-ink-900/40 px-4 py-5 backdrop-blur-xl lg:flex">
      <div className="px-1.5">
        <Logo />
      </div>

      {/* XP / level card */}
      <Link
        href="/profile"
        className="glass rounded-2xl p-3.5 transition-colors hover:border-white/20"
      >
        <div className="flex items-center gap-3">
          <Avatar
            name={currentUser.fullName}
            gradient={currentUser.avatarColor}
            src={currentUser.avatarUrl}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {currentUser.fullName}
            </p>
            <p className="truncate text-xs text-white/45">
              {school?.shortName} · Lvl {currentUser.level}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-400/10 px-2 py-0.5 text-xs font-semibold text-orange-300">
            <Flame className="h-3 w-3" />
            {currentUser.streak}
          </span>
        </div>
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[11px] text-white/40">
            <span>{xpInLevel} / 1000 XP</span>
            <span>Lvl {currentUser.level + 1}</span>
          </div>
          <ProgressBar value={(xpInLevel / 1000) * 100} className="h-1.5" />
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto no-scrollbar">
        {primaryNav.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            Icon={item.icon}
            active={pathname === item.href || pathname.startsWith(item.href + "/")}
          />
        ))}
        <div className="my-2 border-t border-white/8" />
        {secondaryNav.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            Icon={item.icon}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <Link
        href="/"
        className="rounded-2xl border border-white/8 bg-white/[0.02] px-3.5 py-2.5 text-center text-xs text-white/45 transition-colors hover:text-white/70"
      >
        ← Back to home
      </Link>
    </aside>
  );
}
