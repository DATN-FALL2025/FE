/**
 * Department related types
 */

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data: T | null;
}

export interface Department {
  departmentId: number;
  departmentName: string;
  departmentCode?: string;
  [key: string]: any;
}
