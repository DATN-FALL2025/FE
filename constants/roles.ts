/**
 * User Role Constants
 * Định nghĩa các role chuẩn theo API backend
 */

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  HEAD_OF_DEPARTMENT: 'HEAD_OF_DEPARTMENT',
  ACADEMIC_STAFF_AFFAIR: 'ACADEMIC_STAFF_AFFAIR',
  TRAINING_DIRECTOR: 'TRAINING_DIRECTOR',
  TRAINEE: 'TRAINEE',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Role display names (for UI)
 */
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.HEAD_OF_DEPARTMENT]: 'Head of Department',
  [USER_ROLES.ACADEMIC_STAFF_AFFAIR]: 'Academic Staff Affair',
  [USER_ROLES.TRAINING_DIRECTOR]: 'Training Director',
  [USER_ROLES.TRAINEE]: 'Trainee',
};

/**
 * Role descriptions
 */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: 'System administrator with full access',
  [USER_ROLES.HEAD_OF_DEPARTMENT]: 'Department head with management access',
  [USER_ROLES.ACADEMIC_STAFF_AFFAIR]: 'Academic staff with document management access',
  [USER_ROLES.TRAINING_DIRECTOR]: 'Training director with program oversight',
  [USER_ROLES.TRAINEE]: 'Trainee with limited access to personal documents',
};
