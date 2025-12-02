"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  getAllTraineeApplicationsByTrainee,
  getTraineeApplicationDetailByTrainee,
  createTraineeSubmission,
  uploadTraineeApplication,
} from "@/lib/actions";
import { getToken } from "@/lib/auth-utils";

interface SubmittedDocument {
  submissionId: number | null;
  documentId: number;
  requiredDocumentName: string;
  submissionStatus: "Pending" | "Approved" | "Rejected";
}

interface ApplicationDetail {
  traineeApplicationId: number;
  traineeApplicationStatus: string;
  positionName: string;
  departmentName: string;
  submittedDocuments: SubmittedDocument[];
}

export default function StudentDocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [applicationDetail, setApplicationDetail] = useState<ApplicationDetail | null>(null);
  const [documents, setDocuments] = useState<SubmittedDocument[]>([]);
  const [uploadingDocs, setUploadingDocs] = useState<Set<number>>(new Set());
  const [debugInfo, setDebugInfo] = useState<string>("");
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Debug: Check for auth token in cookies
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie;
      console.log("🍪 All cookies:", cookies);
      
      const authCookie = cookies.split(';').find(c => c.trim().startsWith('auth-storage='));
      console.log("🔑 Auth cookie:", authCookie);
      
      setDebugInfo(`Cookies: ${cookies.substring(0, 100)}...`);
    }
  }, []);

  // Fetch trainee application detail on mount
  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        setLoading(true);

        // Get token from localStorage
        const token = getToken();
        console.log("🔑 Token from localStorage:", token ? "Yes" : "No");

        // Fetch trainee applications
        const applicationsRes: any = await getAllTraineeApplicationsByTrainee(token);
        console.log("📋 Applications Response:", applicationsRes);
        
        // Check for both "success" and "200 OK" status
        if ((applicationsRes.status === "success" || applicationsRes.status === "200 OK") && applicationsRes.data) {
          const applications = Array.isArray(applicationsRes.data) ? applicationsRes.data : [];
          console.log("📋 Applications:", applications);
          
          // Get the most recent or active application
          if (applications.length > 0) {
            const activeApp = applications[0];
            const traineeApplicationId = activeApp.traineeApplicationId;
            console.log("📋 Active Application ID:", traineeApplicationId);

            // Fetch application detail to get submittedDocuments
            const detailRes: any = await getTraineeApplicationDetailByTrainee(traineeApplicationId, token);
            console.log("📄 Detail Response:", detailRes);
            
            if ((detailRes.status === "200 OK" || detailRes.status === "success") && detailRes.data) {
              console.log("📄 Application Detail:", detailRes.data);
              console.log("📄 Submitted Documents:", detailRes.data.submittedDocuments);
              setApplicationDetail(detailRes.data);
              setDocuments(detailRes.data.submittedDocuments || []);
            } else {
              console.error("❌ Invalid detail response status:", detailRes.status);
            }
          } else {
            console.warn("⚠️ No applications found");
            toast.error("Bạn chưa có đơn đăng ký nào");
          }
        } else {
          console.error("❌ Invalid applications response:", applicationsRes);
        }
      } catch (error) {
        console.error("❌ Error fetching application detail:", error);
        toast.error("Không thể tải thông tin đơn đăng ký");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetail();
  }, []);

  const handleFileUpload = async (docId: number) => {
    const fileInput = fileInputRefs.current[docId];
    if (!fileInput) return;

    const file = fileInput.files?.[0];
    if (!file) {
      toast.error("Vui lòng chọn file");
      return;
    }

    if (!applicationDetail?.traineeApplicationId) {
      toast.error("Không tìm thấy đơn đăng ký");
      return;
    }

    const document = documents.find(d => d.documentId === docId);
    if (!document) return;

    try {
      setUploadingDocs((prev) => new Set(prev).add(docId));

      // Get token from localStorage
      const token = getToken();

      const result: any = await createTraineeSubmission({
        documentID: docId,
        traineeApplicationId: applicationDetail.traineeApplicationId,
        submissionName: file.name,
        takeNote: "Submitted via web portal",
        submissionDocumentFile: file,
        token,
      });

      if (result.status === "200 OK" || result.status === "success") {
        toast.success(`Nộp tài liệu "${document.requiredDocumentName}" thành công`);

        // Refresh application detail to get updated submittedDocuments
        const detailRes: any = await getTraineeApplicationDetailByTrainee(applicationDetail.traineeApplicationId, token);
        
        if (detailRes.status === "200 OK" && detailRes.data) {
          setDocuments(detailRes.data.submittedDocuments || []);
        }
      } else {
        toast.error(result.message || "Nộp tài liệu thất bại");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Lỗi khi nộp tài liệu");
    } finally {
      setUploadingDocs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(docId);
        return newSet;
      });
      if (fileInput) fileInput.value = "";
    }
  };

  const handleSubmitApplication = async () => {
    if (!applicationDetail?.traineeApplicationId) {
      toast.error("Không tìm thấy đơn đăng ký");
      return;
    }

    const pendingDocs = documents.filter(doc => doc.submissionId === null);
    if (pendingDocs.length > 0) {
      toast.error(`Bạn cần nộp ${pendingDocs.length} tài liệu còn lại trước khi submit hồ sơ`);
      return;
    }

    try {
      // Get token from localStorage
      const token = getToken();

      const result: any = await uploadTraineeApplication(applicationDetail.traineeApplicationId, token);
      if (result.status === "200 OK" || result.status === "success") {
        toast.success("Submit hồ sơ thành công! Hồ sơ của bạn đang được xem xét.");
      } else {
        toast.error(result.message || "Submit hồ sơ thất bại");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Lỗi khi submit hồ sơ");
    }
  };

  const submittedCount = documents.filter(doc => doc.submissionId !== null).length;
  const totalCount = documents.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3" />Chờ nộp</span>;
      case "Approved":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3" />Đã duyệt</span>;
      case "Rejected":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3" />Từ chối</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!applicationDetail) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Chưa có đơn đăng ký</h2>
          <p className="text-muted-foreground">Vui lòng tạo đơn đăng ký trước khi nộp tài liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-8">
      {/* Debug Info */}
      {debugInfo && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs">
          <strong>Debug:</strong> {debugInfo}
        </div>
      )}
      
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Hồ Sơ Học Viên</h1>
        <p className="text-sm text-muted-foreground">
          Nộp và quản lý hồ sơ đăng ký của bạn
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Application Info */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-2">Thông Tin Đơn Đăng Ký</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Chi tiết về đơn đăng ký của bạn
            </p>

            {/* Application Details */}
            <div className="space-y-4 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Vị trí</label>
                <p className="text-base font-semibold">{applicationDetail.positionName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Phòng ban</label>
                <p className="text-base font-semibold">{applicationDetail.departmentName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Trạng thái đơn</label>
                <p className="text-base font-semibold">{applicationDetail.traineeApplicationStatus}</p>
              </div>
            </div>

            {/* Document Statistics */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tổng số tài liệu</span>
                <span className="font-bold">{totalCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Đã nộp</span>
                <span className="font-bold text-green-600">{submittedCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Chưa nộp</span>
                <span className="font-bold text-yellow-600">{totalCount - submittedCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tiến độ</span>
                <span className="font-bold">
                  {totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Document Upload */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-2">Tải Lên Tài Liệu</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tải lên tất cả tài liệu cần thiết cho vị trí đã chọn
            </p>

            {/* Document List */}
            <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
              {documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có tài liệu nào được yêu cầu</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.documentId}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate">
                          {doc.requiredDocumentName}
                          <span className="text-red-500 ml-1">*</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(doc.submissionStatus)}
                      </div>
                    </div>
                    <input
                      ref={(el) => { fileInputRefs.current[doc.documentId] = el; }}
                      type="file"
                      className="hidden"
                      onChange={() => handleFileUpload(doc.documentId)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 shrink-0"
                      onClick={() => fileInputRefs.current[doc.documentId]?.click()}
                      disabled={uploadingDocs.has(doc.documentId)}
                    >
                      {uploadingDocs.has(doc.documentId) ? (
                        <>Đang tải...</>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          {doc.submissionId ? "Nộp lại" : "Tải lên"}
                        </>
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Action Button */}
            <div className="border-t pt-4">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
                onClick={handleSubmitApplication}
                disabled={submittedCount < totalCount}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Submit Hồ Sơ Tổng
              </Button>
              {submittedCount < totalCount && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Vui lòng nộp đủ {totalCount} tài liệu trước khi submit
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

