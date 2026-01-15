import { AppLayout } from "@/components/shared/app-layout";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout allowedRoles={["TRAINEE"]}>
      {children}
    </AppLayout>
  );
}

