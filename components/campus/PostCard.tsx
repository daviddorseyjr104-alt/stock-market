"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, Send, BookOpen, PieChart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Avatar } from "@/components/ui/Avatar";
import { schoolById } from "@/lib/data/schools";
import { cn, timeAgo } from "@/lib/utils";
import type { PostCategory } from "@/lib/types";
import type { FeedPost } from "@/lib/social";

const categoryTone: Record<
  PostCategory,
  "capital" | "violet" | "amber" | "rose" | "sky" | "default"
> = {
  Question: "sky",
  "Lesson insight": "capital",
  "Portfolio simulator": "violet",
  "Internship money": "amber",
  Budgeting: "default",
  "Finance career": "rose",
  "Campus club": "violet",
};

export function PostCard({
  post,
  currentUser,
  onLike,
  onComment,
}: {
  post: FeedPost;
  currentUser: { name: string; avatarColor: string };
  onLike: () => void;
  onComment: (body: string) => void;
}) {
  const school = schoolById(post.author.schoolId ?? post.schoolId ?? "");
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");

  const submitComment = () => {
    const body = draft.trim();
    if (!body) return;
    onComment(body);
    setDraft("");
    setShowComments(true);
  };

  return (
    <Card hover className="animate-fade-up">
      <div className="flex items-start gap-3">
        <Avatar name={post.author.name} gradient={post.author.avatarColor} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="truncate font-semibold text-white">{post.author.name}</span>
            {school && (
              <span className="text-xs font-medium text-capital-300">
                {school.emoji} {school.shortName}
              </span>
            )}
            <span className="text-xs text-white/35">·</span>
            <span className="text-xs text-white/40">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        <Pill tone={categoryTone[post.category]}>{post.category}</Pill>
      </div>

      <p className="mt-3.5 whitespace-pre-wrap text-[15px] leading-relaxed text-white/85">
        {post.body}
      </p>

      {post.attachment && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition-colors hover:border-white/20">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              post.attachment.kind === "lesson" ? "bg-capital-400/10 text-capital-300" : "bg-violet-500/10 text-violet-400",
            )}
          >
            {post.attachment.kind === "lesson" ? <BookOpen className="h-5 w-5" /> : <PieChart className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{post.attachment.label}</p>
            <p className="truncate text-xs text-white/45">{post.attachment.meta}</p>
          </div>
          <Pill tone={post.attachment.kind === "lesson" ? "capital" : "violet"} className="capitalize">
            {post.attachment.kind}
          </Pill>
        </div>
      )}

      <div className="mt-4 flex items-center gap-1 border-t border-white/5 pt-3">
        <button
          type="button"
          onClick={onLike}
          aria-pressed={post.liked}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/5",
            post.liked ? "text-capital-300" : "text-white/55 hover:text-white",
          )}
        >
          <Heart className={cn("h-[18px] w-[18px]", post.liked && "fill-capital-400")} />
          <span className="tabular-nums">{post.likes}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowComments((s) => !s)}
          aria-expanded={showComments}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white/5",
            showComments ? "text-white" : "text-white/55 hover:text-white",
          )}
        >
          <MessageCircle className="h-[18px] w-[18px]" />
          <span className="tabular-nums">{post.comments.length}</span>
        </button>
        <button
          type="button"
          className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-white/55 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Share2 className="h-[18px] w-[18px]" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-3 space-y-4 border-t border-white/5 pt-4">
          {post.comments.length > 0 ? (
            <ul className="space-y-3.5">
              {post.comments.map((comment) => (
                <li key={comment.id} className="flex items-start gap-2.5">
                  <Avatar name={comment.author.name} gradient={comment.author.avatarColor} size="xs" />
                  <div className="min-w-0 flex-1 rounded-2xl bg-white/[0.03] px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{comment.author.name}</span>
                      <span className="text-xs text-white/35">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-white/75">{comment.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/40">No comments yet, be the first to chime in.</p>
          )}

          <div className="flex items-center gap-2.5">
            <Avatar name={currentUser.name} gradient={currentUser.avatarColor} size="xs" />
            <div className="flex flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-4 pr-1 focus-within:border-white/20">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitComment();
                  }
                }}
                placeholder="Add a comment..."
                className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
              />
              <button
                type="button"
                onClick={submitComment}
                disabled={!draft.trim()}
                aria-label="Post comment"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-capital-gradient text-ink-950 transition-all hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
