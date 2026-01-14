"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to users page
    router.replace("/admin/users");
  }, [router]);

  return null;
}

