# Campus Capital — App Contract (data + state spine)

This is the single source of truth for page/feature authors building on the
course engine and gamified store. It covers every type, the full
`useAppState()` API, all data accessors, and the lock/unlock rules.
For the visual design system (components, colors, spacing), see `CONTRACT.md`
— those rules still apply unchanged. Import alias is `@/*`.

---

## 1. Core types (`@/lib/types`)

Legacy types (`Profile`, `Lesson`, `LearningModule`, `Badge`, `Club`, `Post`,
`Portfolio`, `Position`, `Notification`, `LeaderRow`, `Challenge`, `School`,
…) are unchanged, except:

- `Profile` gained OPTIONAL fields:
  - `hearts?: number` — current hearts (lives), default 5
  - `maxHearts?: number` — default 5, refilled daily
  - `skills?: string[]` — skill ids the user has started (≥1 lesson complete in that course)
- `Club` gained OPTIONAL fields:
  - `category?: string` — "Finance" | "Investing" | "Startup" | "Real estate" | "Consulting" | "Analytics"
  - `featured?: boolean`

### Course engine types (all in `@/lib/types`)

```ts
type QuestionType = "mcq" | "true-false" | "scenario" | "fill-in";

interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  context?: string;      // scenario setup text (present on "scenario")
  options?: string[];    // mcq / scenario
  correctIndex?: number; // mcq / scenario
  correctBool?: boolean; // true-false
  accept?: string[];     // fill-in accepted answers — compare case/space-insensitively
  explanation: string;   // always present, show after answering
  hint?: string;
  xp?: number;           // xp for a correct answer, default 10 (15 on hard/challenge)
}

interface TeachCard {
  kind: "teach";
  id: string;
  title: string;
  body: string;          // 1-3 sentences
  example?: string;      // concrete student example
  analogy?: string;
}

interface QuestionCard extends Question { kind: "question"; }
type LessonCard = TeachCard | QuestionCard;

type LessonKind = "lesson" | "challenge"; // "challenge" = boss/final node of a unit

interface CourseLesson {
  id: string; unitId: string; courseId: string;
  order: number; title: string;
  difficulty: Difficulty;   // "Beginner" | "Intermediate" | "Advanced"
  kind: LessonKind;
  xp: number;               // completion bonus (lessons 20-40, challenges 60-100)
  summary: string;
  cards: LessonCard[];      // teach cards first, then question cards, in play order
}

interface Unit {
  id: string; courseId: string; order: number;
  title: string; subtitle: string;
  lessons: CourseLesson[];  // last lesson of every unit is kind:"challenge"
}

interface Course {
  id: string; title: string; tagline: string; description: string;
  category: string;         // "Money" | "Investing" | "Startups" | "Career"
  icon: string;             // lucide icon NAME as string (render via dynamic lookup)
  color: string;            // tailwind gradient classes, e.g. "from-capital-400 to-capital-600"
  accent: string;           // tailwind color token, e.g. "capital-300" (use as text-…/border-…)
  order: number;
  unlockLevel: number;      // unlocks when profile.level >= unlockLevel
  units: Unit[];            // always 3 units, 4 lessons each (3 lessons + 1 challenge)
}

interface Skill { id: string; courseId: string; name: string; icon: string; }

interface DailyQuest {
  id: string; title: string; description: string;
  metric: "lessons" | "xp" | "correct" | "minutes";
  goal: number; xpReward: number; icon: string;
}

interface WeeklyGoal { id: string; title: string; metric: "xp" | "lessons"; goal: number; icon: string; }

interface CampusEvent {
  id: string; title: string;
  kind: "event" | "competition" | "office-hours" | "opportunity";
  org: string; date: string /* "YYYY-MM-DD" */; time: string /* display string */;
  location: string; description: string; tags: string[];
  capacity?: number; going: number; icon: string /* lucide name */;
}

interface CoachNote { id: string; title: string; body: string; topic: string; createdAt: string; }

interface SavedProject {
  id: string; kind: string;  // simulator id, e.g. "budget", "startup"
  title: string; summary: string; createdAt: string;
  data: Record<string, unknown>;
}

interface Certificate { id: string; courseId: string; title: string; earnedAt: string; }
```

---

## 2. Data accessors

### Courses — `@/lib/data/courses`

The catalog: **8 courses × 3 units × 4 lessons = 96 lessons** (each unit ends
in a `kind:"challenge"` boss lesson). Course content files live in
`lib/course-data/<course-id>.ts`; never import those directly — use these:

| Export | Signature | Semantics |
| --- | --- | --- |
| `courses` | `Course[]` | all 8 courses, sorted by `order` |
| `courseById` | `(id: string) => Course \| undefined` | lookup |
| `unitById` | `(id: string) => Unit \| undefined` | lookup |
| `courseLessonById` | `(id: string) => CourseLesson \| undefined` | lookup |
| `allCourseLessons` | `CourseLesson[]` | flat, in course → unit → lesson order |
| `lessonsForCourse` | `(courseId: string) => CourseLesson[]` | flat, unit → lesson order |
| `firstLessonOfCourse` | `(courseId: string) => CourseLesson \| undefined` | first lesson |
| `nextLessonId` | `(lessonId: string) => string \| undefined` | next lesson in the SAME course (crosses unit boundaries); undefined at course end |

The 8 courses:

| id | title | category | icon | unlockLevel |
| --- | --- | --- | --- | --- |
| `money-basics` | Money Basics | Money | Wallet | 1 |
| `credit-debt` | Credit & Debt | Money | CreditCard | 1 |
| `investing` | Investing | Investing | LineChart | 2 |
| `real-estate` | Real Estate | Investing | Building2 | 3 |
| `startup-building` | Startup Building | Startups | Rocket | 2 |
| `sales-networking` | Sales & Networking | Career | Handshake | 2 |
| `career-capital` | Career Capital | Career | Briefcase | 1 |
| `venture-capital` | Venture Capital | Investing | Landmark | 4 |

Id conventions: units `"<courseId>-u1..3"`, lessons `"<courseId>-uN-l1..4"`
(`l4` is the challenge), cards `"<lessonId>-t1.."` / `"<lessonId>-q1.."`.

### Skills — `@/lib/data/skills`
- `skills: Skill[]` — 8, one per course
- `skillById(id)`, `skillForCourse(courseId)`

### Quests — `@/lib/data/quests`
- `dailyQuests: DailyQuest[]` — the pool of 5
- `dailyQuestsFor(dateKey: string): DailyQuest[]` — the 3 active quests for a
  local date key ("YYYY-MM-DD"), **deterministic** (same input → same picks;
  safe on server and client). Always use this, never pick randomly.
- `dailyQuestById(id)`
- `weeklyGoals: WeeklyGoal[]` (3), `weeklyGoalById(id)`

### Campus events — `@/lib/data/campus-events`
- `campusEvents: CampusEvent[]` — 12 seeded events (mixers, pitch/stock-pitch/case
  competitions, VC office hours, mentor hours, internship fair, opportunity board)
- `eventById(id)`

### Clubs — `@/lib/data/clubs`
- `clubs: Club[]` — 11 clubs across Finance / Investing / Startup / Real estate /
  Consulting / Analytics; some have `featured: true`
- `clubById(id)`

### Badges — `@/lib/data/badges`
- `badges: Badge[]` — 20 badges. Legacy ids kept (`first-lesson`, `etf-explorer`,
  `compound-king`, `budget-builder`, `risk-manager`, `roth-rookie`,
  `campus-top-10`, `streak-7`, `streak-30`, `diversified`). New ids:
  `first-course`, `perfect-lesson`, `quiz-ace`, `level-5`, `level-10`,
  `money-master`, `investing-master`, `startup-master`, `career-master`,
  `first-trade`.
- `badgeById(id)`

### Leaderboards — `@/lib/data/leaderboards`
Existing exports unchanged (`studentXpLeaders`, `streakLeaders`,
`schoolLeaders`, `weeklyLeaders`, `clubLeaders`, `simulatorLeaders`). New
seeded boards, each `LeaderRow[]` with 10 rows, pre-sorted DESC:
- `uclaLeaders` — campus board (all-time XP)
- `nationalLeaders` — cross-school board (all-time XP)
- `friendsLeaders` — the demo persona's friends
- `weeklyXpLeaders` — this week's XP (small numbers by design)
- `streakRankLeaders` — ranked by streak; **`xp` field carries streak days**
- `campusCompetitionLeaders` — club/team standings; `xp` = competition points

These are seeded "other students" — the live user is NOT in them. Merge
`useAppState().profile` in yourself if a board should show the current user.

### Legacy learn path (still live, unchanged)
`@/lib/data/lessons` (`lessons`, `lessonById`, `lessonsByModule`),
`@/lib/data/modules`, plus `people`, `schools`, `posts`, `notifications`,
`portfolio`, `challenges` as documented in `CONTRACT.md`.

---

## 3. State — `useAppState()` (`@/lib/store`)

`AppStateProvider` wraps the app already. All state persists via the
repository (localStorage snapshot `cc_state_v1`, `Snapshot.v === 2`; Supabase
when configured). A version-mismatched snapshot is discarded → fresh demo state.

**The current user starts near zero.** XP, level, streak, badges, lessons,
certificates are all EARNED through the store. Never fabricate user stats.

### State fields

| Field | Type | Semantics |
| --- | --- | --- |
| `hydrated` | `boolean` | false until persisted state loads — gate UI on it (show skeletons) |
| `authed` | `boolean` | logged-in flag |
| `profile` | `Profile` | the live user (xp, level, streak, hearts, badges, skills, clubs, completedLessons…) |
| `posts` | `Post[]` | campus feed |
| `portfolio` | `Portfolio` | paper-trading account |
| `notifications` / `unreadCount` | `Notification[]` / `number` | |
| `challengeProgress` | `Record<string, number>` | legacy challenges page |
| `dailyXp` | `{ date; xp; correct; lessons; minutes }` | today's counters, auto-reset on a new local day |
| `coachNotes` | `CoachNote[]` | saved coach notes, newest first |
| `savedProjects` | `SavedProject[]` | saved simulator results, newest first |
| `rsvps` | `string[]` | RSVP'd campus event ids |
| `certificates` | `Certificate[]` | earned course certificates |
| `hearts` | `number` | current hearts (0..maxHearts). Refills to max automatically on a new local day |
| `equityHistory` | `EquityPoint[]` | portfolio value over time |

### Methods

Auth (unchanged): `loginAsDemo()`, `signUp(input: SignupInput)`, `logout()`.

Learning / locks:
- `isCourseUnlocked(courseId: string): boolean` — `profile.level >= course.unlockLevel`
- `isLessonUnlocked(lessonId: string): boolean` — true for the first lesson of
  its course, or when the previous lesson (flat course order) is complete.
  Also works for legacy path lessons (sequential order).
- `isLessonComplete(lessonId: string): boolean` — works for legacy AND course lesson ids
- `completeLesson(lessonId: string): LessonReward` — idempotent. Marks
  complete, adds the lesson's completion XP, advances the streak, bumps
  `dailyXp.lessons/xp/minutes`, recomputes level/badges/skills, updates quest
  progress (auto-awards quest `xpReward` once on completion), awards a
  certificate + notification when the course just became fully complete, and
  pushes level-up/badge notifications. Accepts legacy ids and CourseLesson ids.
- `skillProgress(): { skill: Skill; course: Course; pct: number; done: number; total: number }[]`
  — one row per skill/course (including 0% ones), derived from completedLessons.

```ts
interface LessonReward {
  xpGained: number;
  leveledUp: boolean;
  newBadgeIds: string[];
  alreadyDone: boolean;          // true → nothing changed, no XP
  unlockedLessonId?: string;     // next lesson in the course, if any
  courseCompletedId?: string;    // set when this completion finished the course
}
```

Hearts + answers (the lesson-player loop):
- `hearts: number` — read the current value
- `recordAnswer(correct: boolean, xp?: number): { hearts: number }` — call once
  per answered question. Correct: adds `xp` (default 10; pass `card.xp`) to
  profile + dailyXp and increments `dailyXp.correct`. Wrong: loses one heart
  (never below 0). Returns hearts AFTER the answer.
- `loseHeart(): number` — decrement (min 0), returns remaining. Prefer `recordAnswer(false)`.
- `refillHearts(): void` — instant refill to max (e.g. practice reward). Daily
  refill is automatic; don't call this on a timer.

Intended player flow: walk `lesson.cards` in order; teach cards advance freely;
question cards call `recordAnswer(...)`; at the end call `completeLesson(lesson.id)`
once and render the `LessonReward`. Fill-in answers match if
`input.trim().toLowerCase().replace(/\s+/g, " ")` equals any `accept` entry
normalized the same way. A run finished at full hearts earns the sticky
`perfect-lesson` badge automatically inside `completeLesson`.

Quests:
- `questProgressFor(dateKey: string): { quest: DailyQuest; value: number; done: boolean }[]`
  — status of the 3 active quests for that date (use `dateKey()` from the store
  for today). Values come from `dailyXp`; quests auto-complete and auto-award
  their `xpReward` via `recordAnswer`/`completeLesson` — do NOT add XP yourself.

Coach + projects:
- `addCoachNote(note: { title: string; body: string; topic: string }): void`
- `deleteCoachNote(id: string): void`
- `saveProject(p: { kind: string; title: string; summary: string; data: Record<string, unknown> }): SavedProject`
- `deleteProject(id: string): void`

Campus + clubs:
- `toggleRsvp(eventId: string): void`, `hasRsvp(eventId: string): boolean`
- `joinClub(clubId)`, `leaveClub(clubId)`, `toggleClub(clubId)`, `isClubMember(clubId): boolean`
  — all operate on `profile.clubs`

Social (unchanged): `toggleLike(postId)`, `addPost(body, category, clubId?)`,
`addComment(postId, body)`.

Portfolio (unchanged): `buy(order: BuyOrder)`, `sell(positionId, shares, price)`,
`resetPortfolio()`, `recordEquity(value)`, `equityHistory`.

Misc (unchanged): `markNotificationRead(id)`, `markAllNotificationsRead()`,
`setChallengeProgress(id, value)`, `updateProfile(patch)`.

### Progression helpers (also exported from `@/lib/store`)

- `XP_PER_LEVEL = 1000`, `levelForXp(xp)`, `xpProgressInLevel(xp) → { inLevel, pct }`
- `dateKey(d?: Date): string` — local "YYYY-MM-DD"; use for `questProgressFor`
- `nextStreak(current, lastActive)` — streak math (store calls this for you)
- `computeBadges(profile, positions, signals?)` — full badge recompute; badges
  are DERIVED, never hand-assign `profile.badges`
- `computeSkills(profile): string[]` — skill ids with ≥1 lesson complete
- `courseProgress(courseId, completed: string[] | Set<string>) → { done, total, pct }`
  (also exported as `courseCompletion` — identical function, either name works)
- `MAX_HEARTS = 5`, `SNAPSHOT_VERSION`, types `Snapshot`, `DailyXp`, `EquityPoint`,
  `LessonReward`, `QuestStatus`, `SkillProgressRow`, `SignupInput`, `BuyOrder`

---

## 4. Lock/unlock rules (canonical)

1. A **course** is locked until `profile.level >= course.unlockLevel`
   (`isCourseUnlocked`). Level comes from XP: level = `floor(xp/1000) + 1`,
   so a fresh user (0 XP) is level 1 and sees `money-basics`, `credit-debt`,
   `career-capital` unlocked.
2. Within a course, **lessons unlock sequentially** in flat course order
   (units are not gates by themselves): first lesson always unlocked, each
   next lesson unlocks when the previous one is complete (`isLessonUnlocked`).
3. Completion is permanent and idempotent (`completedLessons` on the profile).
4. Hearts gate mistakes, not access: at 0 hearts a page should block further
   question attempts for the day (or offer practice/refill UX), but never
   un-complete anything. Hearts auto-refill on a new local day.
5. Certificates: awarded automatically by `completeLesson` when every lesson
   of a course is complete — never create one manually.

## 5. Rendering notes

- `Course.icon`, `Skill.icon`, `DailyQuest.icon`, `CampusEvent.icon` are
  **lucide icon names as strings**. Render with a lookup, e.g.
  `import * as icons from "lucide-react"` … `const Icon = (icons as Record<string, LucideIcon>)[name] ?? icons.Sparkles`.
- `Course.color` is a tailwind gradient pair for `bg-gradient-to-br`;
  `Course.accent` is a bare token (compose class names statically where
  possible — safe pre-composed strings like `"text-capital-300"` are preferred
  over dynamic template literals, which Tailwind can't see).
- Legacy learn path (`/learn` serpentine path over `lessons`/`modules`) still
  works; new course pages should be built on the course engine accessors.
- Dark mode only, design tokens/components per `CONTRACT.md`.
