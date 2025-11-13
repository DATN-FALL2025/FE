"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, Upload, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

interface Position {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  description: string;
  image: string;
  isActive: boolean;
}

export default function PositionsPage() {
  const availableDepartments = [
    { id: "1", name: "Khoa Phi Công" },
    { id: "2", name: "Khoa Kỹ Thuật Hàng Không" },
    { id: "3", name: "Khoa Quản Trị" },
  ];

  const [positions, setPositions] = useState<Position[]>([
    {
      id: "1",
      name: "Phi công lái máy bay trực thăng",
      departmentId: "1",
      departmentName: "Khoa Phi Công",
      description: "Vận hành và điều khiển máy bay trực thăng, đảm bảo an toàn bay",
      image: "/placeholder-position1.jpg",
      isActive: true,
    },
    {
      id: "2",
      name: "Phi công lái máy bay cánh bằng",
      departmentId: "1",
      departmentName: "Khoa Phi Công",
      description: "Điều khiển máy bay dân dụng cánh bằng cho các chuyến bay thương mại",
      image: "/placeholder-position2.jpg",
      isActive: true,
    },
    {
      id: "3",
      name: "Phi công huấn luyện",
      departmentId: "1",
      departmentName: "Khoa Phi Công",
      description: "Đào tạo và huấn luyện các phi công mới",
      image: "/placeholder-position3.jpg",
      isActive: true,
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    departmentId: "",
    description: "",
    image: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      departmentId: "",
      description: "",
      image: "",
    });
    setImagePreview("");
  };

  const handleCreate = () => {
    const selectedDept = availableDepartments.find((d) => d.id === formData.departmentId);
    if (!selectedDept) return;

    const newPosition: Position = {
      id: String(Date.now()),
      name: formData.name,
      departmentId: formData.departmentId,
      departmentName: selectedDept.name,
      description: formData.description,
      image: formData.image || "/placeholder-position.jpg",
      isActive: true,
    };
    setPositions([...positions, newPosition]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (selectedPosition) {
      const selectedDept = availableDepartments.find((d) => d.id === formData.departmentId);
      if (!selectedDept) return;

      setPositions(
        positions.map((p) =>
          p.id === selectedPosition.id
            ? {
                ...p,
                name: formData.name,
                departmentId: formData.departmentId,
                departmentName: selectedDept.name,
                description: formData.description,
                image: formData.image || p.image,
              }
            : p
        )
      );
      setIsEditOpen(false);
      resetForm();
      setSelectedPosition(null);
    }
  };

  const handleDelete = () => {
    if (selectedPosition) {
      setPositions(positions.filter((p) => p.id !== selectedPosition.id));
      setIsDeleteOpen(false);
      setSelectedPosition(null);
    }
  };

  const openEditDialog = (position: Position) => {
    setSelectedPosition(position);
    setFormData({
      name: position.name,
      departmentId: position.departmentId,
      description: position.description,
      image: position.image,
    });
    setImagePreview(position.image);
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
                  <th className="text-left py-4 px-6 font-medium text-sm">Mô tả</th>
                  <th className="text-right py-4 px-6 font-medium text-sm">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        {position.image && position.image.startsWith("http") ? (
                          <Image src={position.image} alt={position.name} width={64} height={64} className="object-cover" />
                        ) : (
                          <span className="text-white text-xs font-medium">IMG</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{position.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="outline" className="text-blue-600 border-blue-200">
                        {position.departmentName}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-muted-foreground max-w-md truncate">
                        {position.description}
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Khoa <span className="text-red-500">*</span></Label>
              <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Chọn khoa" />
                </SelectTrigger>
                <SelectContent>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                placeholder="Mô tả chi tiết về vị trí này..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Hình ảnh</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageUpload}
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
                          setFormData({ ...formData, image: "" });
                        }}
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
                        PNG, JPG, WEBP (tối đa 5Mb)
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
              Hủy
            </Button>
            <Button 
              onClick={handleCreate} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!formData.name || !formData.departmentId || !formData.description}
            >
              Tạo mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa/Cập nhật vị trí</DialogTitle>
            <DialogDescription>Cập nhật thông tin vị trí</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên vị trí <span className="text-red-500">*</span></Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">Khoa <span className="text-red-500">*</span></Label>
              <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
                <SelectTrigger id="edit-department">
                  <SelectValue placeholder="Chọn khoa" />
                </SelectTrigger>
                <SelectContent>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả <span className="text-red-500">*</span></Label>
              <Textarea
                id="edit-description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Hình ảnh</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  id="image-upload-edit"
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageUpload}
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
                          setFormData({ ...formData, image: "" });
                        }}
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
                        PNG, JPG, WEBP (tối đa 5Mb)
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditOpen(false); resetForm(); setSelectedPosition(null); }}>
              Hủy
            </Button>
            <Button 
              onClick={handleEdit} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!formData.name || !formData.departmentId || !formData.description}
            >
              Cập nhật
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
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
                {selectedPosition.image && selectedPosition.image.startsWith("http") ? (
                  <Image src={selectedPosition.image} alt={selectedPosition.name} width={500} height={200} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">{selectedPosition.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{selectedPosition.name}</h3>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Khoa</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {selectedPosition.departmentName}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Mô tả</Label>
                  <p className="mt-1">{selectedPosition.description}</p>
                </div>
                <div className="flex items-center gap-4 text-sm pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">
                      Trạng thái: <span className="font-medium text-foreground">Đang hoạt động</span>
                    </span>
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

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa vị trí</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa vị trí <span className="font-semibold">{selectedPosition?.name}</span>? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

