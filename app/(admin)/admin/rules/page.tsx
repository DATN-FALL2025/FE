"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, Loader2, AlertCircle, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import {
  getAllDocumentRules,
  createDocumentRule,
  updateDocumentRuleById,
  deleteDocumentRuleById
} from "@/lib/actions/document-rule";
import { getAllDocuments } from "@/lib/actions/document";
import { DocumentRule } from "@/types/document-rule";
import { Document } from "@/types/document";

export default function RulesPage() {
  const { toast } = useToast();
  const [rules, setRules] = useState<DocumentRule[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<DocumentRule | null>(null);

  const [formData, setFormData] = useState({
    documentRuleName: "",
    documentRuleDescription: "",
    documentId: "",
  });

  // Load rules and documents on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [rulesResult, documentsResult] = await Promise.all([
        getAllDocumentRules(),
        getAllDocuments()
      ]) as any[];

      if (rulesResult.status === 'error') {
        setError(rulesResult.message);
      } else {
        setRules(Array.isArray(rulesResult.data) ? rulesResult.data : []);
      }

      if (documentsResult.status !== 'error') {
        setDocuments(Array.isArray(documentsResult.data) ? documentsResult.data : []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const reloadRules = async () => {
    try {
      const rulesResult = await getAllDocumentRules() as any;
      if (rulesResult.status === 'error') {
        setError(rulesResult.message);
      } else {
        setRules(Array.isArray(rulesResult.data) ? rulesResult.data : []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reload rules');
    }
  };

  const resetForm = () => {
    setFormData({
      documentRuleName: "",
      documentRuleDescription: "",
      documentId: ""
    });
  };

  const handleCreate = async () => {
    if (!formData.documentRuleName || !formData.documentRuleDescription || !formData.documentId) {
      toast({
        title: "Thông tin thiếu",
        description: "Vui lòng điền đầy đủ thông tin và chọn tài liệu!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createDocumentRule({
        documentRuleName: formData.documentRuleName,
        documentRuleDescription: formData.documentRuleDescription,
        documentId: Number(formData.documentId)
      }) as any;

      if (result.status === 'error') {
        toast({
          title: "Lỗi",
          description: result.message || "Tạo rule template thất bại!",
          variant: "destructive",
        });
      } else {
        setIsCreateOpen(false);
        resetForm();
        await reloadRules();
        toast({
          title: "Thành công",
          description: "Tạo rule template thành công!",
        });
      }
    } catch (err) {
      toast({
        title: "Lỗi",
        description: err instanceof Error ? err.message : "Có lỗi xảy ra!",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedRule || !formData.documentRuleName || !formData.documentRuleDescription || !formData.documentId) {
      toast({
        title: "Thông tin thiếu",
        description: "Vui lòng điền đầy đủ thông tin và chọn tài liệu!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const ruleId = selectedRule.id || selectedRule.documentRuleId;
      const result = await updateDocumentRuleById(ruleId!, {
        documentRuleName: formData.documentRuleName,
        documentRuleDescription: formData.documentRuleDescription,
        documentId: Number(formData.documentId)
      }) as any;

      if (result.status === 'error') {
        toast({
          title: "Lỗi",
          description: result.message || "Cập nhật rule template thất bại!",
          variant: "destructive",
        });
      } else {
        setIsEditOpen(false);
        resetForm();
        setSelectedRule(null);
        await reloadRules();
        toast({
          title: "Thành công",
          description: "Cập nhật rule template thành công!",
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
      const ruleId = selectedRule.id || selectedRule.documentRuleId;
      const result = await deleteDocumentRuleById(ruleId!) as any;

      if (result.status === 'error') {
        toast({
          title: "Lỗi",
          description: result.message || "Xóa rule template thất bại!",
          variant: "destructive",
        });
      } else {
        setIsDeleteOpen(false);
        setSelectedRule(null);
        await reloadRules();
        toast({
          title: "Thành công",
          description: "Xóa rule template thành công!",
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
      documentRuleName: rule.documentRuleName,
      documentRuleDescription: rule.documentRuleDescription,
      documentId: String(rule.documentId),
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
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-red-600">Error Loading Rules</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {error}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => loadData()}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rules Management</h1>
          <p className="text-muted-foreground mt-1">Quản lý các template quy tắc hệ thống</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Tạo Rule Template
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Tên Rule</th>
                <th className="text-left p-4 font-medium">Tài liệu</th>
                <th className="text-left p-4 font-medium">Mô tả</th>
                <th className="text-right p-4 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">
                    Chưa có rule template nào. Nhấn &quot;Tạo Rule Template&quot; để thêm mới.
                  </td>
                </tr>
              ) : (
                rules.map((rule) => (
                  <tr key={rule.id || rule.documentRuleId} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-primary" />
                        <span className="font-medium">{rule.documentRuleName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">
                        {rule.document?.documentCode || `${rule.documentName}`}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {rule.documentRuleDescription}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewDialog(rule)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(rule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(rule)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo Rule Template Mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin cho rule template mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="documentId">Tài liệu <span className="text-red-500">*</span></Label>
              <Select
                value={formData.documentId}
                onValueChange={(value) => setFormData({ ...formData, documentId: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger id="documentId">
                  <SelectValue placeholder="Chọn tài liệu" />
                </SelectTrigger>
                <SelectContent>
                  {documents.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Không có tài liệu
                    </div>
                  ) : (
                    documents.map((doc, index) => {
                      const docId = (doc as any).documentId || (doc as any).id || (doc as any).documentID;
                      const docCode = (doc as any).documentCode || (doc as any).code;
                      const docName = (doc as any).documentName || (doc as any).name;

                      return (
                        <SelectItem key={docId || index} value={String(docId)}>
                          {docCode ? `${docCode} - ${docName || 'N/A'}` : (docName || 'N/A')}
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentRuleName">Tên Rule <span className="text-red-500">*</span></Label>
              <Input
                id="documentRuleName"
                value={formData.documentRuleName}
                onChange={(e) => setFormData({ ...formData, documentRuleName: e.target.value })}
                placeholder="Nhập tên rule"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentRuleDescription">Mô tả <span className="text-red-500">*</span></Label>
              <Textarea
                id="documentRuleDescription"
                value={formData.documentRuleDescription}
                onChange={(e) => setFormData({ ...formData, documentRuleDescription: e.target.value })}
                placeholder="Nhập mô tả rule"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo Rule"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Rule Template</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin rule template
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-documentId">Tài liệu <span className="text-red-500">*</span></Label>
              <Select
                value={formData.documentId}
                onValueChange={(value) => setFormData({ ...formData, documentId: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger id="edit-documentId">
                  <SelectValue placeholder="Chọn tài liệu" />
                </SelectTrigger>
                <SelectContent>
                  {documents.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Không có tài liệu
                    </div>
                  ) : (
                    documents.map((doc, index) => {
                      const docId = (doc as any).documentId || (doc as any).id || (doc as any).documentID;
                      const docCode = (doc as any).documentCode || (doc as any).code;
                      const docName = (doc as any).documentName || (doc as any).name;

                      return (
                        <SelectItem key={docId || index} value={String(docId)}>
                          {docCode ? `${docCode} - ${docName || 'N/A'}` : (docName || 'N/A')}
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-documentRuleName">Tên Rule <span className="text-red-500">*</span></Label>
              <Input
                id="edit-documentRuleName"
                value={formData.documentRuleName}
                onChange={(e) => setFormData({ ...formData, documentRuleName: e.target.value })}
                placeholder="Nhập tên rule"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-documentRuleDescription">Mô tả <span className="text-red-500">*</span></Label>
              <Textarea
                id="edit-documentRuleDescription"
                value={formData.documentRuleDescription}
                onChange={(e) => setFormData({ ...formData, documentRuleDescription: e.target.value })}
                placeholder="Nhập mô tả rule"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button onClick={handleEdit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập Nhật"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi Tiết Rule Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Tài liệu</Label>
              <p className="font-medium">
                {selectedRule?.document?.documentCode} - {selectedRule?.document?.documentName}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Tên Rule</Label>
              <p className="font-medium">{selectedRule?.documentRuleName}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Mô tả</Label>
              <p className="text-sm">{selectedRule?.documentRuleDescription}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa rule template &quot;{selectedRule?.documentRuleName}&quot;?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
