"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { PostCategory } from "@/lib/types";

const CATEGORIES: PostCategory[] = [
  "Question",
  "Lesson insight",
  "Portfolio simulator",
  "Internship money",
  "Budgeting",
  "Finance career",
  "Campus club",
];

export function PostComposer({
  onPost,
}: {
  onPost: (body: string, category: PostCategory) => void;
}) {
  const { profile } = useAppState();
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<PostCategory>("Question");

  const canPost = body.trim().length > 0;

  const handlePost = () => {
    if (!canPost) return;
    onPost(body.trim(), category);
    setBody("");
    setCategory("Question");
  };

  return (
    <Card glow className="animate-fade-up">
      <div className="flex items-start gap-3">
        <Avatar
          name={profile.fullName}
          gradient={profile.avatarColor}
          size="md"
          ring
        />
        <div className="min-w-0 flex-1">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
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

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/5 pt-4">
        <p className="flex items-center gap-1.5 text-xs text-white/40">
          <Sparkles className="h-3.5 w-3.5 text-capital-300" />
          Posting as{" "}
          <span className="font-medium text-white/70">
            {profile.fullName}
          </span>
        </p>
        <Button size="sm" onClick={handlePost} disabled={!canPost}>
          Post
        </Button>
      </div>
    </Card>
  );
}
