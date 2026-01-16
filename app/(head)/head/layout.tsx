import { RoleGuard } from "@/components/auth/role-guard";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/head/components/layout/app-sidebar";
import { Navbar } from "@/features/head/components/layout/navbar";
import { Toaster } from "sonner";

export default function HeadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["HEAD_OF_DEPARTMENT"]}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <main className="flex-1 p-4 sm:p-6">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </SidebarInset>
        <Toaster position="top-right" richColors closeButton />
      </SidebarProvider>
    </RoleGuard>
  );
}

