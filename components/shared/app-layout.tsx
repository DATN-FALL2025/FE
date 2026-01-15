import { RoleGuard } from "@/components/auth/role-guard";
import { Toaster } from "sonner";
import { AppNavbar } from "./app-navbar";
import { AppSidebar } from "./app-sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const AppLayout = ({ children, allowedRoles }: AppLayoutProps) => {
  return (
    <RoleGuard allowedRoles={allowedRoles}>
      <div className="min-h-screen bg-background">
        {/* Navbar */}
        <AppNavbar />

        <div className="flex">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <main className="flex-1 lg:pl-64">
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
};
