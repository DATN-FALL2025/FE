# Shared Components

Thư mục này chứa các components dùng chung trong toàn bộ ứng dụng.

## 📋 Components List

### 1. LoadingSpinner

**File:** `LoadingSpinner.tsx`

Loading indicator cho các trạng thái tải dữ liệu.

**Usage:**
```tsx
import { LoadingSpinner, InlineLoadingSpinner } from '@/components/shared';

// Full page loading
<LoadingSpinner message="Đang tải..." size="md" />

// Button loading
<Button disabled={isLoading}>
  {isLoading ? <InlineLoadingSpinner /> : "Submit"}
</Button>
```

**Props:**
- `message?: string` - Thông báo hiển thị
- `size?: "sm" | "md" | "lg"` - Kích thước spinner
- `className?: string` - Custom CSS classes

---

### 2. ErrorAlert

**File:** `ErrorAlert.tsx`

Hiển thị thông báo lỗi với options để retry hoặc dismiss.

**Usage:**
```tsx
import { ErrorAlert, InlineError } from '@/components/shared';

// Full error alert
<ErrorAlert 
  message="Không thể tải dữ liệu"
  title="Lỗi"
  onRetry={() => loadData()}
  onDismiss={() => setError("")}
/>

// Inline error for forms
<InlineError message="Trường này bắt buộc" />
```

**Props:**
- `message: string` - Nội dung lỗi
- `title?: string` - Tiêu đề (default: "Có lỗi xảy ra")
- `onRetry?: () => void` - Callback khi nhấn "Thử lại"
- `onDismiss?: () => void` - Callback khi đóng alert
- `className?: string` - Custom CSS

---

### 3. EmptyState

**File:** `EmptyState.tsx`

Hiển thị khi không có dữ liệu.

**Usage:**
```tsx
import { EmptyState, TableEmptyState } from '@/components/shared';
import { FileText } from 'lucide-react';

// Full empty state
<EmptyState 
  icon={FileText}
  title="Chưa có tài liệu"
  description="Bạn chưa có tài liệu nào. Hãy tạo tài liệu mới!"
  actionLabel="Tạo mới"
  onAction={() => setIsCreateOpen(true)}
/>

// Table empty state
<tbody>
  {items.length === 0 ? (
    <TableEmptyState message="Chưa có dữ liệu" colSpan={4} />
  ) : (
    // Render items
  )}
</tbody>
```

**Props:**
- `icon?: LucideIcon` - Icon hiển thị
- `title: string` - Tiêu đề
- `description?: string` - Mô tả
- `actionLabel?: string` - Label của button action
- `onAction?: () => void` - Callback khi click button
- `className?: string` - Custom CSS

---

### 4. ConfirmDialog

**File:** `ConfirmDialog.tsx`

Dialog xác nhận cho các actions quan trọng (delete, etc).

**Usage:**
```tsx
import { ConfirmDialog } from '@/components/shared';

<ConfirmDialog 
  open={isDeleteOpen}
  onOpenChange={setIsDeleteOpen}
  title="Xác nhận xóa"
  description="Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác."
  onConfirm={handleDelete}
  confirmLabel="Xóa"
  cancelLabel="Hủy"
  isLoading={isSubmitting}
  variant="destructive"
/>
```

**Props:**
- `open: boolean` - Dialog open state
- `onOpenChange: (open: boolean) => void` - Callback khi thay đổi state
- `title: string` - Tiêu đề
- `description: string | React.ReactNode` - Nội dung
- `onConfirm: () => void | Promise<void>` - Callback khi confirm
- `confirmLabel?: string` - Label button confirm (default: "Xác nhận")
- `cancelLabel?: string` - Label button cancel (default: "Hủy")
- `isLoading?: boolean` - Loading state
- `variant?: "default" | "destructive"` - Style variant

---

### 5. FormFields

**File:** `FormFields.tsx`

Form fields với label và error handling.

**Usage:**
```tsx
import { FormField, FormTextArea } from '@/components/shared';

<FormField 
  id="name"
  label="Tên"
  value={formData.name}
  onChange={(value) => setFormData({ ...formData, name: value })}
  placeholder="Nhập tên..."
  required
  error={errors.name}
/>

<FormTextArea 
  id="description"
  label="Mô tả"
  value={formData.description}
  onChange={(value) => setFormData({ ...formData, description: value })}
  rows={4}
  required
/>
```

**FormField Props:**
- `id: string` - Field ID
- `label: string` - Label text
- `value: string` - Field value
- `onChange: (value: string) => void` - Change callback
- `placeholder?: string` - Placeholder text
- `required?: boolean` - Required field
- `disabled?: boolean` - Disabled state
- `error?: string` - Error message
- `type?: "text" | "email" | "password" | "number"` - Input type

**FormTextArea Props:**
- Same as FormField but with:
- `rows?: number` - Number of rows (default: 4)

---

### 6. PageHeader

**File:** `PageHeader.tsx`

Header component cho management pages.

**Usage:**
```tsx
import { PageHeader } from '@/components/shared';
import { Plus } from 'lucide-react';

<PageHeader 
  title="Quản lý tài liệu"
  description="Quản lý và tổ chức các tài liệu của hệ thống"
  actionLabel="Tạo mới"
  onAction={() => setIsCreateOpen(true)}
  actionIcon={Plus}
/>

// Or with custom children
<PageHeader 
  title="Quản lý tài liệu"
  description="Mô tả..."
>
  <Button>Custom Action</Button>
</PageHeader>
```

**Props:**
- `title: string` - Page title
- `description?: string` - Page description
- `actionLabel?: string` - Action button label
- `onAction?: () => void` - Action callback
- `actionIcon?: LucideIcon` - Action button icon
- `children?: React.ReactNode` - Custom content instead of action button

---

### 7. ActionButtons

**File:** `ActionButtons.tsx`

Consistent action buttons cho table rows.

**Usage:**
```tsx
import { ActionButtons } from '@/components/shared';

// Full buttons
<ActionButtons 
  onView={() => openViewDialog(item)}
  onEdit={() => openEditDialog(item)}
  onDelete={() => openDeleteDialog(item)}
/>

// Compact dropdown menu
<ActionButtons 
  onView={() => openViewDialog(item)}
  onEdit={() => openEditDialog(item)}
  onDelete={() => openDeleteDialog(item)}
  compact
/>

// Custom labels
<ActionButtons 
  onView={() => openViewDialog(item)}
  onEdit={() => openEditDialog(item)}
  viewLabel="Xem"
  editLabel="Chỉnh sửa"
/>
```

**Props:**
- `onView?: () => void` - View callback
- `onEdit?: () => void` - Edit callback
- `onDelete?: () => void` - Delete callback
- `viewLabel?: string` - View button label (default: "Chi tiết")
- `editLabel?: string` - Edit button label (default: "Sửa")
- `deleteLabel?: string` - Delete button label (default: "Xóa")
- `compact?: boolean` - Use dropdown menu instead (default: false)

---

## 🎯 Import Pattern

### Named Imports (Recommended)
```tsx
import { 
  LoadingSpinner, 
  ErrorAlert, 
  EmptyState 
} from '@/components/shared';
```

### Individual Imports
```tsx
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorAlert } from '@/components/shared/ErrorAlert';
```

---

## 💡 Usage Examples

### Complete Management Page Pattern

```tsx
"use client";

import { useState, useEffect } from "react";
import { 
  LoadingSpinner, 
  ErrorAlert, 
  EmptyState,
  PageHeader,
  ActionButtons,
  ConfirmDialog
} from '@/components/shared';
import { getAllItems, deleteItemById } from '@/lib/actions/items';
import { Plus, FileText } from 'lucide-react';

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await getAllItems();
      if (result.status === 'success') {
        setItems(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      const result = await deleteItemById(selectedItem.id);
      if (result.status === 'success') {
        setIsDeleteOpen(false);
        setSelectedItem(null);
        loadItems();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Quản lý items"
        description="Quản lý các items trong hệ thống"
        actionLabel="Tạo mới"
        onAction={() => {/* Open create dialog */}}
        actionIcon={Plus}
      />

      {error && (
        <ErrorAlert 
          message={error}
          onRetry={loadItems}
          onDismiss={() => setError("")}
        />
      )}

      {items.length === 0 ? (
        <EmptyState 
          icon={FileText}
          title="Chưa có items"
          description="Bạn chưa có items nào. Hãy tạo mới!"
          actionLabel="Tạo item đầu tiên"
          onAction={() => {/* Open create dialog */}}
        />
      ) : (
        <table>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <ActionButtons 
                    onView={() => {/* View */}}
                    onEdit={() => {/* Edit */}}
                    onDelete={() => {
                      setSelectedItem(item);
                      setIsDeleteOpen(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmDialog 
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Xác nhận xóa"
        description={`Bạn có chắc chắn muốn xóa "${selectedItem?.name}"?`}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
        variant="destructive"
      />
    </div>
  );
}
```

---

## 🎨 Styling

Tất cả components sử dụng Tailwind CSS và tương thích với:
- Dark mode
- Responsive design
- shadcn/ui theme

---

## 🔗 Related

- **UI Components:** `components/ui/`
- **Server Actions:** `lib/actions/`
- **Documentation:** `docs/UI_IMPLEMENTATION.md`

---

**Version:** 1.0.0  
**Status:** ✅ Production Ready

