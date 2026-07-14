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

// Mobile bottom tab bar, hard cap of 5 tabs.
//
// Coach used to be cut here in favour of Profile, on the assumption it stayed
// reachable from a sidebar sheet — but the sidebar is `hidden lg:flex` and there
// is no sheet, so on a phone Coach was reachable only via the command palette.
// Asking a money question is a core reason to open the app, so it gets a tab;
// Profile moves to the avatar in the top bar, which is where people look anyway.
export const mobileNav: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Simulator", href: "/simulator", icon: TrendingUp },
  { label: "Coach", href: "/coach", icon: Bot },
  { label: "Campus", href: "/campus", icon: Users },
];
