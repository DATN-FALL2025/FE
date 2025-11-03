export type DocumentStatus = 
  | "not_submitted"
  | "submitted"
  | "approved"
  | "rejected"
  | "pending_review";

export type DocumentType =
  | "diploma"
  | "id_card"
  | "photo_3x4"
  | "toeic_certificate"
  | "ielts_certificate"
  | "judicial_record"
  | "medical_certificate"
  | "professional_certificate"
  | "guardian_consent"
  | "other";

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  required: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  uploadedAt?: Date;
  reviewedAt?: Date;
  rejectionReason?: string;
  validityPeriod?: string;
  expiryDate?: Date;
  maxSize: number; // in MB
  allowedFormats: string[];
  conditionalRules?: string[];
}

export interface TraineeInfo {
  id: string;
  fullName: string;
  traineeCode: string;
  email: string;
  phone: string;
  avatar?: string;
  program: string;
  trainingRole: "Pilot" | "Cabin Crew" | "Maintenance" | "Other";
  courseCode: string;
  courseName: string;
  enrollmentDate: Date;
}

export interface SubmissionProgress {
  totalDocuments: number;
  submittedDocuments: number;
  approvedDocuments: number;
  rejectedDocuments: number;
  pendingDocuments: number;
  completionPercentage: number;
  deadline: Date;
  daysRemaining: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface UploadResponse {
  success: boolean;
  documentId: string;
  fileName: string;
  message?: string;
  errors?: string[];
}

