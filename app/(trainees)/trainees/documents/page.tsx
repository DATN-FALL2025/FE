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
  getNearestBatch,
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
  fileDownloadUrl: string | string[];
  uploadTime: string;
  report?: string;
  reporter?: string;
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

interface BatchInfo {
  startDate: string;
  endDate: string;
  status: boolean;
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
  
  // Batch info state
  const [batchInfo, setBatchInfo] = useState<BatchInfo | null>(null);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  
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

  // Fetch batch info on mount
  useEffect(() => {
    const fetchBatchInfo = async () => {
      try {
        const result: any = await getNearestBatch();
        if (result.status === "200 OK" && result.data) {
          setBatchInfo(result.data);
          // Check if current time is within batch period
          const now = new Date();
          const startDate = new Date(result.data.startDate);
          const endDate = new Date(result.data.endDate);
          setIsBatchOpen(result.data.status && now >= startDate && now <= endDate);
        }
      } catch (error) {
        console.error("Error fetching batch info:", error);
      }
    };
    fetchBatchInfo();
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
      
      // Use requiredDocumentName or fallback to file name
      const submissionName = document.requiredDocumentName?.trim() || file.name || `Document_${docId}`;
      
      let result: any;
      
      if (isResubmit && document.submissionId) {
        // Use updateTraineeSubmission for resubmit
        console.log("📤 Calling updateTraineeSubmission with:", {
          submissionId: document.submissionId,
          newSubmissionName: submissionName,
          fileName: file.name,
        });

        result = await updateTraineeSubmission(document.submissionId, {
          requiredDocumentName: submissionName,
          newTakeNote: "Nộp lại qua web portal",
          newSubmissionDocumentFile: file,
          token,
        });

        console.log("📥 updateTraineeSubmission result:", result);
      } else {
        // Use createTraineeSubmission for new submission
        console.log("📤 Calling createTraineeSubmission with:", {
          documentID: docId,
          traineeApplicationId: applicationDetail.traineeApplicationId,
          submissionName: submissionName,
          fileName: file.name,
        });

        result = await createTraineeSubmission({
          documentID: docId,
          traineeApplicationId: applicationDetail.traineeApplicationId,
          submissionName: submissionName,
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
      return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md"><CheckCircle2 className="w-3.5 h-3.5" />Đã nộp</span>;
    }
    
    // If no submissionId, show "Chờ nộp"
    return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md"><Clock className="w-3.5 h-3.5" />Chờ nộp</span>;
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
      "InProgress": { label: "Đang xử lý", className: "bg-blue-100 text-blue-800", icon: Clock },
      "Submitted": { label: "Đã nộp", className: "bg-blue-100 text-blue-800", icon: CheckCircle2 },
      "Approve": { label: "Đã duyệt", className: "bg-green-100 text-green-800", icon: CheckCircle2 },
      "Approved": { label: "Đã duyệt", className: "bg-green-100 text-green-800", icon: CheckCircle2 },
      "Reject": { label: "Từ chối", className: "bg-red-100 text-red-800", icon: XCircle },
      "Rejected": { label: "Từ chối", className: "bg-red-100 text-red-800", icon: XCircle },
      "Complete": { label: "Hoàn thành", className: "bg-green-100 text-green-800", icon: CheckCircle2 },
      "Completed": { label: "Hoàn thành", className: "bg-green-100 text-green-800", icon: CheckCircle2 },
    };

    const statusInfo = statusMap[status] || { label: status || "Chưa có thông tin", className: "bg-gray-100 text-gray-800", icon: AlertCircle };
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
      submissionName: "Test Document",
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Hồ Sơ Học Viên</h1>
        <p className="text-sm text-slate-600">
          Nộp và quản lý hồ sơ đăng ký của bạn
        </p>
      </div>

      {/* Thông tin đợt nộp */}
      {batchInfo && (
        <Card className={`shadow-lg border-2 ${isBatchOpen ? 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-slate-600' : 'bg-gradient-to-br from-slate-800 via-slate-900 to-black border-slate-700'}`}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${isBatchOpen ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                <Calendar className={`w-5 h-5 ${isBatchOpen ? 'text-emerald-400' : 'text-rose-400'}`} />
              </div>
              <h3 className="font-bold text-lg text-white">Đợt nộp hồ sơ</h3>
              <Badge className={`${isBatchOpen ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'} text-white font-semibold px-3 py-1`}>
                {isBatchOpen ? "Đang mở" : "Đã đóng"}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Bắt đầu:</span>
                <span className="font-semibold text-slate-200">{new Date(batchInfo.startDate).toLocaleDateString('vi-VN', { 
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Kết thúc:</span>
                <span className="font-semibold text-slate-200">{new Date(batchInfo.endDate).toLocaleDateString('vi-VN', { 
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}</span>
              </div>
            </div>
            {!isBatchOpen && (
              <div className="mt-3 p-3 bg-rose-500/20 border border-rose-500/30 rounded-lg">
                <p className="text-sm text-rose-300 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Đợt nộp hồ sơ đã kết thúc. Bạn không thể nộp hoặc cập nhật tài liệu.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Document Upload - Full Width */}
      <Card className="shadow-lg border-2 border-slate-700 bg-gradient-to-br from-slate-800 via-slate-900 to-black">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Upload className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Tải Lên Tài Liệu</h2>
          </div>
          <p className="text-sm text-slate-400 mb-6 ml-14">
            Tải lên tất cả tài liệu cần thiết cho vị trí đã chọn
          </p>

          {/* Document List */}
          <div className="space-y-4 mb-6 overflow-y-auto max-h-[600px]">
            {documents.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có tài liệu nào được yêu cầu</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.documentId}
                    className="p-4 rounded-xl border-2 border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-200"
                  >
                    {/* Header: Document name and upload button */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white mb-1">
                          {doc.requiredDocumentName || "Tài liệu"}
                          <span className="text-rose-400 ml-1 text-lg">*</span>
                        </h3>
                      </div>
                      <input
                        ref={(el) => { fileInputRefs.current[doc.documentId] = el; }}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileSelect(doc.documentId, e)}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      {/* Only show upload button if not submitted OR if rejected AND batch is open */}
                      {isBatchOpen && ((doc.apply_or_not !== "Applied" && doc.apply_or_not !== "Đã nộp") || 
                       (doc.submissionStatus === "Reject" || doc.submissionStatus === "Rejected")) && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all shrink-0"
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
                            <>
                              <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" />
                              Đang tải...
                            </>
                          ) : selectedFiles[doc.documentId] ? (
                            <>
                              <Upload className="w-4 h-4 mr-1.5" />
                              Gửi file
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-1.5" />
                              {(doc.submissionStatus === "Reject" || doc.submissionStatus === "Rejected") ? "Nộp lại" : "Tải lên"}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    
                    {/* Show selected file name */}
                    {selectedFiles[doc.documentId] && (
                      <div className="mb-3 p-3 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-2 border-blue-500/50 rounded-lg text-sm flex items-center gap-2.5 shadow-lg shadow-blue-500/20">
                        <div className="p-1.5 bg-blue-500/30 rounded">
                          <FileText className="w-4 h-4 text-blue-300 shrink-0" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-blue-200">File đã chọn: </span>
                          <span className="text-blue-100 font-medium truncate">{selectedFiles[doc.documentId].name}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Status badges and actions */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Submission Status Badge */}
                        {getStatusBadge(doc)}
                        
                        {/* Approval Status Badge - Only show if submitted */}
                        {(doc.apply_or_not === "Applied" || doc.apply_or_not === "Đã nộp") && doc.submissionStatus && (
                          <>
                            {doc.submissionStatus === "Pending" && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md">
                                <Clock className="w-3.5 h-3.5" />
                                Chờ duyệt
                              </span>
                            )}
                            {(doc.submissionStatus === "Approve" || doc.submissionStatus === "Approved") && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Đã duyệt
                              </span>
                            )}
                            {(doc.submissionStatus === "Reject" || doc.submissionStatus === "Rejected") && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-md">
                                <XCircle className="w-3.5 h-3.5" />
                                Từ chối
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      
                      {/* View detail button */}
                      {(doc.apply_or_not === "Applied" || doc.apply_or_not === "Đã nộp") && doc.submissionId && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 px-4 text-blue-300 hover:text-blue-200 hover:bg-blue-500/20 border-2 border-blue-500/50 hover:border-blue-400 font-semibold shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all bg-blue-900/30"
                          onClick={() => handleViewSubmissionDetail(doc.submissionId!)}
                        >
                          <Eye className="w-4 h-4 mr-1.5" />
                          Xem chi tiết
                        </Button>
                      )}
                    </div>
                    
                    {/* Uploaded file name */}
                    {(doc.submissionId && uploadedFiles[doc.documentId]) && (
                      <div className="mt-3 pt-3 border-t-2 border-slate-700">
                        <p className="text-xs text-slate-400 flex items-center gap-2 font-medium" title={uploadedFiles[doc.documentId]}>
                          <div className="p-1 bg-slate-700 rounded">
                            <FileText className="w-3.5 h-3.5 text-slate-300" />
                          </div>
                          <span className="truncate">{uploadedFiles[doc.documentId]}</span>
                        </p>
                      </div>
                    )}
                    
                    {/* Document Rule Values - Only show if submitted and has rules */}
                    {(doc.apply_or_not === "Applied" || doc.apply_or_not === "Đã nộp") && 
                     doc.documentRuleValueCellResponseList && 
                     doc.documentRuleValueCellResponseList.length > 0 && (
                      <div className="mt-4 pt-4 border-t-2 border-slate-700 space-y-3">
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                          <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                          </div>
                          Quy tắc kiểm tra
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {doc.documentRuleValueCellResponseList.map((rule) => (
                            <div key={rule.document_rule_value_id} className="p-3 bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 rounded-lg shadow-lg">
                              <p className="text-xs font-semibold text-slate-400 mb-2">
                                {rule.document_rule_name}
                              </p>
                              <p className="text-sm text-white font-bold bg-slate-900/50 px-3 py-2 rounded-md border border-slate-600 shadow-sm">
                                {rule.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Extracted Data - Only show if submitted and has extracted data */}
                    {(doc.apply_or_not === "Applied" || doc.apply_or_not === "Đã nộp") && 
                     doc.extractDataResponseList && 
                     doc.extractDataResponseList.length > 0 && (
                      <div className="mt-4 pt-4 border-t-2 border-slate-700 space-y-3">
                        <p className="text-sm font-bold text-white flex items-center gap-2">
                          <div className="p-1.5 bg-blue-500/20 rounded-lg">
                            <FileText className="w-4 h-4 text-blue-400" />
                          </div>
                          Dữ liệu trích xuất
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {doc.extractDataResponseList.map((data) => (
                            <div key={data.extract_data_id} className="p-3 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-2 border-blue-500/50 rounded-lg shadow-lg shadow-blue-500/20">
                              <p className="text-xs font-semibold text-blue-300 mb-2">
                                {data.extract_data_name}
                              </p>
                              <p className="text-sm text-blue-100 font-bold bg-slate-900/50 px-3 py-2 rounded-md border border-blue-500/30 shadow-sm">
                                {data.extract_Data_value}
                              </p>
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

      {/* File Preview Modal */}
      <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Xem file
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4 bg-slate-900 rounded-lg overflow-auto max-h-[75vh]">
            {previewImageUrl.toLowerCase().endsWith('.pdf') ? (
              <iframe
                src={`${previewImageUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full h-[75vh] rounded"
                title="PDF Preview"
              />
            ) : (
              <img 
                src={previewImageUrl} 
                alt="Preview" 
                className="max-w-full max-h-[70vh] object-contain rounded"
              />
            )}
          </div>
          <div className="flex justify-end">
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

              {/* Report / Báo cáo kiểm tra - Hiển thị cho cả Approved và Rejected */}
              {selectedSubmission.report && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Báo cáo kiểm tra
                  </label>
                  <div className={`p-4 rounded-lg border-2 ${
                    selectedSubmission.submissionStatus === "Approve" || selectedSubmission.submissionStatus === "Approved"
                      ? 'bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-500/50'
                      : 'bg-gradient-to-br from-rose-900/40 to-red-900/40 border-rose-500/50'
                  }`}>
                    <div className="space-y-3">
                      {selectedSubmission.report.split('\n').filter(line => line.trim()).map((line, index) => {
                        const isMainItem = !line.startsWith('  ');
                        const cleanLine = line.trim();
                        
                        if (isMainItem) {
                          return (
                            <div key={index} className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-lg border border-slate-700">
                              <div className="p-1.5 bg-emerald-500/20 rounded-full shrink-0 mt-0.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              </div>
                              <span className="text-white font-bold text-sm">{cleanLine}</span>
                            </div>
                          );
                        } else {
                          return (
                            <div key={index} className="flex items-start gap-3 pl-6 py-2">
                              <span className="text-slate-300 text-sm leading-relaxed">{cleanLine}</span>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                  {selectedSubmission.reporter && (
                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Người đánh giá:</span>
                      <span className="text-white font-semibold">{selectedSubmission.reporter}</span>
                    </div>
                  )}
                </div>
              )}

              {/* File Download */}
              {selectedSubmission.fileDownloadUrl && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    File đã nộp ({Array.isArray(selectedSubmission.fileDownloadUrl) ? selectedSubmission.fileDownloadUrl.length : 1} file)
                  </label>
                  <div className="space-y-2">
                    {(Array.isArray(selectedSubmission.fileDownloadUrl) 
                      ? selectedSubmission.fileDownloadUrl 
                      : [selectedSubmission.fileDownloadUrl]
                    ).map((fileUrl, index) => {
                      // Extract filename from URL
                      const urlParts = fileUrl.split('/');
                      const fullFileName = urlParts[urlParts.length - 1];
                      // Remove timestamp prefix (e.g., "1768310288219_")
                      const fileName = fullFileName.replace(/^\d+_/, '');
                      const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileUrl);
                      const isPdf = /\.pdf$/i.test(fileUrl);
                      
                      return (
                        <div key={index} className="flex items-center gap-2 p-3 bg-slate-800/60 border border-slate-700 rounded-lg">
                          <div className="p-2 bg-blue-500/20 rounded">
                            <FileText className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{fileName}</p>
                            <p className="text-xs text-slate-400">File {index + 1}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 bg-blue-900/30 border-blue-500/50 text-blue-300 hover:bg-blue-500/20 shrink-0"
                            onClick={() => {
                              setPreviewImageUrl(fileUrl);
                              setIsImagePreviewOpen(true);
                            }}
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Xem
                          </Button>
                        </div>
                      );
                    })}
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
                      <div key={rule.document_rule_value_id} className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                        <p className="text-sm font-semibold text-slate-900 mb-1">
                          {rule.document_rule_name}
                        </p>
                        <p className="text-sm text-slate-700 bg-white px-3 py-2 rounded">
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
                      <div key={data.extract_data_id} className="p-3 bg-blue-100 rounded-lg border border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          {data.extract_data_name}
                        </p>
                        <p className="text-sm text-blue-800 bg-white px-3 py-2 rounded font-mono">
                          {data.extract_Data_value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Resubmit Button - Only show if status is Reject AND batch is open */}
              {selectedSubmission.submissionStatus === "Reject" && isBatchOpen && (
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
              
              {/* Show message if batch is closed */}
              {selectedSubmission.submissionStatus === "Reject" && !isBatchOpen && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-red-600 text-center">
                    ⚠️ Đợt nộp hồ sơ đã kết thúc. Không thể nộp lại tài liệu.
                  </p>
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

