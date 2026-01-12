"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, Upload, X, Loader2, AlertCircle } from "lucide-react";
import { getToken } from "@/lib/auth-utils";
import { toast } from "@/lib/toast-compat";
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
import Image from "next/image";
import {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePositionById,
  deletePositionById,
} from "@/lib/actions/position";
import { getAllDepartments } from "@/lib/actions/department";
import { uploadFile } from "@/lib/actions/upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Position {
  id: string;
  positionName: string;
  positionDescription: string;
  positionImage: string;
  departmentID?: string;
  department?: {
    id: string | number;
    departmentName: string;
    departmentDescription: string;
  };
}

interface Department {
  departmentId: string;
  departmentName: string;
  departmentDescription: string;
}

export default function PositionsPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    positionName: "",
    positionDescription: "",
    positionImage: "",
    departmentID: "",
  });

  // Fetch positions and departments on mount
  useEffect(() => {
    loadPositions();
    loadDepartments();
  }, []);

  const loadPositions = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = getToken();
      const result: any = await getAllPositions(token || undefined);

      // Check if result has data - API might return {status: "200 OK", data: [...]}
      if (result && result.data) {
        // Map department.id to departmentID for easier access
        const positionsWithDeptId = Array.isArray(result.data)
          ? result.data.map((pos: any) => ({
              ...pos,
              departmentID: pos.department?.id ? String(pos.department.id) : (pos.departmentID || "")
            }))
          : [];
        setPositions(positionsWithDeptId);
      } else if (result && Array.isArray(result)) {
        // In case API returns array directly
        const positionsWithDeptId = result.map((pos: any) => ({
          ...pos,
          departmentID: pos.department?.id ? String(pos.department.id) : (pos.departmentID || "")
        }));
        setPositions(positionsWithDeptId);
      } else if (result.status && result.status.includes('error')) {
        setError(result.message || 'Không thể tải danh sách vị trí');
      } else {
        setError('Không thể tải danh sách vị trí');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setIsLoading(false);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      positionName: "",
      positionDescription: "",
      positionImage: "",
      departmentID: "",
    });
    setImagePreview("");
    setImageFile(null);
  };

  const handleCreate = async () => {
    if (!formData.positionName || !formData.positionDescription || !formData.departmentID) {
      toast({
        title: "Thông tin thiếu",
        description: "Vui lòng điền đầy đủ thông tin và chọn khoa!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getToken();

      // Upload image first if exists
      let imageUrl = "";
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        const uploadResult: any = await uploadFile(uploadFormData);

        if (uploadResult.status === 'success' && uploadResult.data) {
          imageUrl = uploadResult.data.url || uploadResult.data;
        }
      }

      // Create position with FormData
      const positionFormData = new FormData();
      positionFormData.append('positionName', formData.positionName);
      positionFormData.append('positionDescription', formData.positionDescription);
      positionFormData.append('departmentID', formData.departmentID);
      if (imageFile) {
        positionFormData.append('positionImage', imageFile);
      }

      const result: any = await createPosition(positionFormData, token || undefined);

      // Check if successful - API might return {status: "200 OK", data: {...}}
      const isSuccess = result && (
        result.status === 'success' ||
        (result.status && typeof result.status === 'string' && result.status.includes('OK')) ||
        (result.status && typeof result.status === 'string' && result.status.includes('200')) ||
        (result.status && typeof result.status === 'string' && result.status === '200 OK')
      );

      if (isSuccess) {
        toast({
          title: "Thành công",
          description: "Tạo vị trí thành công!",
        });
        setIsCreateOpen(false);
        resetForm();
        await loadPositions(); // Reload list
      } else {
        toast({
          title: "Lỗi",
          description: result?.message || "Tạo vị trí thất bại!",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra!",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedPosition || !formData.positionName || !formData.positionDescription || !formData.departmentID) {
      toast({
        title: "Thông tin thiếu",
        description: "Vui lòng điền đầy đủ thông tin và chọn khoa!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getToken();
      const updateFormData = new FormData();
      updateFormData.append('positionName', formData.positionName);
      updateFormData.append('positionDescription', formData.positionDescription);
      updateFormData.append('departmentID', formData.departmentID);
      if (imageFile) {
        updateFormData.append('positionImage', imageFile);
      }

      const result: any = await updatePositionById(Number(selectedPosition.id), updateFormData, token || undefined);

      // Check if successful
      const isSuccess = result && (
        result.status === 'success' ||
        (result.status && typeof result.status === 'string' && result.status.includes('OK')) ||
        (result.status && typeof result.status === 'string' && result.status.includes('200')) ||
        (result.status && typeof result.status === 'string' && result.status === '200 OK')
      );

      if (isSuccess) {
        toast({
          title: "Thành công",
          description: "Cập nhật vị trí thành công!",
        });
        setIsEditOpen(false);
        resetForm();
        setSelectedPosition(null);
        await loadPositions();
      } else {
        toast({
          title: "Lỗi",
          description: result?.message || "Cập nhật vị trí thất bại!",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra!",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPosition) return;

    setIsSubmitting(true);

    try {
      const token = getToken();
      const result: any = await deletePositionById(Number(selectedPosition.id), token || undefined);

      // Check if successful
      const isSuccess = result && (
        result.status === 'success' ||
        (result.status && typeof result.status === 'string' && result.status.includes('OK')) ||
        (result.status && typeof result.status === 'string' && result.status.includes('200')) ||
        (result.status && typeof result.status === 'string' && result.status === '200 OK')
      );

      if (isSuccess) {
        toast({
          title: "Thành công",
          description: "Xóa vị trí thành công!",
        });
        setIsDeleteOpen(false);
        setSelectedPosition(null);
        await loadPositions();
      } else {
        toast({
          title: "Lỗi",
          description: result.message || "Xóa vị trí thất bại!",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra!",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (position: Position) => {
    // Get departmentID from either position.departmentID (already mapped) or position.department.id
    const deptId = position.departmentID ||
                   (position.department?.id ? String(position.department.id) : "");

    setSelectedPosition(position);
    setFormData({
      positionName: position.positionName,
      positionDescription: position.positionDescription,
      positionImage: position.positionImage,
      departmentID: deptId,
    });
    setImagePreview(position.positionImage);
    setIsEditOpen(true);
  };

  const openViewDialog = (position: Position) => {
    setSelectedPosition(position);
    setIsViewOpen(true);
  };

  const openDeleteDialog = (position: Position) => {
    setSelectedPosition(position);
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

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý vị trí</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Quản lý các vị trí trong tổ chức
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Tạo vị trí mới
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Positions Table */}
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-sm">Hình ảnh</th>
                  <th className="text-left py-4 px-6 font-medium text-sm">Tên vị trí</th>
                  <th className="text-left py-4 px-6 font-medium text-sm">Khoa</th>
                  <th className="text-right py-4 px-6 font-medium text-sm">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {positions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-muted-foreground">
                      Chưa có vị trí nào. Hãy tạo vị trí mới!
                    </td>
                  </tr>
                ) : (
                  positions.map((position) => (
                    <tr key={position.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          {position.positionImage ? (
                            <Image
                              src={position.positionImage}
                              alt={position.positionName}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                              unoptimized={position.positionImage.includes('cloudinary')}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <span
                            className="text-white text-xs font-medium w-full h-full flex items-center justify-center"
                            style={{ display: position.positionImage ? 'none' : 'flex' }}
                          >
                            {position.positionName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium">{position.positionName}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-muted-foreground">
                          {position.department?.departmentName || 'Chưa gán khoa'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewDialog(position)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Chi tiết
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(position)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Sửa
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(position)}
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

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo vị trí mới</DialogTitle>
            <DialogDescription>Thêm vị trí mới vào hệ thống</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên vị trí <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="VD: Software Engineer"
                value={formData.positionName}
                onChange={(e) => setFormData({ ...formData, positionName: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                placeholder="Mô tả chi tiết về vị trí này..."
                rows={3}
                value={formData.positionDescription}
                onChange={(e) => setFormData({ ...formData, positionDescription: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Khoa <span className="text-red-500">*</span></Label>
              <Select
                value={formData.departmentID}
                onValueChange={(value) => setFormData({ ...formData, departmentID: value })}
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
              <Label>Hình ảnh</Label>
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
                      onClick={(e) => {
                        e.preventDefault();
                        setImagePreview("");
                        setImageFile(null);
                      }}
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
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
                        id="image-upload"
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
              disabled={!formData.positionName || !formData.positionDescription || !formData.departmentID || isSubmitting}
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
            <DialogTitle>Chỉnh sửa vị trí</DialogTitle>
            <DialogDescription>Cập nhật thông tin vị trí</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên vị trí <span className="text-red-500">*</span></Label>
              <Input
                id="edit-name"
                value={formData.positionName}
                onChange={(e) => setFormData({ ...formData, positionName: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả <span className="text-red-500">*</span></Label>
              <Textarea
                id="edit-description"
                rows={3}
                value={formData.positionDescription}
                onChange={(e) => setFormData({ ...formData, positionDescription: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">Khoa <span className="text-red-500">*</span></Label>
              <Select
                value={formData.departmentID}
                onValueChange={(value) => setFormData({ ...formData, departmentID: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger id="edit-department">
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
              <Label>Hình ảnh</Label>
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
                      onClick={(e) => {
                        e.preventDefault();
                        setImagePreview("");
                        setImageFile(null);
                      }}
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload-edit"
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
                        id="image-upload-edit"
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
              onClick={() => { setIsEditOpen(false); resetForm(); setSelectedPosition(null); }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!formData.positionName || !formData.positionDescription || !formData.departmentID || isSubmitting}
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
            <DialogTitle>Chi tiết vị trí</DialogTitle>
            <DialogDescription>Thông tin chi tiết về vị trí</DialogDescription>
          </DialogHeader>
          {selectedPosition && (
            <div className="space-y-4 py-4">
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center relative">
                {selectedPosition.positionImage ? (
                  <>
                    <Image
                      src={selectedPosition.positionImage}
                      alt={selectedPosition.positionName}
                      width={500}
                      height={200}
                      className="w-full h-full object-cover absolute inset-0"
                      unoptimized={selectedPosition.positionImage.includes('cloudinary')}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="text-white text-4xl font-bold relative z-10">
                      {selectedPosition.positionName.charAt(0).toUpperCase()}
                    </span>
                  </>
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {selectedPosition.positionName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{selectedPosition.positionName}</h3>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Mô tả</Label>
                  <p className="mt-1">{selectedPosition.positionDescription}</p>
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
            <AlertDialogTitle>Xác nhận xóa vị trí</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa vị trí <span className="font-semibold">{selectedPosition?.positionName}</span>? 
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
