import { Navbar } from "@/features/trainees/components/layout/navbar";
import { Sidebar } from "@/features/trainees/components/layout/sidebar";

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
          <div className="container mx-auto p-6 lg:p-8">
            {children}
          </div>
      </div>
    </div>
  );
}

