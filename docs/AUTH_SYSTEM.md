# 🔐 Authentication System Guide

Complete guide về hệ thống authentication đã implement.

---

## 📋 Mục Lục

1. [Overview](#overview)
2. [Auth Utils](#auth-utils)
3. [React Hooks](#react-hooks)
4. [Components](#components)
5. [Usage Examples](#usage-examples)
6. [API Integration](#api-integration)

---

## 🎯 Overview

### Files Structure

```
lib/
├── actions/auth.js          # Server actions cho auth API
└── auth-utils.ts            # Auth utility functions

hooks/
└── use-auth-info.ts         # React hooks cho auth state

components/shared/
└── UserInfo.tsx             # User info components

app/(auth)/
├── login/page.tsx           # Login page
└── signup/page.tsx          # Signup page
```

### Flow

```
User Login → API Call → Store Data → Redirect
     ↓
localStorage:
  - user: {id, userName, gmail, role, ...}
  - isAuthenticated: "true"
  - token: "..." (if available)
```

---

## 🛠️ Auth Utils

**File:** `lib/auth-utils.ts`

### Functions Available

```typescript
// Get user info
getUser(): UserData | null
getUserRole(): string | null
getUserDisplayName(): string
getUserAvatar(): string | null
getToken(): string | null

// Set user info
setUser(userData: UserData): void

// Check auth status
isAuthenticated(): boolean
hasRole(role: string): boolean
hasAnyRole(roles: string[]): boolean

// Logout
logout(): void

// Redirect helpers
getRoleRedirectPath(role?: string): string
```

### Usage Examples

```typescript
import { 
  getUser, 
  isAuthenticated, 
  logout,
  getUserRole 
} from '@/lib/auth-utils';

// Check if user logged in
if (isAuthenticated()) {
  const user = getUser();
  console.log('Welcome', user?.userName);
}

// Get user role
const role = getUserRole();
if (role === 'ADMIN') {
  // Show admin features
}

// Logout
logout(); // Clears all auth data
```

---

## ⚛️ React Hooks

**File:** `hooks/use-auth-info.ts`

### 1. useAuthInfo()

Main hook to access auth state in components.

```typescript
const { 
  user,           // User data object
  isAuth,         // Boolean: is authenticated
  isLoading,      // Boolean: loading state
  role,           // String: user role
  displayName,    // String: display name
  avatar,         // String: avatar URL
  token,          // String: auth token
  logout,         // Function: logout user
  refreshUser     // Function: refresh user data
} = useAuthInfo();
```

**Example:**

```typescript
'use client';
import { useAuthInfo } from '@/hooks/use-auth-info';

export default function Dashboard() {
  const { user, displayName, role, logout } = useAuthInfo();

  if (!user) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {displayName}!</h1>
      <p>Your role: {role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. useRequireAuth()

Hook to protect routes - redirects to login if not authenticated.

```typescript
'use client';
import { useRequireAuth } from '@/hooks/use-auth-info';

export default function ProtectedPage() {
  const { isAuth, isLoading } = useRequireAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuth) return null; // Will redirect

  return <div>Protected content</div>;
}
```

### 3. useRoleCheck()

Check if user has required role(s).

```typescript
'use client';
import { useRoleCheck } from '@/hooks/use-auth-info';

export default function AdminPage() {
  const { hasAccess, role } = useRoleCheck(['ADMIN', 'ACADEMIC_STAFF_AFFAIR']);

  if (!hasAccess) {
    return <div>Access denied. Your role: {role}</div>;
  }

  return <div>Admin content</div>;
}
```

---

## 🎨 Components

**File:** `components/shared/UserInfo.tsx`

### 1. UserInfo (Dropdown Menu)

Full user info with dropdown menu - dùng trong header/navbar.

```typescript
import { UserInfo } from '@/components/shared';

export default function Header() {
  return (
    <header>
      <nav>
        {/* Other nav items */}
        <UserInfo />
      </nav>
    </header>
  );
}
```

**Features:**
- Avatar display
- Username & email
- Role badge
- Profile link
- Settings link
- Logout button

### 2. UserInfoInline (Simple Display)

Simple inline user display without dropdown.

```typescript
import { UserInfoInline } from '@/components/shared';

export default function Sidebar() {
  return (
    <div>
      <UserInfoInline />
      {/* Other sidebar content */}
    </div>
  );
}
```

---

## 💡 Usage Examples

### Example 1: Check Auth in Page

```typescript
// app/admin/dashboard/page.tsx
'use client';
import { useAuthInfo } from '@/hooks/use-auth-info';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { isAuth, role, isLoading } = useAuthInfo();

  useEffect(() => {
    if (!isLoading && !isAuth) {
      redirect('/login');
    }
  }, [isAuth, isLoading]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Your role: {role}</p>
    </div>
  );
}
```

### Example 2: Conditional Rendering Based on Role

```typescript
'use client';
import { useAuthInfo } from '@/hooks/use-auth-info';

export default function Features() {
  const { role } = useAuthInfo();

  return (
    <div>
      {/* Available for all */}
      <div>Common features</div>

      {/* Admin only */}
      {role === 'ADMIN' && (
        <div>Admin features</div>
      )}

      {/* Multiple roles */}
      {['ADMIN', 'HEAD_OF_DEPARTMENT'].includes(role || '') && (
        <div>Management features</div>
      )}
    </div>
  );
}
```

### Example 3: Protected API Calls with Token

```typescript
'use client';
import { getToken } from '@/lib/auth-utils';

async function fetchProtectedData() {
  const token = getToken();

  const response = await fetch('/api/protected', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  return response.json();
}
```

### Example 4: Login Flow

```typescript
// app/(auth)/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateAccount } from '@/lib/actions/auth';
import { setUser, getRoleRedirectPath } from '@/lib/auth-utils';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ userName: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await authenticateAccount(formData);

    if (result.status === 'success' && result.data) {
      // Store user info
      setUser(result.data);

      // Redirect based on role
      const redirectPath = getRoleRedirectPath();
      router.push(redirectPath);
    }
  };

  return <form onSubmit={handleLogin}>{/* Form fields */}</form>;
}
```

### Example 5: Logout Button

```typescript
'use client';
import { useAuthInfo } from '@/hooks/use-auth-info';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const { logout } = useAuthInfo();

  return (
    <Button onClick={logout} variant="destructive">
      Logout
    </Button>
  );
}
```

---

## 🔌 API Integration

### Login API

**Endpoint:** `POST /account/v1/authenticateAccount`

**Request:**
```typescript
{
  userName: string,
  password: string
}
```

**Response:**
```typescript
{
  status: "200 OK",
  message: "Login successfully",
  data: "eyJhbGciOiJIUzI1NiJ9..." // JWT Token string
}
```

### JWT Token Decoding

The API returns a JWT token that contains important user information. The token is **automatically decoded** by `authenticateAccount` server action.

**JWT Payload Structure:**
```json
{
  "role": "ADMIN",           // User's role
  "sub": "thanhvinhco1234",  // Username (subject)
  "iat": 1763105130,         // Issued at (Unix timestamp)
  "exp": 1763123130          // Expires at (Unix timestamp)
}
```

**Decoded User Data (stored in localStorage):**
```typescript
{
  token: "eyJhbGciOiJIUzI1NiJ9...",  // Original JWT token
  userName: "thanhvinhco1234",        // Extracted from 'sub'
  role: "ADMIN",                      // Extracted from 'role'
  iat: 1763105130,                    // Token issued time
  exp: 1763123130                     // Token expiration time
}
```

**How Decoding Works:**
1. Backend returns JWT token as string in `data` field
2. `decodeJWT()` function splits token into 3 parts: `header.payload.signature`
3. Payload (middle part) is base64 decoded
4. User info (`role`, `userName` from `sub`) is extracted
5. Complete user data object is stored in localStorage via `setUser()`

**Implementation in `lib/actions/auth.js`:**
```javascript
function decodeJWT(token) {
  const parts = token.split('.');
  const payload = parts[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
  return JSON.parse(jsonPayload);
}
```

### Signup API

**Endpoint:** `POST /account/v1/createUser`

**Request:**
```typescript
{
  userName: string,
  password: string,
  gmail: string,
  accountImage?: string
}
```

**Response:**
```typescript
{
  status: "200 OK",
  message: "Create account successfully",
  data: null
}
```

---

## 🎯 Best Practices

### 1. Always Check Auth in Protected Pages

```typescript
const { isAuth, isLoading } = useRequireAuth();
if (isLoading) return <LoadingSpinner />;
if (!isAuth) return null;
```

### 2. Use Role-Based Access Control

```typescript
const { hasAccess } = useRoleCheck(['ADMIN']);
if (!hasAccess) return <AccessDenied />;
```

### 3. Handle Token Expiration

```typescript
// Refresh user data periodically
useEffect(() => {
  const interval = setInterval(() => {
    refreshUser();
  }, 60000); // Every minute

  return () => clearInterval(interval);
}, [refreshUser]);
```

### 4. Clear Sensitive Data on Logout

```typescript
// logout() already clears:
// - localStorage.user
// - localStorage.isAuthenticated  
// - localStorage.token
```

### 5. Sync Auth State Across Tabs

```typescript
// useAuthInfo already listens to storage events
// Changes in one tab will reflect in all tabs
```

---

## 🔒 Security Notes

### ⚠️ Important

1. **LocalStorage is NOT secure** - Don't store sensitive data
2. **Tokens should expire** - Implement token refresh if needed
3. **Validate on server** - Client-side checks are for UX only
4. **HTTPS only** - Always use HTTPS in production
5. **XSS protection** - Sanitize user input

### Recommendations

- Implement token refresh mechanism
- Add session timeout
- Use HttpOnly cookies for tokens (if possible)
- Implement CSRF protection
- Add rate limiting on login attempts

---

## 🚀 Quick Start

### 1. Login User

```typescript
import { authenticateAccount } from '@/lib/actions/auth';
import { setUser } from '@/lib/auth-utils';

const result = await authenticateAccount({ userName, password });
if (result.status === 'success') {
  setUser(result.data);
}
```

### 2. Access User Info in Component

```typescript
import { useAuthInfo } from '@/hooks/use-auth-info';

const { user, displayName, role } = useAuthInfo();
```

### 3. Show User Avatar

```typescript
import { UserInfo } from '@/components/shared';

<UserInfo />
```

### 4. Logout

```typescript
import { useAuthInfo } from '@/hooks/use-auth-info';

const { logout } = useAuthInfo();
logout(); // Clears everything and redirects to login
```

---

## 📚 Related Documentation

- **Server Actions:** `docs/api-use.md`
- **UI Implementation:** `docs/UI_IMPLEMENTATION.md`
- **Shared Components:** `components/shared/README.md`

---

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Status:** ✅ Production Ready

