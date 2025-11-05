"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Grid3x3 } from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/training-director/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Matrix Management",
    href: "/training-director/matrix",
    icon: Grid3x3,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:pt-16 border-r">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 py-8">
        <nav className="flex flex-1 flex-col">
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
        </nav>
      </div>
    </aside>
  );
};
