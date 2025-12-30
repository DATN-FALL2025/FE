# API Integration Guide - Trainee Features

## 📋 Overview

Tài liệu này mô tả cách tích hợp với **real backend API** cho trainee features, dựa trên API response thực tế.

## 🔑 Authentication Flow

### 1. Login và nhận JWT Token

```typescript
// Login request
POST /api/account/v1/authenticateAccount

// Response
{
  "status": "200 OK",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "userName": "Thành",
    "gmail": "user@example.com",
    "role": "TRAINEE",
    "departmentName": "FC",
    "departmentId": "3"
  }
}
```

### 2. Lưu token vào localStorage

```typescript
import { setUser } from '@/lib/auth-utils';

// After successful login
setUser({
  token: data.token,
  userName: data.userName,
  gmail: data.gmail,
  role: data.role,
  // ... other fields
});

// Token được lưu tự động vào:
// - localStorage.getItem('token')
// - localStorage.getItem('user') (JSON string)
```

### 3. Sử dụng token trong API calls

```typescript
import { getToken } from '@/lib/auth-utils';

const token = getToken();

const response = await fetch(API_URL, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 📡 Trainee Application API

### Endpoint: Get All Applications by Trainee

```bash
GET /api/trainee_application/get_all_application_by_trainee
Authorization: Bearer {token}
```

### Real API Response Structure

```json
{
  "status": "200 OK",
  "message": "Trainee application list",
  "data": [
    {
      "traineeApplicationId": 5,
      "traineeApplicationStatus": "Pending",
      "positionName": null,
      "departmentName": null,
      "traineeApplicationCreateAt": "2025-12-02T15:49:11.273448",
      "traineeApplicationUpdateAt": null,
      "active": true
    }
  ]
}
```

### TypeScript Type Definition

```typescript
// File: features/trainees/types.ts

export interface TraineeApplicationAPI {
  traineeApplicationId: number;
  traineeApplicationStatus: string; // "Pending", "Approved", "Rejected"
  positionName: string | null;
  departmentName: string | null;
  traineeApplicationCreateAt: string; // ISO date string
  traineeApplicationUpdateAt: string | null;
  active: boolean;
}
```

### Frontend Mapping

```typescript
// File: features/trainees/hooks/use-student-data.ts

export interface TraineeApplication {
  id: string;
  traineeApplicationId: number;
  status: string; // "Pending", "Approved", "Rejected"
  positionName: string | null;
  departmentName: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  active: boolean;
  // User info from JWT token (not from API)
  fullName?: string;
  studentCode?: string;
  email?: string;
  trainingRole?: string;
}

// Mapping function
const mappedApplications: TraineeApplication[] = apiApplications.map(
  (app: TraineeApplicationAPI) => ({
    id: app.traineeApplicationId.toString(),
    traineeApplicationId: app.traineeApplicationId,
    status: app.traineeApplicationStatus || "Pending",
    positionName: app.positionName,
    departmentName: app.departmentName,
    createdAt: app.traineeApplicationCreateAt 
      ? new Date(app.traineeApplicationCreateAt) 
      : new Date(),
    updatedAt: app.traineeApplicationUpdateAt 
      ? new Date(app.traineeApplicationUpdateAt) 
      : null,
    active: app.active,
    // Get from JWT token
    fullName: user.userName || "Unknown User",
    studentCode: user.userName || "N/A",
    email: user.gmail || "N/A",
    trainingRole: user.role || "TRAINEE",
  })
);
```

## 🔍 Key Differences from Initial Implementation

### ❌ What Was Wrong

1. **Missing Token**: API calls without `Authorization` header → 401 Unauthorized
2. **Wrong Field Names**: Expected `fullName`, `studentCode`, etc. directly in API response
3. **Wrong Data Structure**: Expected nested `position` object with `positionId`

### ✅ What's Correct Now

1. **Token Authentication**: Always pass token in Authorization header
2. **Correct Field Mapping**: Use actual API field names:
   - `traineeApplicationId` ✅
   - `traineeApplicationStatus` ✅
   - `positionName` (string | null) ✅
   - `departmentName` (string | null) ✅
   - `traineeApplicationCreateAt` ✅
   
3. **User Info from JWT**: Get user details from decoded JWT token (localStorage), not from API response

## 🎯 JWT Token Structure

The JWT token contains user information:

```json
{
  "departmentName": "FC",
  "role": "TRAINEE",
  "departmentId": "3",
  "sub": "Thành",  // userName
  "iat": 1764690551,
  "exp": 1764708551
}
```

**Important**: 
- User info like `userName`, `gmail`, `role` come from **JWT token** (stored in localStorage)
- Application info like `status`, `positionName`, `departmentName` come from **API response**

## 📝 Updated API Actions

### File: `lib/actions/trainee-submission.js`

```javascript
export async function getAllTraineeApplicationsByTrainee(token) {
  try {
    // Get token from parameter or localStorage
    let authToken = token;
    if (!authToken && typeof window !== 'undefined') {
      authToken = localStorage.getItem('token');
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    console.log('📱 Fetching with token:', authToken ? 'Yes ✅' : 'No ❌');

    const response = await fetch(
      `${API_BASE_URL}/trainee_application/get_all_application_by_trainee`,
      {
        method: 'GET',
        headers,
        cache: 'no-store'
      }
    );

    console.log('📱 Response:', response.status, response.ok);

    const data = await response.json();

    if (!response.ok) {
      return {
        status: 'error',
        message: data.message || 'Failed to fetch',
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    return {
      status: 'error',
      message: error.message || 'Connection error',
      data: null
    };
  }
}
```

## 🧪 Testing & Debugging

### Check if token exists

```typescript
import { getToken, getUser } from '@/lib/auth-utils';

const token = getToken();
const user = getUser();

console.log('Token:', token ? 'EXISTS ✅' : 'MISSING ❌');
console.log('User:', user);
```

### Expected Console Output (Success)

```
📱 Fetching trainee applications with token: Yes ✅
📱 Response status: 200 true
✅ Found 1 trainee application(s): [...]
```

### Expected Console Output (Error)

```
📱 Fetching trainee applications with token: No ❌
📱 Response status: 401 false
❌ Failed to fetch trainee applications: Unauthorized
```

## 🔧 Usage Examples

### In Client Components (Hooks)

```typescript
// File: features/trainees/hooks/use-student-data.ts

import { getUser, getToken } from '@/lib/auth-utils';
import { getAllTraineeApplicationsByTrainee } from '@/lib/actions/trainee-submission';

const user = getUser();
const token = getToken();

if (!user || !token) {
  console.warn('⚠️ No auth data. User not logged in.');
  return;
}

const response = await getAllTraineeApplicationsByTrainee(token);
```

### In Pages

```typescript
// File: app/(trainees)/trainees/documents/page.tsx

import { getToken } from '@/lib/auth-utils';
import { getAllTraineeApplicationsByTrainee } from '@/lib/actions';

const token = getToken();
const applicationsRes = await getAllTraineeApplicationsByTrainee(token);

if (applicationsRes.status === "success" && applicationsRes.data) {
  const applications = Array.isArray(applicationsRes.data) 
    ? applicationsRes.data 
    : [];
    
  console.log('📋 Applications:', applications);
}
```

## 🚨 Common Issues & Solutions

### Issue 1: 401 Unauthorized

**Problem**: API returns 401
**Cause**: Missing or invalid token
**Solution**:
```typescript
// Always check token before API call
const token = getToken();
if (!token) {
  router.push('/login');
  return;
}
```

### Issue 2: Null positionName/departmentName

**Problem**: `positionName` and `departmentName` are `null` in response
**Cause**: Backend hasn't assigned position/department yet
**Solution**:
```typescript
// Handle null values gracefully
const positionName = app.positionName || "Chưa được phân công";
const departmentName = app.departmentName || "Chưa có phòng ban";
```

### Issue 3: User info not showing

**Problem**: No fullName, studentCode, email
**Cause**: These are NOT in API response
**Solution**:
```typescript
// Get from JWT token (localStorage)
const user = getUser();
const fullName = user?.userName || "Unknown";
const email = user?.gmail || "N/A";
```

## 📚 Related Files

- ✅ `features/trainees/types.ts` - Type definitions
- ✅ `features/trainees/hooks/use-student-data.ts` - Main data hook
- ✅ `app/(trainees)/trainees/documents/page.tsx` - Documents page
- ✅ `lib/actions/trainee-submission.js` - API actions
- ✅ `lib/auth-utils.ts` - Auth utilities
- 📄 `features/trainees/FIX_401_UNAUTHORIZED.md` - Fix documentation

## 🎯 Next Steps

1. ✅ Fix 401 error by passing token
2. ✅ Update type definitions to match real API
3. ✅ Update data mapping logic
4. ⏳ Fetch trainee submissions separately (if needed)
5. ⏳ Handle token expiration & refresh
6. ⏳ Add proper error boundaries
7. ⏳ Add loading states

## 📞 Support

If you encounter issues:
1. Check browser console for logs
2. Verify token exists: `localStorage.getItem('token')`
3. Check API response structure matches documentation
4. Review this guide's examples

---

**Last Updated**: Dec 2, 2025  
**API Version**: Production Railway  
**Status**: ✅ Working with real backend

