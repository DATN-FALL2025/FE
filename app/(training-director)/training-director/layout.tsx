import { TrainingDirectorNavbar } from "@/features/training-director/components/layout/training-director-navbar";
import { TrainingDirectorSidebar } from "@/features/training-director/components/layout/training-director-sidebar";
import { RoleGuard } from "@/components/auth/role-guard";
import { Toaster } from "sonner";

export default function TrainingDirectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["TRAINING_DIRECTOR"]}>
      <div className="min-h-screen bg-background">
        {/* Navbar */}
        <TrainingDirectorNavbar />

        <div className="flex">
          {/* Sidebar */}
          <TrainingDirectorSidebar />

          {/* Main Content */}
          
            <div className="container mx-auto p-6 lg:p-8">
              {children}
            </div>
          
        </div>

        {/* Toast Notifications */}
        <Toaster position="top-right" richColors />
      </div>
    </RoleGuard>
  );
}
