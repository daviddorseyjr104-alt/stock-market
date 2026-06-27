import type { Notification } from "@/lib/types";

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 3600_000).toISOString();

export const notifications: Notification[] = [
  { id: "n1", type: "badge", title: "Badge earned: ETF Explorer", body: "You finished the ETF & index fund track. Sharp work.", createdAt: hoursAgo(1), read: false, href: "/profile" },
  { id: "n2", type: "school", title: "UCLA moved up to #2 nationally", body: "Your campus jumped past USC this week. +12.4% growth.", createdAt: hoursAgo(3), read: false, href: "/leaderboards" },
  { id: "n3", type: "comment", title: "Imani Brooks commented on your post", body: "\"This is the way. One-stock portfolios are a heart attack waiting to happen.\"", createdAt: hoursAgo(5), read: false, href: "/campus" },
  { id: "n4", type: "follow", title: "Maya Lin started following you", body: "USC · Business Administration · Level 11", createdAt: hoursAgo(8), read: true, href: "/profile" },
  { id: "n5", type: "challenge", title: "Challenge ending soon", body: "\"Hit a 7-day learning streak\" ends in 2 days — you're at 71%.", createdAt: hoursAgo(11), read: false, href: "/challenges" },
  { id: "n6", type: "lesson", title: "New lesson unlocked", body: "\"The Roth IRA: a student's secret weapon\" is ready for you.", createdAt: hoursAgo(20), read: true, href: "/learn/roth-ira" },
  { id: "n7", type: "streak", title: "Don't break your 12-day streak 🔥", body: "Do one quick lesson today to keep the flame alive.", createdAt: hoursAgo(23), read: true, href: "/learn" },
  { id: "n8", type: "follow", title: "Andre Diallo started following you", body: "Berkeley · Data Science · Level 13", createdAt: hoursAgo(30), read: true, href: "/profile" },
];
