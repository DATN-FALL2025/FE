# Hướng Dẫn Sử Dụng Server Actions

Tài liệu này mô tả cách sử dụng các Server Actions đã được implement trong thư mục `lib/actions/`.

## 📋 Mục Lục

1. [Authentication](#authentication)
2. [Position Management](#position-management)
3. [File Upload](#file-upload)
4. [Document Management](#document-management)
5. [Document Rule Management](#document-rule-management)
6. [Department Management](#department-management)

---

## 🔐 Authentication

File: `lib/actions/auth.js`

### 1. Đăng Nhập (Login)

```javascript
import { authenticateAccount } from '@/lib/actions/auth';

// Sử dụng trong Server Component
// ⚠️ API nhận data qua QUERY PARAMETERS, không phải JSON body
const result = await authenticateAccount({
  userName: "user123",
  password: "password123"
});

// Sử dụng trong Client Component với Server Action
'use client';

export default function LoginForm() {
  const handleLogin = async (formData) => {
    const result = await authenticateAccount({
      userName: formData.get('userName'),
      password: formData.get('password')
    });
    
    if (result.status === 'error') {
      console.error(result.message);
    } else {
      console.log('Đăng nhập thành công:', result.data);
    }
  };
  
  return (
    <form action={handleLogin}>
      <input name="userName" type="text" required />
      <input name="password" type="password" required />
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
```

**Response:**
```json
{
  "status": "string",
  "message": "string",
  "data": {
    // User data và token
  }
}
```

### 2. Tạo Tài Khoản Mới

```javascript
import { createUser } from '@/lib/actions/auth';

// ⚠️ API nhận data qua QUERY PARAMETERS
const result = await createUser({
  userName: "newuser",
  password: "securepassword",
  gmail: "user@example.com",
  accountImage: "https://example.com/avatar.jpg" // Optional
});
```

**⚠️ Lưu ý quan trọng:** 
- API backend nhận data qua **query parameters** trong URL
- Không phải JSON body như REST API thông thường
- Response có format `status: "200 OK"` được normalize thành `status: "success"`

### 3. Lấy Danh Sách Người Dùng

```javascript
import { getAllUsers } from '@/lib/actions/auth';

const result = await getAllUsers();
// result.data sẽ chứa array các user
```

### 4. Tạo Role Mới

```javascript
import { createRole } from '@/lib/actions/auth';

const result = await createRole({
  roleName: "ACADEMIC_STAFF_AFFAIR"
});
```

### 5. Lấy Danh Sách Roles

```javascript
import { getAllRoles } from '@/lib/actions/auth';

const result = await getAllRoles();
```

---

## 📍 Position Management

File: `lib/actions/position.js`

### 1. Lấy Tất Cả Vị Trí

```javascript
import { getAllPositions } from '@/lib/actions/position';

const result = await getAllPositions();
```

### 2. Lấy Vị Trí Theo ID

```javascript
import { getPositionById } from '@/lib/actions/position';

const result = await getPositionById(1);
```

### 3. Tạo Vị Trí Mới

```javascript
'use client';
import { createPosition } from '@/lib/actions/position';

export default function CreatePositionForm() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Thêm dữ liệu vào FormData
    formData.append('positionName', 'Manager');
    formData.append('positionDescription', 'Department Manager');
    // File đã được add vào formData từ input type="file"
    
    const result = await createPosition(formData);
    console.log(result);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="positionName" type="text" placeholder="Tên vị trí" />
      <textarea name="positionDescription" placeholder="Mô tả" />
      <input name="positionImage" type="file" accept="image/*" />
      <button type="submit">Tạo vị trí</button>
    </form>
  );
}
```

### 4. Cập Nhật Vị Trí

```javascript
import { updatePositionById } from '@/lib/actions/position';

const formData = new FormData();
formData.append('positionName', 'Senior Manager');
formData.append('positionDescription', 'Updated description');

const result = await updatePositionById(1, formData);
```

### 5. Xóa Vị Trí

```javascript
import { deletePositionById } from '@/lib/actions/position';

const result = await deletePositionById(1);
```

---

## 📤 File Upload

File: `lib/actions/upload.js`

### 1. Upload File

```javascript
'use client';
import { uploadFile } from '@/lib/actions/upload';

export default function FileUploadForm() {
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const file = e.target.querySelector('input[type="file"]').files[0];
    formData.append('file', file);
    
    const result = await uploadFile(formData);
    
    if (result.status === 'error') {
      console.error(result.message);
    } else {
      console.log('File URL:', result.data);
    }
  };
  
  return (
    <form onSubmit={handleUpload}>
      <input type="file" required />
      <button type="submit">Upload</button>
    </form>
  );
}
```

### 2. Update File (Thay Thế File Cũ)

```javascript
import { updateFile } from '@/lib/actions/upload';

const formData = new FormData();
formData.append('file', newFile);

const result = await updateFile('old_public_id_from_cloudinary', formData);
```

---

## 📄 Document Management

File: `lib/actions/document.js`

### 1. Lấy Tất Cả Tài Liệu

```javascript
import { getAllDocuments } from '@/lib/actions/document';

// Trong Server Component hoặc Page
export default async function DocumentsPage() {
  const result = await getAllDocuments();
  const documents = result.data;
  
  return (
    <div>
      {documents?.map(doc => (
        <div key={doc.id}>{doc.documentName}</div>
      ))}
    </div>
  );
}
```

### 2. Lấy Tài Liệu Theo ID

```javascript
import { getDocumentById } from '@/lib/actions/document';

const result = await getDocumentById(1);
```

### 3. Tạo Tài Liệu Mới

```javascript
import { createDocument } from '@/lib/actions/document';

const result = await createDocument({
  documentName: "Báo cáo tháng 11",
  documentDescription: "Báo cáo chi tiết các hoạt động tháng 11"
});
```

### 4. Cập Nhật Tài Liệu

```javascript
import { updateDocumentById } from '@/lib/actions/document';

const result = await updateDocumentById(1, {
  documentName: "Báo cáo tháng 11 (Updated)",
  documentDescription: "Mô tả cập nhật"
});
```

### 5. Xóa Tài Liệu

```javascript
import { deleteDocumentById } from '@/lib/actions/document';

const result = await deleteDocumentById(1);
```

---

## 📋 Document Rule Management

File: `lib/actions/document-rule.js`

### 1. Lấy Tất Cả Quy Tắc

```javascript
import { getAllDocumentRules } from '@/lib/actions/document-rule';

const result = await getAllDocumentRules();
```

### 2. Lấy Quy Tắc Theo ID

```javascript
import { getDocumentRuleById } from '@/lib/actions/document-rule';

const result = await getDocumentRuleById(1);
```

### 3. Tạo Quy Tắc Mới

```javascript
import { createDocumentRule } from '@/lib/actions/document-rule';

const result = await createDocumentRule({
  // Thêm các field theo yêu cầu của API
  ruleName: "Rule 1",
  ruleDescription: "Description"
});
```

### 4. Cập Nhật Quy Tắc

```javascript
import { updateDocumentRuleById } from '@/lib/actions/document-rule';

const result = await updateDocumentRuleById(1, {
  ruleName: "Updated Rule",
  ruleDescription: "Updated description"
});
```

### 5. Xóa Quy Tắc

```javascript
import { deleteDocumentRuleById } from '@/lib/actions/document-rule';

const result = await deleteDocumentRuleById(1);
```

---

## 🏢 Department Management

File: `lib/actions/department.js`

### 1. Lấy Tất Cả Khoa

```javascript
import { getAllDepartments } from '@/lib/actions/department';

// Sử dụng trong Server Component
export default async function DepartmentsPage() {
  const result = await getAllDepartments();
  
  return (
    <div>
      {result.data?.map(dept => (
        <div key={dept.id}>{dept.name}</div>
      ))}
    </div>
  );
}
```

### 2. Lấy Khoa Theo ID

```javascript
import { getDepartmentById } from '@/lib/actions/department';

const result = await getDepartmentById(1);
```

### 3. Tạo Khoa Mới

```javascript
import { createDepartment } from '@/lib/actions/department';

const result = await createDepartment({
  departmentName: "IT Department",
  departmentDescription: "Information Technology"
});
```

### 4. Cập Nhật Khoa

```javascript
import { updateDepartmentById } from '@/lib/actions/department';

const result = await updateDepartmentById(1, {
  departmentName: "IT & Digital",
  departmentDescription: "Updated description"
});
```

### 5. Xóa Khoa

```javascript
import { deleteDepartmentById } from '@/lib/actions/department';

const result = await deleteDepartmentById(1);
```

---

## 🎯 Best Practices

### 1. Error Handling

Tất cả các actions đều trả về object với format:

```javascript
{
  status: "success" | "error",
  message: "string",
  data: {} | null
}
```

Luôn kiểm tra `status` trước khi sử dụng `data`:

```javascript
const result = await getAllDocuments();

if (result.status === 'error') {
  // Xử lý lỗi
  console.error(result.message);
  return;
}

// Sử dụng data
const documents = result.data;
```

### 2. Loading States trong Client Components

```javascript
'use client';
import { useState } from 'react';
import { getAllDocuments } from '@/lib/actions/document';

export default function DocumentsList() {
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  
  const loadDocuments = async () => {
    setLoading(true);
    try {
      const result = await getAllDocuments();
      if (result.status === 'success') {
        setDocuments(result.data);
      }
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {documents.map(doc => (
        <div key={doc.id}>{doc.documentName}</div>
      ))}
    </div>
  );
}
```

### 3. Form Actions với Next.js

```javascript
'use client';
import { createDocument } from '@/lib/actions/document';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Đang tạo...' : 'Tạo tài liệu'}
    </button>
  );
}

export default function CreateDocumentForm() {
  const handleSubmit = async (formData) => {
    const result = await createDocument({
      documentName: formData.get('name'),
      documentDescription: formData.get('description')
    });
    
    if (result.status === 'success') {
      // Redirect hoặc show success message
      console.log('Tạo thành công!');
    }
  };
  
  return (
    <form action={handleSubmit}>
      <input name="name" required />
      <textarea name="description" required />
      <SubmitButton />
    </form>
  );
}
```

### 4. Server Components (Recommended)

Next.js khuyến khích sử dụng Server Components khi có thể:

```javascript
// app/documents/page.jsx
import { getAllDocuments } from '@/lib/actions/document';

export default async function DocumentsPage() {
  // Fetch directly trong server component
  const result = await getAllDocuments();
  const documents = result.data || [];
  
  return (
    <div>
      <h1>Documents</h1>
      {documents.map(doc => (
        <article key={doc.id}>
          <h2>{doc.documentName}</h2>
          <p>{doc.documentDescription}</p>
        </article>
      ))}
    </div>
  );
}
```

### 5. Revalidation & Caching

Để refresh data sau khi create/update/delete:

```javascript
import { revalidatePath } from 'next/cache';
import { createDocument } from '@/lib/actions/document';

export async function createDocumentAction(formData) {
  'use server';
  
  const result = await createDocument({
    documentName: formData.get('name'),
    documentDescription: formData.get('description')
  });
  
  if (result.status === 'success') {
    // Revalidate để refresh data
    revalidatePath('/documents');
  }
  
  return result;
}
```

---

## 🔗 API Endpoint Reference

Base URL: `https://manage-and-automate-aviation-academy-application-production.up.railway.app/api`

### Authentication
- POST `/account/v1/authenticateAccount` - Đăng nhập
- POST `/account/v1/createUser` - Tạo user
- GET `/account/v1/getAllUser` - Lấy tất cả users
- POST `/account/v1/createRole` - Tạo role
- GET `/account/v1/getAllRole` - Lấy tất cả roles
- GET `/account/profile` - Lấy thông tin profile
- POST `/account/v1/verify-otp` - Xác thực OTP
- POST `/account/v1/send-otp-again` - Gửi lại OTP
- POST `/account/multipleAccounts` - Import nhiều accounts
- POST `/account/add_position_to_account` - Gán position cho account

### Batch Management
- GET `/batch` - Lấy tất cả batches
- GET `/batch/active-batch` - Lấy batch đang active
- GET `/batch/nearest_batch` - Lấy batch gần nhất
- POST `/batch/create-batch` - Tạo batch
- PUT `/batch/update-batch/{id}` - Update batch
- DELETE `/batch/delete-batch/{id}` - Xóa batch

### Position
- GET `/position/getAllPossition` - Lấy tất cả positions
- GET `/position/getPositionById/{id}` - Lấy position theo ID
- POST `/position/createPosition` - Tạo position
- PUT `/position/updatePositionById/{id}` - Update position
- DELETE `/position/deletePositionById/{id}` - Xóa position

### Upload
- POST `/admin/uploads/file` - Upload file
- PUT `/admin/uploads/file?oldPublicId={id}` - Update file

### Document
- GET `/admin/documents` - Lấy tất cả documents
- GET `/admin/documents/{id}` - Lấy document theo ID
- GET `/admin/documents/{id}/with-rules` - Lấy document với rules
- GET `/admin/documents/all-with-rules` - Lấy tất cả documents với rules
- GET `/admin/documents/get-document-rule-list-by-document/{documentId}` - Lấy rules theo document
- POST `/admin/documents/create` - Tạo document
- POST `/admin/documents/create-with-rules` - Tạo document với rules
- PUT `/admin/documents/{id}` - Update document
- DELETE `/admin/documents/{id}` - Xóa document

### Document Rules
- GET `/admin/document-rules` - Lấy tất cả rules
- GET `/admin/document-rules/{id}` - Lấy rule theo ID
- POST `/admin/document-rules/create` - Tạo rule
- PUT `/admin/document-rules/{id}` - Update rule
- DELETE `/admin/document-rules/{id}` - Xóa rule

### Document Rule Value
- POST `/document_rule_value/create_document_rule_value` - Tạo giá trị rule
- PUT `/document_rule_value/update_document_rule_value` - Update giá trị rule

### Department
- GET `/admin/departments` - Lấy tất cả departments
- GET `/admin/departments/{id}` - Lấy department theo ID
- POST `/admin/departments/create` - Tạo department
- PUT `/admin/departments/{id}` - Update department
- DELETE `/admin/departments/{id}` - Xóa department

### Trainee Submission
- POST `/trainee_submission/create_trainee_submission_by_trainee` - Tạo submission
- PUT `/trainee_submission/update` - Update submission
- GET `/trainee_submission/get_trainee_submission_detail/{id}` - Lấy chi tiết submission

### Trainee Application
- GET `/trainee_application/get_all_application_by_trainee` - Lấy tất cả applications của trainee
- GET `/trainee_application/get_trainee_application_detail_by_trainee/{id}` - Chi tiết application (trainee)
- GET `/trainee_application/get_trainee_application_detail_by_staff/{id}` - Chi tiết application (staff)
- GET `/trainee_application/get_all_trainee_application_by_staff_academic_affair` - Tất cả applications (staff)
- GET `/trainee_application/get_trainee_application_list_by_status_by_staff_academic_staff_affair` - Lọc theo status
- GET `/trainee_application/overall-stats_trainee_application_for_staff_academic_affair` - Thống kê cho staff
- GET `/trainee_application/TraineeApplicationDashboardByTrainee` - Dashboard cho trainee
- PUT `/trainee_application/{traineeApplicationId}/complete` - Hoàn thành application

### Matrix
- GET `/matrix/getAllMatrix` - Lấy tất cả matrix
- GET `/matrix/department/{departmentID}` - Lấy matrix theo department
- GET `/matrix/matrix_details` - Chi tiết matrix
- GET `/matrix/input_matrix_document_dashboard` - Dashboard matrix
- GET `/matrix/get_matrix_filter_by_position_department` - Lọc matrix
- POST `/matrix/addRow_for_training_director` - Thêm row
- POST `/matrix/addMultipleRow_for_training_director` - Thêm nhiều rows
- POST `/matrix/addColum_for_training_director` - Thêm column
- POST `/matrix/addMultipleColum_for_training_director` - Thêm nhiều columns
- POST `/matrix/clickToCellMatrix_for_head_of_department` - Toggle cell
- POST `/matrix/setPendintStatusMatrix_for_training_director` - Set pending status
- PUT `/matrix/set-drafted/{departmentID}_for_head_department` - Set drafted
- PUT `/matrix/set-status/department/{departmentId}_for_training_director_approve_or_reject` - Approve/Reject
- PUT `/matrix/setCompleteStatusToActive_for_training_director` - Set active
- DELETE `/matrix/deleteRow_for_training_director/{positionId}` - Xóa row
- DELETE `/matrix/deleteColumn_for_training_director/{documentId}` - Xóa column
- DELETE `/matrix/deleteAllRow_for_training_director` - Xóa tất cả rows
- DELETE `/matrix/deleteAllColumns_for_training_director` - Xóa tất cả columns
- DELETE `/matrix/clearMatrix_for_training_director` - Clear matrix

---

## ⚠️ Lưu Ý Quan Trọng

1. **'use server' directive**: Tất cả actions đã có `'use server'` ở đầu file
2. **Error handling**: Luôn check `result.status` trước khi dùng data
3. **FormData**: Đối với upload file và position, sử dụng FormData thay vì JSON
4. **Cache**: Các GET requests có `cache: 'no-store'` để luôn lấy data mới nhất
5. **Validation**: Actions đã có basic validation, nhưng nên validate thêm ở UI
6. **Query Parameters**: 
   - ⚠️ Backend API expects **query parameters** (not JSON body) for create/update operations
   - ✅ Server actions automatically convert object data to query params
   - ✅ You just need to pass regular JavaScript objects
   - Example internally: `{name: "Doc1"}` → `?name=Doc1`
7. **Console Logging**: All create/update actions log requests for debugging
8. **Environment**: Có thể tạo `.env.local` để config API_BASE_URL:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://manage-and-automate-aviation-academy.onrender.com/api
   ```

### 🔍 API Request Format

**Important:** Backend expects different formats for different operations:

| Operation | Format | Example |
|-----------|--------|---------|
| **Create/Update** (Document, Department, Document-Rule, Auth) | Query Parameters | `POST /api/documents/create?name=Doc1&desc=Description` |
| **Create/Update** (Position) | FormData (multipart) | `POST /api/position/createPosition` + FormData body |
| **Read/Delete** | Path params only | `GET /api/documents/{id}`, `DELETE /api/documents/{id}` |

**You don't need to worry about this!** Server actions handle the conversion automatically. Just pass objects:

```javascript
// ✅ You write this (easy!)
await createDocument({
  documentName: "My Document",
  documentDescription: "Description"
});

// ✅ Server action converts to this (automatic!)
// POST /api/documents/create?documentName=My%20Document&documentDescription=Description
```

---

## 📝 Example: Complete CRUD Flow

Ví dụ hoàn chỉnh cho Document Management:

```javascript
// app/admin/documents/page.jsx
import { getAllDocuments } from '@/lib/actions/document';
import DocumentsList from './documents-list';

export default async function DocumentsPage() {
  const result = await getAllDocuments();
  
  return (
    <div>
      <h1>Quản lý Tài liệu</h1>
      <DocumentsList initialDocuments={result.data || []} />
    </div>
  );
}

// app/admin/documents/documents-list.jsx
'use client';
import { useState } from 'react';
import { 
  createDocument, 
  updateDocumentById, 
  deleteDocumentById 
} from '@/lib/actions/document';

export default function DocumentsList({ initialDocuments }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCreate = async (formData) => {
    setIsCreating(true);
    const result = await createDocument({
      documentName: formData.get('name'),
      documentDescription: formData.get('description')
    });
    
    if (result.status === 'success') {
      setDocuments([...documents, result.data]);
      alert('Tạo thành công!');
    } else {
      alert('Lỗi: ' + result.message);
    }
    setIsCreating(false);
  };
  
  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xóa?')) return;
    
    const result = await deleteDocumentById(id);
    if (result.status === 'success') {
      setDocuments(documents.filter(d => d.id !== id));
      alert('Xóa thành công!');
    }
  };
  
  return (
    <div>
      <form action={handleCreate}>
        <input name="name" placeholder="Tên tài liệu" required />
        <textarea name="description" placeholder="Mô tả" required />
        <button type="submit" disabled={isCreating}>
          {isCreating ? 'Đang tạo...' : 'Tạo mới'}
        </button>
      </form>
      
      <div>
        {documents.map(doc => (
          <div key={doc.id}>
            <h3>{doc.documentName}</h3>
            <p>{doc.documentDescription}</p>
            <button onClick={() => handleDelete(doc.id)}>Xóa</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

**Tác giả:** Generated for Support Fall 2025 Project  
**Ngày cập nhật:** January 2026  
**Version:** 2.0.0

