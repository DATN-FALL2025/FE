"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trophy,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Download,
  GraduationCap,
  Award,
  TrendingUp,
  AlertCircle,
  Info,
  User,
  Mail,
  Phone,
} from "lucide-react";

interface ApplicationResult {
  applicationId: number;
  status: "approved" | "rejected" | "pending" | "under_review";
  positionName: string;
  departmentName: string;
  submittedDate: Date;
  reviewedDate?: Date;
  finalDecisionDate?: Date;
  score?: number;
  rank?: number;
  totalApplicants?: number;
  evaluationNotes?: string;
  rejectionReason?: string;
  nextSteps?: string[];
}

// Mock data
const mockResult: ApplicationResult = {
  applicationId: 12345,
  status: "approved",
  positionName: "Nhân viên vận hành ô tô thông thường",
  departmentName: "Khoa Kỹ Thuật Hàng Không",
  submittedDate: new Date(2025, 9, 15),
  reviewedDate: new Date(2025, 10, 10),
  finalDecisionDate: new Date(2025, 10, 25),
  score: 85,
  rank: 12,
  totalApplicants: 150,
  evaluationNotes: "Hồ sơ đầy đủ, điểm số đạt yêu cầu. Ứng viên có kinh nghiệm tốt.",
  nextSteps: [
    "Nhận thông báo trúng tuyển qua email",
    "Hoàn tất thủ tục nhập học trước ngày 05/12/2025",
    "Nộp học phí học kỳ đầu tiên",
    "Tham dự buổi định hướng sinh viên mới",
  ],
};

export default function ResultPage() {
  const [result, setResult] = useState<ApplicationResult | null>(mockResult);
  const [loading, setLoading] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "approved":
        return {
          label: "Đã được chấp nhận",
          icon: <CheckCircle2 className="w-6 h-6" />,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "rejected":
        return {
          label: "Không đạt",
          icon: <XCircle className="w-6 h-6" />,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "under_review":
        return {
          label: "Đang xét duyệt",
          icon: <Clock className="w-6 h-6" />,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "pending":
        return {
          label: "Chờ xử lý",
          icon: <Clock className="w-6 h-6" />,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      default:
        return {
          label: "Không xác định",
          icon: <AlertCircle className="w-6 h-6" />,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Kết Quả Tuyển Sinh</h1>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Chưa có kết quả tuyển sinh. Vui lòng kiểm tra lại sau khi hồ sơ được xét duyệt.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const statusConfig = getStatusConfig(result.status);
  const scorePercentage = result.score ? (result.score / 100) * 100 : 0;

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-600" />
          Kết Quả Tuyển Sinh
        </h1>
        <p className="text-sm text-muted-foreground">
          Xem chi tiết kết quả xét tuyển và các bước tiếp theo
        </p>
      </div>

      {/* Status Banner */}
      <Card className={`border-2 ${statusConfig.borderColor}`}>
        <CardContent className={`p-6 ${statusConfig.bgColor}`}>
          <div className="flex items-center gap-4">
            <div className={`${statusConfig.color}`}>
              {statusConfig.icon}
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${statusConfig.color}`}>
                {statusConfig.label}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Mã đơn đăng ký: #{result.applicationId}
              </p>
            </div>
            {result.status === "approved" && (
              <Award className="w-16 h-16 text-yellow-600 opacity-20" />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Thông Tin Đơn Đăng Ký
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-sm text-muted-foreground">Vị trí đăng ký:</span>
                <span className="text-sm font-semibold text-right max-w-[200px]">
                  {result.positionName}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Khoa:</span>
                <span className="text-sm font-semibold">
                  {result.departmentName}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Ngày nộp:
                </span>
                <span className="text-sm font-semibold">
                  {result.submittedDate.toLocaleDateString("vi-VN")}
                </span>
              </div>
              {result.reviewedDate && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Ngày xét duyệt:
                    </span>
                    <span className="text-sm font-semibold">
                      {result.reviewedDate.toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </>
              )}
              {result.finalDecisionDate && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Ngày ra kết quả:
                    </span>
                    <span className="text-sm font-semibold">
                      {result.finalDecisionDate.toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Evaluation Score */}
        {result.score !== undefined && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Điểm Đánh Giá
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Circle */}
              <div className="flex justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - scorePercentage / 100)}`}
                      className={`${
                        result.score >= 80
                          ? "text-green-600"
                          : result.score >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                      } transition-all duration-1000`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">
                      {result.score}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / 100
                    </span>
                  </div>
                </div>
              </div>

              {/* Ranking */}
              {result.rank && result.totalApplicants && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Xếp hạng:</span>
                    <span className="font-bold">
                      {result.rank} / {result.totalApplicants}
                    </span>
                  </div>
                  <Progress
                    value={((result.totalApplicants - result.rank + 1) / result.totalApplicants) * 100}
                    className="h-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Evaluation Notes */}
      {result.evaluationNotes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Nhận Xét Đánh Giá
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground leading-relaxed">
              {result.evaluationNotes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Rejection Reason */}
      {result.status === "rejected" && result.rejectionReason && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Lý do không đạt:</strong> {result.rejectionReason}
          </AlertDescription>
        </Alert>
      )}

      {/* Next Steps */}
      {result.status === "approved" && result.nextSteps && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              Các Bước Tiếp Theo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {result.nextSteps.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-sm text-foreground pt-0.5">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Tải Giấy Báo Kết Quả
        </Button>
        {result.status === "approved" && (
          <Button variant="outline">
            <GraduationCap className="w-4 h-4 mr-2" />
            Xem Hướng Dẫn Nhập Học
          </Button>
        )}
      </div>
    </div>
  );
}
