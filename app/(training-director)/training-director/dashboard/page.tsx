"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { getMatrixDashboard } from "@/lib/actions/matrix";
import MatrixTimeDisplay from "@/components/shared/matrix-time-display";

export default function TrainingDirectorDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const result = await getMatrixDashboard();
        
        if (result.status === 'success' && result.data) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Tổng quan về ma trận tài liệu và vị trí đào tạo
          </p>
        </div>
      </div>

      {/* Matrix Time Display - Batch Information */}
      <MatrixTimeDisplay />

      {/* Dashboard Statistics - Using Real API Data */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Approved Count */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Đã Phê Duyệt</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">
                    {dashboardData.approvedCount || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rejected Count */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Đã Từ Chối</p>
                  <p className="text-3xl font-bold text-red-900 mt-2">
                    {dashboardData.rejectedCount || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Drafted Count */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Chờ Duyệt</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">
                    {dashboardData.draftedCount || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* In Progress Count */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Đang Xử Lý</p>
                  <p className="text-3xl font-bold text-yellow-900 mt-2">
                    {dashboardData.inProgressCount || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval Progress Percentage */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Tiến Độ Duyệt</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">
                    {dashboardData.approvalProgressPercentage?.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
                  <div className="text-lg font-bold text-purple-700">
                    {Math.round(dashboardData.approvalProgressPercentage || 0)}%
                  </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-3 w-full bg-purple-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${dashboardData.approvalProgressPercentage || 0}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
