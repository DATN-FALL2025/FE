"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Eye,
  FileText,
  AlertCircle,
  Loader2,
  LayoutGrid,
  Table,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/lib/toast-compat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getAllTraineeApplicationsByStaffAcademic,
  getTraineeApplicationsByStatus,
  completeTraineeApplication,
  getTraineeApplicationDetailByStaff,
} from "@/lib/actions/trainee-submission";

interface TraineeApplication {
  id: number;
  createAt: string;
  updateAt: string | null;
  deleteAt: string | null;
  statusEnum: string;
  active: boolean;
}

interface SubmittedDocument {
  submissionId: number | null;
  documentId: number;
  requiredDocumentName: string;
  apply_or_not: string;
  submissionStatus: string;
  url?: string;
}

interface ApplicationDetail {
  traineeApplicationId: number;
  traineeApplicationStatus: string;
  traineeApplicationCreateAt: string;
  traineeApplicationUpdateAt: string | null;
  positionId: number;
  positionName: string;
  departmentName: string;
  positionDescription: string;
  accountId: number;
  fullName: string;
  submittedDocuments: SubmittedDocument[];
}

export default function AcademicStaffApprovalsPage() {
  const [applications, setApplications] = useState<TraineeApplication[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isListLoading, setIsListLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedApp, setSelectedApp] = useState<TraineeApplication | null>(null);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [applicationDetail, setApplicationDetail] = useState<ApplicationDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");
  const [previewDocumentName, setPreviewDocumentName] = useState<string>("");

  const hasLoadedData = useRef(false);

  useEffect(() => {
    if (hasLoadedData.current) return;
    hasLoadedData.current = true;
    loadApplications(true);
  }, []);

  const loadApplications = async (isInitial = false) => {
    if (isInitial) {
      setIsInitialLoading(true);
    } else {
      setIsListLoading(true);
    }
    setError("");
    try {
      const token = localStorage.getItem("token");
      const result: any = await getAllTraineeApplicationsByStaffAcademic(token);
      console.log("📋 Load applications result:", result);

      if (result && result.data) {
        setApplications(Array.isArray(result.data) ? result.data : []);
      } else if (result && Array.isArray(result)) {
        setApplications(result);
      } else if (result.status && result.status.includes("error")) {
        setError(result.message || "Không thể tải danh sách đơn đăng ký");
      } else {
        setError("Không thể tải danh sách đơn đăng ký");
      }
    } catch (err) {
      console.error("❌ Error in loadApplications:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      if (isInitial) {
        setIsInitialLoading(false);
      } else {
        setIsListLoading(false);
      }
    }
  };

  const loadApplicationsByStatus = async (status: string) => {
    setIsListLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const result: any = await getTraineeApplicationsByStatus(status, token);
      console.log("🔍 Filter by status result:", result);

      if (result && result.data) {
        setApplications(Array.isArray(result.data) ? result.data : []);
      } else if (result && Array.isArray(result)) {
        setApplications(result);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error("❌ Error in loadApplicationsByStatus:", err);
      setError("Có lỗi xảy ra khi lọc dữ liệu");
    } finally {
      setIsListLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      loadApplications();
    } else {
      const statusMap: { [key: string]: string } = {
        pending: "Pending",
        approve: "Approve",
        reject: "Reject",
        complete: "Complete",
        inprogress: "InProgress",
      };
      loadApplicationsByStatus(statusMap[value]);
    }
  };

  const handleComplete = async () => {
    if (!selectedApp) return;

    // Kiểm tra status phải là Approve
    if (selectedApp.statusEnum !== "Approve") {
      toast({
        title: "Không thể hoàn thành",
        description: "Chỉ có thể hoàn thành đơn đăng ký đã được duyệt (Approve)!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const result: any = await completeTraineeApplication(selectedApp.id, token);

      console.log("✅ Complete application result:", result);

      const isSuccess =
        result &&
        (result.status === "success" ||
          (result.status && typeof result.status === "string" && result.status.includes("OK")) ||
          (result.status && typeof result.status === "string" && result.status.includes("200")));

      if (isSuccess) {
        setIsCompleteOpen(false);
        setSelectedApp(null);
        // Reload lại danh sách theo tab hiện tại
        if (activeTab === "all") {
          await loadApplications();
        } else {
          const statusMap: { [key: string]: string } = {
            pending: "Pending",
            approve: "Approve",
            reject: "Reject",
            complete: "Complete",
            inprogress: "InProgress",
          };
          await loadApplicationsByStatus(statusMap[activeTab]);
        }
        toast({
          title: "Thành công",
          description: "Hoàn thành đơn đăng ký thành công!",
        });
      } else {
        toast({
          title: "Lỗi",
          description: result?.message || "Hoàn thành đơn đăng ký thất bại!",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra!",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCompleteDialog = (app: TraineeApplication) => {
    setSelectedApp(app);
    setIsCompleteOpen(true);
  };

  const openViewDialog = async (app: TraineeApplication) => {
    setSelectedApp(app);
    setIsViewOpen(true);
    setIsLoadingDetail(true);
    setApplicationDetail(null);

    try {
      const token = localStorage.getItem("token");
      const result: any = await getTraineeApplicationDetailByStaff(app.id, token);
      console.log("📄 Application detail result:", result);

      if (result && result.data) {
        setApplicationDetail(result.data);
      } else {
        toast({
          title: "Lỗi",
          description: result?.message || "Không thể tải chi tiết đơn đăng ký",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tải chi tiết",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const openImagePreview = (url: string, documentName: string) => {
    setPreviewImageUrl(url);
    setPreviewDocumentName(documentName);
    setIsImagePreviewOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      Pending: { label: "Chờ duyệt", className: "bg-yellow-500 hover:bg-yellow-600" },
      InProgress: { label: "Đang xử lý", className: "bg-blue-500 hover:bg-blue-600" },
      Approve: { label: "Đã duyệt", className: "bg-green-500 hover:bg-green-600" },
      Reject: { label: "Từ chối", className: "bg-red-500 hover:bg-red-600" },
      Complete: { label: "Hoàn thành", className: "bg-gray-500 hover:bg-gray-600" },
    };

    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-400" };
    return <Badge className={statusInfo.className}>{statusInfo.label}</Badge>;
  };

  const getPriorityBadge = (status: string) => {
    if (status === "Pending") {
      return <Badge variant="destructive">Ưu tiên cao</Badge>;
    }
    if (status === "InProgress") {
      return <Badge className="bg-orange-500">Trung bình</Badge>;
    }
    return null;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Hôm qua";
    return `${diffInDays} ngày trước`;
  };

  const pendingCount = applications.filter((a) => a.statusEnum === "Pending").length;
  const approveCount = applications.filter((a) => a.statusEnum === "Approve").length;
  const rejectCount = applications.filter((a) => a.statusEnum === "Reject").length;

  const renderApplicationCard = (app: TraineeApplication) => (
    <Card key={app.id} className="border-0 shadow-md hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold">Đơn đăng ký #{app.id}</p>
                {getStatusBadge(app.statusEnum)}
              </div>
              <p className="text-sm text-muted-foreground">
                Tạo lúc: {new Date(app.createAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">{getTimeAgo(app.createAt)}</span>
          </div>

          {getPriorityBadge(app.statusEnum) && (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-muted-foreground">Mức độ ưu tiên:</span>
              {getPriorityBadge(app.statusEnum)}
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium">Đơn đăng ký học viên</p>
            </div>
            <p className="text-sm text-muted-foreground">Trạng thái: {app.statusEnum}</p>
            <p className="text-sm text-muted-foreground">
              Hoạt động: {app.active ? "Có" : "Không"}
            </p>
          </div>

          {app.updateAt && (
            <p className="text-sm text-muted-foreground">
              Cập nhật lần cuối: {new Date(app.updateAt).toLocaleString('vi-VN')}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => openViewDialog(app)}>
              <Eye className="w-4 h-4 mr-2" />
              Xem
            </Button>
            {app.statusEnum === "Approve" && (
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600 flex-1"
                onClick={() => openCompleteDialog(app)}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Hoàn thành
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Duyệt Đơn Đăng Ký Học Viên</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Xem xét và duyệt các đơn đăng ký của học viên
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Chờ duyệt", value: pendingCount, color: "text-yellow-600" },
          { label: "Đã duyệt", value: approveCount, color: "text-green-600" },
          { label: "Từ chối", value: rejectCount, color: "text-red-600" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1">
          <TabsList className="grid w-full max-w-3xl grid-cols-6">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="pending">Chờ duyệt</TabsTrigger>
            <TabsTrigger value="approve">Đã duyệt</TabsTrigger>
            <TabsTrigger value="reject">Từ chối</TabsTrigger>
            <TabsTrigger value="complete">Hoàn thành</TabsTrigger>
            <TabsTrigger value="inprogress">Đang xử lý</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 ml-4">
          <Button
            variant={viewMode === "card" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("card")}
            className="gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            Thẻ
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="gap-2"
          >
            <Table className="w-4 h-4" />
            Bảng
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>

        <TabsContent value={activeTab} className="mt-6">
          {isListLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Đang tải danh sách...</p>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Không có đơn đăng ký nào</p>
              </CardContent>
            </Card>
          ) : viewMode === "card" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {applications.map(renderApplicationCard)}
            </div>
          ) : (
            <Card className="border shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left py-4 px-6 font-medium text-sm">ID</th>
                        <th className="text-left py-4 px-6 font-medium text-sm">Trạng thái</th>
                        <th className="text-left py-4 px-6 font-medium text-sm">Ngày tạo</th>
                        <th className="text-left py-4 px-6 font-medium text-sm">Cập nhật</th>
                        <th className="text-left py-4 px-6 font-medium text-sm">Hoạt động</th>
                        <th className="text-right py-4 px-6 font-medium text-sm">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-medium">#{app.id}</div>
                          </td>
                          <td className="py-4 px-6">{getStatusBadge(app.statusEnum)}</td>
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              {new Date(app.createAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getTimeAgo(app.createAt)}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              {app.updateAt
                                ? new Date(app.updateAt).toLocaleDateString()
                                : "-"}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant={app.active ? "default" : "secondary"}>
                              {app.active ? "Có" : "Không"}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => openViewDialog(app)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Xem
                              </Button>
                              {app.statusEnum === "Approve" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openCompleteDialog(app)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Hoàn thành
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* View Detail Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn đăng ký #{selectedApp?.id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đơn đăng ký và tài liệu đã nộp
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Đang tải chi tiết...</p>
              </div>
            </div>
          ) : applicationDetail ? (
            <div className="space-y-6">
              {/* Application Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Thông tin đơn đăng ký</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Họ tên</p>
                      <p className="font-medium">{applicationDetail.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Trạng thái</p>
                      <div className="mt-1">{getStatusBadge(applicationDetail.traineeApplicationStatus)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vị trí</p>
                      <p className="font-medium">{applicationDetail.positionName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phòng ban</p>
                      <p className="font-medium">{applicationDetail.departmentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày tạo</p>
                      <p className="font-medium">
                        {new Date(applicationDetail.traineeApplicationCreateAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                      <p className="font-medium">
                        {applicationDetail.traineeApplicationUpdateAt
                          ? new Date(applicationDetail.traineeApplicationUpdateAt).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                  {applicationDetail.positionDescription && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Mô tả vị trí</p>
                      <p className="mt-1">{applicationDetail.positionDescription}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Submitted Documents */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Tài liệu đã nộp ({applicationDetail.submittedDocuments.length})
                  </h3>
                  <div className="space-y-3">
                    {applicationDetail.submittedDocuments.map((doc) => (
                      <div
                        key={doc.documentId}
                        className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <p className="font-medium">{doc.requiredDocumentName}</p>
                              <Badge
                                variant={doc.apply_or_not === "Applied" ? "default" : "secondary"}
                              >
                                {doc.apply_or_not === "Applied" ? "Đã nộp" : "Chưa nộp"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground">Trạng thái:</p>
                              <Badge
                                className={
                                  doc.submissionStatus === "Approve" || doc.submissionStatus === "Approved"
                                    ? "bg-green-500"
                                    : doc.submissionStatus === "Reject" || doc.submissionStatus === "Rejected"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                                }
                              >
                                {doc.submissionStatus === "Approve" || doc.submissionStatus === "Approved"
                                  ? "Đã duyệt"
                                  : doc.submissionStatus === "Reject" || doc.submissionStatus === "Rejected"
                                  ? "Từ chối"
                                  : doc.submissionStatus === "Pending"
                                  ? "Chờ duyệt"
                                  : doc.submissionStatus}
                              </Badge>
                            </div>
                          </div>
                          {doc.url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openImagePreview(doc.url!, doc.requiredDocumentName)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Xem file
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Không có dữ liệu</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* File Preview Dialog */}
      <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>{previewDocumentName}</DialogTitle>
            <DialogDescription>Xem trước tài liệu</DialogDescription>
          </DialogHeader>
          <div className="relative w-full h-[75vh] bg-muted/20 flex items-center justify-center p-6">
            {previewImageUrl ? (
              <Image
                src={previewImageUrl}
                alt={previewDocumentName}
                fill
                className="object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="text-center">
                        <p class="text-muted-foreground mb-4">Không thể hiển thị hình ảnh</p>
                        <a href="${previewImageUrl}" target="_blank" class="text-blue-600 hover:underline">
                          Mở trong tab mới
                        </a>
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <p className="text-muted-foreground">Không có hình ảnh</p>
            )}
          </div>
          <div className="p-6 pt-0 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => window.open(previewImageUrl, "_blank")}
            >
              Mở trong tab mới
            </Button>
            <Button onClick={() => setIsImagePreviewOpen(false)}>Đóng</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complete Alert Dialog */}
      <AlertDialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hoàn thành</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đánh dấu đơn đăng ký{" "}
              <span className="font-semibold">#{selectedApp?.id}</span> là hoàn thành? Hành động
              này chỉ được phép khi đơn đã được duyệt (Approve).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Hoàn thành"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
