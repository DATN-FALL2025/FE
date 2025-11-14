"use client";

import { useStudentData } from "@/features/trainees/hooks/use-student-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Users,
  Download,
  Upload,
  Calendar,
  TrendingUp
} from "lucide-react";

export default function StudentDashboardPage() {
  const { student, documents, progress, loading } = useStudentData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[500px]" />
          <Skeleton className="h-[500px]" />
        </div>
      </div>
    );
  }

  if (!student || !progress) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Không thể tải dữ liệu sinh viên</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats
  const totalDocs = progress.totalDocuments;
  const approvedDocs = progress.approvedDocuments;
  const pendingDocs = progress.pendingDocuments;
  const completionPercent = Math.round((approvedDocs / totalDocs) * 100);

  // Get document list with statuses
  const documentList = documents.slice(0, 4);

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Hồ Sơ
        </h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi tiến độ và trạng thái hồ sơ của bạn
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Tổng tài liệu
                </p>
                <p className="text-4xl font-bold text-blue-600">{totalDocs}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approved */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Đã duyệt
                </p>
                <p className="text-4xl font-bold text-green-600">{approvedDocs}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Đang xử lý
                </p>
                <p className="text-4xl font-bold text-orange-600">{pendingDocs}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Position */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Vị trí đăng ký
                </p>
                <p className="text-sm font-semibold text-blue-600 leading-tight">
                  Nhân viên vận hành ô tô thông thường
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-2">Tiến Độ Tổng Quan</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Mức độ hoàn thành hồ sơ
            </p>

            {/* Circular Progress */}
            <div className="flex justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 80}`}
                    strokeDashoffset={`${2 * Math.PI * 80 * (1 - completionPercent / 100)}`}
                    className="text-blue-600 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-blue-600">
                    {completionPercent}%
                  </span>
                  <span className="text-sm text-muted-foreground mt-1">
                    Hoàn thành
                  </span>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Trạng thái hồ sơ</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Đang xử lý
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ngày nộp</span>
                <span className="text-sm font-semibold">
                  {progress.deadline.toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document List */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-2">Tài Liệu Hồ Sơ</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Danh sách tài liệu đã nộp và trạng thái
            </p>

            {/* Document Items */}
            <div className="space-y-3 mb-6">
              {documentList.map((doc, index) => {
                const isApproved = doc.status === "approved";
                const isPending = doc.status === "pending_review" || doc.status === "submitted";
                const isNotSubmitted = !isApproved && !isPending;

                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isApproved
                        ? 'bg-green-50'
                        : isPending
                        ? 'bg-yellow-50'
                        : 'bg-blue-50'
                    }`}>
                      {isApproved ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : isPending ? (
                        <FileText className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <Upload className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Nộp ngày: {doc.uploadedAt?.toLocaleDateString("vi-VN") || "N/A"}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        isApproved
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : isPending
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }
                    >
                      {isApproved ? 'Đã duyệt' : isPending ? 'Đang xử lý' : 'Chưa hoàn thành'}
                    </Badge>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Tiến độ hoàn thành</span>
                <span className="font-bold">{completionPercent}%</span>
              </div>
              <Progress
                value={completionPercent}
                className="h-2.5 [&>div]:bg-blue-600"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

