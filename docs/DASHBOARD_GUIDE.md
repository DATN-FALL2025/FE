# 🎨 Dashboard & User Display Guide

Complete guide về cách hiển thị user info và logout trong dashboard.

---

## ✅ Đã Implement

### 1. **Admin Navbar** với User Dropdown
**File:** `features/admin/components/layout/admin-navbar.tsx`

**Features:**
- ✅ Real-time user info từ `useAuthInfo()`
- ✅ Avatar display (với fallback initials)
- ✅ Username & email
- ✅ Role badge (dynamic)
- ✅ Profile link
- ✅ Settings link
- ✅ **Logout button** với full functionality

**Code:**
```typescript
const { user, displayName, avatar, role, logout } = useAuthInfo();
```

---

### 2. **Admin Sidebar** với User Section
**File:** `features/admin/components/layout/admin-sidebar.tsx`

**Features:**
- ✅ User info card ở bottom sidebar
- ✅ Avatar + Name + Role
- ✅ **Logout button** dedicated
- ✅ Responsive design

**Visual Structure:**
```
┌─────────────────┐
│ Navigation...   │
│                 │
│                 │
│ (auto margin)   │
│                 │
├─────────────────┤ ← Separator
│ 👤 User Name    │ ← User Info Card
│    Role         │
│                 │
│ [🚪 Logout]     │ ← Logout Button
└─────────────────┘
```

---

## 🎯 Flow Hoàn Chỉnh

### Login → Dashboard → Display User → Logout

```
1. User login tại /login
   ↓
2. authenticateAccount() → Store user data
   ↓
3. Redirect to /admin/dashboard
   ↓
4. AdminNavbar & AdminSidebar load user info
   ↓
5. Display: Avatar, Name, Email, Role
   ↓
6. Click Logout → Clear data → Redirect to /login
```

---

## 💡 Cách Sử Dụng

### **1. Navbar Dropdown (Desktop + Mobile)**

**Location:** Top right corner

**Actions:**
- **Click Avatar** → Opens dropdown menu
- **Profile** → Navigate to `/admin/profile`
- **Settings** → Navigate to `/admin/settings`  
- **Log out** → Logout và redirect to `/login`

**Displays:**
- User avatar (or initials if no image)
- Username
- Email
- Role badge

---

### **2. Sidebar User Section (Desktop Only)**

**Location:** Bottom of left sidebar

**Displays:**
- User avatar
- Username
- Role
- Dedicated Logout button

**Actions:**
- **Click Logout** → Instant logout

---

## 🔧 Technical Details

### User Data Source

```typescript
import { useAuthInfo } from '@/hooks/use-auth-info';

const { 
  user,        // Full user object
  displayName, // Display name (fallback to userName)
  avatar,      // Avatar URL (from accountImage)
  role,        // User role (from roles[0].roleName or role)
  logout       // Logout function
} = useAuthInfo();
```

### Avatar Logic

```typescript
// Get initials for fallback
const initials = displayName
  .split(' ')
  .map(n => n[0])
  .join('')
  .toUpperCase()
  .substring(0, 2) || 'U';

// Render
<Avatar>
  {avatar && <AvatarImage src={avatar} />}
  <AvatarFallback>{initials}</AvatarFallback>
</Avatar>
```

### Logout Implementation

```typescript
// From useAuthInfo hook
const logout = () => {
  // Clear localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('token');
  
  // Redirect to login
  router.push('/login');
};

// In component
<Button onClick={logout}>
  <LogOut /> Logout
</Button>
```

---

## 🎨 Styling Details

### Navbar User Section

```tsx
<Avatar className="h-10 w-10 border-2 border-primary/10">
  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
    {initials}
  </AvatarFallback>
</Avatar>
```

### Sidebar User Card

```tsx
<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
  <Avatar className="h-10 w-10">
    <AvatarFallback className="bg-primary text-primary-foreground">
      {initials}
    </AvatarFallback>
  </Avatar>
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium truncate">{displayName}</p>
    <p className="text-xs text-muted-foreground truncate">
      {role.replace(/_/g, ' ')}
    </p>
  </div>
</div>
```

### Logout Button Styling

```tsx
// Navbar
<DropdownMenuItem 
  className="text-red-600 focus:text-red-600 cursor-pointer"
  onClick={logout}
>
  <LogOut className="mr-2 h-4 w-4" />
  <span>Log out</span>
</DropdownMenuItem>

// Sidebar
<Button
  variant="ghost"
  className="w-full justify-start gap-3 mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
  onClick={logout}
>
  <LogOut className="h-5 w-5" />
  Logout
</Button>
```

---

## 🧪 Testing Flow

### Test Complete Flow

```bash
# 1. Start dev server
npm run dev

# 2. Go to login
http://localhost:3000/login

# 3. Login với credentials
Username: testuser
Password: 123456

# 4. Check dashboard
http://localhost:3000/admin/dashboard

# 5. Verify displays:
✓ Navbar: Avatar with initials/image
✓ Navbar: Click avatar shows dropdown
✓ Dropdown: Shows username, email, role
✓ Sidebar: User card at bottom
✓ Sidebar: Shows avatar, name, role

# 6. Test logout
Click "Logout" (navbar dropdown or sidebar button)
→ Should redirect to /login
→ localStorage should be cleared

# 7. Verify logout
Try to access /admin/dashboard without login
→ Should redirect to /login (if protected)
```

---

## 📊 What's Displayed

### User Info Structure

```typescript
user = {
  id: "123",
  userName: "john_doe",
  gmail: "john@example.com",
  accountImage: "https://...",
  role: "ADMIN",
  roles: [{roleName: "ADMIN"}],
  token: "...",
  loginTime: "2025-11-14T..."
}
```

### Display Mapping

| Data Field | Displayed As | Location |
|------------|-------------|----------|
| `userName` or `gmail` | Display Name | Navbar, Sidebar |
| `gmail` | Email | Navbar dropdown |
| `accountImage` | Avatar | Navbar, Sidebar |
| `role` or `roles[0].roleName` | Role Badge | Navbar, Sidebar |
| - | Initials (fallback) | Avatar |

---

## 🔒 Security Notes

### On Logout

**What Happens:**
```typescript
// 1. Clear all auth data
localStorage.removeItem('user');
localStorage.removeItem('isAuthenticated');
localStorage.removeItem('token');

// 2. Update React state
setUser(null);
setIsAuth(false);

// 3. Redirect
router.push('/login');
```

**Protected Routes:**
- Use `useRequireAuth()` hook để protect pages
- Auto redirect nếu `!isAuth`

---

## 🎯 Customization

### Change Avatar Size

```tsx
// Navbar (current: h-10 w-10)
<Avatar className="h-12 w-12">

// Sidebar (current: h-10 w-10)
<Avatar className="h-14 w-14">
```

### Add More Menu Items

```tsx
// In AdminNavbar dropdown
<DropdownMenuItem asChild>
  <Link href="/admin/notifications">
    <Bell className="mr-2 h-4 w-4" />
    <span>Notifications</span>
  </Link>
</DropdownMenuItem>
```

### Custom Role Display

```tsx
// Current: replaces underscore with space
{role.replace(/_/g, ' ')}

// Custom mapping
const roleMap = {
  'ADMIN': 'Administrator',
  'ACADEMIC_STAFF_AFFAIR': 'Academic Staff',
  'HEAD_OF_DEPARTMENT': 'Department Head',
  // ...
};

<Badge>{roleMap[role] || role}</Badge>
```

---

## 🚀 Quick Reference

### Import Hook
```typescript
import { useAuthInfo } from '@/hooks/use-auth-info';
```

### Get User Info
```typescript
const { user, displayName, avatar, role, logout } = useAuthInfo();
```

### Logout
```typescript
<Button onClick={logout}>Logout</Button>
```

### Check Auth
```typescript
const { isAuth, isLoading } = useAuthInfo();

if (!isAuth) return <Redirect to="/login" />;
```

---

## 📚 Related Files

**Components:**
- `features/admin/components/layout/admin-navbar.tsx` - Navbar with dropdown
- `features/admin/components/layout/admin-sidebar.tsx` - Sidebar with user section

**Hooks:**
- `hooks/use-auth-info.ts` - Auth state management

**Utils:**
- `lib/auth-utils.ts` - Auth helper functions

**Docs:**
- `docs/AUTH_SYSTEM.md` - Complete auth documentation
- `docs/UI_IMPLEMENTATION.md` - UI implementation guide

---

## ✅ Checklist

- [x] Login stores user data
- [x] Navbar displays user info
- [x] Navbar dropdown has logout
- [x] Sidebar displays user card
- [x] Sidebar has logout button
- [x] Logout clears data
- [x] Logout redirects to login
- [x] Avatar shows image or initials
- [x] Role badge displays correctly
- [x] Mobile responsive

---

**Status:** ✅ Complete & Production Ready  
**Version:** 1.0.0  
**Last Updated:** November 2025

