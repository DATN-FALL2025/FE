"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FileCheck,
  Users,
  BarChart3,
  Settings,
  BookOpen,
  Building2,
} from "lucide-react";

const headNavigation = [
  {
    name: "Dashboard",
    href: "/head/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Criteria Matrix",
    href: "/head/criteria",
    icon: FileCheck,
  },
  {
    name: "Students",
    href: "/head/students",
    icon: Users,
  },
  {
    name: "Documents",
    href: "/head/documents",
    icon: BookOpen,
  },
  {
    name: "Reports",
    href: "/head/reports",
    icon: BarChart3,
  },
];

const secondaryNavigation = [
  {
    name: "Settings",
    href: "/head/settings",
    icon: Settings,
  },
];

export const HeadMobileSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-y-5 overflow-y-auto bg-background px-6 py-8">
      {/* Logo */}
      <Link href="/head/dashboard" className="flex items-center gap-2 mb-4">
        <div className="bg-primary rounded-lg p-2">
          <Building2 className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-lg">IDMAWA</h1>
          <p className="text-xs text-muted-foreground">Head Portal</p>
        </div>
      </Link>

      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Department Management
            </div>
            <ul role="list" className="space-y-1">
              {headNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3",
                          isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          <li>
            <Separator />
          </li>

          {/* Secondary Navigation */}
          <li>
            <ul role="list" className="space-y-1">
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3",
                          isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

