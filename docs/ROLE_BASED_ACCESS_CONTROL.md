# 🔒 Role-Based Access Control (RBAC)

## Tổng quan
Hệ thống bảo vệ URL theo role name với 2 lớp bảo vệ:
1. **Server-side (Middleware)** - Chặn request trước khi vào page
2. **Client-side (RoleGuard)** - Kiểm tra và redirect trong component

## Roles trong hệ thống

| Role Name | Route Path | Dashboard |
|-----------|-----------|-----------|
| `ADMIN` | `/admin/*` | `/admin/dashboard` |
| `ACADEMIC_STAFF_AFFAIR` | `/academic-staff/*` | `/academic-staff/dashboard` |
| `HEAD_OF_DEPARTMENT` | `/head/*` | `/head/dashboard` |
| `TRAINING_DIRECTOR` | `/training-director/*` | `/training-director/dashboard` |
| `TRAINEE` | `/trainees/*` | `/trainees/dashboard` |

## Cách hoạt động

### 1. Server-side Protection (middleware.ts)

Middleware kiểm tra mỗi request:

```typescript
// Lấy role từ cookie
const authStorage = request.cookies.get("auth-storage");
const userRole = authData?.state?.user?.role;

// Kiểm tra quyền truy cập
const allowedPaths = ROLE_ROUTES[userRole];
const hasAccess = allowedPaths.some(path => pathname.startsWith(path));

// Nếu không có quyền → redirect về dashboard của role đó
if (!hasAccess) {
  return NextResponse.redirect(new URL(redirectPath, request.url));
}
```

**Ví dụ:**
- User có role `TRAINEE` cố truy cập `/admin/dashboard`
- Middleware chặn và redirect về `/trainees/dashboard`

### 2. Client-side Protection (RoleGuard)

Component `<RoleGuard>` bọc layout để kiểm tra role:

```tsx
<RoleGuard allowedRoles={["ADMIN"]}>
  <div>Admin content...</div>
</RoleGuard>
```

**Ví dụ sử dụng trong layout:**

```tsx
// app/(admin)/admin/layout.tsx
export default function AdminLayout({ children }) {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="min-h-screen">
        <AdminNavbar />
        <AdminSidebar />
        {children}
      </div>
    </RoleGuard>
  );
}
```

### 3. Authentication Storage

Khi user login, thông tin được lưu vào:

**localStorage:**
```json
{
  "user": {
    "id": "123",
    "userName": "admin",
    "role": "ADMIN",
    "token": "jwt-token"
  },
  "isAuthenticated": "true"
}
```

**Cookie (cho middleware):**
```json
{
  "state": {
    "user": {
      "role": "ADMIN",
      ...
    }
  }
}
```

## Flow đăng nhập

```
1. User nhập username/password
   ↓
2. authenticateAccount() gọi API
   ↓
3. Nhận response với role
   ↓
4. setUser() lưu vào localStorage + Cookie
   ↓
5. getRoleRedirectPath() xác định dashboard
   ↓
6. router.push() redirect đến dashboard
   ↓
7. Middleware kiểm tra cookie
   ↓
8. RoleGuard kiểm tra localStorage
   ↓
9. Hiển thị dashboard nếu role hợp lệ
```

## Kiểm tra quyền trong code

### Kiểm tra authentication
```typescript
import { isAuthenticated } from "@/lib/auth-utils";

if (!isAuthenticated()) {
  router.push("/login");
}
```

### Kiểm tra role cụ thể
```typescript
import { hasRole } from "@/lib/auth-utils";

if (hasRole("ADMIN")) {
  // Admin only code
}
```

### Kiểm tra nhiều roles
```typescript
import { hasAnyRole } from "@/lib/auth-utils";

if (hasAnyRole(["ADMIN", "HEAD_OF_DEPARTMENT"])) {
  // Code cho admin hoặc head
}
```

### Lấy thông tin user
```typescript
import { getUser, getUserRole } from "@/lib/auth-utils";

const user = getUser();
const role = getUserRole();
```

## Bảo vệ API routes

Để bảo vệ API routes, kiểm tra token trong header:

```typescript
// app/api/admin/route.ts
import { NextRequest } from "next/server";
import { getToken, getRoleFromToken } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = getRoleFromToken();
  
  if (role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Admin API logic
  return Response.json({ data: "Admin data" });
}
```

## Logout

```typescript
import { logout } from "@/lib/auth-utils";

const handleLogout = () => {
  logout(); // Xóa localStorage + cookie
  router.push("/login");
};
```

## Testing

### Test case 1: User đúng role
```
1. Login với role ADMIN
2. Truy cập /admin/dashboard
3. ✅ Thành công - hiển thị dashboard
```

### Test case 2: User sai role
```
1. Login với role TRAINEE
2. Truy cập /admin/dashboard
3. ❌ Bị chặn - redirect về /trainees/dashboard
```

### Test case 3: Chưa login
```
1. Không login
2. Truy cập /admin/dashboard
3. ❌ Bị chặn - redirect về /login
```

## Security Notes

⚠️ **Quan trọng:**

1. **Cookie Security**: Cookie được set với `SameSite=Lax` để chống CSRF
2. **Token Validation**: Trong production, validate JWT token ở server
3. **HTTPS Only**: Trong production, thêm `Secure` flag cho cookie
4. **Token Expiry**: Kiểm tra token expiry và refresh token
5. **Rate Limiting**: Thêm rate limiting cho login endpoint

## Troubleshooting

### Vấn đề: Bị redirect liên tục
**Nguyên nhân:** Cookie không được set đúng
**Giải pháp:** Kiểm tra `setUser()` đã được gọi sau login

### Vấn đề: Middleware không chặn
**Nguyên nhân:** Cookie không được gửi lên server
**Giải pháp:** Kiểm tra cookie trong DevTools → Application → Cookies

### Vấn đề: RoleGuard không hoạt động
**Nguyên nhân:** localStorage chưa có data
**Giải pháp:** Đảm bảo `setUser()` được gọi trước khi redirect

## Files liên quan

- `middleware.ts` - Server-side route protection
- `lib/auth-utils.ts` - Authentication utilities
- `components/auth/role-guard.tsx` - Client-side role guard
- `app/(auth)/login/page.tsx` - Login page
- `app/(admin)/admin/layout.tsx` - Admin layout với RoleGuard
- `app/(trainees)/trainees/layout.tsx` - Trainee layout với RoleGuard
- `app/(head)/head/layout.tsx` - Head layout với RoleGuard
- `app/(training-director)/training-director/layout.tsx` - Training Director layout
- `app/(academic-staff)/academic-staff/layout.tsx` - Academic Staff layout

---

**Cập nhật:** 2024-12-03
**Status:** ✅ Hoàn thành - 2 lớp bảo vệ (Server + Client)
