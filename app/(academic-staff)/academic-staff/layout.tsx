export default function AcademicStaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Academic Staff layout completely independent from Admin and Head
  // No shared components to avoid CSS conflicts
  return (
    <div className="min-h-screen bg-background">
      <main className="w-full">
        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
