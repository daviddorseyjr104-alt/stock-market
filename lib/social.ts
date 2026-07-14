"use client";

// ──────────────────────────────────────────────────────────────────────────
// Social data layer.
//
// REAL mode (Supabase configured): posts, comments, likes, and the student
// leaderboard are read from / written to the shared database. No fabricated
// users, the feed reflects only real people who actually joined.
//
// DEMO mode (no Supabase keys): an in-memory seed makes the experience
// explorable without a backend. Clearly a demo, never presented as real.
// ──────────────────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { posts as seedPosts } from "@/lib/data/posts";
import { people, personById } from "@/lib/data/people";
import { schoolById } from "@/lib/data/schools";
import { clubs as seedClubs } from "@/lib/data/clubs";
import type { PostCategory } from "@/lib/types";

export interface FeedAuthor {
  id: string;
  name: string;
  avatarColor: string;
  /** Uploaded profile picture, when the author has one. */
  avatarUrl?: string;
  schoolId: string | null;
}

export interface FeedComment {
  id: string;
  body: string;
  createdAt: string;
  author: FeedAuthor;
}

export interface FeedPost {
  id: string;
  author: FeedAuthor;
  category: PostCategory;
  body: string;
  schoolId: string | null;
  clubId?: string | null;
  likes: number;
  liked: boolean;
  comments: FeedComment[];
  createdAt: string;
  attachment?: { kind: "lesson" | "portfolio"; label: string; meta: string };
}

export interface LeaderProfile {
  id: string;
  fullName: string;
  avatarColor: string;
  xp: number;
  streak: number;
  schoolId: string | null;
  major: string;
}

export const socialIsReal = isSupabaseConfigured;

// ── Demo (in-memory) ────────────────────────────────────────────────────────
function authorFromSeed(id: string): FeedAuthor {
  const p = personById(id);
  return p
    ? { id: p.id, name: p.fullName, avatarColor: p.avatarColor, schoolId: p.schoolId }
    : { id, name: "Student", avatarColor: "from-capital-400 to-violet-500", schoolId: null };
}

let demoFeed: FeedPost[] = seedPosts.map((p) => ({
  id: p.id,
  author: authorFromSeed(p.authorId),
  category: p.category,
  body: p.body,
  schoolId: p.schoolId,
  clubId: p.clubId,
  likes: p.likes,
  liked: Boolean(p.liked),
  comments: p.comments.map((c) => ({
    id: c.id,
    body: c.body,
    createdAt: c.createdAt,
    author: authorFromSeed(c.authorId),
  })),
  createdAt: p.createdAt,
  attachment: p.attachment,
}));

// ── Public API ────────────────────────────────────────────────────────────

export async function getFeed(): Promise<FeedPost[]> {
  if (!socialIsReal) return demoFeed;

  const sb = createClient();
  if (!sb) return [];
  try {
    const {
      data: { user },
    } = await sb.auth.getUser();
    const { data, error } = await sb
      .from("posts")
      .select(
        "id, body, category, club_id, school_id, attachment, created_at, author:profiles(id, full_name, avatar_color, avatar_url, school_id), comments(id, body, created_at, author:profiles(id, full_name, avatar_color, avatar_url, school_id)), reactions(user_id)",
      )
      .order("created_at", { ascending: false })
      .limit(60);
    if (error || !data) return [];

    type Row = {
      id: string;
      body: string;
      category: PostCategory;
      club_id: string | null;
      school_id: string | null;
      attachment: FeedPost["attachment"] | null;
      created_at: string;
      author: { id: string; full_name: string; avatar_color: string; avatar_url: string | null; school_id: string | null } | null;
      comments: {
        id: string;
        body: string;
        created_at: string;
        author: { id: string; full_name: string; avatar_color: string; avatar_url: string | null; school_id: string | null } | null;
      }[];
      reactions: { user_id: string }[];
    };

    return (data as unknown as Row[]).map((r) => ({
      id: r.id,
      author: r.author
        ? { id: r.author.id, name: r.author.full_name, avatarColor: r.author.avatar_color, avatarUrl: r.author.avatar_url ?? undefined, schoolId: r.author.school_id }
        : { id: "", name: "Student", avatarColor: "from-capital-400 to-violet-500", schoolId: null },
      category: r.category,
      body: r.body,
      schoolId: r.school_id,
      clubId: r.club_id,
      likes: r.reactions?.length ?? 0,
      liked: Boolean(user && r.reactions?.some((x) => x.user_id === user.id)),
      comments: (r.comments ?? [])
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((c) => ({
          id: c.id,
          body: c.body,
          createdAt: c.created_at,
          author: c.author
            ? { id: c.author.id, name: c.author.full_name, avatarColor: c.author.avatar_color, avatarUrl: c.author.avatar_url ?? undefined, schoolId: c.author.school_id }
            : { id: "", name: "Student", avatarColor: "from-capital-400 to-violet-500", schoolId: null },
        })),
      createdAt: r.created_at,
      attachment: r.attachment ?? undefined,
    }));
  } catch {
    return [];
  }
}

export async function createPost(input: {
  body: string;
  category: PostCategory;
  clubId?: string | null;
  author: FeedAuthor;
}): Promise<FeedPost | null> {
  const optimistic: FeedPost = {
    id: `local-${Date.now()}`,
    author: input.author,
    category: input.category,
    body: input.body,
    schoolId: input.author.schoolId,
    clubId: input.clubId ?? null,
    likes: 0,
    liked: false,
    comments: [],
    createdAt: new Date().toISOString(),
  };

  if (!socialIsReal) {
    demoFeed = [optimistic, ...demoFeed];
    return optimistic;
  }

  const sb = createClient();
  if (!sb) return optimistic;
  // A failed insert used to return the optimistic post anyway, so the post
  // rendered, was never stored, and silently vanished on the next refresh.
  // Throw instead: the composer surfaces the reason and keeps the user's draft.
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("Your session expired. Sign in again to post.");
  const { data, error } = await sb
    .from("posts")
    .insert({
      author_id: user.id,
      body: input.body,
      category: input.category,
      club_id: input.clubId ?? null,
      school_id: input.author.schoolId,
    })
    .select("id, created_at")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return {
    ...optimistic,
    id: data?.id ?? optimistic.id,
    createdAt: data?.created_at ?? optimistic.createdAt,
  };
}

export async function toggleLike(postId: string, liked: boolean): Promise<void> {
  if (!socialIsReal) {
    demoFeed = demoFeed.map((p) =>
      p.id === postId ? { ...p, liked: !liked, likes: p.likes + (liked ? -1 : 1) } : p,
    );
    return;
  }
  const sb = createClient();
  if (!sb) return;
  try {
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return;
    if (liked) {
      await sb.from("reactions").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await sb.from("reactions").upsert(
        { post_id: postId, user_id: user.id, kind: "like" },
        { onConflict: "post_id,user_id,kind" },
      );
    }
  } catch {
    /* non-fatal */
  }
}

export async function addComment(
  postId: string,
  body: string,
  author: FeedAuthor,
): Promise<FeedComment> {
  const optimistic: FeedComment = {
    id: `local-${Date.now()}`,
    body,
    createdAt: new Date().toISOString(),
    author,
  };
  if (!socialIsReal) {
    demoFeed = demoFeed.map((p) =>
      p.id === postId ? { ...p, comments: [...p.comments, optimistic] } : p,
    );
    return optimistic;
  }
  const sb = createClient();
  if (!sb) return optimistic;
  try {
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return optimistic;
    const { data } = await sb
      .from("comments")
      .insert({ post_id: postId, author_id: user.id, body })
      .select("id, created_at")
      .maybeSingle();
    return { ...optimistic, id: data?.id ?? optimistic.id, createdAt: data?.created_at ?? optimistic.createdAt };
  } catch {
    return optimistic;
  }
}

export async function getStudentLeaders(): Promise<LeaderProfile[]> {
  if (!socialIsReal) {
    return people.map((p) => ({
      id: p.id,
      fullName: p.fullName,
      avatarColor: p.avatarColor,
      xp: p.xp,
      streak: p.streak,
      schoolId: p.schoolId,
      major: p.major,
    }));
  }
  const sb = createClient();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("profiles")
      .select("id, full_name, avatar_color, xp, streak, school_id, major")
      .order("xp", { ascending: false })
      .limit(100);
    return (data ?? []).map(
      (p: {
        id: string;
        full_name: string;
        avatar_color: string | null;
        xp: number | null;
        streak: number | null;
        school_id: string | null;
        major: string | null;
      }) => ({
        id: p.id,
        fullName: p.full_name ?? "Student",
        avatarColor: p.avatar_color ?? "from-capital-400 to-violet-500",
        xp: p.xp ?? 0,
        streak: p.streak ?? 0,
        schoolId: p.school_id,
        major: p.major ?? "",
      }),
    );
  } catch {
    return [];
  }
}

export const schoolShort = (id: string | null) =>
  id ? schoolById(id)?.shortName ?? "" : "";

/**
 * Real follower / following counts for the signed-in user (from the follows
 * table). Returns null in demo mode so the caller can fall back to seed values.
 */
export async function getFollowCounts(): Promise<{ followers: number; following: number } | null> {
  if (!socialIsReal) return null;
  const sb = createClient();
  if (!sb) return { followers: 0, following: 0 };
  try {
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return { followers: 0, following: 0 };
    const [followersRes, followingRes] = await Promise.all([
      sb.from("follows").select("*", { count: "exact", head: true }).eq("following_id", user.id),
      sb.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", user.id),
    ]);
    return { followers: followersRes.count ?? 0, following: followingRes.count ?? 0 };
  } catch {
    return { followers: 0, following: 0 };
  }
}

// ── Clubs ───────────────────────────────────────────────────────────────────
export interface ClubMember {
  id: string;
  fullName: string;
  avatarColor: string;
  xp: number;
  schoolId: string | null;
  major: string;
}

/** Real member counts per club (from club_members), or seed counts in demo. */
export async function getClubStats(): Promise<Record<string, number>> {
  if (!socialIsReal) {
    const out: Record<string, number> = {};
    for (const c of seedClubs) out[c.id] = c.members;
    return out;
  }
  const sb = createClient();
  if (!sb) return {};
  try {
    const { data } = await sb.from("club_members").select("club_id");
    const out: Record<string, number> = {};
    for (const row of (data ?? []) as { club_id: string }[]) {
      out[row.club_id] = (out[row.club_id] ?? 0) + 1;
    }
    return out;
  } catch {
    return {};
  }
}

/** Real members of a club (joined profiles), or seed members in demo. */
export async function getClubMembers(clubId: string): Promise<ClubMember[]> {
  if (!socialIsReal) {
    return people
      .filter((p) => p.clubs.includes(clubId))
      .map((p) => ({ id: p.id, fullName: p.fullName, avatarColor: p.avatarColor, xp: p.xp, schoolId: p.schoolId, major: p.major }));
  }
  const sb = createClient();
  if (!sb) return [];
  try {
    const { data } = await sb
      .from("club_members")
      .select("user_id, profiles(id, full_name, avatar_color, xp, school_id, major)")
      .eq("club_id", clubId)
      .limit(100);
    type Row = { profiles: { id: string; full_name: string; avatar_color: string | null; xp: number | null; school_id: string | null; major: string | null } | null };
    return ((data ?? []) as unknown as Row[])
      .map((r) => r.profiles)
      .filter((p): p is NonNullable<Row["profiles"]> => Boolean(p))
      .map((p) => ({
        id: p.id,
        fullName: p.full_name ?? "Student",
        avatarColor: p.avatar_color ?? "from-capital-400 to-violet-500",
        xp: p.xp ?? 0,
        schoolId: p.school_id,
        major: p.major ?? "",
      }))
      .sort((a, b) => b.xp - a.xp);
  } catch {
    return [];
  }
}

/** Returns an error message on failure, or null on success. */
export async function joinClub(clubId: string): Promise<string | null> {
  if (!socialIsReal) return null;
  const sb = createClient();
  if (!sb) return null;
  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return "You need to be signed in to join a club.";
    const { error } = await sb.from("club_members").upsert(
      { club_id: clubId, user_id: user.id },
      { onConflict: "club_id,user_id" },
    );
    return error ? error.message : null;
  } catch (e) {
    return e instanceof Error ? e.message : "Could not join the club.";
  }
}

export async function leaveClub(clubId: string): Promise<string | null> {
  if (!socialIsReal) return null;
  const sb = createClient();
  if (!sb) return null;
  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return "You need to be signed in.";
    const { error } = await sb
      .from("club_members")
      .delete()
      .eq("club_id", clubId)
      .eq("user_id", user.id);
    return error ? error.message : null;
  } catch (e) {
    return e instanceof Error ? e.message : "Could not leave the club.";
  }
}
