# Document Submission Flow - API Integration Guide

## Overview

This document explains the complete flow for document submission in the Aviation Academy system, including the role-based interactions between TRAINEE, HEAD_OF_DEPARTMENT, and TRAINING_DIRECTOR.

## Architecture Flow

```
TRAINEE → Submit Documents → HEAD_OF_DEPARTMENT → Review/Approve → TRAINING_DIRECTOR → Final Review
```

## Roles & Permissions

### 1. TRAINEE
- Submit documents for their application
- Update/resubmit documents if rejected
- View submission status
- Complete application when all documents are submitted

### 2. HEAD_OF_DEPARTMENT
- Review documents submitted by trainees
- Approve or reject documents
- Set matrix status for departments
- View all applications for their department

### 3. TRAINING_DIRECTOR
- Set pending status for matrix
- Manage matrix rows and columns
- Add/remove positions and documents
- Final approval of applications

### 4. ACADEMIC_STAFF_AFFAIR
- View all approved trainee applications
- Filter applications by position
- Administrative oversight

## API Endpoints

### Trainee Submission Endpoints

#### 1. Create Trainee Submission (TRAINEE)
**Endpoint:** `POST /api/trainee_submission/create_trainee_submission_by_trainee`

**Purpose:** Trainee submits a document for their application

**Request:**
```javascript
// Content-Type: multipart/form-data
{
  documentID: string,              // ID of the document type
  traineeApplicationId: string,    // ID of the trainee's application
  submissionName: string,          // Name/title of submission
  takeNote: string,                // Optional notes
  submissionDocumentFile: File     // The actual file
}
```

**Response:**
```javascript
{
  status: "success",
  message: "Submission created successfully",
  data: {
    traineeSubmissionId: number,
    // ... submission details
  }
}
```

**Usage:**
```javascript
import { createTraineeSubmission } from '@/lib/actions';

const result = await createTraineeSubmission({
  documentID: 1,
  traineeApplicationId: 123,
  submissionName: "Resume.pdf",
  takeNote: "Updated version",
  submissionDocumentFile: file
});
```

---

#### 2. Update Trainee Submission (TRAINEE)
**Endpoint:** `PUT /api/trainee_submission/update/{submissionID}`

**Purpose:** Update an existing submission (e.g., resubmit after rejection)

**Request:**
```javascript
// Content-Type: multipart/form-data
{
  newSubmissionName: string,           // Optional: new name
  newTakeNote: string,                 // Optional: new notes
  newSubmissionDocumentFile: File      // Optional: new file
}
```

**Usage:**
```javascript
import { updateTraineeSubmission } from '@/lib/actions';

const result = await updateTraineeSubmission(submissionId, {
  newSubmissionName: "Resume_v2.pdf",
  newSubmissionDocumentFile: newFile
});
```

---

#### 3. Get Trainee Submission Detail
**Endpoint:** `GET /api/trainee_submission/get_trainee_submission_detail/{trainee_submission_id}`

**Purpose:** Get detailed information about a specific submission

**Usage:**
```javascript
import { getTraineeSubmissionDetail } from '@/lib/actions';

const result = await getTraineeSubmissionDetail(submissionId);
```

---

### Trainee Application Endpoints

#### 4. Get All Applications (TRAINEE)
**Endpoint:** `GET /api/trainee_application/get_all_application_by_trainee`

**Purpose:** Get all applications for the current trainee

**Usage:**
```javascript
import { getAllTraineeApplicationsByTrainee } from '@/lib/actions';

const result = await getAllTraineeApplicationsByTrainee();
// Returns: Array of trainee applications
```

---

#### 5. Get Application Detail (TRAINEE)
**Endpoint:** `GET /api/trainee_application/get_trainee_application_detail_by_trainee/{id}`

**Purpose:** Get detailed information about a specific application including all submissions

**Usage:**
```javascript
import { getTraineeApplicationDetailByTrainee } from '@/lib/actions';

const result = await getTraineeApplicationDetailByTrainee(applicationId);
// Returns: Application with traineeSubmissions array
```

---

#### 6. Upload Trainee Application
**Endpoint:** `POST /api/trainee_application/upload_trainee_application/{trainee_application_id}`

**Purpose:** Mark application as uploaded (intermediate step)

**Usage:**
```javascript
import { uploadTraineeApplication } from '@/lib/actions';

const result = await uploadTraineeApplication(applicationId);
```

---

#### 7. Complete Trainee Application
**Endpoint:** `PUT /api/trainee_application/{traineeApplicationId}/complete`

**Purpose:** Mark application as complete (final step)

**Usage:**
```javascript
import { completeTraineeApplication } from '@/lib/actions';

const result = await completeTraineeApplication(applicationId);
```

---

### Staff/Admin Endpoints

#### 8. Get All Applications (ACADEMIC_STAFF_AFFAIR)
**Endpoint:** `GET /api/trainee_application/getAllTraineeApplicationByStaffAcademic`

**Purpose:** Staff can view all approved applications

**Usage:**
```javascript
import { getAllTraineeApplicationsByStaffAcademic } from '@/lib/actions';

const result = await getAllTraineeApplicationsByStaffAcademic();
```

---

#### 9. Filter Applications by Position
**Endpoint:** `GET /api/trainee_application/filter-trainee-application-by-position-by-staff-academic?positionId={positionId}`

**Purpose:** Filter applications by specific position

**Usage:**
```javascript
import { filterTraineeApplicationsByPosition } from '@/lib/actions';

const result = await filterTraineeApplicationsByPosition(positionId);
```

---

## Complete Submission Flow

### Step 1: Trainee Creates Application
1. Trainee selects a position
2. System creates a `traineeApplication` record
3. System determines required documents based on position

### Step 2: Trainee Submits Documents
```javascript
// For each required document
const submission = await createTraineeSubmission({
  documentID: doc.id,
  traineeApplicationId: applicationId,
  submissionName: file.name,
  takeNote: "Initial submission",
  submissionDocumentFile: file
});
```

### Step 3: Trainee Completes Application
```javascript
// After all documents are submitted
await uploadTraineeApplication(applicationId);
await completeTraineeApplication(applicationId);
```

### Step 4: Head of Department Reviews
```javascript
// HEAD_OF_DEPARTMENT reviews submissions
// Uses matrix endpoints to approve/reject
await setMatrixStatusByDepartment(departmentId, "Approve");
// Or reject with reason
await setMatrixStatusByDepartment(departmentId, "Reject", {
  rejectReason: "Incomplete information"
});
```

### Step 5: Training Director Final Review
```javascript
// TRAINING_DIRECTOR sets pending status
await setPendingStatusMatrix({
  startDate: new Date(),
  endDate: new Date()
});

// Mark as complete
await setCompleteStatusToActive();
```

---

## Matrix Management Flow

The matrix system manages document requirements per position:

### Training Director Actions
```javascript
// Add a position to matrix
await addSingleRow({ positionId: 1 });

// Add a document to matrix
await addSingleColumn({ documentId: 1 });

// Add multiple positions
await addMultipleRows([
  { positionId: 1 },
  { positionId: 2 }
]);

// Add multiple documents
await addMultipleColumns([
  { documentId: 1 },
  { documentId: 2 }
]);

// Delete position
await deleteRow(positionId);

// Delete document
await deleteColumn(documentId);

// Get all matrix data
const matrix = await getAllMatrix();

// Get matrix by department
const deptMatrix = await getMatrixByDepartmentId(departmentId);
```

### Head of Department Actions
```javascript
// Click on a cell to mark required/optional
await clickToCell({
  matrixId: 1,
  required: true
});

// Set status for department
await setMatrixStatusByDepartment(departmentId, "Approve");
```

---

## Implementation Example

### Trainee Document Upload Component

```typescript
const DocumentUploadPage = () => {
  const [documents, setDocuments] = useState([]);
  const [applicationId, setApplicationId] = useState(null);

  useEffect(() => {
    // 1. Get trainee's applications
    const fetchData = async () => {
      const apps = await getAllTraineeApplicationsByTrainee();
      const activeApp = apps.data[0];
      setApplicationId(activeApp.traineeApplicationId);

      // 2. Get application details with submissions
      const detail = await getTraineeApplicationDetailByTrainee(
        activeApp.traineeApplicationId
      );

      // 3. Map documents with submission status
      const allDocs = await getAllDocuments();
      const mappedDocs = allDocs.data.map(doc => {
        const submission = detail.data.traineeSubmissions.find(
          sub => sub.document.documentId === doc.documentId
        );
        return {
          ...doc,
          submitted: !!submission,
          submissionId: submission?.traineeSubmissionId
        };
      });

      setDocuments(mappedDocs);
    };

    fetchData();
  }, []);

  const handleUpload = async (docId, file) => {
    await createTraineeSubmission({
      documentID: docId,
      traineeApplicationId: applicationId,
      submissionName: file.name,
      submissionDocumentFile: file
    });

    // Refresh documents
    // ...
  };

  return (
    // UI implementation
  );
};
```

---

## Error Handling

Always handle errors appropriately:

```javascript
const result = await createTraineeSubmission(data);

if (result.status === "error") {
  toast.error(result.message);
  return;
}

// Success
toast.success("Document submitted successfully");
```

---

## Important Notes

1. **Authentication Required**: All endpoints require authentication via Bearer token
2. **Role-Based Access**: Ensure users have appropriate roles for endpoint access
3. **File Upload**: Use `FormData` for file uploads (multipart/form-data)
4. **JSON Requests**: Some endpoints use `application/json`, check API docs
5. **Status Flow**: Applications go through: Created → Submitted → Under Review → Approved/Rejected → Complete

---

## Related Files

- **API Actions**: `lib/actions/trainee-submission.js`
- **Index Export**: `lib/actions/index.js`
- **UI Component**: `app/(trainees)/trainees/documents/page.tsx`
- **API Documentation**: `docs/api_note.md`

---

## Testing Checklist

- [ ] Create trainee application
- [ ] Submit document for application
- [ ] View submission status
- [ ] Update/resubmit document
- [ ] Complete application
- [ ] HEAD reviews and approves
- [ ] TRAINING_DIRECTOR final approval
- [ ] STAFF views approved applications
