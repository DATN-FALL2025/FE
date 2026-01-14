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
  FileText,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { useAuthInfo } from "@/hooks/use-auth-info";
import { getDecodedToken } from "@/lib/auth-utils";

const navigation = [
  {
    name: "Trang chủ",
    href: "/trainees/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Tài liệu của tôi",
    href: "/trainees/documents",
    icon: FileText,
  },
  {
    name: "Xem yêu cầu hồ sơ",
    href: "/trainees/document-requirements",
    icon: ClipboardList,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { displayName, avatar, logout } = useAuthInfo();
  const [mounted, setMounted] = useState(false);
  const [departmentName, setDepartmentName] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    const decoded = getDecodedToken();
    if (decoded?.departmentName) {
      setDepartmentName(decoded.departmentName);
    }
  }, []);

  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'ST';

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col lg:pt-16 sidebar-dark border-r">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 py-8">
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
                            "w-full justify-start gap-3 text-sidebar-foreground hover:bg-white/10",
                            isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
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

        {/* Logout Button - Bottom */}
        <div className="mt-auto">
          <Separator className="mb-4" />
          {mounted ? (
            <>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10">
                <Avatar className="h-10 w-10">
                  {avatar && <AvatarImage src={avatar} alt={displayName} />}
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-sidebar-foreground">{displayName}</p>
                  {departmentName && (
                    <p className="text-xs text-sidebar-foreground/70 truncate">
                      {departmentName}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 mt-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
                Đăng xuất
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-white/20" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-24 bg-white/20 rounded" />
                <div className="h-3 w-16 bg-white/20 rounded" />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

