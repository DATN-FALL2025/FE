/**
 * Authentication related types
 */

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data: T | null;
}

export interface AuthData {
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
