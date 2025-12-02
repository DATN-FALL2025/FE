"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Grid3x3,
  CheckCircle2,
  Circle,
  Info,
  FileText,
  Download,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { getAllPositions, getAllDocuments, getAllDepartments } from "@/lib/actions";

interface MatrixCell {
  required: boolean;
  optional: boolean;
}

interface MatrixData {
  positions: { positionId: number; positionName: string; department: string }[];
  documents: { documentId: number; documentName: string; documentDescription: string }[];
  matrix: { [positionId: number]: { [documentId: number]: MatrixCell } };
}

export default function MatrixPage() {
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [departments, setDepartments] = useState<any[]>([]);
  const [matrixData, setMatrixData] = useState<MatrixData | null>(null);

  useEffect(() => {
    fetchMatrixData();
  }, []);

  const fetchMatrixData = async () => {
    try {
      setLoading(true);

      // Fetch departments, positions, and documents
      const [deptRes, posRes, docRes] = await Promise.all([
        getAllDepartments(),
        getAllPositions(),
        getAllDocuments(),
      ]);

      if (deptRes.status === "success" && deptRes.data) {
        setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
      }

      // Create mock matrix data
      // In production, this would come from a matrix API endpoint
      if (posRes.status === "success" && posRes.data && docRes.status === "success" && docRes.data) {
        const positions = Array.isArray(posRes.data) ? posRes.data : [];
        const documents = Array.isArray(docRes.data) ? docRes.data : [];

        // Mock matrix with random requirements
        const matrix: { [positionId: number]: { [documentId: number]: MatrixCell } } = {};

        positions.forEach((pos: any) => {
          matrix[pos.positionId] = {};
          documents.forEach((doc: any, index: number) => {
            // Randomly assign required/optional status for demo
            const isRequired = index % 2 === 0;
            const isOptional = index % 3 === 0 && !isRequired;
            matrix[pos.positionId][doc.documentId] = {
              required: isRequired,
              optional: isOptional,
            };
          });
        });

        setMatrixData({
          positions: positions.map((p: any) => ({
            positionId: p.positionId,
            positionName: p.positionName,
            department: p.department?.departmentName || "N/A",
          })),
          documents: documents.map((d: any) => ({
            documentId: d.documentId,
            documentName: d.documentName,
            documentDescription: d.documentDescription,
          })),
          matrix,
        });
      }
    } catch (error) {
      console.error("Error fetching matrix data:", error);
      toast.error("Không thể tải dữ liệu ma trận tài liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleExportMatrix = () => {
    toast.success("Đang xuất ma trận tài liệu...");
    // TODO: Implement export functionality
  };

  const filteredPositions = matrixData?.positions.filter((pos) => {
    if (selectedDepartment === "all") return true;
    return pos.department === selectedDepartment;
  }) || [];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  if (!matrixData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Ma Trận Tài Liệu</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Không có dữ liệu ma trận</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Grid3x3 className="w-8 h-8" />
            Ma Trận Tài Liệu
          </h1>
          <p className="text-sm text-muted-foreground">
            Xem yêu cầu tài liệu theo từng vị trí đăng ký
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExportMatrix}
        >
          <Download className="w-4 h-4 mr-2" />
          Xuất Ma Trận
        </Button>
      </div>

      {/* Info Alert */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                Hướng dẫn đọc ma trận
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Tài liệu bắt buộc</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-blue-600" />
                  <span>Tài liệu tùy chọn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                  <span>Không yêu cầu</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Bộ Lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium whitespace-nowrap">
              Khoa/Phòng:
            </label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Chọn khoa/phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.departmentId} value={dept.departmentName}>
                    {dept.departmentName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline">
              {filteredPositions.length} vị trí
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Ma Trận Yêu Cầu Tài Liệu
          </CardTitle>
          <CardDescription>
            Danh sách tài liệu yêu cầu cho từng vị trí đăng ký
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold sticky left-0 bg-background z-10 min-w-[200px]">
                    Vị Trí / Tài Liệu
                  </TableHead>
                  {matrixData.documents.map((doc) => (
                    <TableHead key={doc.documentId} className="text-center min-w-[150px]">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-semibold text-xs">{doc.documentName}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPositions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={matrixData.documents.length + 1} className="text-center py-8">
                      <p className="text-muted-foreground">
                        Không có vị trí nào phù hợp với bộ lọc
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPositions.map((position) => (
                    <TableRow key={position.positionId}>
                      <TableCell className="font-medium sticky left-0 bg-background z-10">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold">{position.positionName}</span>
                          <Badge variant="outline" className="w-fit text-xs">
                            {position.department}
                          </Badge>
                        </div>
                      </TableCell>
                      {matrixData.documents.map((doc) => {
                        const cell = matrixData.matrix[position.positionId]?.[doc.documentId];
                        return (
                          <TableCell key={doc.documentId} className="text-center">
                            {cell?.required ? (
                              <div className="flex justify-center">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                              </div>
                            ) : cell?.optional ? (
                              <div className="flex justify-center">
                                <Circle className="w-6 h-6 text-blue-600" />
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <div className="w-6 h-6 border-2 border-gray-300 rounded" />
                              </div>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chú Thích</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
              <div>
                <p className="font-semibold text-sm text-green-900">Bắt buộc</p>
                <p className="text-xs text-green-700">
                  Tài liệu bắt buộc phải nộp
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Circle className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <p className="font-semibold text-sm text-blue-900">Tùy chọn</p>
                <p className="text-xs text-blue-700">
                  Tài liệu không bắt buộc
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-6 h-6 border-2 border-gray-400 rounded shrink-0" />
              <div>
                <p className="font-semibold text-sm text-gray-900">Không yêu cầu</p>
                <p className="text-xs text-gray-700">
                  Tài liệu không cần thiết
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
