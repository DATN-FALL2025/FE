# Debug Guide: File Upload Issue

## 🎯 Mục đích
Hướng dẫn debug khi chức năng "Gửi file" không hoạt động

## 🧪 Cách test

### 1. Test với button debug (Development only)
1. Mở trang `/trainees/documents`
2. Tìm button màu vàng "🧪 Test API Call" ở đầu trang
3. Mở Developer Console (F12)
4. Click button "🧪 Test API Call"
5. Xem console logs

### 2. Test với file thật
1. Chọn một file bằng button "Tải lên"
2. Xem toast notification "Đã chọn file"
3. Click button "Gửi file"
4. Xem console logs và toast notifications

## 📋 Console Logs cần kiểm tra

### Khi chọn file:
```
📁 File selected: { docId: X, fileName: "...", fileSize: XXX }
```

### Khi click "Gửi file":
```
🚀 handleFileUpload called for docId: X
📁 Selected files state: {...}
📄 File to upload: { name: "...", size: XXX, type: "..." }
🔑 Token available: Yes
📤 Calling createTraineeSubmission with: {...}
```

### Trong createTraineeSubmission:
```
🚀 createTraineeSubmission called with: {...}
📋 Extracted data: {...}
📦 FormData created with fields: {...}
📦 FormData entries:
  documentID: 1
  traineeApplicationId: 3
  submissionName: Test Document
  takeNote: Test submission
  submissionDocumentFile: File(test.txt, 12 bytes, text/plain)
🔑 Authorization header added
🔑 Token (first 20 chars): eyJhbGciOiJIUzI1NiJ9...
📤 Making POST request to: https://manage-and-automate-aviation-academy.onrender.com/api/trainee_submission/create_trainee_submission_by_trainee
📤 Request headers: { accept: '*/*', Authorization: 'Bearer ...' }
📤 Request method: POST
📤 Request body type: FormData
📤 Sending request...
```

### Response thành công:
```
📥 Response received!
📥 Response status: 200 OK
📥 Response ok: true
📥 Response headers: {...}
📥 Response data: { status: "200 OK", message: "...", data: {...} }
✅ Submission created successfully
✅ Upload successful!
```

### Response lỗi:
```
📥 Response status: 401 Unauthorized
📥 Response ok: false
📥 Response data: { status: "401 UNAUTHORIZED", message: "Please login to use this method" }
❌ Response not ok: 401 {...}
```

## 🔍 Các vấn đề thường gặp

### 1. ❌ "No file selected for docId"
**Nguyên nhân:** File không được lưu vào state  
**Giải pháp:** 
- Kiểm tra `handleFileSelect` có được gọi không
- Kiểm tra `selectedFiles` state có file không

### 2. ❌ "No auth token available"
**Nguyên nhân:** Token không có trong localStorage  
**Giải pháp:**
- Login lại
- Kiểm tra localStorage có key `token` không
- Chạy trong console: `localStorage.getItem('token')`

### 3. ❌ Response 401 Unauthorized
**Nguyên nhân:** Token không hợp lệ hoặc hết hạn  
**Giải pháp:**
- Login lại để lấy token mới
- Kiểm tra token có đúng format không (JWT)

### 4. ❌ Response 400 Bad Request
**Nguyên nhân:** Thiếu hoặc sai parameters  
**Giải pháp:**
- Kiểm tra FormData entries trong console
- Đảm bảo có đủ: documentID, traineeApplicationId, submissionName, submissionDocumentFile

### 5. ❌ "Failed to parse response as JSON"
**Nguyên nhân:** Server trả về HTML hoặc text thay vì JSON  
**Giải pháp:**
- Kiểm tra API endpoint có đúng không
- Kiểm tra server có đang chạy không
- Xem response text trong console

### 6. ❌ Network Error / CORS Error
**Nguyên nhân:** Không kết nối được server hoặc CORS policy  
**Giải pháp:**
- Kiểm tra internet connection
- Kiểm tra API URL trong `.env`
- Kiểm tra server có đang chạy không

## 🛠️ Debug Commands

### Kiểm tra token trong console:
```javascript
localStorage.getItem('token')
```

### Kiểm tra user data:
```javascript
JSON.parse(localStorage.getItem('user'))
```

### Test API trực tiếp:
```javascript
const token = localStorage.getItem('token');
const formData = new FormData();
formData.append('documentID', '1');
formData.append('traineeApplicationId', '3');
formData.append('submissionName', 'Test');
formData.append('takeNote', 'Test note');
formData.append('submissionDocumentFile', new File(['test'], 'test.txt'));

fetch('https://manage-and-automate-aviation-academy.onrender.com/api/trainee_submission/create_trainee_submission_by_trainee', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'accept': '*/*'
  },
  body: formData
}).then(r => r.json()).then(console.log).catch(console.error);
```

## 📝 Files liên quan

- `app/(trainees)/trainees/documents/page.tsx` - UI component
- `lib/actions/trainee-submission-client.js` - Client-side API call
- `lib/auth-utils.ts` - Token management
- `.env` - API URL configuration

## 🚀 Next Steps

Sau khi debug xong, nhớ:
1. Xóa button "🧪 Test API Call" 
2. Xóa hoặc comment các console.log không cần thiết
3. Test lại với file thật
4. Kiểm tra toast notifications
