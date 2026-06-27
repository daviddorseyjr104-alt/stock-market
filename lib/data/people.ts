import type { Profile } from "@/lib/types";

// The signed-in demo user.
export const currentUser: Profile = {
  id: "u-davon",
  fullName: "Davon Carter",
  username: "davon",
  email: "davon@ucla.edu",
  avatarColor: "from-capital-400 to-violet-500",
  schoolId: "ucla",
  major: "Economics",
  gradYear: 2027,
  studentType: "sophomore",
  investingLevel: "some knowledge",
  goal: "Build wealth long-term",
  interests: ["ETFs", "Roth IRA", "Budgeting", "Finance careers"],
  bio: "Sophomore econ major learning to build wealth before I have any. Café shifts by day, index funds by 2050. 🐻",
  level: 7,
  xp: 4820,
  streak: 12,
  campusRank: 4,
  nationalRank: 137,
  followers: 213,
  following: 184,
  badges: ["first-lesson", "budget-builder", "roth-rookie", "streak-7", "etf-explorer", "campus-top-10"],
  completedLessons: ["what-is-investing", "why-students-early", "saving-vs-investing", "risk-explained", "compound-interest", "budgeting-college", "emergency-funds", "etfs", "roth-ira"],
  clubs: ["ucla-investors", "black-wealth", "first-gen"],
  joinedAt: "2025-09-02T12:00:00Z",
};

export const people: Profile[] = [
  currentUser,
  { id: "u-maya", fullName: "Maya Lin", username: "mayalin", email: "maya@usc.edu", avatarColor: "from-rose-400 to-fuchsia-500", schoolId: "usc", major: "Business Administration", gradYear: 2026, studentType: "junior", investingLevel: "intermediate", goal: "Prepare for finance career", interests: ["Stocks", "Finance careers", "Economic news"], bio: "USC junior prepping for IB recruiting. Markets nerd.", level: 11, xp: 9240, streak: 31, campusRank: 1, nationalRank: 12, followers: 540, following: 210, badges: ["first-lesson", "etf-explorer", "compound-king", "streak-30", "risk-manager"], completedLessons: [], clubs: ["usc-traders", "women-investing"], joinedAt: "2025-08-20T12:00:00Z" },
  { id: "u-andre", fullName: "Andre Diallo", username: "andre", email: "andre@berkeley.edu", avatarColor: "from-blue-500 to-capital-400", schoolId: "berkeley", major: "Data Science", gradYear: 2027, studentType: "sophomore", investingLevel: "advanced", goal: "Build wealth long-term", interests: ["ETFs", "Real estate", "Economic news"], bio: "Cal sophomore. Backtesting strategies for fun. Index funds for real.", level: 13, xp: 11800, streak: 44, campusRank: 1, nationalRank: 4, followers: 720, following: 156, badges: ["first-lesson", "compound-king", "streak-30", "diversified", "risk-manager"], completedLessons: [], clubs: ["entrepreneurship-markets"], joinedAt: "2025-08-15T12:00:00Z" },
  { id: "u-imani", fullName: "Imani Brooks", username: "imani", email: "imani@spelman.edu", avatarColor: "from-fuchsia-500 to-violet-600", schoolId: "spelman", major: "Finance", gradYear: 2026, studentType: "junior", investingLevel: "intermediate", goal: "Build wealth long-term", interests: ["Roth IRA", "Real estate", "Entrepreneurship"], bio: "Spelman finance major. Building generational wealth, loudly. 💙", level: 12, xp: 10350, streak: 28, campusRank: 1, nationalRank: 8, followers: 890, following: 240, badges: ["first-lesson", "roth-rookie", "compound-king", "streak-7", "campus-top-10"], completedLessons: [], clubs: ["black-wealth", "women-investing", "atlanta-collective"], joinedAt: "2025-08-18T12:00:00Z" },
  { id: "u-jordan", fullName: "Jordan Banks", username: "jbanks", email: "jordan@howard.edu", avatarColor: "from-red-500 to-blue-600", schoolId: "howard", major: "Economics", gradYear: 2025, studentType: "senior", investingLevel: "advanced", goal: "Prepare for finance career", interests: ["Stocks", "Finance careers", "ETFs"], bio: "Howard senior, incoming analyst. Bison forever. 🦬", level: 14, xp: 13200, streak: 52, campusRank: 1, nationalRank: 2, followers: 1100, following: 180, badges: ["first-lesson", "etf-explorer", "compound-king", "streak-30", "risk-manager", "campus-top-10"], completedLessons: [], clubs: ["black-wealth"], joinedAt: "2025-08-10T12:00:00Z" },
  { id: "u-sofia", fullName: "Sofia Russo", username: "sofia", email: "sofia@nyu.edu", avatarColor: "from-violet-500 to-fuchsia-500", schoolId: "nyu", major: "Mathematics", gradYear: 2027, studentType: "sophomore", investingLevel: "some knowledge", goal: "Understand ETFs", interests: ["ETFs", "Budgeting", "Economic news"], bio: "NYU math major figuring out money in the most expensive city ever. 🗽", level: 8, xp: 5600, streak: 9, campusRank: 3, nationalRank: 96, followers: 320, following: 290, badges: ["first-lesson", "budget-builder", "streak-7"], completedLessons: [], clubs: ["first-gen", "women-investing"], joinedAt: "2025-09-05T12:00:00Z" },
  { id: "u-marcus", fullName: "Marcus Hill", username: "marcus", email: "marcus@gsu.edu", avatarColor: "from-blue-600 to-sky-400", schoolId: "gsu", major: "Accounting", gradYear: 2026, studentType: "junior", investingLevel: "intermediate", goal: "Build first portfolio", interests: ["Stocks", "Budgeting", "Credit"], bio: "Georgia State accounting. First-gen, full focus. 🐾", level: 10, xp: 8100, streak: 19, campusRank: 1, nationalRank: 21, followers: 410, following: 220, badges: ["first-lesson", "budget-builder", "roth-rookie", "streak-7"], completedLessons: [], clubs: ["first-gen", "atlanta-collective"], joinedAt: "2025-08-22T12:00:00Z" },
  { id: "u-priya", fullName: "Priya Raman", username: "priya", email: "priya@stanford.edu", avatarColor: "from-amber-400 to-rose-500", schoolId: "stanford", major: "Symbolic Systems", gradYear: 2027, studentType: "sophomore", investingLevel: "some knowledge", goal: "Build wealth long-term", interests: ["ETFs", "Entrepreneurship", "Finance careers"], bio: "Stanford. Building things and a portfolio. 🌲", level: 9, xp: 6900, streak: 16, campusRank: 2, nationalRank: 58, followers: 470, following: 200, badges: ["first-lesson", "etf-explorer", "streak-7"], completedLessons: [], clubs: ["entrepreneurship-markets", "women-investing"], joinedAt: "2025-08-28T12:00:00Z" },
  { id: "u-tyler", fullName: "Tyler Novak", username: "tyler", email: "tyler@umich.edu", avatarColor: "from-blue-700 to-amber-400", schoolId: "michigan", major: "Mechanical Engineering", gradYear: 2026, studentType: "junior", investingLevel: "beginner", goal: "Learn basics", interests: ["Budgeting", "Stocks", "Credit"], bio: "Michigan engineer learning money isn't a math class I can skip. 〽️", level: 6, xp: 3900, streak: 5, campusRank: 5, nationalRank: 188, followers: 150, following: 170, badges: ["first-lesson", "budget-builder"], completedLessons: [], clubs: ["first-gen"], joinedAt: "2025-09-10T12:00:00Z" },
  { id: "u-camila", fullName: "Camila Reyes", username: "camila", email: "camila@utexas.edu", avatarColor: "from-orange-500 to-amber-400", schoolId: "texas", major: "Marketing", gradYear: 2027, studentType: "transfer", investingLevel: "beginner", goal: "Learn before investing real money", interests: ["Budgeting", "Credit", "ETFs"], bio: "Transfer student, new to Austin and to investing. Hook 'em. 🤘", level: 5, xp: 3100, streak: 7, campusRank: 6, nationalRank: 240, followers: 120, following: 140, badges: ["first-lesson", "streak-7"], completedLessons: [], clubs: ["transfer-investors"], joinedAt: "2025-09-14T12:00:00Z" },
  { id: "u-elijah", fullName: "Elijah Grant", username: "elijah", email: "elijah@morehouse.edu", avatarColor: "from-rose-600 to-amber-500", schoolId: "morehouse", major: "Political Science", gradYear: 2026, studentType: "junior", investingLevel: "some knowledge", goal: "Build wealth long-term", interests: ["Real estate", "Entrepreneurship", "Roth IRA"], bio: "Morehouse man building wealth and community. 🐯", level: 10, xp: 7800, streak: 22, campusRank: 1, nationalRank: 27, followers: 520, following: 230, badges: ["first-lesson", "roth-rookie", "compound-king", "streak-7"], completedLessons: [], clubs: ["black-wealth", "atlanta-collective"], joinedAt: "2025-08-25T12:00:00Z" },
];

export const personById = (id: string) => people.find((p) => p.id === id);
