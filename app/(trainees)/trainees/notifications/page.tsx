"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  BellOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  FileText,
  Trash2,
  Eye,
  Calendar,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: number;
  type: "approval" | "rejection" | "info" | "document_request";
  title: string;
  message: string;
  sender: string;
  senderRole: string;
  timestamp: Date;
  read: boolean;
  documentName?: string;
  reason?: string;
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: "rejection",
    title: "Tài liệu bị từ chối",
    message: "Bằng tốt nghiệp THPT của bạn đã bị từ chối. Vui lòng nộp lại tài liệu hợp lệ.",
    sender: "Nguyễn Văn A",
    senderRole: "Trưởng Khoa",
    timestamp: new Date(2025, 10, 28, 14, 30),
    read: false,
    documentName: "Bằng tốt nghiệp THPT",
    reason: "Hình ảnh không rõ ràng, cần quét lại với độ phân giải cao hơn",
  },
  {
    id: 2,
    type: "approval",
    title: "Tài liệu được duyệt",
    message: "Chứng minh nhân dân của bạn đã được duyệt thành công.",
    sender: "Trần Thị B",
    senderRole: "Phòng Đào Tạo",
    timestamp: new Date(2025, 10, 27, 10, 15),
    read: false,
    documentName: "Chứng minh nhân dân",
  },
  {
    id: 3,
    type: "document_request",
    title: "Yêu cầu bổ sung tài liệu",
    message: "Bạn cần bổ sung thêm Giấy khám sức khỏe để hoàn thiện hồ sơ.",
    sender: "Lê Văn C",
    senderRole: "Cán Bộ Tuyển Sinh",
    timestamp: new Date(2025, 10, 26, 16, 45),
    read: true,
    documentName: "Giấy khám sức khỏe",
  },
  {
    id: 4,
    type: "info",
    title: "Thông báo quan trọng",
    message: "Hạn chót nộp hồ sơ là ngày 30/11/2025. Vui lòng hoàn tất hồ sơ trước thời hạn.",
    sender: "Hệ thống",
    senderRole: "Tự động",
    timestamp: new Date(2025, 10, 25, 9, 0),
    read: true,
  },
  {
    id: 5,
    type: "approval",
    title: "Hồ sơ được chấp nhận",
    message: "Hồ sơ đăng ký của bạn đã được xét duyệt và chấp nhận. Chúc mừng!",
    sender: "Phòng Tuyển Sinh",
    senderRole: "Cán Bộ Tuyển Sinh",
    timestamp: new Date(2025, 10, 24, 11, 20),
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "approval":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "rejection":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "document_request":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "info":
        return <Info className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBgColor = (type: string, read: boolean) => {
    const opacity = read ? "20" : "50";
    switch (type) {
      case "approval":
        return `bg-green-${opacity}`;
      case "rejection":
        return `bg-red-${opacity}`;
      case "document_request":
        return `bg-blue-${opacity}`;
      case "info":
        return `bg-yellow-${opacity}`;
      default:
        return `bg-gray-${opacity}`;
    }
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    toast.success("Đã đánh dấu là đã đọc");
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("Đã đánh dấu tất cả là đã đọc");
  };

  const handleDelete = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Đã xóa thông báo");
  };

  const handleDeleteAll = () => {
    const readNotifications = notifications.filter(n => n.read);
    if (readNotifications.length === 0) {
      toast.info("Không có thông báo đã đọc để xóa");
      return;
    }
    setNotifications(prev => prev.filter(n => !n.read));
    toast.success(`Đã xóa ${readNotifications.length} thông báo`);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="w-8 h-8" />
            Thông Báo
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} mới
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi thông báo và phản hồi từ Ban Tuyển Sinh
          </p>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteAll}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa đã đọc
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">
            Tất cả ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Chưa đọc ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="read">
            Đã đọc ({notifications.length - unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BellOff className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Không có thông báo</h3>
                <p className="text-sm text-muted-foreground">
                  {filter === "unread"
                    ? "Bạn không có thông báo chưa đọc"
                    : filter === "read"
                    ? "Bạn không có thông báo đã đọc"
                    : "Chưa có thông báo nào"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md ${
                    !notification.read ? "border-l-4 border-l-blue-600" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                          notification.type === "approval"
                            ? "bg-green-50"
                            : notification.type === "rejection"
                            ? "bg-red-50"
                            : notification.type === "document_request"
                            ? "bg-blue-50"
                            : "bg-yellow-50"
                        }`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {notification.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="font-medium">{notification.sender}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {notification.senderRole}
                              </Badge>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {notification.timestamp.toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>

                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                          )}
                        </div>

                        <p className="text-sm text-foreground mb-3">
                          {notification.message}
                        </p>

                        {/* Document Name */}
                        {notification.documentName && (
                          <div className="flex items-center gap-2 p-2 bg-muted rounded-md mb-3 w-fit">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {notification.documentName}
                            </span>
                          </div>
                        )}

                        {/* Rejection Reason */}
                        {notification.reason && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-3">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-red-900 mb-1">
                                  Lý do từ chối:
                                </p>
                                <p className="text-sm text-red-800">
                                  {notification.reason}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 mt-4">
                          {!notification.read && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Đánh dấu đã đọc
                            </Button>
                          )}
                          {notification.type === "rejection" && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Nộp lại tài liệu
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
