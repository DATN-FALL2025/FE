"use client";

import { useState, useEffect } from "react";
import { StudentInfo, Document, SubmissionProgress, Notification } from "../types";
import { getUser } from "@/lib/auth-utils";

// Mock data hook - replace with actual API calls
export const useStudentData = () => {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [progress, setProgress] = useState<SubmissionProgress | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      
      // Get real user data from auth
      const authUser = getUser();
      
      // Mock student data with real user info
      const mockStudent: StudentInfo = {
        id: authUser?.id || authUser?.userName || "STUDENT001",
        fullName: authUser?.userName || "Student",
        studentCode: authUser?.studentCode || authUser?.id || "STUDENT001",
        email: authUser?.gmail || authUser?.email || "",
        phone: authUser?.phone || "",
        program: authUser?.program || "Software Engineering",
        trainingRole: authUser?.trainingRole || "Trainee",
        courseCode: authUser?.courseCode || "",
        courseName: authUser?.courseName || "Aviation Academy Training",
        enrollmentDate: authUser?.enrollmentDate ? new Date(authUser.enrollmentDate) : new Date(),
        avatar: authUser?.accountImage,
      };

      // Mock documents
      const mockDocuments: Document[] = [
        {
          id: "1",
          name: "High School Diploma",
          type: "diploma",
          status: "approved",
          required: true,
          fileName: "diploma_SE161662.pdf",
          fileSize: 2.5,
          uploadedAt: new Date("2024-10-01"),
          reviewedAt: new Date("2024-10-02"),
          maxSize: 5,
          allowedFormats: ["PDF", "JPG", "PNG"],
        },
        {
          id: "2",
          name: "ID Card / Passport",
          type: "id_card",
          status: "approved",
          required: true,
          fileName: "id_card_SE161662.pdf",
          fileSize: 1.2,
          uploadedAt: new Date("2024-10-01"),
          reviewedAt: new Date("2024-10-02"),
          maxSize: 5,
          allowedFormats: ["PDF", "JPG", "PNG"],
        },
        {
          id: "3",
          name: "3x4 Photo",
          type: "photo_3x4",
          status: "rejected",
          required: true,
          fileName: "photo_SE161662.jpg",
          fileSize: 0.8,
          uploadedAt: new Date("2024-10-01"),
          reviewedAt: new Date("2024-10-02"),
          rejectionReason: "Photo does not meet 3x4 cm standard. Background must be white.",
          maxSize: 1,
          allowedFormats: ["JPG", "PNG"],
        },
        {
          id: "4",
          name: "TOEIC Certificate",
          type: "toeic_certificate",
          status: "submitted",
          required: true,
          fileName: "toeic_SE161662.pdf",
          fileSize: 1.5,
          uploadedAt: new Date("2024-10-03"),
          maxSize: 5,
          allowedFormats: ["PDF"],
          conditionalRules: ["Minimum score: 600"],
        },
        {
          id: "5",
          name: "Medical Certificate",
          type: "medical_certificate",
          status: "not_submitted",
          required: true,
          validityPeriod: "6 months",
          maxSize: 5,
          allowedFormats: ["PDF", "JPG"],
        },
        {
          id: "6",
          name: "Judicial Record",
          type: "judicial_record",
          status: "not_submitted",
          required: true,
          validityPeriod: "3 months",
          maxSize: 5,
          allowedFormats: ["PDF"],
        },
        {
          id: "7",
          name: "Professional Certificate",
          type: "professional_certificate",
          status: "not_submitted",
          required: false,
          maxSize: 5,
          allowedFormats: ["PDF", "JPG", "PNG"],
        },
      ];

      // Mock progress
      const mockProgress: SubmissionProgress = {
        totalDocuments: 7,
        submittedDocuments: 4,
        approvedDocuments: 2,
        rejectedDocuments: 1,
        pendingDocuments: 1,
        completionPercentage: 28.5, // 2/7 approved
        deadline: new Date("2024-11-15"),
        daysRemaining: 38,
      };

      // Mock notifications
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "Document Rejected",
          message: "Your 3x4 Photo has been rejected. Please resubmit.",
          type: "error",
          timestamp: new Date("2024-10-02T14:30:00"),
          read: false,
          actionUrl: "/students/documents",
        },
        {
          id: "2",
          title: "Document Approved",
          message: "Your High School Diploma has been approved.",
          type: "success",
          timestamp: new Date("2024-10-02T10:00:00"),
          read: false,
        },
        {
          id: "3",
          title: "Deadline Reminder",
          message: "38 days remaining to complete all required documents.",
          type: "warning",
          timestamp: new Date("2024-10-01T09:00:00"),
          read: true,
        },
      ];

      setStudent(mockStudent);
      setDocuments(mockDocuments);
      setProgress(mockProgress);
      setNotifications(mockNotifications);
      setLoading(false);
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

  return {
    student,
    documents,
    progress,
    notifications,
    loading,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };
};

