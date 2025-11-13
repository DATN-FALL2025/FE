import { HeadNavbar } from "@/features/head/components/layout/head-navbar";
import { HeadSidebar } from "@/features/head/components/layout/head-sidebar";

export default function HeadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
    </div>
  );
}

