"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Building2,
  FileText,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAllMatrix, setMatrixStatusForTrainingDirector } from "@/lib/actions/matrix";
import { getAllDepartments } from "@/lib/actions/department";
import { toast } from "@/lib/toast-compat";
import type { ApiResponse as DepartmentApiResponse, Department } from "@/types/department";

// Helper function to get status badge
function getStatusBadge(status: string | null) {
  if (!status) {
    return { label: "Chưa gửi", className: "bg-gray-500" };
  }

  const statusMap: Record<string, { label: string; className: string }> = {
    'Drafted': { label: "Chờ duyệt", className: "bg-blue-500" },
    'Pending': { label: "Đang xử lý", className: "bg-yellow-500" },
    'Approved': { label: "Đã phê duyệt", className: "bg-green-500" },
    'Approve': { label: "Đã phê duyệt", className: "bg-green-500" },
    'Rejected': { label: "Đã từ chối", className: "bg-red-500" },
    'Reject': { label: "Đã từ chối", className: "bg-red-500" },
    'InProgress': { label: "Đang xử lý", className: "bg-yellow-500" },
    'Complete': { label: "Hoàn thành", className: "bg-green-600" }
  };

  return statusMap[status] || { label: status, className: "bg-gray-500" };
}

export default function TrainingDirectorApprovalsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [allMatrixData, setAllMatrixData] = useState<any>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproveRejectDialogOpen, setIsApproveRejectDialogOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'Approve' | 'Reject'>('Approve');
  const [rejectReason, setRejectReason] = useState<string>("");

  // Filter matrix by selected department
  const matrixData = selectedDepartmentId && allMatrixData
    ? allMatrixData.filter((position: any) => position.departmentId === Number(selectedDepartmentId))
    : null;

  // Get matrix status and info
  const matrixStatus = matrixData?.[0]?.matrixStatusEnum || null;
  const rejectReasonFromMatrix = matrixData?.[0]?.reject_reason || null;
  const selectedDepartment = departments.find(d => d.id === Number(selectedDepartmentId));

  // Calculate overall status from all positions' statusEnum
  const getOverallStatus = () => {
    if (!matrixData || matrixData.length === 0) return null;
    
    const statuses = matrixData
      .filter((p: any) => p.positionId !== null)
      .map((p: any) => p.statusEnum);
    
    // If all approved, return Approve
    if (statuses.every((s: string) => s === 'Approve' || s === 'Approved')) {
      return 'Approve';
    }
    // If any rejected, return Reject
    if (statuses.some((s: string) => s === 'Reject' || s === 'Rejected')) {
      return 'Reject';
    }
    // If any in progress, return InProgress
    if (statuses.some((s: string) => s === 'InProgress' || s === 'Pending')) {
      return 'InProgress';
    }
    // Default
    return statuses[0] || null;
  };

  const overallStatus = getOverallStatus();

  // Load departments and matrix data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [deptResult, matrixResult] = await Promise.all([
          getAllDepartments(),
          getAllMatrix(),
        ]) as [DepartmentApiResponse<Department[]>, any];

        if (deptResult?.data) {
          setDepartments(Array.isArray(deptResult.data) ? deptResult.data : []);
        }

        if (matrixResult.status === 'error') {
          setError(matrixResult.message);
          setAllMatrixData(null);
        } else {
          setAllMatrixData(matrixResult.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const reloadMatrix = async () => {
    try {
      const result: any = await getAllMatrix();
      
      if (result.status === 'error') {
        setError(result.message);
        setAllMatrixData(null);
      } else {
        setAllMatrixData(result.data);
        setError("");
      }
    } catch (error: any) {
      setError(error.message || 'Failed to reload matrix');
      setAllMatrixData(null);
    }
  };

  const handleApproveReject = async () => {
    if (!selectedDepartmentId) return;

    if (approvalAction === 'Reject' && !rejectReason.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập lý do từ chối",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await setMatrixStatusForTrainingDirector(
        Number(selectedDepartmentId),
        approvalAction,
        approvalAction === 'Reject' ? rejectReason : " "
      );

      if (result.status === 'error' || result.status !== '200 OK') {
        toast({
          title: "Lỗi",
          description: result.message || `Không thể ${approvalAction === 'Approve' ? 'phê duyệt' : 'từ chối'}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thành công",
          description: result.message || `Đã ${approvalAction === 'Approve' ? 'phê duyệt' : 'từ chối'} thành công`,
        });
        setIsApproveRejectDialogOpen(false);
        setRejectReason("");
        await reloadMatrix();
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Duyệt Ma trận Tài liệu</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Xem xét và phê duyệt ma trận tài liệu của các khoa
          </p>
        </div>
      </div>

      {/* Department Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Chọn Khoa
          </CardTitle>
          <CardDescription>
            Chọn khoa để xem và duyệt ma trận tài liệu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select
                value={selectedDepartmentId}
                onValueChange={setSelectedDepartmentId}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn khoa..." />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.departmentName || dept.name || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Đang tải dữ liệu...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-600">Lỗi tải dữ liệu</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matrix Display */}
      {!isLoading && !error && selectedDepartmentId && matrixData && matrixData.length > 0 && (
        <>
          {/* Department Info & Actions */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedDepartment?.departmentName}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {matrixData.filter((p: any) => p.positionId !== null).length} vị trí
                  </p>
                  {rejectReasonFromMatrix && matrixStatus === 'Rejected' && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800">Lý do từ chối trước đó:</p>
                      <p className="text-sm text-red-700 mt-1">{rejectReasonFromMatrix}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {/* Status Badge - Overall status from positions */}
                  {overallStatus && (
                    <Badge className={`${getStatusBadge(overallStatus).className} text-white`}>
                      {getStatusBadge(overallStatus).label}
                    </Badge>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* Show Approve button if not already approved */}
                    {matrixStatus !== 'Approved' && matrixStatus !== 'Pending' && matrixStatus && (
                      <Button
                        variant="default"
                        className="gap-2 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          setApprovalAction('Approve');
                          setIsApproveRejectDialogOpen(true);
                        }}
                        disabled={isSubmitting}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Phê duyệt
                      </Button>
                    )}
                    
                    {/* Show Reject button if not already rejected */}
                    {matrixStatus !== 'Rejected' && matrixStatus !== 'Pending' && matrixStatus && (
                      <Button
                        variant="destructive"
                        className="gap-2"
                        onClick={() => {
                          setApprovalAction('Reject');
                          setIsApproveRejectDialogOpen(true);
                        }}
                        disabled={isSubmitting}
                      >
                        <XCircle className="w-4 h-4" />
                        Từ chối
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Matrix Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Ma trận Tài liệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-auto">
                {(() => {
                  const allDocuments = new Map();
                  matrixData.forEach((position: any) => {
                    position.documentCollumResponseList?.forEach((doc: any) => {
                      if (doc.document_id !== null && !allDocuments.has(doc.document_id)) {
                        allDocuments.set(doc.document_id, doc.document_name);
                      }
                    });
                  });

                  const documentColumns = Array.from(allDocuments.entries());

                  return (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 bg-muted/50">
                          <th className="p-4 text-left font-semibold min-w-[200px] sticky left-0 bg-muted/50 z-10 border-r-2">
                            Vị Trí
                          </th>
                          {documentColumns.map(([docId, docName]) => (
                            <th key={docId} className="p-4 text-center font-semibold min-w-[150px] border-l">
                              <span>{docName}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {matrixData
                          .filter((position: any) => position.positionId !== null)
                          .map((position: any) => {
                          const positionDocuments = new Map();
                          position.documentCollumResponseList?.forEach((doc: any) => {
                            positionDocuments.set(doc.document_id, doc);
                          });

                          // Get position status
                          const positionStatus = position.statusEnum || null;
                          const statusBadge = getStatusBadge(positionStatus);

                          return (
                            <tr key={position.positionId} className="border-b hover:bg-muted/20">
                              <td className="p-4 font-medium sticky left-0 bg-background z-10 border-r-2">
                                <span>{position.positionName}</span>
                              </td>

                              {documentColumns.map(([docId]) => {
                                const doc = positionDocuments.get(docId);
                                return (
                                  <td key={docId} className="p-4 text-center border-l">
                                    {doc ? (
                                      <div className="flex items-center justify-center gap-2">
                                        {doc.required ? (
                                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        ) : (
                                          <div className="h-5 w-5 rounded border-2 border-muted-foreground/30" />
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-muted-foreground">—</div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* No Department Selected */}
      {!isLoading && !error && !selectedDepartmentId && (
        <Card className="border-0 shadow-lg bg-muted/20">
          <CardContent className="p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Chọn Khoa</h3>
                <p className="text-sm text-muted-foreground">
                  Vui lòng chọn khoa để xem và duyệt ma trận tài liệu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Matrix Data */}
      {!isLoading && !error && selectedDepartmentId && (!matrixData || matrixData.length === 0) && (
        <Card className="border-0 shadow-lg bg-muted/20">
          <CardContent className="p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Không có dữ liệu Ma trận</h3>
                <p className="text-sm text-muted-foreground">
                  Khoa này chưa có ma trận tài liệu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approve/Reject Dialog */}
      <Dialog open={isApproveRejectDialogOpen} onOpenChange={setIsApproveRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {approvalAction === 'Approve' ? 'Phê duyệt' : 'Từ chối'} Ma trận
            </DialogTitle>
            <DialogDescription>
              {approvalAction === 'Approve' 
                ? `Xác nhận phê duyệt ma trận của ${selectedDepartment?.departmentName}`
                : `Nhập lý do từ chối ma trận của ${selectedDepartment?.departmentName}`
              }
            </DialogDescription>
          </DialogHeader>
          {approvalAction === 'Reject' && (
            <div className="space-y-2 py-4">
              <Label htmlFor="rejectReason">Lý do từ chối *</Label>
              <Input
                id="rejectReason"
                type="text"
                placeholder="Nhập lý do từ chối..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsApproveRejectDialogOpen(false);
                setRejectReason("");
              }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              variant={approvalAction === 'Approve' ? 'default' : 'destructive'}
              onClick={handleApproveReject}
              disabled={isSubmitting || (approvalAction === 'Reject' && !rejectReason.trim())}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                approvalAction === 'Approve' ? 'Phê duyệt' : 'Từ chối'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
