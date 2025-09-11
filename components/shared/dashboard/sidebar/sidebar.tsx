"use client";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "./navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import AlertModal from "@/components/modals/alert-modal";

// import { useRouter } from "next/navigation";
import { useRouter } from 'nextjs-toploader/app';

export const Sidebar = () => {
  const router = useRouter();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const handleLogout = useCallback(async () => {
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
      <aside className="h-full bg-white dark:bg-muted/40 border-r flex flex-col shadow-sm dark:border-x-muted-foreground">
        <div className="flex h-14 items-center px-4 lg:h-[72px] lg:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-75 transition"
          >
            <Image
              src="/images/icons_favicon/icon.png"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <h1 className="font-semibold text-xl text-black dark:text-white">
              MoveMate
            </h1>
          </Link>

          {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button> */}
        </div>
        <Separator className="my-[7.2px] border-b-2 border-gray-300 dark:border-gray-600" />
        <ScrollArea className="flex-1 px-4">
          <Navigation />
        </ScrollArea>
        <div className="p-4 mt-auto">
          <Button
            onClick={() => setOpenUpdateModal(true)}
            size="sm"
            className="w-full"
          >
            Đăng xuất
          </Button>
        </div>
      </aside>
    </>
  );
};
