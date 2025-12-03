# Trainee Documents Page - Updates

## Ngày cập nhật: December 4, 2025

## Các thay đổi đã thực hiện

### 1. ✅ Hiển thị thông tin user từ token (không hardcode)

**Vấn đề:** Thông tin user bị hardcode trong code

**Giải pháp:**
- Sử dụng `useAuthInfo()` hook để lấy thông tin user từ localStorage
- Sử dụng `getDecodedToken()` để decode JWT token và lấy thông tin chi tiết
- Hiển thị thông tin user trong card ở đầu trang

**Thông tin hiển thị:**
- Tên đầy đủ (từ `sub` trong token)
- Email (từ `gmail` trong token)
- Phòng ban (từ `departmentName` trong token)

**Code:**
```typescript
const { displayName, user } = useAuthInfo();
const [userInfo, setUserInfo] = useState<{
  fullName: string;
  email: string;
  studentCode: string;
  department: string;
} | null>(null);

useEffect(() => {
  const decodedToken = getDecodedToken();
  if (decodedToken) {
    setUserInfo({
      fullName: decodedToken.sub || displayName || "Học viên",
      email: decodedToken.gmail || user?.gmail || "",
      studentCode: decodedToken.studentCode || "N/A",
      department: decodedToken.departmentName || "N/A",
    });
  }
}, [displayName, user]);
```

### 2. ✅ Thêm chức năng xem chi tiết tài liệu đã nộp

**API Endpoint:**
```
GET /api/trainee_submission/get_trainee_submission_detail/{trainee_submission_id}
```

**Response:**
```json
{
  "status": "200 OK",
  "message": "Trainee Submission detail retrieved successfully.",
  "data": {
    "submissionId": 1,
    "document_id": 6,
    "requiredDocumentName": "tài liệu y tế",
    "submissionStatus": "Reject",
    "submission_name": "tài liệu y tế",
    "takeNote": "string",
    "fileDownloadUrl": "https://...",
    "uploadTime": "2025-12-02T16:42:03.087143"
  }
}
```

**Tính năng:**
- Button "Xem chi tiết" xuất hiện khi tài liệu đã được nộp (có `submissionId`)
- Click vào button sẽ mở modal hiển thị thông tin chi tiết
- Modal hiển thị:
  - ✅ Tên tài liệu yêu cầu
  - ✅ Tên bài nộp
  - ✅ Trạng thái (Pending/Approved/Rejected) với badge màu sắc
  - ✅ Thời gian nộp (format tiếng Việt)
  - ✅ Ghi chú (nếu có)
  - ✅ Link tải xuống file
  - ✅ Button xem file (mở trong tab mới)
  - ✅ ID submission

**Components mới:**
- Dialog component từ shadcn/ui
- Badge component để hiển thị status
- Icons: Eye, Download, FileText, Calendar, MessageSquare, XCircle

### 3. ✅ Cập nhật Server Action

**File:** `lib/actions/trainee-submission.js`

**Function:** `getTraineeSubmissionDetail()`

**Thay đổi:**
- Thêm parameter `token` để support authentication
- Thêm Authorization header khi có token
- Thêm logging để debug

```javascript
export async function getTraineeSubmissionDetail(traineeSubmissionId, token = null) {
  const authToken = getAuthToken(token);
  const headers = {
    'Content-Type': 'application/json',
    'accept': '*/*',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  // ... rest of implementation
}
```

### 4. ✅ UI/UX Improvements

**User Info Card:**
- Gradient background (blue-50 to indigo-50)
- Icon user với background blue-600
- Hiển thị email và department trong cùng một dòng
- Responsive design

**Document Detail Modal:**
- Max width: 2xl
- Max height: 80vh với scroll
- Loading skeleton khi đang tải
- Organized layout với icons cho mỗi field
- Action buttons: Tải xuống và Xem file

**Status Badges:**
- Pending: Yellow (⏰ Chờ duyệt)
- Approved: Green (✅ Đã duyệt)
- Rejected: Red (❌ Từ chối)

## Files đã thay đổi

1. ✅ `app/(trainees)/trainees/documents/page.tsx`
   - Thêm user info display
   - Thêm submission detail modal
   - Thêm view detail functionality
   - Thêm image preview modal
   - Thêm resubmit modal và functionality

2. ✅ `lib/actions/trainee-submission.js`
   - Cập nhật `getTraineeSubmissionDetail()` với token support
   - Cập nhật `updateTraineeSubmission()` với token support

3. ✅ `docs/AUTH_SYSTEM.md`
   - Thêm section về logout fix

4. ✅ `docs/TRAINEE_DOCUMENTS_UPDATE.md`
   - Tài liệu đầy đủ về các tính năng mới

## Testing Checklist

### Basic Features
- [x] User info hiển thị đúng từ token
- [x] Button "Xem chi tiết" chỉ hiện khi có submissionId
- [x] Modal mở đúng khi click button
- [x] Loading state hiển thị khi đang tải
- [x] Thông tin chi tiết hiển thị đầy đủ
- [x] Status badge hiển thị đúng màu sắc
- [x] Thời gian format đúng tiếng Việt
- [x] Button tải xuống hoạt động
- [x] Modal đóng đúng cách
- [x] Error handling khi API fail

### Image Preview
- [x] Image files mở trong modal preview
- [x] Non-image files mở trong tab mới
- [x] Image hiển thị responsive
- [x] Button tải xuống trong preview modal
- [x] Button đóng modal hoạt động

### Resubmit Feature
- [x] Button "Nộp lại" chỉ hiện khi status = Reject
- [x] Modal resubmit mở đúng
- [x] File upload hoạt động
- [x] Textarea ghi chú hoạt động
- [x] Validation: Phải chọn file mới
- [x] Loading state khi đang nộp lại
- [x] Toast success khi nộp lại thành công
- [x] Refresh danh sách sau khi nộp lại
- [x] Error handling khi API fail

## API Integration

**Token Flow:**
1. User login → JWT token stored in localStorage
2. Token contains: `sub`, `gmail`, `role`, `departmentId`, `departmentName`
3. Token được gửi trong Authorization header: `Bearer {token}`
4. Backend tự động identify user từ token
5. Không cần truyền userId trong request

**Example Token Payload:**
```json
{
  "departmentName": "TAM",
  "gmail": "tetehiep@gmail.com",
  "role": "TRAINEE",
  "departmentId": "4",
  "sub": "Khanh",
  "iat": 1764691237,
  "exp": 1764709237
}
```

## Screenshots

### Before:
- Hardcoded user info
- Không có cách xem chi tiết tài liệu đã nộp

### After:
- ✅ User info card với thông tin từ token
- ✅ Button "Xem chi tiết" cho tài liệu đã nộp
- ✅ Modal hiển thị đầy đủ thông tin submission
- ✅ Download và view file functionality
- ✅ Image preview trong modal (không mở tab mới)
- ✅ Button "Nộp lại tài liệu" cho tài liệu bị reject
- ✅ Modal resubmit với upload file + ghi chú

### 5. ✅ Image Preview trong Modal

**Tính năng:**
- Khi click "Xem file", kiểm tra xem file có phải là ảnh không
- Nếu là ảnh (jpg, jpeg, png, gif, webp, bmp) → Mở trong modal preview
- Nếu không phải ảnh → Mở trong tab mới như cũ

**Supported Image Formats:**
- JPG/JPEG
- PNG
- GIF
- WebP
- BMP

**UI:**
- Modal full-width với max-width 4xl
- Image responsive với max-height 70vh
- Button tải xuống và đóng modal

### 6. ✅ Chức năng nộp lại tài liệu (Resubmit)

**API Endpoint:**
```
PUT /api/trainee_submission/update/{submissionID}
```

**Request (FormData):**
- `newSubmissionName`: Tên submission mới
- `newTakeNote`: Ghi chú mới
- `newSubmissionDocumentFile`: File tài liệu mới

**Tính năng:**
- Button "Nộp lại tài liệu" chỉ hiện khi status = "Reject"
- Modal cho phép:
  - Upload file mới (required)
  - Thêm ghi chú (optional)
- Sau khi nộp lại thành công:
  - Đóng modal
  - Refresh danh sách tài liệu
  - Hiển thị toast success

**UI Flow:**
1. User xem chi tiết tài liệu bị reject
2. Click button "Nộp lại tài liệu" (màu cam)
3. Modal mở với form upload file + textarea ghi chú
4. Chọn file mới
5. Click "Nộp lại"
6. Loading state + toast
7. Success → Refresh list

## Next Steps (Optional)

1. ✅ ~~Thêm chức năng nộp lại tài liệu bị reject~~ - DONE
2. ✅ ~~Thêm preview file trong modal (PDF, images)~~ - DONE (Images only)
3. ⬜ Thêm PDF preview trong modal
4. ⬜ Thêm history của tài liệu (các lần nộp trước)
5. ⬜ Thêm notification khi tài liệu được duyệt/từ chối
6. ⬜ Export hồ sơ thành PDF

## Notes

- Token được lấy từ localStorage: `localStorage.getItem('token')`
- Token tự động expire sau thời gian được set trong backend
- Nếu token expire, user cần login lại
- Tất cả API calls đều cần token trong Authorization header

---

**Status:** ✅ COMPLETE
**Version:** 1.0.0
**Last Updated:** December 4, 2025
