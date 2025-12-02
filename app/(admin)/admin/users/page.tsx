"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, AlertCircle, User, Mail, Plus, Upload, Download } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { getAllUsers, createUser, importUsers } from "@/lib/actions/auth";
import Image from "next/image";
import * as XLSX from 'xlsx';

interface UserData {
  id: string;
  userName: string;
  gmail: string;
  accountImage?: string;
  roles?: any[];
  [key: string]: any;
}

interface CreateUserForm {
  userName: string;
  password: string;
  gmail: string;
  accountImage: string;
  positionName: string;
  departmentName: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<CreateUserForm>({
    userName: "",
    password: "",
    gmail: "",
    accountImage: "",
    positionName: "",
    departmentName: ""
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result: any = await getAllUsers();

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

  const openCreateDialog = () => {
    setFormData({
      userName: "",
      password: "",
      gmail: "",
      accountImage: "",
      positionName: "",
      departmentName: ""
    });
    setIsCreateOpen(true);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async () => {
    setError("");
    setSuccess("");
    
    if (!formData.userName || !formData.password || !formData.gmail) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createUser(formData);
      
      if (result.status === 'success') {
        setSuccess("Tạo tài khoản thành công!");
        setIsCreateOpen(false);
        loadUsers();
      } else {
        setError(result.message || "Tạo tài khoản thất bại");
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        userName: "user001",
        password: "password123",
        gmail: "user001@example.com",
        accountImage: "https://example.com/avatar.jpg",
        positionName: "Giảng viên",
        departmentName: "Khoa Công nghệ"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "account_template.xlsx");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const accounts = jsonData.map((row: any) => ({
        userName: row.userName || row.username || "",
        password: row.password || "",
        gmail: row.gmail || row.email || "",
        accountImage: row.accountImage || row.image || "",
        positionName: row.positionName || row.position || "",
        departmentName: row.departmentName || row.department || ""
      }));

      if (accounts.length === 0) {
        setError("File Excel không có dữ liệu");
        setIsSubmitting(false);
        return;
      }

      const result = await importUsers(accounts);
      
      if (result.status === 'success') {
        setSuccess(`Import thành công ${accounts.length} tài khoản!`);
        loadUsers();
      } else {
        setError(result.message || "Import thất bại");
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi đọc file");
    } finally {
      setIsSubmitting(false);
      e.target.value = "";
    }
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
          <h1 className="text-2xl font-bold tracking-tight">Quản lý tài khoản</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Tạo, import và quản lý tài khoản người dùng
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadTemplate} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Tải mẫu Excel
          </Button>
          <label htmlFor="file-upload">
            <Button variant="outline" className="gap-2" disabled={isSubmitting} asChild>
              <span>
                <Upload className="w-4 h-4" />
                Import Excel
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="w-4 h-4" />
            Tạo tài khoản
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 bg-green-50 text-green-900">
          <AlertDescription>{success}</AlertDescription>
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

      {/* Create User Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tạo tài khoản mới</DialogTitle>
            <DialogDescription>Điền thông tin để tạo tài khoản người dùng</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Tên đăng nhập <span className="text-red-500">*</span></Label>
              <Input
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="Nhập tên đăng nhập"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu <span className="text-red-500">*</span></Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nhập mật khẩu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gmail">Email <span className="text-red-500">*</span></Label>
              <Input
                id="gmail"
                name="gmail"
                type="email"
                value={formData.gmail}
                onChange={handleInputChange}
                placeholder="Nhập email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountImage">URL ảnh đại diện</Label>
              <Input
                id="accountImage"
                name="accountImage"
                value={formData.accountImage}
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="positionName">Vị trí</Label>
              <Input
                id="positionName"
                name="positionName"
                value={formData.positionName}
                onChange={handleInputChange}
                placeholder="Nhập vị trí"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentName">Phòng ban</Label>
              <Input
                id="departmentName"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleInputChange}
                placeholder="Nhập phòng ban"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button onClick={handleCreateUser} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo tài khoản"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
