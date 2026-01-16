import { AppLayout } from "@/components/shared/app-layout";

export default function TrainingDirectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout allowedRoles={["TRAINING_DIRECTOR"]}>
      {children}
    </AppLayout>
  );
}
