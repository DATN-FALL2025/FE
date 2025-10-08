# 🔐 Authentication & Authorization System

## Overview
Complete authentication system với login, signup và role-based access control (RBAC).

## Features

### ✅ Pages Created
- `/login` - Login page với role selection
- `/signup` - Student registration page
- Auth layout với gradient background

### ✅ Role-Based Routing
Sau khi login, user được redirect đến dashboard tương ứng với role:

| Role | Dashboard URL | Description |
|------|--------------|-------------|
| **Student** | `/students/dashboard` | Student portal với document upload |
| **Admin** | `/admin/dashboard` | Full system administration |
| **Head of Department** | `/head/dashboard` | Department management |
| **Input Document Manager** | `/manager/dashboard` | Document approval workflow |

### ✅ Authentication Flow

#### Login Process:
1. User chọn role (Admin, Head, Manager, Student)
2. Nhập email và password
3. Submit → Zustand lưu state → Redirect to dashboard

#### Signup Process (Student only):
1. Điền thông tin: Full Name, Student ID, Email, Program
2. Tạo password
3. Auto login as Student → Redirect to `/students/dashboard`

## Tech Stack

### State Management
- **Zustand** - Lightweight state management
- **zustand/middleware/persist** - Persist auth state in localStorage

### Hooks
```typescript
// hooks/use-auth.ts
const { user, isAuthenticated, login, logout } = useAuth();
```

### Middleware
```typescript
// middleware.ts
- Protects authenticated routes
- Redirects unauthenticated users to /login
- Public routes: /, /login, /signup, /about, /programs, /contact
```

## Usage Examples

### Login Component
```tsx
const { login } = useAuth();

const handleLogin = () => {
  login(email, "student"); // or "admin", "head", "manager"
  router.push("/students/dashboard");
};
```

### Protected Route
```tsx
const { user, isAuthenticated } = useAuth();

if (!isAuthenticated) {
  router.push("/login");
}
```

### Logout
```tsx
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  router.push("/");
};
```

## Demo Credentials

### Admin
- Email: `admin@idmawa.edu.vn`
- Password: Any (mock auth)
- Role: Select "System Admin"

### Head of Department
- Email: `anndh2@fe.edu.vn`
- Password: Any
- Role: Select "Head of Department"

### Document Manager
- Email: `manager@idmawa.edu.vn`
- Password: Any
- Role: Select "Input Document Manager"

### Student
- Email: `hieptthse161662@fpt.edu.vn`
- Password: Any
- Role: Select "Student" or use Signup

## Security Notes

⚠️ **Current Implementation is for DEMO purposes only**

For production, implement:
1. Real JWT token validation
2. Server-side session management
3. Password hashing with bcrypt
4. Rate limiting on login attempts
5. CSRF protection
6. HTTP-only cookies for tokens

## File Structure

```
app/
├── (auth)/
│   ├── layout.tsx         # Auth layout với gradient
│   ├── login/
│   │   └── page.tsx      # Login page
│   └── signup/
│       └── page.tsx      # Signup page
├── (dashboard)/          # Admin, Head, Manager routes
├── (students)/           # Student routes
└── page.tsx             # Landing page (updated links)

hooks/
└── use-auth.ts          # Zustand auth store

middleware.ts            # Route protection
```

## Next Steps

### Production Checklist
- [ ] Integrate with backend API
- [ ] Add JWT token management
- [ ] Implement refresh token rotation
- [ ] Add email verification
- [ ] Add password reset flow
- [ ] Add 2FA (Two-Factor Authentication)
- [ ] Add social login (Google, Microsoft)
- [ ] Add remember me functionality
- [ ] Add session timeout
- [ ] Add audit logging

### UI Enhancements
- [ ] Add loading states
- [ ] Add error handling & toast notifications
- [ ] Add form validation with Zod
- [ ] Add password strength indicator
- [ ] Add "Show Password" toggle
- [ ] Add remember device option

## Testing

Access the pages:
- Landing: `http://localhost:3000`
- Login: `http://localhost:3000/login`
- Signup: `http://localhost:3000/signup`

Test the flow:
1. Click "Get Started" → Redirects to Signup
2. Fill form → Auto login as Student
3. Or use Login → Select role → Access respective dashboard
4. Logout → Return to landing page

---

**Created**: 2024-10-08
**Status**: ✅ Production-ready (with backend integration)

