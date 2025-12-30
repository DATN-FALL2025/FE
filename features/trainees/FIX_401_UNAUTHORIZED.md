# Fix 401 Unauthorized Error - Trainee Applications API

## 🐛 Vấn đề

Khi gọi API endpoint `/trainee_application/get_all_application_by_trainee`, hệ thống trả về lỗi **401 Unauthorized**:

```
📱 Fetching trainee applications with token: No
📱 Response status: 401 false
```

## 🔍 Nguyên nhân

API endpoint này **yêu cầu xác thực JWT token** trong header `Authorization: Bearer <token>`, nhưng code đang gọi hàm `getAllTraineeApplicationsByTrainee()` **KHÔNG truyền token**.

### Code lỗi (TRƯỚC):

**File: `features/trainees/hooks/use-student-data.ts`**
```typescript
// ❌ Thiếu token parameter
const applicationsResponse = await getAllTraineeApplicationsByTrainee();
```

**File: `app/(trainees)/trainees/documents/page.tsx`**
```typescript
// ❌ Thiếu token parameter
const applicationsRes = await getAllTraineeApplicationsByTrainee();
```

## ✅ Giải pháp

### 1. Lấy token từ localStorage và truyền vào hàm API

**File: `features/trainees/hooks/use-student-data.ts`**
```typescript
// ✅ Truyền token vào hàm
const user = getUser();
const token = getToken(); // Lấy token từ localStorage

const applicationsResponse = await getAllTraineeApplicationsByTrainee(token);
```

**File: `app/(trainees)/trainees/documents/page.tsx`**
```typescript
// ✅ Import getToken
import { getToken } from "@/lib/auth-utils";

// ✅ Lấy và truyền token
const token = getToken();
const applicationsRes = await getAllTraineeApplicationsByTrainee(token);
```

### 2. Hàm API đã hỗ trợ sẵn token

**File: `lib/actions/trainee-submission.js`**
```javascript
export async function getAllTraineeApplicationsByTrainee(token) {
  try {
    // Lấy token từ parameter hoặc localStorage
    let authToken = token;
    if (!authToken && typeof window !== 'undefined') {
      authToken = localStorage.getItem('token');
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    // Thêm Authorization header nếu có token
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    console.log('📱 Fetching trainee applications with token:', authToken ? 'Yes' : 'No');

    const response = await fetch(
      `${API_BASE_URL}/trainee_application/get_all_application_by_trainee`,
      {
        method: 'GET',
        headers,
        cache: 'no-store'
      }
    );

    // ... rest of code
  }
}
```

## 📋 Checklist các API cần xác thực

Các API endpoints sau đây **YÊU CẦU JWT token**:

### ✅ Đã fix:
- [x] `GET /trainee_application/get_all_application_by_trainee`

### 🔍 Cần kiểm tra thêm:
- [ ] `GET /trainee_application/get_trainee_application_detail_by_trainee/{id}`
- [ ] `POST /trainee_submission/create_trainee_submission_by_trainee`
- [ ] `PUT /trainee_submission/update/{submissionID}`
- [ ] `GET /trainee_submission/get_trainee_submission_detail/{trainee_submission_id}`
- [ ] `POST /trainee_application/upload_trainee_application/{trainee_application_id}`
- [ ] `PUT /trainee_application/{traineeApplicationId}/complete`

### ℹ️ Không cần token (Public APIs):
- `GET /position/getAllPossition`
- `GET /admin/documents` (một số endpoints admin có authentication riêng)

## 🔑 Cách lấy và sử dụng token

### 1. Token được lưu khi login thành công

**File: `lib/auth-utils.ts`**
```typescript
export function setUser(userData: UserData): void {
  // ... code
  
  // Store token separately if available
  if (userData.token) {
    localStorage.setItem('token', userData.token);
  }
}
```

### 2. Lấy token từ localStorage

```typescript
import { getToken } from '@/lib/auth-utils';

const token = getToken(); // Returns: string | null
```

### 3. Truyền token vào API calls

```typescript
// Client-side hook
const token = getToken();
const result = await getAllTraineeApplicationsByTrainee(token);

// Server Action (không cần truyền, sẽ auto lấy từ cookies/headers)
// ... implement server-side authentication
```

## 🧪 Testing

Sau khi fix, log output sẽ hiển thị:

```
📱 Fetching trainee applications with token: Yes  ✅
📱 Response status: 200 true  ✅
```

## 📝 Best Practices

1. **Luôn kiểm tra token trước khi gọi authenticated APIs**
   ```typescript
   const token = getToken();
   if (!token) {
     console.warn('No token found. User may not be logged in.');
     return;
   }
   ```

2. **Handle 401 errors gracefully**
   ```typescript
   if (response.status === 401) {
     // Clear invalid token and redirect to login
     logout();
     router.push('/login');
   }
   ```

3. **Refresh token khi expired** (implement refresh token flow)

4. **Sử dụng interceptors** để tự động thêm token vào mọi request (nếu dùng axios)

## 🔗 Related Files

- `lib/auth-utils.ts` - Authentication utilities
- `lib/actions/trainee-submission.js` - Trainee submission API actions
- `features/trainees/hooks/use-student-data.ts` - Trainee data hook
- `app/(trainees)/trainees/documents/page.tsx` - Documents page
- `docs/api_note.md` - API documentation

## 🚀 Next Steps

1. Kiểm tra tất cả các API calls khác trong trainee features
2. Implement proper error handling cho 401 errors
3. Thêm token refresh mechanism
4. Thêm loading states khi đang fetch với authentication
5. Test với token expired/invalid scenarios

