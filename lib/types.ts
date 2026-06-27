// ──────────────────────────────────────────────────────────────────────────
// Campus Capital — shared domain types
// Mirrors the Supabase schema in /supabase/schema.sql
// ──────────────────────────────────────────────────────────────────────────

export type StudentType =
  | "freshman"
  | "sophomore"
  | "junior"
  | "senior"
  | "transfer"
  | "grad student";

export type InvestingLevel =
  | "beginner"
  | "some knowledge"
  | "intermediate"
  | "advanced";

export type Goal =
  | "Learn basics"
  | "Build first portfolio"
  | "Understand ETFs"
  | "Prepare for finance career"
  | "Build wealth long-term"
  | "Learn before investing real money";

export type Interest =
  | "Stocks"
  | "ETFs"
  | "Roth IRA"
  | "Budgeting"
  | "Credit"
  | "Real estate"
  | "Entrepreneurship"
  | "Finance careers"
  | "Crypto education only"
  | "Economic news";

export interface School {
  id: string;
  name: string;
  shortName: string;
  location: string;
  color: string; // tailwind gradient classes
  emoji: string;
  totalXp: number;
  activeStudents: number;
  weeklyGrowth: number; // percent
  topStudent: string;
}

export interface Profile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatarColor: string;
  schoolId: string;
  major: string;
  gradYear: number;
  studentType: StudentType;
  investingLevel: InvestingLevel;
  goal: Goal;
  interests: Interest[];
  bio: string;
  level: number;
  xp: number;
  streak: number;
  campusRank: number;
  nationalRank: number;
  followers: number;
  following: number;
  badges: string[]; // badge ids
  completedLessons: string[]; // lesson ids
  clubs: string[]; // club ids
  joinedAt: string;
}

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  difficulty: Difficulty;
  minutes: number;
  xp: number;
  summary: string;
  studentExample: string;
  body: string[]; // paragraphs
  analogy: string;
  takeaway: string;
  quiz: QuizQuestion[];
}

export interface LearningModule {
  id: string;
  letter: string;
  title: string;
  description: string;
  color: string;
  icon: string; // lucide icon name
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  color: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
}

export type PostCategory =
  | "Question"
  | "Lesson insight"
  | "Portfolio simulator"
  | "Internship money"
  | "Budgeting"
  | "Finance career"
  | "Campus club";

export interface Comment {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  category: PostCategory;
  body: string;
  schoolId: string;
  clubId?: string;
  likes: number;
  liked?: boolean;
  comments: Comment[];
  createdAt: string;
  attachment?: { kind: "lesson" | "portfolio"; label: string; meta: string };
}

export interface Club {
  id: string;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  color: string;
  members: number;
  schoolScope: "single" | "national";
  totalXp: number;
  learningGoal: string;
  weeklyChallenge: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  goal: string;
  steps: string[];
  xp: number;
  badgeId?: string;
  deadlineDays: number;
  progress: number; // 0-100
  category: string;
  icon: string;
}

export type AssetType = "Stock" | "ETF" | "Index Fund" | "Bond" | "Cash";
export type RiskLabel = "Low" | "Medium" | "High";

export interface Holding {
  id: string;
  ticker: string;
  name: string;
  assetType: AssetType;
  allocation: number; // percent of portfolio
  risk: RiskLabel;
  changePct: number; // mock daily change
  lessonId?: string;
}

export interface Portfolio {
  startingBalance: number;
  cash: number;
  holdings: Holding[];
}

export type NotificationType =
  | "lesson"
  | "follow"
  | "comment"
  | "school"
  | "challenge"
  | "streak"
  | "badge";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface LeaderRow {
  rank: number;
  name: string;
  meta: string;
  xp: number;
  delta: number; // weekly change in rank
  avatarColor: string;
  highlight?: boolean;
}
