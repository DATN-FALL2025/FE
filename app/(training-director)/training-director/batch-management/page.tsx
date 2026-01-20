"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Calendar, Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'https://manage-and-automate-aviation-academy-application-production.up.railway.app'}/api`;

interface Batch {
  id?: number;
  startDate: string;
  endDate: string;
  status: boolean;
}

export default function BatchManagementPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });

  // Fetch batches
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/batch`);
      const result = await response.json();

      if (response.ok) {
        setBatches(result.data || []);
      } else {
        toast.error("Không thể tải danh sách đợt duyệt");
      }
    } catch (error) {
      toast.error("Lỗi kết nối đến server");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // Create batch
  const handleCreate = async () => {
    if (!formData.startDate || !formData.endDate) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/batch/create-batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Tạo đợt duyệt thành công");
        setIsCreateDialogOpen(false);
        setFormData({ startDate: "", endDate: "" });
        fetchBatches();
      } else {
        toast.error(result.message || "Không thể tạo đợt duyệt");
      }
    } catch (error) {
      toast.error("Lỗi kết nối đến server");
      console.error(error);
    }
  };

  // Update batch
  const handleUpdate = async () => {
    if (!selectedBatch?.id || !formData.startDate || !formData.endDate) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/batch/update-batch/${selectedBatch.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Cập nhật đợt duyệt thành công");
        setIsEditDialogOpen(false);
        setSelectedBatch(null);
        setFormData({ startDate: "", endDate: "" });
        fetchBatches();
      } else {
        toast.error(result.message || "Không thể cập nhật đợt duyệt");
      }
    } catch (error) {
      toast.error("Lỗi kết nối đến server");
      console.error(error);
    }
  };

  // Delete batch
  const handleDelete = async () => {
    if (!selectedBatch?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/batch/delete-batch/${selectedBatch.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Xóa đợt duyệt thành công");
        setIsDeleteDialogOpen(false);
        setSelectedBatch(null);
        fetchBatches();
      } else {
        toast.error(result.message || "Không thể xóa đợt duyệt");
      }
    } catch (error) {
      toast.error("Lỗi kết nối đến server");
      console.error(error);
    }
  };

  const openEditDialog = (batch: Batch) => {
    setSelectedBatch(batch);
    setFormData({
      startDate: batch.startDate.split("T")[0],
      endDate: batch.endDate.split("T")[0],
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Quản lý đợt duyệt</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Tạo và quản lý các đợt duyệt hồ sơ sinh viên
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={fetchBatches}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
          <Button
            className="gap-2"
            onClick={() => {
              setFormData({ startDate: "", endDate: "" });
              setIsCreateDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Tạo đợt duyệt mới
          </Button>
        </div>
      </div>

      {/* Batches Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Danh sách đợt duyệt
          </CardTitle>
          <CardDescription className="text-base mt-1.5">
            Tổng số: {batches.length} đợt duyệt
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Đang tải dữ liệu...
            </div>
          ) : batches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có đợt duyệt nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Ngày kết thúc</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{formatDate(batch.startDate)}</TableCell>
                    <TableCell>{formatDate(batch.endDate)}</TableCell>
                    <TableCell>
                      <Badge variant={batch.status ? "default" : "secondary"}>
                        {batch.status ? "Đang hoạt động" : "Không hoạt động"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(batch)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(batch)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo đợt duyệt mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin cho đợt duyệt hồ sơ mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-start-date">Ngày bắt đầu</Label>
              <Input
                id="create-start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-end-date">Ngày kết thúc</Label>
              <Input
                id="create-end-date"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleCreate}>Tạo đợt duyệt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật đợt duyệt</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin đợt duyệt hồ sơ
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-start-date">Ngày bắt đầu</Label>
              <Input
                id="edit-start-date"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-end-date">Ngày kết thúc</Label>
              <Input
                id="edit-end-date"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdate}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đợt duyệt này? Hành động này không thể hoàn tác.
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
