"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, CheckCircle2, AlertCircle, Clock, User, Eye, Download, FileText, Calendar, MessageSquare, XCircle, RefreshCw, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuthInfo } from "@/hooks/use-auth-info";
import { getDecodedToken } from "@/lib/auth-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  getAllTraineeApplicationsByTrainee,
  getTraineeApplicationDetailByTrainee,
  uploadTraineeApplication,
  getTraineeSubmissionDetail,
} from "@/lib/actions";
import {
  createTraineeSubmission,
  updateTraineeSubmission,
} from "@/lib/actions/trainee-submission-client";

interface DocumentRuleValue {
  document_rule_value_id: number;
  value: string;
  document_rule_id: number;
  document_rule_name: string;
}

interface ExtractedData {
  extract_data_id: number;
  extract_data_name: string;
  extract_Data_value: string;
}

interface SubmittedDocument {
  submissionId: number | null;
  documentId: number;
  requiredDocumentName: string;
  apply_or_not: string; // "Not apply" or "Applied"
  submissionStatus?: string; // "Pending", "Approve", "Reject"
  url?: string | null;
  documentRuleValueCellResponseList?: DocumentRuleValue[];
  extractDataResponseList?: ExtractedData[];
}

interface SubmissionDetail {
  submissionId: number;
  document_id: number;
  requiredDocumentName: string;
  submissionStatus: string;
  submission_name: string;
  takeNote: string;
  fileDownloadUrl: string;
  uploadTime: string;
  documentRuleValueCellResponseList?: DocumentRuleValue[];
  extractDataResponseList?: ExtractedData[];
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

export default function StudentDocumentsPage() {
  const { displayName, user } = useAuthInfo();
  const [loading, setLoading] = useState(true);
  const [applicationDetail, setApplicationDetail] = useState<ApplicationDetail | null>(null);
  const [documents, setDocuments] = useState<SubmittedDocument[]>([]);
  const [uploadingDocs, setUploadingDocs] = useState<Set<number>>(new Set());
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: string }>({});
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: { name: string; file: File } }>({});
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  
  // Modal state for viewing submission detail
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetail | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  
  // Image preview modal
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  
  // Resubmit modal
  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);
  const [resubmitFile, setResubmitFile] = useState<File | null>(null);
  const [resubmitNote, setResubmitNote] = useState("");
  const [isResubmitting, setIsResubmitting] = useState(false);
  
  // Get user info from decoded token
  const [userInfo, setUserInfo] = useState<{
    fullName: string;
    email: string;
    studentCode: string;
    department: string;
  } | null>(null);

  // Helper function to get token from localStorage
  const getClientToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  };

  // Load user info from token
  useEffect(() => {
    const decodedToken = getDecodedToken();
    if (decodedToken) {
      setUserInfo({
        fullName: decodedToken.sub || displayName || "Học viên",
        email: decodedToken.gmail || user?.gmail || "",
        studentCode: decodedToken.studentCode || "N/A",
        department: decodedToken.departmentName || "N/A",
      });
    }
  }, [displayName, user]);

  // Fetch trainee application detail on mount
  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        setLoading(true);

        // Get token from localStorage
        const token = getClientToken();
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
              
              // Validate document data
              const docs = detailRes.data.submittedDocuments || [];
              docs.forEach((doc: any, index: number) => {
                console.log(`📄 Document ${index}:`, {
                  documentId: doc.documentId,
                  requiredDocumentName: doc.requiredDocumentName,
                  submissionId: doc.submissionId,
                  apply_or_not: doc.apply_or_not
                });
                
                if (!doc.requiredDocumentName) {
                  console.warn(`⚠️ Document ${index} has null/empty requiredDocumentName!`, doc);
                }
              });
              
              setApplicationDetail(detailRes.data);
              setDocuments(docs);
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

  const handleFileSelect = (docId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("📁 File selected:", { docId, fileName: file.name, fileSize: file.size });
      
      // Save selected file object and name
      setSelectedFiles(prev => ({
        ...prev,
        [docId]: { name: file.name, file: file }
      }));
      
      // Show toast notification
      const document = documents.find(d => d.documentId === docId);
      toast.info(`Đã chọn file: ${file.name}`, {
        description: `Nhấn "Gửi file" để tải lên tài liệu ${document?.requiredDocumentName || ''}`,
        duration: 3000,
      });
    }
  };

  const handleFileUpload = async (docId: number) => {
    console.log("🚀 handleFileUpload called for docId:", docId);
    console.log("📁 Selected files state:", selectedFiles);
    
    // Get file from selectedFiles state instead of fileInput
    const selectedFile = selectedFiles[docId];
    if (!selectedFile) {
      console.error("❌ No file selected for docId:", docId);
      toast.error("Vui lòng chọn file");
      return;
    }

    const file = selectedFile.file;
    console.log("📄 File to upload:", { name: file.name, size: file.size, type: file.type });

    if (!applicationDetail?.traineeApplicationId) {
      console.error("❌ No traineeApplicationId");
      toast.error("Không tìm thấy đơn đăng ký");
      return;
    }

    const document = documents.find(d => d.documentId === docId);
    if (!document) {
      console.error("❌ Document not found for docId:", docId);
      toast.error("Không tìm thấy thông tin tài liệu");
      return;
    }

    // Validate requireDocumentName
    if (!document.requiredDocumentName || document.requiredDocumentName.trim() === '') {
      console.error("❌ requiredDocumentName is null or empty:", document);
      toast.error("Tên tài liệu không hợp lệ. Vui lòng tải lại trang.");
      return;
    }

    // Check if this is a resubmit (document already submitted and rejected)
    const isResubmit = document.submissionId !== null && 
                       (document.submissionStatus === "Reject" || document.submissionStatus === "Rejected");

    // Show loading toast
    const loadingToast = toast.loading(
      isResubmit 
        ? `Đang nộp lại "${document.requiredDocumentName}"...`
        : `Đang tải lên "${document.requiredDocumentName}"...`
    );

    try {
      setUploadingDocs((prev) => new Set(prev).add(docId));

      const token = getClientToken();
      console.log("🔑 Token available:", token ? "Yes" : "No");
      console.log("📤 Calling createTraineeSubmission with:", {
        documentID: docId,
        traineeApplicationId: applicationDetail.traineeApplicationId,
        submissionName: document.requiredDocumentName,
        fileName: file.name,
      });

      const result: any = await createTraineeSubmission({
        documentID: docId,
        traineeApplicationId: applicationDetail.traineeApplicationId,
        submissionName: document.requiredDocumentName,
        takeNote: "Submitted via web portal",
        submissionDocumentFile: file,
        token,
      });

        console.log("📥 createTraineeSubmission result:", result);
      }

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (result.status === "201 CREATED" || result.status === "200 OK" || result.status === "success") {
        console.log("✅ Upload successful!");
        toast.success(
          result.message || 
          (isResubmit 
            ? `✅ Nộp lại tài liệu "${document.requiredDocumentName}" thành công!`
            : `✅ Nộp tài liệu "${document.requiredDocumentName}" thành công!`
          ), 
          {
            description: `File "${file.name}" đã được tải lên`,
            duration: 4000,
          }
        );

        // Save uploaded file name
        setUploadedFiles(prev => ({
          ...prev,
          [docId]: file.name
        }));

        // Clear selected file
        setSelectedFiles(prev => {
          const newFiles = { ...prev };
          delete newFiles[docId];
          return newFiles;
        });

        // Refresh application detail to get updated submittedDocuments
        const detailRes: any = await getTraineeApplicationDetailByTrainee(applicationDetail.traineeApplicationId, token);

        if ((detailRes.status === "200 OK" || detailRes.status === "success") && detailRes.data) {
          setApplicationDetail(detailRes.data);
          setDocuments(detailRes.data.submittedDocuments || []);
        }
      } else {
        console.error("❌ Upload failed:", result);
        toast.error(result.message || "❌ Nộp tài liệu thất bại", {
          description: "Vui lòng thử lại",
          duration: 4000,
        });
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      console.error("💥 Error uploading document:", error);
      toast.error("❌ Lỗi khi nộp tài liệu", {
        description: "Vui lòng kiểm tra kết nối và thử lại",
        duration: 4000,
      });
    } finally {
      setUploadingDocs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(docId);
        return newSet;
      });
      
      // Clear file input
      const fileInput = fileInputRefs.current[docId];
      if (fileInput) fileInput.value = "";
    }
  };

  const handleSubmitApplication = async () => {
    console.log("🚀 Starting handleSubmitApplication");
    console.log("📋 Application Detail:", applicationDetail);
    console.log("📄 Documents:", documents);
    
    if (!applicationDetail?.traineeApplicationId) {
      console.error("❌ No traineeApplicationId found");
      toast.error("❌ Không tìm thấy đơn đăng ký", {
        description: "Vui lòng tải lại trang và thử lại",
        duration: 4000,
      });
      return;
    }

    const pendingDocs = documents.filter(doc => doc.apply_or_not === "Not apply");
    console.log("⏳ Pending documents:", pendingDocs);
    
    if (pendingDocs.length > 0) {
      console.warn("⚠️ Still have pending documents:", pendingDocs.length);
      const pendingDocNames = pendingDocs.map(d => d.requiredDocumentName).join(", ");
      toast.warning(`⚠️ Chưa đủ tài liệu để submit`, {
        description: `Bạn cần nộp ${pendingDocs.length} tài liệu còn lại: ${pendingDocNames}`,
        duration: 5000,
      });
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Đang submit hồ sơ tổng...", {
      description: "Vui lòng đợi trong giây lát",
    });

    try {
      const token = getClientToken();
      console.log("🔑 Token for submit:", token ? "Yes" : "No");
      console.log("📤 Calling uploadTraineeApplication with ID:", applicationDetail.traineeApplicationId);

      const result: any = await uploadTraineeApplication(applicationDetail.traineeApplicationId, token);
      
      console.log("📥 Submit result:", result);
      console.log("📥 Result status:", result.status);
      console.log("📥 Result message:", result.message);
      console.log("📥 Result data:", result.data);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      if (result.status === "200 OK" || result.status === "success") {
        console.log("✅ Submit successful!");
        toast.success(result.message || "🎉 Submit hồ sơ thành công!", {
          description: "Hồ sơ của bạn đang được xem xét. Bạn sẽ nhận được thông báo khi có kết quả.",
          duration: 5000,
        });
      } else {
        console.error("❌ Submit failed with status:", result.status);
        toast.error(result.message || "❌ Submit hồ sơ thất bại", {
          description: "Vui lòng thử lại sau",
          duration: 4000,
        });
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      console.error("💥 Error submitting application:", error);
      toast.error("❌ Lỗi khi submit hồ sơ", {
        description: "Vui lòng kiểm tra kết nối và thử lại",
        duration: 4000,
      });
    }
  };

  const submittedCount = documents.filter(doc => doc.apply_or_not === "Applied" || doc.apply_or_not === "Đã nộp").length;
  const totalCount = documents.length;
  
  // Calculate approval status counts
  const approvedCount = documents.filter(doc => 
    (doc.apply_or_not === "Applied" || doc.apply_or_not === "Đã nộp") && 
    (doc.submissionStatus === "Approve" || doc.submissionStatus === "Approved")
  ).length;
  const pendingCount = documents.filter(doc => 
    (doc.apply_or_not === "Applied" || doc.apply_or_not === "Đã nộp") && 
    doc.submissionStatus === "Pending"
  ).length;
  const rejectedCount = documents.filter(doc => 
    (doc.apply_or_not === "Applied" || doc.apply_or_not === "Đã nộp") && 
    (doc.submissionStatus === "Reject" || doc.submissionStatus === "Rejected")
  ).length;

  const handleViewSubmissionDetail = async (submissionId: number) => {
    try {
      setLoadingDetail(true);
      setIsDetailModalOpen(true);
      
      const token = getClientToken();
      const result: any = await getTraineeSubmissionDetail(submissionId);
      
      if (result.status === "200 OK" && result.data) {
        setSelectedSubmission(result.data);
      } else {
        toast.error("Không thể tải chi tiết tài liệu");
        setIsDetailModalOpen(false);
      }
    } catch (error) {
      console.error("Error loading submission detail:", error);
      toast.error("Lỗi khi tải chi tiết tài liệu");
      setIsDetailModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const getStatusBadge = (doc: SubmittedDocument) => {
    // If has submissionId, show "Đã nộp" regardless of status
    if (doc.submissionId !== null) {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3" />Đã nộp</span>;
    }
    
    // If no submissionId, show "Chờ nộp"
    return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3" />Chờ nộp</span>;
  };

  const getSubmissionStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string; icon: any } } = {
      "Pending": { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800", icon: Clock },
      "Approve": { label: "Đã duyệt", className: "bg-green-100 text-green-800", icon: CheckCircle2 },
      "Approved": { label: "Đã duyệt", className: "bg-green-100 text-green-800", icon: CheckCircle2 },
      "Reject": { label: "Từ chối", className: "bg-red-100 text-red-800", icon: XCircle },
      "Rejected": { label: "Từ chối", className: "bg-red-100 text-red-800", icon: XCircle },
    };

    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800", icon: AlertCircle };
    const Icon = statusInfo.icon;

    return (
      <Badge className={statusInfo.className}>
        <Icon className="w-3 h-3 mr-1" />
        {statusInfo.label}
      </Badge>
    );
  };

  const getApplicationStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string; icon: any } } = {
      "Pending": { label: "Đang chờ xử lý", className: "bg-yellow-100 text-yellow-800", icon: Clock },
      "Submitted": { label: "Đã nộp", className: "bg-blue-100 text-blue-800", icon: CheckCircle2 },
      "Approve": { label: "Đã duyệt", className: "bg-green-100 text-green-800", icon: CheckCircle2 },
      "Approved": { label: "Đã duyệt", className: "bg-green-100 text-green-800", icon: CheckCircle2 },
      "Reject": { label: "Từ chối", className: "bg-red-100 text-red-800", icon: XCircle },
      "Rejected": { label: "Từ chối", className: "bg-red-100 text-red-800", icon: XCircle },
    };

    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-800", icon: AlertCircle };
    const Icon = statusInfo.icon;

    return (
      <Badge className={statusInfo.className}>
        <Icon className="w-3 h-3 mr-1" />
        {statusInfo.label}
      </Badge>
    );
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

  // Debug function to test API directly
  const testAPICall = async () => {
    console.log("🧪 Testing API call directly...");
    const token = getClientToken();
    console.log("🔑 Token:", token);
    
    const testFile = new File(["test content"], "test.txt", { type: "text/plain" });
    
    const result = await createTraineeSubmission({
      documentID: 1,
      traineeApplicationId: applicationDetail?.traineeApplicationId || 3,
      requiredDocumentName: "Test Document",
      takeNote: "Test submission",
      submissionDocumentFile: testFile,
      token,
    });
    
    console.log("🧪 Test result:", result);
  };

  return (
    <div className="space-y-6 w-full pb-8">
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
                <label className="text-sm font-medium text-muted-foreground">Họ tên</label>
                <p className="text-base font-semibold">{applicationDetail.fullName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Vị trí ứng tuyển</label>
                <p className="text-base font-semibold">{applicationDetail.positionName}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Phòng ban</label>
                <p className="text-base font-semibold">{applicationDetail.departmentName}</p>
              </div>
              {applicationDetail.positionDescription && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Mô tả vị trí</label>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{applicationDetail.positionDescription}</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Trạng thái đơn</label>
                <div>{getApplicationStatusBadge(applicationDetail.traineeApplicationStatus)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Ngày tạo đơn
                </label>
                <p className="text-sm">
                  {new Date(applicationDetail.traineeApplicationCreateAt).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {applicationDetail.traineeApplicationUpdateAt && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Cập nhật lần cuối
                  </label>
                  <p className="text-sm">
                    {new Date(applicationDetail.traineeApplicationUpdateAt).toLocaleString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Document Statistics */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tổng số tài liệu</span>
                <span className="font-bold">{totalCount}</span>
              </div>
              
              {/* Submission Status */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Trạng thái nộp</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    Đã nộp
                  </span>
                  <span className="font-bold text-green-600">{submittedCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3 text-yellow-600" />
                    Chưa nộp
                  </span>
                  <span className="font-bold text-yellow-600">{totalCount - submittedCount}</span>
                </div>
              </div>
              
              {/* Approval Status */}
              {submittedCount > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Trạng thái duyệt</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      Đã duyệt
                    </span>
                    <span className="font-bold text-green-600">{approvedCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600" />
                      Chờ duyệt
                    </span>
                    <span className="font-bold text-blue-600">{pendingCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-red-600" />
                      Từ chối
                    </span>
                    <span className="font-bold text-red-600">{rejectedCount}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground">Tiến độ hoàn tất</span>
                <span className="font-bold">
                  {totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0}%
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
            <div className="space-y-3 mb-6 overflow-y-auto">
              {documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có tài liệu nào được yêu cầu</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.documentId}
                    className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-sm font-medium truncate">
                          {doc.requiredDocumentName}
                          <span className="text-red-500 ml-1">*</span>
                        </p>
                      </div>
                      <input
                        ref={(el) => { fileInputRefs.current[doc.documentId] = el; }}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileSelect(doc.documentId, e)}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      {/* Only show upload button if not submitted OR if rejected */}
                      {(doc.apply_or_not !== "Applied" && doc.apply_or_not !== "Đã nộp") || 
                       (doc.submissionStatus === "Reject" || doc.submissionStatus === "Rejected") ? (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 shrink-0"
                          onClick={() => {
                            if (selectedFiles[doc.documentId]) {
                              handleFileUpload(doc.documentId);
                            } else {
                              fileInputRefs.current[doc.documentId]?.click();
                            }
                          }}
                          disabled={uploadingDocs.has(doc.documentId)}
                        >
                          {uploadingDocs.has(doc.documentId) ? (
                            <>Đang tải...</>
                          ) : selectedFiles[doc.documentId] ? (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Gửi file
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              {(doc.submissionStatus === "Reject" || doc.submissionStatus === "Rejected") ? "Nộp lại" : "Tải lên"}
                            </>
                          )}
                        </Button>
                      ) : null}
                    </div>
                    
                    {/* Show selected file name */}
                    {selectedFiles[doc.documentId] && (
                      <div className="mb-2 p-2 bg-blue-50 rounded text-xs text-blue-800 flex items-center gap-2">
                        <span className="font-medium">File đã chọn:</span>
                        <span className="truncate flex-1">{selectedFiles[doc.documentId].name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Submission Status Badge */}
                        {getStatusBadge(doc)}
                        
                        {/* Approval Status Badge - Only show if submitted */}
                        {(doc.apply_or_not === "Applied" || doc.apply_or_not === "Đã nộp") && doc.submissionStatus && (
                          <>
                            {doc.submissionStatus === "Pending" && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Clock className="w-3 h-3" />
                                Chờ duyệt
                              </span>
                            )}
                            {(doc.submissionStatus === "Approve" || doc.submissionStatus === "Approved") && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3 h-3" />
                                Đã duyệt
                              </span>
                            )}
                            {(doc.submissionStatus === "Reject" || doc.submissionStatus === "Rejected") && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="w-3 h-3" />
                                Từ chối
                              </span>
                            )}
                          </>
                        )}
                        
                        {(doc.apply_or_not === "Applied" || doc.apply_or_not === "Đã nộp") && doc.submissionId && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleViewSubmissionDetail(doc.submissionId!)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Xem chi tiết
                          </Button>
                        )}
                      </div>
                      {(doc.submissionId && uploadedFiles[doc.documentId]) && (
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]" title={uploadedFiles[doc.documentId]}>
                          📎 {uploadedFiles[doc.documentId]}
                        </p>
                      )}
                    </div>
                    
                    {/* Document Rule Values - Only show if submitted and has rules */}
                    {(doc.apply_or_not === "Applied" || doc.apply_or_not === "Đã nộp") && 
                     doc.documentRuleValueCellResponseList && 
                     doc.documentRuleValueCellResponseList.length > 0 && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <p className="text-xs font-semibold text-foreground uppercase">Quy tắc kiểm tra</p>
                        <div className="grid grid-cols-1 gap-2">
                          {doc.documentRuleValueCellResponseList.map((rule) => (
                            <div key={rule.document_rule_value_id} className="flex items-start gap-2 text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded">
                              <span className="font-medium text-slate-700 dark:text-slate-300 min-w-[100px]">
                                {rule.document_rule_name}:
                              </span>
                              <span className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 px-2 py-0.5 rounded font-medium">
                                {rule.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Extracted Data - Only show if submitted and has extracted data */}
                    {(doc.apply_or_not === "Applied" || doc.apply_or_not === "Đã nộp") && 
                     doc.extractDataResponseList && 
                     doc.extractDataResponseList.length > 0 && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <p className="text-xs font-semibold text-foreground uppercase">Dữ liệu trích xuất</p>
                        <div className="grid grid-cols-1 gap-2">
                          {doc.extractDataResponseList.map((data) => (
                            <div key={data.extract_data_id} className="flex items-start gap-2 text-xs bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
                              <span className="font-medium text-blue-700 dark:text-blue-300 min-w-[100px]">
                                {data.extract_data_name}:
                              </span>
                              <span className="text-blue-900 dark:text-blue-100 bg-white dark:bg-blue-800 px-2 py-0.5 rounded font-medium">
                                {data.extract_Data_value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Preview Modal */}
      <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Xem file
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
            <img 
              src={previewImageUrl} 
              alt="Preview" 
              className="max-w-full max-h-[70vh] object-contain rounded"
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => window.open(previewImageUrl, '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Tải xuống
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsImagePreviewOpen(false)}
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resubmit Modal */}
      <Dialog open={isResubmitModalOpen} onOpenChange={setIsResubmitModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Nộp lại tài liệu
            </DialogTitle>
            <DialogDescription>
              Tải lên file mới và thêm ghi chú (nếu cần)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">File mới *</label>
              <input
                type="file"
                className="w-full p-2 border rounded"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setResubmitFile(file);
                    toast.info(`Đã chọn file: ${file.name}`);
                  }
                }}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {resubmitFile && (
                <p className="text-xs text-green-600">✓ {resubmitFile.name}</p>
              )}
            </div>
            
            {/* Note */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ghi chú (tùy chọn)</label>
              <textarea
                className="w-full p-2 border rounded min-h-[100px]"
                placeholder="Thêm ghi chú về tài liệu mới..."
                value={resubmitNote}
                onChange={(e) => setResubmitNote(e.target.value)}
              />
            </div>
            
            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                onClick={async () => {
                  if (!resubmitFile) {
                    toast.error("Vui lòng chọn file");
                    return;
                  }
                  
                  if (!selectedSubmission) {
                    toast.error("Không tìm thấy thông tin submission");
                    return;
                  }
                  
                  setIsResubmitting(true);
                  const loadingToast = toast.loading("Đang nộp lại tài liệu...");
                  
                  try {
                    const token = getClientToken();
                    const result: any = await updateTraineeSubmission(
                      selectedSubmission.submissionId,
                      {
                        requiredDocumentName: selectedSubmission.requiredDocumentName,
                        newTakeNote: resubmitNote || "Nộp lại tài liệu",
                        newSubmissionDocumentFile: resubmitFile,
                        token,
                      }
                    );
                    
                    toast.dismiss(loadingToast);
                    
                    if (result.status === "200 OK" || result.status === "success") {
                      toast.success("✅ Nộp lại tài liệu thành công!");
                      setIsResubmitModalOpen(false);
                      setIsDetailModalOpen(false);
                      
                      // Refresh documents list
                      if (applicationDetail) {
                        const detailRes: any = await getTraineeApplicationDetailByTrainee(
                          applicationDetail.traineeApplicationId,
                          token
                        );
                        if (detailRes.status === "200 OK" && detailRes.data) {
                          setDocuments(detailRes.data.submittedDocuments || []);
                        }
                      }
                    } else {
                      toast.error(result.message || "Nộp lại tài liệu thất bại");
                    }
                  } catch (error) {
                    toast.dismiss(loadingToast);
                    console.error("Error resubmitting:", error);
                    toast.error("Lỗi khi nộp lại tài liệu");
                  } finally {
                    setIsResubmitting(false);
                  }
                }}
                disabled={isResubmitting || !resubmitFile}
              >
                {isResubmitting ? "Đang nộp..." : "Nộp lại"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsResubmitModalOpen(false)}
                disabled={isResubmitting}
              >
                Hủy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Submission Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Chi Tiết Tài Liệu
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về tài liệu đã nộp
            </DialogDescription>
          </DialogHeader>

          {loadingDetail ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : selectedSubmission ? (
            <div className="space-y-6 py-4">
              {/* Document Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Tên tài liệu
                </label>
                <p className="text-base font-semibold">{selectedSubmission.requiredDocumentName}</p>
              </div>

              {/* Submission Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Tên bài nộp</label>
                <p className="text-base">{selectedSubmission.submission_name}</p>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                <div>{getSubmissionStatusBadge(selectedSubmission.submissionStatus)}</div>
              </div>

              {/* Upload Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Thời gian nộp
                </label>
                <p className="text-base">
                  {new Date(selectedSubmission.uploadTime).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Take Note */}
              {selectedSubmission.takeNote && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Ghi chú
                  </label>
                  <p className="text-base p-3 bg-muted rounded-lg">{selectedSubmission.takeNote}</p>
                </div>
              )}

              {/* File Download */}
              {selectedSubmission.fileDownloadUrl && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    File đã nộp
                  </label>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => window.open(selectedSubmission.fileDownloadUrl, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Tải xuống file
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const fileUrl = selectedSubmission.fileDownloadUrl;
                        const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileUrl);
                        const isPdf = /\.pdf$/i.test(fileUrl);
                        
                        if (isImage || isPdf) {
                          setPreviewImageUrl(fileUrl);
                          setIsImagePreviewOpen(true);
                        } else {
                          window.open(fileUrl, '_blank');
                        }
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Xem file
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Document Rule Values */}
              {selectedSubmission.documentRuleValueCellResponseList && 
               selectedSubmission.documentRuleValueCellResponseList.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Quy tắc kiểm tra
                  </label>
                  <div className="space-y-2">
                    {selectedSubmission.documentRuleValueCellResponseList.map((rule) => (
                      <div key={rule.document_rule_value_id} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                          {rule.document_rule_name}
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-2 rounded">
                          {rule.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Extracted Data */}
              {selectedSubmission.extractDataResponseList && 
               selectedSubmission.extractDataResponseList.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Dữ liệu trích xuất từ tài liệu
                  </label>
                  <div className="space-y-2">
                    {selectedSubmission.extractDataResponseList.map((data) => (
                      <div key={data.extract_data_id} className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          {data.extract_data_name}
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200 bg-white dark:bg-blue-950 px-3 py-2 rounded font-mono">
                          {data.extract_Data_value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Resubmit Button - Only show if status is Reject */}
              {selectedSubmission.submissionStatus === "Reject" && (
                <div className="pt-4 border-t">
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => {
                      setIsResubmitModalOpen(true);
                      setResubmitNote("");
                      setResubmitFile(null);
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Nộp lại tài liệu
                  </Button>
                </div>
              )}

              {/* Submission ID */}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  ID Submission: #{selectedSubmission.submissionId}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Không thể tải thông tin chi tiết</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

