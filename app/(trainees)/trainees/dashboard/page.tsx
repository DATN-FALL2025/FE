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
  Upload,
  Calendar,
  TrendingUp,
  XCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

export default function StudentDashboardPage() {
  const { student, documents, progress, loading, applicationDetail, refreshData } = useStudentData();

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
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">Không thể tải dữ liệu sinh viên</p>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats from real data
  const totalDocs = progress.totalDocuments;
  const approvedDocs = progress.approvedDocuments;
  const pendingDocs = progress.pendingDocuments;
  const rejectedDocs = progress.rejectedDocuments;
  const notSubmittedDocs = totalDocs - (approvedDocs + pendingDocs + rejectedDocs);
  const completionPercent = totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0;

  // Get document list (show first 6)
  const documentList = documents.slice(0, 6);

  // Get application status
  const getApplicationStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      "Pending": { label: "Đang chờ xử lý", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
      "InProgress": { label: "Đang xử lý", className: "bg-blue-50 text-blue-700 border-blue-200" },
      "Submitted": { label: "Đã nộp", className: "bg-blue-50 text-blue-700 border-blue-200" },
      "Approve": { label: "Đã duyệt", className: "bg-green-50 text-green-700 border-green-200" },
      "Approved": { label: "Đã duyệt", className: "bg-green-50 text-green-700 border-green-200" },
      "Reject": { label: "Từ chối", className: "bg-red-50 text-red-700 border-red-200" },
      "Rejected": { label: "Từ chối", className: "bg-red-50 text-red-700 border-red-200" },
      "Complete": { label: "Hoàn thành", className: "bg-green-50 text-green-700 border-green-200" },
      "Completed": { label: "Hoàn thành", className: "bg-green-50 text-green-700 border-green-200" },
    };
    const statusInfo = statusMap[status] || { label: status || "Chưa có thông tin", className: "bg-gray-50 text-gray-600 border-gray-200" };
    return (
      <Badge variant="outline" className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Hồ Sơ
          </h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi tiến độ và trạng thái hồ sơ của bạn
          </p>
        </div>
        <Button onClick={refreshData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
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
                <CheckCircle2 className="w-6 h-6 text-green-600" />
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
                  Chờ duyệt
                </p>
                <p className="text-4xl font-bold text-orange-600">{pendingDocs}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Position */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground">
                  Vị trí đăng ký
                </p>
                <p className="text-sm font-semibold text-blue-600 leading-tight truncate" title={applicationDetail?.positionName || ""}>
                  {applicationDetail?.positionName || "Chưa có thông tin"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
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
                {getApplicationStatusBadge(applicationDetail?.traineeApplicationStatus || "Pending")}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Khoa</span>
                <span className="text-sm font-semibold">
                  {applicationDetail?.departmentName || "Chưa có thông tin"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ngày tạo đơn</span>
                <span className="text-sm font-semibold">
                  {applicationDetail?.traineeApplicationCreateAt 
                    ? new Date(applicationDetail.traineeApplicationCreateAt).toLocaleDateString("vi-VN")
                    : "Chưa có thông tin"}
                </span>
              </div>
              
              {/* Document Status Summary */}
              <div className="pt-3 border-t space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Chi tiết trạng thái</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Đã duyệt: {approvedDocs}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span>Chờ duyệt: {pendingDocs}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Từ chối: {rejectedDocs}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span>Chưa nộp: {notSubmittedDocs}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document List */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">Tài Liệu Hồ Sơ</h3>
              <Link href="/trainees/documents">
                <Button variant="ghost" size="sm">
                  Xem tất cả
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Danh sách tài liệu và trạng thái
            </p>

            {/* Document Items */}
            <div className="space-y-3 mb-6 max-h-[320px] overflow-y-auto">
              {documentList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có tài liệu nào</p>
                </div>
              ) : (
                documentList.map((doc) => {
                  const isApproved = doc.status === "approved";
                  const isPending = doc.status === "pending_review" || doc.status === "submitted";
                  const isRejected = doc.status === "rejected";
                  const isNotSubmitted = doc.status === "not_submitted";

                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isApproved
                          ? 'bg-green-50'
                          : isPending
                          ? 'bg-yellow-50'
                          : isRejected
                          ? 'bg-red-50'
                          : 'bg-gray-50'
                      }`}>
                        {isApproved ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : isPending ? (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        ) : isRejected ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <Upload className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" title={doc.name}>{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {isNotSubmitted ? "Chưa nộp" : doc.uploadedAt?.toLocaleDateString("vi-VN") || "N/A"}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          isApproved
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : isPending
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : isRejected
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                        }
                      >
                        {isApproved ? 'Đã duyệt' : isPending ? 'Chờ duyệt' : isRejected ? 'Từ chối' : 'Chưa nộp'}
                      </Badge>
                    </div>
                  );
                })
              )}
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
              
              {/* Action Button */}
              {notSubmittedDocs > 0 && (
                <Link href="/trainees/documents" className="block mt-4">
                  <Button className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Nộp tài liệu ({notSubmittedDocs} còn lại)
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
