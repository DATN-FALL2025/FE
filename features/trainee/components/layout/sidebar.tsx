"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FileText,
  User,
  HelpCircle,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/trainees/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Documents",
    href: "/trainees/documents",
    icon: FileText,
  },
  {
    name: "Profile",
    href: "/trainees/profile",
    icon: User,
  },
];

const secondaryNavigation = [
  {
    name: "Help & Support",
    href: "/trainees/help",
    icon: HelpCircle,
  },
  {
    name: "Settings",
    href: "/trainees/settings",
    icon: Settings,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:pt-16 border-r">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 py-8">
        {/* Main Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="space-y-1">
                {navigation.map((item) => {
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
    </aside>
  );
};

