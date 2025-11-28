/**
 * Authentication Utilities
 * Helper functions để manage user authentication và session
 */

export interface UserData {
  id?: string;
  userName?: string;
  gmail?: string;
  accountImage?: string;
  role?: string;
  roles?: Array<{ roleName: string; [key: string]: any }>;
  token?: string;
  loginTime?: string;
  [key: string]: any;
}

/**
 * Lấy thông tin user từ localStorage
 */
export function getUser(): UserData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    return user;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Lưu thông tin user vào localStorage
 */
export function setUser(userData: UserData): void {
  if (typeof window === 'undefined') return;
  
  try {
    const dataToStore = {
      ...userData,
      loginTime: userData.loginTime || new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(dataToStore));
    localStorage.setItem('isAuthenticated', 'true');
    
    // Store token separately if available
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    
    console.log('💾 User data saved:', dataToStore);
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

/**
 * Kiểm tra user đã đăng nhập chưa
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  const user = getUser();
  
  return isAuth && user !== null;
}

/**
 * Lấy token từ localStorage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/**
 * Lấy role của user hiện tại
 */
export function getUserRole(): string | null {
  const user = getUser();
  if (!user) return null;
  
  // Try to get role from different possible fields
  return user.role || user.roles?.[0]?.roleName || null;
}

/**
 * Logout - Clear all auth data
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('token');
  
  console.log('👋 User logged out');
}

/**
 * Get redirect path based on user role
 */
export function getRoleRedirectPath(role?: string | null): string {
  const userRole = role || getUserRole();
  
  const roleRedirectMap: Record<string, string> = {
    'ADMIN': '/admin/dashboard',
    'ACADEMIC_STAFF_AFFAIR': '/admin/dashboard',
    'HEAD_OF_DEPARTMENT': '/head/dashboard',
    'TRAINING_DIRECTOR': '/manager/dashboard',
    'TRAINEE': '/trainees/dashboard',
  };

  return userRole ? (roleRedirectMap[userRole] || '/admin/dashboard') : '/admin/dashboard';
}

/**
 * Check if user has specific role
 */
export function hasRole(requiredRole: string): boolean {
  const userRole = getUserRole();
  return userRole === requiredRole;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(roles: string[]): boolean {
  const userRole = getUserRole();
  return userRole ? roles.includes(userRole) : false;
}

/**
 * Get user display name
 */
export function getUserDisplayName(): string {
  const user = getUser();
  if (!user) return 'Guest';
  
  return user.userName || user.gmail || 'User';
}

/**
 * Get user avatar URL
 */
export function getUserAvatar(): string | null {
  const user = getUser();
  return user?.accountImage || null;
}

