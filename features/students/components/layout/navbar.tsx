"use client";

import Link from "next/link";
import { useStudentData } from "../../hooks/use-student-data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationCenter } from "../notifications/notification-center";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileSidebar } from "./mobile-sidebar";
import { Menu, User, Settings, LogOut, GraduationCap } from "lucide-react";

export const Navbar = () => {
  const {
    student,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useStudentData();

  const getInitials = (name: string) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full max-w-[1920px] mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left Side - Logo & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <MobileSidebar />
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/students/dashboard" className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-2">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg">IDMAWA</h1>
              <p className="text-xs text-muted-foreground">Student Portal</p>
            </div>
          </Link>
        </div>

        {/* Right Side - Notifications & Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <NotificationCenter
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
            onMarkAllAsRead={markAllNotificationsAsRead}
          />

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarImage
                    src={student?.avatar}
                    alt={student?.fullName || "Student"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(student?.fullName || "")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {student?.fullName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {student?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground font-mono mt-1">
                    {student?.studentCode}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/students/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

