"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquareDashed } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { PostCard } from "@/components/campus/PostCard";
import { useAppState } from "@/lib/store";
import { getFeed, toggleLike, addComment, type FeedPost, type FeedAuthor } from "@/lib/social";

export function ClubFeed({ clubId }: { clubId: string }) {
  const { profile } = useAppState();
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const me: FeedAuthor = useMemo(
    () => ({ id: profile.id, name: profile.fullName, avatarColor: profile.avatarColor, schoolId: profile.schoolId }),
    [profile.id, profile.fullName, profile.avatarColor, profile.schoolId],
  );

  useEffect(() => {
    let alive = true;
    getFeed().then((p) => {
      if (!alive) return;
      setFeed(p.filter((x) => x.clubId === clubId));
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [clubId]);

  function handleLike(post: FeedPost) {
    const wasLiked = post.liked;
    setFeed((f) => f.map((p) => (p.id === post.id ? { ...p, liked: !wasLiked, likes: p.likes + (wasLiked ? -1 : 1) } : p)));
    void toggleLike(post.id, wasLiked);
  }
  async function handleComment(post: FeedPost, body: string) {
    const comment = await addComment(post.id, body, me);
    setFeed((f) => f.map((p) => (p.id === post.id ? { ...p, comments: [...p.comments, comment] } : p)));
  }

  if (loading) return <CardSkeleton />;

  if (feed.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquareDashed className="h-7 w-7" />}
        title="No club posts yet"
        description="Posts tagged to this club appear here. Kick things off by sharing a win or a question with your community."
        action={
          <Button variant="outline" size="sm" href="/campus">
            Post to the feed
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      {feed.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUser={{ name: profile.fullName, avatarColor: profile.avatarColor }}
          onLike={() => handleLike(post)}
          onComment={(body) => handleComment(post, body)}
        />
      ))}
    </div>
  );
}
