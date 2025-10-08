import { Navbar } from "@/features/students/components/layout/navbar";
import { Sidebar } from "@/features/students/components/layout/sidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
          <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
      </div>
    </div>
  );
}

