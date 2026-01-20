"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  FileText,
  Building2,
  Briefcase,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<{
    type: "position" | "department" | null;
    id: number | null;
    name: string;
  }>({ type: null, id: null, name: "" });
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

        console.log(" Positions:", posRes);
        console.log(" Departments:", deptRes);

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

  // Search suggestions based on query
  const suggestions = useMemo<SearchSuggestion[]>(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchSuggestion[] = [];

    // Search positions - use id field
    positions.forEach((pos) => {
      if (pos.positionName?.toLowerCase().includes(query)) {
        results.push({
          type: "position",
          id: pos.id || pos.positionId || 0,
          name: pos.positionName,
        });
      }
    });

    // Search departments - use id field
    departments.forEach((dept) => {
      if (dept.departmentName?.toLowerCase().includes(query)) {
        results.push({
          type: "department",
          id: dept.id || dept.departmentId || 0,
          name: dept.departmentName,
        });
      }
    });

    return results.slice(0, 10);
  }, [searchQuery, positions, departments]);

  // Get department name by ID
  const getDepartmentName = (departmentId: number): string => {
    const dept = departments.find((d) => (d.id || d.departmentId) === departmentId);
    return dept?.departmentName || "";
  };

  // Handle suggestion selection
  const handleSelectSuggestion = async (suggestion: SearchSuggestion) => {
    setSelectedFilter({
      type: suggestion.type,
      id: suggestion.id,
      name: suggestion.name,
    });
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);

    // Fetch matrix data with filter type
    await fetchMatrixData(
      suggestion.type === "position" ? suggestion.id : undefined,
      suggestion.type === "department" ? suggestion.id : undefined,
      suggestion.type
    );
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
    setSelectedFilter({ type: null, id: null, name: "" });
    setSearchQuery("");
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

  // Get filter type label
  const getFilterTypeLabel = (type: string) => {
    switch (type) {
      case "position": return "Vị trí";
      case "department": return "Khoa";
      default: return "";
    }
  };

  // Get filter type icon
  const getFilterTypeIcon = (type: string) => {
    switch (type) {
      case "position": return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "department": return <Building2 className="w-4 h-4 text-green-500" />;
      default: return null;
    }
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

      {/* Search Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo vị trí hoặc khoa..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="pl-10 pr-4"
              />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.id}-${index}`}
                    className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-foreground"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {getFilterTypeIcon(suggestion.type)}
                    <span className="flex-1">{suggestion.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {getFilterTypeLabel(suggestion.type)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Filter */}
          {selectedFilter.type && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Đang lọc theo:</span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-sm">
                {getFilterTypeIcon(selectedFilter.type)}
                {selectedFilter.name}
                <button
                  onClick={handleClearFilter}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </span>
            </div>
          )}
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

                  {/* Deadline Info */}
                  {(matrix.startDate || matrix.endDate) && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {matrix.startDate && (
                          <span>Bắt đầu: {new Date(matrix.startDate).toLocaleDateString("vi-VN")}</span>
                        )}
                        {matrix.endDate && (
                          <span>Kết thúc: {new Date(matrix.endDate).toLocaleDateString("vi-VN")}</span>
                        )}
                      </div>
                    </div>
                  )}
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
      ) : selectedFilter.type ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Không tìm thấy kết quả</h3>
              <p className="text-sm text-muted-foreground">
                Không có yêu cầu hồ sơ nào cho {getFilterTypeLabel(selectedFilter.type).toLowerCase()} này
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Tìm kiếm yêu cầu hồ sơ</h3>
              <p className="text-sm text-muted-foreground">
                Nhập tên vị trí hoặc khoa để xem danh sách yêu cầu
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
