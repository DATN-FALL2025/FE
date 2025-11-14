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
} from "lucide-react";

const adminNavigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Department Management", href: "/admin/departments", icon: Building2 },
  { name: "Position Management", href: "/admin/positions", icon: Users },
  { name: "Document Management", href: "/admin/documents", icon: FileText },
  { name: "Rule Management", href: "/admin/rules", icon: Shield },
];

export const AdminMobileSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="bg-primary rounded-lg p-2">
          <Shield className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-lg">IDMAWA</h1>
          <p className="text-xs text-muted-foreground">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="flex flex-col gap-y-6">
          {/* Main Navigation */}
          <div>
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Administration
            </p>
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
          </div>
        </nav>
      </div>
    </div>
  );
};

