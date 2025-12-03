import { HeadNavbar } from "@/features/head/components/layout/head-navbar";
import { HeadSidebar } from "@/features/head/components/layout/head-sidebar";
import { RoleGuard } from "@/components/auth/role-guard";
import { Toaster } from "sonner";

export default function HeadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["HEAD_OF_DEPARTMENT"]}>
      <div className="min-h-screen bg-background">
        {/* Navbar */}
        <HeadNavbar />
        
        <div className="flex">
          {/* Sidebar */}
          <HeadSidebar />
          
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

