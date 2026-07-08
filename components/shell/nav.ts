import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Users,
  Boxes,
  Trophy,
  Bot,
  User,
  Settings,
  Home,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Desktop sidebar, every primary surface of the app.
export const primaryNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Simulator", href: "/simulator", icon: TrendingUp },
  { label: "Campus", href: "/campus", icon: Users },
  { label: "Clubs", href: "/clubs", icon: Boxes },
  { label: "Leaderboards", href: "/leaderboards", icon: Trophy },
  { label: "Coach", href: "/coach", icon: Bot },
];

export const secondaryNav: NavItem[] = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

// Mobile bottom tab bar, hard cap of 5 tabs. The core loop (Home, Learn,
// Simulator, Campus, Profile) keeps its slots; Coach, Clubs and Leaderboards
// stay reachable from the sidebar sheet / dashboard cards on mobile.
export const mobileNav: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Simulator", href: "/simulator", icon: TrendingUp },
  { label: "Campus", href: "/campus", icon: Users },
  { label: "Profile", href: "/profile", icon: User },
];
