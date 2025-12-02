"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  getAllPositions,
  getAllDocuments,
  getAllTraineeApplicationsByTrainee,
  getTraineeApplicationDetailByTrainee,
  createTraineeSubmission,
  uploadTraineeApplication,
  completeTraineeApplication,
} from "@/lib/actions";

interface DocumentItem {
  id: number;
  documentName: string;
  documentDescription: string;
  required?: boolean;
  submissionId?: number;
  submitted?: boolean;
  fileUrl?: string;
  fileName?: string;
}

interface PositionItem {
  positionId: number;
  positionName: string;
  positionDescription: string;
}

export default function StudentDocumentsPage() {
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState<PositionItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [traineeApplicationId, setTraineeApplicationId] = useState<number | null>(null);
  const [uploadingDocs, setUploadingDocs] = useState<Set<number>>(new Set());
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Fetch positions and trainee applications on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Fetch positions
        const positionsRes = await getAllPositions();
        if (positionsRes.status === "success" && positionsRes.data) {
          setPositions(Array.isArray(positionsRes.data) ? positionsRes.data : []);
        }

        // Fetch trainee applications
        const applicationsRes = await getAllTraineeApplicationsByTrainee();
        if (applicationsRes.status === "success" && applicationsRes.data) {
          const applications = Array.isArray(applicationsRes.data) ? applicationsRes.data : [];
          // Get the most recent or active application
          if (applications.length > 0) {
            const activeApp = applications[0];
            setTraineeApplicationId(activeApp.traineeApplicationId);
            if (activeApp.position?.positionId) {
              setSelectedPosition(String(activeApp.position.positionId));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Không thể tải dữ liệu ban đầu");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch documents when position changes
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!selectedPosition || !traineeApplicationId) return;

      try {
        const docsRes = await getAllDocuments();
        if (docsRes.status === "success" && docsRes.data) {
          const allDocs = Array.isArray(docsRes.data) ? docsRes.data : [];

          // Fetch application detail to get submissions
          const appDetailRes = await getTraineeApplicationDetailByTrainee(traineeApplicationId);
          const submissions = appDetailRes.data?.traineeSubmissions || [];

          // Map documents with submission status
          const mappedDocs = allDocs.map((doc: any) => {
            const submission = submissions.find((sub: any) => sub.document?.documentId === doc.documentId);
            return {
              id: doc.documentId,
              documentName: doc.documentName,
              documentDescription: doc.documentDescription,
              required: true,
              submitted: !!submission,
              submissionId: submission?.traineeSubmissionId,
              fileName: submission?.submissionName,
              fileUrl: submission?.submissionDocumentUrl,
            };
          });

          setDocuments(mappedDocs);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast.error("Không thể tải danh sách tài liệu");
      }
    };

    fetchDocuments();
  }, [selectedPosition, traineeApplicationId]);

  const handleFileUpload = async (docId: number) => {
    const fileInput = fileInputRefs.current[docId];
    if (!fileInput) return;

    const file = fileInput.files?.[0];
    if (!file) {
      toast.error("Vui lòng chọn file");
      return;
    }

    if (!traineeApplicationId) {
      toast.error("Không tìm thấy đơn đăng ký");
      return;
    }

    try {
      setUploadingDocs((prev) => new Set(prev).add(docId));

      const result = await createTraineeSubmission({
        documentID: docId,
        traineeApplicationId: traineeApplicationId,
        submissionName: file.name,
        takeNote: "Submitted via web portal",
        submissionDocumentFile: file,
      });

      if (result.status === "success") {
        toast.success(`Nộp tài liệu "${documents.find(d => d.id === docId)?.documentName}" thành công`);

        // Refresh documents
        const appDetailRes = await getTraineeApplicationDetailByTrainee(traineeApplicationId);
        const submissions = appDetailRes.data?.traineeSubmissions || [];

        setDocuments((prev) =>
          prev.map((doc) => {
            if (doc.id === docId) {
              const submission = submissions.find((sub: any) => sub.document?.documentId === docId);
              return {
                ...doc,
                submitted: true,
                submissionId: submission?.traineeSubmissionId,
                fileName: file.name,
              };
            }
            return doc;
          })
        );
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

  const handleUploadAll = async () => {
    if (!traineeApplicationId) {
      toast.error("Không tìm thấy đơn đăng ký");
      return;
    }

    const unsubmittedDocs = documents.filter(doc => !doc.submitted);
    if (unsubmittedDocs.length === 0) {
      toast.info("Tất cả tài liệu đã được nộp");
      return;
    }

    toast.info(`Bạn cần nộp ${unsubmittedDocs.length} tài liệu còn lại`);
  };

  const handleUpdateAll = async () => {
    if (!traineeApplicationId) {
      toast.error("Không tìm thấy đơn đăng ký");
      return;
    }

    try {
      const result = await uploadTraineeApplication(traineeApplicationId);
      if (result.status === "success") {
        toast.success("Cập nhật hồ sơ tổng thành công");
      } else {
        toast.error(result.message || "Cập nhật hồ sơ thất bại");
      }
    } catch (error) {
      console.error("Error updating application:", error);
      toast.error("Lỗi khi cập nhật hồ sơ");
    }
  };

  const submittedCount = documents.filter(doc => doc.submitted).length;
  const requiredCount = documents.filter(doc => doc.required).length;

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
        {/* Left Column - Position Selection */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-2">Vị Trí Đăng Ký</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Chọn vị trí bạn muốn ứng tuyển
            </p>

            {/* Position Dropdown */}
            <div className="space-y-2 mb-8">
              <label className="text-sm font-medium">
                Vị trí <span className="text-red-500">*</span>
              </label>
              <Select value={selectedPosition} onValueChange={setSelectedPosition} disabled={!traineeApplicationId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn vị trí" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos.positionId} value={String(pos.positionId)}>
                      {pos.positionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Document Statistics */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tài liệu bắt buộc</span>
                <span className="font-bold">{requiredCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Đã tải lên</span>
                <span className="font-bold">{submittedCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tiến độ</span>
                <span className="font-bold">
                  {documents.length > 0 ? Math.round((submittedCount / documents.length) * 100) : 0}%
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
            <div className="space-y-3 mb-6">
              {documents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có tài liệu nào được yêu cầu</p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">
                          {doc.documentName}
                          {doc.required && <span className="text-red-500 ml-1">*</span>}
                        </p>
                        {doc.submitted && (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      {doc.fileName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          <FileText className="w-3 h-3 inline mr-1" />
                          {doc.fileName}
                        </p>
                      )}
                    </div>
                    <input
                      ref={(el) => (fileInputRefs.current[doc.id] = el)}
                      type="file"
                      className="hidden"
                      onChange={() => handleFileUpload(doc.id)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => fileInputRefs.current[doc.id]?.click()}
                      disabled={uploadingDocs.has(doc.id)}
                    >
                      {uploadingDocs.has(doc.id) ? (
                        <>Đang tải...</>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          {doc.submitted ? "Nộp lại" : "Tải lên"}
                        </>
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 border-t pt-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
                onClick={handleUploadAll}
                disabled={!traineeApplicationId}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Hồ Sơ Tổng
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={handleUpdateAll}
                disabled={!traineeApplicationId || submittedCount === 0}
              >
                Update Hồ Sơ Tổng
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

