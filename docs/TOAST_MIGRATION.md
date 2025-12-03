# Toast Migration Guide

## ✅ Đã hoàn thành

### Layouts đã cập nhật:
- ✅ `app/layout.tsx` - Root layout
- ✅ `app/(auth)/layout.tsx` - Auth layout
- ✅ `app/(admin)/admin/layout.tsx` - Admin layout
- ✅ `app/(trainees)/trainees/layout.tsx` - Trainee layout
- ✅ `app/(head)/head/layout.tsx` - Head layout
- ✅ `app/(academic-staff)/academic-staff/layout.tsx` - Academic Staff layout
- ✅ `app/(training-director)/training-director/layout.tsx` - Training Director layout

Tất cả layouts đã có:
```typescript
import { Toaster } from "sonner";
<Toaster position="top-right" richColors />
```

## 📋 Pages cần migrate từ Alert sang Toast

### Auth Pages:
- [ ] `app/(auth)/login/page.tsx`
- [ ] `app/(auth)/signup/page.tsx`

### Admin Pages:
- [ ] `app/(admin)/admin/users/page.tsx`
- [ ] `app/(admin)/admin/positions/page.tsx`
- [ ] `app/(admin)/admin/documents/page.tsx`
- [ ] `app/(admin)/admin/document-rules/page.tsx`
- [ ] `app/(admin)/admin/departments/page.tsx`

### Other Pages:
- [ ] `app/(training-director)/training-director/settings/page.tsx`

## 🔄 Migration Pattern

### Before (Alert component):
```typescript
import { Alert, AlertDescription } from "@/components/ui/alert";

{error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

### After (Toast):
```typescript
import { toast } from "sonner";

// On error
toast.error(error, {
  description: "Vui lòng thử lại",
  duration: 4000,
});

// On success
toast.success("Thành công!", {
  description: "Thao tác đã hoàn thành",
  duration: 4000,
});

// On warning
toast.warning("Cảnh báo", {
  description: "Vui lòng kiểm tra lại",
  duration: 4000,
});

// On info
toast.info("Thông tin", {
  description: "Chi tiết thông tin",
  duration: 3000,
});
```

## 💡 Best Practices

### 1. Toast Types:
- `toast.success()` - Thành công (màu xanh)
- `toast.error()` - Lỗi (màu đỏ)
- `toast.warning()` - Cảnh báo (màu vàng)
- `toast.info()` - Thông tin (màu xanh dương)
- `toast.loading()` - Đang xử lý

### 2. Toast Options:
```typescript
toast.success("Message", {
  description: "Chi tiết",
  duration: 4000, // milliseconds
  action: {
    label: "Undo",
    onClick: () => console.log("Undo"),
  },
});
```

### 3. Loading Toast:
```typescript
const loadingToast = toast.loading("Đang xử lý...");

// Sau khi xong
toast.dismiss(loadingToast);
toast.success("Hoàn thành!");
```

### 4. Promise Toast:
```typescript
toast.promise(
  fetchData(),
  {
    loading: 'Đang tải...',
    success: (data) => `Đã tải ${data.length} items`,
    error: 'Lỗi khi tải dữ liệu',
  }
);
```

## 🎨 Toast Configuration

Trong layout:
```typescript
<Toaster 
  position="top-right"  // Vị trí: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  richColors            // Bật màu sắc đẹp
  expand={false}        // Không expand khi hover
  closeButton          // Hiện nút close
/>
```

## 📝 Migration Checklist

Khi migrate một page:

1. [ ] Import toast: `import { toast } from "sonner";`
2. [ ] Xóa Alert imports: `import { Alert, AlertDescription } from "@/components/ui/alert";`
3. [ ] Thay thế Alert components bằng toast calls
4. [ ] Remove error/success state nếu chỉ dùng cho Alert
5. [ ] Test toast hiển thị đúng
6. [ ] Kiểm tra message từ API được hiển thị
7. [ ] Update trong checklist này

## 🚀 Priority Order

1. **High Priority** (User-facing, frequent use):
   - Login page
   - Signup page
   - Documents page (đã xong)

2. **Medium Priority** (Admin features):
   - Users management
   - Positions management
   - Documents management

3. **Low Priority** (Settings, less frequent):
   - Settings pages
   - Other admin pages
