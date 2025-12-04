"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Download,
  Upload,
  AlertCircle,
  Loader2,
  Filter,
  Plus,
  Trash2,
  MoreVertical,
  CheckCircle2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getAllMatrix,
  addMatrixRow,
  addMatrixColumn,
  addMatrixMultipleRows,
  addMatrixMultipleColumns,
  deleteMatrixRow,
  deleteMatrixColumn,
  deleteAllMatrixRows,
  deleteAllMatrixColumns,
  clearMatrix,
} from "@/lib/actions/matrix";
import { getAllDepartments } from "@/lib/actions/department";
import { getAllPositions } from "@/lib/actions/position";
import { getAllDocuments } from "@/lib/actions/document";
import { toast } from "@/lib/toast-compat";
import type { ApiResponse as DepartmentApiResponse, Department } from "@/types/department";
import type { ApiResponse as PositionApiResponse, Position } from "@/types/position";
import type { ApiResponse as DocumentApiResponse, Document } from "@/types/document";

// Helper function to remove Vietnamese accents for search
function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

export default function TrainingDirectorMatrixPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [allMatrixData, setAllMatrixData] = useState<any>(null); // Store all data from API
  const [filterDepartmentId, setFilterDepartmentId] = useState<string>("all");
  const [searchPositionName, setSearchPositionName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isAddRowDialogOpen, setIsAddRowDialogOpen] = useState(false);
  const [availablePositions, setAvailablePositions] = useState<any[]>([]);
  const [selectedPositionId, setSelectedPositionId] = useState<string>("");
  const [selectedPositionIds, setSelectedPositionIds] = useState<string[]>([]);
  const [addRowMode, setAddRowMode] = useState<"single" | "multiple">("single");
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [availableDocuments, setAvailableDocuments] = useState<any[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [addColumnMode, setAddColumnMode] = useState<"single" | "multiple">("single");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client-side filtered data based on department selection and search
  let matrixData = filterDepartmentId === "all"
    ? allMatrixData
    : allMatrixData?.filter((position: any) => position.departmentId === Number(filterDepartmentId));

  // Apply position name search filter (with Vietnamese accent removal)
  if (searchPositionName && matrixData) {
    const searchNormalized = removeVietnameseAccents(searchPositionName);
    matrixData = matrixData.filter((position: any) => {
      const positionNameNormalized = removeVietnameseAccents(position.positionName || '');
      const positionCodeNormalized = removeVietnameseAccents(position.positionCode || '');
      return positionNameNormalized.includes(searchNormalized) ||
             positionCodeNormalized.includes(searchNormalized);
    });
  }

  // Load ALL matrix data once on mount
  useEffect(() => {
    const loadAllMatrix = async () => {
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

    loadAllMatrix();
  }, []); // Only run once on mount

  // Load departments, positions, documents AFTER matrix data loads
  useEffect(() => {
    if (allMatrixData) {
      const loadSupportingData = async () => {
        try {
          const [deptResult, posResult, docResult] = await Promise.all([
            getAllDepartments(),
            getAllPositions(),
            getAllDocuments(),
          ]) as [DepartmentApiResponse<Department[]>, PositionApiResponse<Position[]>, DocumentApiResponse<Document[]>];

          if (deptResult?.data) {
            setDepartments(Array.isArray(deptResult.data) ? deptResult.data : []);
          }
          if (posResult?.data) {
            setAvailablePositions(Array.isArray(posResult.data) ? posResult.data : []);
          }
          if (docResult?.data) {
            setAvailableDocuments(Array.isArray(docResult.data) ? docResult.data : []);
          }
        } catch (err: any) {
          // Silent error handling
        }
      };
      loadSupportingData();
    }
  }, [allMatrixData]);

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
          // Kiểm tra xem data có khác với data cũ không
          const newDataString = JSON.stringify(result.data);
          const oldDataString = JSON.stringify(allMatrixData);
          
          if (newDataString !== oldDataString || retries === maxRetries - 1) {
            // Data đã thay đổi hoặc đã hết retry
            setAllMatrixData(result.data);
            setError("");
            console.log('✅ Matrix data updated successfully');
            break;
          } else {
            // Data chưa thay đổi, retry sau 1 giây
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

  const handleAddRow = async () => {
    if (isSubmitting) return;

    if (addRowMode === "single") {
      if (!selectedPositionId) return;

      setIsSubmitting(true);
      try {
        console.log('➕ Adding row, position ID:', selectedPositionId);
        const result = await addMatrixRow(Number(selectedPositionId));
        console.log('➕ Add row result:', result);

        if (result.status === 'error') {
          toast({
            title: "Lỗi",
            description: result.message || "Không thể thêm vị trí vào ma trận",
            variant: "destructive",
          });
          setIsSubmitting(false);
        } else {
          toast({
            title: "Thành công",
            description: "Đã thêm vị trí vào ma trận",
          });

          // Close dialog and reset
          setIsAddRowDialogOpen(false);
          setSelectedPositionId("");
          
          // Reload sau khi thành công
          console.log('🔄 Starting reload after add row...');
          await reloadMatrix();
          setIsSubmitting(false);
        }
      } catch (error: any) {
        console.error('❌ Add row error:', error);
        toast({
          title: "Lỗi",
          description: error.message || "Đã xảy ra lỗi",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } else {
      // Multiple mode
      if (selectedPositionIds.length === 0) return;

      setIsSubmitting(true);
      try {
        const positionIdsAsNumbers = selectedPositionIds.map(id => Number(id));
        const result = await addMatrixMultipleRows(positionIdsAsNumbers);

        if (result.status === 'error') {
          toast({
            title: "Lỗi",
            description: result.message || "Không thể thêm vị trí vào ma trận",
            variant: "destructive",
          });
          setIsSubmitting(false);
        } else {
          toast({
            title: "Thành công",
            description: `Đã thêm ${selectedPositionIds.length} vị trí vào ma trận`,
          });

          // Close dialog and reset
          setIsAddRowDialogOpen(false);
          setSelectedPositionIds([]);
          
          // Reload sau khi thành công
          await reloadMatrix();
          setIsSubmitting(false);
        }
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description: error.message || "Đã xảy ra lỗi",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    }
  };

  const handleAddColumn = async () => {
    if (isSubmitting) return;

    if (addColumnMode === "single") {
      if (!selectedDocumentId) return;

      setIsSubmitting(true);
      try {
        const result = await addMatrixColumn(Number(selectedDocumentId));

        if (result.status === 'error') {
          toast({
            title: "Lỗi",
            description: result.message || "Không thể thêm tài liệu vào ma trận",
            variant: "destructive",
          });
          setIsSubmitting(false);
        } else {
          toast({
            title: "Thành công",
            description: "Đã thêm tài liệu vào ma trận",
          });

          // Close dialog and reset
          setIsAddColumnDialogOpen(false);
          setSelectedDocumentId("");
          
          // Reload sau khi thành công
          await reloadMatrix();
          setIsSubmitting(false);
        }
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description: error.message || "Đã xảy ra lỗi",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    } else {
      // Multiple mode
      if (selectedDocumentIds.length === 0) return;

      setIsSubmitting(true);
      try {
        const documentIdsAsNumbers = selectedDocumentIds.map(id => Number(id));
        const result = await addMatrixMultipleColumns(documentIdsAsNumbers);

        if (result.status === 'error') {
          toast({
            title: "Lỗi",
            description: result.message || "Không thể thêm tài liệu vào ma trận",
            variant: "destructive",
          });
          setIsSubmitting(false);
        } else {
          toast({
            title: "Thành công",
            description: `Đã thêm ${selectedDocumentIds.length} tài liệu vào ma trận`,
          });

          // Close dialog and reset
          setIsAddColumnDialogOpen(false);
          setSelectedDocumentIds([]);
          
          // Reload sau khi thành công
          await reloadMatrix();
          setIsSubmitting(false);
        }
      } catch (error: any) {
        toast({
          title: "Lỗi",
          description: error.message || "Đã xảy ra lỗi",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteRow = async (positionId: number) => {
    if (!confirm("Bạn có chắc muốn xóa vị trí này khỏi ma trận?")) return;

    setIsSubmitting(true);
    try {
      const result = await deleteMatrixRow(positionId);

      if (result.status === 'error') {
        toast({
          title: "Lỗi",
          description: result.message || "Không thể xóa vị trí",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thành công",
          description: "Đã xóa vị trí khỏi ma trận",
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

  const handleDeleteColumn = async (documentId: number) => {
    if (!confirm("Bạn có chắc muốn xóa tài liệu này khỏi ma trận?")) return;

    setIsSubmitting(true);
    try {
      const result = await deleteMatrixColumn(documentId);

      if (result.status === 'error') {
        toast({
          title: "Lỗi",
          description: result.message || "Không thể xóa tài liệu",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thành công",
          description: "Đã xóa tài liệu khỏi ma trận",
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

  const handleDeleteAllRows = async () => {
    if (!confirm("Bạn có chắc muốn xóa TẤT CẢ vị trí khỏi ma trận?")) return;

    setIsSubmitting(true);
    try {
      const result = await deleteAllMatrixRows();

      if (result.status === 'error') {
        toast({
          title: "Lỗi",
          description: result.message || "Không thể xóa tất cả vị trí",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thành công",
          description: "Đã xóa tất cả vị trí khỏi ma trận",
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

  const handleDeleteAllColumns = async () => {
    if (!confirm("Bạn có chắc muốn xóa TẤT CẢ tài liệu khỏi ma trận?")) return;

    setIsSubmitting(true);
    try {
      const result = await deleteAllMatrixColumns();

      if (result.status === 'error') {
        toast({
          title: "Lỗi",
          description: result.message || "Không thể xóa tất cả tài liệu",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thành công",
          description: "Đã xóa tất cả tài liệu khỏi ma trận",
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

  const handleClearMatrix = async () => {
    if (!confirm("⚠️ BẠN CÓ CHẮC CHẮN muốn XÓA TOÀN BỘ MA TRẬN? Hành động này không thể hoàn tác!")) return;

    setIsSubmitting(true);
    try {
      const result = await clearMatrix();

      if (result.status === 'error') {
        toast({
          title: "Lỗi",
          description: result.message || "Không thể xóa ma trận",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thành công",
          description: "Đã xóa toàn bộ ma trận",
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
          <h1 className="text-4xl font-bold tracking-tight">Document Matrix Management</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Configure document requirements for training positions by department
          </p>
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
      ) : matrixData ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Filter and Actions Bar */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <Select
                    value={filterDepartmentId}
                    onValueChange={setFilterDepartmentId}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                        {dept.departmentName || dept.name || "Unknown"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Search Position Name */}
                  <Input
                    type="text"
                    placeholder="Search position name..."
                    value={searchPositionName}
                    onChange={(e) => setSearchPositionName(e.target.value)}
                    className="w-[250px]"
                  />
                </div>

                {/* More Options Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" disabled={isSubmitting}>
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={handleClearMatrix}
                      className="text-red-600 focus:text-red-600"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Matrix
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Matrix Grid Display */}
              <div className="border rounded-lg overflow-auto">
                  {(() => {
                    // Extract unique documents from all positions, chỉ lấy những document có document_id không null
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
                                <div className="flex items-center justify-between gap-2">
                                  <span className="flex-1">{docName}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteColumn(docId)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </th>
                            ))}
                            <th className="p-4 text-center font-semibold w-[100px] border-l-2 bg-muted/50">
                              {documentColumns.length > 0 ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="gap-2"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setIsAddColumnDialogOpen(true)}>
                                      <Plus className="h-4 w-4 mr-2" />
                                      Thêm tài liệu
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={handleDeleteAllColumns}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Xóa tất cả
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => setIsAddColumnDialogOpen(true)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                              <Dialog open={isAddColumnDialogOpen} onOpenChange={setIsAddColumnDialogOpen}>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Thêm Tài Liệu vào Ma Trận</DialogTitle>
                                    <DialogDescription>
                                      Chọn chế độ và tài liệu để thêm vào ma trận
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    {/* Mode Selection */}
                                    <div className="flex gap-2 p-1 bg-muted rounded-lg">
                                      <Button
                                        type="button"
                                        variant={addColumnMode === "single" ? "default" : "ghost"}
                                        className="flex-1"
                                        onClick={() => {
                                          setAddColumnMode("single");
                                          setSelectedDocumentIds([]);
                                        }}
                                      >
                                        Thêm 1
                                      </Button>
                                      <Button
                                        type="button"
                                        variant={addColumnMode === "multiple" ? "default" : "ghost"}
                                        className="flex-1"
                                        onClick={() => {
                                          setAddColumnMode("multiple");
                                          setSelectedDocumentId("");
                                        }}
                                      >
                                        Thêm nhiều
                                      </Button>
                                    </div>

                                    {/* Single Selection */}
                                    {addColumnMode === "single" && (
                                      <div className="space-y-2">
                                        <Label htmlFor="document">Tài Liệu</Label>
                                        <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId}>
                                          <SelectTrigger id="document">
                                            <SelectValue placeholder="Chọn tài liệu..." />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {availableDocuments
                                              .filter(doc => !documentColumns.some(([docId]) => docId === doc.id))
                                              .map((doc) => (
                                                <SelectItem key={doc.id} value={String(doc.id)}>
                                                  {doc.documentName || doc.name || "Unknown"}
                                                </SelectItem>
                                              ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}

                                    {/* Multiple Selection */}
                                    {addColumnMode === "multiple" && (
                                      <div className="space-y-2">
                                        <Label>Tài Liệu (Chọn nhiều)</Label>
                                        <div className="border rounded-lg p-4 max-h-[300px] overflow-y-auto space-y-2">
                                          {availableDocuments
                                            .filter(doc => !documentColumns.some(([docId]) => docId === doc.id))
                                            .map((doc) => (
                                              <div key={doc.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                  id={`doc-${doc.id}`}
                                                  checked={selectedDocumentIds.includes(String(doc.id))}
                                                  onCheckedChange={(checked) => {
                                                    if (checked) {
                                                      setSelectedDocumentIds([...selectedDocumentIds, String(doc.id)]);
                                                    } else {
                                                      setSelectedDocumentIds(selectedDocumentIds.filter(id => id !== String(doc.id)));
                                                    }
                                                  }}
                                                />
                                                <label
                                                  htmlFor={`doc-${doc.id}`}
                                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                  {doc.documentName || doc.name || "Unknown"}
                                                </label>
                                              </div>
                                            ))}
                                        </div>
                                        {selectedDocumentIds.length > 0 && (
                                          <p className="text-sm text-muted-foreground">
                                            Đã chọn: {selectedDocumentIds.length} tài liệu
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => {
                                      setIsAddColumnDialogOpen(false);
                                      setSelectedDocumentId("");
                                      setSelectedDocumentIds([]);
                                    }}>
                                      Hủy
                                    </Button>
                                    <Button
                                      onClick={handleAddColumn}
                                      disabled={
                                        isSubmitting ||
                                        (addColumnMode === "single" ? !selectedDocumentId : selectedDocumentIds.length === 0)
                                      }
                                    >
                                      {isSubmitting ? (
                                        <>
                                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                          Đang thêm...
                                        </>
                                      ) : (
                                        `Thêm${addColumnMode === "multiple" && selectedDocumentIds.length > 0 ? ` (${selectedDocumentIds.length})` : ""}`
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {matrixData
                            .filter((position: any) => position.positionId !== null)
                            .map((position: any) => {
                            // Create a map of document IDs to their data for this position
                            const positionDocuments = new Map();
                            position.documentCollumResponseList?.forEach((doc: any) => {
                              positionDocuments.set(doc.document_id, doc);
                            });

                            return (
                              <tr key={position.positionId} className="border-b hover:bg-muted/20">
                                <td className="p-4 font-medium sticky left-0 bg-background z-10 border-r-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <span>{position.positionName}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => handleDeleteRow(position.positionId)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                                {documentColumns.map(([docId, docName]) => {
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
                                <td className="p-4 text-center border-l-2 bg-muted/10">
                                  <div className="text-muted-foreground">—</div>
                                </td>
                              </tr>
                            );
                          })}
                          {/* Add Row */}
                          <tr className="border-t-2 bg-muted/10">
                            <td className="p-4 text-center border-r-2">
                              {matrixData.filter((p: any) => p.positionId !== null).length > 0 ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="gap-2"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => setIsAddRowDialogOpen(true)}>
                                      <Plus className="h-4 w-4 mr-2" />
                                      Thêm vị trí
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={handleDeleteAllRows}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Xóa tất cả
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-2"
                                  onClick={() => setIsAddRowDialogOpen(true)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                              <Dialog open={isAddRowDialogOpen} onOpenChange={setIsAddRowDialogOpen}>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Thêm Vị Trí vào Ma Trận</DialogTitle>
                                    <DialogDescription>
                                      Chọn chế độ và vị trí để thêm vào ma trận tài liệu
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    {/* Mode Selection */}
                                    <div className="flex gap-2 p-1 bg-muted rounded-lg">
                                      <Button
                                        type="button"
                                        variant={addRowMode === "single" ? "default" : "ghost"}
                                        className="flex-1"
                                        onClick={() => {
                                          setAddRowMode("single");
                                          setSelectedPositionIds([]);
                                        }}
                                      >
                                        Thêm 1
                                      </Button>
                                      <Button
                                        type="button"
                                        variant={addRowMode === "multiple" ? "default" : "ghost"}
                                        className="flex-1"
                                        onClick={() => {
                                          setAddRowMode("multiple");
                                          setSelectedPositionId("");
                                        }}
                                      >
                                        Thêm nhiều
                                      </Button>
                                    </div>

                                    {/* Single Selection */}
                                    {addRowMode === "single" && (
                                      <div className="space-y-2">
                                        <Label htmlFor="position">Vị Trí</Label>
                                        <Select value={selectedPositionId} onValueChange={setSelectedPositionId}>
                                          <SelectTrigger id="position">
                                            <SelectValue placeholder="Chọn vị trí..." />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {availablePositions
                                              .filter(pos => !matrixData?.some((m: any) => m.positionId === pos.id))
                                              .map((pos) => (
                                                <SelectItem key={pos.id} value={String(pos.id)}>
                                                  {pos.positionName || pos.name || "Unknown"}
                                                </SelectItem>
                                              ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}

                                    {/* Multiple Selection */}
                                    {addRowMode === "multiple" && (
                                      <div className="space-y-2">
                                        <Label>Vị Trí (Chọn nhiều)</Label>
                                        <div className="border rounded-lg p-4 max-h-[300px] overflow-y-auto space-y-2">
                                          {availablePositions
                                            .filter(pos => !matrixData?.some((m: any) => m.positionId === pos.id))
                                            .map((pos) => (
                                              <div key={pos.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                  id={`pos-${pos.id}`}
                                                  checked={selectedPositionIds.includes(String(pos.id))}
                                                  onCheckedChange={(checked) => {
                                                    if (checked) {
                                                      setSelectedPositionIds([...selectedPositionIds, String(pos.id)]);
                                                    } else {
                                                      setSelectedPositionIds(selectedPositionIds.filter(id => id !== String(pos.id)));
                                                    }
                                                  }}
                                                />
                                                <label
                                                  htmlFor={`pos-${pos.id}`}
                                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                  {pos.positionName || pos.name || "Unknown"}
                                                </label>
                                              </div>
                                            ))}
                                        </div>
                                        {selectedPositionIds.length > 0 && (
                                          <p className="text-sm text-muted-foreground">
                                            Đã chọn: {selectedPositionIds.length} vị trí
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => {
                                      setIsAddRowDialogOpen(false);
                                      setSelectedPositionId("");
                                      setSelectedPositionIds([]);
                                    }}>
                                      Hủy
                                    </Button>
                                    <Button
                                      onClick={handleAddRow}
                                      disabled={
                                        isSubmitting ||
                                        (addRowMode === "single" ? !selectedPositionId : selectedPositionIds.length === 0)
                                      }
                                    >
                                      {isSubmitting ? (
                                        <>
                                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                          Đang thêm...
                                        </>
                                      ) : (
                                        `Thêm${addRowMode === "multiple" && selectedPositionIds.length > 0 ? ` (${selectedPositionIds.length})` : ""}`
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </td>
                            {documentColumns.map(([docId]) => (
                              <td key={docId} className="p-4 text-center border-l">
                                <div className="text-muted-foreground">—</div>
                              </td>
                            ))}
                            <td className="p-4 text-center border-l-2 bg-muted/10">
                              <div className="text-muted-foreground">—</div>
                            </td>
                          </tr>
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
                  No matrix configuration found.<br />
                  Start by adding positions and documents to the matrix.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
