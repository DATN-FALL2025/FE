import * as React from "react";
import { Bell, Check, Clock, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      title: "Cập nhật hệ thống mới",
      description: "Phiên bản v2.0 đã sẵn sàng để cập nhật",
      time: "5 phút trước",
      status: "unread",
      type: "info",
      icon: Settings,
    },
    {
      id: 2,
      title: "Hoàn thành tác vụ",
      description: "Báo cáo Q4 đã được phê duyệt",
      time: "30 phút trước",
      status: "read",
      type: "success",
      icon: Check,
    },
    {
      id: 3,
      title: "Deadline sắp đến",
      description: "Dự án ABC cần hoàn thành trong 2 ngày",
      time: "2 giờ trước",
      status: "unread",
      type: "warning",
      icon: Clock,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-secondary/80 transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center animate-pulse">
            2
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-bold">Thông báo</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className={cn(
              "flex flex-col gap-1 p-4 cursor-pointer hover:bg-secondary/80 transition-all",
              notification.status === "unread" && "bg-secondary/50"
            )}
          >
            <div className="flex items-start gap-3 w-full">
              <div
                className={cn(
                  "p-2 rounded-full",
                  notification.type === "success" &&
                    "bg-green-100 text-green-600",
                  notification.type === "warning" &&
                    "bg-yellow-100 text-yellow-600",
                  notification.type === "info" && "bg-blue-100 text-blue-600"
                )}
              >
                <notification.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-medium">{notification.title}</p>
                  <span className="text-xs text-muted-foreground">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full text-center text-primary hover:text-primary/80">
          Xem tất cả thông báo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
