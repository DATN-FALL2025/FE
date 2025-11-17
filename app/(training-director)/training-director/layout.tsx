import { TrainingDirectorNavbar } from "@/features/training-director/components/layout/training-director-navbar";
import { TrainingDirectorSidebar } from "@/features/training-director/components/layout/training-director-sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function TrainingDirectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <TrainingDirectorNavbar />

      <div className="flex">
        {/* Sidebar */}
        <TrainingDirectorSidebar />

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
