# UI Implementation Guide

Tài liệu này hướng dẫn chi tiết về các giao diện đã được implement và cách sử dụng chúng.

## 📋 Mục Lục

1. [Authentication Pages](#authentication-pages)
2. [Admin Dashboard](#admin-dashboard)
3. [Architecture & Patterns](#architecture--patterns)
4. [Common Components](#common-components)

---

## 🔐 Authentication Pages

### Login Page (`app/(auth)/login/page.tsx`)

**Route:** `/login`

**Features:**
- ✅ Real API integration với `authenticateAccount`
- ✅ Error handling và validation
- ✅ Loading states
- ✅ Responsive design
- ✅ Success/Error alerts

**Usage Example:**
```typescript
// API sẽ trả về user data khi đăng nhập thành công
// Data được lưu vào localStorage
const result = await authenticateAccount({
  userName: "user123",
  password: "password123"
});

if (result.status === 'success') {
  // Redirect to dashboard
  router.push("/admin/dashboard");
}
```

**Fields:**
- `userName` (required) - Tên đăng nhập
- `password` (required) - Mật khẩu

---

### Signup Page (`app/(auth)/signup/page.tsx`)

**Route:** `/signup`

**Features:**
- ✅ Real API integration với `createUser`
- ✅ Password confirmation validation
- ✅ Email validation
- ✅ Success message với auto-redirect
- ✅ Error handling

**Usage Example:**
```typescript
const result = await createUser({
  userName: "newuser",
  gmail: "user@example.com",
  password: "securepassword",
  accountImage: "" // Optional
});

// Success: Redirect to login after 2 seconds
```

**Fields:**
- `userName` (required) - Tên đăng nhập
- `gmail` (required) - Email
- `password` (required, min 6 chars) - Mật khẩu
- `confirmPassword` (required) - Xác nhận mật khẩu

---

## 🎯 Admin Dashboard

### 1. Positions Management (`app/(admin)/admin/positions/page.tsx`)

**Route:** `/admin/positions`

**Features:**
- ✅ Full CRUD operations
- ✅ Image upload support
- ✅ Real-time data loading
- ✅ Loading skeleton
- ✅ Error alerts
- ✅ Confirmation dialogs

**Actions:**
- **Create**: Upload image + form data
- **Read**: Display all positions with images
- **Update**: Edit name, description, change image
- **Delete**: Với confirmation dialog
- **View**: Chi tiết vị trí trong modal

**Code Example:**
```typescript
// Load positions
const result = await getAllPositions();
setPositions(result.data);

// Create with image
const formData = new FormData();
formData.append('positionName', 'Manager');
formData.append('positionDescription', 'Description');
formData.append('positionImage', imageFile);

const createResult = await createPosition(formData);
```

---

### 2. Documents Management (`app/(admin)/admin/documents/page.tsx`)

**Route:** `/admin/documents`

**Features:**
- ✅ Full CRUD operations
- ✅ Clean table UI
- ✅ Real API integration
- ✅ Loading states
- ✅ Empty state handling

**Actions:**
- **Create**: Document name + description
- **Read**: List all documents
- **Update**: Edit information
- **Delete**: With confirmation
- **View**: Details modal

**Code Example:**
```typescript
// Create document
const result = await createDocument({
  documentName: "Báo cáo tháng 11",
  documentDescription: "Mô tả chi tiết"
});

// Update document
await updateDocumentById(id, {
  documentName: "Updated name",
  documentDescription: "Updated description"
});
```

---

### 3. Document Rules Management (`app/(admin)/admin/document-rules/page.tsx`)

**Route:** `/admin/document-rules`

**Features:**
- ✅ Full CRUD operations
- ✅ Icon-based design
- ✅ Real API integration
- ✅ Form validation

**Actions:**
- **Create**: Rule name + description
- **Read**: List all rules
- **Update**: Edit rule info
- **Delete**: With confirmation
- **View**: Details modal

**Code Example:**
```typescript
// Create rule
const result = await createDocumentRule({
  ruleName: "Rule 1",
  ruleDescription: "Description"
});

// Update rule
await updateDocumentRuleById(id, {
  ruleName: "Updated Rule",
  ruleDescription: "Updated description"
});
```

---

### 4. Departments Management (`app/(admin)/admin/departments/page.tsx`)

**Route:** `/admin/departments`

**Features:**
- ✅ Full CRUD operations
- ✅ Building icon for departments
- ✅ Real API integration
- ✅ Clean UI design

**Actions:**
- **Create**: Department name + description
- **Read**: List all departments
- **Update**: Edit department info
- **Delete**: With confirmation
- **View**: Details modal

**Code Example:**
```typescript
// Create department
const result = await createDepartment({
  departmentName: "IT Department",
  departmentDescription: "Information Technology"
});

// Get all departments
const departments = await getAllDepartments();
```

---

### 5. Users Management (`app/(admin)/admin/users/page.tsx`)

**Route:** `/admin/users`

**Features:**
- ✅ Read-only view (display users)
- ✅ Avatar display
- ✅ Role badges
- ✅ Real API integration
- ✅ User details modal

**Actions:**
- **Read**: List all users with avatars, emails, roles
- **View**: User details in modal

**Code Example:**
```typescript
// Load all users
const result = await getAllUsers();
setUsers(result.data);

// Display user info
{users.map(user => (
  <div>
    <Avatar src={user.accountImage} />
    <p>{user.userName}</p>
    <p>{user.gmail}</p>
    {user.roles.map(role => (
      <Badge>{role.roleName}</Badge>
    ))}
  </div>
))}
```

---

## 🏗️ Architecture & Patterns

### Data Flow

```
UI Component (Client)
    ↓
Server Action (lib/actions/*.js)
    ↓
Backend API (manage-and-automate-aviation-academy.onrender.com)
    ↓
Response
    ↓
UI Update
```

### State Management Pattern

All admin pages follow this pattern:

```typescript
export default function ManagementPage() {
  // State
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Selected item for operations
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({});
  
  // Load data on mount
  useEffect(() => {
    loadItems();
  }, []);
  
  // CRUD operations
  const loadItems = async () => { /* ... */ };
  const handleCreate = async () => { /* ... */ };
  const handleEdit = async () => { /* ... */ };
  const handleDelete = async () => { /* ... */ };
  
  // Return JSX...
}
```

---

### Loading States

All pages have consistent loading UI:

```typescript
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    </div>
  );
}
```

---

### Error Handling

Consistent error display across all pages:

```typescript
{error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}
```

---

### Empty States

When no data exists:

```typescript
{items.length === 0 ? (
  <tr>
    <td colSpan={4} className="text-center py-12 text-muted-foreground">
      Chưa có dữ liệu. Hãy tạo mới!
    </td>
  </tr>
) : (
  // Render items...
)}
```

---

## 🎨 Common Components

### Table Structure

All management pages use consistent table structure:

```typescript
<Card className="border shadow-sm">
  <CardContent className="p-0">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="text-left py-4 px-6 font-medium text-sm">Column</th>
            {/* More columns */}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b hover:bg-muted/30 transition-colors">
              <td className="py-4 px-6">{item.name}</td>
              {/* More cells */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>
```

---

### Action Buttons Pattern

Consistent action buttons for each row:

```typescript
<div className="flex items-center justify-end gap-2">
  <Button
    variant="ghost"
    size="sm"
    onClick={() => openViewDialog(item)}
    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
  >
    <Eye className="w-4 h-4 mr-1" />
    Chi tiết
  </Button>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => openEditDialog(item)}
    className="text-green-600 hover:text-green-700 hover:bg-green-50"
  >
    <Edit className="w-4 h-4 mr-1" />
    Sửa
  </Button>
  <Button
    variant="ghost"
    size="sm"
    onClick={() => openDeleteDialog(item)}
    className="text-red-600 hover:text-red-700 hover:bg-red-50"
  >
    <Trash2 className="w-4 h-4 mr-1" />
    Xóa
  </Button>
</div>
```

---

### Dialog Patterns

#### Create/Edit Dialog

```typescript
<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>Tạo mới</DialogTitle>
      <DialogDescription>Thêm mới vào hệ thống</DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-4">
      {/* Form fields */}
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
        Hủy
      </Button>
      <Button onClick={handleCreate} disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Tạo mới"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Delete Confirmation Dialog

```typescript
<AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
      <AlertDialogDescription>
        Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Hủy</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete} className="bg-red-600">
        Xóa
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 🎯 Best Practices

### 1. Always Show Loading State

```typescript
const [isLoading, setIsLoading] = useState(true);
const [isSubmitting, setIsSubmitting] = useState(false);

// For page load
if (isLoading) return <LoadingSpinner />;

// For form submission
<Button disabled={isSubmitting}>
  {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
</Button>
```

### 2. Error Handling

```typescript
try {
  const result = await someAction();
  if (result.status === 'error') {
    setError(result.message);
    return;
  }
  // Handle success
} catch (err) {
  setError('Có lỗi xảy ra');
}
```

### 3. Form Reset After Actions

```typescript
const resetForm = () => {
  setFormData({ name: "", description: "" });
  setImagePreview("");
  setImageFile(null);
};

// Call after create/edit
setIsCreateOpen(false);
resetForm();
loadItems(); // Refresh list
```

### 4. Validate Before Submit

```typescript
const handleCreate = async () => {
  if (!formData.name || !formData.description) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }
  // Proceed with API call
};
```

### 5. Disable Buttons During Operations

```typescript
<Button 
  onClick={handleSubmit}
  disabled={!formData.name || !formData.description || isSubmitting}
>
  {isSubmitting ? "Đang xử lý..." : "Submit"}
</Button>
```

---

## 📊 Features Summary

| Feature | Auth | Positions | Documents | Doc Rules | Departments | Users |
|---------|------|-----------|-----------|-----------|-------------|-------|
| Create | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ |
| Read | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update | ➖ | ✅ | ✅ | ✅ | ✅ | ➖ |
| Delete | ➖ | ✅ | ✅ | ✅ | ✅ | ➖ |
| Image Upload | ➖ | ✅ | ➖ | ➖ | ➖ | ➖ |
| Real API | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Loading States | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Error Handling | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Validation | ✅ | ✅ | ✅ | ✅ | ✅ | ➖ |

---

## 🔗 Related Documentation

- **Server Actions**: `docs/api-use.md`
- **API Reference**: `docs/api_note.md`
- **Actions README**: `lib/actions/README.md`
- **Implementation Summary**: `docs/IMPLEMENTATION_SUMMARY.md`

---

## 🚀 Quick Start

### For Developers

1. **Clone project và install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```

3. **Navigate to pages:**
- Login: http://localhost:3000/login
- Admin Dashboard: http://localhost:3000/admin/*

### Adding New Management Page

Follow this template:

```typescript
"use client";

import { useState, useEffect } from "react";
import { /* import components */ } from "@/components/ui/*";
import { /* import actions */ } from "@/lib/actions/*";

export default function NewManagementPage() {
  // 1. State setup
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // 2. Load data
  useEffect(() => {
    loadItems();
  }, []);
  
  // 3. CRUD functions
  const loadItems = async () => { /* ... */ };
  const handleCreate = async () => { /* ... */ };
  const handleEdit = async () => { /* ... */ };
  const handleDelete = async () => { /* ... */ };
  
  // 4. Render
  return (
    <div className="space-y-6 w-full">
      {/* Page header */}
      {/* Error alert */}
      {/* Data table */}
      {/* Dialogs */}
    </div>
  );
}
```

---

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Status:** ✅ Production Ready

