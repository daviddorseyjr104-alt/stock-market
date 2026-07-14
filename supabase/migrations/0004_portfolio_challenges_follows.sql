-- ─────────────────────────────────────────────────────────────────────────────
-- 0004 — Safe portfolio writes, durable challenge payouts, real follows.
--
-- Run in the Supabase SQL editor after 0003. Idempotent.
--
-- What it fixes:
--   1. Saving a portfolio was DELETE-then-INSERT with both errors discarded. A
--      failed insert after a committed delete wiped the user's holdings. The
--      repository now inserts first and deletes only the superseded generation,
--      which needs an `updated_at` column to identify.
--   2. portfolio_holdings.lesson_id had an FK to `lessons`, a table holding the
--      OLD curriculum that has now been removed from the app. Any holding
--      tagged with a course lesson id would fail that constraint — which is
--      exactly the insert failure that used to destroy portfolios.
--   3. Challenges awarded XP and badges nowhere. Payout has to be recorded
--      durably or a user gets paid again on every new device.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Non-destructive holdings writes ──────────────────────────────────────
alter table portfolio_holdings
  add column if not exists updated_at timestamptz not null default now();

create index if not exists portfolio_holdings_account_updated_idx
  on portfolio_holdings (account_id, updated_at);

-- ── 2. Untie holdings from the deleted legacy lesson table ───────────────────
-- The column stays (it's a useful "learn about this asset" pointer), but it no
-- longer references a table whose ids the app no longer uses.
alter table portfolio_holdings
  drop constraint if exists portfolio_holdings_lesson_id_fkey;

-- Same trap on user_lesson_progress: the app now writes course lesson ids
-- ("investing-u1-l1"), which are not rows in `lessons`.
alter table user_lesson_progress
  drop constraint if exists user_lesson_progress_lesson_id_fkey;

-- ── 3. Durable challenge payouts ────────────────────────────────────────────
-- Which challenges this user has already been PAID for. Kept on the profile so
-- it rides along with the existing profile upsert and survives a device change;
-- without it, completing a challenge would re-award its XP on every new device.
alter table profiles
  add column if not exists completed_challenges text[] not null default '{}';

-- ── 4. Follows ──────────────────────────────────────────────────────────────
-- The table and its RLS already existed (setup.sql) and were never written to
-- once, because no follow()/unfollow() function existed. The app now writes it.
-- Re-assert the policies here so a project that only ran an older setup.sql
-- still ends up correct, and require a confirmed email to follow (same standard
-- as posting and club membership; see is_verified() in 0003).
drop policy if exists "read follows" on follows;
create policy "read follows" on follows for select using (true);

drop policy if exists "manage follows" on follows;
drop policy if exists "create follows" on follows;
create policy "create follows" on follows
  for insert with check (auth.uid() = follower_id and is_verified());

drop policy if exists "delete follows" on follows;
create policy "delete follows" on follows
  for delete using (auth.uid() = follower_id);

create index if not exists follows_follower_idx on follows (follower_id);
create index if not exists follows_following_idx on follows (following_id);
