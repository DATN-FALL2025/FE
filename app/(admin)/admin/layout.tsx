import { AppLayout } from "@/components/shared/app-layout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout allowedRoles={["ADMIN"]}>
      {children}
    </AppLayout>
  );
}
