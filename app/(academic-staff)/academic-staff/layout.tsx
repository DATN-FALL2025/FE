import { AcademicStaffNavbar } from "@/features/academic-staff/components/layout/academic-staff-navbar";
import { AcademicStaffSidebar } from "@/features/academic-staff/components/layout/academic-staff-sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function AcademicStaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <AcademicStaffNavbar />

      <div className="flex">
        {/* Sidebar */}
        <AcademicStaffSidebar />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
