import { Route } from "./sidebar-link";
import {
  LayoutDashboard,
  FileText,
  User,
  HelpCircle,
  Settings,
} from "lucide-react";

export const routes: Route[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    activeIcon: LayoutDashboard,
    href: "/students/dashboard",
  },
  {
    label: "My Documents",
    icon: FileText,
    activeIcon: FileText,
    href: "/students/documents",
  },
  {
    label: "Profile",
    icon: User,
    activeIcon: User,
    href: "/students/profile",
  },
  {
    label: "Help & Support",
    icon: HelpCircle,
    activeIcon: HelpCircle,
    href: "/students/help",
  },
  {
    label: "Settings",
    icon: Settings,
    activeIcon: Settings,
    href: "/students/settings",
  },
];

