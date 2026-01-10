"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AcademicStaffDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/academic-staff/approvals");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
