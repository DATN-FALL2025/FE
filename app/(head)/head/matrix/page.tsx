"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2 } from "lucide-react";
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
import { getDecodedToken } from "@/lib/auth-utils";
import { toast } from "@/lib/toast-compat";
import MatrixTimeDisplay from "@/components/shared/matrix-time-display";
import MatrixCellHoverPopup from "@/components/shared/matrix-cell-hover-popup";

function getStatusBadge(status: string | null) {
  if (!status) return { label: "Chưa gửi", variant: "secondary" as const, className: "bg-gray-500" };
  const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive"; className?: string }> = {
    'Drafted': { label: "Đã gửi - Chờ duyệt", variant: "default", className: "bg-blue-500" },
    'Pending': { label: "Đang xử lý", variant: "default", className: "bg-yellow-500" },
    'Approved': { label: "Đã phê duyệt", variant: "default", className: "bg-green-500" },
    'Approve': { label: "Đã phê duyệt", variant: "default", className: "bg-green-500" },
    'Rejected': { label: "Đã từ chối", variant: "destructive" },
    'Reject': { label: "Đã từ chối", variant: "destructive" },
    'InProgress': { label: "Đang xử lý", variant: "default", className: "bg-yellow-500" },
    'Complete': { label: "Hoàn thành", variant: "default", className: "bg-green-600" },
  };
  return map[status] || { label: status, variant: "secondary" as const };
}

export default function HeadMatrixPage() {
  const [allMatrixData, setAllMatrixData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRuleFormOpen, setIsRuleFormOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<any>(null);
  const [documentRules, setDocumentRules] = useState<any[]>([]);
  const [ruleValues, setRuleValues] = useState<Record<number, string>>({});
  const [isLoadingRules, setIsLoadingRules] = useState(false);
  const [isSubmittingForReview, setIsSubmittingForReview] = useState(false);

  // Get department from JWT
  const decodedToken = getDecodedToken();
  const userDepartmentId = decodedToken?.departmentId ? Number(decodedToken.departmentId) : null;
  const userDepartmentName = decodedToken?.departmentName || null;

  // Filter matrix by department
  const matrixData = allMatrixData?.filter((p: any) => p.departmentId === userDepartmentId);
  const matrixStatus = matrixData?.[0]?.matrixStatusEnum || null;
  const rejectReason = matrixData?.[0]?.reject_reason || null;

  // Check if editable
  const isMatrixEditable = matrixStatus !== 'Drafted' && matrixStatus !== 'Pending' && 
                           matrixStatus !== 'Approved' && matrixStatus !== 'Approve';

  const getOverallStatus = () => {
    if (!matrixData || matrixData.length === 0) return null;
    const statuses = matrixData.filter((p: any) => p.positionId !== null).map((p: any) => p.statusEnum);
    if (statuses.every((s: string) => s === 'Approve' || s === 'Approved')) return 'Approve';
    if (statuses.some((s: string) => s === 'Reject' || s === 'Rejected')) return 'Reject';
    if (statuses.some((s: string) => s === 'InProgress' || s === 'Pending')) return 'InProgress';
    return statuses[0] || null;
  };
  const overallStatus = getOverallStatus();

  useEffect(() => {
    const loadMatrix = async () => {
      setIsLoading(true);
      try {
        const result: any = await getAllMatrix();
        if (result.status === 'error') { setError(result.message); setAllMatrixData(null); }
        else { setAllMatrixData(result.data); }
      } catch (err: any) { setError(err.message || 'Không thể tải dữ liệu'); }
      finally { setIsLoading(false); }
    };
    loadMatrix();
  }, []);

  const reloadMatrix = async () => {
    try {
      const result: any = await getAllMatrix();
      if (result.status === 'error') { setError(result.message); setAllMatrixData(null); }
      else { setAllMatrixData(result.data); setError(""); }
    } catch (e: any) { setError(e.message); }
  };

  const handleCellClick = async (matrixId: number, currentRequired: boolean, positionName: string, documentName: string, documentRuleId: number | null, documentId: number) => {
    if (!isMatrixEditable) return;
    
    if (currentRequired) {
      setIsSubmitting(true);
      try {
        const result = await clickToCellMatrix({ matrixId, required: false });
        if (result.status === 'error') toast({ title: "Lỗi", description: result.message, variant: "destructive" });
        else { toast({ title: "Thành công", description: "Đã bỏ chọn" }); await reloadMatrix(); }
      } catch (e: any) { toast({ title: "Lỗi", description: e.message, variant: "destructive" }); }
      finally { setIsSubmitting(false); }
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
        let rules: any[] = result.documentRules || result.data?.documentRules || result.data?.documentRuleList || [];
        setDocumentRules(rules);
      }
    } catch (e) { toast({ title: "Lỗi", description: "Không thể tải quy tắc", variant: "destructive" }); }
    finally { setIsLoadingRules(false); }
  };

  const handleSubmitRuleForm = async () => {
    if (!selectedCell) return;
    const list = Object.entries(ruleValues).filter(([_, v]) => v.trim()).map(([id, v]) => ({ document_rule_Id: Number(id), document_rule_value: v }));
    
    const temp = selectedCell;
    setIsRuleFormOpen(false); setSelectedCell(null); setRuleValues({}); setDocumentRules([]);
    setIsSubmitting(true);
    try {
      if (list.length > 0) {
        await createDocumentRuleValue({ matrixID: temp.matrixId, documentRuleValueDTOList: list });
      }
      await clickToCellMatrix({ matrixId: temp.matrixId, required: true });
      toast({ title: "Thành công", description: list.length > 0 ? `Đã lưu ${list.length} quy tắc` : "Đã kiểm tra ô" });
      await reloadMatrix();
    } catch (e: any) { toast({ title: "Lỗi", description: e.message, variant: "destructive" }); }
    finally { setIsSubmitting(false); }
  };

  const handleSubmitForReview = async () => {
    if (!userDepartmentId) { toast({ title: "Lỗi", description: "Không tìm thấy khoa", variant: "destructive" }); return; }
    if (!confirm("Gửi ma trận để xét duyệt?")) return;
    setIsSubmittingForReview(true);
    try {
      const result = await setMatrixDraftedByDepartment(userDepartmentId);
      if (result.status === '200 OK') { toast({ title: "Thành công", description: "Đã gửi" }); await reloadMatrix(); }
      else toast({ title: "Lỗi", description: result.message, variant: "destructive" });
    } catch (e: any) { toast({ title: "Lỗi", description: e.message, variant: "destructive" }); }
    finally { setIsSubmittingForReview(false); }
  };


  return (
    <div className="space-y-6 w-full">
      {/* Matrix Time Display */}
      <MatrixTimeDisplay />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Ma trận tài liệu khoa</h1>
          {userDepartmentName && <p className="text-lg font-semibold text-primary mt-1">{userDepartmentName}</p>}
          {rejectReason && matrixStatus === 'Rejected' && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">Lý do từ chối:</p>
              <p className="text-sm text-red-700 mt-1">{rejectReason}</p>
            </div>
          )}
          <p className="text-muted-foreground mt-2">Xem và quản lý yêu cầu tài liệu cho các vị trí đào tạo</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSubmitForReview} disabled={isSubmittingForReview || !matrixData?.length || !isMatrixEditable}>
            {isSubmittingForReview ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Đang gửi...</> : 
             matrixStatus === 'Drafted' || matrixStatus === 'Pending' ? "Đã gửi xét duyệt" :
             matrixStatus === 'Approved' ? "Đã được phê duyệt" : "Gửi để xét duyệt"}
          </Button>
          {overallStatus && <Badge variant={getStatusBadge(overallStatus).variant} className={getStatusBadge(overallStatus).className}>{getStatusBadge(overallStatus).label}</Badge>}
        </div>
      </div>

      {!isLoading && !error && matrixData?.length > 0 && !isMatrixEditable && (
        <Card className="border-0 shadow-lg bg-yellow-50">
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

      {isLoading ? (
        <Card className="border-0 shadow-lg"><CardContent className="p-6 flex flex-col items-center py-16">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Đang tải...</p>
        </CardContent></Card>
      ) : error ? (
        <Card className="border-0 shadow-lg"><CardContent className="p-6 flex flex-col items-center py-16">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-600">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Thử lại</Button>
        </CardContent></Card>
      ) : matrixData?.length > 0 ? (
        <Card className="border-0 shadow-lg"><CardContent className="p-6">
          <div className="border rounded-lg overflow-auto">
            {(() => {
              const docs = new Map();
              matrixData.forEach((p: any) => p.documentCollumResponseList?.forEach((d: any) => {
                if (d.document_id !== null) docs.set(d.document_id, d.document_name);
              }));
              const cols = Array.from(docs.entries());
              return (
                <table className="w-full border-collapse">
                  <thead><tr className="border-b-2 bg-muted/50">
                    <th className="p-4 text-left font-semibold min-w-[200px] sticky left-0 bg-muted/50 z-10 border-r-2">Vị Trí</th>
                    {cols.map(([id, name]) => <th key={id} className="p-4 text-center font-semibold min-w-[150px] border-l">{name}</th>)}
                  </tr></thead>
                  <tbody>
                    {matrixData.filter((p: any) => p.positionId !== null).map((pos: any) => {
                      const posDoc = new Map();
                      pos.documentCollumResponseList?.forEach((d: any) => posDoc.set(d.document_id, d));
                      return (
                        <tr key={pos.positionId} className="border-b hover:bg-muted/20">
                          <td className="p-4 font-medium sticky left-0 bg-background z-10 border-r-2">{pos.positionName}</td>
                          {cols.map(([id, name]) => {
                            const d = posDoc.get(id);
                            return (
                              <td key={id} className="p-4 text-center border-l">
                                {d ? (
                                  <MatrixCellHoverPopup matrixId={d.matrixId} disabled={!d.required}>
                                    <Checkbox checked={d.required} className={`h-5 w-5 ${isMatrixEditable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                                      onCheckedChange={() => handleCellClick(d.matrixId, d.required, pos.positionName, name, d.document_rule_id, id)}
                                      disabled={isSubmitting || !isMatrixEditable} />
                                  </MatrixCellHoverPopup>
                                ) : <span className="text-muted-foreground">—</span>}
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
        </CardContent></Card>
      ) : (
        <Card className="border-0 shadow-lg bg-muted/20"><CardContent className="p-16 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Không có dữ liệu</h3>
          <p className="text-muted-foreground">Không tìm thấy ma trận cho khoa của bạn.</p>
        </CardContent></Card>
      )}

      <Dialog open={isRuleFormOpen} onOpenChange={setIsRuleFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nhập giá trị quy tắc</DialogTitle>
            <DialogDescription>{selectedCell?.positionName} - {selectedCell?.documentName}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoadingRules ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div> :
             documentRules.length > 0 ? (
              <div className="space-y-4">
                {documentRules.map((r: any) => (
                  <div key={r.documentRuleId} className="space-y-2">
                    <Label>{r.documentRuleName}</Label>
                    <Input value={ruleValues[r.documentRuleId] || ""} onChange={(e) => setRuleValues(p => ({ ...p, [r.documentRuleId]: e.target.value }))} placeholder={`Nhập ${r.documentRuleName}...`} />
                  </div>
                ))}
              </div>
            ) : <p className="text-center text-muted-foreground py-8">Tài liệu chưa có quy tắc</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsRuleFormOpen(false); setSelectedCell(null); }}>Hủy</Button>
            <Button onClick={handleSubmitRuleForm} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Đang lưu...</> : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
