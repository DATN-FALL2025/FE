# UI Vietnamese Translation Summary

## Đã hoàn thành

### 1. Sidebar Navigation - Tất cả roles
✅ **Trainee Sidebar** (`features/trainees/components/layout/sidebar.tsx`)
- Dashboard → Trang chủ
- My Documents → Tài liệu của tôi
- Notifications → Thông báo
- Admission Result → Kết quả tuyển sinh
- Document Matrix → Ma trận tài liệu
- Profile → Hồ sơ
- Security Settings → Cài đặt bảo mật
- Logout → Đăng xuất

✅ **Academic Staff Sidebar** (`features/academic-staff/components/layout/academic-staff-sidebar.tsx`)
- Academic Management → Quản lý học thuật
- Dashboard → Trang chủ
- Document Approvals → Duyệt tài liệu
- Logout → Đăng xuất

✅ **Admin Sidebar** (`features/admin/components/layout/admin-sidebar.tsx`)
- Administration → Quản trị hệ thống
- Dashboard → Trang chủ
- User Management → Quản lý người dùng
- Department Management → Quản lý phòng ban
- Position Management → Quản lý vị trí
- Document Management → Quản lý tài liệu
- Rule Management → Quản lý quy tắc
- Logout → Đăng xuất

✅ **Head of Department Sidebar** (`features/head/components/layout/head-sidebar.tsx`)
- Department Management → Quản lý phòng ban
- Dashboard → Trang chủ
- Document Matrix → Ma trận tài liệu
- Logout → Đăng xuất

✅ **Training Director Sidebar** (`features/training-director/components/layout/training-director-sidebar.tsx`)
- Training Management → Quản lý đào tạo
- Dashboard → Trang chủ
- Document Matrix → Ma trận tài liệu
- Reports → Báo cáo
- Admission Results → Kết quả tuyển sinh
- Profile → Hồ sơ
- Security Settings → Cài đặt bảo mật
- Logout → Đăng xuất

### 2. Academic Staff Approvals Page
✅ **Status Badges** (GIỮ NGUYÊN giá trị, chỉ đổi label hiển thị)
- Pending → Chờ xử lý
- InProgress → Đang xử lý
- Approve → Đã duyệt
- Reject → Từ chối
- Complete → Hoàn thành

✅ **Priority Badges**
- High Priority → Ưu tiên cao
- Medium → Trung bình

✅ **Time Display**
- Just now → Vừa xong
- hours ago → giờ trước
- Yesterday → Hôm qua
- days ago → ngày trước

✅ **Page Header**
- Student Request Approvals → Duyệt Đơn Đăng Ký Học Viên
- Review and approve student academic requests → Xem xét và duyệt các đơn đăng ký của học viên

✅ **Statistics Cards**
- Pending Review → Chờ xem xét
- Approve → Đã duyệt
- Reject → Từ chối

✅ **Tabs**
- All → Tất cả
- Pending → Chờ xử lý
- Approve → Đã duyệt
- Reject → Từ chối
- Complete → Hoàn thành
- InProgress → Đang xử lý

✅ **View Mode Buttons**
- Card → Thẻ
- Table → Bảng

✅ **Table Headers**
- ID → ID
- Status → Trạng thái
- Created → Ngày tạo
- Updated → Cập nhật
- Active → Hoạt động
- Actions → Thao tác

✅ **Action Buttons**
- View → Xem
- Complete → Hoàn thành

✅ **Card Content**
- Application # → Đơn đăng ký #
- Created: → Tạo lúc:
- Trainee Application → Đơn đăng ký học viên
- Status: → Trạng thái:
- Active: Yes/No → Hoạt động: Có/Không
- Last updated: → Cập nhật lần cuối:

### 3. File Preview Enhancement
✅ **Hỗ trợ xem PDF và file văn bản**
- Thêm logic kiểm tra loại file (PDF, image, other)
- Hiển thị PDF trong iframe
- Hiển thị ảnh với Next.js Image
- Hiển thị thông báo cho file không hỗ trợ xem trước

✅ **Next.js Image Configuration**
- Thêm Supabase hostname vào `next.config.mjs`
- Hostname: `ifdfxmtxxgbaxvppxyly.supabase.co`

### 4. Trainee Documents Page
✅ **Submit Button Logic**
- Chỉ hiển thị khi đã nộp hết tài liệu
- Chỉ hiển thị khi trạng thái là "Pending"
- Ẩn khi đã submit (status khác "Pending")

✅ **API Parameter Updates**
- `submissionName` → `requireDocumentName`
- `submissionStatus` → `apply_or_not` (cho trainee view)

## Lưu ý quan trọng

### Giữ nguyên (KHÔNG đổi):
- Tên biến, function trong code
- API endpoints và parameters
- Giá trị trạng thái trong database (Pending, Approve, Reject, Complete, InProgress)
- Tên file và folder structure

### Đã đổi:
- Text hiển thị trên UI (labels, buttons, headers)
- Thông báo cho người dùng (toasts, messages)
- Placeholder text
- Error messages

## Cần làm tiếp (nếu cần)

### Pages chưa sửa UI:
- [ ] Dashboard pages (tất cả roles)
- [ ] Admin management pages (users, departments, positions, documents, rules)
- [ ] Matrix pages
- [ ] Profile pages
- [ ] Settings pages
- [ ] Coming Soon pages
- [ ] Login/Signup pages

### Components chưa sửa:
- [ ] Mobile sidebars
- [ ] Navbar components
- [ ] Toast notifications
- [ ] Dialog/Modal titles và descriptions
- [ ] Form labels và placeholders
- [ ] Error messages
- [ ] Loading states

## Hướng dẫn tiếp tục

Để tiếp tục việc dịch UI, làm theo pattern:
1. Tìm tất cả text tiếng Anh trong component
2. Chỉ đổi text hiển thị (UI labels)
3. GIỮ NGUYÊN tên biến, function, API calls
4. GIỮ NGUYÊN giá trị status trong code logic
5. Test kỹ sau khi đổi để đảm bảo không ảnh hưởng logic

## Files đã sửa

1. `features/trainees/components/layout/sidebar.tsx`
2. `features/academic-staff/components/layout/academic-staff-sidebar.tsx`
3. `features/admin/components/layout/admin-sidebar.tsx`
4. `features/head/components/layout/head-sidebar.tsx`
5. `features/training-director/components/layout/training-director-sidebar.tsx`
6. `app/(academic-staff)/academic-staff/approvals/page.tsx`
7. `app/(trainees)/trainees/documents/page.tsx`
8. `lib/actions/trainee-submission-client.js`
9. `next.config.mjs`
