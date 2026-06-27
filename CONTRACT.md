# Campus Capital — Build Contract (for page authors)

Strictly reuse the existing design system. Do NOT invent new colors or restyle.
Dark mode only. Import path alias is `@/*` (e.g. `@/components/ui/Card`).
All interactive pages need `"use client"` at the top. Pages that are pure
display can be server components. App pages live under `app/(app)/<route>/page.tsx`
and are already wrapped by the shell (sidebar/topbar/mobile nav) — do NOT re-add
navigation. Use `<PageHeader>` at the top of each page.

## Visual language
- Surfaces: `<Card>` (glass) — props: `hover`, `glow`, `className`. Or raw `glass` / `glass-strong` classes.
- Rounded: cards `rounded-3xl`, inner chips `rounded-2xl`/`rounded-full`.
- Accent gradient text: `text-gradient-capital`. Brand gradient bg: `bg-capital-gradient` (use dark text `text-ink-950` on it).
- Brand greens: `capital-300/400/500`. Violet accent: `violet-400/500`. Muted text: `text-white/55`, `text-white/40`.
- Animations available: `animate-fade-up`, `animate-float`, `animate-count-pop`. Use `<Reveal delay={n}>` for scroll-in.
- Always keep generous spacing (Tesla-like). Use `gap-4`, `p-5`, section spacing `space-y-6`.

## UI components (exact APIs)
- `Button` (`@/components/ui/Button`): props `variant` = primary|secondary|ghost|outline|danger, `size` = sm|md|lg, `href?` (renders Link), plus button props. Put lucide icons as children.
- `Card`, `CardHeader` (`@/components/ui/Card`): `Card` props `hover`, `glow`, `className`. `CardHeader` props `title`, `subtitle?`, `icon?`, `action?`.
- `Pill` (`@/components/ui/Pill`): `tone` = default|capital|violet|amber|rose|sky|low|medium|high.
- `Avatar` (`@/components/ui/Avatar`): props `name`, `gradient` (tailwind gradient classes string), `size` = xs|sm|md|lg|xl, `ring?`.
- `ProgressBar` (`@/components/ui/Progress`): props `value` (0-100), `className?`. `RingProgress`: props `value`, `size?`, `stroke?`, children (center content).
- `StatCard` (`@/components/ui/StatCard`): props `label`, `value`, `sub?`, `icon?`, `tone?` = capital|violet|amber|rose.
- `EmptyState` (`@/components/ui/EmptyState`): props `icon`, `title`, `description`, `action?`.
- `Skeleton`, `CardSkeleton` (`@/components/ui/Skeleton`).
- `Disclaimer` (`@/components/ui/Disclaimer`): renders the standard educational disclaimer if no children.
- `Reveal` (`@/components/ui/Reveal`): props `delay?`, `y?`. `AnimatedNumber`: props `value`, `prefix?`, `suffix?`, `decimals?`.
- `PageHeader` (`@/components/ui/PageHeader`): props `title`, `subtitle?`, `action?`.
- Icons: `lucide-react`. Charts: `recharts` (client only). Motion: `framer-motion`.

## Helpers (`@/lib/utils`)
`cn(...)`, `formatCurrency(n)`, `formatCompact(n)`, `formatPercent(n)`, `initials(name)`, `timeAgo(iso)`, `gradientFor(seed)`.

## Data accessors (all from `@/lib/data/*`)
- `people.ts`: `currentUser` (Profile), `people` (Profile[]), `personById(id)`.
- `schools.ts`: `schools` (School[]), `schoolById(id)`.
- `lessons.ts`: `lessons`, `lessonById(id)`, `lessonsByModule(moduleId)`.
- `modules.ts`: `modules` (LearningModule[]), `moduleById(id)`.
- `badges.ts`: `badges`, `badgeById(id)`.
- `clubs.ts`: `clubs`, `clubById(id)`.
- `challenges.ts`: `challenges`, `challengeById(id)`.
- `posts.ts`: `posts`, `postsBySchool(id)`, `postsByClub(id)`.
- `notifications.ts`: `notifications`.
- `portfolio.ts`: `defaultPortfolio`, `tickerCatalog`.
- `leaderboards.ts`: `studentXpLeaders`, `streakLeaders`, `schoolLeaders`, `weeklyLeaders`, `clubLeaders`, `simulatorLeaders` (all LeaderRow[]).
- Types in `@/lib/types`. Coach engine: `@/lib/coach` → `getCoachResponse(q)`, `suggestedPrompts`. Portfolio math: `@/lib/portfolio-utils` → `riskScore`, `riskLabel`, `diversificationScore`, `biggestPosition`, `portfolioValue`, `dayChange`, `learningRecommendation`.

## Types quick ref
Profile: id, fullName, username, email, avatarColor, schoolId, major, gradYear, studentType, investingLevel, goal, interests[], bio, level, xp, streak, campusRank, nationalRank, followers, following, badges[], completedLessons[], clubs[], joinedAt.
Lesson: id, moduleId, order, title, difficulty, minutes, xp, summary, studentExample, body[], analogy, takeaway, quiz[] (QuizQuestion: id, prompt, options[], correctIndex, explanation).
Post: id, authorId, category, body, schoolId, clubId?, likes, liked?, comments[] (Comment: id, authorId, body, createdAt), createdAt, attachment? {kind, label, meta}.
Club: id, name, tagline, description, emoji, color, members, schoolScope, totalXp, learningGoal, weeklyChallenge.
Challenge: id, title, description, goal, steps[], xp, badgeId?, deadlineDays, progress, category, icon.
Holding: id, ticker, name, assetType, allocation, risk, changePct, lessonId?.

## Rules
- No TODO comments, no lorem ipsum, no broken links. Every button routes somewhere real or does something.
- Include loading skeletons / empty states where relevant and a `<Disclaimer />` on simulator-related pages.
- Mobile-first responsive. Test mental model: 1 column on mobile, 2-3 on desktop.
- Keep copy student-native and on-brand. Never give definitive financial advice.
