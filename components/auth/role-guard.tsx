"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole, isAuthenticated, getRoleRedirectPath } from "@/lib/auth-utils";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

/**
 * Component bảo vệ route theo role
 * Sử dụng trong layout hoặc page để chặn access không hợp lệ
 */
export function RoleGuard({ children, allowedRoles, redirectTo }: RoleGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Check role authorization
    const userRole = getUserRole();
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      // User doesn't have permission
      // Redirect to their appropriate dashboard or specified path
      const redirectPath = redirectTo || getRoleRedirectPath(userRole);
      router.push(redirectPath);
      setIsChecking(false);
      return;
    }

    // User has access
    setHasAccess(true);
    setIsChecking(false);
  }, [router, allowedRoles, redirectTo]);

  // Show loading state while checking
  if (isChecking || !hasAccess) {
    return null; // Return null to avoid hydration mismatch
  }

  return <>{children}</>;
}
