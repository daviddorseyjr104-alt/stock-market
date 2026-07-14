"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Flame,
  LineChart,
  MessageSquareDashed,
  Rocket,
  UserPlus,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Pill } from "@/components/ui/Pill";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { PostCard } from "@/components/campus/PostCard";
import { PostComposer } from "@/components/campus/PostComposer";
import { clubs } from "@/lib/data/clubs";
import { useAppState } from "@/lib/store";
import {
  getFeed,
  getStudentLeaders,
  createPost,
  toggleLike,
  addComment,
  schoolShort,
  socialIsReal,
  type FeedPost,
  type FeedAuthor,
  type LeaderProfile,
} from "@/lib/social";
import { track } from "@/lib/analytics";
import { fadeUp, staggerContainer, springSoft } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { PostCategory } from "@/lib/types";

// The Events / Competitions / Office-hours / Opportunities tabs used to live
// here. They were a hardcoded list of UCLA happenings with an RSVP button that
// wrote to localStorage and nowhere else — unmaintainable for any campus we
// don't physically run, so they're gone. Campus is now the student feed.

export default function CampusPage() {
  const { profile } = useAppState();

  const financeClubs = useMemo(
    () => clubs.filter((c) => c.category === "Finance" || c.category === "Investing").slice(0, 3),
    [],
  );
  const startupClubs = useMemo(
    () =>
      clubs
        .filter((c) => c.category === "Startup" || c.category === "Consulting" || c.category === "Analytics")
        .slice(0, 3),
    [],
  );

  return (
    <div>
      <PageHeader
        title="Campus"
        subtitle="Your money-learning network. Questions, wins, and what students are figuring out together."
      />

      <CampusFeed />

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-capital-300" />
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white/60">
              Find your crew
            </h2>
          </div>
          <Button variant="ghost" size="sm" href="/clubs">
            All clubs
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          <motion.div variants={fadeUp}>
            <ClubPreviewCard
              title="Finance clubs"
              subtitle="Investing, wealth-building, and market crews"
              icon={<LineChart className="h-4 w-4" />}
              list={financeClubs}
              memberClubs={profile.clubs}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <ClubPreviewCard
              title="Startup clubs"
              subtitle="Founders, casers, and builders"
              icon={<Rocket className="h-4 w-4" />}
              list={startupClubs}
              memberClubs={profile.clubs}
            />
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

/* ── Club preview ─────────────────────────────────────────────────────── */

function ClubPreviewCard({
  title,
  subtitle,
  icon,
  list,
  memberClubs,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  list: typeof clubs;
  memberClubs: string[];
}) {
  return (
    <Card hover className="h-full">
      <CardHeader
        title={title}
        subtitle={subtitle}
        icon={icon}
        action={
          <Button variant="ghost" size="sm" href="/clubs">
            Browse
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        }
      />
      <ul className="space-y-2">
        {list.map((club) => {
          const joined = memberClubs.includes(club.id);
          return (
            <li key={club.id}>
              <Link
                href={`/clubs/${club.id}`}
                className="group flex items-center gap-3 rounded-2xl border border-transparent px-2.5 py-2 transition-all hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg transition-transform duration-300 group-hover:scale-110",
                    club.color,
                  )}
                >
                  {club.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white group-hover:text-capital-300">
                    {club.name}
                  </p>
                  <p className="truncate text-xs text-white/45">{club.tagline}</p>
                </div>
                {joined ? (
                  <Pill tone="capital" className="shrink-0">
                    Joined
                  </Pill>
                ) : (
                  <ArrowRight className="h-4 w-4 shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-capital-300" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ── Social feed (unchanged behavior, now a tab) ─────────────────────── */

type FeedFilter = "My Campus" | "Following" | "National" | "Clubs";
const FEED_FILTERS: FeedFilter[] = ["My Campus", "Following", "National", "Clubs"];

function CampusFeed() {
  const { profile, emailVerified } = useAppState();
  const [filter, setFilter] = useState<FeedFilter>("My Campus");
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<LeaderProfile[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  const me: FeedAuthor = useMemo(
    () => ({ id: profile.id, name: profile.fullName, avatarColor: profile.avatarColor, avatarUrl: profile.avatarUrl, schoolId: profile.schoolId }),
    [profile.id, profile.fullName, profile.avatarColor, profile.avatarUrl, profile.schoolId],
  );

  // You can only post into a club you actually belong to.
  const myClubs = useMemo(
    () => clubs.filter((c) => profile.clubs.includes(c.id)),
    [profile.clubs],
  );

  useEffect(() => {
    let alive = true;
    Promise.all([getFeed(), getStudentLeaders()]).then(([posts, leaders]) => {
      if (!alive) return;
      setFeed(posts);
      // Only suggest real students, never seeded demo people.
      setSuggestions(socialIsReal ? leaders.filter((p) => p.id !== profile.id).slice(0, 4) : []);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [profile.id]);

  // `clubId` was never plumbed through here, so every post saved with
  // club_id = NULL and club feeds (which filter on it) were empty by
  // construction. The composer now passes the chosen club.
  async function handlePost(body: string, category: PostCategory, clubId: string | null) {
    const created = await createPost({ body, category, clubId, author: me });
    if (created) {
      setFeed((f) => [created, ...f]);
      track("post_created", { category });
      setFilter(clubId ? "Clubs" : "My Campus");
    }
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
    switch (filter) {
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
  }, [filter, feed, profile.schoolId, following]);

  const emptyCopy: Record<FeedFilter, { title: string; description: string }> = {
    "My Campus": { title: "Your campus is quiet", description: "No posts from your school yet. Start the conversation, ask a money question or share what you just learned." },
    Following: { title: "Nothing from your circle yet", description: "Follow students from the suggestions on the right and their posts will show up here." },
    National: { title: "The feed is just getting started", description: "Be the first to post and get the conversation going." },
    Clubs: { title: "No club posts yet", description: "Club activity lands here. Join a club and rally your community." },
  };

  return (
    <div>
      <div className="mb-5 inline-flex flex-wrap gap-1.5">
        {FEED_FILTERS.map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={isActive}
              className={cn(
                "relative rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "border-transparent text-capital-300"
                  : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="feed-filter-pill"
                  transition={springSoft}
                  className="absolute inset-0 rounded-full border border-capital-400/40 bg-capital-400/10"
                />
              )}
              <span className="relative z-10">{f}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <PostComposer
            onPost={handlePost}
            clubs={myClubs}
            canPost={emailVerified}
          />

          {loading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : visible.length > 0 ? (
            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">
              {visible.map((post) => (
                <motion.div key={post.id} variants={fadeUp}>
                  <PostCard
                    post={post}
                    currentUser={{ name: profile.fullName, avatarColor: profile.avatarColor, avatarUrl: profile.avatarUrl }}
                    onLike={() => handleLike(post)}
                    onComment={(body) => handleComment(post, body)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState
              icon={<MessageSquareDashed className="h-7 w-7" />}
              title={emptyCopy[filter].title}
              description={emptyCopy[filter].description}
            />
          )}
        </div>

        <aside className="hidden space-y-6 lg:block">
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

          <Card className="sheen relative overflow-hidden bg-capital-400/[0.04]">
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 animate-breathe rounded-full bg-capital-400/10 blur-2xl" />
            <div className="relative flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-capital-400/10 text-capital-300">
                <Flame className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  You&apos;re on a {profile.streak}-day streak
                </p>
                <p className="mt-0.5 text-xs text-white/50">
                  Keep it alive. Post a lesson insight to share what clicked today.
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
