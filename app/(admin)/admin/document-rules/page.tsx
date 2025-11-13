"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, Calendar, FileText } from "lucide-react";
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

interface DocumentRule {
  id: string;
  documentId: string;
  documentName: string;
  ruleName: string;
  ruleValue: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export default function DocumentRulesPage() {
  const availableDocuments = [
    { id: "1", name: "Tài liệu hướng dẫn sử dụng" },
    { id: "2", name: "Chính sách bảo mật" },
    { id: "3", name: "Quy trình đăng ký" },
  ];

  const [rules, setRules] = useState<DocumentRule[]>([
    {
      id: "1",
      documentId: "1",
      documentName: "Tài liệu hướng dẫn sử dụng",
      ruleName: "Quy tắc định dạng",
      ruleValue: "PDF, DOCX",
      description: "Chỉ chấp nhận các định dạng tài liệu PDF và DOCX",
      createdAt: "31/10/2025",
      updatedAt: "31/10/2025",
    },
    {
      id: "2",
      documentId: "2",
      documentName: "Chính sách bảo mật",
      ruleName: "Quy tắc bảo mật",
      ruleValue: "SSL Required",
      description: "Yêu cầu kết nối SSL khi tải tài liệu này",
      createdAt: "31/10/2025",
      updatedAt: "31/10/2025",
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<DocumentRule | null>(null);

  const [formData, setFormData] = useState({
    documentId: "",
    ruleName: "",
    ruleValue: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      documentId: "",
      ruleName: "",
      ruleValue: "",
      description: "",
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`;
  };

  const handleCreate = () => {
    const selectedDoc = availableDocuments.find((d) => d.id === formData.documentId);
    if (!selectedDoc) return;

    const newRule: DocumentRule = {
      id: String(Date.now()),
      documentId: formData.documentId,
      documentName: selectedDoc.name,
      ruleName: formData.ruleName,
      ruleValue: formData.ruleValue,
      description: formData.description,
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate(),
    };
    setRules([...rules, newRule]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleEdit = () => {
    if (selectedRule) {
      const selectedDoc = availableDocuments.find((d) => d.id === formData.documentId);
      if (!selectedDoc) return;

      setRules(
        rules.map((r) =>
          r.id === selectedRule.id
            ? {
                ...r,
                documentId: formData.documentId,
                documentName: selectedDoc.name,
                ruleName: formData.ruleName,
                ruleValue: formData.ruleValue,
                description: formData.description,
                updatedAt: getCurrentDate(),
              }
            : r
        )
      );
      setIsEditOpen(false);
      resetForm();
      setSelectedRule(null);
    }
  };

  const handleDelete = () => {
    if (selectedRule) {
      setRules(rules.filter((r) => r.id !== selectedRule.id));
      setIsDeleteOpen(false);
      setSelectedRule(null);
    }
  };

  const openEditDialog = (rule: DocumentRule) => {
    setSelectedRule(rule);
    setFormData({
      documentId: rule.documentId,
      ruleName: rule.ruleName,
      ruleValue: rule.ruleValue,
      description: rule.description,
    });
    setIsEditOpen(true);
  };

  const openViewDialog = (rule: DocumentRule) => {
    setSelectedRule(rule);
    setIsViewOpen(true);
  };

  const openDeleteDialog = (rule: DocumentRule) => {
    setSelectedRule(rule);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý quy tắc tài liệu</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Quản lý các quy tắc áp dụng cho tài liệu
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Tạo quy tắc mới
        </Button>
      </div>

      {/* Rules Table */}
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-sm">Tài liệu</th>
                  <th className="text-left py-4 px-6 font-medium text-sm">Tên quy tắc</th>
                  <th className="text-left py-4 px-6 font-medium text-sm">Giá trị</th>
                  <th className="text-left py-4 px-6 font-medium text-sm">Mô tả</th>
                  <th className="text-left py-4 px-6 font-medium text-sm">Ngày tạo</th>
                  <th className="text-right py-4 px-6 font-medium text-sm">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{rule.documentName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{rule.ruleName}</div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="outline" className="font-mono text-xs">
                        {rule.ruleValue}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {rule.description}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-muted-foreground">{rule.createdAt}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openViewDialog(rule)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(rule)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(rule)}
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
            <DialogTitle>Tạo quy tắc mới</DialogTitle>
            <DialogDescription>Thêm quy tắc mới cho tài liệu</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="document">Tài liệu <span className="text-red-500">*</span></Label>
              <Select value={formData.documentId} onValueChange={(value) => setFormData({ ...formData, documentId: value })}>
                <SelectTrigger id="document">
                  <SelectValue placeholder="Chọn tài liệu" />
                </SelectTrigger>
                <SelectContent>
                  {availableDocuments.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-name">Tên quy tắc <span className="text-red-500">*</span></Label>
              <Input
                id="rule-name"
                placeholder="VD: Quy tắc định dạng"
                value={formData.ruleName}
                onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rule-value">Giá trị quy tắc <span className="text-red-500">*</span></Label>
              <Input
                id="rule-value"
                placeholder="VD: PDF, DOCX"
                value={formData.ruleValue}
                onChange={(e) => setFormData({ ...formData, ruleValue: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                placeholder="Mô tả chi tiết về quy tắc này..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateOpen(false); resetForm(); }}>
              Hủy
            </Button>
            <Button 
              onClick={handleCreate} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!formData.documentId || !formData.ruleName || !formData.ruleValue || !formData.description}
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
            <DialogTitle>Cập nhật quy tắc</DialogTitle>
            <DialogDescription>Chỉnh sửa thông tin quy tắc tài liệu</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-document">Tài liệu <span className="text-red-500">*</span></Label>
              <Select value={formData.documentId} onValueChange={(value) => setFormData({ ...formData, documentId: value })}>
                <SelectTrigger id="edit-document">
                  <SelectValue placeholder="Chọn tài liệu" />
                </SelectTrigger>
                <SelectContent>
                  {availableDocuments.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-rule-name">Tên quy tắc <span className="text-red-500">*</span></Label>
              <Input
                id="edit-rule-name"
                value={formData.ruleName}
                onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-rule-value">Giá trị quy tắc <span className="text-red-500">*</span></Label>
              <Input
                id="edit-rule-value"
                value={formData.ruleValue}
                onChange={(e) => setFormData({ ...formData, ruleValue: e.target.value })}
              />
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditOpen(false); resetForm(); setSelectedRule(null); }}>
              Hủy
            </Button>
            <Button 
              onClick={handleEdit} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!formData.documentId || !formData.ruleName || !formData.ruleValue || !formData.description}
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
            <DialogTitle>Chi tiết quy tắc</DialogTitle>
            <DialogDescription>Thông tin chi tiết về quy tắc tài liệu</DialogDescription>
          </DialogHeader>
          {selectedRule && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground">Tài liệu liên kết</Label>
                    <p className="mt-1 font-medium">{selectedRule.documentName}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">Tên quy tắc</Label>
                  <p className="mt-1 font-medium">{selectedRule.ruleName}</p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Giá trị quy tắc</Label>
                  <div className="mt-1">
                    <Badge variant="outline" className="font-mono">
                      {selectedRule.ruleValue}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Mô tả</Label>
                  <p className="mt-1">{selectedRule.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Ngày tạo</span>
                    </div>
                    <p className="text-sm font-medium">{selectedRule.createdAt}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Cập nhật lần cuối</span>
                    </div>
                    <p className="text-sm font-medium">{selectedRule.updatedAt}</p>
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
            <AlertDialogTitle>Xác nhận xóa quy tắc</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa quy tắc <span className="font-semibold">{selectedRule?.ruleName}</span> của tài liệu{" "}
              <span className="font-semibold">{selectedRule?.documentName}</span>? Hành động này không thể hoàn tác.
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

