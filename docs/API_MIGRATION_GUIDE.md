# 🔄 API Migration Guide - Render to Railway

**Date:** January 12, 2026  
**Status:** ✅ COMPLETED - Migration hoàn tất

---

## 📊 Overview

Hệ thống đã chuyển từ Render server sang Railway server với URL mới. Migration đã hoàn tất.

### Server URLs

| Environment | Old (Render) | New (Railway) | Status |
|-------------|--------------|---------------|--------|
| **Production** | `https://manage-and-automate-aviation-academy.onrender.com` | `https://manage-and-automate-aviation-academy-application-production.up.railway.app` | ✅ Active |
| **API Docs** | `/v3/api-docs` | `/v3/api-docs` | ✅ OAS 3.1 |

---

## 🆕 New APIs Added (January 2026)

### Batch Management (Mới)
- `GET /api/batch` - Lấy danh sách batch
- `GET /api/batch/active-batch` - Lấy batch đang active
- `GET /api/batch/nearest_batch` - Lấy batch gần nhất
- `POST /api/batch/create-batch` - Tạo batch mới
- `PUT /api/batch/update-batch/{id}` - Cập nhật batch
- `DELETE /api/batch/delete-batch/{id}` - Xóa batch

### Document Rule Value
- `POST /api/document_rule_value/create_document_rule_value` - Tạo giá trị rule
- `PUT /api/document_rule_value/update_document_rule_value` - Cập nhật giá trị rule

### Document Management
- `GET /api/admin/documents/get-document-rule-list-by-document/{documentId}` - Lấy danh sách rules theo document

### Matrix Dashboard
- `GET /api/matrix/matrix_details` - Chi tiết matrix
- `GET /api/matrix/input_matrix_document_dashboard` - Dashboard matrix
- `GET /api/matrix/get_matrix_filter_by_position_department` - Lọc matrix

### Trainee Application Dashboard
- `GET /api/trainee_application/overall-stats_trainee_application_for_staff_academic_affair` - Thống kê cho staff
- `GET /api/trainee_application/TraineeApplicationDashboardByTrainee` - Dashboard cho trainee

### Upload
- `PUT /api/admin/uploads/file` - Cập nhật file đã upload

---

## 🔧 Files Cần Cập Nhật

### 1. lib/config/api-paths.ts ✅ (Đã có env var)
**Current:**
```typescript
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://manage-and-automate-aviation-academy.onrender.com';
```

**Action:** Cập nhật fallback URL
```typescript
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://manage-and-automate-aviation-academy-application-production.up.railway.app';
```

---

### 2. lib/actions/auth.js ❌
**Current:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';
```

**Update to:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api';
```

---

### 3. lib/actions/department.js ❌
**Current:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';
```

**Update to:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api';
```

---

### 4. lib/actions/document-rule.js ❌
**Current:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';
```

**Update to:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api';
```

---

### 5. lib/actions/document.js ❌
**Current:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';
```

**Update to:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api';
```

---

### 6. lib/actions/matrix.ts ⚠️ (Đã có env var)
**Current:**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://manage-and-automate-aviation-academy.onrender.com';
```

**Update to:**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://manage-and-automate-aviation-academy-application-production.up.railway.app';
```

---

### 7. lib/actions/position.js ❌
**Current:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';
```

**Update to:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api';
```

---

### 8. lib/actions/rule.js ❌
**Current:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';
```

**Update to:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api';
```

---

### 9. lib/actions/trainee-submission-client.js ❌
**Current:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';
```

**Update to:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api';
```

---

### 10. lib/actions/trainee-submission.js ❌
**Current:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';
```

**Update to:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api';
```

---

### 11. lib/actions/upload.js ❌
**Current:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy.onrender.com/api';
```

**Update to:**
```javascript
const API_BASE_URL = 'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api';
```

---

## 🔄 API Changes

### 1. Trainee Submission API

**Changed Parameter:**
- ❌ Old: `submissionName`
- ✅ New: `requireDocumentName`

**File to update:** `lib/actions/trainee-submission-client.js`

**Before:**
```javascript
formData.append('submissionName', submissionName);
```

**After:**
```javascript
formData.append('requireDocumentName', requireDocumentName);
```

---

### 2. Trainee Application Response

**Changed Field:**
- ❌ Old: `submissionStatus` (always null for trainees)
- ✅ New: `apply_or_not` (shows if trainee submitted)

**Values:**
- `"Not apply"` → Chưa nộp
- `"Applied"` or `"Đã nộp"` → Đã nộp

**Files to check:**
- `app/(trainees)/trainees/documents/page.tsx`
- Any component displaying submission status

---

### 3. Matrix API Endpoints

**New Suffixes Added:**
- `_for_training_director` - Training Director actions
- `_for_head_department` - Head of Department actions
- `_for_head_of_department` - Alternative naming

**Examples:**
- `POST /api/matrix/addRow_for_training_director`
- `POST /api/matrix/clickToCellMatrix_for_head_of_department`
- `PUT /api/matrix/set-drafted/{departmentID}_for_head_department`

**File to update:** `lib/actions/matrix.ts`

---

### 4. New Endpoints Added

#### Trainee Application
- `GET /api/trainee_application/get_trainee_application_detail_by_staff/{trainee_application_id}`
- `GET /api/trainee_application/get_all_trainee_application_by_staff_academic_affair`
- `GET /api/trainee_application/get_trainee_application_list_by_status_by_staff_academic_staff_affair`

#### Matrix
- `GET /api/matrix/input_matrix_document_dashboard`
- `GET /api/matrix/get_matrix_filter_by_position_department`
- `PUT /api/matrix/set-drafted/{departmentID}_for_head_department`

---

## 🚀 Migration Steps

### Step 1: Update Environment Variables

Create or update `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://manage-and-automate-aviation-academy-application-production.up.railway.app
```

### Step 2: Update All Action Files

Run this command to update all files at once:

```bash
# For Unix/Linux/Mac
find lib/actions -type f \( -name "*.js" -o -name "*.ts" \) -exec sed -i '' 's|https://manage-and-automate-aviation-academy.onrender.com|https://manage-and-automate-aviation-academy-application-production.up.railway.app|g' {} +

# For Windows (PowerShell)
Get-ChildItem -Path lib/actions -Include *.js,*.ts -Recurse | ForEach-Object {
    (Get-Content $_.FullName) -replace 'https://manage-and-automate-aviation-academy.onrender.com', 'https://manage-and-automate-aviation-academy-application-production.up.railway.app' | Set-Content $_.FullName
}
```

### Step 3: Update Trainee Submission Parameter

In `lib/actions/trainee-submission-client.js`:

```javascript
// Find and replace
- formData.append('submissionName', submissionName);
+ formData.append('requireDocumentName', requireDocumentName);

// Update function parameter
- export async function createTraineeSubmission({ documentID, traineeApplicationId, submissionName, takeNote, submissionDocumentFile }) {
+ export async function createTraineeSubmission({ documentID, traineeApplicationId, requireDocumentName, takeNote, submissionDocumentFile }) {
```

### Step 4: Update Matrix Endpoints

In `lib/actions/matrix.ts`, update endpoint URLs to include suffixes:

```typescript
// Example
- const response = await fetch(`${API_BASE_URL}/api/matrix/addRow`, {
+ const response = await fetch(`${API_BASE_URL}/api/matrix/addRow_for_training_director`, {
```

### Step 5: Update UI Components

Check and update components that use `submissionStatus`:

```typescript
// Before
if (doc.submissionStatus === 'Pending') { ... }

// After
if (doc.apply_or_not === 'Applied') { ... }
```

### Step 6: Test All Endpoints

```bash
# Run development server
npm run dev

# Test each feature:
# - Login
# - Trainee document submission
# - Matrix operations
# - Position management
# - Department management
```

---

## ✅ Verification Checklist

After migration, verify:

- [ ] Login works with new API
- [ ] Trainee can submit documents
- [ ] Document status shows correctly (`apply_or_not`)
- [ ] Matrix operations work (add/delete rows/columns)
- [ ] Position CRUD operations work
- [ ] Department CRUD operations work
- [ ] File upload works
- [ ] All role-based features work
- [ ] No console errors related to API calls
- [ ] Network tab shows correct API URLs

---

## 🐛 Troubleshooting

### Issue: CORS Errors

**Solution:** Ensure Railway server has CORS configured for your domain

### Issue: 404 Not Found

**Possible causes:**
1. Endpoint URL incorrect (check suffixes)
2. API not deployed on Railway
3. Route not available on new server

**Solution:** Check API documentation at `/v3/api-docs`

### Issue: Authentication Fails

**Possible causes:**
1. JWT token format changed
2. Token expiration time different

**Solution:** Clear localStorage and login again

### Issue: File Upload Fails

**Possible causes:**
1. File size limit different on Railway
2. Cloudinary configuration not set

**Solution:** Check Railway environment variables

---

## 📝 Rollback Plan

If migration fails, rollback by:

1. Revert environment variable:
```env
NEXT_PUBLIC_API_URL=https://manage-and-automate-aviation-academy.onrender.com
```

2. Revert code changes using git:
```bash
git checkout HEAD -- lib/actions/
```

3. Restart development server

---

## 📞 Support

If you encounter issues:

1. Check Railway server logs
2. Check browser console for errors
3. Verify API documentation at `/v3/api-docs`
4. Test endpoints using Postman/Thunder Client

---

**Migration Priority:** ✅ COMPLETED  
**Estimated Time:** N/A  
**Risk Level:** Low (đã hoàn tất migration)
