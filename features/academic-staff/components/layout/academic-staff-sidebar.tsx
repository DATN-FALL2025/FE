"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  FileCheck,
  LogOut,
} from "lucide-react";
import { useAuthInfo } from "@/hooks/use-auth-info";

const academicStaffNavigation = [
  {
    name: "Dashboard",
    href: "/academic-staff/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Document Approvals",
    href: "/academic-staff/approvals",
    icon: FileCheck,
  },
];

export const AcademicStaffSidebar = () => {
  const pathname = usePathname();
  const { displayName, avatar, role, logout } = useAuthInfo();
  const [mounted, setMounted] = useState(false);

  // Only render user info after client-side mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'AS';

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:pt-16 border-r">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 py-8">
        {/* Main Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Academic Management
              </div>
              <ul role="list" className="space-y-1">
                {academicStaffNavigation.map((item) => {
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

        {/* User Info Section - Bottom */}
        <div className="mt-auto">
          <Separator className="mb-4" />
          {mounted ? (
            <>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10">
                  {avatar && <AvatarImage src={avatar} alt={displayName} />}
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  {role && (
                    <p className="text-xs text-muted-foreground truncate">
                      {role.replace(/_/g, ' ')}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </>
          ) : (
            // Loading skeleton during SSR/hydration
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
