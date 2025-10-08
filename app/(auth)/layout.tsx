export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-muted/20 flex items-center justify-center p-4">
      {children}
    </div>
  );
}

