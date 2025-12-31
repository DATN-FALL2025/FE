"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileCheck,
  Users,
  BookOpen,
  Plus,
  Settings,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function HeadOfDepartmentDashboardPage() {
  const stats = [
    {
      label: "Chương trình đào tạo",
      value: 5,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+1 tháng này",
    },
    {
      label: "Ma trận tài liệu",
      value: 12,
      icon: FileCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "3 chờ phê duyệt",
    },
    {
      label: "Tổng số học viên",
      value: 342,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+15 tuần này",
    },
    {
      label: "Tỷ lệ tuân thủ",
      value: "96%",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "+2% so với tháng trước",
    },
  ];

  const pendingMatrices = [
    {
      id: 1,
      program: "Đào tạo phi công - CPL",
      code: "PT-CPL-2024",
      documents: 15,
      createdBy: "Nhân viên học vụ",
      status: "pending_review",
    },
    {
      id: 2,
      program: "Tiếp viên hàng không nâng cao",
      code: "CC-ADV-2024",
      documents: 12,
      createdBy: "Nhân viên học vụ",
      status: "pending_review",
    },
    {
      id: 3,
      program: "Bảo dưỡng máy bay",
      code: "AM-BASIC-2024",
      documents: 18,
      createdBy: "Nhân viên học vụ",
      status: "pending_review",
    },
  ];

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Bảng điều khiển khoa</h1>
          <p className="text-muted-foreground mt-2 text-base">
            Quản lý yêu cầu chương trình đào tạo và ma trận tài liệu
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          Cấu hình ma trận mới
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-4 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
        {/* Left Column - Pending Approvals */}
        <div className="lg:col-span-3 space-y-6 min-w-0">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Ma trận chờ phê duyệt</CardTitle>
                  <CardDescription className="text-base mt-1.5">
                    Ma trận tài liệu đang chờ bạn phê duyệt
                  </CardDescription>
                </div>
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white h-9 px-4">
                  {pendingMatrices.length} Chờ duyệt
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingMatrices.map((matrix) => (
                <div
                  key={matrix.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold">{matrix.program}</p>
                        <p className="text-sm text-muted-foreground font-mono">{matrix.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{matrix.documents} tài liệu yêu cầu</span>
                      <span>•</span>
                      <span>Tạo bởi {matrix.createdBy}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Xem xét
                    </Button>
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      Phê duyệt
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <FileCheck className="w-5 h-5" />
                Xem tất cả ma trận
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <BookOpen className="w-5 h-5" />
                Chương trình đào tạo
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <Users className="w-5 h-5" />
                Tổng quan học viên
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3 h-12">
                <LayoutDashboard className="w-5 h-5" />
                Báo cáo & Phân tích
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg border-l-4 border-l-orange-500">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <CardTitle className="text-lg font-bold">Cần chú ý</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p className="font-medium">3 ma trận tài liệu chờ bạn xem xét</p>
                <p className="text-muted-foreground">
                  Vui lòng xem xét và phê duyệt để kích hoạt cho học viên nộp hồ sơ.
                </p>
              </div>
              <Button className="w-full">Xem xét ngay</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

