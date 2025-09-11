"use client";
import * as React from "react";
import { User, Settings, LogOut, UserCircle, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "nextjs-toploader/app";
import { signOut } from "next-auth/react";
import AlertModal from "@/components/modals/alert-modal";
const UserProfileDropdown = () => {
  const router = useRouter();
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);
  const handleLogout = React.useCallback(async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);
  return (
    <>
      <AlertModal
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onConfirm={handleLogout}
        title="Đăng xuất"
        description="Bạn có chắc chắn với hành động này không?"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 hover:bg-secondary/80 transition-colors"
          >
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-bold">
            Tài khoản của tôi
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem className="gap-2">
          <UserCircle className="h-4 w-4" />
          Hồ sơ
        </DropdownMenuItem> */}
          <DropdownMenuItem className="gap-2">
            <Settings className="h-4 w-4" />
            Cài đặt
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Trợ giúp
        </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserProfileDropdown;
