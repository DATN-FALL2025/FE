/**
 * Route Paths Configuration
 * Centralized management of all application navigation routes
 */

/**
 * Admin Routes
 */
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  DEPARTMENTS: '/admin/departments',
  POSITIONS: '/admin/positions',
  DOCUMENTS: '/admin/documents',
  RULES: '/admin/rules',
} as const;

/**
 * Training Director Routes
 */
export const TRAINING_DIRECTOR_ROUTES = {
  DASHBOARD: '/training-director/dashboard',
  MATRIX: '/training-director/matrix',
} as const;

/**
 * Head Routes
 */
export const HEAD_ROUTES = {
  DASHBOARD: '/head/dashboard',
  MATRIX: '/head/matrix',
} as const;

/**
 * Academic Staff Routes
 */
export const ACADEMIC_STAFF_ROUTES = {
  DASHBOARD: '/academic-staff/dashboard',
  DOCUMENTS: '/academic-staff/documents',
  PROFILE: '/academic-staff/profile',
} as const;

/**
 * Trainees (Students) Routes
 */
export const TRAINEES_ROUTES = {
  DASHBOARD: '/trainees/dashboard',
  DOCUMENTS: '/trainees/documents',
  PROFILE: '/trainees/profile',
} as const;

/**
 * Authentication Routes
 */
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;

/**
 * Public Routes
 */
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;

/**
 * All Routes Combined
 */
export const ROUTES = {
  ADMIN: ADMIN_ROUTES,
  TRAINING_DIRECTOR: TRAINING_DIRECTOR_ROUTES,
  HEAD: HEAD_ROUTES,
  ACADEMIC_STAFF: ACADEMIC_STAFF_ROUTES,
  TRAINEES: TRAINEES_ROUTES,
  AUTH: AUTH_ROUTES,
  PUBLIC: PUBLIC_ROUTES,
} as const;

/**
 * Helper function to build dynamic routes
 */
export function buildRoute(path: string, params?: Record<string, string | number>): string {
  if (!params) return path;

  let result = path;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });

  return result;
}

/**
 * Helper function to check if route matches current path
 */
export function isActiveRoute(currentPath: string, routePath: string): boolean {
  return currentPath === routePath || currentPath.startsWith(routePath + '/');
}

/**
 * Get all routes for a specific role
 */
export function getRoutesByRole(role: 'ADMIN' | 'TRAINING_DIRECTOR' | 'HEAD' | 'ACADEMIC_STAFF' | 'TRAINEES') {
  switch (role) {
    case 'ADMIN':
      return ADMIN_ROUTES;
    case 'TRAINING_DIRECTOR':
      return TRAINING_DIRECTOR_ROUTES;
    case 'HEAD':
      return HEAD_ROUTES;
    case 'ACADEMIC_STAFF':
      return ACADEMIC_STAFF_ROUTES;
    case 'TRAINEES':
      return TRAINEES_ROUTES;
    default:
      return PUBLIC_ROUTES;
  }
}

/**
 * Route metadata for navigation
 */
export interface RouteMetadata {
  path: string;
  title: string;
  description?: string;
  icon?: string;
  requiresAuth?: boolean;
  allowedRoles?: string[];
}

/**
 * Route metadata mapping
 */
export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  // Admin routes
  [ADMIN_ROUTES.DASHBOARD]: {
    path: ADMIN_ROUTES.DASHBOARD,
    title: 'Admin Dashboard',
    description: 'Overview of system administration',
    requiresAuth: true,
    allowedRoles: ['ADMIN'],
  },
  [ADMIN_ROUTES.USERS]: {
    path: ADMIN_ROUTES.USERS,
    title: 'User Management',
    description: 'Manage system users and roles',
    requiresAuth: true,
    allowedRoles: ['ADMIN'],
  },
  [ADMIN_ROUTES.DEPARTMENTS]: {
    path: ADMIN_ROUTES.DEPARTMENTS,
    title: 'Department Management',
    description: 'Manage departments',
    requiresAuth: true,
    allowedRoles: ['ADMIN'],
  },
  [ADMIN_ROUTES.POSITIONS]: {
    path: ADMIN_ROUTES.POSITIONS,
    title: 'Position Management',
    description: 'Manage training positions',
    requiresAuth: true,
    allowedRoles: ['ADMIN'],
  },
  [ADMIN_ROUTES.DOCUMENTS]: {
    path: ADMIN_ROUTES.DOCUMENTS,
    title: 'Document Management',
    description: 'Manage documents and certificates',
    requiresAuth: true,
    allowedRoles: ['ADMIN'],
  },
  [ADMIN_ROUTES.RULES]: {
    path: ADMIN_ROUTES.RULES,
    title: 'Rule Templates',
    description: 'Manage document rule templates',
    requiresAuth: true,
    allowedRoles: ['ADMIN'],
  },

  // Training Director routes
  [TRAINING_DIRECTOR_ROUTES.DASHBOARD]: {
    path: TRAINING_DIRECTOR_ROUTES.DASHBOARD,
    title: 'Training Director Dashboard',
    description: 'Overview of training programs',
    requiresAuth: true,
    allowedRoles: ['TRAINING_DIRECTOR'],
  },
  [TRAINING_DIRECTOR_ROUTES.MATRIX]: {
    path: TRAINING_DIRECTOR_ROUTES.MATRIX,
    title: 'Document Matrix',
    description: 'Manage position-document matrix',
    requiresAuth: true,
    allowedRoles: ['TRAINING_DIRECTOR'],
  },

  // Head routes
  [HEAD_ROUTES.DASHBOARD]: {
    path: HEAD_ROUTES.DASHBOARD,
    title: 'Head Dashboard',
    description: 'Department overview',
    requiresAuth: true,
    allowedRoles: ['HEAD'],
  },
  [HEAD_ROUTES.MATRIX]: {
    path: HEAD_ROUTES.MATRIX,
    title: 'Document Matrix',
    description: 'View position-document matrix',
    requiresAuth: true,
    allowedRoles: ['HEAD'],
  },

  // Academic Staff routes
  [ACADEMIC_STAFF_ROUTES.DASHBOARD]: {
    path: ACADEMIC_STAFF_ROUTES.DASHBOARD,
    title: 'Academic Staff Dashboard',
    description: 'Academic staff overview',
    requiresAuth: true,
    allowedRoles: ['ACADEMIC_STAFF'],
  },
  [ACADEMIC_STAFF_ROUTES.DOCUMENTS]: {
    path: ACADEMIC_STAFF_ROUTES.DOCUMENTS,
    title: 'My Documents',
    description: 'View and manage documents',
    requiresAuth: true,
    allowedRoles: ['ACADEMIC_STAFF'],
  },
  [ACADEMIC_STAFF_ROUTES.PROFILE]: {
    path: ACADEMIC_STAFF_ROUTES.PROFILE,
    title: 'Profile',
    description: 'View and edit profile',
    requiresAuth: true,
    allowedRoles: ['ACADEMIC_STAFF'],
  },

  // Trainees routes
  [TRAINEES_ROUTES.DASHBOARD]: {
    path: TRAINEES_ROUTES.DASHBOARD,
    title: 'Trainee Dashboard',
    description: 'Trainee overview',
    requiresAuth: true,
    allowedRoles: ['TRAINEES'],
  },
  [TRAINEES_ROUTES.DOCUMENTS]: {
    path: TRAINEES_ROUTES.DOCUMENTS,
    title: 'My Documents',
    description: 'View training documents',
    requiresAuth: true,
    allowedRoles: ['TRAINEES'],
  },
  [TRAINEES_ROUTES.PROFILE]: {
    path: TRAINEES_ROUTES.PROFILE,
    title: 'Profile',
    description: 'View and edit profile',
    requiresAuth: true,
    allowedRoles: ['TRAINEES'],
  },
};

/**
 * Get route metadata
 */
export function getRouteMetadata(path: string): RouteMetadata | undefined {
  return ROUTE_METADATA[path];
}

/**
 * Check if user has access to route
 */
export function hasRouteAccess(path: string, userRole?: string): boolean {
  const metadata = getRouteMetadata(path);
  if (!metadata) return true; // Public route
  if (!metadata.requiresAuth) return true;
  if (!metadata.allowedRoles || metadata.allowedRoles.length === 0) return true;
  if (!userRole) return false;

  return metadata.allowedRoles.includes(userRole);
}
