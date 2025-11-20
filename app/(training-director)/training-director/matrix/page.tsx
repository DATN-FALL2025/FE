"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Upload,
  AlertCircle,
  Loader2,
  Filter,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getAllMatrix,
  getMatrixByDepartment,
  addMatrixRow,
  addMatrixColumn,
  deleteMatrixRow,
  deleteMatrixColumn
} from "@/lib/actions/matrix";
import { getAllDepartments } from "@/lib/actions/department";
import { getAllPositions } from "@/lib/actions/position";
import { getAllDocuments } from "@/lib/actions/document";
import { useToast } from "@/hooks/use-toast";

export default function TrainingDirectorMatrixPage() {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<any[]>([]);
  const [matrixData, setMatrixData] = useState<any>(null);
  const [filterDepartmentId, setFilterDepartmentId] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isAddRowDialogOpen, setIsAddRowDialogOpen] = useState(false);
  const [availablePositions, setAvailablePositions] = useState<any[]>([]);
  const [selectedPositionId, setSelectedPositionId] = useState<string>("");
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [availableDocuments, setAvailableDocuments] = useState<any[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load departments and positions on mount
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const deptResult: any = await getAllDepartments();
        if (deptResult && deptResult.data) {
          const deptArray = Array.isArray(deptResult.data) ? deptResult.data : [];
          setDepartments(deptArray);
        }
      } catch (err: any) {
        console.error('Failed to load departments:', err);
      }
    };

    const loadPositions = async () => {
      try {
        const posResult: any = await getAllPositions();
        if (posResult && posResult.data) {
          const posArray = Array.isArray(posResult.data) ? posResult.data : [];
          setAvailablePositions(posArray);
        }
      } catch (err: any) {
        console.error('Failed to load positions:', err);
      }
    };

    const loadDocuments = async () => {
      try {
        const docResult: any = await getAllDocuments();
        if (docResult && docResult.data) {
          const docArray = Array.isArray(docResult.data) ? docResult.data : [];
          setAvailableDocuments(docArray);
        }
      } catch (err: any) {
        console.error('Failed to load documents:', err);
      }
    };

    loadDepartments();
    loadPositions();
    loadDocuments();
  }, []);

  // Load matrix data on mount (all data)
  useEffect(() => {
    const loadAllMatrix = async () => {
      setIsLoading(true);
      setError("");

      try {
        console.log('🎯 Loading all matrix data');
        const matrixResult: any = await getAllMatrix();
        console.log('📊 Matrix result:', matrixResult);

        if (matrixResult.status === 'error') {
          console.error('❌ Error from API:', matrixResult.message);
          setError(matrixResult.message);
          setMatrixData(null);
        } else if (matrixResult.data === null || matrixResult.data === undefined) {
          console.warn('⚠️ No data returned from API');
          setError('No matrix data found');
          setMatrixData(null);
        } else {
          console.log('✅ Matrix data loaded successfully:', matrixResult.data);
          setMatrixData(matrixResult.data);
        }
      } catch (err: any) {
        console.error('💥 Exception during load:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllMatrix();
  }, []);

  // Load matrix data when filter changes
  useEffect(() => {
    if (filterDepartmentId === "all") {
      // Load all matrix data
      const loadAllMatrix = async () => {
        setIsFilterLoading(true);
        setError("");

        try {
          console.log('🔄 Filtering: Loading all matrix data');
          const matrixResult: any = await getAllMatrix();
          console.log('📊 All matrix result:', matrixResult);

          if (matrixResult.status === 'error') {
            setError(matrixResult.message);
            setMatrixData(null);
          } else {
            setMatrixData(matrixResult.data);
          }
        } catch (err: any) {
          setError(err.message || 'Failed to load matrix data');
        } finally {
          setIsFilterLoading(false);
        }
      };

      loadAllMatrix();
    } else {
      // Load matrix data for specific department
      const loadDepartmentMatrix = async () => {
        setIsFilterLoading(true);
        setError("");

        try {
          const deptId = Number(filterDepartmentId);
          console.log('🔄 Filtering: Loading matrix for department ID:', deptId);

          const matrixResult: any = await getMatrixByDepartment(deptId);
          console.log('📊 Department matrix result:', matrixResult);

          if (matrixResult.status === 'error') {
            setError(matrixResult.message);
            setMatrixData(null);
          } else if (matrixResult.data === null || matrixResult.data === undefined) {
            setError(`No matrix data found for department ${deptId}`);
            setMatrixData(null);
          } else {
            setMatrixData(matrixResult.data);
          }
        } catch (err: any) {
          setError(err.message || 'Failed to load matrix data');
        } finally {
          setIsFilterLoading(false);
        }
      };

      loadDepartmentMatrix();
    }
  }, [filterDepartmentId]);

  const reloadMatrix = async () => {
    if (filterDepartmentId === "all") {
      const result: any = await getAllMatrix();
      if (result.status !== 'error') {
        setMatrixData(result.data);
      }
    } else {
      const result: any = await getMatrixByDepartment(Number(filterDepartmentId));
      if (result.status !== 'error') {
        setMatrixData(result.data);
      }
    }
  };

  const handleAddRow = async () => {
    if (!selectedPositionId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await addMatrixRow(Number(selectedPositionId));

      if (result.status === 'error') {
        toast({
          title: "Lỗi",
          description: result.message || "Không thể thêm vị trí vào ma trận",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thành công",
          description: "Đã thêm vị trí vào ma trận",
        });

        // Reload matrix data
        await reloadMatrix();

        // Close dialog and reset
        setIsAddRowDialogOpen(false);
        setSelectedPositionId("");
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

  const handleAddColumn = async () => {
    if (!selectedDocumentId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await addMatrixColumn(Number(selectedDocumentId));

      if (result.status === 'error') {
        toast({
          title: "Lỗi",
          description: result.message || "Không thể thêm tài liệu vào ma trận",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Thành công",
          description: "Đã thêm tài liệu vào ma trận",
        });

        // Reload matrix data
        await reloadMatrix();

        // Close dialog and reset
        setIsAddColumnDialogOpen(false);
        setSelectedDocumentId("");
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

  const handleDeleteRow = async (positionId: number) => {
    if (!confirm("Bạn có chắc muốn xóa vị trí này khỏi ma trận?")) return;

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

        // Reload matrix data
        await reloadMatrix();
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi",
        variant: "destructive",
      });
    }
  };

  const handleDeleteColumn = async (documentId: number) => {
    if (!confirm("Bạn có chắc muốn xóa tài liệu này khỏi ma trận?")) return;

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

        // Reload matrix data
        await reloadMatrix();
      }
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Đã xảy ra lỗi",
        variant: "destructive",
      });
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
      ) : matrixData ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Filter and Actions Bar */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <Select
                    value={filterDepartmentId}
                    onValueChange={setFilterDepartmentId}
                    disabled={isFilterLoading}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.departmentCode || dept.code || "N/A"} - {dept.departmentName || dept.name || "Unknown"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isFilterLoading && (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  )}
                </div>
              </div>

              {/* Matrix Grid Display */}
              {isFilterLoading ? (
                <div className="border rounded-lg overflow-auto">
                  <div className="p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading matrix data...</p>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg overflow-auto">
                  {(() => {
                    // Extract unique documents from all positions
                    const allDocuments = new Map();
                    matrixData.forEach((position: any) => {
                      position.documentCollumResponseList?.forEach((doc: any) => {
                        if (!allDocuments.has(doc.document_id)) {
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
                              <Dialog open={isAddColumnDialogOpen} onOpenChange={setIsAddColumnDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Thêm Tài Liệu vào Ma Trận</DialogTitle>
                                    <DialogDescription>
                                      Chọn tài liệu để thêm vào ma trận
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
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
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddColumnDialogOpen(false)}>
                                      Hủy
                                    </Button>
                                    <Button onClick={handleAddColumn} disabled={!selectedDocumentId}>
                                      Thêm
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {matrixData.map((position: any) => {
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
                                {documentColumns.map(([docId]) => {
                                  const doc = positionDocuments.get(docId);
                                  return (
                                    <td key={docId} className="p-4 text-center border-l">
                                      {doc ? (
                                        <div className="flex items-center justify-center gap-2">
                                          <Checkbox
                                            checked={doc.required}
                                            className="h-5 w-5"
                                          />
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
                              <Dialog open={isAddRowDialogOpen} onOpenChange={setIsAddRowDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-2"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Thêm Vị Trí vào Ma Trận</DialogTitle>
                                    <DialogDescription>
                                      Chọn vị trí để thêm vào ma trận tài liệu
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
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
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddRowDialogOpen(false)}>
                                      Hủy
                                    </Button>
                                    <Button onClick={handleAddRow} disabled={!selectedPositionId}>
                                      Thêm
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
              )}
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
