# 🔄 API Parameters Update - Query Params vs JSON Body

## 📋 Overview

**Issue:** Backend API expects **query parameters** instead of JSON body for create/update operations.

**Solution:** Updated all CRUD functions to use `URLSearchParams` for query parameters.

---

## 🎯 What Changed

### ❌ Before (JSON Body)

```javascript
// ❌ This didn't work
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    documentName: "My Document",
    documentDescription: "Description"
  }),
});
```

### ✅ After (Query Parameters)

```javascript
// ✅ This works!
const queryParams = new URLSearchParams({
  documentName: "My Document",
  documentDescription: "Description"
});

const url = `${API_BASE_URL}/admin/documents/create?${queryParams}`;
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'accept': '*/*',
  },
});
```

---

## 📝 Updated Files

### 1. Document Actions (`lib/actions/document.js`)

**Updated Functions:**
- ✅ `createDocument()` - Now uses query params
- ✅ `updateDocumentById()` - Now uses query params

**Example:**
```javascript
// Create Document
const queryParams = new URLSearchParams({
  documentName: "Báo cáo tháng 11",
  documentDescription: "Mô tả chi tiết"
});
const url = `${API_BASE_URL}/admin/documents/create?${queryParams}`;
```

### 2. Department Actions (`lib/actions/department.js`)

**Updated Functions:**
- ✅ `createDepartment()` - Now uses query params
- ✅ `updateDepartmentById()` - Now uses query params

**Example:**
```javascript
// Create Department
const queryParams = new URLSearchParams();
Object.keys(departmentData).forEach(key => {
  if (departmentData[key] !== undefined && departmentData[key] !== null) {
    queryParams.append(key, departmentData[key]);
  }
});
const url = `${API_BASE_URL}/admin/departments/create?${queryParams}`;
```

### 3. Document Rule Actions (`lib/actions/document-rule.js`)

**Updated Functions:**
- ✅ `createDocumentRule()` - Now uses query params
- ✅ `updateDocumentRuleById()` - Now uses query params

**Example:**
```javascript
// Create Document Rule
const queryParams = new URLSearchParams();
Object.keys(documentRuleData).forEach(key => {
  if (documentRuleData[key] !== undefined && documentRuleData[key] !== null) {
    queryParams.append(key, documentRuleData[key]);
  }
});
const url = `${API_BASE_URL}/admin/document-rules/create?${queryParams}`;
```

### 4. Auth Actions (`lib/actions/auth.js`)

**Already Using Query Params:**
- ✅ `createUser()` - Query params
- ✅ `createRole()` - Query params
- ✅ `authenticateAccount()` - Query params

---

## 🔍 Pattern Summary

### For Simple Objects (2-3 fields)

```javascript
const queryParams = new URLSearchParams({
  field1: value1,
  field2: value2,
  field3: value3
});
```

### For Dynamic Objects (unknown fields)

```javascript
const queryParams = new URLSearchParams();
Object.keys(data).forEach(key => {
  if (data[key] !== undefined && data[key] !== null) {
    queryParams.append(key, data[key]);
  }
});
```

---

## 📊 API Endpoints Comparison

| Endpoint | Method | Old Format | New Format |
|----------|--------|-----------|-----------|
| `/admin/documents/create` | POST | JSON body | Query params ✅ |
| `/admin/documents/{id}` | PUT | JSON body | Query params ✅ |
| `/admin/departments/create` | POST | JSON body | Query params ✅ |
| `/admin/departments/{id}` | PUT | JSON body | Query params ✅ |
| `/admin/document-rules/create` | POST | JSON body | Query params ✅ |
| `/admin/document-rules/{id}` | PUT | JSON body | Query params ✅ |
| `/account/v1/createUser` | POST | Query params | Query params ✅ |
| `/account/v1/createRole` | POST | Query params | Query params ✅ |
| `/position/createPosition` | POST | FormData (multipart) | FormData ✅ |
| `/position/updatePositionById{id}` | PUT | FormData (multipart) | FormData ✅ |

---

## 🎯 Special Cases

### Position API (Uses FormData)

Position endpoints use `multipart/form-data` for image upload:

```javascript
// ✅ Correct - Position uses FormData
const formData = new FormData();
formData.append('positionName', 'Manager');
formData.append('positionDescription', 'Description');
formData.append('positionImage', file);

const response = await fetch(url, {
  method: 'POST',
  body: formData, // FormData, not query params
});
```

### GET/DELETE Endpoints

```javascript
// ✅ GET - No body, no params (path only)
GET /admin/documents

// ✅ DELETE - No body, ID in path
DELETE /admin/documents/{id}
```

---

## 🧪 Testing

### Request URL Format

```
Before: POST https://...api/admin/documents/create
Body: {"documentName": "Doc1", "documentDescription": "Desc"}

After:  POST https://...api/admin/documents/create?documentName=Doc1&documentDescription=Desc
Body: (empty)
```

### Console Logging

All functions now log requests for debugging:

```javascript
console.log('📄 Create Document Request:', url);
// Output: https://...api/admin/documents/create?documentName=Doc1&documentDescription=Desc

console.log('📄 Create Document Response:', data);
// Output: { status: "200 OK", message: "...", data: {...} }
```

---

## ⚠️ Important Notes

1. **Empty Body:** Query params endpoints expect **no body** or empty body
2. **Headers:** Use `'accept': '*/*'` instead of `'Content-Type': 'application/json'`
3. **Encoding:** `URLSearchParams` automatically URL-encodes values
4. **Null Values:** Filter out `null` and `undefined` before appending to params
5. **FormData Exception:** Position endpoints still use `FormData` (for file upload)

---

## ✅ Benefits

| Benefit | Description |
|---------|-------------|
| **Consistency** | All create/update endpoints now follow same pattern |
| **Debugging** | URL params visible in console logs |
| **Correct** | Matches backend API expectations |
| **Simpler** | No need to stringify JSON |

---

## 📝 Migration Guide

If you have existing code using JSON body:

### Step 1: Convert JSON to Query Params

```javascript
// Old
body: JSON.stringify({ field1: "value1", field2: "value2" })

// New
const queryParams = new URLSearchParams({ field1: "value1", field2: "value2" });
const url = `${baseUrl}?${queryParams}`;
```

### Step 2: Update Headers

```javascript
// Old
headers: {
  'Content-Type': 'application/json',
}

// New
headers: {
  'accept': '*/*',
}
```

### Step 3: Remove Body

```javascript
// Old
{
  method: 'POST',
  headers: {...},
  body: JSON.stringify(data)
}

// New
{
  method: 'POST',
  headers: {...},
  // No body!
}
```

---

## 🔗 References

- **API Documentation:** `docs/api_note.md`
- **Server Actions:** `lib/actions/`
- **Usage Examples:** `docs/api-use.md`

---

## ✅ Summary

| Module | Status |
|--------|--------|
| **Auth** | ✅ Using query params |
| **Document** | ✅ Updated to query params |
| **Department** | ✅ Updated to query params |
| **Document Rule** | ✅ Updated to query params |
| **Position** | ✅ Using FormData (correct) |

**Result:** All CRUD operations now use correct request format! 🎉

