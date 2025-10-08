import { LucideIcon } from "lucide-react";

export interface Route {
  label: string;
  icon: LucideIcon;
  activeIcon: LucideIcon;
  href: string;
  allowsRoles?: string[];
  children?: Route[];
}

