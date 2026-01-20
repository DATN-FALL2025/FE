"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, Loader2, AlertCircle, FileText } from "lucide-react";
import { toast } from "@/lib/toast-compat";
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
  getAllDocumentRules,
  getDocumentRuleById,
  createDocumentRule,
  updateDocumentRuleById,
  deleteDocumentRuleById,
} from "@/lib/actions/document-rule";

interface DocumentRule {
  id: string;
  ruleName?: string;
  ruleDescription?: string;
  [key: string]: any;
}

export default function DocumentRulesPage() {
  const [documentRules, setDocumentRules] = useState<DocumentRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<DocumentRule | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<any>({
    ruleName: "",
    ruleDescription: "",
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadDocumentRules();
  }, []);

  const loadDocumentRules = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result: any = await getAllDocumentRules();
      if (result.status === 'success' && result.data) {
        setDocumentRules(result.data);
      } else {
        setError(result.message || 'Không thể tải danh sách quy tắc tài liệu');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ ruleName: "", ruleDescription: "" });
  };

  const handleCreate = async () => {
    if (!formData.ruleName || !formData.ruleDescription) {
      toast({
        title: "Thông tin thiếu",
        description: "Vui lòng điền đầy đủ thông tin!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result: any = await createDocumentRule(formData);

      if (result.status === 'success') {
        setIsCreateOpen(false);
        resetForm();
        await loadDocumentRules();
        toast({
          title: "Thành công",
          description: "Tạo quy tắc thành công!",
        });
      } else {
        toast({
          title: "Lỗi",
          description: result.message || "Tạo quy tắc thất bại!",
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
    if (!selectedRule) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy quy tắc!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result: any = await updateDocumentRuleById(Number(selectedRule.id), formData);

      if (result.status === 'success') {
        setIsEditOpen(false);
        resetForm();
        setSelectedRule(null);
        await loadDocumentRules();
        toast({
          title: "Thành công",
          description: "Cập nhật quy tắc thành công!",
        });
      } else {
        toast({
          title: "Lỗi",
          description: result.message || "Cập nhật quy tắc thất bại!",
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
    if (!selectedRule) return;

    setIsSubmitting(true);

    try {
      const result: any = await deleteDocumentRuleById(Number(selectedRule.id));

      if (result.status === 'success') {
        setIsDeleteOpen(false);
        setSelectedRule(null);
        await loadDocumentRules();
        toast({
          title: "Thành công",
          description: "Xóa quy tắc thành công!",
        });
      } else {
        toast({
          title: "Lỗi",
          description: result.message || "Xóa quy tắc thất bại!",
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

  const openEditDialog = (rule: DocumentRule) => {
    setSelectedRule(rule);
    setFormData({
      ruleName: rule.ruleName || "",
      ruleDescription: rule.ruleDescription || "",
      ...rule
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
  const totalPages = Math.ceil(documentRules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocumentRules = documentRules.slice(startIndex, endIndex);

  return (
    <div className="space-y-6 w-full">
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
                  <th className="text-left py-4 px-6 font-medium text-sm">Tên quy tắc</th>
                  <th className="text-left py-4 px-6 font-medium text-sm">Mô tả</th>
                  <th className="text-right py-4 px-6 font-medium text-sm">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {documentRules.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-muted-foreground">
                      Chưa có quy tắc nào. Hãy tạo quy tắc mới!
                    </td>
                  </tr>
                ) : (
                  currentDocumentRules.map((rule) => (
                    <tr key={rule.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium">{rule.ruleName || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-muted-foreground max-w-md truncate">
                          {rule.ruleDescription || 'Không có mô tả'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewDialog(rule)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Chi tiết
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(rule)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Sửa
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(rule)}
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
      {documentRules.length > 0 && totalPages > 1 && (
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tạo quy tắc mới</DialogTitle>
            <DialogDescription>Thêm quy tắc mới cho tài liệu</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ruleName">Tên quy tắc <span className="text-red-500">*</span></Label>
              <Input
                id="ruleName"
                placeholder="VD: Quy tắc định dạng tài liệu"
                value={formData.ruleName}
                onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruleDescription">Mô tả <span className="text-red-500">*</span></Label>
              <Textarea
                id="ruleDescription"
                placeholder="Mô tả về quy tắc..."
                rows={4}
                value={formData.ruleDescription}
                onChange={(e) => setFormData({ ...formData, ruleDescription: e.target.value })}
                disabled={isSubmitting}
              />
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
              disabled={!formData.ruleName || !formData.ruleDescription || isSubmitting}
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cập nhật quy tắc</DialogTitle>
            <DialogDescription>Chỉnh sửa thông tin quy tắc</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-ruleName">Tên quy tắc <span className="text-red-500">*</span></Label>
              <Input
                id="edit-ruleName"
                value={formData.ruleName}
                onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-ruleDescription">Mô tả <span className="text-red-500">*</span></Label>
              <Textarea
                id="edit-ruleDescription"
                rows={4}
                value={formData.ruleDescription}
                onChange={(e) => setFormData({ ...formData, ruleDescription: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => { setIsEditOpen(false); resetForm(); setSelectedRule(null); }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleEdit} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
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
            <DialogTitle>Chi tiết quy tắc</DialogTitle>
            <DialogDescription>Thông tin chi tiết về quy tắc</DialogDescription>
          </DialogHeader>
          {selectedRule && (
            <div className="space-y-4 py-4">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Tên quy tắc</Label>
                  <p className="mt-1 font-medium text-lg">{selectedRule.ruleName || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Mô tả</Label>
                  <p className="mt-1">{selectedRule.ruleDescription || 'Không có mô tả'}</p>
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
              Bạn có chắc chắn muốn xóa quy tắc <span className="font-semibold">{selectedRule?.ruleName}</span>? 
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
