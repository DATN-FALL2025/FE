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
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: string }>({});
  const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: { name: string; file: File } }>({});
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Helper function to get token from localStorage
  const getClientToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  };

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
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading(`Đang tải lên "${document.requiredDocumentName}"...`);

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

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (result.status === "201 CREATED" || result.status === "200 OK" || result.status === "success") {
        console.log("✅ Upload successful!");
        toast.success(`✅ Nộp tài liệu "${document.requiredDocumentName}" thành công!`, {
          description: `File "${file.name}" đã được tải lên`,
          duration: 4000,
        });

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
        
        if (detailRes.status === "200 OK" && detailRes.data) {
          setDocuments(detailRes.data.submittedDocuments || []);
        }
      } else {
        console.error("❌ Upload failed:", result);
        toast.error(`❌ Nộp tài liệu thất bại`, {
          description: result.message || "Vui lòng thử lại",
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

    const pendingDocs = documents.filter(doc => doc.submissionId === null);
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
        toast.success("🎉 Submit hồ sơ thành công!", {
          description: "Hồ sơ của bạn đang được xem xét. Bạn sẽ nhận được thông báo khi có kết quả.",
          duration: 5000,
        });
      } else {
        console.error("❌ Submit failed with status:", result.status);
        toast.error("❌ Submit hồ sơ thất bại", {
          description: result.message || "Vui lòng thử lại sau",
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

  const submittedCount = documents.filter(doc => doc.submissionId !== null).length;
  const totalCount = documents.length;

  const getStatusBadge = (doc: SubmittedDocument) => {
    // If has submissionId, show "Đã nộp" regardless of status
    if (doc.submissionId !== null) {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3" />Đã nộp</span>;
    }
    
    // If no submissionId, show "Chờ nộp"
    return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3" />Chờ nộp</span>;
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
      {/* Debug Button - Remove after testing */}
      {process.env.NODE_ENV === 'development' && (
        <Button onClick={testAPICall} variant="outline" className="bg-yellow-100">
          🧪 Test API Call
        </Button>
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
                            {doc.submissionId ? "Nộp lại" : "Tải lên"}
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Show selected file name */}
                    {selectedFiles[doc.documentId] && (
                      <div className="mb-2 p-2 bg-blue-50 rounded text-xs text-blue-800 flex items-center gap-2">
                        <span className="font-medium">File đã chọn:</span>
                        <span className="truncate flex-1">{selectedFiles[doc.documentId].name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(doc)}
                      </div>
                      {(doc.submissionId && uploadedFiles[doc.documentId]) && (
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]" title={uploadedFiles[doc.documentId]}>
                          📎 {uploadedFiles[doc.documentId]}
                        </p>
                      )}
                    </div>
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

