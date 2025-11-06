"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Shield,
  Briefcase,
} from "lucide-react";

const adminNavigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Department Management",
    href: "/admin/departments",
    icon: Building2,
  },
  {
    name: "Position Management",
    href: "/admin/positions",
    icon: Briefcase,
  },
  {
    name: "Rule Management",
    href: "/admin/rules",
    icon: Shield,
  },
  {
    name: "Document Management",
    href: "/admin/documents",
    icon: FileText,
  },
  {
    name: "Account Management",
    href: "/admin/accounts",
    icon: Users,
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:pt-16 border-r">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 py-8">
        {/* Main Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Administration
              </div>
              <ul role="list" className="space-y-1">
                {adminNavigation.map((item) => {
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

