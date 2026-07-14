# Supabase setup

Run the SQL, then change two dashboard settings. **The app's email verification
does nothing until you do the second part** — the code sends the right requests,
but the project is currently configured to auto-confirm everyone.

## 1. SQL

In the Supabase SQL editor, run in order:

1. `setup.sql` (schema + RLS + seed) — safe to re-run.
2. `migrations/0003_identity_and_limits.sql` — avatars, verified-only posting
   and club membership, and the Capital Coach daily quota.

## 2. Turn ON email confirmation

**Authentication → Providers → Email**

- **Confirm email: ON.**

  Right now this is **off** (`mailer_autoconfirm: true`), which means Supabase
  marks every new address as confirmed the instant it's created and never sends
  a confirmation email. Anyone can sign up as anyone. With it on, `signUp()`
  returns a user but no session, the app holds them on "Confirm your email", and
  the link lands on `/auth/callback`.

## 3. Turn OFF anonymous sign-ins

**Authentication → Providers**

- **Anonymous sign-ins: OFF.**

  Currently on (`anonymous_users: true`). It lets anyone mint a session without
  any credentials at all, which sidesteps the whole verification gate.

## 4. Redirect URLs

**Authentication → URL Configuration → Redirect URLs**

Add every origin the confirmation link may return to, or the link will bounce:

```
http://localhost:3000/auth/callback
https://<your-production-domain>/auth/callback
```

## 5. Email sending (before you have real users)

Supabase's built-in mailer is rate-limited (a few messages an hour) and lands in
spam. It's fine for testing. Before launch, set a real SMTP provider under
**Project Settings → Auth → SMTP Settings** (Resend, Postmark, SES) with a
sending domain you control.

## Environment

`CC_COACH_DAILY_LIMIT` (default `25`) caps how many live Coach answers each
account can get per day. Every one is billed to `ANTHROPIC_API_KEY`, so this is
the spend control — the counter lives in `coach_usage` and is incremented by a
`SECURITY DEFINER` function the client cannot reset.
