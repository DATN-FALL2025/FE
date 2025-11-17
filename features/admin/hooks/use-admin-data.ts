"use client";

import { useState, useEffect } from "react";
import { User, DashboardStats, DocumentSubmission, Department } from "../types";

export const useAdminData = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<DocumentSubmission[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Mock stats
      const mockStats: DashboardStats = {
        totalUsers: 1245,
        totalTrainees: 987,
        totalDepartments: 12,
        totalDocuments: 6891,
        pendingApprovals: 156,
        approvalRate: 94.5,
        activeUsers: 342,
        newUsersThisMonth: 48,
      };

      // Mock recent submissions
      const mockSubmissions: DocumentSubmission[] = [
        {
          id: "1",
          traineeName: "Tôn Thiện Hoàng Hiệp",
          traineeCode: "SE161662",
          documentType: "TOEIC Certificate",
          status: "pending",
          submittedAt: new Date("2024-10-08T10:30:00"),
        },
        {
          id: "2",
          traineeName: "Trần Duy Khanh",
          traineeCode: "SE173443",
          documentType: "Medical Certificate",
          status: "pending",
          submittedAt: new Date("2024-10-08T09:15:00"),
        },
        {
          id: "3",
          traineeName: "Huỳnh Văn Tường",
          traineeCode: "SE160853",
          documentType: "ID Card",
          status: "approved",
          submittedAt: new Date("2024-10-07T14:20:00"),
          reviewedAt: new Date("2024-10-07T15:00:00"),
          reviewedBy: "Admin",
        },
      ];

      // Mock departments
      const mockDepartments: Department[] = [
        {
          id: "1",
          name: "Pilot Training",
          code: "PT",
          description: "Commercial Pilot License programs",
          totalPrograms: 5,
          totalStudents: 342,
          createdAt: new Date("2023-01-15"),
        },
        {
          id: "2",
          name: "Cabin Crew",
          code: "CC",
          description: "Flight attendant training",
          totalPrograms: 3,
          totalStudents: 289,
          createdAt: new Date("2023-01-15"),
        },
        {
          id: "3",
          name: "Aircraft Maintenance",
          code: "AM",
          description: "Technical maintenance programs",
          totalPrograms: 4,
          totalStudents: 198,
          createdAt: new Date("2023-01-15"),
        },
      ];

      setStats(mockStats);
      setRecentSubmissions(mockSubmissions);
      setDepartments(mockDepartments);
      setLoading(false);
    };

    fetchData();
  }, []);

  return {
    stats,
    recentSubmissions,
    departments,
    loading,
  };
};

