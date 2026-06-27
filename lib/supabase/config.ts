export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Campus Capital runs in a fully-functional DEMO MODE with rich mock data when
 * Supabase credentials are absent. This flag lets the UI adapt gracefully and
 * lets auth fall back to a local demo session.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
