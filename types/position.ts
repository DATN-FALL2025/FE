/**
 * Position related types
 */

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data: T | null;
}

export interface Position {
  positionId: number;
  positionName: string;
  positionCode?: string;
  [key: string]: any;
}
