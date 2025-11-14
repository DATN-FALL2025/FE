"use client";

import { useState, useEffect } from 'react';
import { 
  getUser, 
  getUserRole, 
  getUserDisplayName, 
  getUserAvatar,
  isAuthenticated,
  getToken,
  logout as logoutUtil,
  type UserData 
} from '@/lib/auth-utils';
import { useRouter } from 'next/navigation';

/**
 * Custom hook để manage authentication state
 * Usage: const { user, isAuth, logout } = useAuthInfo();
 */
export function useAuthInfo() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user info on mount
    const loadUser = () => {
      const userData = getUser();
      const authenticated = isAuthenticated();
      
      setUser(userData);
      setIsAuth(authenticated);
      setIsLoading(false);
    };

    loadUser();

    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'isAuthenticated') {
        loadUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    logoutUtil();
    setUser(null);
    setIsAuth(false);
    router.push('/login');
  };

  const refreshUser = () => {
    const userData = getUser();
    setUser(userData);
  };

  return {
    user,
    isAuth,
    isLoading,
    role: getUserRole(),
    displayName: getUserDisplayName(),
    avatar: getUserAvatar(),
    token: getToken(),
    logout,
    refreshUser,
  };
}

/**
 * Hook để protect routes - redirect nếu chưa login
 */
export function useRequireAuth() {
  const router = useRouter();
  const { isAuth, isLoading } = useAuthInfo();

  useEffect(() => {
    if (!isLoading && !isAuth) {
      router.push('/login');
    }
  }, [isAuth, isLoading, router]);

  return { isAuth, isLoading };
}

/**
 * Hook để check role-based access
 */
export function useRoleCheck(allowedRoles: string[]) {
  const { role, isAuth } = useAuthInfo();
  
  const hasAccess = isAuth && role && allowedRoles.includes(role);
  
  return {
    hasAccess,
    role,
    isAuth
  };
}

