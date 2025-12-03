"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Upload,
  AlertCircle,
  Loader2,
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
} from "@/lib/actions/matrix";
import { useToast } from "@/hooks/use-toast";

export default function HeadMatrixPage() {
  const { toast } = useToast();
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

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Department Document Matrix</h1>
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

      {/* Loading State */}
      {isLoading ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading matrix data...</p>
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
              <h3 className="text-xl font-semibold mb-2 text-red-600">Error Loading Matrix</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {error}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
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
                <h3 className="text-xl font-semibold mb-2">No Matrix Data</h3>
                <p className="text-sm text-muted-foreground">
                  No matrix configuration found for your department.
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
                      {rule.documentRuleDescription && (
                        <span className="text-xs text-muted-foreground block mt-0.5">
                          {rule.documentRuleDescription}
                        </span>
                      )}
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
