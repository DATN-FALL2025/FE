export type UserRole = "admin" | "head_of_department" | "academic_staff" | "training_director" | "trainee";

export type AccountStatus = "active" | "banned" | "pending";

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  avatar?: string;
  department?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headOfDepartment?: string;
  totalPrograms: number;
  totalStudents: number;
  createdAt: Date;
}

export interface RuleType {
  id: string;
  name: string;
  description: string;
  category: "validation" | "requirement" | "workflow";
  isActive: boolean;
  createdAt: Date;
}

export interface Certificate {
  id: string;
  name: string;
  code: string;
  issuingOrganization: string;
  validityPeriod: string;
  isRequired: boolean;
  createdAt: Date;
}

export interface DashboardStats {
  totalUsers: number;
  totalTrainees: number;
  totalDepartments: number;
  totalDocuments: number;
  pendingApprovals: number;
  approvalRate: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

export interface DocumentSubmission {
  id: string;
  traineeName: string;
  traineeCode: string;
  documentType: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  rejectionReason?: string;
}

export interface TrainingProgram {
  id: string;
  name: string;
  code: string;
  trainingRole: "Pilot" | "Cabin Crew" | "Maintenance";
  department: string;
  totalTrainees: number;
  requiredDocuments: number;
  averageCompletion: number;
}

