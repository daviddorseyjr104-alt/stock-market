-- ════════════════════════════════════════════════════════════════════════
-- Campus Capital — ONE-SHOT SETUP
-- Paste this entire file into the Supabase SQL Editor and click Run.
-- Creates schema, enables Row Level Security, and seeds catalog data.
-- ════════════════════════════════════════════════════════════════════════

-- ╔══ 1/3 SCHEMA ══╗
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

-- ╔══ 2/3 ROW LEVEL SECURITY ══╗
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
create policy "read schools"        on schools             for select using (true);
create policy "read modules"        on lesson_modules      for select using (true);
create policy "read lessons"        on lessons             for select using (true);
create policy "read quizzes"        on quizzes             for select using (true);
create policy "read quiz_questions" on quiz_questions      for select using (true);
create policy "read badges"         on badges              for select using (true);
create policy "read clubs"          on clubs               for select using (true);
create policy "read challenges"     on challenges          for select using (true);
create policy "read leaderboard"    on schools_leaderboard for select using (true);

-- Authenticated users may create a club (becomes creator).
create policy "create clubs" on clubs
  for insert with check (auth.uid() = created_by);
create policy "update own clubs" on clubs
  for update using (auth.uid() = created_by);

-- ── Profiles: public read, edit only your own ─────────────────────────────
create policy "profiles are public"   on profiles for select using (true);
create policy "insert own profile"    on profiles for insert with check (auth.uid() = id);
create policy "update own profile"    on profiles for update using (auth.uid() = id);

-- ── XP / progress / badges / challenges: owner only ───────────────────────
create policy "own xp"          on user_xp              for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own progress"    on user_lesson_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "read any badges" on user_badges          for select using (true);
create policy "manage own badges" on user_badges        for insert with check (auth.uid() = user_id);
create policy "own challenges"  on user_challenges      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Posts: public read, write/edit/delete only your own ───────────────────
create policy "read posts"    on posts for select using (true);
create policy "create posts"  on posts for insert with check (auth.uid() = author_id);
create policy "update posts"  on posts for update using (auth.uid() = author_id);
create policy "delete posts"  on posts for delete using (auth.uid() = author_id);

-- ── Comments: public read, own write ──────────────────────────────────────
create policy "read comments"   on comments for select using (true);
create policy "create comments" on comments for insert with check (auth.uid() = author_id);
create policy "update comments" on comments for update using (auth.uid() = author_id);
create policy "delete comments" on comments for delete using (auth.uid() = author_id);

-- ── Reactions: public read, own write ─────────────────────────────────────
create policy "read reactions"   on reactions for select using (true);
create policy "manage reactions" on reactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Follows: public read, own write ───────────────────────────────────────
create policy "read follows"   on follows for select using (true);
create policy "manage follows" on follows for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);

-- ── Club membership: public read, join/leave for yourself ─────────────────
create policy "read club_members"   on club_members for select using (true);
create policy "manage club_members" on club_members for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Portfolio simulator: strictly private to the owner ────────────────────
create policy "own portfolio accounts" on portfolio_simulator_accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own portfolio holdings" on portfolio_holdings
  for all using (
    auth.uid() = (select user_id from portfolio_simulator_accounts a where a.id = account_id)
  ) with check (
    auth.uid() = (select user_id from portfolio_simulator_accounts a where a.id = account_id)
  );

-- ── Notifications: owner only ─────────────────────────────────────────────
create policy "own notifications" on notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Referrals: owner only ─────────────────────────────────────────────────
create policy "own referrals" on referrals
  for all using (auth.uid() = referrer_id) with check (auth.uid() = referrer_id);

-- ╔══ 3/3 SEED DATA ══╗
-- ════════════════════════════════════════════════════════════════════════
-- Campus Capital — Seed data (catalog tables)
-- Run AFTER schema.sql + rls.sql. Idempotent via ON CONFLICT.
-- Full lesson bodies + quizzes live in the app data layer (lib/data/*) and can
-- be backfilled here; this seed covers the catalog + leaderboard so the
-- product is populated on first boot.
-- ════════════════════════════════════════════════════════════════════════

-- ── Schools (11) ──────────────────────────────────────────────────────────
insert into schools (id, name, short_name, location, emoji, color) values
  ('ucla','University of California, Los Angeles','UCLA','Los Angeles, CA','🐻','from-sky-400 to-amber-400'),
  ('usc','University of Southern California','USC','Los Angeles, CA','✌️','from-rose-500 to-amber-400'),
  ('berkeley','UC Berkeley','Berkeley','Berkeley, CA','🐻','from-blue-500 to-amber-300'),
  ('stanford','Stanford University','Stanford','Stanford, CA','🌲','from-rose-600 to-rose-400'),
  ('howard','Howard University','Howard','Washington, D.C.','🦬','from-red-500 to-blue-600'),
  ('nyu','New York University','NYU','New York, NY','🗽','from-violet-500 to-fuchsia-500'),
  ('michigan','University of Michigan','Michigan','Ann Arbor, MI','〽️','from-blue-700 to-amber-400'),
  ('texas','University of Texas at Austin','Texas','Austin, TX','🤘','from-orange-500 to-amber-400'),
  ('gsu','Georgia State University','Georgia State','Atlanta, GA','🐾','from-blue-600 to-sky-400'),
  ('spelman','Spelman College','Spelman','Atlanta, GA','💙','from-rose-500 to-fuchsia-500'),
  ('morehouse','Morehouse College','Morehouse','Atlanta, GA','🐯','from-rose-600 to-amber-500')
on conflict (id) do nothing;

-- ── Leaderboard cache ─────────────────────────────────────────────────────
insert into schools_leaderboard (school_id, total_xp, active_students, weekly_growth, top_student) values
  ('ucla',1284500,3120,12.4,'Davon Carter'),
  ('usc',1190200,2870,9.1,'Maya Lin'),
  ('berkeley',1342900,3410,14.8,'Andre Diallo'),
  ('stanford',1098700,2210,7.6,'Priya Raman'),
  ('howard',1411300,3680,18.2,'Jordan Banks'),
  ('nyu',1255100,3040,10.7,'Sofia Russo'),
  ('michigan',1208400,2950,8.9,'Tyler Novak'),
  ('texas',1176800,2810,11.3,'Camila Reyes'),
  ('gsu',1320600,3520,16.5,'Marcus Hill'),
  ('spelman',1389900,1980,21.4,'Imani Brooks'),
  ('morehouse',1276400,1720,19.7,'Elijah Grant')
on conflict (school_id) do nothing;

-- ── Modules (5) ───────────────────────────────────────────────────────────
insert into lesson_modules (id, letter, title, description, color, icon, sort_order) values
  ('start-here','A','Start Here','The mindset and first principles of investing.','from-capital-400 to-capital-600','Rocket',1),
  ('money-foundation','B','Student Money Foundation','Budgeting, debt, credit and income.','from-sky-400 to-violet-500','Wallet',2),
  ('market-basics','C','Market Basics','Stocks, ETFs, index funds, bonds and dividends.','from-amber-400 to-orange-500','LineChart',3),
  ('wealth-early','D','Building Wealth Early','Roth IRAs, brokerage accounts, automation.','from-fuchsia-500 to-violet-600','TrendingUp',4),
  ('advanced-path','E','Advanced Student Path','Valuation, statements, allocation, behavior.','from-rose-500 to-fuchsia-500','BrainCircuit',5)
on conflict (id) do nothing;

-- ── Lessons (20) — catalog metadata ───────────────────────────────────────
insert into lessons (id, module_id, sort_order, title, difficulty, minutes, xp, summary) values
  ('what-is-investing','start-here',1,'What is investing, really?','Beginner',5,50,'Putting money to work so it grows without trading hours for it.'),
  ('why-students-early','start-here',2,'Why students should learn early','Beginner',4,50,'Your biggest asset in college is the decades of time ahead of you.'),
  ('saving-vs-investing','start-here',3,'Saving vs. investing','Beginner',5,50,'Saving protects money for soon; investing grows money for later.'),
  ('risk-explained','start-here',4,'Risk, explained simply','Beginner',5,60,'Risk is the range of outcomes you sign up for, not just loss.'),
  ('compound-interest','start-here',5,'Compound interest: the snowball','Beginner',6,70,'Earning returns on your returns — growth that accelerates.'),
  ('budgeting-college','money-foundation',1,'Budgeting in college','Beginner',5,50,'A plan that tells your money where to go before it disappears.'),
  ('emergency-funds','money-foundation',2,'Emergency funds','Beginner',4,50,'The cash cushion that keeps a bad week from becoming debt.'),
  ('credit-cards','money-foundation',3,'Credit cards & credit scores','Beginner',6,60,'Used right, a card builds your score for free.'),
  ('student-loans','money-foundation',4,'Student loans, demystified','Intermediate',6,70,'The rate and type decide how heavy the debt really is.'),
  ('when-not-to-invest','money-foundation',5,'When NOT to invest yet','Beginner',4,50,'Sometimes paying off debt or building a cushion comes first.'),
  ('stocks','market-basics',1,'Stocks: owning a slice','Beginner',5,60,'A stock is a tiny ownership share of a real company.'),
  ('etfs','market-basics',2,'ETFs: a basket in one click','Beginner',5,60,'An ETF bundles many investments into one for instant diversification.'),
  ('index-funds','market-basics',3,'Index funds: owning the whole market','Beginner',5,60,'Tracks a whole index — simple, cheap, hard to beat.'),
  ('bonds','market-basics',4,'Bonds: lending instead of owning','Intermediate',5,60,'A loan you make in exchange for steady interest.'),
  ('dividends','market-basics',5,'Dividends & market indexes','Intermediate',5,60,'Profit payments to owners; indexes are the market scoreboards.'),
  ('roth-ira','wealth-early',1,'The Roth IRA: a student''s secret weapon','Intermediate',6,80,'Investments grow and are withdrawn tax-free in retirement.'),
  ('brokerage-accounts','wealth-early',2,'Brokerage accounts 101','Beginner',4,60,'The flexible place where you buy and hold investments.'),
  ('dollar-cost-averaging','wealth-early',3,'Dollar-cost averaging','Beginner',5,70,'Investing a fixed amount on a schedule removes emotion.'),
  ('long-term-automation','wealth-early',4,'Long-term investing & automation','Beginner',5,70,'Set it, automate it, and let time do the work.'),
  ('valuation-basics','advanced-path',1,'Valuation basics','Advanced',7,90,'Is this company''s price fair for what you''re getting?'),
  ('financial-statements','advanced-path',2,'Reading financial statements','Advanced',7,90,'Income, balance sheet and cash flow reveal real health.'),
  ('portfolio-allocation','advanced-path',3,'Portfolio allocation & risk management','Advanced',6,90,'How you split money across assets drives most results.'),
  ('behavioral-finance','advanced-path',4,'Behavioral finance & economic cycles','Advanced',6,90,'Your emotions and the economy''s cycles are real risks.')
on conflict (id) do nothing;

-- ── Badges (10) ───────────────────────────────────────────────────────────
insert into badges (id, name, description, icon, color, rarity) values
  ('first-lesson','First Lesson','Completed your very first lesson.','Sparkles','from-capital-400 to-capital-600','Common'),
  ('etf-explorer','ETF Explorer','Finished the full ETF & index fund track.','Compass','from-sky-400 to-violet-500','Rare'),
  ('compound-king','Compound King','Mastered compound interest.','Crown','from-amber-400 to-amber-600','Epic'),
  ('budget-builder','Budget Builder','Built your first student budget plan.','Wallet','from-emerald-400 to-capital-500','Common'),
  ('risk-manager','Risk Manager','Learned to size positions and manage risk.','ShieldCheck','from-blue-400 to-indigo-500','Rare'),
  ('roth-rookie','Roth Rookie','Opened your first mock Roth IRA strategy.','PiggyBank','from-rose-400 to-fuchsia-500','Common'),
  ('campus-top-10','Campus Top 10','Reached the top 10 on your campus.','Medal','from-amber-300 to-orange-500','Epic'),
  ('streak-7','7-Day Streak','Learned 7 days in a row.','Flame','from-orange-400 to-rose-500','Rare'),
  ('streak-30','30-Day Streak','A full month of daily learning.','Zap','from-fuchsia-500 to-violet-600','Legendary'),
  ('diversified','Diversified','Built a portfolio across 4+ asset types.','PieChart','from-capital-300 to-sky-500','Rare')
on conflict (id) do nothing;

-- ── Clubs (8) ─────────────────────────────────────────────────────────────
insert into clubs (id, name, tagline, emoji, color, school_scope, learning_goal, weekly_challenge) values
  ('ucla-investors','UCLA Student Investors','Bruins building portfolios before payday.','🐻','from-sky-400 to-amber-400','single','Everyone builds a diversified mock portfolio by midterms.','Build your first mock ETF portfolio'),
  ('black-wealth','Black Wealth Builders','Generational wealth starts on campus.','👑','from-amber-400 to-rose-500','national','Master long-term wealth-building fundamentals.','Create a $100/month investing plan'),
  ('first-gen','First-Gen Finance','No family playbook? We''ll write one together.','🌱','from-capital-400 to-emerald-500','national','Build financial confidence from zero.','Understand Roth IRA basics'),
  ('women-investing','Women in Investing','Closing the gap, one share at a time.','💜','from-fuchsia-500 to-violet-600','national','Every member opens a mock Roth IRA strategy.','Compare saving vs investing'),
  ('transfer-investors','Transfer Student Investors','New campus, same financial goals.','🔁','from-blue-400 to-capital-400','national','Get every transfer to a 7-day streak.','Learn compound interest in 5 minutes'),
  ('entrepreneurship-markets','Entrepreneurship & Markets','Founders who understand the money game.','🚀','from-violet-500 to-fuchsia-500','national','Finish valuation and financial-statements lessons.','Make an internship paycheck plan'),
  ('usc-traders','USC Market Movers','Trojans tracking the market together.','✌️','from-rose-500 to-amber-400','single','Top the USC simulator leaderboard.','Explain diversification to a friend'),
  ('atlanta-collective','ATL Campus Collective','Spelman × Morehouse × Georgia State.','🍑','from-orange-500 to-rose-500','national','Win the regional school-vs-school cup.','Build a debt payoff vs investing decision tree')
on conflict (id) do nothing;

-- ── Challenges (10) ───────────────────────────────────────────────────────
insert into challenges (id, title, description, goal, xp, badge_id, deadline_days, category, icon) values
  ('first-mock-etf','Build your first mock ETF portfolio','Construct a diversified ETF-based portfolio.','Add at least 3 ETF or index-fund holdings.',150,'diversified',5,'Simulator','PieChart'),
  ('compound-5min','Learn compound interest in 5 minutes','See why time is your biggest advantage.','Finish the compound interest lesson and quiz.',100,'compound-king',3,'Learning','Sparkles'),
  ('100-month-plan','Create a $100/month investing plan','Design a realistic automated monthly plan.','Map out where $100/month would go.',120,null,7,'Planning','CalendarClock'),
  ('save-vs-invest','Compare saving vs investing','Understand when to save and when to invest.','Finish the saving-vs-investing lesson.',90,null,4,'Learning','Scale'),
  ('roth-basics','Understand Roth IRA basics','Learn the student''s secret weapon.','Complete the Roth IRA lesson.',130,'roth-rookie',6,'Learning','PiggyBank'),
  ('debt-vs-invest-tree','Build a debt payoff vs investing decision tree','Decide when to attack debt vs invest.','Outline your own decision rules.',140,null,7,'Planning','GitBranch'),
  ('internship-paycheck','Make an internship paycheck plan','Split a paycheck into saving, investing, living.','Build a percentage plan.',120,null,10,'Planning','Briefcase'),
  ('explain-diversification','Explain diversification to a friend','Teach it in your own words.','Write a Campus post explaining diversification.',80,null,3,'Social','Users'),
  ('7-day-streak','Hit a 7-day learning streak','Build the habit that compounds.','One lesson per day for 7 days.',200,'streak-7',7,'Habit','Flame'),
  ('budget-builder-challenge','Build your first student budget','Create a 50/30/20 budget.','Finish the budgeting lesson and draft a budget.',100,'budget-builder',5,'Planning','Wallet')
on conflict (id) do nothing;
