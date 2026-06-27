import type { School } from "@/lib/types";

export const schools: School[] = [
  { id: "ucla", name: "University of California, Los Angeles", shortName: "UCLA", location: "Los Angeles, CA", color: "from-sky-400 to-amber-400", emoji: "🐻", totalXp: 1284500, activeStudents: 3120, weeklyGrowth: 12.4, topStudent: "Davon Carter" },
  { id: "usc", name: "University of Southern California", shortName: "USC", location: "Los Angeles, CA", color: "from-rose-500 to-amber-400", emoji: "✌️", totalXp: 1190200, activeStudents: 2870, weeklyGrowth: 9.1, topStudent: "Maya Lin" },
  { id: "berkeley", name: "UC Berkeley", shortName: "Berkeley", location: "Berkeley, CA", color: "from-blue-500 to-amber-300", emoji: "🐻", totalXp: 1342900, activeStudents: 3410, weeklyGrowth: 14.8, topStudent: "Andre Diallo" },
  { id: "stanford", name: "Stanford University", shortName: "Stanford", location: "Stanford, CA", color: "from-rose-600 to-rose-400", emoji: "🌲", totalXp: 1098700, activeStudents: 2210, weeklyGrowth: 7.6, topStudent: "Priya Raman" },
  { id: "howard", name: "Howard University", shortName: "Howard", location: "Washington, D.C.", color: "from-red-500 to-blue-600", emoji: "🦬", totalXp: 1411300, activeStudents: 3680, weeklyGrowth: 18.2, topStudent: "Jordan Banks" },
  { id: "nyu", name: "New York University", shortName: "NYU", location: "New York, NY", color: "from-violet-500 to-fuchsia-500", emoji: "🗽", totalXp: 1255100, activeStudents: 3040, weeklyGrowth: 10.7, topStudent: "Sofia Russo" },
  { id: "michigan", name: "University of Michigan", shortName: "Michigan", location: "Ann Arbor, MI", color: "from-blue-700 to-amber-400", emoji: "〽️", totalXp: 1208400, activeStudents: 2950, weeklyGrowth: 8.9, topStudent: "Tyler Novak" },
  { id: "texas", name: "University of Texas at Austin", shortName: "Texas", location: "Austin, TX", color: "from-orange-500 to-amber-400", emoji: "🤘", totalXp: 1176800, activeStudents: 2810, weeklyGrowth: 11.3, topStudent: "Camila Reyes" },
  { id: "gsu", name: "Georgia State University", shortName: "Georgia State", location: "Atlanta, GA", color: "from-blue-600 to-sky-400", emoji: "🐾", totalXp: 1320600, activeStudents: 3520, weeklyGrowth: 16.5, topStudent: "Marcus Hill" },
  { id: "spelman", name: "Spelman College", shortName: "Spelman", location: "Atlanta, GA", color: "from-rose-500 to-fuchsia-500", emoji: "💙", totalXp: 1389900, activeStudents: 1980, weeklyGrowth: 21.4, topStudent: "Imani Brooks" },
  { id: "morehouse", name: "Morehouse College", shortName: "Morehouse", location: "Atlanta, GA", color: "from-rose-600 to-amber-500", emoji: "🐯", totalXp: 1276400, activeStudents: 1720, weeklyGrowth: 19.7, topStudent: "Elijah Grant" },
];

export const schoolById = (id: string) => schools.find((s) => s.id === id);
