import { Navbar } from "@/features/trainees/components/layout/navbar";
import { Sidebar } from "@/features/trainees/components/layout/sidebar";
import { RoleGuard } from "@/components/auth/role-guard";
import { Toaster } from "sonner";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["TRAINEE"]}>
      <div className="min-h-screen bg-background">
        {/* Navbar */}
        <Navbar />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

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

