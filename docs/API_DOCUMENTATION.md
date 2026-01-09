# 📚 API Documentation - Aviation Academy System

**Version:** 2.0  
**Last Updated:** December 31, 2025  
**Base URL:** `https://manage-and-automate-aviation-academy-application-production.up.railway.app`  
**API Docs:** `/v3/api-docs`

---

## 📋 Table of Contents

1. [Server Information](#server-information)
2. [API Implementation Status](#api-implementation-status)
3. [Authentication](#authentication)
4. [Trainee Submission](#trainee-submission)
5. [Trainee Application](#trainee-application)
6. [Position Management](#position-management)
7. [Batch Management](#batch-management)
8. [Input Document Matrix](#input-document-matrix)
9. [Document Rule Value](#document-rule-value)
10. [Upload Management](#upload-management)
11. [Document Management](#document-management)
12. [Document Rule Management](#document-rule-management)
13. [Department Management](#department-management)
14. [Account Management](#account-management)

---

## 🌐 Server Information

**Production Server:**
```
https://manage-and-automate-aviation-academy-application-production.up.railway.app
```

**API Documentation:**
```
https://manage-and-automate-aviation-academy-application-production.up.railway.app/v3/api-docs
```

---

## � API Impleamentation Status

### ✅ APIs Đã Có UI (Implemented)

#### Authentication & Account
- ✅ `POST /api/account/v1/authenticateAccount` - Login
- ✅ `POST /api/account/v1/createUser` - Register
- ✅ `POST /api/account/v1/createRole` - Create Role
- ✅ `GET /api/account/v1/getAllUser` - Get All Users
- ✅ `GET /api/account/v1/getAllRole` - Get All Roles
- ✅ `POST /api/account/multipleAccounts` - Import Multiple Accounts

#### Trainee Submission
- ✅ `POST /api/trainee_submission/create_trainee_submission_by_trainee` - Create Submission
- ✅ `PUT /api/trainee_submission/update` - Update Submission
- ✅ `GET /api/trainee_submission/get_trainee_submission_detail/{id}` - Get Detail

#### Trainee Application
- ✅ `GET /api/trainee_application/get_all_application_by_trainee` - Get All by Trainee
- ✅ `GET /api/trainee_application/get_trainee_application_detail_by_trainee/{id}` - Get Detail by Trainee
- ✅ `GET /api/trainee_application/get_trainee_application_detail_by_staff/{id}` - Get Detail by Staff
- ✅ `GET /api/trainee_application/get_all_trainee_application_by_staff_academic_affair` - Get All by Staff
- ✅ `GET /api/trainee_application/get_trainee_application_list_by_status_by_staff_academic_staff_affair` - Get by Status
- ✅ `PUT /api/trainee_application/{traineeApplicationId}/complete` - Complete Application

#### Position Management
- ✅ `GET /api/position/getAllPossition` - Get All Positions
- ✅ `GET /api/position/getPositionById/{id}` - Get Position by ID
- ✅ `POST /api/position/createPosition` - Create Position
- ✅ `PUT /api/position/updatePositionById/{id}` - Update Position
- ✅ `DELETE /api/position/deletePositionById/{id}` - Delete Position

#### Matrix Management
- ✅ `GET /api/matrix/getAllMatrix` - Get All Matrix
- ✅ `GET /api/matrix/department/{departmentID}` - Get by Department
- ✅ `POST /api/matrix/addRow_for_training_director` - Add Row
- ✅ `POST /api/matrix/addMultipleRow_for_training_director` - Add Multiple Rows
- ✅ `POST /api/matrix/addColum_for_training_director` - Add Column
- ✅ `POST /api/matrix/addMultipleColum_for_training_director` - Add Multiple Columns
- ✅ `POST /api/matrix/clickToCellMatrix_for_head_of_department` - Toggle Cell
- ✅ `POST /api/matrix/setPendintStatusMatrix_for_training_director` - Set Pending
- ✅ `PUT /api/matrix/set-drafted/{departmentID}_for_head_department` - Set Drafted
- ✅ `PUT /api/matrix/set-status/department/{departmentId}_for_training_director_approve_or_reject` - Approve/Reject
- ✅ `PUT /api/matrix/setCompleteStatusToActive_for_training_director` - Set Active
- ✅ `DELETE /api/matrix/deleteRow_for_training_director/{positionId}` - Delete Row
- ✅ `DELETE /api/matrix/deleteColumn_for_training_director/{documentId}` - Delete Column
- ✅ `DELETE /api/matrix/deleteAllRow_for_training_director` - Delete All Rows
- ✅ `DELETE /api/matrix/deleteAllColumns_for_training_director` - Delete All Columns
- ✅ `DELETE /api/matrix/clearMatrix_for_training_director` - Clear Matrix

#### Document Management
- ✅ `GET /api/admin/documents` - Get All Documents
- ✅ `GET /api/admin/documents/{id}` - Get Document by ID
- ✅ `GET /api/admin/documents/{id}/with-rules` - Get with Rules
- ✅ `GET /api/admin/documents/all-with-rules` - Get All with Rules
- ✅ `POST /api/admin/documents/create` - Create Document
- ✅ `POST /api/admin/documents/create-with-rules` - Create with Rules
- ✅ `PUT /api/admin/documents/{id}` - Update Document
- ✅ `DELETE /api/admin/documents/{id}` - Delete Document

#### Document Rules
- ✅ `GET /api/admin/document-rules` - Get All Rules
- ✅ `GET /api/admin/document-rules/{id}` - Get Rule by ID
- ✅ `POST /api/admin/document-rules/create` - Create Rule
- ✅ `PUT /api/admin/document-rules/{id}` - Update Rule
- ✅ `DELETE /api/admin/document-rules/{id}` - Delete Rule

#### Department Management
- ✅ `GET /api/admin/departments` - Get All Departments
- ✅ `GET /api/admin/departments/{id}` - Get Department by ID
- ✅ `POST /api/admin/departments/create` - Create Department
- ✅ `PUT /api/admin/departments/{id}` - Update Department
- ✅ `DELETE /api/admin/departments/{id}` - Delete Department

#### Upload Management
- ✅ `POST /api/admin/uploads/file` - Upload File

---

### 🔴 APIs Chưa Có UI (Not Implemented)

#### 🔥 Mức Độ Ưu Tiên Cao (High Priority)

##### 1. Batch Management (Quản lý Khóa Học)
**Vai trò:** Admin, Training Director

- ❌ `GET /api/batch` - Lấy danh sách batch
- ❌ `GET /api/batch/active-batch` - Lấy batch đang active
- ❌ `POST /api/batch/create-batch` - Tạo batch mới
- ❌ `PUT /api/batch/update-batch/{id}` - Cập nhật batch
- ❌ `DELETE /api/batch/delete-batch/{id}` - Xóa batch

**Mô tả:** Quản lý các khóa học/batch tuyển sinh. Cần thiết để phân loại và tổ chức học viên theo từng đợt tuyển sinh.

##### 2. OTP Verification (Xác Thực OTP)
**Vai trò:** Tất cả users

- ❌ `POST /api/account/v1/verify-otp` - Xác thực OTP
- ❌ `POST /api/account/v1/send-otp-again` - Gửi lại OTP

**Mô tả:** Tăng cường bảo mật cho hệ thống với xác thực 2 lớp qua email.

##### 3. Profile Management (Quản Lý Profile)
**Vai trò:** Tất cả users

- ❌ `GET /api/account/profile` - Lấy thông tin profile

**Mô tả:** Cho phép người dùng xem và quản lý thông tin cá nhân.

#### ⚠️ Mức Độ Ưu Tiên Trung Bình (Medium Priority)

##### 4. Document Rule Value (Giá Trị Quy Tắc Tài Liệu)
**Vai trò:** Admin, Training Director

- ❌ `POST /api/document_rule_value/create_document_rule_value` - Tạo giá trị rule
- ❌ `PUT /api/document_rule_value/update_document_rule_value` - Cập nhật giá trị rule

**Mô tả:** Quản lý các giá trị cụ thể cho quy tắc tài liệu (ví dụ: kích thước file, định dạng cho phép).

##### 5. Matrix Dashboard & Statistics
**Vai trò:** Training Director, Head of Department

- ❌ `GET /api/matrix/matrix_details` - Chi tiết matrix
- ❌ `GET /api/matrix/input_matrix_document_dashboard` - Dashboard matrix
- ❌ `GET /api/matrix/get_matrix_filter_by_position_department` - Lọc matrix theo position & department

**Mô tả:** Dashboard và thống kê chi tiết về ma trận tài liệu, giúp theo dõi và phân tích dữ liệu.

##### 6. Account Position Assignment
**Vai trò:** Admin

- ❌ `POST /api/account/add_position_to_account` - Gán position cho account

**Mô tả:** Gán vị trí công việc cho tài khoản người dùng.

#### 📝 Mức Độ Ưu Tiên Thấp (Low Priority)

##### 7. Upload File Update
**Vai trò:** Admin

- ❌ `PUT /api/admin/uploads/file` - Cập nhật file đã upload

**Mô tả:** Thay thế file đã upload bằng file mới.

##### 8. Overall Statistics & Dashboard
**Vai trò:** Academic Staff, Trainee

- ❌ `GET /api/trainee_application/overall-stats_trainee_application_for_staff_academic_affair` - Thống kê tổng quan cho staff
- ❌ `GET /api/trainee_application/TraineeApplicationDashboardByTrainee` - Dashboard cho trainee

**Mô tả:** Các dashboard và thống kê tổng quan cho từng vai trò.

---

### 📊 Tổng Kết Implementation Status

| Category | Total APIs | Implemented | Not Implemented | Progress |
|----------|-----------|-------------|-----------------|----------|
| **Authentication** | 9 | 6 | 3 | 67% |
| **Trainee Submission** | 3 | 3 | 0 | 100% |
| **Trainee Application** | 8 | 6 | 2 | 75% |
| **Position** | 5 | 5 | 0 | 100% |
| **Batch** | 5 | 0 | 5 | 0% |
| **Matrix** | 19 | 16 | 3 | 84% |
| **Document Rule Value** | 2 | 0 | 2 | 0% |
| **Upload** | 2 | 1 | 1 | 50% |
| **Document** | 8 | 8 | 0 | 100% |
| **Document Rules** | 5 | 5 | 0 | 100% |
| **Department** | 5 | 5 | 0 | 100% |
| **TOTAL** | **71** | **55** | **16** | **77%** |

---

## 🔐 Authentication

### Login
**Endpoint:** `POST /api/account/v1/authenticateAccount`

**Request Body:**
```json
{
  "userName": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": "JWT_TOKEN_STRING"
}
```

### Get User Profile
**Endpoint:** `GET /api/account/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": {
    "id": "number",
    "userName": "string",
    "gmail": "string",
    "role": "string",
    "accountImage": "string"
  }
}
```

### Create User
**Endpoint:** `POST /api/account/v1/createUser`

**Request Body:**
```json
{
  "userName": "string",
  "password": "string",
  "gmail": "string",
  "accountImage": "string"
}
```

### Create Role
**Endpoint:** `POST /api/account/v1/createRole`

**Request Body:**
```json
{
  "roleName": "ACADEMIC_STAFF_AFFAIR"
}
```

### Get All Users
**Endpoint:** `GET /api/account/v1/getAllUser`

### Get All Roles
**Endpoint:** `GET /api/account/v1/getAllRole`

### Import Multiple Accounts
**Endpoint:** `POST /api/account/multipleAccounts`

**Request Body:**
```json
{
  "accounts": [
    {
      "userName": "string",
      "password": "string",
      "gmail": "string",
      "role": "string"
    }
  ]
}
```

### Add Position to Account
**Endpoint:** `POST /api/account/add_position_to_account`

**Request Body:**
```json
{
  "accountId": "number",
  "positionId": "number"
}
```

### OTP Verification
**Endpoint:** `POST /api/account/v1/verify-otp`

**Request Body:**
```json
{
  "gmail": "string",
  "otp": "string"
}
```

### Send OTP Again
**Endpoint:** `POST /api/account/v1/send-otp-again`

**Request Body:**
```json
{
  "gmail": "string"
}
```

---

## 📝 Trainee Submission

### Create Trainee Submission
**Endpoint:** `POST /api/trainee_submission/create_trainee_submission_by_trainee`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `documentID` (string) - ID of the required document
- `traineeApplicationId` (string) - ID of the trainee application
- `requireDocumentName` (string) - Name of the required document
- `takeNote` (string) - Optional notes
- `submissionDocumentFile` (binary) - The document file

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": {
    "submissionId": "number",
    "documentId": "number",
    "traineeApplicationId": "number",
    "url": "string",
    "submissionStatus": "string"
  }
}
```

### Update Trainee Submission
**Endpoint:** `PUT /api/trainee_submission/update/{submissionID}`

**Path Parameters:**
- `submissionID` (integer) - ID of the submission to update

**Content-Type:** `multipart/form-data`

**Form Data:**
- `newSubmissionName` (string) - Optional
- `newTakeNote` (string) - Optional
- `newSubmissionDocumentFile` (binary) - Optional

### Get Trainee Submission Detail
**Endpoint:** `GET /api/trainee_submission/get_trainee_submission_detail/{trainee_submission_id}`

**Path Parameters:**
- `trainee_submission_id` (integer)

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": {
    "submissionId": "number",
    "documentId": "number",
    "requiredDocumentName": "string",
    "url": "string",
    "submissionStatus": "string",
    "takeNote": "string"
  }
}
```

---

## 📋 Trainee Application

### Complete Trainee Application
**Endpoint:** `PUT /api/trainee_application/{traineeApplicationId}/complete`

**Path Parameters:**
- `traineeApplicationId` (integer)

### Get All Applications by Trainee
**Endpoint:** `GET /api/trainee_application/get_all_application_by_trainee`

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": [
    {
      "traineeApplicationId": "number",
      "traineeApplicationStatus": "string",
      "positionName": "string",
      "departmentName": "string"
    }
  ]
}
```

### Get Application Detail by Trainee
**Endpoint:** `GET /api/trainee_application/get_trainee_application_detail_by_trainee/{trainee_application_id}`

**Path Parameters:**
- `trainee_application_id` (integer)

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": {
    "traineeApplicationId": "number",
    "traineeApplicationStatus": "string",
    "positionName": "string",
    "departmentName": "string",
    "submittedDocuments": [
      {
        "submissionId": "number",
        "documentId": "number",
        "requiredDocumentName": "string",
        "apply_or_not": "string",
        "submissionStatus": "string",
        "url": "string"
      }
    ]
  }
}
```

### Get Application Detail by Staff
**Endpoint:** `GET /api/trainee_application/get_trainee_application_detail_by_staff/{trainee_application_id}`

**Path Parameters:**
- `trainee_application_id` (integer)

### Get All Applications by Staff (Academic Affairs)
**Endpoint:** `GET /api/trainee_application/get_all_trainee_application_by_staff_academic_affair`

### Get Applications by Status (Academic Staff)
**Endpoint:** `GET /api/trainee_application/get_trainee_application_list_by_status_by_staff_academic_staff_affair`

**Query Parameters:**
- `status` (string) - Application status filter

### Get Overall Statistics (Academic Staff)
**Endpoint:** `GET /api/trainee_application/overall-stats_trainee_application_for_staff_academic_affair`

**Status:** ❌ Not Implemented

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": {
    "totalApplications": "number",
    "pendingApplications": "number",
    "approvedApplications": "number",
    "rejectedApplications": "number",
    "completedApplications": "number"
  }
}
```

### Get Trainee Application Dashboard
**Endpoint:** `GET /api/trainee_application/TraineeApplicationDashboardByTrainee`

**Status:** ❌ Not Implemented

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": {
    "totalApplications": "number",
    "pendingDocuments": "number",
    "completedDocuments": "number",
    "applicationStatus": "string",
    "recentActivities": []
  }
}
```

---

## 📍 Position Management

### Get All Positions
**Endpoint:** `GET /api/position/getAllPossition`

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": [
    {
      "positionId": "number",
      "positionName": "string",
      "positionDescription": "string",
      "positionImage": "string"
    }
  ]
}
```

### Get Position by ID
**Endpoint:** `GET /api/position/getPositionById/{position_id}`

**Path Parameters:**
- `position_id` (integer)

### Create Position
**Endpoint:** `POST /api/position/createPosition`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `positionName` (string)
- `positionDescription` (string)
- `positionImage` (binary)

### Update Position
**Endpoint:** `PUT /api/position/updatePositionById/{position_id}`

**Path Parameters:**
- `position_id` (integer)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `positionName` (string)
- `positionDescription` (string)
- `positionImage` (binary)

### Delete Position
**Endpoint:** `DELETE /api/position/deletePositionById/{position_id}`

**Path Parameters:**
- `position_id` (integer)

---

## 📊 Input Document Matrix

### Get All Matrix
**Endpoint:** `GET /api/matrix/getAllMatrix`

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": [
    {
      "matrixId": "number",
      "positionId": "number",
      "documentId": "number",
      "required": "boolean",
      "departmentId": "number"
    }
  ]
}
```

### Get Matrix by Department
**Endpoint:** `GET /api/matrix/department/{departmentID}`

**Path Parameters:**
- `departmentID` (integer)

### Get Matrix Details
**Endpoint:** `GET /api/matrix/matrix_details`

**Status:** ❌ Not Implemented

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": {
    "totalMatrices": "number",
    "totalPositions": "number",
    "totalDocuments": "number",
    "matrixByDepartment": []
  }
}
```

### Get Matrix Dashboard
**Endpoint:** `GET /api/matrix/input_matrix_document_dashboard`

**Status:** ❌ Not Implemented

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": {
    "statistics": {},
    "recentActivities": [],
    "pendingApprovals": []
  }
}
```

### Get Matrix Filter by Position & Department
**Endpoint:** `GET /api/matrix/get_matrix_filter_by_position_department`

**Status:** ❌ Not Implemented

**Query Parameters:**
- `positionId` (integer)
- `departmentId` (integer)

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": [
    {
      "matrixId": "number",
      "positionId": "number",
      "documentId": "number",
      "required": "boolean"
    }
  ]
}
```



### Add Single Row (Position)
**Endpoint:** `POST /api/matrix/addRow_for_training_director`

**Request Body:**
```json
{
  "positionId": "number"
}
```

### Add Multiple Rows
**Endpoint:** `POST /api/matrix/addMultipleRow_for_training_director`

**Request Body:**
```json
{
  "positionIds": ["number"]
}
```

### Add Single Column (Document)
**Endpoint:** `POST /api/matrix/addColum_for_training_director`

**Request Body:**
```json
{
  "documentId": "number"
}
```

### Add Multiple Columns
**Endpoint:** `POST /api/matrix/addMultipleColum_for_training_director`

**Request Body:**
```json
{
  "documentIds": ["number"]
}
```

### Click to Cell (Toggle Required)
**Endpoint:** `POST /api/matrix/clickToCellMatrix_for_head_of_department`

**Request Body:**
```json
{
  "matrixId": "number",
  "required": "boolean"
}
```

### Set Pending Status
**Endpoint:** `POST /api/matrix/setPendintStatusMatrix_for_training_director`

**Request Body:**
```json
{
  "startDate": "string",
  "endDate": "string"
}
```

### Set Drafted Status (Head of Department)
**Endpoint:** `PUT /api/matrix/set-drafted/{departmentID}_for_head_department`

**Path Parameters:**
- `departmentID` (integer)

### Set Status by Department (Training Director Approve/Reject)
**Endpoint:** `PUT /api/matrix/set-status/department/{departmentId}_for_training_director_approve_or_reject`

**Path Parameters:**
- `departmentId` (integer)

**Request Body:**
```json
{
  "status": "string",
  "rejectReason": "string"
}
```

### Set Complete Status to Active
**Endpoint:** `PUT /api/matrix/setCompleteStatusToActive_for_training_director`

### Delete Row (Position)
**Endpoint:** `DELETE /api/matrix/deleteRow_for_training_director/{positionId}`

**Path Parameters:**
- `positionId` (integer)

### Delete Column (Document)
**Endpoint:** `DELETE /api/matrix/deleteColumn_for_training_director/{documentId}`

**Path Parameters:**
- `documentId` (integer)

### Delete All Rows
**Endpoint:** `DELETE /api/matrix/deleteAllRow_for_training_director`

### Delete All Columns
**Endpoint:** `DELETE /api/matrix/deleteAllColumns_for_training_director`

### Clear Matrix
**Endpoint:** `DELETE /api/matrix/clearMatrix_for_training_director`

---

## � Batch nManagement

### Get All Batches
**Endpoint:** `GET /api/batch`

**Status:** ❌ Not Implemented

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": [
    {
      "batchId": "number",
      "batchName": "string",
      "batchDescription": "string",
      "startDate": "string",
      "endDate": "string",
      "isActive": "boolean"
    }
  ]
}
```

### Get Active Batch
**Endpoint:** `GET /api/batch/active-batch`

**Status:** ❌ Not Implemented

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": {
    "batchId": "number",
    "batchName": "string",
    "batchDescription": "string",
    "startDate": "string",
    "endDate": "string",
    "isActive": true
  }
}
```

### Create Batch
**Endpoint:** `POST /api/batch/create-batch`

**Status:** ❌ Not Implemented

**Request Body:**
```json
{
  "batchName": "string",
  "batchDescription": "string",
  "startDate": "string",
  "endDate": "string"
}
```

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": {
    "batchId": "number",
    "batchName": "string",
    "batchDescription": "string",
    "startDate": "string",
    "endDate": "string",
    "isActive": "boolean"
  }
}
```

### Update Batch
**Endpoint:** `PUT /api/batch/update-batch/{id}`

**Status:** ❌ Not Implemented

**Path Parameters:**
- `id` (integer) - Batch ID

**Request Body:**
```json
{
  "batchName": "string",
  "batchDescription": "string",
  "startDate": "string",
  "endDate": "string",
  "isActive": "boolean"
}
```

### Delete Batch
**Endpoint:** `DELETE /api/batch/delete-batch/{id}`

**Status:** ❌ Not Implemented

**Path Parameters:**
- `id` (integer) - Batch ID

**Response:**
```json
{
  "status": "string",
  "message": "Batch deleted successfully"
}
```

---

## 📐 Document Rule Value

### Create Document Rule Value
**Endpoint:** `POST /api/document_rule_value/create_document_rule_value`

**Status:** ❌ Not Implemented

**Request Body:**
```json
{
  "documentId": "number",
  "ruleId": "number",
  "value": "string"
}
```

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": {
    "documentRuleValueId": "number",
    "documentId": "number",
    "ruleId": "number",
    "value": "string"
  }
}
```

### Update Document Rule Value
**Endpoint:** `PUT /api/document_rule_value/update_document_rule_value`

**Status:** ❌ Not Implemented

**Request Body:**
```json
{
  "documentRuleValueId": "number",
  "value": "string"
}
```

**Response:**
```json
{
  "status": "string",
  "message": "Document rule value updated successfully",
  "data": {
    "documentRuleValueId": "number",
    "value": "string"
  }
}
```

---

## 📤 Upload Management

### Upload File
**Endpoint:** `POST /api/admin/uploads/file`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (binary) - File to upload

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": {
    "url": "string",
    "publicId": "string"
  }
}
```

### Update File
**Endpoint:** `PUT /api/admin/uploads/file`

**Status:** ❌ Not Implemented

**Query Parameters:**
- `oldPublicId` (string) - Public ID of the file to replace

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (binary) - New file

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": {
    "url": "string",
    "publicId": "string"
  }
}
```

---

## 📄 Document Management

### Get All Documents
**Endpoint:** `GET /api/admin/documents`

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": [
    {
      "documentId": "number",
      "documentName": "string",
      "documentDescription": "string"
    }
  ]
}
```

### Get Document by ID
**Endpoint:** `GET /api/admin/documents/{id}`

**Path Parameters:**
- `id` (integer)

### Get Document with Rules
**Endpoint:** `GET /api/admin/documents/{id}/with-rules`

**Path Parameters:**
- `id` (integer)

### Get All Documents with Rules
**Endpoint:** `GET /api/admin/documents/all-with-rules`

### Create Document
**Endpoint:** `POST /api/admin/documents/create`

**Request Body:**
```json
{
  "documentName": "string",
  "documentDescription": "string"
}
```

### Create Document with Rules
**Endpoint:** `POST /api/admin/documents/create-with-rules`

**Request Body:**
```json
{
  "documentName": "string",
  "documentDescription": "string",
  "rules": [
    {
      "ruleId": "number",
      "value": "string"
    }
  ]
}
```

### Update Document
**Endpoint:** `PUT /api/admin/documents/{id}`

**Path Parameters:**
- `id` (integer)

**Request Body:**
```json
{
  "documentName": "string",
  "documentDescription": "string"
}
```

### Delete Document
**Endpoint:** `DELETE /api/admin/documents/{id}`

**Path Parameters:**
- `id` (integer)

---

## 📋 Document Rule Management

### Get All Document Rules
**Endpoint:** `GET /api/admin/document-rules`

### Get Document Rule by ID
**Endpoint:** `GET /api/admin/document-rules/{id}`

**Path Parameters:**
- `id` (integer)

### Create Document Rule
**Endpoint:** `POST /api/admin/document-rules/create`

**Request Body:**
```json
{
  "ruleName": "string",
  "ruleDescription": "string",
  "ruleType": "string"
}
```

### Update Document Rule
**Endpoint:** `PUT /api/admin/document-rules/{id}`

**Path Parameters:**
- `id` (integer)

**Request Body:**
```json
{
  "ruleName": "string",
  "ruleDescription": "string",
  "ruleType": "string"
}
```

### Delete Document Rule
**Endpoint:** `DELETE /api/admin/document-rules/{id}`

**Path Parameters:**
- `id` (integer)

---

## 🏢 Department Management

### Get All Departments
**Endpoint:** `GET /api/admin/departments`

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": [
    {
      "departmentId": "number",
      "departmentName": "string",
      "departmentDescription": "string"
    }
  ]
}
```

### Get Department by ID
**Endpoint:** `GET /api/admin/departments/{id}`

**Path Parameters:**
- `id` (integer)

### Create Department
**Endpoint:** `POST /api/admin/departments/create`

**Request Body:**
```json
{
  "departmentName": "string",
  "departmentDescription": "string"
}
```

### Update Department
**Endpoint:** `PUT /api/admin/departments/{id}`

**Path Parameters:**
- `id` (integer)

**Request Body:**
```json
{
  "departmentName": "string",
  "departmentDescription": "string"
}
```

### Delete Department
**Endpoint:** `DELETE /api/admin/departments/{id}`

**Path Parameters:**
- `id` (integer)

---

## 📊 Response Format

All API responses follow this standard format:

```json
{
  "status": "string",
  "message": "string",
  "data": {} | [] | null
}
```

**Status Values:**
- `"200 OK"` - Success
- `"400 Bad Request"` - Invalid request
- `"401 Unauthorized"` - Authentication required
- `"403 Forbidden"` - Insufficient permissions
- `"404 Not Found"` - Resource not found
- `"500 Internal Server Error"` - Server error

---

## 🔒 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

---

## 📝 Notes

1. **File Uploads**: Use `multipart/form-data` content type
2. **JSON Requests**: Use `application/json` content type
3. **Date Format**: ISO 8601 format (e.g., `2025-12-31T00:00:00Z`)
4. **Pagination**: Not implemented in current version
5. **Rate Limiting**: Not specified in current documentation

---

**End of Documentation**
