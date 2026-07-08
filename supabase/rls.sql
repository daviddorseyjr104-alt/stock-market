-- ════════════════════════════════════════════════════════════════════════
-- Campus Capital — Row Level Security policies
-- Run AFTER schema.sql. Reference/catalog tables are world-readable;
-- user-owned data is private to its owner (with public read for social content).
-- ════════════════════════════════════════════════════════════════════════

-- ── Enable RLS ────────────────────────────────────────────────────────────
alter table profiles                     enable row level security;
alter table user_xp                      enable row level security;
alter table user_lesson_progress         enable row level security;
alter table user_badges                  enable row level security;
alter table user_challenges              enable row level security;
alter table posts                        enable row level security;
alter table comments                     enable row level security;
alter table reactions                    enable row level security;
alter table follows                      enable row level security;
alter table club_members                 enable row level security;
alter table portfolio_simulator_accounts enable row level security;
alter table portfolio_holdings           enable row level security;
alter table notifications                enable row level security;
alter table referrals                    enable row level security;

alter table schools             enable row level security;
alter table lesson_modules      enable row level security;
alter table lessons             enable row level security;
alter table quizzes             enable row level security;
alter table quiz_questions      enable row level security;
alter table badges              enable row level security;
alter table clubs               enable row level security;
alter table challenges          enable row level security;
alter table schools_leaderboard enable row level security;

-- ── Catalog / reference: anyone (incl. anon) can read ─────────────────────
drop policy if exists "read schools" on schools;
create policy "read schools" on schools             for select using (true);
drop policy if exists "read modules" on lesson_modules;
create policy "read modules" on lesson_modules      for select using (true);
drop policy if exists "read lessons" on lessons;
create policy "read lessons" on lessons             for select using (true);
drop policy if exists "read quizzes" on quizzes;
create policy "read quizzes" on quizzes             for select using (true);
drop policy if exists "read quiz_questions" on quiz_questions;
create policy "read quiz_questions" on quiz_questions      for select using (true);
drop policy if exists "read badges" on badges;
create policy "read badges" on badges              for select using (true);
drop policy if exists "read clubs" on clubs;
create policy "read clubs" on clubs               for select using (true);
drop policy if exists "read challenges" on challenges;
create policy "read challenges" on challenges          for select using (true);
drop policy if exists "read leaderboard" on schools_leaderboard;
create policy "read leaderboard" on schools_leaderboard for select using (true);

-- Authenticated users may create a club (becomes creator).
drop policy if exists "create clubs" on clubs;
create policy "create clubs" on clubs
  for insert with check (auth.uid() = created_by);
drop policy if exists "update own clubs" on clubs;
create policy "update own clubs" on clubs
  for update using (auth.uid() = created_by);

-- ── Profiles: public read, edit only your own ─────────────────────────────
drop policy if exists "profiles are public" on profiles;
create policy "profiles are public" on profiles for select using (true);
drop policy if exists "insert own profile" on profiles;
create policy "insert own profile" on profiles for insert with check (auth.uid() = id);
drop policy if exists "update own profile" on profiles;
create policy "update own profile" on profiles for update using (auth.uid() = id);

-- ── XP / progress / badges / challenges: owner only ───────────────────────
drop policy if exists "own xp" on user_xp;
create policy "own xp" on user_xp              for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "own progress" on user_lesson_progress;
create policy "own progress" on user_lesson_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "read any badges" on user_badges;
create policy "read any badges" on user_badges          for select using (true);
drop policy if exists "manage own badges" on user_badges;
create policy "manage own badges" on user_badges        for insert with check (auth.uid() = user_id);
drop policy if exists "own challenges" on user_challenges;
create policy "own challenges" on user_challenges      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Posts: public read, write/edit/delete only your own ───────────────────
drop policy if exists "read posts" on posts;
create policy "read posts" on posts for select using (true);
drop policy if exists "create posts" on posts;
create policy "create posts" on posts for insert with check (auth.uid() = author_id);
drop policy if exists "update posts" on posts;
create policy "update posts" on posts for update using (auth.uid() = author_id);
drop policy if exists "delete posts" on posts;
create policy "delete posts" on posts for delete using (auth.uid() = author_id);

-- ── Comments: public read, own write ──────────────────────────────────────
drop policy if exists "read comments" on comments;
create policy "read comments" on comments for select using (true);
drop policy if exists "create comments" on comments;
create policy "create comments" on comments for insert with check (auth.uid() = author_id);
drop policy if exists "update comments" on comments;
create policy "update comments" on comments for update using (auth.uid() = author_id);
drop policy if exists "delete comments" on comments;
create policy "delete comments" on comments for delete using (auth.uid() = author_id);

-- ── Reactions: public read, own write ─────────────────────────────────────
drop policy if exists "read reactions" on reactions;
create policy "read reactions" on reactions for select using (true);
drop policy if exists "manage reactions" on reactions;
create policy "manage reactions" on reactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Follows: public read, own write ───────────────────────────────────────
drop policy if exists "read follows" on follows;
create policy "read follows" on follows for select using (true);
drop policy if exists "manage follows" on follows;
create policy "manage follows" on follows for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);

-- ── Club membership: public read, join/leave for yourself ─────────────────
drop policy if exists "read club_members" on club_members;
create policy "read club_members" on club_members for select using (true);
drop policy if exists "manage club_members" on club_members;
create policy "manage club_members" on club_members for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Portfolio simulator: strictly private to the owner ────────────────────
drop policy if exists "own portfolio accounts" on portfolio_simulator_accounts;
create policy "own portfolio accounts" on portfolio_simulator_accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own portfolio holdings" on portfolio_holdings;
create policy "own portfolio holdings" on portfolio_holdings
  for all using (
    auth.uid() = (select user_id from portfolio_simulator_accounts a where a.id = account_id)
  ) with check (
    auth.uid() = (select user_id from portfolio_simulator_accounts a where a.id = account_id)
  );

-- ── Notifications: owner only ─────────────────────────────────────────────
drop policy if exists "own notifications" on notifications;
create policy "own notifications" on notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Referrals: owner only ─────────────────────────────────────────────────
drop policy if exists "own referrals" on referrals;
create policy "own referrals" on referrals
  for all using (auth.uid() = referrer_id) with check (auth.uid() = referrer_id);
