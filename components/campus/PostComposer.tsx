"use client";

import { useState } from "react";
import { Loader2, MailWarning, Sparkles, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Club, PostCategory } from "@/lib/types";

const CATEGORIES: PostCategory[] = [
  "Question",
  "Lesson insight",
  "Portfolio simulator",
  "Internship money",
  "Budgeting",
  "Finance career",
  "Campus club",
];

const MAX_LENGTH = 1000;

export function PostComposer({
  onPost,
  clubs,
  canPost: verified,
}: {
  onPost: (body: string, category: PostCategory, clubId: string | null) => Promise<void>;
  /** Clubs the user belongs to; they can direct a post into any of them. */
  clubs: Club[];
  /** False until the account's email is confirmed. */
  canPost: boolean;
}) {
  const { profile } = useAppState();
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<PostCategory>("Question");
  const [clubId, setClubId] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = body.trim();
  const ready = trimmed.length > 0 && trimmed.length <= MAX_LENGTH && !posting;

  async function handlePost() {
    if (!ready) return;
    setPosting(true);
    setError(null);
    try {
      await onPost(trimmed, category, clubId);
      setBody("");
      setCategory("Question");
      setClubId(null);
    } catch (e) {
      // The draft is deliberately left in the box so a failed post isn't lost.
      setError(e instanceof Error ? e.message : "Your post didn't send. Try again.");
    } finally {
      setPosting(false);
    }
  }

  if (!verified) {
    return (
      <Card className="border-amber-400/20 bg-amber-400/[0.04]">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <MailWarning className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Confirm your email to post
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-white/50">
              The feed is real students only. Click the link we sent to{" "}
              {profile.email || "your inbox"} and you can post right away.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card glow className="animate-fade-up">
      <div className="flex items-start gap-3">
        <Avatar
          name={profile.fullName}
          gradient={profile.avatarColor}
          src={profile.avatarUrl}
          size="md"
          ring
        />
        <div className="min-w-0 flex-1">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            maxLength={MAX_LENGTH}
            placeholder="What are you trying to learn about money today?"
            className="w-full resize-none bg-transparent pt-2 text-[15px] leading-relaxed text-white placeholder:text-white/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Category selector */}
      <div className="mt-2 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                active
                  ? "border-capital-400/40 bg-capital-400/15 text-capital-300 shadow-glow"
                  : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white",
              )}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Club target. Only rendered when the user is actually in a club, so the
          club feeds finally receive posts instead of always filtering to zero. */}
      {clubs.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
            <Users className="h-3.5 w-3.5" aria-hidden />
            Post to
          </span>
          <button
            type="button"
            onClick={() => setClubId(null)}
            aria-pressed={clubId === null}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-all",
              clubId === null
                ? "border-white/25 bg-white/10 text-white"
                : "border-white/10 bg-white/[0.03] text-white/55 hover:text-white",
            )}
          >
            Everyone
          </button>
          {clubs.map((c) => {
            const active = clubId === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setClubId(active ? null : c.id)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                  active
                    ? "border-violet-400/40 bg-violet-400/15 text-violet-200"
                    : "border-white/10 bg-white/[0.03] text-white/55 hover:text-white",
                )}
              >
                <span aria-hidden>{c.emoji}</span>
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-xl bg-rose-500/10 px-3 py-2 text-xs text-rose-300"
        >
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/5 pt-4">
        <p className="flex items-center gap-1.5 text-xs text-white/40">
          <Sparkles className="h-3.5 w-3.5 text-capital-300" />
          Posting as{" "}
          <span className="font-medium text-white/70">@{profile.username}</span>
        </p>
        <Button size="sm" onClick={handlePost} disabled={!ready}>
          {posting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Posting
            </>
          ) : (
            "Post"
          )}
        </Button>
      </div>
    </Card>
  );
}
