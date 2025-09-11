"use client";
import * as React from "react";
import { MobileSidebar } from "../sidebar/mobile-sidebar";
import { ModeToggle } from "./mode-toggle";
import { Badge } from "@/components/ui/badge";
import { UserCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import UserProfileDropdown from "./user-profile-dropdown";

// Define a type for possible roles with more detailed translations
type UserRole = 'ADMIN' | 'REVIEWER' | 'MANAGER';

// Comprehensive role translations with descriptions
const roleDetails: Record<UserRole, { 
  vietnamese: string; 
  description: string; 
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline'
}> = {
  ADMIN: { 
    vietnamese: "Quản Trị Viên", 
    description: "Toàn quyền quản lý hệ thống",
    badgeVariant: 'destructive'
  },
  REVIEWER: { 
    vietnamese: "Người Đánh Giá", 
    description: "Kiểm tra và phê duyệt nội dung",
    badgeVariant: 'secondary'
  },
  MANAGER: { 
    vietnamese: "Quản Lý", 
    description: "Giám sát và điều hành các hoạt động",
    badgeVariant: 'default'
  }
};

export const Navbar = () => {
  const { data: session } = useSession();

  // const role = session?.user?.roleName.toUpperCase() as UserRole;
  // const name = session?.user?.name;
const role = "ADMIN";
const name = "Tuong Nguyen";
  // Function to get role details
  const getRoleDetails = (role: UserRole) => {
    return roleDetails[role] || {
      vietnamese: "Vai Trò Không Xác Định",
      description: "Chưa được phân quyền",
      badgeVariant: 'outline'
    };
  };

  const roleInfo = getRoleDetails(role);

  return (
    <nav className="bg-white dark:bg-muted/40 backdrop-filter backdrop-blur-lg px-3 flex items-center justify-between h-20 border-b-2 my-[1px] border-gray-300 dark:border-gray-600 sticky top-0 z-50">
      <div className="flex items-center gap-4 w-full">
        <MobileSidebar />
        <div className="flex-col hidden lg:flex overflow-hidden">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Trang quản lý
          </h1>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300 text-sm md:text-base">
            {name ? (
              <>
                <UserCircle2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="font-medium">
                  {name}
                </span>
                <Badge variant={roleInfo.badgeVariant}>
                  {roleInfo.vietnamese}
                </Badge>
              </>
            ) : (
              'Xin chào'
            )}
          </div>
          {name && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {roleInfo.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <UserProfileDropdown />
      </div>
    </nav>
  );
};