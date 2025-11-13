"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2, Calendar } from "lucide-react";
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

interface Document {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export default function DocumentsManagementPage() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Tài liệu hướng dẫn sử dụng",
      description: "Hướng dẫn chi tiết về cách sử dụng hệ thống",
      createdAt: "31/10/2025",
      updatedAt: "31/10/2025",
    },
    {
      id: "2",
      name: "Chính sách bảo mật",
      description: "Các quy định về bảo mật thông tin người dùng",
      createdAt: "31/10/2025",
      updatedAt: "31/10/2025",
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({ name: "", description: "" });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`;
  };

  const handleCreate = () => {
    const newDoc: Document = {
      id: String(Date.now()),
      name: formData.name,
      description: formData.description,
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate(),
    };
    setDocuments([...documents, newDoc]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (selectedDoc) {
      setDocuments(
        documents.map((d) =>
          d.id === selectedDoc.id
            ? { ...d, name: formData.name, description: formData.description, updatedAt: getCurrentDate() }
            : d
        )
      );
      setIsEditOpen(false);
      resetForm();
      setSelectedDoc(null);
    }
  };

  const handleDelete = () => {
    if (selectedDoc) {
      setDocuments(documents.filter((d) => d.id !== selectedDoc.id));
      setIsDeleteOpen(false);
      setSelectedDoc(null);
    }
  };

  const openEditDialog = (doc: Document) => {
    setSelectedDoc(doc);
    setFormData({ name: doc.name, description: doc.description });
    setIsEditOpen(true);
  };

  const openViewDialog = (doc: Document) => {
    setSelectedDoc(doc);
    setIsViewOpen(true);
  };

  const openDeleteDialog = (doc: Document) => {
    setSelectedDoc(doc);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý tài liệu</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Quản lý và tổ chức các tài liệu của hệ thống
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Tạo tài liệu mới
        </Button>
      </div>

      {/* Documents Table */}
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-sm">Tên tài liệu</th>
                  <th className="text-left py-4 px-6 font-medium text-sm">Mô tả</th>
                  <th className="text-left py-4 px-6 font-medium text-sm">Ngày tạo</th>
                  <th className="text-right py-4 px-6 font-medium text-sm">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium">{doc.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-muted-foreground max-w-md">
                        {doc.description}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-muted-foreground">{doc.createdAt}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openViewDialog(doc)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(doc)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(doc)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
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
            <DialogTitle>Tạo tài liệu mới</DialogTitle>
            <DialogDescription>Thêm tài liệu mới vào hệ thống</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên tài liệu</Label>
              <Input
                id="name"
                placeholder="Nhập tên tài liệu..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả tài liệu</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả tài liệu..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
              Hủy
            </Button>
            <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
              Tạo mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cập nhật tài liệu</DialogTitle>
            <DialogDescription>Chỉnh sửa thông tin tài liệu</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên tài liệu</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả tài liệu</Label>
              <Textarea
                id="edit-description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditOpen(false); resetForm(); setSelectedDoc(null); }}>
              Hủy
            </Button>
            <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết tài liệu</DialogTitle>
            <DialogDescription>Thông tin chi tiết về tài liệu</DialogDescription>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Tên tài liệu</Label>
                  <p className="mt-1 font-medium">{selectedDoc.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Mô tả</Label>
                  <p className="mt-1">{selectedDoc.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Ngày tạo</span>
                    </div>
                    <p className="text-sm font-medium">{selectedDoc.createdAt}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Cập nhật lần cuối</span>
                    </div>
                    <p className="text-sm font-medium">{selectedDoc.updatedAt}</p>
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
            <AlertDialogTitle>Xác nhận xóa tài liệu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tài liệu <span className="font-semibold">{selectedDoc?.name}</span>? 
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

