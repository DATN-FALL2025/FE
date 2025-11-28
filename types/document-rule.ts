/**
 * Document Rule related types
 */

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data: T | null;
}

export interface DocumentRule {
  id?: number;
  documentRuleId?: number;
  documentRuleName: string;
  documentRuleDescription: string;
  documentId?: number;
  documentName?: string;
  documentRuleValueIds?: number[];
  document?: {
    documentId: number;
    documentName: string;
    documentCode: string;
  };
}
