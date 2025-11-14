export default function TrainingDirectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Training Director layout completely independent
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
