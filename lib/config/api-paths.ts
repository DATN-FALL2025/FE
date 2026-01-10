/**
 * API Paths Configuration
 * Centralized management of all API endpoints
 */

/**
 * API Base URL - Loaded from environment variable
 * Set NEXT_PUBLIC_API_URL in .env file
 * @see .env.example for configuration template
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://manage-and-automate-aviation-academy-application-production.up.railway.app';

/**
 * Authentication & Account APIs
 */
export const AUTH_PATHS = {
  AUTHENTICATE: '/api/account/v1/authenticateAccount',
  CREATE_USER: '/api/account/v1/createUser',
  GET_ALL_USERS: '/api/account/v1/getAllUser',
  CREATE_ROLE: '/api/account/v1/createRole',
  GET_ALL_ROLES: '/api/account/v1/getAllRole',
} as const;

/**
 * Position Management APIs
 */
export const POSITION_PATHS = {
  GET_ALL: '/api/position/getAllPossition',
  GET_BY_ID: (id: number) => `/api/position/getPositionById/${id}`,
  CREATE: '/api/position/createPosition',
  UPDATE_BY_ID: (id: number) => `/api/position/updatePositionById${id}`,
  DELETE_BY_ID: (id: number) => `/api/position/deletePositionById${id}`,
} as const;

/**
 * Document Management APIs
 */
export const DOCUMENT_PATHS = {
  GET_ALL: '/api/admin/documents',
  GET_BY_ID: (id: number) => `/api/admin/documents/${id}`,
  CREATE: '/api/admin/documents/create',
  UPDATE_BY_ID: (id: number) => `/api/admin/documents/${id}`,
  DELETE_BY_ID: (id: number) => `/api/admin/documents/${id}`,
} as const;

/**
 * Document Rule Management APIs
 */
export const DOCUMENT_RULE_PATHS = {
  GET_ALL: '/api/admin/document-rules',
  GET_BY_ID: (id: number) => `/api/admin/document-rules/${id}`,
  CREATE: '/api/admin/document-rules/create',
  UPDATE_BY_ID: (id: number) => `/api/admin/document-rules/${id}`,
  DELETE_BY_ID: (id: number) => `/api/admin/document-rules/${id}`,
} as const;

/**
 * Department Management APIs
 */
export const DEPARTMENT_PATHS = {
  GET_ALL: '/api/department/v1/getAllDepartment',
  GET_BY_ID: (id: number) => `/api/department/v1/getDepartmentById/${id}`,
  CREATE: '/api/department/v1/createDepartment',
  UPDATE_BY_ID: (id: number) => `/api/department/v1/updateDepartmentById/${id}`,
  DELETE_BY_ID: (id: number) => `/api/department/v1/deleteDepartmentById/${id}`,
} as const;

/**
 * Matrix Management APIs
 */
export const MATRIX_PATHS = {
  // Get operations
  GET_ALL: '/api/matrix/getAllMatrix',
  GET_BY_DEPARTMENT: (departmentId: number) => `/api/matrix/department/${departmentId}`,

  // Add operations (rows = positions, columns = documents)
  ADD_ROW: '/api/matrix/addRow',
  ADD_MULTIPLE_ROWS: '/api/matrix/addMultipleRow',
  ADD_COLUMN: '/api/matrix/addColum',
  ADD_MULTIPLE_COLUMNS: '/api/matrix/addMultipleColum',

  // Delete operations
  DELETE_ROW: (positionId: number) => `/api/matrix/deleteRow/${positionId}`,
  DELETE_COLUMN: (documentId: number) => `/api/matrix/deleteColumn/${documentId}`,
  DELETE_ALL_COLUMNS: '/api/matrix/deleteAllColumns',
  CLEAR_MATRIX: '/api/matrix/clearMatrix',
} as const;

/**
 * Upload/File Management APIs
 */
export const UPLOAD_PATHS = {
  UPLOAD_FILE: '/api/admin/uploads/file',
  UPDATE_FILE: (oldPublicId: string) => `/api/admin/uploads/file?oldPublicId=${oldPublicId}`,
} as const;

/**
 * Helper function to build full URL
 */
export function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

/**
 * Helper function to build URL with query parameters
 */
export function buildApiUrlWithQuery(path: string, params: Record<string, any>): string {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  return queryString ? `${API_BASE_URL}${path}?${queryString}` : `${API_BASE_URL}${path}`;
}

/**
 * Type-safe path builder
 */
export const API_PATHS = {
  AUTH: AUTH_PATHS,
  POSITION: POSITION_PATHS,
  DOCUMENT: DOCUMENT_PATHS,
  DOCUMENT_RULE: DOCUMENT_RULE_PATHS,
  DEPARTMENT: DEPARTMENT_PATHS,
  MATRIX: MATRIX_PATHS,
  UPLOAD: UPLOAD_PATHS,
} as const;
