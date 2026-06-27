"use client";

import Link from "next/link";
import {
  Award,
  BellOff,
  BookOpen,
  Flame,
  MessageCircle,
  Target,
  TrendingUp,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppState } from "@/lib/store";
import { cn, timeAgo } from "@/lib/utils";
import type { NotificationType } from "@/lib/types";

const typeIcon: Record<NotificationType, LucideIcon> = {
  lesson: BookOpen,
  follow: UserPlus,
  comment: MessageCircle,
  school: TrendingUp,
  challenge: Target,
  streak: Flame,
  badge: Award,
};

const typeTint: Record<NotificationType, string> = {
  lesson: "bg-capital-400/10 text-capital-300",
  follow: "bg-violet-500/10 text-violet-400",
  comment: "bg-sky-400/10 text-sky-300",
  school: "bg-emerald-400/10 text-emerald-300",
  challenge: "bg-fuchsia-500/10 text-fuchsia-400",
  streak: "bg-amber-400/10 text-amber-300",
  badge: "bg-rose-500/10 text-rose-400",
};

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAppState();

  const sorted = [...notifications].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={
          unreadCount > 0
            ? `${unreadCount} unread`
            : "You're all caught up"
        }
        action={
          <Button
            variant="ghost"
            onClick={markAllNotificationsRead}
            disabled={unreadCount === 0}
          >
            Mark all read
          </Button>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon={<BellOff className="h-7 w-7" />}
          title="No notifications"
          description="When you earn badges, get followers, or your campus moves up, it'll show up here."
          action={
            <Button href="/learn" size="sm">
              Start learning
            </Button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {sorted.map((n) => {
            const Icon = typeIcon[n.type];
            const inner = (
              <>
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    typeTint[n.type],
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        n.read ? "text-white/75" : "text-white",
                      )}
                    >
                      {n.title}
                    </p>
                    <span className="shrink-0 text-xs text-white/40">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm leading-relaxed text-white/55">
                    {n.body}
                  </p>
                </div>
                {!n.read && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-capital-400 shadow-[0_0_8px_rgba(57,245,172,0.7)]" />
                )}
              </>
            );

            const className = cn(
              "flex items-start gap-3.5 rounded-2xl border p-4 transition-all duration-200",
              n.read
                ? "border-white/8 bg-white/[0.015] hover:bg-white/[0.03]"
                : "border-capital-400/20 bg-capital-400/[0.04] hover:bg-capital-400/[0.07]",
            );

            return n.href ? (
              <Link
                key={n.id}
                href={n.href}
                onClick={() => markNotificationRead(n.id)}
                className={className}
              >
                {inner}
              </Link>
            ) : (
              <button
                key={n.id}
                type="button"
                onClick={() => markNotificationRead(n.id)}
                className={cn(className, "w-full text-left")}
              >
                {inner}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
