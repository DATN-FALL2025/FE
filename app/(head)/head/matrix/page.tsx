"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Loader2,
  Download,
  Upload,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
import { getDepartmentIdFromToken, getDecodedToken } from "@/lib/auth-utils";
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
    'Drafted': {
      label: "Đã gửi - Chờ duyệt",
      variant: "default",
      className: "bg-blue-500 hover:bg-blue-600"
    },
    'Pending': {
      label: "Đang xử lý",
      variant: "default",
      className: "bg-yellow-500 hover:bg-yellow-600"
    },
    'Approved': {
      label: "Đã phê duyệt",
      variant: "default",
      className: "bg-green-500 hover:bg-green-600"
    },
    'Approve': {
      label: "Đã phê duyệt",
      variant: "default",
      className: "bg-green-500 hover:bg-green-600"
    },
    'Rejected': {
      label: "Đã từ chối",
      variant: "destructive"
    },
    'Reject': {
      label: "Đã từ chối",
      variant: "destructive"
    },
    'InProgress': {
      label: "Đang xử lý",
      variant: "default",
      className: "bg-yellow-500 hover:bg-yellow-600"
    },
    'Complete': {
      label: "Hoàn thành",
      variant: "default",
      className: "bg-green-600 hover:bg-green-700"
    }
  };

  return statusMap[status] || {
    label: status,
    variant: "secondary" as const
  };
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

  // Get department ID and name from JWT token
  const decodedToken = getDecodedToken();
  const userDepartmentId = decodedToken?.departmentId ? Number(decodedToken.departmentId) : null;
  const userDepartmentName = decodedToken?.departmentName || null;

  // Filter matrix data by user's department
  const matrixData = allMatrixData?.filter(
    (position: any) => position.departmentId === userDepartmentId
  );

  // Get matrix status from first position (all positions in same department have same status)
  const matrixStatus = matrixData?.[0]?.matrixStatusEnum || null;
  const rejectReason = matrixData?.[0]?.reject_reason || null;

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

  // Debug log
  useEffect(() => {
    if (userDepartmentId) {
      console.log('🔓 Head Department ID from JWT:', userDepartmentId);
      console.log('🏢 Department Name:', userDepartmentName);
      console.log('📊 Matrix Status:', matrixStatus);
    }
  }, [userDepartmentId, userDepartmentName, matrixStatus]);

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
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load matrix data');
      } finally {
        setIsLoading(false);
      }
    };

    loadMatrix();
  }, []);

  const reloadMatrix = async (maxRetries: number = 3) => {
    setIsLoading(true);

    let retries = 0;

    while (retries < maxRetries) {
      try {
        const result: any = await getAllMatrix();

        console.log(`🔄 Reload Matrix Attempt ${retries + 1}/${maxRetries}:`, result);

        if (result.status === 'error') {
          setError(result.message);
          setAllMatrixData(null);
          break;
        } else {
          const newDataString = JSON.stringify(result.data);
          const oldDataString = JSON.stringify(allMatrixData);

          if (newDataString !== oldDataString || retries === maxRetries - 1) {
            setAllMatrixData(result.data);
            setError("");
            console.log('✅ Matrix data updated successfully');
            break;
          } else {
            console.log('⏳ Data unchanged, retrying in 1s...');
            retries++;
            if (retries < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        }
      } catch (error: any) {
        console.error('❌ Reload Matrix Error:', error);
        setError(error.message || 'Failed to reload matrix');
        setAllMatrixData(null);
        break;
      }
    }

    setIsLoading(false);
  };

  const handleCellClick = async (
    matrixId: number,
    currentRequired: boolean,
    positionName: string,
    documentName: string,
    documentRuleId: number | null,
    documentId: number
  ) => {
    // If already checked, toggle it off
    if (currentRequired) {
      setIsSubmitting(true);
      try {
        const result = await clickToCellMatrix({
          matrixId,
          required: false
        });

        if (result.status === 'error') {
          toast({
            title: "Lỗi",
            description: result.message || "Không thể cập nhật trạng thái",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Thành công",
            description: "Đã bỏ chọn tài liệu",
          });
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
      return;
    }

    // If not checked, open form to enter rule values
    setSelectedCell({
      matrixId,
      documentRuleId,
      documentId,
      positionName,
      documentName
    });
    setRuleValues({});
    setDocumentRules([]);
    setIsRuleFormOpen(true);

    // Fetch document rules
    setIsLoadingRules(true);
    try {
      const result = await getDocumentWithRules(documentId);

      if (result.status !== 'error') {
        let rules: any[] = [];

        if (result.documentRules && Array.isArray(result.documentRules)) {
          rules = result.documentRules;
        } else if (result.data) {
          if (result.data.documentRules && Array.isArray(result.data.documentRules)) {
            rules = result.data.documentRules;
          } else if (result.data.documentRuleList && Array.isArray(result.data.documentRuleList)) {
            rules = result.data.documentRuleList;
          } else if (Array.isArray(result.data)) {
            rules = result.data;
          }
        } else if (result.documentRuleList && Array.isArray(result.documentRuleList)) {
          rules = result.documentRuleList;
        } else if (Array.isArray(result)) {
          rules = result;
        }

        setDocumentRules(rules);

        if (rules.length === 0) {
          toast({
            title: "Thông báo",
            description: "Tài liệu này chưa có document rules",
            variant: "default",
          });
        }
      } else {
        toast({
          title: "Thông báo",
          description: result.message || "Không thể tải document rules",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi tải document rules",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRules(false);
    }
  };

  const handleSubmitRuleForm = async () => {
    if (!selectedCell) return;

    const documentRuleValueDTOList = Object.entries(ruleValues)
      .filter(([_, value]) => value.trim() !== "")
      .map(([ruleId, value]) => ({
        document_rule_Id: Number(ruleId),
        document_rule_value: value
      }));

    if (documentRuleValueDTOList.length === 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập ít nhất một giá trị rule",
        variant: "destructive",
      });
      return;
    }

    const tempCell = selectedCell;

    setIsRuleFormOpen(false);
    setSelectedCell(null);
    setRuleValues({});
    setDocumentRules([]);

    setIsSubmitting(true);
    try {
      const payload = {
        matrixID: tempCell.matrixId,
        documentRuleValueDTOList
      };

      const ruleResult = await createDocumentRuleValue(payload);

      if (ruleResult.status === 'error') {
        toast({
          title: "Lỗi",
          description: ruleResult.message || "Không thể lưu rule values",
          variant: "destructive",
        });
        return;
      }

      const checkboxResult = await clickToCellMatrix({
        matrixId: tempCell.matrixId,
        required: true
      });

      if (checkboxResult.status === 'error') {
        toast({
          title: "Lỗi",
          description: "Đã lưu rule values nhưng không thể cập nhật checkbox",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thành công",
          description: `Đã lưu ${documentRuleValueDTOList.length} rule value(s)`,
        });
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

  const handleSubmitForReview = async () => {
    if (!userDepartmentId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin khoa",
        variant: "destructive",
      });
      return;
    }

    if (!confirm("Bạn có chắc muốn gửi ma trận này để xét duyệt?")) return;

    setIsSubmittingForReview(true);
    try {
      const result = await setMatrixDraftedByDepartment(userDepartmentId);

      if (result.status === 'error' || result.status !== '200 OK') {
        toast({
          title: "Lỗi",
          description: result.message || "Không thể gửi ma trận để xét duyệt",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thành công",
          description: result.message || "Đã gửi ma trận để xét duyệt",
        });
        await reloadMatrix();
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingForReview(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight">Ma trận tài liệu khoa</h1>
          </div>
          {userDepartmentName && (
            <p className="text-lg font-semibold text-primary mt-1">
              {userDepartmentName}
            </p>
          )}
          {rejectReason && matrixStatus === 'Rejected' && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">Lý do từ chối:</p>
              <p className="text-sm text-red-700 mt-1">{rejectReason}</p>
            </div>
          )}
          <p className="text-muted-foreground mt-2 text-base">
            Xem và quản lý yêu cầu tài liệu cho các vị trí đào tạo của khoa bạn
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            className="gap-2"
            onClick={handleSubmitForReview}
            disabled={
              isSubmittingForReview ||
              !matrixData ||
              matrixData.length === 0 ||
              matrixStatus === 'Drafted' ||
              matrixStatus === 'Pending' ||
              matrixStatus === 'Approved'
            }
          >
            {isSubmittingForReview ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang gửi...
              </>
            ) : matrixStatus === 'Drafted' || matrixStatus === 'Pending' ? (
              "Đã gửi xét duyệt"
            ) : matrixStatus === 'Approved' ? (
              "Đã được phê duyệt"
            ) : (
              "Gửi để xét duyệt"
            )}
          </Button>
          {overallStatus && (
            <Badge
              variant={getStatusBadge(overallStatus).variant}
              className={getStatusBadge(overallStatus).className}
            >
              {getStatusBadge(overallStatus).label}
            </Badge>
          )}
        </div>
      </div>

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
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {error}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Thử lại
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : matrixData && matrixData.length > 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Matrix Grid Display */}
              <div className="border rounded-lg overflow-auto">
                {(() => {
                  // Extract unique documents
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

                            return (
                              <tr key={position.positionId} className="border-b hover:bg-muted/20">
                                <td className="p-4 font-medium sticky left-0 bg-background z-10 border-r-2">
                                  <span>{position.positionName}</span>
                                </td>
                                {documentColumns.map(([docId, docName]) => {
                                  const doc = positionDocuments.get(docId);
                                  return (
                                    <td key={docId} className="p-4 text-center border-l">
                                      {doc ? (
                                        <div className="flex items-center justify-center gap-2">
                                          <Checkbox
                                            checked={doc.required}
                                            className="h-5 w-5 cursor-pointer"
                                            onCheckedChange={() => handleCellClick(
                                              doc.matrixId,
                                              doc.required,
                                              position.positionName,
                                              docName,
                                              doc.document_rule_id || null,
                                              docId
                                            )}
                                            disabled={isSubmitting}
                                          />
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
                <p className="text-sm text-muted-foreground">
                  Không tìm thấy cấu hình ma trận cho khoa của bạn.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rule Value Form Dialog */}
      <Dialog open={isRuleFormOpen} onOpenChange={setIsRuleFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Nhập Rule Values</DialogTitle>
            <DialogDescription className="text-sm">
              {selectedCell?.positionName} - {selectedCell?.documentName}
            </DialogDescription>
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
                    <Label htmlFor={`rule-${rule.documentRuleId}`} className="text-sm font-medium">
                      {rule.documentRuleName}
                    </Label>
                    <Input
                      id={`rule-${rule.documentRuleId}`}
                      type="text"
                      value={ruleValues[rule.documentRuleId] || ""}
                      onChange={(e) => {
                        setRuleValues(prev => ({
                          ...prev,
                          [rule.documentRuleId]: e.target.value
                        }));
                      }}
                      placeholder={`Nhập ${rule.documentRuleName.toLowerCase()}...`}
                      disabled={isSubmitting}
                      className="w-full"
                    />
                  </div>
                ))}

                {documentRules.length > 1 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Đã nhập: {Object.values(ruleValues).filter(v => v.trim()).length} / {documentRules.length}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center">
                <AlertCircle className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-sm font-medium text-muted-foreground">Không tìm thấy rules</p>
                <p className="text-xs text-muted-foreground mt-1">Tài liệu chưa có document rules</p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsRuleFormOpen(false);
                setSelectedCell(null);
                setRuleValues({});
                setDocumentRules([]);
              }}
              disabled={isSubmitting}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              onClick={handleSubmitRuleForm}
              disabled={isSubmitting || Object.values(ruleValues).filter(v => v.trim()).length === 0}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
