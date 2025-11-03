"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  FileText,
  User,
  HelpCircle,
  Settings,
  Menu,
  GraduationCap,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/trainee/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Documents",
    href: "/trainee/documents",
    icon: FileText,
  },
  {
    name: "Profile",
    href: "/trainee/profile",
    icon: User,
  },
];

const secondaryNavigation = [
  {
    name: "Help & Support",
    href: "/trainee/help",
    icon: HelpCircle,
  },
  {
    name: "Settings",
    href: "/trainee/settings",
    icon: Settings,
  },
];

// Desktop Sidebar
export const TraineeSidebar = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-16 left-4 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div className="flex h-16 items-center gap-2 border-b px-4">
                <div className="bg-primary rounded-lg p-2">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">IDMAWA</h1>
                  <p className="text-xs text-muted-foreground">Trainee Portal</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto py-4 px-3">
                <nav className="flex flex-col gap-y-6">
                  {/* Main Navigation */}
                  <div>
                    <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Main Menu
                    </p>
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
                  </div>

                  <Separator />

                  {/* Secondary Navigation */}
                  <div>
                    <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Support
                    </p>
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
                  </div>
                </nav>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
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
    </>
  );
};
