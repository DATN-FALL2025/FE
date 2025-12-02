"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Building2,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// TODO: Replace with actual API calls
async function getMatrixOverviewStats() {
  // Mock data - replace with actual API call
  return {
    status: "success",
    data: {
      positions: {
        total: 50,
        pending: 10,
        inProgress: 25,
        completed: 15,
      },
      documents: {
        total: 30,
        assigned: 25,
        unassigned: 5,
      },
      matrix: {
        totalCells: 1500,
        requiredCells: 800,
        completionRate: 65.5,
      },
    },
  };
}

// TODO: Replace with actual API calls
async function getMatrixStatsByDepartment() {
  // Mock data - replace with actual API call
  return {
    status: "success",
    data: [
      {
        departmentId: 1,
        departmentName: "Ground Operations",
        departmentCode: "GO",
        positions: { total: 12, pending: 2, inProgress: 6, completed: 4 },
        documents: { totalAssigned: 8, averagePerPosition: 6.5 },
        completionRate: 70.5,
        status: "IN_PROGRESS",
      },
      {
        departmentId: 2,
        departmentName: "Cabin Crew",
        departmentCode: "CC",
        positions: { total: 15, pending: 0, inProgress: 5, completed: 10 },
        documents: { totalAssigned: 12, averagePerPosition: 8.2 },
        completionRate: 85.3,
        status: "IN_PROGRESS",
      },
      {
        departmentId: 3,
        departmentName: "Technical Aircraft Maintenance",
        departmentCode: "TAM",
        positions: { total: 18, pending: 5, inProgress: 10, completed: 3 },
        documents: { totalAssigned: 10, averagePerPosition: 5.5 },
        completionRate: 45.8,
        status: "PENDING",
      },
      {
        departmentId: 4,
        departmentName: "Flight Crew",
        departmentCode: "FC",
        positions: { total: 5, pending: 0, inProgress: 0, completed: 5 },
        documents: { totalAssigned: 15, averagePerPosition: 15.0 },
        completionRate: 100.0,
        status: "COMPLETED",
      },
    ],
  };
}

export default function TrainingDirectorDashboard() {
  const [overviewStats, setOverviewStats] = useState<any>(null);
  const [departmentStats, setDepartmentStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const [overview, departments] = await Promise.all([
          getMatrixOverviewStats(),
          getMatrixStatsByDepartment(),
        ]);

        if (overview.status === "success") {
          setOverviewStats(overview.data);
        }

        if (departments.status === "success") {
          setDepartmentStats(departments.data);
        }
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-500">Hoàn thành</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-blue-500">Đang xử lý</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Chờ xử lý</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDepartmentColor = (code: string) => {
    const colors: Record<string, string> = {
      GO: "bg-blue-500",
      CC: "bg-purple-500",
      TAM: "bg-orange-500",
      FC: "bg-red-500",
    };
    return colors[code] || "bg-gray-500";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Tổng quan về ma trận tài liệu và vị trí đào tạo
        </p>
      </div>

      {/* Overview Stats */}
      {overviewStats && (
        <>
          {/* Position Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng số vị trí
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overviewStats.positions.total}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tất cả vị trí trong hệ thống
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">
                  {overviewStats.positions.pending}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vị trí chưa được setup
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Đang xử lý
                </CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">
                  {overviewStats.positions.inProgress}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vị trí đang setup
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Hoàn thành
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">
                  {overviewStats.positions.completed}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Vị trí đã hoàn thành
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Document & Matrix Stats */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Thống kê tài liệu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Tổng số tài liệu
                  </span>
                  <span className="text-2xl font-bold">
                    {overviewStats.documents.total}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Đã phân bổ
                  </span>
                  <span className="text-lg font-semibold text-green-600">
                    {overviewStats.documents.assigned}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Chưa phân bổ
                  </span>
                  <span className="text-lg font-semibold text-orange-600">
                    {overviewStats.documents.unassigned}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tiến độ ma trận
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Tỷ lệ hoàn thành
                    </span>
                    <span className="text-2xl font-bold">
                      {overviewStats.matrix.completionRate.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={overviewStats.matrix.completionRate} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Tổng số ô ma trận
                  </span>
                  <span className="text-lg font-semibold">
                    {overviewStats.matrix.totalCells}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Ô bắt buộc
                  </span>
                  <span className="text-lg font-semibold text-blue-600">
                    {overviewStats.matrix.requiredCells}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Department Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Thống kê theo khoa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentStats.map((dept) => (
              <div
                key={dept.departmentId}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getDepartmentColor(
                        dept.departmentCode
                      )}`}
                    >
                      {dept.departmentCode}
                    </div>
                    <div>
                      <h3 className="font-semibold">{dept.departmentName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {dept.positions.total} vị trí •{" "}
                        {dept.documents.totalAssigned} tài liệu
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(dept.status)}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {dept.positions.pending}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Chờ xử lý
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {dept.positions.inProgress}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Đang xử lý
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {dept.positions.completed}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Hoàn thành
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Tiến độ hoàn thành
                    </span>
                    <span className="text-sm font-semibold">
                      {dept.completionRate.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={dept.completionRate} />
                </div>

                <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Trung bình tài liệu/vị trí
                  </span>
                  <span className="font-semibold">
                    {dept.documents.averagePerPosition.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
