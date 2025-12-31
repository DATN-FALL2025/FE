import { AcademicStaffNavbar } from "@/features/academic-staff/components/layout/academic-staff-navbar";
import { AcademicStaffSidebar } from "@/features/academic-staff/components/layout/academic-staff-sidebar";
import { RoleGuard } from "@/components/auth/role-guard";
import { Toaster } from "sonner";

export default function AcademicStaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["ACADEMIC_STAFF_AFFAIR"]}>
      <div className="min-h-screen bg-background">
        {/* Navbar */}
        <AcademicStaffNavbar />

        <div className="flex">
          {/* Sidebar */}
          <AcademicStaffSidebar />

          {/* Main Content */}
          <main className="flex-1 ">
            <div className="container mx-auto p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>

        {/* Toast Notifications */}
        <Toaster position="top-right" richColors />
      </div>
    </RoleGuard>
  );
}
