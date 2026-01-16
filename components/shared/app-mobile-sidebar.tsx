"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuthInfo } from "@/hooks/use-auth-info";
import { navigationConfig } from "@/config/navigation";

export const AppMobileSidebar = () => {
  const pathname = usePathname();
  const { role } = useAuthInfo();

  // Get navigation items for current role
  const navConfig = role ? navigationConfig[role] : null;
  const navigationItems = navConfig?.items || [];

  return (
    <div className="flex h-full flex-col gap-y-5 overflow-y-auto bg-background px-6 py-8">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="bg-primary rounded-lg p-2">
          <svg
            className="w-6 h-6 text-primary-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <div>
          <h1 className="font-bold text-lg">IDMAWA</h1>
          <p className="text-xs text-muted-foreground">
            {navConfig?.title || "Hệ thống"}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="space-y-1">
          {navigationItems.map((item) => {
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
      </nav>
    </div>
  );
};
