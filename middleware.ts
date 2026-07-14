import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/** Signed-in-only areas of the product. */
const PROTECTED = [
  "/dashboard",
  "/learn",
  "/simulator",
  "/campus",
  "/clubs",
  "/coach",
  "/profile",
  "/settings",
  "/notifications",
  "/leaderboards",
  "/challenges",
  "/search",
];

/** Pointless to show a signed-in user; bounce them to the app. */
const AUTH_ONLY = ["/login", "/signup"];

/**
 * Refreshes the Supabase session and enforces route access.
 *
 * The app used to be guarded only by a client component reading a localStorage
 * flag, so editing that flag in devtools was enough to walk into the whole
 * product. The session cookie is now the gate. (RLS is still the real authority
 * on data; this keeps unauthenticated users out of the UI.)
 *
 * In DEMO MODE (no env vars) this is a transparent no-op, so the product works
 * instantly without a backend.
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const response = NextResponse.next({ request });
  if (!url || !key) return response;

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

  // Also refreshes the session cookie as a side effect.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (!user && PROTECTED.some((p) => path === p || path.startsWith(`${p}/`))) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }

  if (user && AUTH_ONLY.some((p) => path === p)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
