import { AdminNavbar } from "@/features/admin/components/layout/admin-navbar";
import { AdminSidebar } from "@/features/admin/components/layout/admin-sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <AdminNavbar />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
          <div className="container mx-auto p-6 lg:p-8">
            {children}
          </div>
      </div>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
