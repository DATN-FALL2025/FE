# 🔧 Hydration Error Fix - SSR vs Client State Mismatch

## 🐛 The Problem

**Error:**
```
Unhandled Runtime Error
Error: Text content does not match server-rendered HTML.
Text content did not match. Server: "G" Client: "T"
```

**Root Cause:**
- `useAuthInfo` hook reads from `localStorage`
- `localStorage` is **not available during Server-Side Rendering (SSR)**
- Server renders default values (e.g., "Guest")
- Client hydrates with actual user data from localStorage (e.g., "Thanh Vinh")
- **Mismatch** between server and client HTML → Hydration error

---

## ✅ The Solution

Use **`mounted` state** to defer rendering user-specific content until after client-side hydration is complete.

### Pattern

```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

return (
  <div>
    {mounted ? (
      // Render dynamic content from localStorage
      <UserInfo />
    ) : (
      // Render loading skeleton (matches SSR output)
      <LoadingSkeleton />
    )}
  </div>
);
```

---

## 📝 Files Fixed

### 1. Admin Sidebar (`features/admin/components/layout/admin-sidebar.tsx`)

**Before:**
```typescript
export const AdminSidebar = () => {
  const { displayName, avatar, role, logout } = useAuthInfo();
  
  return (
    <aside>
      {/* User info always rendered */}
      <div>
        <p>{displayName}</p> {/* Causes hydration error! */}
        <p>{role}</p>
      </div>
    </aside>
  );
};
```

**After:**
```typescript
export const AdminSidebar = () => {
  const { displayName, avatar, role, logout } = useAuthInfo();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <aside>
      {mounted ? (
        // ✅ Only render after mount
        <div>
          <p>{displayName}</p>
          <p>{role}</p>
        </div>
      ) : (
        // ✅ Loading skeleton for SSR
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
      )}
    </aside>
  );
};
```

### 2. Admin Navbar (`features/admin/components/layout/admin-navbar.tsx`)

**Before:**
```typescript
return (
  <header>
    <DropdownMenu>
      <Avatar>
        <AvatarFallback>{initials}</AvatarFallback> {/* Hydration error! */}
      </Avatar>
      <DropdownMenuContent>
        <p>{userName}</p> {/* Hydration error! */}
        <p>{userEmail}</p>
      </DropdownMenuContent>
    </DropdownMenu>
  </header>
);
```

**After:**
```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

return (
  <header>
    {mounted ? (
      // ✅ Render actual user dropdown
      <DropdownMenu>
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <DropdownMenuContent>
          <p>{userName}</p>
          <p>{userEmail}</p>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      // ✅ Loading skeleton
      <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
    )}
  </header>
);
```

---

## 🎯 Why This Works

### SSR (Server-Side Rendering)
```typescript
// During SSR
mounted = false (useState initial value)
// Renders: <LoadingSkeleton />
```

### Client Hydration
```typescript
// On client mount
useEffect runs → setMounted(true)
// Triggers re-render
mounted = true
// Renders: <UserInfo /> with localStorage data
```

### No Mismatch!
- **Server HTML:** Loading skeleton
- **Client Initial Render:** Loading skeleton (matches!)
- **Client After useEffect:** User info (no hydration error because this is a new render)

---

## 📊 Flow Diagram

```
1. Server Renders
   ├─ mounted = false
   └─ Output: <LoadingSkeleton />

2. Client Receives HTML
   ├─ mounted = false
   └─ Hydrates: <LoadingSkeleton /> ✅ Match!

3. useEffect Runs
   ├─ setMounted(true)
   └─ Triggers re-render

4. Client Re-renders
   ├─ mounted = true
   └─ Output: <UserInfo data={localStorage} /> ✅ No error!
```

---

## 🎨 Loading Skeletons

### Sidebar Skeleton
```tsx
<div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 animate-pulse">
  <div className="h-10 w-10 rounded-full bg-muted" />
  <div className="flex-1 min-w-0 space-y-2">
    <div className="h-4 w-24 bg-muted rounded" />
    <div className="h-3 w-16 bg-muted rounded" />
  </div>
</div>
```

### Navbar Skeleton
```tsx
<div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
```

**Why Skeletons?**
- Provides visual feedback during loading
- Prevents layout shift (CLS optimization)
- Matches the final content's dimensions
- Better UX than blank space

---

## 🚨 Common Pitfalls

### ❌ Don't Do This

```typescript
// ❌ BAD: Still causes hydration error
const userName = typeof window !== 'undefined' 
  ? localStorage.getItem('user') 
  : 'Guest';

return <p>{userName}</p>; // Server: "Guest", Client: "John" → Error!
```

### ✅ Do This Instead

```typescript
// ✅ GOOD: Use mounted state
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

return <p>{mounted ? userName : '...'}</p>; // No mismatch!
```

---

## 🔍 When to Use This Pattern

Use `mounted` state when:
1. **Reading from localStorage/sessionStorage**
2. **Using browser-only APIs** (window, document, navigator)
3. **Client-side only data** (user preferences, auth state)
4. **Dynamic imports** that depend on client environment
5. **Third-party scripts** that modify DOM

**Don't need it for:**
- Static data
- Server-side fetched data
- Props passed from parent
- Constants and configs

---

## 🧪 Testing

### Before Fix
```
❌ Hydration error on every page load
❌ Console warnings
❌ Potential layout flashing
```

### After Fix
```
✅ No hydration errors
✅ Clean console
✅ Smooth loading skeleton → user info transition
```

---

## 📚 Alternative Solutions

### Option 1: Mounted State (Current Solution)
**Pros:**
- Simple and straightforward
- Works for any client-only data
- No external dependencies

**Cons:**
- Brief loading skeleton flash
- Two render cycles

### Option 2: suppressHydrationWarning
```tsx
<p suppressHydrationWarning>{userName}</p>
```

**Pros:**
- No extra renders
- No loading states

**Cons:**
- ⚠️ **Not recommended** - hides the problem instead of solving it
- Can cause subtle bugs
- React may not update correctly

### Option 3: Move to Server Component
**Pros:**
- No hydration issues
- Server-side data

**Cons:**
- Can't use localStorage/client APIs
- Not suitable for user-specific data

**✅ Mounted State is the recommended solution for our use case.**

---

## 🎓 Learn More

- [Next.js Hydration Errors](https://nextjs.org/docs/messages/react-hydration-error)
- [React Hydration](https://react.dev/reference/react-dom/client/hydrateRoot)
- [SSR vs CSR](https://nextjs.org/docs/app/building-your-application/rendering)

---

## ✅ Summary

| Issue | Solution |
|-------|----------|
| **Problem** | Server renders "Guest", Client renders "Thanh Vinh" |
| **Cause** | localStorage not available during SSR |
| **Fix** | Use `mounted` state to defer client-specific rendering |
| **Result** | ✅ No hydration errors, smooth UX |

**Files Updated:**
- ✅ `features/admin/components/layout/admin-sidebar.tsx`
- ✅ `features/admin/components/layout/admin-navbar.tsx`

**No more hydration errors!** 🎉

