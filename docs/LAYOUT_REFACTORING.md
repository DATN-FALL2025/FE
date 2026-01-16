# Tái Cấu Trúc Layout - Shared Components

## Tổng Quan

Dự án đã được tái cấu trúc để sử dụng chung 1 layout, 1 header và 1 sidebar cho tất cả các role thay vì mỗi role có layout riêng.

## Cấu Trúc Mới

### 1. Shared Components

Tất cả các component layout được đặt trong `components/shared/`:

- **app-layout.tsx**: Layout wrapper chung cho tất cả các role
- **app-navbar.tsx**: Header/Navbar chung, hiển thị thông tin user và logo
- **app-sidebar.tsx**: Sidebar chung cho desktop, hiển thị menu dựa trên role
- **app-mobile-sidebar.tsx**: Sidebar cho mobile devices

### 2. Navigation Configuration

File `config/navigation.ts` chứa cấu hình navigation cho tất cả các role:

```typescript
export const navigationConfig: Record<string, RoleNavigation> = {
  ADMIN: { ... },
  HEAD_OF_DEPARTMENT: { ... },
  ACADEMIC_STAFF_AFFAIR: { ... },
  TRAINING_DIRECTOR: { ... },
  TRAINEE: { ... },
}
```

Mỗi role có:
- `basePath`: Đường dẫn gốc (vd: `/admin`, `/trainees`)
- `title`: Tiêu đề hiển thị
- `items`: Danh sách menu items với icon và href

### 3. Layout Files

Các layout files trong mỗi role folder đã được đơn giản hóa:

```typescript
// app/(admin)/admin/layout.tsx
import { AppLayout } from "@/components/shared/app-layout";

export default function AdminLayout({ children }) {
  return (
    <AppLayout allowedRoles={["ADMIN"]}>
      {children}
    </AppLayout>
  );
}
```

## Lợi Ích

1. **DRY (Don't Repeat Yourself)**: Không còn duplicate code giữa các role
2. **Dễ bảo trì**: Chỉ cần sửa 1 nơi để thay đổi layout cho tất cả
3. **Nhất quán**: UI/UX giống nhau trên tất cả các role
4. **Dễ mở rộng**: Thêm role mới chỉ cần thêm config trong `navigation.ts`

## Cách Thêm Role Mới

1. Thêm navigation config trong `config/navigation.ts`:
```typescript
NEW_ROLE: {
  basePath: "/new-role",
  title: "Tên Role",
  items: [
    { name: "Menu 1", href: "/new-role/page1", icon: IconComponent },
    // ...
  ],
}
```

2. Tạo layout file:
```typescript
// app/(new-role)/new-role/layout.tsx
import { AppLayout } from "@/components/shared/app-layout";

export default function NewRoleLayout({ children }) {
  return (
    <AppLayout allowedRoles={["NEW_ROLE"]}>
      {children}
    </AppLayout>
  );
}
```

3. Tạo các page files như bình thường

## Các File Đã Xóa

Các file layout cũ của từng role có thể được xóa (nếu muốn):
- `features/admin/components/layout/admin-navbar.tsx`
- `features/admin/components/layout/admin-sidebar.tsx`
- `features/admin/components/layout/admin-mobile-sidebar.tsx`
- Tương tự cho các role khác...

## Lưu Ý

- RoleGuard vẫn hoạt động như cũ, đảm bảo security
- Toaster notifications vẫn được hiển thị
- Mobile responsive vẫn hoạt động tốt
- Theme switching vẫn hoạt động bình thường
