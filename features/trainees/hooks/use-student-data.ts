"use client";

import { useState, useEffect } from "react";
import { StudentInfo, Document, SubmissionProgress, Notification } from "../types";
import { getUser, getDecodedToken } from "@/lib/auth-utils";
import {
  getAllTraineeApplicationsByTrainee,
  getTraineeApplicationDetailByTrainee,
} from "@/lib/actions";

// Export TraineeApplication type
export interface TraineeApplication {
  id: string;
  courseName: string;
  courseCode: string;
  status: string;
  positionName?: string;
  departmentName?: string;
  enrollmentDate?: Date;
}

// Interface for API response
interface SubmittedDocument {
  submissionId: number | null;
  documentId: number;
  requiredDocumentName: string;
  apply_or_not: string;
  submissionStatus?: string;
  url?: string | null;
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

// Helper function to get token from localStorage
const getClientToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
};

// Map API status to Document status
const mapSubmissionStatus = (doc: SubmittedDocument): Document["status"] => {
  if (doc.submissionId === null || doc.apply_or_not === "Not apply") {
    return "not_submitted";
  }
  
  switch (doc.submissionStatus) {
    case "Approve":
    case "Approved":
      return "approved";
    case "Reject":
    case "Rejected":
      return "rejected";
    case "Pending":
    default:
      return "pending_review";
  }
};

export const useStudentData = () => {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [progress, setProgress] = useState<SubmissionProgress | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicationDetail, setApplicationDetail] = useState<ApplicationDetail | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Get real user data from auth
        const authUser = getUser();
        const decodedToken = getDecodedToken();
        const token = getClientToken();

        console.log("🔑 Dashboard - Token:", token ? "Yes" : "No");

        // Fetch trainee applications from API
        const applicationsRes: any = await getAllTraineeApplicationsByTrainee(token);
        
        console.log("📋 Dashboard - Applications Response:", applicationsRes);
        
        let appDetail: ApplicationDetail | null = null;
        let apiDocuments: SubmittedDocument[] = [];

        if ((applicationsRes.status === "success" || applicationsRes.status === "200 OK") && applicationsRes.data) {
          const applications = Array.isArray(applicationsRes.data) ? applicationsRes.data : [];
          
          if (applications.length > 0) {
            const activeApp = applications[0];
            const traineeApplicationId = activeApp.traineeApplicationId;

            // Fetch application detail
            const detailRes: any = await getTraineeApplicationDetailByTrainee(traineeApplicationId, token);
            
            console.log("📄 Dashboard - Detail Response:", detailRes);
            
            if ((detailRes.status === "200 OK" || detailRes.status === "success") && detailRes.data) {
              appDetail = detailRes.data;
              apiDocuments = detailRes.data.submittedDocuments || [];
              setApplicationDetail(appDetail);
              console.log("✅ Dashboard - Application Detail set:", appDetail);
            }
          }
        }

        // Build student info from API data or auth
        const mockStudent: StudentInfo = {
          id: authUser?.id || authUser?.userName || "STUDENT001",
          fullName: appDetail?.fullName || authUser?.userName || decodedToken?.sub || "Student",
          studentCode: authUser?.studentCode || authUser?.id || "STUDENT001",
          email: decodedToken?.gmail || authUser?.gmail || authUser?.email || "",
          phone: authUser?.phone || "",
          program: appDetail?.positionName || "",
          trainingRole: "Other",
          courseCode: authUser?.courseCode || "",
          courseName: appDetail?.departmentName || "",
          enrollmentDate: appDetail?.traineeApplicationCreateAt 
            ? new Date(appDetail.traineeApplicationCreateAt) 
            : (authUser?.enrollmentDate ? new Date(authUser.enrollmentDate) : new Date()),
          avatar: authUser?.accountImage,
        };

        // Map API documents to Document type
        const mappedDocuments: Document[] = apiDocuments.map((doc, index) => ({
          id: String(doc.documentId),
          name: doc.requiredDocumentName || `Document ${index + 1}`,
          type: "other" as const,
          status: mapSubmissionStatus(doc),
          required: true,
          fileName: doc.url || undefined,
          fileSize: 0,
          uploadedAt: doc.submissionId ? new Date() : undefined,
          maxSize: 10,
          allowedFormats: ["PDF", "JPG", "PNG"],
        }));

        // Calculate progress from real data
        const totalDocs = mappedDocuments.length;
        const submittedDocs = mappedDocuments.filter(d => d.status !== "not_submitted").length;
        const approvedDocs = mappedDocuments.filter(d => d.status === "approved").length;
        const rejectedDocs = mappedDocuments.filter(d => d.status === "rejected").length;
        const pendingDocs = mappedDocuments.filter(d => d.status === "pending_review" || d.status === "submitted").length;

        const mockProgress: SubmissionProgress = {
          totalDocuments: totalDocs || 1,
          submittedDocuments: submittedDocs,
          approvedDocuments: approvedDocs,
          rejectedDocuments: rejectedDocs,
          pendingDocuments: pendingDocs,
          completionPercentage: totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0,
          deadline: appDetail?.traineeApplicationCreateAt 
            ? new Date(new Date(appDetail.traineeApplicationCreateAt).getTime() + 30 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          daysRemaining: 30,
        };

        // Build notifications based on document status
        const mockNotifications: Notification[] = [];
        
        // Add notification for rejected documents
        const rejectedDocsList = mappedDocuments.filter(d => d.status === "rejected");
        rejectedDocsList.forEach((doc, idx) => {
          mockNotifications.push({
            id: `rejected-${doc.id}`,
            title: "Tài liệu bị từ chối",
            message: `Tài liệu "${doc.name}" đã bị từ chối. Vui lòng nộp lại.`,
            type: "error",
            timestamp: new Date(),
            read: false,
            actionUrl: "/trainees/documents",
          });
        });

        // Add notification for approved documents
        if (approvedDocs > 0) {
          mockNotifications.push({
            id: "approved-summary",
            title: "Tài liệu đã duyệt",
            message: `${approvedDocs} tài liệu đã được phê duyệt.`,
            type: "success",
            timestamp: new Date(),
            read: false,
          });
        }

        // Add deadline reminder
        if (totalDocs > approvedDocs) {
          mockNotifications.push({
            id: "deadline-reminder",
            title: "Nhắc nhở deadline",
            message: `Còn ${totalDocs - approvedDocs} tài liệu cần hoàn thành.`,
            type: "warning",
            timestamp: new Date(),
            read: true,
          });
        }

        setStudent(mockStudent);
        setDocuments(mappedDocuments);
        setProgress(mockProgress);
        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Error fetching student data:", error);
        
        // Fallback to basic data if API fails
        const authUser = getUser();
        setStudent({
          id: authUser?.id || "STUDENT001",
          fullName: authUser?.userName || "Student",
          studentCode: authUser?.studentCode || "STUDENT001",
          email: authUser?.gmail || "",
          phone: "",
          program: "N/A",
          trainingRole: "Other",
          courseCode: "",
          courseName: "N/A",
          enrollmentDate: new Date(),
          avatar: authUser?.accountImage,
        });
        setDocuments([]);
        setProgress({
          totalDocuments: 0,
          submittedDocuments: 0,
          approvedDocuments: 0,
          rejectedDocuments: 0,
          pendingDocuments: 0,
          completionPercentage: 0,
          deadline: new Date(),
          daysRemaining: 0,
        });
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const refreshData = async () => {
    setLoading(true);
    // Re-trigger the useEffect by updating a dependency
    // For now, just call the fetch logic again
    const token = getClientToken();
    try {
      const applicationsRes: any = await getAllTraineeApplicationsByTrainee(token);
      if ((applicationsRes.status === "success" || applicationsRes.status === "200 OK") && applicationsRes.data) {
        const applications = Array.isArray(applicationsRes.data) ? applicationsRes.data : [];
        if (applications.length > 0) {
          const activeApp = applications[0];
          const detailRes: any = await getTraineeApplicationDetailByTrainee(activeApp.traineeApplicationId, token);
          if ((detailRes.status === "200 OK" || detailRes.status === "success") && detailRes.data) {
            const apiDocuments = detailRes.data.submittedDocuments || [];
            const mappedDocuments: Document[] = apiDocuments.map((doc: SubmittedDocument, index: number) => ({
              id: String(doc.documentId),
              name: doc.requiredDocumentName || `Document ${index + 1}`,
              type: "other" as const,
              status: mapSubmissionStatus(doc),
              required: true,
              fileName: doc.url || undefined,
              fileSize: 0,
              uploadedAt: doc.submissionId ? new Date() : undefined,
              maxSize: 10,
              allowedFormats: ["PDF", "JPG", "PNG"],
            }));
            setDocuments(mappedDocuments);
            
            const totalDocs = mappedDocuments.length;
            const approvedDocs = mappedDocuments.filter(d => d.status === "approved").length;
            const pendingDocs = mappedDocuments.filter(d => d.status === "pending_review" || d.status === "submitted").length;
            const rejectedDocs = mappedDocuments.filter(d => d.status === "rejected").length;
            
            setProgress(prev => prev ? {
              ...prev,
              totalDocuments: totalDocs,
              approvedDocuments: approvedDocs,
              pendingDocuments: pendingDocs,
              rejectedDocuments: rejectedDocs,
              completionPercentage: totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0,
            } : null);
          }
        }
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    student,
    documents,
    progress,
    notifications,
    loading,
    applicationDetail,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refreshData,
  };
};
