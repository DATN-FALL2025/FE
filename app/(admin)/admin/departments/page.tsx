"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2, Loader2, AlertCircle, Building2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartmentById,
  deleteDepartmentById,
} from "@/lib/actions/department";

interface Department {
  id: string;
  departmentName: string;
  departmentDescription: string;
  departmentImage?: string;
  [key: string]: any;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    departmentName: "",
    departmentDescription: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prevent double-fetching in React StrictMode
  const hasLoadedData = useRef(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (hasLoadedData.current) {
      return;
    }
    hasLoadedData.current = true;
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result: any = await getAllDepartments();
      console.log('📋 Load departments result:', result);

      // Check if data exists (backend returns "200 OK" in status field)
      if (result.data && Array.isArray(result.data)) {
        setDepartments(result.data);
      } else {
        setError(result.message || 'Không thể tải danh sách khoa');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ departmentName: "", departmentDescription: "" });
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file hình ảnh!');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB!');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreate = async () => {
    if (!formData.departmentName || !formData.departmentDescription) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData to send to server action
      const submitFormData = new FormData();
      submitFormData.append('departmentName', formData.departmentName);
      submitFormData.append('departmentDescription', formData.departmentDescription);
      if (imageFile) {
        submitFormData.append('departmentImage', imageFile);
      }

      const result: any = await createDepartment(submitFormData);

      console.log('🏢 Create result:', result);

      // Check if successful (backend returns "201 CREATED" or "200 OK")
      const isSuccess = result && (
        result.data ||
        (result.status && (
          result.status.includes('CREATED') ||
          result.status.includes('201') ||
          result.status.includes('200') ||
          result.status.includes('OK')
        ))
      );

      if (isSuccess) {
        setIsCreateOpen(false);
        resetForm();
        await loadDepartments();
        toast.success('Tạo khoa thành công!');
      } else {
        toast.error(result?.message || 'Tạo khoa thất bại!');
      }
    } catch (err: any) {
      console.error('Create error:', err);
      toast.error(err.message || 'Có lỗi xảy ra!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedDept || !formData.departmentName || !formData.departmentDescription) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData to send to server action
      const submitFormData = new FormData();
      submitFormData.append('departmentName', formData.departmentName);
      submitFormData.append('departmentDescription', formData.departmentDescription);
      if (imageFile) {
        submitFormData.append('departmentImage', imageFile);
      }

      const result: any = await updateDepartmentById(Number(selectedDept.id), submitFormData);

      console.log('✏️ Update result:', result);

      // Check if successful
      const isSuccess = result && (
        result.data ||
        (result.status && (
          result.status.includes('OK') ||
          result.status.includes('200') ||
          result.status.includes('UPDATED')
        ))
      );

      if (isSuccess) {
        setIsEditOpen(false);
        resetForm();
        setSelectedDept(null);
        await loadDepartments();
        toast.success('Cập nhật khoa thành công!');
      } else {
        toast.error(result?.message || 'Cập nhật khoa thất bại!');
      }
    } catch (err: any) {
      console.error('Update error:', err);
      toast.error(err.message || 'Có lỗi xảy ra!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDept) return;

    setIsSubmitting(true);

    try {
      const result: any = await deleteDepartmentById(Number(selectedDept.id));

      console.log('🗑️ Delete result:', result);

      // Check if successful
      if (result.data || (result.status && result.status.includes('OK'))) {
        setIsDeleteOpen(false);
        setSelectedDept(null);
        await loadDepartments();
        toast.success('Xóa khoa thành công!');
      } else {
        toast.error(result.message || 'Xóa khoa thất bại!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (dept: Department) => {
    setSelectedDept(dept);
    setFormData({ 
      departmentName: dept.departmentName, 
      departmentDescription: dept.departmentDescription 
    });
    // Set existing image preview if available
    if (dept.departmentImage && dept.departmentImage !== 'default_image_url') {
      setImagePreview(dept.departmentImage);
    }
    setIsEditOpen(true);
  };

  const openViewDialog = (dept: Department) => {
    setSelectedDept(dept);
    setIsViewOpen(true);
  };

  const openDeleteDialog = (dept: Department) => {
    setSelectedDept(dept);
    setIsDeleteOpen(true);
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
  const totalPages = Math.ceil(departments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDepartments = departments.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý khoa</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Quản lý các khoa trong tổ chức
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Tạo khoa mới
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
                  <th className="text-left py-4 px-6 font-medium text-sm">Icon</th>
                  <th className="text-left py-4 px-6 font-medium text-sm">Tên khoa</th>
                  <th className="text-left py-4 px-6 font-medium text-sm">Mô tả</th>
                  <th className="text-right py-4 px-6 font-medium text-sm">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {departments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-muted-foreground">
                      Chưa có khoa nào. Hãy tạo khoa mới!
                    </td>
                  </tr>
                ) : (
                  currentDepartments.map((dept) => (
                    <tr key={dept.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                          {dept.departmentImage && dept.departmentImage !== 'default_image_url' ? (
                            <Image
                              src={dept.departmentImage}
                              alt={dept.departmentName}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-white" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium">{dept.departmentName}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-muted-foreground max-w-md truncate">
                          {dept.departmentDescription}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewDialog(dept)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Chi tiết
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(dept)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Sửa
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(dept)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Xóa
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
      {departments.length > 0 && totalPages > 1 && (
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

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo khoa mới</DialogTitle>
            <DialogDescription>Thêm khoa mới vào hệ thống</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên khoa <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="VD: Phòng IT"
                value={formData.departmentName}
                onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                placeholder="Mô tả về khoa..."
                rows={4}
                value={formData.departmentDescription}
                onChange={(e) => setFormData({ ...formData, departmentDescription: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Hình ảnh khoa</Label>
              <div className="space-y-3">
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Nhấn để tải lên</span> hoặc kéo thả
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                      </div>
                      <input
                        id="image"
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => { setIsCreateOpen(false); resetForm(); }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleCreate} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!formData.departmentName || !formData.departmentDescription || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo mới"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cập nhật khoa</DialogTitle>
            <DialogDescription>Chỉnh sửa thông tin khoa</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên khoa <span className="text-red-500">*</span></Label>
              <Input
                id="edit-name"
                value={formData.departmentName}
                onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả <span className="text-red-500">*</span></Label>
              <Textarea
                id="edit-description"
                rows={4}
                value={formData.departmentDescription}
                onChange={(e) => setFormData({ ...formData, departmentDescription: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Hình ảnh khoa</Label>
              <div className="space-y-3">
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="edit-image"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Nhấn để tải lên</span> hoặc kéo thả
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                      </div>
                      <input
                        id="edit-image"
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isSubmitting}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => { setIsEditOpen(false); resetForm(); setSelectedDept(null); }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleEdit} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!formData.departmentName || !formData.departmentDescription || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết khoa</DialogTitle>
            <DialogDescription>Thông tin chi tiết về khoa</DialogDescription>
          </DialogHeader>
          {selectedDept && (
            <div className="space-y-4 py-4">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto">
                {selectedDept.departmentImage && selectedDept.departmentImage !== 'default_image_url' ? (
                  <Image
                    src={selectedDept.departmentImage}
                    alt={selectedDept.departmentName}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Building2 className="w-16 h-16 text-white" />
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Tên khoa</Label>
                  <p className="mt-1 font-medium text-lg">{selectedDept.departmentName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Mô tả</Label>
                  <p className="mt-1">{selectedDept.departmentDescription}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khoa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khoa <span className="font-semibold">{selectedDept?.departmentName}</span>? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
