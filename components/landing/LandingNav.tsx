"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Network", href: "#network" },
  { label: "Learn", href: "#learn" },
  { label: "Simulator", href: "#simulator" },
  { label: "Compete", href: "#leaderboard" },
  { label: "Coach", href: "#coach" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2.5" : "py-4",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300",
            scrolled ? "glass-strong shadow-float" : "bg-transparent",
          )}
        >
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-xl px-3.5 py-2 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-xl px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white sm:block"
            >
              Log in
            </Link>
            <Button href="/signup" size="sm">
              Start Learning
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
