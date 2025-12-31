# Matrix Workflow Implementation

## Overview
Implemented the complete workflow for matrix management between Head of Department and Training Director roles.

## API Functions Added (lib/actions/matrix.ts)

### 1. `setMatrixDraftedByDepartment(departmentId: number)`
- **Endpoint**: `PUT /api/matrix/set-drafted/{departmentID}_for_head_department`
- **Purpose**: Head of Department submits matrix for review
- **Returns**: Status message confirming matrices updated to DRAFTED status

### 2. `setPendingStatusMatrixForTrainingDirector(payload)`
- **Endpoint**: `POST /api/matrix/setPendintStatusMatrix_for_training_director`
- **Purpose**: Training Director sets deadline for matrix review
- **Payload**:
  ```typescript
  {
    startDate_deadLine: string; // ISO 8601 format
    endDate_deadLine: string;   // ISO 8601 format
  }
  ```
- **Returns**: Updated matrix data with PENDING status and deadlines

### 3. `setMatrixStatusForTrainingDirector(departmentId, statusEnum, rejectReason?)`
- **Endpoint**: `PUT /api/matrix/set-status/department/{departmentId}_for_training_director_approve_or_reject`
- **Purpose**: Training Director approves or rejects department matrix
- **Parameters**:
  - `departmentId`: Department ID
  - `statusEnum`: 'Approve' | 'Reject'
  - `rejectReason`: Optional reason for rejection (required if rejecting)
- **Returns**: Status message confirming approval/rejection

## UI Updates

### Head of Department Page (app/(head)/head/matrix/page.tsx)

**New Features:**
- **Department Detection**: Automatically detects user's department from JWT token
  - Extracts `departmentId` and `departmentName` from decoded JWT
  - Displays department name in page header
  - Filters matrix data to show only positions from user's department
  - Debug logs show department ID and name in console
  
- **"Gửi để xét duyệt" Button**: Submits the department's matrix for Training Director review
  - Calls `setMatrixDraftedByDepartment()` API
  - Disabled when no matrix data exists
  - Shows loading state during submission
  - Displays success/error toast notifications

### Training Director Page (app/(training-director)/training-director/matrix/page.tsx)

**New Features:**

1. **"Thiết lập Deadline" Button**: Opens dialog to set review deadlines
   - Date/time pickers for start and end dates
   - Calls `setPendingStatusMatrixForTrainingDirector()` API
   - Sets PENDING status for all matrices with deadline

2. **Department-Level Actions**: When filtering by specific department
   - **"Phê duyệt" Button**: Approve department matrix
   - **"Từ chối" Button**: Reject department matrix with reason
   - Shows department name and description
   - Only visible when a specific department is selected (not "All Departments")

3. **Approve/Reject Dialog**:
   - Approve: Simple confirmation
   - Reject: Requires rejection reason input
   - Calls `setMatrixStatusForTrainingDirector()` API
   - Shows appropriate success/error messages

## Workflow Flow

1. **Head of Department**:
   - Configures matrix (checks required documents for positions)
   - Clicks "Gửi để xét duyệt" to submit for review
   - Matrix status changes to DRAFTED

2. **Training Director**:
   - Clicks "Thiết lập Deadline" to set review period
   - All matrices get PENDING status with start/end dates
   - Filters by specific department
   - Reviews department matrix
   - Clicks "Phê duyệt" to approve OR "Từ chối" to reject (with reason)
   - Matrix status updates to Approved or Rejected

## Technical Details

- All API calls include proper error handling
- Loading states prevent duplicate submissions
- Toast notifications provide user feedback
- Matrix data auto-reloads after successful operations
- Form validation ensures required fields are filled
- Dialogs can be cancelled without making changes
