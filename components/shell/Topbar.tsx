"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Bell, Command } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CommandPalette } from "./CommandPalette";
import { useAppState } from "@/lib/store";

export function Topbar() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { unreadCount: unread } = useAppState();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/8 bg-ink-950/70 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
          <div className="lg:hidden">
            <Logo showText={false} />
          </div>

          {/* Search trigger */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="group flex flex-1 items-center gap-2.5 rounded-2xl border border-white/8 bg-white/[0.02] px-3.5 py-2 text-left transition-colors hover:border-white/15 sm:max-w-sm"
          >
            <Search className="h-4 w-4 text-white/40" />
            <span className="flex-1 text-sm text-white/40">Search everything...</span>
            <kbd className="hidden items-center gap-0.5 rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-white/40 sm:flex">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            <Link
              href="/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.02] text-white/60 transition-colors hover:border-white/15 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-capital-gradient px-1 text-[10px] font-bold text-ink-950">
                  {unread}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
