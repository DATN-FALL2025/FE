/**
 * Central export file for all server actions
 * Import các actions từ file này để tiện sử dụng
 * 
 * Example:
 * import { authenticateAccount, getAllDocuments } from '@/lib/actions';
 */

// Authentication Actions
export {
  authenticateAccount,
  createUser,
  getAllUsers,
  createRole,
  getAllRoles
} from './auth';

// Position Actions
export {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePositionById,
  deletePositionById
} from './position';

// Upload Actions
export {
  uploadFile,
  updateFile
} from './upload';

// Document Actions
export {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocumentById,
  deleteDocumentById
} from './document';

// Document Rule Actions
export {
  getAllDocumentRules,
  getDocumentRuleById,
  createDocumentRule,
  updateDocumentRuleById,
  deleteDocumentRuleById
} from './document-rule';

// Department Actions
export {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartmentById,
  deleteDepartmentById
} from './department';

// Trainee Submission Actions (Server)
export {
  getTraineeSubmissionDetail,
  getAllTraineeApplicationsByTrainee,
  getTraineeApplicationDetailByTrainee,
  uploadTraineeApplication,
  completeTraineeApplication,
  getAllTraineeApplicationsByStaffAcademic,
  filterTraineeApplicationsByPosition,
  getNearestBatch
} from './trainee-submission';

// Trainee Submission Actions (Client)
export {
  createTraineeSubmission,
  updateTraineeSubmission
} from './trainee-submission-client';

// Profile Actions
export {
  getProfile
} from './profile';

// Matrix Time Actions
export {
  getMatrixTimeDeadline,
  getMatrixTimeActive,
  setPendingStatusMatrix,
  setCompleteStatusMatrix
} from './matrix-time';
