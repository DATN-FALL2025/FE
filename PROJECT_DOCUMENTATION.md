# IDMAWA - Aviation Academy Management System
## Documentation & UML Flow Diagrams

---

## 1. Tổng Quan Dự Án

**Tên dự án:** IDMAWA - Hệ thống Quản lý Học viện Hàng không
**Loại:** Full-stack Web Application
**Tech Stack:** Next.js 14 + React 18 + TypeScript + Tailwind CSS
**Backend:** REST API (Render-hosted)
**Authentication:** JWT Token với Role-Based Access Control (RBAC)

---

## 2. Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 14)                     │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│  │  Admin   │ │ Training │ │   Head   │ │ Academic │ │Trainee ││
│  │  Portal  │ │ Director │ │   Portal │ │  Staff   │ │ Portal ││
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘│
│       │            │            │            │           │      │
│       └────────────┴────────────┴────────────┴───────────┘      │
│                              │                                   │
│                    ┌─────────┴─────────┐                        │
│                    │   Middleware      │                        │
│                    │  (Route Guard)    │                        │
│                    └─────────┬─────────┘                        │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │    REST API Layer   │
                    │   (Server Actions)  │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │   Backend Server    │
                    │     (Render)        │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │     Database        │
                    └─────────────────────┘
```
   // 1 call data từ api (get, post, put, delete)
   // 2 feature -- (logic để hiển thị) dùng data đó hiển thị trên giao diện
---

## 3. Cấu Trúc Thư Mục

```
support_fall2025/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Routes công khai (login, signup)
│   ├── (admin)/                  # Routes cho Admin
│   ├── (training-director)/      # Routes cho Training Director
│   ├── (head)/                   # Routes cho Head of Department
│   ├── (academic-staff)/         # Routes cho Academic Staff
│   ├── (trainees)/               # Routes cho Trainee
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── features/                     # Modules theo role
│   ├── admin/                    # Components của Admin
│   ├── training-director/        # Components của Training Director
│   ├── head/                     # Components của Head
│   ├── academic-staff/           # Components của Academic Staff
│   ├── trainees/                 # Components của Trainee
│   └── statistic/                # Components thống kê
│
├── components/                   # UI Components tái sử dụng
│   └── ui/                       # shadcn/ui components
│
├── lib/                          # Utilities
│   ├── actions/                  # Server actions (API calls)
│   │   ├── auth.js               # Authentication actions
│   │   ├── matrix.ts             # Matrix management
│   │   ├── department.ts         # Department actions
│   │   ├── position.ts           # Position actions
│   │   └── document.ts           # Document actions
│   ├── config/                   # Configurations
│   └── auth-utils.ts             # Auth utilities
│
├── types/                        # TypeScript definitions
├── hooks/                        # Custom React hooks
├── middleware.ts                 # Route protection
└── package.json                  # Dependencies
```

---

## 4. Các Role và Quyền Hạn

### 4.1 Bảng Phân Quyền

| Role | Route | Mô Tả |
|------|-------|-------|
| **ADMIN** | `/admin/*` | Quản lý toàn hệ thống |
| **TRAINING_DIRECTOR** | `/training-director/*` | Cấu hình matrix, deadline |
| **HEAD_OF_DEPARTMENT** | `/head/*` | Duyệt matrix cấp phòng ban |
| **ACADEMIC_STAFF_AFFAIR** | `/academic-staff/*` | Xử lý hồ sơ sinh viên |
| **TRAINEE** | `/trainees/*` | Nộp hồ sơ, theo dõi tiến độ |

### 4.2 Chi Tiết Quyền Hạn

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN (Quản trị viên)                     │
├─────────────────────────────────────────────────────────────────┤
│  • Quản lý Users (tạo, sửa, xóa, import Excel)                  │
│  • Quản lý Departments (phòng ban)                              │
│  • Quản lý Positions (vị trí đào tạo)                           │
│  • Quản lý Documents (loại tài liệu)                            │
│  • Quản lý Rules (quy tắc tài liệu)                             │
│  • Xem thống kê toàn hệ thống                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  TRAINING DIRECTOR (Giám đốc đào tạo)           │
├─────────────────────────────────────────────────────────────────┤
│  • Cấu hình Document Matrix                                     │
│  • Thêm/xóa Positions (hàng) và Documents (cột)                 │
│  • Thiết lập Deadlines                                          │
│  • Duyệt Matrix cuối cùng                                       │
│  • Xem thống kê theo phòng ban                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                HEAD OF DEPARTMENT (Trưởng phòng)                │
├─────────────────────────────────────────────────────────────────┤
│  • Xem và duyệt Matrix của phòng ban                            │
│  • Kiểm tra yêu cầu tài liệu                                    │
│  • Giám sát tiến độ phòng ban                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              ACADEMIC STAFF (Nhân viên học vụ)                  │
├─────────────────────────────────────────────────────────────────┤
│  • Xem danh sách hồ sơ chờ duyệt                                │
│  • Duyệt/Từ chối tài liệu                                       │
│  • Quản lý theo batch                                           │
│  • Gửi phản hồi cho sinh viên                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      TRAINEE (Sinh viên)                        │
├─────────────────────────────────────────────────────────────────┤
│  • Xem profile cá nhân                                          │
│  • Xem danh sách tài liệu cần nộp                               │
│  • Upload tài liệu                                              │
│  • Theo dõi tiến độ (% hoàn thành)                              │
│  • Nhận thông báo duyệt/từ chối                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. TỔNG HỢP CÁC FLOW CHÍNH

### Dự án có **8 FLOW CHÍNH**:

| # | Flow Name | Mô Tả |
|---|-----------|-------|
| 1 | Authentication Flow | Đăng nhập/Đăng ký |
| 2 | Admin Management Flow | Quản lý hệ thống |
| 3 | Matrix Setup Flow | Cấu hình ma trận tài liệu |
| 4 | Matrix Approval Flow | Quy trình duyệt matrix |
| 5 | Document Submission Flow | Sinh viên nộp hồ sơ |
| 6 | Document Approval Flow | Duyệt tài liệu |
| 7 | Progress Tracking Flow | Theo dõi tiến độ |
| 8 | Statistics & Reporting Flow | Thống kê báo cáo |

---

## 6. UML FLOW DIAGRAMS

### FLOW 1: Authentication Flow (Xác thực)

```
┌─────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

     ┌───────┐
     │ Start │
     └───┬───┘
         │
         ▼
┌─────────────────┐
│  User truy cập  │
│    /login       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Nhập username   │
│   & password    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     authenticateAccount()
│  Submit Form    │────────────────────────────┐
└────────┬────────┘                            │
         │                                      ▼
         │                          ┌─────────────────────┐
         │                          │  POST /api/account  │
         │                          │  /authenticateAccount│
         │                          └──────────┬──────────┘
         │                                     │
         │                                     ▼
         │                          ┌─────────────────────┐
         │          ┌───────────────│  Backend Validates  │
         │          │               │     Credentials     │
         │          │               └─────────────────────┘
         │          │
         ▼          ▼
    ┌────────┐  ┌────────┐
    │ Valid? │  │Invalid │───────┐
    └───┬────┘  └────────┘       │
        │                        │
        │ YES                    ▼
        ▼                 ┌─────────────┐
┌─────────────────┐       │ Show Error  │
│ Return JWT Token│       │   Message   │
└────────┬────────┘       └─────────────┘
         │
         ▼
┌─────────────────┐
│  Decode JWT     │
│  Extract Role   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Store Token in  │
│ localStorage +  │
│    Cookie       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│         getRoleRedirectPath(role)           │
├─────────────────────────────────────────────┤
│  ADMIN          → /admin/dashboard          │
│  TRAINING_DIR   → /training-director/dashboard │
│  HEAD           → /head/dashboard           │
│  ACADEMIC_STAFF → /academic-staff/dashboard │
│  TRAINEE        → /trainees/dashboard       │
└────────────────────┬────────────────────────┘
                     │
                     ▼
              ┌─────────┐
              │   End   │
              └─────────┘
```

**File liên quan:**
- `lib/actions/auth.js` - API authentication
- `lib/auth-utils.ts` - JWT decode, role management
- `app/(auth)/login/page.tsx` - Login page
- `middleware.ts` - Route protection

---

### FLOW 2: Admin Management Flow (Quản lý hệ thống)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN MANAGEMENT FLOW                         │
└─────────────────────────────────────────────────────────────────┘

                        ┌───────────────┐
                        │ Admin Login   │
                        └───────┬───────┘
                                │
                                ▼
                     ┌────────────────────┐
                     │  Admin Dashboard   │
                     │   /admin/dashboard │
                     └──────────┬─────────┘
                                │
        ┌───────────┬───────────┼───────────┬───────────┐
        │           │           │           │           │
        ▼           ▼           ▼           ▼           ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
   │  Users  │ │  Depts  │ │Positions│ │  Docs   │ │  Rules  │
   └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
        │           │           │           │           │
        ▼           ▼           ▼           ▼           ▼
   ┌─────────────────────────────────────────────────────────┐
   │                    CRUD Operations                       │
   │  • Create (Tạo mới)                                     │
   │  • Read (Xem danh sách)                                 │
   │  • Update (Cập nhật)                                    │
   │  • Delete (Xóa)                                         │
   │  • Import Excel (Users)                                 │
   └─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    USER MANAGEMENT DETAIL                        │
└─────────────────────────────────────────────────────────────────┘

        ┌──────────────────┐
        │  /admin/users    │
        └────────┬─────────┘
                 │
    ┌────────────┼────────────┬────────────┐
    │            │            │            │
    ▼            ▼            ▼            ▼
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│ Create │  │  View  │  │  Edit  │  │ Import │
│  User  │  │  List  │  │  User  │  │ Excel  │
└───┬────┘  └────────┘  └───┬────┘  └───┬────┘
    │                       │           │
    ▼                       ▼           ▼
┌─────────────┐      ┌───────────┐  ┌──────────────┐
│ Fill Form:  │      │ Update:   │  │ Upload .xlsx │
│ - userName  │      │ - role    │  │ file with    │
│ - password  │      │ - dept    │  │ user data    │
│ - gmail     │      │ - info    │  └──────┬───────┘
│ - role      │      └─────┬─────┘         │
│ - dept      │            │               │
└──────┬──────┘            │               │
       │                   │               │
       └───────────────────┴───────────────┘
                           │
                           ▼
              ┌─────────────────────┐
              │   API: createUser   │
              │   updateUser        │
              │   importUsers       │
              └─────────────────────┘
```

**File liên quan:**
- `app/(admin)/admin/users/page.tsx`
- `app/(admin)/admin/departments/page.tsx`
- `app/(admin)/admin/positions/page.tsx`
- `app/(admin)/admin/documents/page.tsx`
- `features/admin/` - Admin components

---

### FLOW 3: Matrix Setup Flow (Cấu hình Matrix)

```
┌─────────────────────────────────────────────────────────────────┐
│                      MATRIX SETUP FLOW                           │
│             (Training Director cấu hình)                         │
└─────────────────────────────────────────────────────────────────┘

     ┌───────────────────────────────────┐
     │  Training Director Dashboard      │
     └───────────────┬───────────────────┘
                     │
                     ▼
     ┌───────────────────────────────────┐
     │    /training-director/matrix      │
     │         Matrix Page               │
     └───────────────┬───────────────────┘
                     │
     ┌───────────────┴───────────────┐
     │                               │
     ▼                               ▼
┌──────────────┐              ┌──────────────┐
│  ADD ROWS    │              │  ADD COLUMNS │
│ (Positions)  │              │ (Documents)  │
└──────┬───────┘              └──────┬───────┘
       │                             │
       ▼                             ▼
┌──────────────┐              ┌──────────────┐
│ Single Add   │              │ Single Add   │
│    OR        │              │    OR        │
│ Bulk Add     │              │ Bulk Add     │
└──────┬───────┘              └──────┬───────┘
       │                             │
       ▼                             ▼
┌─────────────────────────────────────────────┐
│            DOCUMENT MATRIX                   │
│  ┌─────────────────────────────────────────┐│
│  │         │ Doc1  │ Doc2  │ Doc3  │ Doc4  ││
│  ├─────────┼───────┼───────┼───────┼───────┤│
│  │Position1│   ✓   │   ✓   │       │   ✓   ││
│  │Position2│   ✓   │       │   ✓   │   ✓   ││
│  │Position3│       │   ✓   │   ✓   │       ││
│  └─────────────────────────────────────────┘│
│                                              │
│  ✓ = Document required for Position         │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
          ┌─────────────────────────┐
          │   SET DEADLINES         │
          │  • Start Date           │
          │  • End Date             │
          │  Per Document/Position  │
          └────────────┬────────────┘
                       │
                       ▼
          ┌─────────────────────────┐
          │  Save Matrix Config     │
          │  Status: DRAFTED        │
          └────────────┬────────────┘
                       │
                       ▼
          ┌─────────────────────────┐
          │  Submit for Approval    │
          │  Status: PENDING        │
          └─────────────────────────┘
```

**API Endpoints:**
```
POST /api/matrix/addRow          - Thêm position
POST /api/matrix/addColum        - Thêm document
DELETE /api/matrix/deleteRow     - Xóa position
DELETE /api/matrix/deleteColumn  - Xóa document
PUT /api/matrix/set-deadline     - Đặt deadline
```

**File liên quan:**
- `app/(training-director)/training-director/matrix/page.tsx`
- `lib/actions/matrix.ts`
- `features/training-director/`

---

### FLOW 4: Matrix Approval Flow (Quy trình duyệt Matrix)

```
┌─────────────────────────────────────────────────────────────────┐
│                    MATRIX APPROVAL FLOW                          │
│                   (Multi-level approval)                         │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │ Training Dir    │
                    │ Creates Matrix  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Status: DRAFTED │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Submit to Head  │
                    │ of Department   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Status: PENDING │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │     HEAD OF DEPARTMENT       │
              │     Reviews Matrix           │
              └──────────────┬───────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
       ┌─────────────┐              ┌─────────────┐
       │   APPROVE   │              │   REJECT    │
       └──────┬──────┘              └──────┬──────┘
              │                            │
              ▼                            ▼
    ┌─────────────────┐          ┌─────────────────┐
    │HEAD_APPROVED    │          │ Back to Training│
    └────────┬────────┘          │ Dir for fixes   │
             │                   └─────────────────┘
             ▼
    ┌─────────────────────────────┐
    │   TRAINING DIRECTOR         │
    │   Final Review              │
    └────────────┬────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌─────────┐            ┌─────────┐
│ APPROVE │            │ REJECT  │
└────┬────┘            └────┬────┘
     │                      │
     ▼                      ▼
┌─────────────┐      ┌─────────────┐
│  Status:    │      │ Back to     │
│  APPROVED   │      │ HEAD review │
└──────┬──────┘      └─────────────┘
       │
       ▼
┌─────────────────┐
│    ACTIVATE     │
│  Matrix Ready   │
│  for Trainees   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Status: ACTIVE  │
└─────────────────┘
```

**Status Flow:**
```
DRAFTED → PENDING → HEAD_APPROVED → APPROVED → ACTIVE → COMPLETE
              ↓                          ↓
          (Rejected)               (Rejected)
              ↓                          ↓
          DRAFTED                  PENDING
```

**File liên quan:**
- `app/(head)/head/matrix/page.tsx`
- `app/(training-director)/training-director/matrix/page.tsx`
- `lib/actions/matrix.ts`

---

### FLOW 5: Document Submission Flow (Sinh viên nộp hồ sơ)

```
┌─────────────────────────────────────────────────────────────────┐
│                  DOCUMENT SUBMISSION FLOW                        │
│                      (Trainee Journey)                           │
└─────────────────────────────────────────────────────────────────┘

        ┌───────────────────┐
        │   Trainee Login   │
        └─────────┬─────────┘
                  │
                  ▼
        ┌───────────────────┐
        │ Trainee Dashboard │
        │/trainees/dashboard│
        └─────────┬─────────┘
                  │
                  ▼
        ┌───────────────────────────────────────┐
        │         VIEW PROGRESS                  │
        │  ┌─────────────────────────────────┐  │
        │  │  Progress: 30% Complete         │  │
        │  │  ████████░░░░░░░░░░░░░░░░░      │  │
        │  │                                 │  │
        │  │  Documents:                     │  │
        │  │  ✓ ID Card        - Approved    │  │
        │  │  ✓ Photo          - Approved    │  │
        │  │  ⏳ Certificate   - Pending     │  │
        │  │  ○ Medical Report - Not Submit  │  │
        │  │  ○ Transcript     - Not Submit  │  │
        │  └─────────────────────────────────┘  │
        └───────────────────┬───────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │   Navigate to Documents Page          │
        │   /trainees/documents                 │
        └───────────────────┬───────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │       SELECT DOCUMENT TYPE            │
        │  ┌─────────────────────────────────┐  │
        │  │  Required Documents:            │  │
        │  │  • Medical Report  [Upload]     │  │
        │  │  • Transcript      [Upload]     │  │
        │  └─────────────────────────────────┘  │
        └───────────────────┬───────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │         UPLOAD INTERFACE              │
        │  ┌─────────────────────────────────┐  │
        │  │  ┌─────────────────────────┐    │  │
        │  │  │                         │    │  │
        │  │  │   Drag & Drop Files     │    │  │
        │  │  │        OR               │    │  │
        │  │  │   Click to Browse       │    │  │
        │  │  │                         │    │  │
        │  │  └─────────────────────────┘    │  │
        │  │                                 │  │
        │  │  Allowed: PDF, JPG, PNG         │  │
        │  │  Max size: 10MB                 │  │
        │  └─────────────────────────────────┘  │
        └───────────────────┬───────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │          VALIDATION                   │
        │  • File type check                    │
        │  • File size check                    │
        │  • Deadline check                     │
        └───────────────────┬───────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
      ┌───────────┐                  ┌───────────┐
      │   Valid   │                  │  Invalid  │
      └─────┬─────┘                  └─────┬─────┘
            │                              │
            ▼                              ▼
    ┌───────────────┐            ┌─────────────────┐
    │Upload to Cloud│            │ Show Error      │
    │  (Cloudinary) │            │ - Wrong format  │
    └───────┬───────┘            │ - Too large     │
            │                    │ - Past deadline │
            ▼                    └─────────────────┘
    ┌───────────────┐
    │Save to Backend│
    │Status: PENDING│
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │ Update UI     │
    │ Show Success  │
    └───────────────┘
```

**File liên quan:**
- `app/(trainees)/trainees/dashboard/page.tsx`
- `app/(trainees)/trainees/documents/page.tsx`
- `features/trainees/`
- `lib/actions/upload.ts`

---

### FLOW 6: Document Approval Flow (Duyệt tài liệu)

```
┌─────────────────────────────────────────────────────────────────┐
│                   DOCUMENT APPROVAL FLOW                         │
│                   (Academic Staff Process)                       │
└─────────────────────────────────────────────────────────────────┘

          ┌─────────────────────────┐
          │  Academic Staff Login   │
          └────────────┬────────────┘
                       │
                       ▼
          ┌─────────────────────────┐
          │   Academic Dashboard    │
          │/academic-staff/dashboard│
          └────────────┬────────────┘
                       │
                       ▼
          ┌─────────────────────────┐
          │   View Pending Queue    │
          │ /academic-staff/approvals│
          └────────────┬────────────┘
                       │
                       ▼
   ┌───────────────────────────────────────────────┐
   │              PENDING DOCUMENTS                 │
   │  ┌─────────────────────────────────────────┐  │
   │  │ Student      │ Document    │ Status     │  │
   │  ├─────────────────────────────────────────┤  │
   │  │ John Doe     │ Medical Rep │ Pending    │  │
   │  │ Jane Smith   │ Transcript  │ Pending    │  │
   │  │ Bob Wilson   │ ID Card     │ Pending    │  │
   │  └─────────────────────────────────────────┘  │
   └───────────────────┬───────────────────────────┘
                       │
                       ▼
          ┌─────────────────────────┐
          │  Select Document to     │
          │  Review                 │
          └────────────┬────────────┘
                       │
                       ▼
          ┌─────────────────────────┐
          │   VIEW DOCUMENT DETAIL  │
          │  • Preview file         │
          │  • Check requirements   │
          │  • Validate content     │
          └────────────┬────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
   ┌─────────────┐          ┌─────────────┐
   │   APPROVE   │          │   REJECT    │
   └──────┬──────┘          └──────┬──────┘
          │                        │
          ▼                        ▼
   ┌─────────────┐          ┌─────────────────┐
   │Status:      │          │ Enter Rejection │
   │APPROVED     │          │ Reason          │
   └──────┬──────┘          └────────┬────────┘
          │                          │
          │                          ▼
          │                  ┌─────────────────┐
          │                  │ Status: REJECTED│
          │                  └────────┬────────┘
          │                           │
          └──────────┬────────────────┘
                     │
                     ▼
          ┌─────────────────────────┐
          │  Notify Trainee         │
          │  via notification       │
          └────────────┬────────────┘
                       │
                       ▼
          ┌─────────────────────────┐
          │  Update Progress        │
          │  Percentage             │
          └─────────────────────────┘
```

**Rejection Flow:**
```
Document Rejected → Trainee Notified → Can Resubmit → Back to Pending
```

**File liên quan:**
- `app/(academic-staff)/academic-staff/approvals/page.tsx`
- `app/(academic-staff)/academic-staff/dashboard/page.tsx`
- `features/academic-staff/`

---

### FLOW 7: Progress Tracking Flow (Theo dõi tiến độ)

```
┌─────────────────────────────────────────────────────────────────┐
│                   PROGRESS TRACKING FLOW                         │
└─────────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                    TRAINEE VIEW                              │
  │  ┌───────────────────────────────────────────────────────┐  │
  │  │           Personal Progress Dashboard                 │  │
  │  │                                                       │  │
  │  │  Overall Progress: 60%                               │  │
  │  │  ████████████████████░░░░░░░░░░░░                   │  │
  │  │                                                       │  │
  │  │  Documents Status:                                    │  │
  │  │  ┌────────────────┬──────────┬──────────┐           │  │
  │  │  │ Document       │ Status   │ Date     │           │  │
  │  │  ├────────────────┼──────────┼──────────┤           │  │
  │  │  │ ID Card        │ ✓ Done   │ Jan 5    │           │  │
  │  │  │ Photo          │ ✓ Done   │ Jan 5    │           │  │
  │  │  │ Certificate    │ ✓ Done   │ Jan 6    │           │  │
  │  │  │ Medical Report │ ⏳Pending │ Jan 8    │           │  │
  │  │  │ Transcript     │ ○ None   │ -        │           │  │
  │  │  └────────────────┴──────────┴──────────┘           │  │
  │  │                                                       │  │
  │  │  Deadline: January 15, 2025                          │  │
  │  │  Days Remaining: 7                                    │  │
  │  └───────────────────────────────────────────────────────┘  │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │                   STAFF VIEW                                 │
  │  ┌───────────────────────────────────────────────────────┐  │
  │  │          Department Progress Overview                 │  │
  │  │                                                       │  │
  │  │  Total Trainees: 150                                  │  │
  │  │  ┌─────────────────────────────────────────────────┐ │  │
  │  │  │ Complete (100%)     : ████████ 40 (27%)        │ │  │
  │  │  │ In Progress (50-99%): ████████████ 60 (40%)    │ │  │
  │  │  │ Started (1-49%)     : ████ 30 (20%)            │ │  │
  │  │  │ Not Started (0%)    : ███ 20 (13%)             │ │  │
  │  │  └─────────────────────────────────────────────────┘ │  │
  │  └───────────────────────────────────────────────────────┘  │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │              TRAINING DIRECTOR VIEW                          │
  │  ┌───────────────────────────────────────────────────────┐  │
  │  │        System-wide Statistics Dashboard               │  │
  │  │                                                       │  │
  │  │  ┌─────────────┬─────────────┬─────────────┐         │  │
  │  │  │ Department  │ Progress    │ Status      │         │  │
  │  │  ├─────────────┼─────────────┼─────────────┤         │  │
  │  │  │ Flight Ops  │ 75%         │ On Track    │         │  │
  │  │  │ Engineering │ 60%         │ On Track    │         │  │
  │  │  │ Safety      │ 45%         │ At Risk     │         │  │
  │  │  │ Admin       │ 90%         │ Complete    │         │  │
  │  │  └─────────────┴─────────────┴─────────────┘         │  │
  │  │                                                       │  │
  │  │  Matrix Setup Progress:                              │  │
  │  │  ┌─────────────────────────────────────────────────┐ │  │
  │  │  │ Pending: 2  │ Approved: 3  │ Active: 5         │ │  │
  │  │  └─────────────────────────────────────────────────┘ │  │
  │  └───────────────────────────────────────────────────────┘  │
  └─────────────────────────────────────────────────────────────┘
```

**File liên quan:**
- `features/statistic/`
- `app/(training-director)/training-director/dashboard/page.tsx`
- `app/(trainees)/trainees/dashboard/page.tsx`

---

### FLOW 8: Statistics & Reporting Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                 STATISTICS & REPORTING FLOW                      │
└─────────────────────────────────────────────────────────────────┘

                    ┌───────────────────┐
                    │   Data Sources    │
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   Trainees    │     │   Documents   │     │    Matrix     │
│   Data        │     │   Data        │     │   Data        │
└───────┬───────┘     └───────┬───────┘     └───────┬───────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Data Aggregation  │
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Department   │     │   Position    │     │   Document    │
│  Statistics   │     │  Statistics   │     │  Statistics   │
└───────────────┘     └───────────────┘     └───────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    DASHBOARD DISPLAYS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│   │  📊 Charts      │  │  📈 Progress    │  │  📋 Tables      │ │
│   │  (Recharts)     │  │     Bars        │  │  (React Table)  │ │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  Statistics Cards                        │   │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │   │
│   │  │ Total    │  │ Pending  │  │ Approved │  │ Complete │ │   │
│   │  │ Users    │  │ Docs     │  │ Docs     │  │ Profiles │ │   │
│   │  │   150    │  │    45    │  │   200    │  │    40    │ │   │
│   │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Sequence Diagram: Complete Document Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│            COMPLETE DOCUMENT LIFECYCLE SEQUENCE                  │
└─────────────────────────────────────────────────────────────────┘

 Admin     Training Dir    Head      Acad Staff    Trainee    System
   │            │            │            │            │          │
   │ Create     │            │            │            │          │
   │ Position   │            │            │            │          │
   │─────────────────────────────────────────────────────────────>│
   │            │            │            │            │          │
   │ Create     │            │            │            │          │
   │ Document   │            │            │            │          │
   │─────────────────────────────────────────────────────────────>│
   │            │            │            │            │          │
   │            │ Setup      │            │            │          │
   │            │ Matrix     │            │            │          │
   │            │────────────────────────────────────────────────>│
   │            │            │            │            │          │
   │            │ Set        │            │            │          │
   │            │ Deadline   │            │            │          │
   │            │────────────────────────────────────────────────>│
   │            │            │            │            │          │
   │            │ Submit     │            │            │          │
   │            │─────────────>│          │            │          │
   │            │            │            │            │          │
   │            │            │ Review     │            │          │
   │            │            │ & Approve  │            │          │
   │            │<───────────│            │            │          │
   │            │            │            │            │          │
   │            │ Final      │            │            │          │
   │            │ Approve    │            │            │          │
   │            │────────────────────────────────────────────────>│
   │            │            │            │            │          │
   │            │            │            │            │ Matrix   │
   │            │            │            │            │ Active   │
   │            │            │            │            │<─────────│
   │            │            │            │            │          │
   │            │            │            │            │ Upload   │
   │            │            │            │            │ Document │
   │            │            │            │            │─────────>│
   │            │            │            │            │          │
   │            │            │            │ Review Doc │          │
   │            │            │            │<───────────────────────│
   │            │            │            │            │          │
   │            │            │            │ Approve/   │          │
   │            │            │            │ Reject     │          │
   │            │            │            │───────────────────────>│
   │            │            │            │            │          │
   │            │            │            │            │ Notify   │
   │            │            │            │            │<─────────│
   │            │            │            │            │          │
   │            │            │            │            │ All Docs │
   │            │            │            │            │ Approved │
   │            │            │            │            │<─────────│
   │            │            │            │            │          │
```

---

## 8. Entity Relationship

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENTITY RELATIONSHIPS                          │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Account    │         │  Department  │         │   Position   │
├──────────────┤         ├──────────────┤         ├──────────────┤
│ userName     │    1    │ departmentId │    1    │ positionId   │
│ password     │────────>│ departmentName│<────────│ positionName │
│ gmail        │    N    │ departmentCode│    N   │ positionCode │
│ role         │         └──────────────┘         │ departmentId │
│ departmentId │                                   └──────────────┘
└──────────────┘                                          │
       │                                                  │
       │ 1                                               │ N
       │                                                  │
       ▼ N                                               ▼
┌──────────────┐                                  ┌──────────────┐
│  Submission  │                                  │    Matrix    │
├──────────────┤                                  ├──────────────┤
│ submissionId │                                  │ matrixId     │
│ documentId   │◄─────────────────────────────────│ positionId   │
│ accountId    │                                  │ documentId   │
│ status       │         ┌──────────────┐         │ ruleId       │
│ fileUrl      │    N    │   Document   │    1    │ deadline     │
│ uploadDate   │────────>├──────────────┤<────────│ status       │
└──────────────┘         │ documentId   │         └──────────────┘
                         │ documentName │                │
                         │ documentCode │                │
                         │ description  │                │ N
                         └──────────────┘                │
                                │                        ▼ 1
                                │ N            ┌──────────────┐
                                │              │ DocumentRule │
                                ▼ 1            ├──────────────┤
                         ┌──────────────┐      │ ruleId       │
                         │  Upload      │      │ ruleName     │
                         ├──────────────┤      │ description  │
                         │ uploadId     │      │ validation   │
                         │ documentId   │      └──────────────┘
                         │ fileUrl      │
                         │ fileType     │
                         │ fileSize     │
                         └──────────────┘
```

---

## 9. Technology Stack Summary

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | Next.js 14.2 (App Router) |
| **UI Library** | React 18 |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS 3.4 |
| **Component Library** | Radix UI + shadcn/ui |
| **State Management** | Jotai, Zustand, TanStack Query |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts |
| **Tables** | TanStack React Table |
| **File Upload** | Uploadthing + Cloudinary |
| **Animations** | Framer Motion |
| **Backend API** | REST API (Render) |
| **Authentication** | JWT |

---

## 10. Key API Endpoints

### Authentication
```
POST /api/account/v1/authenticateAccount  - Login
POST /api/account/v1/createUser           - Register
GET  /api/account/v1/getAllUser           - Get all users
```

### Matrix Management
```
GET  /api/matrix/getAllMatrix                    - Get all matrices
GET  /api/matrix/department/{departmentId}       - Get by department
POST /api/matrix/addRow                          - Add position
POST /api/matrix/addColum                        - Add document
DELETE /api/matrix/deleteRow/{positionId}        - Delete position
DELETE /api/matrix/deleteColumn/{documentId}     - Delete document
PUT  /api/matrix/set-status/department/{deptId}  - Update status
```

### Resource Management
```
GET/POST /api/department     - Department CRUD
GET/POST /api/position       - Position CRUD
GET/POST /api/document       - Document CRUD
GET/POST /api/document-rule  - Rule CRUD
```

---

## 11. Tóm Tắt

Dự án IDMAWA có **8 flow chính** quản lý toàn bộ quy trình tuyển sinh và đào tạo của học viện hàng không:

1. **Authentication Flow** - Xác thực và phân quyền
2. **Admin Management Flow** - Quản lý hệ thống
3. **Matrix Setup Flow** - Cấu hình ma trận tài liệu
4. **Matrix Approval Flow** - Quy trình duyệt matrix
5. **Document Submission Flow** - Sinh viên nộp hồ sơ
6. **Document Approval Flow** - Duyệt tài liệu
7. **Progress Tracking Flow** - Theo dõi tiến độ
8. **Statistics & Reporting Flow** - Thống kê báo cáo

Hệ thống được thiết kế với kiến trúc **Role-Based Access Control (RBAC)** với 5 roles chính, đảm bảo mỗi người dùng chỉ truy cập được các chức năng phù hợp với vai trò của họ.

---

*Document generated: January 2025*
