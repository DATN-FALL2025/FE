import { AdminNavbar } from "@/features/admin/components/layout/admin-navbar";
import { AdminSidebar } from "@/features/admin/components/layout/admin-sidebar";

export default function DashboardLayout({
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
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
      </div>
    </div>
  );
}

