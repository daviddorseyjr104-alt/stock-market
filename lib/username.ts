import { createClient } from "@/lib/supabase/client";

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;

const SHAPE = /^[a-z0-9_]+$/;
// Names the product itself uses, plus the old auto-generated default. Letting a
// user claim "guest" or "admin" would make them impersonable in the feed.
const RESERVED = new Set([
  "guest",
  "admin",
  "administrator",
  "campuscapital",
  "campus_capital",
  "support",
  "help",
  "official",
  "moderator",
  "mod",
  "staff",
  "team",
  "root",
  "system",
  "null",
  "undefined",
  "me",
  "you",
]);

/** Normalizes to the only shape we store: lowercase, digits, underscores. */
export function normalizeUsername(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, USERNAME_MAX);
}

/** Returns an error message, or null when the username is structurally valid. */
export function validateUsername(name: string): string | null {
  if (name.length < USERNAME_MIN) {
    return `At least ${USERNAME_MIN} characters.`;
  }
  if (name.length > USERNAME_MAX) {
    return `At most ${USERNAME_MAX} characters.`;
  }
  if (!SHAPE.test(name)) {
    return "Letters, numbers and underscores only.";
  }
  if (RESERVED.has(name)) {
    return "That username is reserved.";
  }
  return null;
}

/** Suggests a starting username from a full name or email local-part. */
export function suggestUsername(seed: string): string {
  const base = normalizeUsername(seed.split("@")[0].replace(/[.\s-]+/g, "_"));
  return base.length >= USERNAME_MIN ? base : `${base}_student`.slice(0, USERNAME_MAX);
}

export type UsernameStatus =
  | { state: "idle" | "checking" }
  | { state: "available" }
  | { state: "taken" | "invalid"; message: string };

/**
 * Checks the UNIQUE `profiles.username` column.
 *
 * This is advisory, not a lock — two people can pass the check at the same
 * instant. The database constraint is the real guard; this just means the
 * collision is a friendly inline hint instead of a failed save.
 */
export async function checkUsername(
  name: string,
  selfId?: string,
): Promise<UsernameStatus> {
  const invalid = validateUsername(name);
  if (invalid) return { state: "invalid", message: invalid };

  const supabase = createClient();
  if (!supabase) return { state: "available" };

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", name)
    .maybeSingle();

  // Treat a lookup failure as "not obviously taken" and let the insert decide,
  // rather than blocking signup on a transient network error.
  if (error) return { state: "available" };
  if (!data || data.id === selfId) return { state: "available" };
  return { state: "taken", message: "That username is taken." };
}
