"use client";

import { useStudentData } from "@/features/trainees/hooks/use-student-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock,
  Users,
  Upload,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function StudentDashboardPage() {
  const { student, documents, progress, loading } = useStudentData();

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-9 w-80 rounded-lg" />
          <Skeleton className="h-5 w-96 rounded-lg" />
        </div>
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[450px] rounded-2xl" />
          <Skeleton className="h-[450px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!student || !progress) {
    return (
      <Card className="border-0 shadow-lg rounded-2xl bg-white dark:bg-slate-900">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Không thể tải dữ liệu học viên</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate stats
  const totalDocs = progress.totalDocuments;
  const approvedDocs = progress.approvedDocuments;
  const pendingDocs = progress.pendingDocuments;
  const completionPercent = totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0;

  // Get document list with statuses
  const documentList = documents.slice(0, 4);

  // Stats data
  const statsData = [
    {
      title: "Tổng tài liệu",
      value: totalDocs,
      icon: FileText,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Đã duyệt",
      value: approvedDocs,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Đang xử lý",
      value: pendingDocs,
      icon: Clock,
      gradient: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/50",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Tiến độ",
      value: `${completionPercent}%`,
      icon: TrendingUp,
      gradient: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50 dark:bg-violet-950/50",
      textColor: "text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Xin chào, {student?.fullName?.split(' ').pop() || 'Học viên'}
          </h1>
          <Sparkles className="w-6 h-6 text-amber-500" />
        </div>
        <p className="text-slate-500 dark:text-slate-400">
          Theo dõi tiến độ và trạng thái hồ sơ của bạn
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="border-0 shadow-sm hover:shadow-md bg-white dark:bg-slate-900 rounded-2xl cursor-pointer transition-all duration-200 group"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </p>
                  <p className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tiến Độ Hồ Sơ</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Mức độ hoàn thành hồ sơ của bạn
                </p>
              </div>
              <Badge
                className={`${
                  completionPercent >= 100
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    : completionPercent >= 50
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                } border-0 font-medium px-3 py-1`}
              >
                {completionPercent >= 100 ? 'Hoàn thành' : completionPercent >= 50 ? 'Đang xử lý' : 'Mới bắt đầu'}
              </Badge>
            </div>

            {/* Circular Progress */}
            <div className="flex justify-center py-6">
              <div className="relative w-44 h-44">
                <svg className="w-44 h-44 transform -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="72"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r="72"
                    stroke="url(#progressGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 72}`}
                    strokeDashoffset={`${2 * Math.PI * 72 * (1 - completionPercent / 100)}`}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    {completionPercent}%
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Hoàn thành
                  </span>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Vị trí đăng ký</span>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Học viên</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Hạn nộp hồ sơ</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {progress.deadline.toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document List */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Tài Liệu Gần Đây</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Danh sách tài liệu và trạng thái
                </p>
              </div>
              <Link
                href="/trainees/documents"
                className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors duration-200"
              >
                Xem tất cả
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Document Items */}
            <div className="space-y-3">
              {documentList.length > 0 ? (
                documentList.map((doc) => {
                  const isApproved = doc.status === "approved";
                  const isPending = doc.status === "pending_review" || doc.status === "submitted";

                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors duration-200"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isApproved
                          ? 'bg-emerald-100 dark:bg-emerald-950/50'
                          : isPending
                          ? 'bg-amber-100 dark:bg-amber-950/50'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}>
                        {isApproved ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : isPending ? (
                          <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <Upload className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {doc.uploadedAt?.toLocaleDateString("vi-VN") || "Chưa nộp"}
                        </p>
                      </div>
                      <Badge
                        className={`shrink-0 border-0 font-medium ${
                          isApproved
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : isPending
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {isApproved ? 'Đã duyệt' : isPending ? 'Đang xử lý' : 'Chưa nộp'}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Chưa có tài liệu nào</p>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-slate-500 dark:text-slate-400">Tiến độ hoàn thành</span>
                <span className="font-semibold text-slate-900 dark:text-white">{completionPercent}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-1000"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

