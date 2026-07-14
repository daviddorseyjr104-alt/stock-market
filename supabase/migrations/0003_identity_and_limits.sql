-- ─────────────────────────────────────────────────────────────────────────────
-- 0003 — Real identity, verified-only social writes, and a Coach spend cap.
--
-- Run this in the Supabase SQL editor after setup.sql. Idempotent.
--
-- What it fixes:
--   1. Profiles had no avatar column and there was no bucket to upload one to.
--   2. `handle_new_user` derived usernames from the email local-part, so a
--      handle leaked the address it came from and collided across schools.
--   3. Posting/commenting/joining clubs were open to any signed-in user,
--      including ones who never confirmed their email address.
--   4. /api/coach billed our Anthropic key with no per-user limit at all.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Avatars ──────────────────────────────────────────────────────────────
alter table profiles add column if not exists avatar_url text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Anyone can view an avatar; you may only write objects under your own user id
-- prefix (the path is "<uid>/avatar.webp", see lib/avatar.ts).
drop policy if exists "avatars are public" on storage.objects;
create policy "avatars are public" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "own avatar upload" on storage.objects;
create policy "own avatar upload" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "own avatar update" on storage.objects;
create policy "own avatar update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "own avatar delete" on storage.objects;
create policy "own avatar delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── 2. Usernames come from signup, not from the email address ───────────────
-- The old trigger built "<email-local-part>_<uid4>", which both exposed part of
-- the address and ignored the handle the user actually picked.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  desired text;
begin
  desired := nullif(trim(new.raw_user_meta_data ->> 'username'), '');

  -- Fall back to an opaque handle rather than anything derived from the email.
  if desired is null then
    desired := 'student_' || substr(replace(new.id::text, '-', ''), 1, 8);
  end if;

  -- Settle any race on the UNIQUE constraint by suffixing, never by failing:
  -- a lost signup is worse than an imperfect handle.
  if exists (select 1 from profiles where username = desired) then
    desired := desired || '_' || substr(replace(new.id::text, '-', ''), 1, 4);
  end if;

  insert into profiles (id, full_name, username, school_id, avatar_url)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Student'),
    desired,
    nullif(new.raw_user_meta_data ->> 'school_id', ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- ── 3. Social writes require a confirmed email ──────────────────────────────
-- Membership and posts are how a user represents themselves to other students,
-- so an unverified address must not be able to produce either. This is the real
-- enforcement; the UI gate is only a courtesy.
create or replace function is_verified()
returns boolean
language sql
stable
security definer set search_path = public, auth
as $$
  select coalesce(
    (select email_confirmed_at is not null from auth.users where id = auth.uid()),
    false
  );
$$;

drop policy if exists "create comments" on comments;
create policy "create comments" on comments
  for insert with check (auth.uid() = author_id and is_verified());

drop policy if exists "manage club_members" on club_members;
drop policy if exists "join club_members" on club_members;
create policy "join club_members" on club_members
  for insert with check (auth.uid() = user_id and is_verified());
drop policy if exists "leave club_members" on club_members;
create policy "leave club_members" on club_members
  for delete using (auth.uid() = user_id);

-- Posts get exactly ONE insert policy. Permissive policies are OR'd together,
-- so leaving the old unconditional "create posts" alongside this one would let
-- any verified user post into a club they don't belong to.
drop policy if exists "create posts" on posts;
drop policy if exists "post to own clubs" on posts;
create policy "create posts" on posts
  for insert with check (
    auth.uid() = author_id
    and is_verified()
    and (
      club_id is null
      or exists (
        select 1 from club_members m
        where m.club_id = posts.club_id and m.user_id = auth.uid()
      )
    )
  );

-- ── 4. Capital Coach daily quota ────────────────────────────────────────────
-- Every live Coach answer is billed to our Anthropic key, so each account gets a
-- fixed number per day. The counter is SECURITY DEFINER and the table has no
-- client-facing policies, so a user can spend their quota but never reset it.
create table if not exists coach_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day     date not null default current_date,
  used    int  not null default 0,
  primary key (user_id, day)
);

alter table coach_usage enable row level security;
revoke all on coach_usage from anon, authenticated;

/**
 * Consumes one unit of today's quota.
 * Returns how many remain, or -1 when the caller is already over the limit.
 */
create or replace function consume_coach_quota(p_limit int)
returns int
language plpgsql
security definer set search_path = public
as $$
declare
  uid uuid := auth.uid();
  n   int;
begin
  if uid is null then
    return -1;
  end if;

  insert into coach_usage (user_id, day, used)
  values (uid, current_date, 1)
  on conflict (user_id, day) do update
    set used = coach_usage.used + 1
    where coach_usage.used < p_limit
  returning used into n;

  -- No row came back → the WHERE guard blocked the increment → over the limit.
  if n is null then
    return -1;
  end if;

  return p_limit - n;
end;
$$;

revoke all on function consume_coach_quota(int) from anon;
grant execute on function consume_coach_quota(int) to authenticated;
