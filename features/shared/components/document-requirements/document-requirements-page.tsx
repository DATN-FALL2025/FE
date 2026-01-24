"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Building2,
  Briefcase,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMatrixFilterByPositionDepartment } from "@/lib/actions/matrix";
import { getAllPositions } from "@/lib/actions/position";
import { getAllDepartments } from "@/lib/actions/department";

interface DocumentItem {
  document_id: number;
  document_name: string;
  statusEnum: string;
  matrixId: number;
  documentRuleValueList: any[] | null;
  required: boolean;
}

interface MatrixData {
  positionId: number;
  positionName: string;
  statusEnum: string;
  matrixStatusEnum: string;
  startDate: string | null;
  endDate: string | null;
  reject_reason: string | null;
  departmentId: number;
  departmentName?: string;
  documentCollumResponseList: DocumentItem[];
}

interface Position {
  id: number;
  positionId?: number;
  positionName: string;
  departmentId?: number;
}

interface Department {
  id: number;
  departmentId?: number;
  departmentName: string;
}

interface SearchSuggestion {
  type: "position" | "department";
  id: number;
  name: string;
}

export function DocumentRequirementsPage() {
  const [loading, setLoading] = useState(false);
  const [matrixData, setMatrixData] = useState<MatrixData[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Load positions and departments on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [posRes, deptRes] = await Promise.all([
          getAllPositions(),
          getAllDepartments(),
        ]) as [any, any];

        console.log("📋 Positions:", posRes);
        console.log("📋 Departments:", deptRes);

        if (posRes.status === "200 OK" || posRes.status === "success") {
          setPositions(posRes.data || []);
        }
        if (deptRes.status === "200 OK" || deptRes.status === "success") {
          setDepartments(deptRes.data || []);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadInitialData();
  }, []);

  // Get department name by ID
  const getDepartmentName = (departmentId: number): string => {
    const dept = departments.find((d) => (d.id || d.departmentId) === departmentId);
    return dept?.departmentName || "";
  };

  // Handle position selection
  const handlePositionChange = async (value: string) => {
    setSelectedPosition(value);
    setSelectedDepartment(""); // Reset department when position is selected
    
    if (value) {
      await fetchMatrixData(parseInt(value), undefined, "position");
    } else {
      setMatrixData([]);
      setCurrentPage(1);
    }
  };

  // Handle department selection
  const handleDepartmentChange = async (value: string) => {
    setSelectedDepartment(value);
    setSelectedPosition(""); // Reset position when department is selected
    
    if (value) {
      await fetchMatrixData(undefined, parseInt(value), "department");
    } else {
      setMatrixData([]);
      setCurrentPage(1);
    }
  };

  // Fetch matrix data
  const fetchMatrixData = async (
    positionId?: number,
    departmentId?: number,
    filterType?: "position" | "department"
  ) => {
    try {
      setLoading(true);
      
      console.log("🔍 Fetching matrix data:", {
        positionId,
        departmentId,
        filterType,
      });

      const result = await getMatrixFilterByPositionDepartment(
        positionId,
        departmentId
      );

      console.log("📦 API Response:", result);

      if (result.status === "200 OK" || result.status === "success") {
        console.log("✅ Raw data:", result.data);
        
        // Bỏ filter Approve - cho phép xem tất cả
        let filteredData = result.data || [];

        console.log("✅ All data (no Approve filter):", filteredData);

        // Filter to show only the exact searched item
        if (filterType === "position" && positionId) {
          filteredData = filteredData.filter(
            (item: MatrixData) => item.positionId === positionId
          );
          console.log("✅ After position filter:", filteredData);
        } else if (filterType === "department" && departmentId) {
          filteredData = filteredData.filter(
            (item: MatrixData) => item.departmentId === departmentId
          );
          console.log("✅ After department filter:", filteredData);
        }

        console.log("✅ Final filtered data:", filteredData);
        setMatrixData(filteredData);
        setCurrentPage(1); // Reset to first page on new search
        
        if (filteredData.length === 0) {
          toast.info("Không tìm thấy yêu cầu hồ sơ nào");
        }
      } else {
        console.error("❌ API Error:", result.message);
        // Handle "No data found" message
        if (result.message === "No data found for the selected filter.") {
          toast.info("Không tìm thấy yêu cầu hồ sơ nào");
        } else {
          toast.error(result.message || "Không thể tải dữ liệu");
        }
        setMatrixData([]);
      }
    } catch (error) {
      console.error("❌ Exception:", error);
      toast.error("Lỗi khi tải dữ liệu");
      setMatrixData([]);
    } finally {
      setLoading(false);
    }
  };

  // Clear filter
  const handleClearFilter = () => {
    setSelectedPosition("");
    setSelectedDepartment("");
    setMatrixData([]);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(matrixData.length / ITEMS_PER_PAGE);
  const paginatedData = matrixData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Filter only required documents
  const getRequiredDocuments = (docs: DocumentItem[]): DocumentItem[] => {
    return docs?.filter((doc) => doc.required === true) || [];
  };

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Xem Yêu Cầu Hồ Sơ</h1>
        <p className="text-sm text-muted-foreground">
          Tìm kiếm và xem yêu cầu hồ sơ theo vị trí hoặc khoa
        </p>
      </div>

      {/* Filter Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Lọc yêu cầu hồ sơ</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Position Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Chọn vị trí
                </label>
                <Select value={selectedPosition} onValueChange={handlePositionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vị trí..." />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem 
                        key={position.id || position.positionId} 
                        value={(position.id || position.positionId || 0).toString()}
                      >
                        {position.positionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Chọn khoa
                </label>
                <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khoa..." />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem 
                        key={department.id || department.departmentId} 
                        value={(department.id || department.departmentId || 0).toString()}
                      >
                        {department.departmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selected Filter Display */}
            {(selectedPosition || selectedDepartment) && (
              <div className="flex items-center gap-2 pt-2">
                <span className="text-sm text-muted-foreground">Đang lọc theo:</span>
                {selectedPosition && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
                    <Briefcase className="w-3 h-3" />
                    {positions.find(p => (p.id || p.positionId)?.toString() === selectedPosition)?.positionName}
                  </span>
                )}
                {selectedDepartment && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm">
                    <Building2 className="w-3 h-3" />
                    {departments.find(d => (d.id || d.departmentId)?.toString() === selectedDepartment)?.departmentName}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilter}
                  className="h-7 px-2 text-xs"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-12 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : matrixData.length > 0 ? (
        <div className="space-y-4">
          {paginatedData.map((matrix) => {
            const requiredDocs = getRequiredDocuments(matrix.documentCollumResponseList);
            const departmentName = getDepartmentName(matrix.departmentId);
            
            return (
              <Card key={`${matrix.positionId}-${matrix.departmentId}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        {matrix.positionName}
                      </CardTitle>
                      {departmentName && (
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {departmentName}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Documents List - Only Required */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Danh sách tài liệu bắt buộc ({requiredDocs.length})
                    </h4>
                    {requiredDocs.length > 0 ? (
                      <div className="grid gap-2">
                        {requiredDocs.map((doc) => (
                          <div
                            key={doc.document_id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {doc.document_name}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Không có tài liệu bắt buộc
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (selectedPosition || selectedDepartment) ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Không tìm thấy kết quả</h3>
              <p className="text-sm text-muted-foreground">
                Không có yêu cầu hồ sơ nào cho bộ lọc này
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Filter className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Chọn vị trí hoặc khoa</h3>
              <p className="text-sm text-muted-foreground">
                Vui lòng chọn vị trí hoặc khoa để xem danh sách yêu cầu hồ sơ
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
