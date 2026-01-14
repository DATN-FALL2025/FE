"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, User, LogOut, Target, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TrainingDirectorMobileSidebar } from "./training-director-mobile-sidebar";
import { useAuthInfo } from "@/hooks/use-auth-info";
import { translateRole } from "@/lib/auth-utils";

export const TrainingDirectorNavbar = () => {
  const { user, displayName, avatar, role, logout } = useAuthInfo();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userEmail = user?.gmail || user?.email || "";
  const userName = displayName || "User";

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'TD';

  return (
    <header className="sticky top-0 z-50 w-full border-b header-dark backdrop-blur supports-[backdrop-filter]:bg-sidebar-background/95">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left Side - Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-white/10">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <TrainingDirectorMobileSidebar />
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/training-director/dashboard" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <Target className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-sidebar-foreground">IDMAWA</h1>
              <p className="text-xs text-sidebar-foreground/70">Trang giám đốc đào tạo</p>
            </div>
          </Link>
        </div>

        {/* Right Side - Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* User Profile Dropdown */}
          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    {avatar && <AvatarImage src={avatar} alt={userName} />}
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                    {role && (
                      <Badge className="bg-primary mt-2 w-fit text-xs">
                        {translateRole(role)}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/training-director/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="h-10 w-10 rounded-full bg-white/20 animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
};
