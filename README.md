<div align="center">

# 🟢 Campus Capital

### Investing education built for students before they have money.

*Learn the market through the life you actually live — internships, rent, financial aid, side hustles, scholarships, student debt, and first paychecks.*

Facebook for campus investing education · Tesla for product design · Duolingo for habits · Robinhood for simplicity · LinkedIn for identity · Khan Academy for clarity.

</div>

---

## Product summary

Campus Capital is a **social investing-education network for college students**. Traditional finance sites explain investing like a textbook and assume you already have a salary and a 401(k). Students have aid refunds, part-time jobs, and a first paycheck they're terrified to mess up. Campus Capital teaches investing through *their* money reality and turns every campus into a competitive financial-learning community.

**Core pillars**

| Pillar | What it is |
| --- | --- |
| 🎓 **Campus network** | Join your school, follow classmates, post, and climb a national leaderboard together. |
| 📚 **Learning system** | 20 student-native lessons across 5 modules — each with a real-life example, analogy, quiz, and XP. |
| 📈 **Portfolio simulator** | A $10,000 **mock** portfolio with live risk + diversification scores. Zero real money. |
| 🏆 **Leaderboards** | Student XP, campus XP, school-vs-school, clubs, streaks, and simulator performance. |
| 🤖 **Capital Coach** | An AI tutor that answers money questions in plain student language. |
| 🔥 **Habit loop** | Streaks, XP, levels, badges, and weekly challenges that make learning addictive. |

> **Education-first. No real money. No real trading. No financial advice.** Every portfolio is simulated.

---

## Tech stack

- **Next.js 14** (App Router) + **React 18**
- **TypeScript** (strict)
- **Tailwind CSS** — custom dark, glassmorphic design system
- **Supabase** — Auth, Postgres, Row Level Security (optional; the app runs in full demo mode without it)
- **framer-motion** — micro-interactions & page transitions
- **recharts** — portfolio breakdown charts
- **lucide-react** — icons

### Highlights

- 🌑 Dark-mode-first, glassmorphism, soft gradients, Tesla-like spacing
- ⌨️ Command palette (`⌘K` / `Ctrl+K`)
- 📱 Mobile-first: bottom tab bar on mobile, sidebar on desktop
- ✨ Loading skeletons, beautiful empty states, badge-earned modal, streak animation
- ♿ Semantic, keyboard-navigable, accessible components

---

## Run it locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open the app
# → http://localhost:3000
```

That's it. **The app runs immediately in demo mode** with rich, realistic seed data — no database or keys required. Sign up / log in with anything and you'll land in the full product.

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # lint
```

---

## Environment variables

Copy `.env.example` → `.env.local`. All variables are **optional** — without them the app uses its built-in demo data and offline Capital Coach engine.

```bash
# Enable real Supabase auth + persistence
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=server-only-key   # optional, never exposed to client

# Enable a live Capital Coach (otherwise the built-in engine is used)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

When the Supabase vars are present, `lib/supabase/*` and `middleware.ts` automatically switch from demo mode to real auth + session refresh.

---

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** and run, in order:
   1. [`supabase/schema.sql`](supabase/schema.sql) — tables + the `handle_new_user` trigger that auto-creates a profile on signup.
   2. [`supabase/rls.sql`](supabase/rls.sql) — Row Level Security policies.
   3. [`supabase/seed.sql`](supabase/seed.sql) — schools, modules, lessons, badges, clubs, challenges, and the leaderboard cache.
3. Copy your project URL + anon key into `.env.local`.
4. Restart `npm run dev`.

### Database schema

User-owned tables enforce RLS so each student can only touch their own data, while social content (posts, profiles, leaderboards) is publicly readable.

```
Catalog (public read)          User-owned (RLS: owner-only writes)
─────────────────────          ──────────────────────────────────
schools                        profiles            user_lesson_progress
lesson_modules                 user_xp             user_badges
lessons                        user_challenges     posts
quizzes                        comments            reactions
quiz_questions                 follows             club_members
badges                         portfolio_simulator_accounts
clubs                          portfolio_holdings
challenges                     notifications
schools_leaderboard            referrals
```

**Security model (RLS):** Anyone can read public posts and campus content. Authenticated users can edit only their own profile, posts, progress, portfolio, and notifications. The portfolio simulator is strictly private — holdings are gated through ownership of the parent account.

### Seed data

`seed.sql` populates **11 schools, 5 modules, 20 lessons, 10 badges, 8 clubs, 10 challenges,** and the school leaderboard. Full lesson bodies + quizzes also live in the app data layer (`lib/data/*`) so the product is fully populated in demo mode and ready to back with the database.

---

## Project structure

```
app/
  (auth)/            login + 3-step signup (own split-screen layout)
  (app)/             authenticated shell (sidebar + topbar + mobile nav)
    dashboard/       command center
    learn/           hub + [lessonId] lesson pages w/ interactive quiz
    simulator/       $10k mock portfolio simulator
    campus/          social feed (My Campus / Following / National / Clubs)
    clubs/           directory + [clubId] club pages
    leaderboards/    6 competitive boards + school podium
    coach/           Capital Coach AI chat
    profile/ challenges/ notifications/ search/ settings/
  api/coach/         Coach route handler (LLM-ready)
  page.tsx           world-class landing page
components/
  ui/                design system (Button, Card, Pill, Avatar, Progress, …)
  brand/ landing/ shell/ dashboard/ campus/ learn/ leaderboards/
lib/
  data/              rich, typed seed/mock data layer
  supabase/          demo-aware client/server/config
  coach.ts           offline AI tutor knowledge engine (LLM-swappable)
  portfolio-utils.ts risk + diversification scoring
supabase/            schema.sql · rls.sql · seed.sql
```

---

## Compliance & disclaimers

Campus Capital is an **educational platform only**.

- ❌ Not financial advice
- ❌ No real money, no real trading, no brokerage integration
- 🧪 All portfolios are **simulated**
- 🔎 Students should always do their own research before investing real money

These disclaimers are surfaced in-product on the simulator, the footer, settings, and Capital Coach.

---

## Future roadmap

The schema and structure are already wired for the company vision:

- 🎖️ **Campus ambassadors** — student leaders grow their school's community (`profiles.role`, `club_members.role`).
- 🏫 **University partnerships** — white-labeled financial literacy per campus.
- 📣 **Sponsored literacy campaigns** — brands fund lessons/challenges; students learn free.
- 💼 **Recruiting partnerships** — connect financially-literate talent with employers.
- 💎 **Premium subscriptions** — deeper simulators, analytics, and career prep.
- 📊 **Anonymous student-finance insights** — aggregate, privacy-safe trends (`referrals`, analytics tables).
- 🤝 **Brand & club analytics** — engagement dashboards per club and campus.

---

<div align="center">

**This isn't just an app. It's the financial network of the next generation.**

*Investing education built for students before they have money.*

</div>
