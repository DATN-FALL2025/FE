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
  report?: string;
  fileDownloadUrl: string | string[];
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
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: { name: string; files: File[] } }>({});
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

  // Batch info
  const [batchInfo, setBatchInfo] = useState<BatchInfo | null>(null);
  const isBatchOpen = batchInfo?.status ?? false;

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

    const fetchBatchInfo = async () => {
      try {
        const batchRes: any = await getNearestBatch();
        if (batchRes.status === "200 OK" && batchRes.data) {
          setBatchInfo(batchRes.data);
        }
      } catch (error) {
        console.error("Error fetching batch info:", error);
      }
    };

    fetchApplicationDetail();
    fetchBatchInfo();
  }, []);

  const handleFileSelect = (docId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFileArray = Array.from(files);
      console.log("📁 New files selected:", { docId, fileCount: newFileArray.length, fileNames: newFileArray.map(f => f.name) });
      
      // Add to existing files instead of replacing
      setSelectedFiles(prev => {
        const existing = prev[docId];
        const existingFiles = existing?.files || [];
        const combinedFiles = [...existingFiles, ...newFileArray];
        
        console.log("📁 Combined files:", { 
          existingCount: existingFiles.length, 
          newCount: newFileArray.length, 
          totalCount: combinedFiles.length 
        });
        
        return {
          ...prev,
          [docId]: { 
            name: combinedFiles.length === 1 ? combinedFiles[0].name : `${combinedFiles.length} files`, 
            files: combinedFiles 
          }
        };
      });
      
      // Show toast notification
      const document = documents.find(d => d.documentId === docId);
      const existingCount = selectedFiles[docId]?.files.length || 0;
      toast.info(`Đã thêm ${newFileArray.length} file`, {
        description: `Tổng cộng ${existingCount + newFileArray.length} file cho ${document?.requiredDocumentName || ''}`,
        duration: 3000,
      });
      
      // Clear the input so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  const handleFileUpload = async (docId: number) => {
    console.log("🚀 handleFileUpload called for docId:", docId);
    console.log("📁 Selected files state:", selectedFiles);
    
    // Get files from selectedFiles state instead of fileInput
    const selectedFile = selectedFiles[docId];
    if (!selectedFile || !selectedFile.files || selectedFile.files.length === 0) {
      console.error("❌ No files selected for docId:", docId);
      toast.error("Vui lòng chọn file");
      return;
    }

    const files = selectedFile.files;
    console.log("📄 Files to upload:", files.map(f => ({ name: f.name, size: f.size, type: f.type })));

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
        ? `Đang nộp lại "${document.requiredDocumentName}" (${files.length} file)...`
        : `Đang tải lên "${document.requiredDocumentName}" (${files.length} file)...`
    );

    try {
      setUploadingDocs((prev) => new Set(prev).add(docId));

      const token = getClientToken();
      console.log("🔑 Token available:", token ? "Yes" : "No");
      console.log("📤 Calling createTraineeSubmission with:", {
        documentID: docId,
        traineeApplicationId: applicationDetail.traineeApplicationId,
        submissionName: document.requiredDocumentName,
        fileCount: files.length,
      });

      const result: any = await createTraineeSubmission({
        documentID: docId,
        traineeApplicationId: applicationDetail.traineeApplicationId,
        submissionName: document.requiredDocumentName,
        takeNote: "Submitted via web portal",
        submissionDocumentFile: files, // Send array of files
        token,
      });

      console.log("📥 createTraineeSubmission result:", result);

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
            description: `${files.length} file đã được tải lên`,
            duration: 4000,
          }
        );

        // Save uploaded file names
        setUploadedFiles(prev => ({
          ...prev,
          [docId]: files.length === 1 ? files[0].name : `${files.length} files`
        }));

        // Clear selected files
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
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-3 h-3" />
          Đã nộp
        </span>
      );
    }

    // If no submissionId, show "Chờ nộp"
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
        <Clock className="w-3 h-3" />
        Chờ nộp
      </span>
    );
  };

  const getSubmissionStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string; icon: React.ElementType } } = {
      "Pending": { label: "Chờ duyệt", className: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400", icon: Clock },
      "InProgress": { label: "Đang xử lý", className: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400", icon: Clock },
      "Approve": { label: "Đã duyệt", className: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400", icon: CheckCircle2 },
      "Approved": { label: "Đã duyệt", className: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400", icon: CheckCircle2 },
      "Reject": { label: "Từ chối", className: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400", icon: XCircle },
      "Rejected": { label: "Từ chối", className: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400", icon: XCircle },
    };

    const statusInfo = statusMap[status] || { label: status, className: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400", icon: AlertCircle };
    const Icon = statusInfo.icon;

    return (
      <Badge className={`${statusInfo.className} border-0 font-medium px-2.5 py-1 rounded-lg`}>
        <Icon className="w-3 h-3 mr-1.5" />
        {statusInfo.label}
      </Badge>
    );  
  };

  const getApplicationStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string; icon: React.ElementType } } = {
      "Pending": { label: "Đang chờ xử lý", className: "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400", icon: Clock },
      "Submitted": { label: "Đã nộp", className: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400", icon: CheckCircle2 },
      "InProgress": { label: "Đang xử lý", className: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400", icon: Clock },
      "Approve": { label: "Đã duyệt", className: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400", icon: CheckCircle2 },
      "Approved": { label: "Đã duyệt", className: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400", icon: CheckCircle2 },
      "Reject": { label: "Từ chối", className: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400", icon: XCircle },
      "Rejected": { label: "Từ chối", className: "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400", icon: XCircle },
    };

    const statusInfo = statusMap[status] || { label: status, className: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400", icon: AlertCircle };
    const Icon = statusInfo.icon;

    return (
      <Badge className={`${statusInfo.className} border-0 font-medium px-2.5 py-1 rounded-lg`}>
        <Icon className="w-3 h-3 mr-1.5" />
        {statusInfo.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-72 rounded-lg" />
          <Skeleton className="h-5 w-96 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[500px] rounded-2xl" />
          <Skeleton className="h-[500px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!applicationDetail) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-0 shadow-lg rounded-2xl bg-white dark:bg-slate-900 max-w-md w-full">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Chưa có đơn đăng ký</h2>
            <p className="text-slate-500 dark:text-slate-400">Vui lòng tạo đơn đăng ký trước khi nộp tài liệu</p>
          </CardContent>
        </Card>
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
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Hồ Sơ Học Viên
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Nộp và quản lý hồ sơ đăng ký của bạn
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Application Info */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Thông Tin Đơn Đăng Ký</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Chi tiết về đơn đăng ký của bạn</p>
              </div>
            </div>

            {/* Application Details */}
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Họ tên</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{applicationDetail.fullName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Vị trí ứng tuyển</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{applicationDetail.positionName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Phòng ban</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{applicationDetail.departmentName}</span>
                </div>
              </div>

              {applicationDetail.positionDescription && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Mô tả vị trí</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{applicationDetail.positionDescription}</p>
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-sm text-slate-500 dark:text-slate-400">Trạng thái đơn</span>
                <div>{getApplicationStatusBadge(applicationDetail.traineeApplicationStatus)}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ngày tạo đơn
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {new Date(applicationDetail.traineeApplicationCreateAt).toLocaleString('vi-VN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                {applicationDetail.traineeApplicationUpdateAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Cập nhật lần cuối
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {new Date(applicationDetail.traineeApplicationUpdateAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Document Statistics */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalCount}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tổng tài liệu</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-center">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{submittedCount}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Đã nộp</p>
                </div>
              </div>

              {/* Approval Status - Only show if has submitted */}
              {submittedCount > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng thái duyệt</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{approvedCount}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Đã duyệt</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-amber-100 dark:bg-amber-950/50">
                      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Chờ duyệt</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-red-100 dark:bg-red-950/50">
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mx-auto mb-1" />
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">{rejectedCount}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Từ chối</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Tiến độ hoàn tất</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2.5 bg-white dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Document Upload */}
        <Card className="border-0 shadow-sm bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
                <Upload className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tải Lên Tài Liệu</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tải lên tất cả tài liệu cần thiết</p>
              </div>
            </div>

            {/* Document List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">Chưa có tài liệu nào được yêu cầu</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.documentId}
                    className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {doc.requiredDocumentName}
                          <span className="text-red-500 ml-1">*</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          ref={(el) => { fileInputRefs.current[doc.documentId] = el; }}
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileSelect(doc.documentId, e)}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          multiple
                        />
                        {/* Always show upload button to allow resubmit */}
                        {true ? (
                          <>
                            {/* Add File Button */}
                            <Button
                              size="sm"
                              variant="outline"
                              className="shrink-0 rounded-lg cursor-pointer transition-all duration-200 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                              onClick={() => {
                                fileInputRefs.current[doc.documentId]?.click();
                              }}
                              disabled={uploadingDocs.has(doc.documentId)}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Thêm file
                            </Button>
                            
                            {/* Submit Button - Only show if files are selected */}
                            {selectedFiles[doc.documentId] && (
                              <Button
                                size="sm"
                                className="shrink-0 rounded-lg cursor-pointer transition-all duration-200 bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => handleFileUpload(doc.documentId)}
                                disabled={uploadingDocs.has(doc.documentId)}
                              >
                                {uploadingDocs.has(doc.documentId) ? (
                                  <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Đang tải...
                                  </span>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Gửi file
                                  </>
                                )}
                              </Button>
                            )}
                          </>
                        ) : null}
                      </div>
                    </div>
                    
                    {/* Show selected file names */}
                    {selectedFiles[doc.documentId] && (
                      <div className="mb-3 space-y-2">
                        {selectedFiles[doc.documentId].files.map((file, index) => (
                          <div key={index} className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            <span className="text-xs font-medium text-blue-700 dark:text-blue-300 truncate flex-1">{file.name}</span>
                            <span className="text-xs text-blue-600 dark:text-blue-400 shrink-0">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                            <button
                              onClick={() => {
                                // Remove file from list
                                setSelectedFiles(prev => {
                                  const current = prev[doc.documentId];
                                  if (!current) return prev;
                                  
                                  const newFiles = current.files.filter((_, i) => i !== index);
                                  if (newFiles.length === 0) {
                                    // Remove entire entry if no files left
                                    const newState = { ...prev };
                                    delete newState[doc.documentId];
                                    return newState;
                                  }
                                  
                                  return {
                                    ...prev,
                                    [doc.documentId]: {
                                      name: newFiles.length === 1 ? newFiles[0].name : `${newFiles.length} files`,
                                      files: newFiles
                                    }
                                  };
                                });
                              }}
                              className="shrink-0 p-1 hover:bg-red-100 dark:hover:bg-red-950/50 rounded transition-colors"
                              title="Xóa file"
                            >
                              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        ))}
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
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400">
                                <Clock className="w-3 h-3" />
                                Chờ duyệt
                              </span>
                            )}
                            {doc.submissionStatus === "InProgress" && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400">
                                <Clock className="w-3 h-3" />
                                Đang xử lý
                              </span>
                            )}
                            {(doc.submissionStatus === "Approve" || doc.submissionStatus === "Approved") && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="w-3 h-3" />
                                Đã duyệt
                              </span>
                            )}
                            {(doc.submissionStatus === "Reject" || doc.submissionStatus === "Rejected") && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400">
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
                            className="h-7 px-2.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg cursor-pointer transition-colors duration-200"
                            onClick={() => handleViewSubmissionDetail(doc.submissionId!)}
                          >
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            Xem chi tiết
                          </Button>
                        )}
                      </div>
                      {(doc.submissionId && uploadedFiles[doc.documentId]) && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px] flex items-center gap-1" title={uploadedFiles[doc.documentId]}>
                          <FileText className="w-3 h-3" />
                          {uploadedFiles[doc.documentId]}
                        </p>
                      )}
                    </div>
                    
                    {/* Document Rule Values - Only show if submitted and has rules */}
                    {(doc.apply_or_not === "Applied" || doc.apply_or_not === "Đã nộp") &&
                     doc.documentRuleValueCellResponseList &&
                     doc.documentRuleValueCellResponseList.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quy tắc kiểm tra</p>
                        <div className="space-y-2">
                          {doc.documentRuleValueCellResponseList.map((rule) => (
                            <div key={rule.document_rule_value_id} className="flex items-center justify-between text-xs p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                              <span className="font-medium text-slate-600 dark:text-slate-400">
                                {rule.document_rule_name}
                              </span>
                              <span className="text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 px-2.5 py-1 rounded-md font-semibold">
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
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dữ liệu trích xuất</p>
                        <div className="space-y-2">
                          {doc.extractDataResponseList.map((data) => (
                            <div key={data.extract_data_id} className="flex items-center justify-between text-xs p-2.5 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                              <span className="font-medium text-blue-700 dark:text-blue-400">
                                {data.extract_data_name}
                              </span>
                              <span className="text-blue-900 dark:text-blue-100 bg-white dark:bg-blue-900/50 px-2.5 py-1 rounded-md font-semibold">
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
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden rounded-2xl border-0">
          <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-white">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              Xem file
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
            <img
              src={previewImageUrl}
              alt="Preview"
              className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-lg"
            />
          </div>
          <div className="flex gap-3 p-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 cursor-pointer transition-colors duration-200"
              onClick={() => window.open(previewImageUrl, '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Tải xuống
            </Button>
            <Button
              variant="outline"
              className="rounded-xl h-11 cursor-pointer transition-colors duration-200"
              onClick={() => setIsImagePreviewOpen(false)}
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resubmit Modal */}
      <Dialog open={isResubmitModalOpen} onOpenChange={setIsResubmitModalOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl border-0">
          <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-white">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              Nộp lại tài liệu
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 mt-1">
              Tải lên file mới và thêm ghi chú (nếu cần)
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-5">
            {/* File Upload */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">File mới <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="file"
                  className="w-full p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setResubmitFile(file);
                      toast.info(`Đã chọn file: ${file.name}`);
                    }
                  }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
              {resubmitFile && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300 truncate">{resubmitFile.name}</span>
                </div>
              )}
            </div>

            {/* Note */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-white">Ghi chú (tùy chọn)</label>
              <textarea
                className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-sm resize-none min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Thêm ghi chú về tài liệu mới..."
                value={resubmitNote}
                onChange={(e) => setResubmitNote(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-11 cursor-pointer transition-colors duration-200"
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
                      toast.success("Nộp lại tài liệu thành công!");
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
                {isResubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang nộp...
                  </span>
                ) : "Nộp lại"}
              </Button>
              <Button
                variant="outline"
                className="rounded-xl h-11 cursor-pointer transition-colors duration-200"
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
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden p-0 rounded-2xl border-0">
          <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-white">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              Chi Tiết Tài Liệu
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 mt-1">
              Thông tin chi tiết về tài liệu đã nộp
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
            {loadingDetail ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ) : selectedSubmission ? (
              <div className="p-6 space-y-5">
                {/* Document Info Card */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Tên tài liệu</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white text-right max-w-[200px] truncate">
                      {selectedSubmission.requiredDocumentName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Tên bài nộp</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white text-right max-w-[200px] truncate">
                      {selectedSubmission.submission_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Trạng thái</span>
                    {getSubmissionStatusBadge(selectedSubmission.submissionStatus)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Thời gian nộp
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {new Date(selectedSubmission.uploadTime).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Take Note or Report */}
                {selectedSubmission.submissionStatus === "InProgress" && selectedSubmission.report ? (
                  // Show report when InProgress
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Báo cáo
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {selectedSubmission.report === "WAITING_FOR_AI_EXTRACTION" 
                        ? "Đang chờ AI trích xuất dữ liệu..." 
                        : selectedSubmission.report}
                    </p>
                  </div>
                ) : selectedSubmission.report && selectedSubmission.submissionStatus !== "InProgress" ? (
                  // Show report for other statuses if exists
                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Báo cáo
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {selectedSubmission.report === "WAITING_FOR_AI_EXTRACTION" 
                        ? "Đang chờ AI trích xuất dữ liệu..." 
                        : selectedSubmission.report}
                    </p>
                  </div>
                ) : selectedSubmission.takeNote && 
                    selectedSubmission.takeNote !== "Submitted via web portal" && 
                    selectedSubmission.submissionStatus !== "InProgress" ? (
                  // Show takeNote when not InProgress and not default message
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900">
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Ghi chú
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{selectedSubmission.takeNote}</p>
                  </div>
                ) : null}

                {/* File Download */}
                {selectedSubmission.fileDownloadUrl && (
                  <div className="space-y-3">
                    {(Array.isArray(selectedSubmission.fileDownloadUrl) 
                      ? selectedSubmission.fileDownloadUrl 
                      : [selectedSubmission.fileDownloadUrl]
                    ).map((fileUrl, index) => {
                      const isPdf = /\.pdf$/i.test(fileUrl);
                      const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileUrl);
                      
                      return (
                        <div key={index} className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              File {(Array.isArray(selectedSubmission.fileDownloadUrl) && selectedSubmission.fileDownloadUrl.length > 1) ? `#${index + 1}` : 'đã nộp'}
                            </p>
                          </div>
                          
                          {isPdf ? (
                            // Embed PDF viewer
                            <div className="w-full h-[600px] rounded-lg overflow-hidden border border-blue-200 dark:border-blue-800">
                              <iframe
                                src={fileUrl + '#toolbar=0&navpanes=0&scrollbar=0'}
                                className="w-full h-full"
                                title={`PDF Viewer ${index + 1}`}
                              />
                            </div>
                          ) : isImage ? (
                            // Show image
                            <div className="w-full rounded-lg overflow-hidden border border-blue-200 dark:border-blue-800">
                              <img
                                src={fileUrl}
                                alt={`File ${index + 1}`}
                                className="w-full h-auto object-contain max-h-[600px]"
                              />
                            </div>
                          ) : (
                            // Other file types - show link
                            <Button
                              variant="outline"
                              className="w-full rounded-lg h-10 cursor-pointer transition-colors duration-200"
                              onClick={() => window.open(fileUrl, '_blank')}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Xem file
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Document Rule Values */}
                {selectedSubmission.documentRuleValueCellResponseList &&
                 selectedSubmission.documentRuleValueCellResponseList.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Quy tắc kiểm tra
                    </p>
                    <div className="space-y-2">
                      {selectedSubmission.documentRuleValueCellResponseList.map((rule) => (
                        <div key={rule.document_rule_value_id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                              {rule.document_rule_name}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-700 px-3 py-1 rounded-lg">
                              {rule.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Extracted Data */}
                {selectedSubmission.extractDataResponseList &&
                 selectedSubmission.extractDataResponseList.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Dữ liệu trích xuất
                    </p>
                    <div className="space-y-2">
                      {selectedSubmission.extractDataResponseList.map((data) => (
                        <div key={data.extract_data_id} className="p-3 bg-violet-50 dark:bg-violet-950/30 rounded-xl border border-violet-100 dark:border-violet-900">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-violet-700 dark:text-violet-400">
                              {data.extract_data_name}
                            </span>
                            <span className="text-sm font-semibold text-violet-900 dark:text-violet-100 bg-white dark:bg-violet-900/50 px-3 py-1 rounded-lg font-mono">
                              {data.extract_Data_value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resubmit Button - Only show if status is Reject */}
                {selectedSubmission.submissionStatus === "Reject" && (
                  <Button
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-11 cursor-pointer transition-colors duration-200"
                    onClick={() => {
                      setIsResubmitModalOpen(true);
                      setResubmitNote("");
                      setResubmitFile(null);
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Nộp lại tài liệu
                  </Button>
                )}

                {/* Submission ID */}
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center pt-2">
                  ID: #{selectedSubmission.submissionId}
                </p>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400">Không thể tải thông tin chi tiết</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

