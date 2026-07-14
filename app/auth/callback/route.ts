import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Landing point for the email-confirmation link.
 *
 * Supabase sends the user here with a one-time `code`; exchanging it is what
 * actually marks the address confirmed and mints a session. Without this route
 * the confirmation link in the email has nowhere to land, which is why nothing
 * was ever verified.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!code || !url || !key) {
    return NextResponse.redirect(`${origin}/login?error=invalid_link`);
  }

  const response = NextResponse.redirect(`${origin}${next}`);
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // Expired or already-used links are the common case here, not a bug.
    return NextResponse.redirect(`${origin}/login?error=expired_link`);
  }

  return response;
}
