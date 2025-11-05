import { Route } from "./sidebar-link";
import {
  LayoutDashboard,
  FileText,
  User,
  HelpCircle,
  Settings,
  Grid3x3,
  Users,
} from "lucide-react";

// Trainee Routes
export const routes: Route[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    activeIcon: LayoutDashboard,
    href: "/trainee/dashboard",
  },
  {
    label: "My Documents",
    icon: FileText,
    activeIcon: FileText,
    href: "/trainee/documents",
  },
  {
    label: "Profile",
    icon: User,
    activeIcon: User,
    href: "/trainee/profile",
  },
  {
    label: "Help & Support",
    icon: HelpCircle,
    activeIcon: HelpCircle,
    href: "/trainee/help",
  },
  {
    label: "Settings",
    icon: Settings,
    activeIcon: Settings,
    href: "/trainee/settings",
  },
];

// Training Director Routes
export const trainingDirectorRoutes: Route[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    activeIcon: LayoutDashboard,
    href: "/training-director/dashboard",
  },
  {
    label: "Matrix Management",
    icon: Grid3x3,
    activeIcon: Grid3x3,
    href: "/training-director/matrix",
  },
  {
    label: "Documents",
    icon: FileText,
    activeIcon: FileText,
    href: "/training-director/documents",
  },
  {
    label: "Profile",
    icon: User,
    activeIcon: User,
    href: "/training-director/profile",
  },
  {
    label: "Help & Support",
    icon: HelpCircle,
    activeIcon: HelpCircle,
    href: "/training-director/help",
  },
  {
    label: "Settings",
    icon: Settings,
    activeIcon: Settings,
    href: "/training-director/settings",
  },
];

// Head of Department Routes
export const headRoutes: Route[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    activeIcon: LayoutDashboard,
    href: "/head/dashboard",
  },
  {
    label: "Matrix Management",
    icon: Grid3x3,
    activeIcon: Grid3x3,
    href: "/head/matrix",
  },
  {
    label: "Trainees",
    icon: Users,
    activeIcon: Users,
    href: "/head/trainees",
  },
  {
    label: "Documents",
    icon: FileText,
    activeIcon: FileText,
    href: "/head/documents",
  },
  {
    label: "Profile",
    icon: User,
    activeIcon: User,
    href: "/head/profile",
  },
  {
    label: "Help & Support",
    icon: HelpCircle,
    activeIcon: HelpCircle,
    href: "/head/help",
  },
  {
    label: "Settings",
    icon: Settings,
    activeIcon: Settings,
    href: "/head/settings",
  },
];

