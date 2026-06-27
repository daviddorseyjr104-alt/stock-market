"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Flame, MessageSquareDashed, TrendingUp, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { PostCard } from "@/components/campus/PostCard";
import { PostComposer } from "@/components/campus/PostComposer";
import { schoolById } from "@/lib/data/schools";
import { useAppState } from "@/lib/store";
import {
  getFeed,
  getStudentLeaders,
  createPost,
  toggleLike,
  addComment,
  schoolShort,
  type FeedPost,
  type FeedAuthor,
  type LeaderProfile,
} from "@/lib/social";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { PostCategory } from "@/lib/types";

type FeedTab = "My Campus" | "Following" | "National" | "Clubs";
const TABS: FeedTab[] = ["My Campus", "Following", "National", "Clubs"];

const TOPICS = ["#RothIRA", "#FirstPaycheck", "#ETFs", "#BudgetSeason", "#InternshipMoney"];

export default function CampusPage() {
  const { profile } = useAppState();
  const [tab, setTab] = useState<FeedTab>("My Campus");
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<LeaderProfile[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  const me: FeedAuthor = useMemo(
    () => ({ id: profile.id, name: profile.fullName, avatarColor: profile.avatarColor, schoolId: profile.schoolId }),
    [profile.id, profile.fullName, profile.avatarColor, profile.schoolId],
  );

  useEffect(() => {
    let alive = true;
    Promise.all([getFeed(), getStudentLeaders()]).then(([posts, leaders]) => {
      if (!alive) return;
      setFeed(posts);
      setSuggestions(leaders.filter((p) => p.id !== profile.id).slice(0, 4));
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [profile.id]);

  async function handlePost(body: string, category: PostCategory) {
    const created = await createPost({ body, category, author: me });
    if (created) {
      setFeed((f) => [created, ...f]);
      track("post_created", { category });
    }
    setTab("My Campus");
  }

  function handleLike(post: FeedPost) {
    const wasLiked = post.liked;
    setFeed((f) =>
      f.map((p) => (p.id === post.id ? { ...p, liked: !wasLiked, likes: p.likes + (wasLiked ? -1 : 1) } : p)),
    );
    void toggleLike(post.id, wasLiked);
  }

  async function handleComment(post: FeedPost, body: string) {
    const comment = await addComment(post.id, body, me);
    setFeed((f) => f.map((p) => (p.id === post.id ? { ...p, comments: [...p.comments, comment] } : p)));
  }

  const visible = useMemo(() => {
    switch (tab) {
      case "My Campus":
        return feed.filter((p) => (p.schoolId ?? p.author.schoolId) === profile.schoolId);
      case "Following":
        return feed.filter((p) => following.includes(p.author.id));
      case "Clubs":
        return feed.filter((p) => Boolean(p.clubId));
      case "National":
      default:
        return feed;
    }
  }, [tab, feed, profile.schoolId, following]);

  const emptyCopy: Record<FeedTab, { title: string; description: string }> = {
    "My Campus": { title: "Your campus is quiet", description: "No posts from your school yet. Start the conversation, ask a money question or share what you just learned." },
    Following: { title: "Nothing from your circle yet", description: "Follow students from the suggestions on the right and their posts will show up here." },
    National: { title: "The feed is just getting started", description: "Be the first to post and get the conversation going." },
    Clubs: { title: "No club posts yet", description: "Club activity lands here. Join a club and rally your community." },
  };

  return (
    <div>
      <PageHeader
        title="Campus"
        subtitle="Your money-learning network. Questions, wins, and what students are figuring out together."
      />

      <div className="mb-6 inline-flex rounded-2xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={cn(
              "rounded-xl px-3.5 py-1.5 text-sm font-medium transition-all sm:px-4",
              tab === t ? "bg-capital-gradient text-ink-950 shadow-glow" : "text-white/55 hover:text-white",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <PostComposer onPost={handlePost} />

          {loading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : visible.length > 0 ? (
            visible.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={{ name: profile.fullName, avatarColor: profile.avatarColor }}
                onLike={() => handleLike(post)}
                onComment={(body) => handleComment(post, body)}
              />
            ))
          ) : (
            <EmptyState
              icon={<MessageSquareDashed className="h-7 w-7" />}
              title={emptyCopy[tab].title}
              description={emptyCopy[tab].description}
            />
          )}
        </div>

        <aside className="hidden space-y-6 lg:block">
          <Card>
            <CardHeader title="Popular topics" subtitle="What students learn about" icon={<TrendingUp className="h-4 w-4" />} />
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/75 transition-colors hover:border-capital-400/40 hover:text-capital-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </Card>

          {suggestions.length > 0 && (
            <Card>
              <CardHeader title="Who to follow" subtitle="Students worth learning from" icon={<UserPlus className="h-4 w-4" />} />
              <ul className="space-y-4">
                {suggestions.map((person) => {
                  const isFollowing = following.includes(person.id);
                  return (
                    <li key={person.id} className="flex items-center gap-3">
                      <Avatar name={person.fullName} gradient={person.avatarColor} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{person.fullName}</p>
                        <p className="truncate text-xs text-white/45">
                          {schoolShort(person.schoolId)}
                          {person.major ? ` · ${person.major}` : ""}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={isFollowing ? "secondary" : "outline"}
                        onClick={() =>
                          setFollowing((prev) =>
                            isFollowing ? prev.filter((id) => id !== person.id) : [...prev, person.id],
                          )
                        }
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

          <Card className="bg-capital-400/[0.04]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-capital-400/10 text-capital-300">
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">You&apos;re on a {profile.streak}-day streak</p>
                <p className="mt-0.5 text-xs text-white/50">Keep it alive. Post a lesson insight to share what clicked today.</p>
                <Link href="/clubs" className="mt-2 inline-block text-xs font-semibold text-capital-300 hover:text-capital-200">
                  Explore campus clubs →
                </Link>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
