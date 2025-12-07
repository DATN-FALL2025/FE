# Trainee Documents API Update

## Changes Made

### 1. Updated Document Status Display
- **Changed from**: Using `submissionStatus` field (which was always null for trainees)
- **Changed to**: Using `apply_or_not` field to display document submission status
- **Values**:
  - `"Not apply"` → Shows "Chờ nộp" (Waiting to submit)
  - `"Applied"` or `"Đã nộp"` → Shows "Đã nộp" (Submitted)

### 2. Updated API Parameter Name
- **Changed from**: `submissionName` parameter
- **Changed to**: `requireDocumentName` parameter
- **Reason**: Matches the actual API endpoint parameter name

### 3. API Endpoint
```
POST /api/trainee_submission/create_trainee_submission_by_trainee
```

**Parameters (multipart/form-data)**:
- `documentID` (string) - ID of the required document
- `traineeApplicationId` (string) - ID of the trainee application
- `requireDocumentName` (string) - Name of the required document
- `takeNote` (string) - Optional notes
- `submissionDocumentFile` (binary) - The document file to upload

### 4. API Response Structure

**GET /api/trainee_application/get_trainee_application_detail_by_staff/{trainee_application_id}**

```json
{
  "status": "200 OK",
  "message": "Trainee application detail",
  "data": {
    "traineeApplicationId": 6,
    "traineeApplicationStatus": "Pending",
    "positionName": "Kiểm Soát Viên Không Lưu",
    "departmentName": "Đào tạo Quản lý & Điều hành bay",
    "submittedDocuments": [
      {
        "submissionId": null,
        "documentId": 6,
        "requiredDocumentName": "Giấy Khám Sức Khỏe (Medical Certificate)",
        "apply_or_not": "Not apply",
        "submissionStatus": null,
        "url": null
      }
    ]
  }
}
```

### 5. Files Modified

1. **app/(trainees)/trainees/documents/page.tsx**
   - Updated `SubmittedDocument` interface to use `apply_or_not` instead of `submissionStatus`
   - Updated `getStatusBadge()` function to check `apply_or_not` field
   - Updated document counting logic to use `apply_or_not`
   - Updated API call to use `requireDocumentName` parameter
   - Updated all conditions checking for submitted documents

2. **lib/actions/trainee-submission-client.js**
   - Updated `createTraineeSubmission()` function parameter from `submissionName` to `requireDocumentName`
   - Updated FormData to append `requireDocumentName` instead of `submissionName`
   - Updated JSDoc comments

### 6. Key Differences

**For Trainees**:
- Only see if they have submitted a document or not (`apply_or_not`)
- Don't see the review status (Pending/Approved/Rejected)

**For Staff**:
- See both `apply_or_not` (whether trainee submitted) AND `submissionStatus` (review status)
- Can approve or reject submitted documents

## Testing

To test the changes:

1. Login as a trainee
2. Navigate to Documents page
3. Select a file for a required document
4. Click "Gửi file" to upload
5. Verify the status changes from "Chờ nộp" to "Đã nộp"
6. Verify the "Xem chi tiết" button appears after submission

## API Curl Example

```bash
curl -X 'POST' \
  'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api/trainee_submission/create_trainee_submission_by_trainee' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: multipart/form-data' \
  -F 'documentID=11' \
  -F 'traineeApplicationId=6' \
  -F 'requireDocumentName=CCCD' \
  -F 'takeNote=string' \
  -F 'submissionDocumentFile=@file.jpg;type=image/jpeg'
```
