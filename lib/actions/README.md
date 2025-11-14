# Server Actions

Thư mục này chứa tất cả các Server Actions để tương tác với Backend API.

## 📁 Cấu trúc

```
lib/actions/
├── index.js              # Export tất cả actions (import từ đây)
├── auth.js              # Authentication & User Management
├── position.js          # Position Management (CRUD)
├── upload.js            # File Upload & Update
├── document.js          # Document Management (CRUD)
├── document-rule.js     # Document Rule Management (CRUD)
├── department.js        # Department Management (CRUD)
└── README.md           # File này
```

## 🚀 Cách Sử dụng

### Import từ index.js (Khuyến nghị)

```javascript
import { 
  authenticateAccount, 
  getAllDocuments,
  createPosition 
} from '@/lib/actions';
```

### Hoặc import trực tiếp từ file cụ thể

```javascript
import { authenticateAccount } from '@/lib/actions/auth';
import { getAllDocuments } from '@/lib/actions/document';
```

## 📚 Modules

### 1. Authentication (`auth.js`)
- `authenticateAccount(loginData)` - Đăng nhập
- `createUser(accountData)` - Tạo user mới
- `getAllUsers()` - Lấy danh sách users
- `createRole(roleData)` - Tạo role mới
- `getAllRoles()` - Lấy danh sách roles

### 2. Position Management (`position.js`)
- `getAllPositions()` - Lấy tất cả positions
- `getPositionById(id)` - Lấy position theo ID
- `createPosition(formData)` - Tạo position mới
- `updatePositionById(id, formData)` - Cập nhật position
- `deletePositionById(id)` - Xóa position

### 3. File Upload (`upload.js`)
- `uploadFile(formData)` - Upload file lên Cloudinary
- `updateFile(oldPublicId, formData)` - Cập nhật file

### 4. Document Management (`document.js`)
- `getAllDocuments()` - Lấy tất cả documents
- `getDocumentById(id)` - Lấy document theo ID
- `createDocument(documentData)` - Tạo document mới
- `updateDocumentById(id, documentData)` - Cập nhật document
- `deleteDocumentById(id)` - Xóa document

### 5. Document Rule Management (`document-rule.js`)
- `getAllDocumentRules()` - Lấy tất cả document rules
- `getDocumentRuleById(id)` - Lấy rule theo ID
- `createDocumentRule(ruleData)` - Tạo rule mới
- `updateDocumentRuleById(id, ruleData)` - Cập nhật rule
- `deleteDocumentRuleById(id)` - Xóa rule

### 6. Department Management (`department.js`)
- `getAllDepartments()` - Lấy tất cả departments
- `getDepartmentById(id)` - Lấy department theo ID
- `createDepartment(departmentData)` - Tạo department mới
- `updateDepartmentById(id, departmentData)` - Cập nhật department
- `deleteDepartmentById(id)` - Xóa department

## 📖 Documentation

Xem hướng dẫn chi tiết tại: [docs/api-use.md](../../docs/api-use.md)

## ✅ Response Format

Tất cả actions đều trả về format chuẩn:

```javascript
{
  status: "success" | "error",
  message: "string",
  data: {} | null
}
```

## 🔧 Configuration

API Base URL: `https://manage-and-automate-aviation-academy.onrender.com/api`

Có thể config trong `.env.local` nếu cần:
```env
NEXT_PUBLIC_API_BASE_URL=https://manage-and-automate-aviation-academy.onrender.com/api
```

## 🎯 Best Practices

1. **Server Components** (Preferred):
   ```javascript
   // app/page.jsx
   import { getAllDocuments } from '@/lib/actions';
   
   export default async function Page() {
     const result = await getAllDocuments();
     return <div>{/* render */}</div>;
   }
   ```

2. **Client Components** (When needed):
   ```javascript
   'use client';
   import { useState } from 'react';
   import { getAllDocuments } from '@/lib/actions';
   
   export default function Component() {
     const [data, setData] = useState([]);
     
     useEffect(() => {
       getAllDocuments().then(result => {
         if (result.status === 'success') {
           setData(result.data);
         }
       });
     }, []);
   }
   ```

3. **Form Actions**:
   ```javascript
   'use client';
   import { createDocument } from '@/lib/actions';
   
   export default function Form() {
     const handleSubmit = async (formData) => {
       const result = await createDocument({
         documentName: formData.get('name'),
         documentDescription: formData.get('desc')
       });
     };
     
     return <form action={handleSubmit}>...</form>;
   }
   ```

## 🛡️ Error Handling

Luôn kiểm tra `status` trước khi sử dụng `data`:

```javascript
const result = await getAllDocuments();

if (result.status === 'error') {
  console.error(result.message);
  // Handle error
  return;
}

// Safe to use result.data
const documents = result.data;
```

## 📝 Notes

- Tất cả files đều có `'use server'` directive
- GET requests có `cache: 'no-store'` để lấy data mới nhất
- File upload sử dụng FormData, không phải JSON
- Các actions đã có basic validation

## 🔗 Related Files

- API Documentation: `docs/api_note.md`
- Usage Guide: `docs/api-use.md`

