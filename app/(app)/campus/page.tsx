"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Flame, MessageSquareDashed, TrendingUp, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { PostCard } from "@/components/campus/PostCard";
import { PostComposer } from "@/components/campus/PostComposer";
import { people } from "@/lib/data/people";
import { schoolById } from "@/lib/data/schools";
import { useAppState } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { PostCategory } from "@/lib/types";

type FeedTab = "My Campus" | "Following" | "National" | "Clubs";

const TABS: FeedTab[] = ["My Campus", "Following", "National", "Clubs"];

const TRENDING = [
  { tag: "#RothIRA", count: 1284 },
  { tag: "#FirstPaycheck", count: 942 },
  { tag: "#ETFs", count: 871 },
  { tag: "#BudgetSeason", count: 638 },
  { tag: "#InternshipMoney", count: 511 },
];

export default function CampusPage() {
  const { profile, posts, addPost } = useAppState();
  const [tab, setTab] = useState<FeedTab>("My Campus");
  const [following, setFollowing] = useState<string[]>([]);

  const handlePost = (body: string, category: PostCategory) => {
    addPost(body, category);
    setTab("My Campus");
  };

  const visible = useMemo(() => {
    switch (tab) {
      case "My Campus":
        return posts.filter((p) => p.schoolId === profile.schoolId);
      case "Following":
        // Stand-in: everything from people other than yourself.
        return posts.filter((p) => p.authorId !== profile.id);
      case "Clubs":
        return posts.filter((p) => Boolean(p.clubId));
      case "National":
      default:
        return posts;
    }
  }, [tab, posts, profile.schoolId, profile.id]);

  const suggestions = people
    .filter((p) => p.id !== profile.id)
    .slice(0, 4);

  const emptyCopy: Record<FeedTab, { title: string; description: string }> = {
    "My Campus": {
      title: "Your campus is quiet",
      description:
        "No posts from your school yet. Start the conversation — ask a money question or share what you just learned.",
    },
    Following: {
      title: "Nothing from your circle yet",
      description:
        "Follow students from the suggestions on the right and their posts will show up here.",
    },
    National: {
      title: "The national feed is empty",
      description: "Be the first to post and get the conversation going.",
    },
    Clubs: {
      title: "No club posts yet",
      description:
        "Club activity lands here. Join a club and rally your community.",
    },
  };

  return (
    <div>
      <PageHeader
        title="Campus"
        subtitle="Your money-learning network — questions, wins, and what students are figuring out together."
      />

      {/* Feed tabs (segmented control) */}
      <div className="mb-6 inline-flex rounded-2xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={cn(
              "rounded-xl px-3.5 py-1.5 text-sm font-medium transition-all sm:px-4",
              tab === t
                ? "bg-capital-gradient text-ink-950 shadow-glow"
                : "text-white/55 hover:text-white",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main feed */}
        <div className="min-w-0 space-y-5">
          <PostComposer onPost={handlePost} />

          {visible.length > 0 ? (
            visible.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <EmptyState
              icon={<MessageSquareDashed className="h-7 w-7" />}
              title={emptyCopy[tab].title}
              description={emptyCopy[tab].description}
            />
          )}
        </div>

        {/* Right rail */}
        <aside className="hidden space-y-6 lg:block">
          <Card>
            <CardHeader
              title="Trending on campus"
              subtitle="What students are talking about"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((t) => (
                <span
                  key={t.tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/75 transition-colors hover:border-capital-400/40 hover:text-capital-300"
                >
                  {t.tag}
                  <span className="text-white/35">
                    {t.count.toLocaleString()}
                  </span>
                </span>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Who to follow"
              subtitle="Students worth learning from"
              icon={<UserPlus className="h-4 w-4" />}
            />
            <ul className="space-y-4">
              {suggestions.map((person) => {
                const school = schoolById(person.schoolId);
                const isFollowing = following.includes(person.id);
                return (
                  <li key={person.id} className="flex items-center gap-3">
                    <Avatar
                      name={person.fullName}
                      gradient={person.avatarColor}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {person.fullName}
                      </p>
                      <p className="truncate text-xs text-white/45">
                        {school?.shortName} · @{person.username}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={isFollowing ? "secondary" : "outline"}
                      onClick={() =>
                        setFollowing((prev) =>
                          isFollowing
                            ? prev.filter((id) => id !== person.id)
                            : [...prev, person.id],
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

          <Card className="bg-capital-400/[0.04]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-capital-400/10 text-capital-300">
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  You&apos;re on a {profile.streak}-day streak
                </p>
                <p className="mt-0.5 text-xs text-white/50">
                  Keep it alive — post a lesson insight to share what clicked
                  today.
                </p>
                <Link
                  href="/clubs"
                  className="mt-2 inline-block text-xs font-semibold text-capital-300 hover:text-capital-200"
                >
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
