# Trainee API Flow Diagram

## 🔄 Complete Authentication & Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER LOGIN                                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  POST /api/account/v1/       │
                    │  authenticateAccount         │
                    │                              │
                    │  Body: {                     │
                    │    userName: "Thành",        │
                    │    password: "***"           │
                    │  }                           │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  Response 200 OK              │
                    │  {                            │
                    │    token: "eyJhbGc...",       │
                    │    userName: "Thành",         │
                    │    gmail: "thanh@...",        │
                    │    role: "TRAINEE",           │
                    │    departmentName: "FC",      │
                    │    departmentId: "3"          │
                    │  }                            │
                    └───────────────────────────────┘
                                    │
                                    ▼
              ┌─────────────────────────────────────────┐
              │  localStorage.setItem('token', ...)     │
              │  localStorage.setItem('user', JSON...)  │
              └─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   FETCH TRAINEE APPLICATIONS                        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
              ┌─────────────────────────────────────────┐
              │  const token = getToken();              │
              │  // Gets from localStorage              │
              └─────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  GET /api/trainee_application/│
                    │  get_all_application_by_      │
                    │  trainee                      │
                    │                              │
                    │  Headers: {                  │
                    │    Authorization:            │
                    │      "Bearer eyJhbGc..."     │
                    │  }                           │
                    └───────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
              ✅ 200 OK                        ❌ 401 Unauthorized
                    │                               │
                    ▼                               ▼
    ┌───────────────────────────┐   ┌────────────────────────────┐
    │  {                        │   │  {                         │
    │    status: "200 OK",      │   │    status: "401",          │
    │    message: "...",        │   │    message: "Unauthorized" │
    │    data: [                │   │  }                         │
    │      {                    │   └────────────────────────────┘
    │        traineeApplicationId│              │
    │        traineeApplication │              ▼
    │          Status,          │   ┌────────────────────────────┐
    │        positionName,      │   │  Redirect to Login         │
    │        departmentName,    │   │  Clear localStorage        │
    │        ...                │   └────────────────────────────┘
    │      }                    │
    │    ]                      │
    │  }                        │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────────┐
    │  Map API Response to Frontend Model   │
    │                                       │
    │  TraineeApplicationAPI →              │
    │  TraineeApplication                   │
    │                                       │
    │  - traineeApplicationId               │
    │  - traineeApplicationStatus           │
    │  - positionName                       │
    │  - departmentName                     │
    │  - traineeApplicationCreateAt         │
    │  + fullName (from JWT token)          │
    │  + email (from JWT token)             │
    │  + role (from JWT token)              │
    └───────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────────┐
    │  Update React State                   │
    │                                       │
    │  setApplications([...])               │
    │  setStudent({...})                    │
    │  setDocuments([...])                  │
    │  setProgress({...})                   │
    └───────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────────────┐
    │  Render UI                            │
    │  - Display applications               │
    │  - Show student info                  │
    │  - List documents                     │
    │  - Show progress                      │
    └───────────────────────────────────────┘
```

## 🔐 JWT Token Structure

```
┌─────────────────────────────────────────┐
│  JWT Token                              │
│  eyJhbGciOiJIUzI1NiJ9...                │
└─────────────────────────────────────────┘
                │
                │ Decode
                ▼
┌─────────────────────────────────────────┐
│  Token Payload                          │
│  {                                      │
│    "departmentName": "FC",              │
│    "role": "TRAINEE",                   │
│    "departmentId": "3",                 │
│    "sub": "Thành",        ← userName    │
│    "iat": 1764690551,     ← issued at   │
│    "exp": 1764708551      ← expires at  │
│  }                                      │
└─────────────────────────────────────────┘
                │
                ▼
        Used in Frontend as:
        - user.userName = "Thành"
        - user.role = "TRAINEE"
        - user.departmentName = "FC"
```

## 📊 Data Mapping Flow

```
API Response                         Frontend Model
────────────────                     ──────────────

traineeApplicationId: 5       →      id: "5"
                                    traineeApplicationId: 5

traineeApplicationStatus      →      status: "Pending"
  : "Pending"

positionName: null           →       positionName: null

departmentName: null         →       departmentName: null

traineeApplicationCreateAt   →       createdAt: Date
  : "2025-12-02..."

traineeApplicationUpdateAt   →       updatedAt: Date | null
  : null

active: true                →        active: true

[From JWT Token]            →        fullName: user.userName
                                    studentCode: user.userName
                                    email: user.gmail
                                    trainingRole: user.role
```

## 🔄 Component Data Flow

```
┌────────────────────────────────────────────────────────────┐
│                    useStudentData Hook                     │
│  (features/trainees/hooks/use-student-data.ts)            │
└────────────────────────────────────────────────────────────┘
                              │
                              │ Provides data
                              ▼
        ┌─────────────────────────────────────────┐
        │                                         │
        ▼                                         ▼
┌──────────────────┐                    ┌──────────────────┐
│  Navbar          │                    │  Documents Page  │
│  - Student info  │                    │  - Applications  │
│  - Notifications │                    │  - Documents     │
└──────────────────┘                    └──────────────────┘
        │                                         │
        ▼                                         ▼
┌──────────────────┐                    ┌──────────────────┐
│  Sidebar         │                    │  Dashboard       │
│  - Menu items    │                    │  - Stats         │
│  - Progress      │                    │  - Progress      │
└──────────────────┘                    └──────────────────┘
```

## ⚠️ Error Handling Flow

```
API Call
   │
   ├─ ✅ 200 OK
   │     │
   │     └─→ Process data → Update state → Render UI
   │
   ├─ ❌ 401 Unauthorized
   │     │
   │     └─→ Clear token → Redirect to /login
   │
   ├─ ❌ 500 Server Error
   │     │
   │     └─→ Show error toast → Log error → Retry?
   │
   └─ ❌ Network Error
         │
         └─→ Show offline message → Retry → Fallback data
```

## 🎯 Key Points

### ✅ What's Working
```
User Login
    ↓
Token Stored (localStorage)
    ↓
Token Passed to API (Authorization header)
    ↓
API Returns 200 OK
    ↓
Data Mapped Correctly
    ↓
UI Displays Data
```

### ❌ What Was Wrong
```
User Login
    ↓
Token Stored ✅
    ↓
Token NOT Passed ❌ (Missing)
    ↓
API Returns 401 ❌
    ↓
No Data
    ↓
UI Shows Error
```

## 📝 Code References

### Get Token
```typescript
// lib/auth-utils.ts
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}
```

### Use Token in API
```typescript
// lib/actions/trainee-submission.js
export async function getAllTraineeApplicationsByTrainee(token) {
  let authToken = token;
  if (!authToken && typeof window !== 'undefined') {
    authToken = localStorage.getItem('token');
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(API_URL, {
    method: 'GET',
    headers,
    cache: 'no-store'
  });

  return await response.json();
}
```

### Call from Component
```typescript
// features/trainees/hooks/use-student-data.ts
const user = getUser();
const token = getToken();

const response = await getAllTraineeApplicationsByTrainee(token);
```

---

**Diagram Version**: 1.0  
**Last Updated**: Dec 2, 2025  
**Status**: ✅ Reflects current implementation

