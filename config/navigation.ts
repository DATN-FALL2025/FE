import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Shield,
  CheckSquare,
  UserCog,
  FileCheck,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface RoleNavigation {
  basePath: string;
  title: string;
  items: NavigationItem[];
}

export const navigationConfig: Record<string, RoleNavigation> = {
  ADMIN: {
    basePath: "/admin",
    title: "Trang Admin",
    items: [
      {
        name: "Trang chủ",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Quản lý người dùng",
        href: "/admin/users",
        icon: Users,
      },
      {
        name: "Quản lý khoa",
        href: "/admin/departments",
        icon: Building2,
      },
      {
        name: "Quản lý vị trí",
        href: "/admin/positions",
        icon: Users,
      },
      {
        name: "Quản lý tài liệu",
        href: "/admin/documents",
        icon: FileText,
      },
      {
        name: "Quản lý quy tắc",
        href: "/admin/rules",
        icon: Shield,
      },
    ],
  },
  HEAD_OF_DEPARTMENT: {
    basePath: "/head",
    title: "Trưởng Khoa",
    items: [
      {
        name: "Ma trận",
        href: "/head/matrix",
        icon: ClipboardList,
      },
      {
        name: "Xem quy tắc",
        href: "/head/view-rules",
        icon: Shield,
      },
      {
        name: "Hồ sơ",
        href: "/head/profile",
        icon: Users,
      },
    ],
  },
  ACADEMIC_STAFF_AFFAIR: {
    basePath: "/academic-staff",
    title: "Phòng Đào Tạo",
    items: [
      {
        name: "Phê duyệt",
        href: "/academic-staff/approvals",
        icon: CheckSquare,
      },
      {
        name: "Yêu cầu tài liệu",
        href: "/academic-staff/document-requirements",
        icon: FileCheck,
      },
      {
        name: "Hồ sơ",
        href: "/academic-staff/profile",
        icon: Users,
      },
    ],
  },
  TRAINING_DIRECTOR: {
    basePath: "/training-director",
    title: "Giám Đốc Đào Tạo",
    items: [
      {
        name: "Trang chủ",
        href: "/training-director/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Phê duyệt",
        href: "/training-director/approvals",
        icon: CheckSquare,
      },
      {
        name: "Quản lý đợt",
        href: "/training-director/batch-management",
        icon: UserCog,
      },
      {
        name: "Ma trận",
        href: "/training-director/matrix",
        icon: ClipboardList,
      },
      {
        name: "Xem quy tắc",
        href: "/training-director/view-rules",
        icon: Shield,
      },
      {
        name: "Hồ sơ",
        href: "/training-director/profile",
        icon: Users,
      },
    ],
  },
  TRAINEE: {
    basePath: "/trainees",
    title: "Học Viên",
    items: [
      {
        name: "Trang chủ",
        href: "/trainees/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Tài liệu",
        href: "/trainees/documents",
        icon: FileText,
      },
      {
        name: "Yêu cầu tài liệu",
        href: "/trainees/document-requirements",
        icon: FileCheck,
      },
      {
        name: "Hồ sơ",
        href: "/trainees/profile",
        icon: Users,
      },
    ],
  },
};
