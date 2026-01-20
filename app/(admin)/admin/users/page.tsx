"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader2, AlertCircle, User, Mail, Plus, Upload, Download } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { getAllPositions } from "@/lib/actions/position";
import { getAllDepartments } from "@/lib/actions/department";
import { getToken } from "@/lib/auth-utils";
import Image from "next/image";
import * as XLSX from 'xlsx';
import { createAccountImportTemplate } from '@/lib/utils/excel-template';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  role: string;
  positionId: string;
  departmentId: string;
}

interface Position {
  id: string;
  positionName: string;
  positionDescription: string;
  departmentID?: string;
  department?: {
    id: string | number;
    departmentName: string;
  };
}

interface Department {
  departmentId: string;
  departmentName: string;
  departmentDescription: string;
}

// Hàm chuyển đổi role sang tiếng Việt
const getRoleInVietnamese = (role: string): string => {
  const roleMap: { [key: string]: string } = {
    'ROLE_TRAINEE': 'Học viên',
    'TRAINEE': 'Học viên',
    'ROLE_ACADEMIC_STAFF_AFFAIR': 'Nhân viên học vụ',
    'ACADEMIC_STAFF_AFFAIR': 'Nhân viên học vụ',
    'ROLE_HEAD_OF_DEPARTMENT': 'Trưởng phòng',
    'HEAD_OF_DEPARTMENT': 'Trưởng phòng',
    'ROLE_TRAINING_DIRECTOR': 'Giám đốc đào tạo',
    'TRAINING_DIRECTOR': 'Giám đốc đào tạo',
    'ROLE_ADMIN': 'Quản trị viên',
    'ADMIN': 'Quản trị viên',
  };
  
  return roleMap[role] || role;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState<CreateUserForm>({
    userName: "",
    password: "",
    gmail: "",
    role: "TRAINEE",
    positionId: "",
    departmentId: ""
  });

  useEffect(() => {
    loadUsers();
    loadPositions();
    loadDepartments();
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

  const loadPositions = async () => {
    try {
      const token = getToken();
      const result: any = await getAllPositions(token || undefined);

      if (result && result.data) {
        const positionsWithDeptId = Array.isArray(result.data)
          ? result.data.map((pos: any) => ({
              ...pos,
              departmentID: pos.department?.id ? String(pos.department.id) : (pos.departmentID || "")
            }))
          : [];
        setPositions(positionsWithDeptId);
      } else if (result && Array.isArray(result)) {
        const positionsWithDeptId = result.map((pos: any) => ({
          ...pos,
          departmentID: pos.department?.id ? String(pos.department.id) : (pos.departmentID || "")
        }));
        setPositions(positionsWithDeptId);
      } else {
        setPositions([]);
      }
    } catch (err) {
      setPositions([]);
    }
  };

  const loadDepartments = async () => {
    try {
      const result: any = await getAllDepartments();

      if (result && (result as any).data) {
        const deptArray = Array.isArray((result as any).data) ? (result as any).data : [];
        setDepartments(deptArray);
      } else if (result && Array.isArray(result)) {
        setDepartments(result);
      } else {
        setDepartments([]);
      }
    } catch (err) {
      setDepartments([]);
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
      role: "TRAINEE",
      positionId: "",
      departmentId: ""
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
      // Get position and department names from IDs
      const selectedPosition = positions.find(p => p.id === formData.positionId);
      const selectedDepartment = departments.find(d => 
        (d as any).departmentId === formData.departmentId || 
        (d as any).id === formData.departmentId
      );

      const payload = {
        userName: formData.userName,
        password: formData.password,
        gmail: formData.gmail,
        accountImage: "",
        role: formData.role,
        positionName: selectedPosition?.positionName || "",
        departmentName: selectedDepartment?.departmentName || ""
      };

      const result: any = await createUser(payload);
      
      if (result.status === 'success' || result.status === '200 OK') {
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

  const downloadTemplate = async () => {
    try {
      // Create workbook with data validation
      const workbook = await createAccountImportTemplate(departments, positions);
      
      // Download file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'account_import_template.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating template:', error);
      setError('Không thể tạo file template');
    }
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
      
      // Check if file has required sheets
      if (!workbook.SheetNames.includes("Accounts")) {
        setError("File Excel phải có sheet 'Accounts'");
        setIsSubmitting(false);
        e.target.value = "";
        return;
      }

      // Read Accounts sheet
      const accountsSheet = workbook.Sheets["Accounts"];
      const accountsData = XLSX.utils.sheet_to_json(accountsSheet);

      // Map accounts data with default role as TRAINEE
      const accounts = accountsData.map((row: any) => ({
        userName: row.userName || row.username || "",
        password: row.password || "",
        gmail: row.gmail || row.email || "",
        role: row.role || "TRAINEE",
        positionName: row.positionName || row.position || "",
        departmentName: row.departmentName || row.department || ""
      }));

      if (accounts.length === 0) {
        setError("Sheet 'Accounts' không có dữ liệu");
        setIsSubmitting(false);
        e.target.value = "";
        return;
      }

      // Validate required fields
      const invalidAccounts = accounts.filter(acc => !acc.userName || !acc.password || !acc.gmail);
      if (invalidAccounts.length > 0) {
        setError(`Có ${invalidAccounts.length} tài khoản thiếu thông tin bắt buộc (userName, password, gmail)`);
        setIsSubmitting(false);
        e.target.value = "";
        return;
      }

      const result: any = await importUsers(accounts);
      
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

  // Calculate pagination
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

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
                Nộp mẫu Excel
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
                  currentUsers.map((user) => (
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
                            (user.authorities || user.roles).map((role: any, index: number) => {
                              const roleText = role.authority || role.roleName || role.name || 'User';
                              return (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {getRoleInVietnamese(roleText)}
                                </Badge>
                              );
                            })
                          ) : (
                            <Badge variant="outline" className="text-xs">Người dùng</Badge>
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

      {/* Pagination */}
      {users.length > 0 && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

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
              <Label htmlFor="role">Vai trò <span className="text-red-500">*</span></Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRAINEE">Học viên</SelectItem>
                  <SelectItem value="ACADEMIC_STAFF_AFFAIR">Nhân viên học vụ</SelectItem>
                  <SelectItem value="HEAD_OF_DEPARTMENT">Trưởng phòng</SelectItem>
                  <SelectItem value="TRAINING_DIRECTOR">Giám đốc đào tạo</SelectItem>
                  <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Khoa</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Chọn khoa" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {departments.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">Không có khoa</div>
                  ) : (
                    departments.map((dept, index) => {
                      const deptId = (dept as any).departmentId || (dept as any).id || (dept as any).departmentID;
                      const deptName = (dept as any).departmentName || (dept as any).name;

                      return (
                        <SelectItem key={deptId || index} value={String(deptId)}>
                          {deptName || 'N/A'}
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Vị trí</Label>
              <Select
                value={formData.positionId}
                onValueChange={(value) => setFormData({ ...formData, positionId: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger id="position">
                  <SelectValue placeholder="Chọn vị trí" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {positions.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">Không có vị trí</div>
                  ) : (
                    positions.map((pos, index) => (
                      <SelectItem key={pos.id || index} value={String(pos.id)}>
                        {pos.positionName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
                      (selectedUser.authorities || selectedUser.roles).map((role: any, index: number) => {
                        const roleText = role.authority || role.roleName || role.name || 'User';
                        return (
                          <Badge key={index} variant="secondary">
                            {getRoleInVietnamese(roleText)}
                          </Badge>
                        );
                      })
                    ) : (
                      <Badge variant="secondary">Người dùng</Badge>
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
