import type { Skill } from "@/lib/types";

// One skill per course. A skill is "started" once the user completes at
// least one lesson in its course; skillProgress() in the store reports pct.
export const skills: Skill[] = [
  { id: "skill-budgeting", courseId: "money-basics", name: "Budgeting", icon: "Wallet" },
  { id: "skill-credit", courseId: "credit-debt", name: "Credit", icon: "CreditCard" },
  { id: "skill-investing", courseId: "investing", name: "Investing", icon: "LineChart" },
  { id: "skill-real-estate", courseId: "real-estate", name: "Real Estate", icon: "Building2" },
  { id: "skill-founding", courseId: "startup-building", name: "Founding", icon: "Rocket" },
  { id: "skill-selling", courseId: "sales-networking", name: "Selling", icon: "Handshake" },
  { id: "skill-career", courseId: "career-capital", name: "Career", icon: "Briefcase" },
  { id: "skill-venture", courseId: "venture-capital", name: "Venture", icon: "Landmark" },
];

export const skillById = (id: string) => skills.find((s) => s.id === id);

export const skillForCourse = (courseId: string) =>
  skills.find((s) => s.courseId === courseId);
