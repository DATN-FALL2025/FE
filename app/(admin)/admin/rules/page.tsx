"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Rule {
  id: string;
  ruleName: string;
  ruleDescription: string;
}

export default function RulesPage() {
  const { toast } = useToast();
  const [rules, setRules] = useState<Rule[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

  const [formData, setFormData] = useState({
    ruleName: "",
    ruleDescription: "",
  });

  const resetForm = () => {
    setFormData({ ruleName: "", ruleDescription: "" });
  };

  const handleCreate = () => {
    if (!formData.ruleName || !formData.ruleDescription) {
      toast({
        title: "Thông tin thiếu",
        description: "Vui lòng điền đầy đủ thông tin!",
        variant: "destructive",
      });
      return;
    }

    const newRule: Rule = {
      id: Date.now().toString(),
      ruleName: formData.ruleName,
      ruleDescription: formData.ruleDescription,
    };

    setRules([...rules, newRule]);
    setIsCreateOpen(false);
    resetForm();
    toast({
      title: "Thành công",
      description: "Tạo rule template thành công!",
    });
  };

  const handleEdit = () => {
    if (!selectedRule) return;

    const updatedRules = rules.map((rule) =>
      rule.id === selectedRule.id
        ? { ...rule, ruleName: formData.ruleName, ruleDescription: formData.ruleDescription }
        : rule
    );

    setRules(updatedRules);
    setIsEditOpen(false);
    resetForm();
    setSelectedRule(null);
    toast({
      title: "Thành công",
      description: "Cập nhật rule template thành công!",
    });
  };

  const handleDelete = () => {
    if (!selectedRule) return;

    const filteredRules = rules.filter((rule) => rule.id !== selectedRule.id);
    setRules(filteredRules);
    setIsDeleteOpen(false);
    setSelectedRule(null);
    toast({
      title: "Thành công",
      description: "Xóa rule template thành công!",
    });
  };

  const openEditDialog = (rule: Rule) => {
    setSelectedRule(rule);
    setFormData({
      ruleName: rule.ruleName,
      ruleDescription: rule.ruleDescription,
    });
    setIsEditOpen(true);
  };

  const openViewDialog = (rule: Rule) => {
    setSelectedRule(rule);
    setIsViewOpen(true);
  };

  const openDeleteDialog = (rule: Rule) => {
    setSelectedRule(rule);
    setIsDeleteOpen(true);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rules Template</h1>
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
                <th className="text-left p-4 font-medium">Mô tả</th>
                <th className="text-right p-4 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rules.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-muted-foreground">
                    Chưa có rule template nào. Nhấn &quot;Tạo Rule Template&quot; để thêm mới.
                  </td>
                </tr>
              ) : (
                rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-primary" />
                        <span className="font-medium">{rule.ruleName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {rule.ruleDescription}
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
              <Label htmlFor="ruleName">Tên Rule</Label>
              <Input
                id="ruleName"
                value={formData.ruleName}
                onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                placeholder="Nhập tên rule"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruleDescription">Mô tả</Label>
              <Textarea
                id="ruleDescription"
                value={formData.ruleDescription}
                onChange={(e) => setFormData({ ...formData, ruleDescription: e.target.value })}
                placeholder="Nhập mô tả rule"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreate}>
              Tạo Rule
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
              <Label htmlFor="edit-ruleName">Tên Rule</Label>
              <Input
                id="edit-ruleName"
                value={formData.ruleName}
                onChange={(e) => setFormData({ ...formData, ruleName: e.target.value })}
                placeholder="Nhập tên rule"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-ruleDescription">Mô tả</Label>
              <Textarea
                id="edit-ruleDescription"
                value={formData.ruleDescription}
                onChange={(e) => setFormData({ ...formData, ruleDescription: e.target.value })}
                placeholder="Nhập mô tả rule"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEdit}>
              Cập Nhật
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
              <Label className="text-muted-foreground">Tên Rule</Label>
              <p className="font-medium">{selectedRule?.ruleName}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Mô tả</Label>
              <p className="text-sm">{selectedRule?.ruleDescription}</p>
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
              Bạn có chắc chắn muốn xóa rule template &quot;{selectedRule?.ruleName}&quot;?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
