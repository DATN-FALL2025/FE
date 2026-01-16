"use client";

import { useTheme } from "next-themes";
import {
  Bell,
  Moon,
  Sun,
  Search,
  Building2,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthInfo } from "@/hooks/use-auth-info";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthInfo();
  const department = user?.departmentName || user?.department || "";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 cursor-pointer" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium">
                Trang Trưởng Khoa
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {department && (
          <>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Badge variant="outline" className="text-xs">
              {department}
            </Badge>
          </>
        )}
      </div>

      {/* Center Section - Search Bar */}
      <div className="hidden md:flex flex-1 justify-center max-w-xl mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm..."
            className="pl-10 h-9 bg-muted/50"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        {/* Search button - Mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden cursor-pointer h-8 w-8"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer h-8 w-8"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Chuyển đổi theme</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer h-8 w-8 relative"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <DropdownMenuItem className="cursor-pointer p-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">Tài liệu mới cần duyệt</p>
                    <p className="text-xs text-muted-foreground">10 phút trước</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer p-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 shrink-0">
                    <Bell className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">Ma trận đã được cập nhật</p>
                    <p className="text-xs text-muted-foreground">1 giờ trước</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer p-3">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 shrink-0">
                    <Settings className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">Cập nhật hệ thống</p>
                    <p className="text-xs text-muted-foreground">Hôm qua</p>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer justify-center text-primary font-medium">
              Xem tất cả thông báo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
