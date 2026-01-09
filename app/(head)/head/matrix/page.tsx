"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { getDepartmentIdFromToken, getDecodedToken } from "@/lib/auth-utils";
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
  getAllMatrix,
  clickToCellMatrix,
  createDocumentRuleValue,
  getDocumentWithRules,
  setMatrixDraftedByDepartment,
} from "@/lib/actions/matrix";
import { getDecodedToken } from "@/lib/auth-utils";
import { toast } from "@/lib/toast-compat";

// Helper function to get status badge info
function getStatusBadge(status: string | null) {
  if (!status) {
    return {
      label: "Chưa gửi",
      variant: "secondary" as const,
      className: "bg-gray-500 hover:bg-gray-600"
    };
  }

  const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
    'Drafted': { label: "Đã gửi - Chờ duyệt", variant: "default", className: "bg-blue-500 hover:bg-blue-600" },
    'Pending': { label: "Đang xử lý", variant: "default", className: "bg-yellow-500 hover:bg-yellow-600" },
    'Approved': { label: "Đã phê duyệt", variant: "default", className: "bg-green-500 hover:bg-green-600" },
    'Approve': { label: "Đã phê duyệt", variant: "default", className: "bg-green-500 hover:bg-green-600" },
    'Rejected': { label: "Đã từ chối", variant: "destructive" },
    'Reject': { label: "Đã từ chối", variant: "destructive" },
    'InProgress': { label: "Đang xử lý", variant: "default", className: "bg-yellow-500 hover:bg-yellow-600" },
    'Complete': { label: "Hoàn thành", variant: "default", className: "bg-green-600 hover:bg-green-700" }
  };

  return statusMap[status] || { label: status, variant: "secondary" as const };
}

export default function HeadMatrixPage() {
  const [allMatrixData, setAllMatrixData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRuleFormOpen, setIsRuleFormOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    matrixId: number;
    documentRuleId: number | null;
    documentId: number;
    positionName: string;
    documentName: string;
  } | null>(null);
  const [documentRules, setDocumentRules] = useState<any[]>([]);
  const [ruleValues, setRuleValues] = useState<Record<number, string>>({});
  const [isLoadingRules, setIsLoadingRules] = useState(false);
  const [isSubmittingForReview, setIsSubmittingForReview] = useState(false);

  // TODO: Get department ID from user session/auth
  // For now, filter by first department in data
  const userDepartmentId = allMatrixData?.[0]?.departmentId || null;

  // Filter matrix data by user's department
  const matrixData = allMatrixData?.filter(
    (position: any) => position.departmentId === userDepartmentId
  );

  // Load matrix data on mount
  useEffect(() => {
    const loadMatrix = async () => {
      setIsLoading(true);
      setError("");
      try {
        const matrixResult: any = await getAllMatrix();

        if (matrixResult.status === 'error') {
          setError(matrixResult.message);
          setAllMatrixData(null);
        } else {
          setAllMatrixData(matrixResult.data);
          console.log('✅ Matrix data loaded, length:', matrixResult.data?.length);
        }
      } catch (err: any) {
        console.error('❌ Error loading matrix:', err);
        setError(err.message || 'Failed to load matrix data');
      } finally {
        setIsLoading(false);
      }
    };
    loadMatrix();
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

  const handleCellClick = async (
    matrixId: number,
    currentRequired: boolean,
    positionName: string,
    documentName: string,
    documentRuleId: number | null,
    documentId: number
  ) => {
    if (currentRequired) {
      setIsSubmitting(true);
      try {
        const result = await clickToCellMatrix({ matrixId, required: false });
        if (result.status === 'error') {
          toast({ title: "Lỗi", description: result.message || "Không thể cập nhật", variant: "destructive" });
        } else {
          toast({ title: "Thành công", description: "Đã bỏ chọn tài liệu" });
          await reloadMatrix();
        }
      } catch (error: any) {
        toast({ title: "Lỗi", description: error.message || "Đã xảy ra lỗi", variant: "destructive" });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setSelectedCell({ matrixId, documentRuleId, documentId, positionName, documentName });
    setRuleValues({});
    setDocumentRules([]);
    setIsRuleFormOpen(true);
    setIsLoadingRules(true);

    try {
      const result = await getDocumentWithRules(documentId);
      if (result.status !== 'error') {
        let rules: any[] = [];
        if (result.documentRules && Array.isArray(result.documentRules)) rules = result.documentRules;
        else if (result.data?.documentRules) rules = result.data.documentRules;
        else if (result.data?.documentRuleList) rules = result.data.documentRuleList;
        else if (Array.isArray(result.data)) rules = result.data;
        setDocumentRules(rules);
      }
    } catch (error) {
      toast({ title: "Lỗi", description: "Đã xảy ra lỗi khi tải document rules", variant: "destructive" });
    } finally {
      setIsLoadingRules(false);
    }
  };

  const handleSubmitRuleForm = async () => {
    if (!selectedCell) return;

    const documentRuleValueDTOList = Object.entries(ruleValues)
      .filter(([_, value]) => value.trim() !== "")
      .map(([ruleId, value]) => ({ document_rule_Id: Number(ruleId), document_rule_value: value }));

    if (documentRuleValueDTOList.length === 0) {
      toast({ title: "Lỗi", description: "Vui lòng nhập ít nhất một giá trị rule", variant: "destructive" });
      return;
    }

    const tempCell = selectedCell;
    setIsRuleFormOpen(false);
    setSelectedCell(null);
    setRuleValues({});
    setDocumentRules([]);
    setIsSubmitting(true);

    try {
      const ruleResult = await createDocumentRuleValue({ matrixID: tempCell.matrixId, documentRuleValueDTOList });
      if (ruleResult.status === 'error') {
        toast({ title: "Lỗi", description: ruleResult.message || "Không thể lưu rule values", variant: "destructive" });
        return;
      }

      const checkboxResult = await clickToCellMatrix({ matrixId: tempCell.matrixId, required: true });
      if (checkboxResult.status === 'error') {
        toast({ title: "Lỗi", description: "Đã lưu rule values nhưng không thể cập nhật checkbox", variant: "destructive" });
      } else {
        toast({ title: "Thành công", description: `Đã lưu ${documentRuleValueDTOList.length} rule value(s)` });
        await reloadMatrix();
      }
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Đã xảy ra lỗi", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!userDepartmentId) {
      toast({ title: "Lỗi", description: "Không tìm thấy thông tin khoa", variant: "destructive" });
      return;
    }
    if (!confirm("Bạn có chắc muốn gửi ma trận này để xét duyệt?")) return;

    setIsSubmittingForReview(true);
    try {
      const result = await setMatrixDraftedByDepartment(userDepartmentId);
      if (result.status === 'error' || result.status !== '200 OK') {
        toast({ title: "Lỗi", description: result.message || "Không thể gửi ma trận để xét duyệt", variant: "destructive" });
      } else {
        toast({ title: "Thành công", description: result.message || "Đã gửi ma trận để xét duyệt" });
        await reloadMatrix();
      }
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Đã xảy ra lỗi", variant: "destructive" });
    } finally {
      setIsSubmittingForReview(false);
    }
  };


  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Ma trận tài liệu khoa</h1>
          {userDepartmentName && (
            <p className="text-lg font-semibold text-primary mt-1">{userDepartmentName}</p>
          )}
          {rejectReason && matrixStatus === 'Rejected' && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">Lý do từ chối:</p>
              <p className="text-sm text-red-700 mt-1">{rejectReason}</p>
            </div>
          )}
          <p className="text-muted-foreground mt-2 text-base">
            View and manage document requirements for your department&apos;s training positions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Matrix Status Warning */}
      {!isLoading && !error && matrixData && matrixData.length > 0 && !isMatrixEditable && (
        <Card className="border-0 shadow-lg bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">
                  {matrixStatus === 'Drafted' && "Ma trận đã được gửi để xét duyệt"}
                  {matrixStatus === 'Pending' && "Ma trận đang được xử lý"}
                  {(matrixStatus === 'Approved' || matrixStatus === 'Approve') && "Ma trận đã được phê duyệt"}
                </p>
                <p className="text-sm text-yellow-700">Bạn không thể chỉnh sửa ma trận trong trạng thái này.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Đang tải dữ liệu ma trận...</p>
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-red-600">Lỗi tải ma trận</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Thử lại</Button>
            </div>
          </CardContent>
        </Card>
      ) : !userDepartmentId ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-yellow-600">No Department Access</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Your account is not assigned to any department. Please contact administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : matrixData && matrixData.length > 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
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
                          Vị Trí / Tài Liệu
                        </th>
                        {documentColumns.map(([docId, docName]) => (
                          <th key={docId} className="p-4 text-center font-semibold min-w-[150px] border-l">
                            {docName}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {matrixData.filter((position: any) => position.positionId !== null).map((position: any) => {
                        const positionDocuments = new Map();
                        position.documentCollumResponseList?.forEach((doc: any) => {
                          positionDocuments.set(doc.document_id, doc);
                        });

                        return (
                          <tr key={position.positionId} className="border-b hover:bg-muted/20">
                            <td className="p-4 font-medium sticky left-0 bg-background z-10 border-r-2">
                              {position.positionName}
                            </td>
                            {documentColumns.map(([docId, docName]) => {
                              const doc = positionDocuments.get(docId);
                              return (
                                <td key={docId} className="p-4 text-center border-l">
                                  {doc ? (
                                    <Checkbox
                                      checked={doc.required}
                                      className={`h-5 w-5 ${isMatrixEditable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                                      onCheckedChange={() => {
                                        if (isMatrixEditable) {
                                          handleCellClick(doc.matrixId, doc.required, position.positionName, docName, doc.document_rule_id || null, docId);
                                        }
                                      }}
                                      disabled={isSubmitting || !isMatrixEditable}
                                    />
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
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
      ) : (
        <Card className="border-0 shadow-lg bg-muted/20">
          <CardContent className="p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Không có dữ liệu ma trận</h3>
                <p className="text-sm text-muted-foreground">Không tìm thấy cấu hình ma trận cho khoa của bạn.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rule Value Form Dialog */}
      <Dialog open={isRuleFormOpen} onOpenChange={setIsRuleFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nhập Rule Values</DialogTitle>
            <DialogDescription>{selectedCell?.positionName} - {selectedCell?.documentName}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoadingRules ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : documentRules.length > 0 ? (
              <div className="space-y-4">
                {documentRules.map((rule: any) => (
                  <div key={rule.documentRuleId} className="space-y-2">
                    <Label htmlFor={`rule-${rule.documentRuleId}`}>{rule.documentRuleName}</Label>
                    <Input
                      id={`rule-${rule.documentRuleId}`}
                      value={ruleValues[rule.documentRuleId] || ""}
                      onChange={(e) => setRuleValues(prev => ({ ...prev, [rule.documentRuleId]: e.target.value }))}
                      placeholder={`Nhập ${rule.documentRuleName.toLowerCase()}...`}
                      disabled={isSubmitting}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <AlertCircle className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">Tài liệu chưa có document rules</p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setIsRuleFormOpen(false); setSelectedCell(null); setRuleValues({}); setDocumentRules([]); }} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button onClick={handleSubmitRuleForm} disabled={isSubmitting || Object.values(ruleValues).filter(v => v.trim()).length === 0}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang lưu...</> : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
