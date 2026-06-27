"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileNav } from "./nav";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-900/80 backdrop-blur-2xl lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {mobileNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex flex-1 flex-col items-center gap-1 py-2.5"
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                  active ? "bg-capital-400/10" : "",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    active ? "text-capital-300" : "text-white/45",
                  )}
                />
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  active ? "text-white" : "text-white/40",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
