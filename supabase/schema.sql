-- ════════════════════════════════════════════════════════════════════════
-- Campus Capital — Database Schema
-- Postgres / Supabase. Run in the Supabase SQL Editor (or `supabase db push`).
-- Enables Row Level Security on every user-owned table.
-- ════════════════════════════════════════════════════════════════════════

-- Extensions ---------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────────────────
-- Reference / catalog tables (public read, admin-managed)
-- ────────────────────────────────────────────────────────────────────────

create table if not exists schools (
  id            text primary key,
  name          text not null,
  short_name    text not null,
  location      text,
  emoji         text,
  color         text,
  created_at    timestamptz default now()
);

create table if not exists lesson_modules (
  id            text primary key,
  letter        text not null,
  title         text not null,
  description   text,
  color         text,
  icon          text,
  sort_order    int default 0
);

create table if not exists lessons (
  id              text primary key,
  module_id       text references lesson_modules(id) on delete cascade,
  sort_order      int default 0,
  title           text not null,
  difficulty      text check (difficulty in ('Beginner','Intermediate','Advanced')),
  minutes         int default 5,
  xp              int default 50,
  summary         text,
  student_example text,
  body            jsonb default '[]'::jsonb,
  analogy         text,
  takeaway        text,
  created_at      timestamptz default now()
);

create table if not exists quizzes (
  id          uuid primary key default uuid_generate_v4(),
  lesson_id   text references lessons(id) on delete cascade,
  created_at  timestamptz default now()
);

create table if not exists quiz_questions (
  id            uuid primary key default uuid_generate_v4(),
  quiz_id       uuid references quizzes(id) on delete cascade,
  prompt        text not null,
  options       jsonb not null,        -- string[]
  correct_index int not null,
  explanation   text,
  sort_order    int default 0
);

create table if not exists badges (
  id          text primary key,
  name        text not null,
  description text,
  icon        text,
  color       text,
  rarity      text check (rarity in ('Common','Rare','Epic','Legendary'))
);

create table if not exists clubs (
  id              text primary key,
  name            text not null,
  tagline         text,
  description     text,
  emoji           text,
  color           text,
  school_scope    text check (school_scope in ('single','national')) default 'national',
  learning_goal   text,
  weekly_challenge text,
  created_by      uuid,
  created_at      timestamptz default now()
);

create table if not exists challenges (
  id            text primary key,
  title         text not null,
  description   text,
  goal          text,
  steps         jsonb default '[]'::jsonb,
  xp            int default 100,
  badge_id      text references badges(id),
  deadline_days int default 7,
  category      text,
  icon          text
);

-- ────────────────────────────────────────────────────────────────────────
-- User-owned tables
-- ────────────────────────────────────────────────────────────────────────

-- 1:1 with auth.users
create table if not exists profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text,
  username        text unique,
  avatar_color    text default 'from-capital-400 to-violet-500',
  school_id       text references schools(id),
  major           text,
  grad_year       int,
  student_type    text,
  investing_level text,
  goal            text,
  interests       text[] default '{}',
  bio             text,
  level           int default 1,
  xp              int default 0,
  streak          int default 0,
  campus_rank     int,
  national_rank   int,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table if not exists user_xp (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references profiles(id) on delete cascade,
  amount      int not null,
  reason      text,
  created_at  timestamptz default now()
);

create table if not exists user_lesson_progress (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references profiles(id) on delete cascade,
  lesson_id     text references lessons(id) on delete cascade,
  completed     boolean default false,
  quiz_score    int,
  completed_at  timestamptz,
  unique (user_id, lesson_id)
);

create table if not exists user_badges (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid references profiles(id) on delete cascade,
  badge_id   text references badges(id) on delete cascade,
  earned_at  timestamptz default now(),
  unique (user_id, badge_id)
);

create table if not exists user_challenges (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references profiles(id) on delete cascade,
  challenge_id  text references challenges(id) on delete cascade,
  progress      int default 0,
  completed     boolean default false,
  unique (user_id, challenge_id)
);

create table if not exists posts (
  id          uuid primary key default uuid_generate_v4(),
  author_id   uuid references profiles(id) on delete cascade,
  category    text,
  body        text not null,
  school_id   text references schools(id),
  club_id     text references clubs(id) on delete set null,
  attachment  jsonb,
  created_at  timestamptz default now()
);

create table if not exists comments (
  id          uuid primary key default uuid_generate_v4(),
  post_id     uuid references posts(id) on delete cascade,
  author_id   uuid references profiles(id) on delete cascade,
  body        text not null,
  created_at  timestamptz default now()
);

create table if not exists reactions (
  id          uuid primary key default uuid_generate_v4(),
  post_id     uuid references posts(id) on delete cascade,
  user_id     uuid references profiles(id) on delete cascade,
  kind        text default 'like',
  created_at  timestamptz default now(),
  unique (post_id, user_id, kind)
);

create table if not exists follows (
  id            uuid primary key default uuid_generate_v4(),
  follower_id   uuid references profiles(id) on delete cascade,
  following_id  uuid references profiles(id) on delete cascade,
  created_at    timestamptz default now(),
  unique (follower_id, following_id)
);

create table if not exists club_members (
  id          uuid primary key default uuid_generate_v4(),
  club_id     text references clubs(id) on delete cascade,
  user_id     uuid references profiles(id) on delete cascade,
  role        text default 'member',
  joined_at   timestamptz default now(),
  unique (club_id, user_id)
);

create table if not exists portfolio_simulator_accounts (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references profiles(id) on delete cascade,
  name            text default 'My Mock Portfolio',
  starting_balance numeric default 10000,
  cash            numeric default 10000,
  created_at      timestamptz default now(),
  unique (user_id, name)
);

create table if not exists portfolio_holdings (
  id            uuid primary key default uuid_generate_v4(),
  account_id    uuid references portfolio_simulator_accounts(id) on delete cascade,
  ticker        text not null,
  name          text,
  asset_type    text,
  shares        numeric default 0,   -- paper-trading: shares held
  avg_cost      numeric default 0,   -- average cost basis per share
  risk          text,
  lesson_id     text references lessons(id),
  created_at    timestamptz default now()
);

create table if not exists notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references profiles(id) on delete cascade,
  type        text,
  title       text,
  body        text,
  href        text,
  read        boolean default false,
  created_at  timestamptz default now()
);

create table if not exists referrals (
  id            uuid primary key default uuid_generate_v4(),
  referrer_id   uuid references profiles(id) on delete cascade,
  referred_email text,
  code          text unique,
  redeemed      boolean default false,
  created_at    timestamptz default now()
);

-- Materialized-style leaderboard cache (refreshed by a job / function)
create table if not exists schools_leaderboard (
  school_id       text primary key references schools(id) on delete cascade,
  total_xp        bigint default 0,
  active_students int default 0,
  weekly_growth   numeric default 0,
  top_student     text,
  updated_at      timestamptz default now()
);

-- ────────────────────────────────────────────────────────────────────────
-- Auto-create a profile when a new auth user signs up
-- ────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'New Student'),
    split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ════════════════════════════════════════════════════════════════════════
-- Indexes
-- ════════════════════════════════════════════════════════════════════════
create index if not exists idx_posts_school on posts(school_id);
create index if not exists idx_posts_club on posts(club_id);
create index if not exists idx_posts_author on posts(author_id);
create index if not exists idx_comments_post on comments(post_id);
create index if not exists idx_progress_user on user_lesson_progress(user_id);
create index if not exists idx_holdings_account on portfolio_holdings(account_id);
create index if not exists idx_notifications_user on notifications(user_id);
