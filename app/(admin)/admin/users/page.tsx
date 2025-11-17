"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, AlertCircle, User, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { getAllUsers } from "@/lib/actions/auth";
import Image from "next/image";

interface UserData {
  id: string;
  userName: string;
  gmail: string;
  accountImage?: string;
  roles?: any[];
  [key: string]: any;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result: any = await getAllUsers();

      // Check multiple possible response formats
      if (result.data && Array.isArray(result.data)) {
        setUsers(result.data);
      } else if (Array.isArray(result)) {
        setUsers(result);
      } else if (result.status === 'success' && result.data) {
        setUsers(result.data);
      } else {
        setError(result.message || 'Không thể tải danh sách người dùng');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const openViewDialog = (user: UserData) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Xem và quản lý thông tin người dùng trong hệ thống
          </p>
        </div>
        <Button onClick={loadUsers} variant="outline" className="gap-2">
          <Loader2 className="w-4 h-4" />
          Làm mới
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-sm">Avatar</th>
                  <th className="text-left py-4 px-6 font-medium text-sm">Tên đăng nhập</th>
                  <th className="text-left py-4 px-6 font-medium text-sm">Email</th>
                  <th className="text-left py-4 px-6 font-medium text-sm">Vai trò</th>
                  <th className="text-right py-4 px-6 font-medium text-sm">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-muted-foreground">
                      Chưa có người dùng nào trong hệ thống
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          {user.accountImage && (user.accountImage.startsWith('http://') || user.accountImage.startsWith('https://')) ? (
                            <Image
                              src={user.accountImage}
                              alt={user.userName}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <User className="w-6 h-6 text-white" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium">{user.userName}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {user.gmail}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-1 flex-wrap">
                          {(user.authorities || user.roles) && (user.authorities || user.roles).length > 0 ? (
                            (user.authorities || user.roles).map((role: any, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {role.authority || role.roleName || role.name || 'User'}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs">User</Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewDialog(user)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Chi tiết
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thông tin người dùng</DialogTitle>
            <DialogDescription>Chi tiết thông tin người dùng trong hệ thống</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4">
                  {selectedUser.accountImage && (selectedUser.accountImage.startsWith('http://') || selectedUser.accountImage.startsWith('https://')) ? (
                    <Image
                      src={selectedUser.accountImage}
                      alt={selectedUser.userName}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-semibold">{selectedUser.userName}</h3>
                <p className="text-sm text-muted-foreground">{selectedUser.gmail}</p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div>
                  <Label className="text-sm text-muted-foreground">Tên đăng nhập</Label>
                  <p className="mt-1 font-medium">{selectedUser.userName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="mt-1">{selectedUser.gmail}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Vai trò</Label>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {(selectedUser.authorities || selectedUser.roles) && (selectedUser.authorities || selectedUser.roles).length > 0 ? (
                      (selectedUser.authorities || selectedUser.roles).map((role: any, index: number) => (
                        <Badge key={index} variant="secondary">
                          {role.authority || role.roleName || role.name || 'User'}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="secondary">User</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
