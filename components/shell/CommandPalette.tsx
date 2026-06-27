"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import { primaryNav, secondaryNav } from "./nav";
import { lessons } from "@/lib/data/lessons";
import { schools } from "@/lib/data/schools";
import { clubs } from "@/lib/data/clubs";
import { cn } from "@/lib/utils";

interface CmdItem {
  label: string;
  sub: string;
  href: string;
  group: string;
}

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const items: CmdItem[] = useMemo(() => {
    const nav = [...primaryNav, ...secondaryNav].map((n) => ({
      label: n.label,
      sub: "Go to page",
      href: n.href,
      group: "Navigation",
    }));
    const ls = lessons.map((l) => ({
      label: l.title,
      sub: `Lesson · ${l.difficulty} · +${l.xp} XP`,
      href: `/learn/${l.id}`,
      group: "Lessons",
    }));
    const sc = schools.map((s) => ({
      label: s.shortName,
      sub: `School · ${s.location}`,
      href: "/leaderboards",
      group: "Schools",
    }));
    const cl = clubs.map((c) => ({
      label: c.name,
      sub: "Club",
      href: `/clubs/${c.id}`,
      group: "Clubs",
    }));
    return [...nav, ...ls, ...sc, ...cl];
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return items.slice(0, 8);
    const q = query.toLowerCase();
    return items
      .filter((i) => (i.label + i.sub + i.group).toLowerCase().includes(q))
      .slice(0, 10);
  }, [query, items]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === "Enter" && filtered[active]) {
        router.push(filtered[active].href);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, active, onClose, router]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-strong w-full max-w-xl overflow-hidden rounded-3xl shadow-float"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/8 px-4">
          <Search className="h-5 w-5 text-white/40" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, students, schools, clubs…"
            className="w-full bg-transparent py-4 text-sm text-white placeholder:text-white/35 focus:outline-none"
          />
          <kbd className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-white/40">
            ESC
          </kbd>
        </div>
        <div className="max-h-[52vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-white/40">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            filtered.map((item, i) => (
              <button
                key={`${item.href}-${item.label}-${i}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                  active === i ? "bg-white/8" : "hover:bg-white/5",
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {item.label}
                  </p>
                  <p className="truncate text-xs text-white/40">{item.sub}</p>
                </div>
                <span className="shrink-0 rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                  {item.group}
                </span>
              </button>
            ))
          )}
        </div>
        <div className="flex items-center justify-between border-t border-white/8 px-4 py-2.5 text-[11px] text-white/35">
          <span className="flex items-center gap-1.5">
            <CornerDownLeft className="h-3 w-3" /> to open
          </span>
          <span>↑ ↓ to navigate</span>
        </div>
      </div>
    </div>
  );
}
