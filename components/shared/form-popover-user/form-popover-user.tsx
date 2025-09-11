"use client";

import React, { useCallback, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { 
  Settings,
  LogOut,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import UserAvatar from "./user-avatar";

// import { useRouter } from "next/navigation";
import { useRouter } from 'nextjs-toploader/app';

interface FormPopoverUserProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const FormPopoverUser = ({
  children,
  side = "bottom",
  align,
  sideOffset = 0,
}: FormPopoverUserProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  
  const hasManagementAccess = useCallback(() => {
    const role = session?.user?.roleName;
    return role === "Admin" || role === "Manager" || role === "Reviewer";
  }, [session?.user?.roleName]);

  useEffect(() => {
    if (hasManagementAccess()) {
      router.prefetch("/dashboard");
    }
  }, [hasManagementAccess, router]);

  const getFullName = useCallback((name: string) => {
    const nameParts = name.split(" ");
    return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
  }, []);

  const handleNavigateToDashboard = useCallback(() => {
   
    router.push("/dashboard");
  }, [router]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align={align}
        className="w-64 pt-3 mr-2 dark:bg-gray-800"
        side={side}
        sideOffset={sideOffset}
      >
        <div className="px-3 pb-2 text-sm font-medium">Tài khoản</div>
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserAvatar />
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {getFullName(session?.user.name ?? "Nguyễn Thành Vinh")}
                </p>
                <p className="text-xs text-neutral-200">{session?.user.email ?? "vinh@gmail.com"}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-500 hover:text-neutral-400"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-2 border-t border-neutral-700">
          {hasManagementAccess() && (
            <Button
              onClick={handleNavigateToDashboard}
              variant="ghost"
              className="w-full justify-start gap-3 px-3 py-2 font-normal"
            >
              <LayoutDashboard className="h-5 w-5" />
              Trang quản lý
            </Button>
          )}

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 font-normal text-red-500 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Đăng xuất
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FormPopoverUser;