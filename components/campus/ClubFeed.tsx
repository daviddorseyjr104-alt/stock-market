"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquareDashed } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { PostCard } from "@/components/campus/PostCard";
import { PostComposer } from "@/components/campus/PostComposer";
import { useAppState } from "@/lib/store";
import { track } from "@/lib/analytics";
import {
  getFeed,
  createPost,
  toggleLike,
  addComment,
  type FeedPost,
  type FeedAuthor,
} from "@/lib/social";
import type { Club, PostCategory } from "@/lib/types";

export function ClubFeed({ club }: { club: Club }) {
  const { profile, emailVerified, isClubMember, hydrated } = useAppState();
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const member = hydrated && isClubMember(club.id);

  const me: FeedAuthor = useMemo(
    () => ({ id: profile.id, name: profile.fullName, avatarColor: profile.avatarColor, avatarUrl: profile.avatarUrl, schoolId: profile.schoolId }),
    [profile.id, profile.fullName, profile.avatarColor, profile.avatarUrl, profile.schoolId],
  );

  useEffect(() => {
    let alive = true;
    getFeed().then((p) => {
      if (!alive) return;
      setFeed(p.filter((x) => x.clubId === club.id));
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [club.id]);

  // Posting straight into the club, rather than bouncing to /campus (which used
  // to create the post with club_id = null, so it never came back to this feed).
  async function handlePost(body: string, category: PostCategory) {
    const created = await createPost({ body, category, clubId: club.id, author: me });
    if (!created) return;
    setFeed((f) => [created, ...f]);
    track("post_created", { category, club: club.id });
  }

  function handleLike(post: FeedPost) {
    const wasLiked = post.liked;
    setFeed((f) => f.map((p) => (p.id === post.id ? { ...p, liked: !wasLiked, likes: p.likes + (wasLiked ? -1 : 1) } : p)));
    void toggleLike(post.id, wasLiked);
  }

  async function handleComment(post: FeedPost, body: string) {
    const comment = await addComment(post.id, body, me);
    setFeed((f) => f.map((p) => (p.id === post.id ? { ...p, comments: [...p.comments, comment] } : p)));
  }

  return (
    <div className="space-y-5">
      {member ? (
        <PostComposer
          onPost={(body, category) => handlePost(body, category)}
          clubs={[]}
          canPost={emailVerified}
        />
      ) : (
        <Card className="text-sm text-white/50">
          Join {club.name} to post to its feed.
        </Card>
      )}

      {loading ? (
        <CardSkeleton />
      ) : feed.length === 0 ? (
        <EmptyState
          icon={<MessageSquareDashed className="h-7 w-7" />}
          title="No club posts yet"
          description={
            member
              ? "Kick things off by sharing a win or a question with your community."
              : "Posts tagged to this club appear here."
          }
        />
      ) : (
        feed.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={{ name: profile.fullName, avatarColor: profile.avatarColor, avatarUrl: profile.avatarUrl }}
            onLike={() => handleLike(post)}
            onComment={(body) => handleComment(post, body)}
          />
        ))
      )}
    </div>
  );
}
