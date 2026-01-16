import { AppLayout } from "@/components/shared/app-layout";

export default function HeadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout allowedRoles={["HEAD_OF_DEPARTMENT"]}>
      {children}
    </AppLayout>
  );
}

