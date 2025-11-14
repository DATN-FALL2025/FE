"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, Upload, X, Loader2, AlertCircle } from "lucide-react";
import { getToken } from "@/lib/auth-utils";
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
    console.log('🔵 useEffect running - mounting component');
    loadPositions();
    loadDepartments();

    return () => {
      console.log('🔴 useEffect cleanup - unmounting component');
    };
  }, []);

  const loadPositions = async () => {
    console.log('📍 loadPositions called - stack trace:', new Error().stack);
    setIsLoading(true);
    setError("");
    try {
      const token = getToken();
      const result = await getAllPositions(token || undefined);

      console.log('🔍 Load positions result:', result);

      // Check if result has data - API might return {status: "200 OK", data: [...]}
      if (result && result.data) {
        console.log('✅ Setting positions:', result.data);
        // Map department.id to departmentID for easier access
        const positionsWithDeptId = Array.isArray(result.data)
          ? result.data.map((pos: any) => ({
              ...pos,
              departmentID: pos.department?.id ? String(pos.department.id) : (pos.departmentID || "")
            }))
          : [];
        console.log('✅ Positions mapped with departmentID:', positionsWithDeptId);
        setPositions(positionsWithDeptId);
      } else if (result && Array.isArray(result)) {
        // In case API returns array directly
        console.log('✅ Setting positions (direct array):', result);
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
      console.error('❌ Error in loadPositions:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const token = getToken();
      const result = await getAllDepartments(token || undefined);
      console.log('🏢 Load departments result:', result);

      if (result && (result as any).data) {
        const deptArray = Array.isArray((result as any).data) ? (result as any).data : [];
        console.log('🏢 Departments array:', deptArray);
        console.log('🏢 Number of departments:', deptArray.length);
        if (deptArray.length > 0) {
          console.log('🏢 First department:', deptArray[0]);
        }
        setDepartments(deptArray);
      } else if (result && Array.isArray(result)) {
        console.log('🏢 Departments array (direct):', result);
        setDepartments(result);
      } else {
        console.warn('⚠️ No departments data found');
        setDepartments([]);
      }
    } catch (err) {
      console.error('❌ Error loading departments:', err);
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
    console.log('🔍 handleCreate - formData:', formData);
    console.log('🔍 handleCreate - departments:', departments);
    console.log('🔍 handleCreate - departmentID:', formData.departmentID);

    if (!formData.positionName || !formData.positionDescription || !formData.departmentID) {
      alert("Vui lòng điền đầy đủ thông tin và chọn phòng ban!");
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
        const uploadResult = await uploadFile(uploadFormData);

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

      console.log('📤 Sending to API - departmentID:', formData.departmentID);

      const result = await createPosition(positionFormData, token || undefined);

      console.log('🆕 Create position result:', result);
      console.log('🆕 result.status:', result?.status);
      console.log('🆕 result.message:', result?.message);

      // Check if successful - API might return {status: "200 OK", data: {...}}
      const isSuccess = result && (
        result.status === 'success' ||
        (result.status && typeof result.status === 'string' && result.status.includes('OK')) ||
        (result.status && typeof result.status === 'string' && result.status.includes('200'))
      );

      console.log('🆕 isSuccess:', isSuccess);

      if (isSuccess) {
        setIsCreateOpen(false);
        resetForm();
        await loadPositions(); // Reload list
        alert('Tạo vị trí thành công!');
      } else {
        alert(result?.message || 'Tạo vị trí thất bại!');
      }
    } catch (err) {
      alert('Có lỗi xảy ra!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedPosition || !formData.positionName || !formData.positionDescription || !formData.departmentID) {
      alert("Vui lòng điền đầy đủ thông tin và chọn phòng ban!");
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

      const result = await updatePositionById(selectedPosition.id, updateFormData, token || undefined);

      console.log('✏️ Update position result:', result);
      console.log('✏️ result.status:', result?.status);
      console.log('✏️ result.message:', result?.message);

      // Check if successful
      const isSuccess = result && (
        result.status === 'success' ||
        (result.status && typeof result.status === 'string' && result.status.includes('OK')) ||
        (result.status && typeof result.status === 'string' && result.status.includes('200'))
      );

      console.log('✏️ isSuccess:', isSuccess);

      if (isSuccess) {
        setIsEditOpen(false);
        resetForm();
        setSelectedPosition(null);
        await loadPositions();
        alert('Cập nhật vị trí thành công!');
      } else {
        alert(result?.message || 'Cập nhật vị trí thất bại!');
      }
    } catch (err) {
      alert('Có lỗi xảy ra!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPosition) return;

    setIsSubmitting(true);

    try {
      const token = getToken();
      const result = await deletePositionById(selectedPosition.id, token || undefined);

      console.log('🗑️ Delete position result:', result);

      // Check if successful
      if (result && (result.status === 'success' || (result.status && result.status.includes('OK')))) {
        setIsDeleteOpen(false);
        setSelectedPosition(null);
        await loadPositions();
        alert('Xóa vị trí thành công!');
      } else {
        alert(result.message || 'Xóa vị trí thất bại!');
      }
    } catch (err) {
      alert('Có lỗi xảy ra!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (position: Position) => {
    console.log('🔧 openEditDialog - position:', position);
    console.log('🔧 openEditDialog - position.department:', position.department);
    console.log('🔧 openEditDialog - position.departmentID:', position.departmentID);

    // Get departmentID from either position.departmentID (already mapped) or position.department.id
    const deptId = position.departmentID ||
                   (position.department?.id ? String(position.department.id) : "");

    console.log('🔧 openEditDialog - final departmentID:', deptId);

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
                  <th className="text-left py-4 px-6 font-medium text-sm">Phòng ban</th>
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
                                const fallback = e.currentTarget.nextElementSibling;
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
                          {position.department?.departmentName || 'Chưa gán phòng ban'}
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
              <Label htmlFor="department">Phòng ban <span className="text-red-500">*</span></Label>
              <Select
                value={formData.departmentID}
                onValueChange={(value) => {
                  console.log('🔄 Selected department ID:', value);
                  setFormData({ ...formData, departmentID: value });
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {departments.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">Không có phòng ban</div>
                  ) : (
                    departments.map((dept, index) => {
                      console.log(`🔍 CREATE - Dept ${index}:`, dept);
                      console.log(`🔍 CREATE - Keys:`, Object.keys(dept));
                      const deptId = (dept as any).departmentId || (dept as any).id || (dept as any).departmentID;
                      const deptName = (dept as any).departmentName || (dept as any).name;
                      console.log(`🔍 CREATE - ID: ${deptId}, Name: ${deptName}`);

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
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {imagePreview ? (
                    <div className="relative">
                      <Image src={imagePreview} alt="Preview" width={200} height={200} className="mx-auto rounded-lg object-cover" />
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
                    <>
                      <Upload className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                      <p className="text-sm text-blue-600 font-medium">
                        Nhấn để tải ảnh hoặc kéo thả ảnh vào đây
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, WEBP (tối đa 5MB)
                      </p>
                    </>
                  )}
                </label>
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
              <Label htmlFor="edit-department">Phòng ban <span className="text-red-500">*</span></Label>
              <Select
                value={formData.departmentID}
                onValueChange={(value) => {
                  console.log('🔄 Selected department ID (Edit):', value);
                  setFormData({ ...formData, departmentID: value });
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id="edit-department">
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {departments.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">Không có phòng ban</div>
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
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  id="image-upload-edit"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="image-upload-edit" className="cursor-pointer">
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <Image src={imagePreview} alt="Preview" width={200} height={200} className="mx-auto rounded-lg object-cover" />
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
                    <>
                      <Upload className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                      <p className="text-sm text-blue-600 font-medium">
                        Nhấn để tải ảnh hoặc kéo thả ảnh vào đây
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, WEBP (tối đa 5MB)
                      </p>
                    </>
                  )}
                </label>
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
