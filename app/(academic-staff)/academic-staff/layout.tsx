import { AppLayout } from "@/components/shared/app-layout";

export default function AcademicStaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout allowedRoles={["ACADEMIC_STAFF_AFFAIR"]}>
      {children}
    </AppLayout>
  );
}
