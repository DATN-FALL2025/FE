/**
 * Document related types
 */

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data: T | null;
}

export interface Document {
  documentId: number;
  documentName: string;
  documentCode: string;
  documentDescription?: string;
  [key: string]: any;
}
