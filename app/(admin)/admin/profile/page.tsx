"use client";

import ProfilePage from "@/components/shared/profile-page";
import { useAuthInfo } from "@/hooks/use-auth-info";

export default function AdminProfilePage() {
  const { role } = useAuthInfo();
  
  return <ProfilePage role={role || "ADMIN"} />;
}
