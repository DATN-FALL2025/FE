"use client";

import { useState, useEffect } from "react";

// Mock user role hook for demo purposes
export const useRole = () => {
  const [userRole, setUserRole] = useState<string | null>("student");

  const hasRole = (role: string) => {
    return userRole === role;
  };

  const hasAnyRole = (roles: string[]) => {
    return roles.some((role) => hasRole(role));
  };

  return {
    userRole,
    hasRole,
    hasAnyRole,
  };
};

