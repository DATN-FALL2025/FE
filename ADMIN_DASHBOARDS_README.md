# Admin Dashboards - IDMAWA

## 🎯 Overview

Dashboards cho 3 roles quản lý trong hệ thống IDMAWA (Admission Document Management and Workflow Automation) cho Aviation Academy.

---

## 📊 Roles & Dashboards

### 1. **System Administrator** 
**Route**: `/admin/dashboard`

#### Chức Năng Chính
- ✅ Quản lý toàn bộ hệ thống
- ✅ Quản lý tài khoản người dùng (CRUD)
- ✅ Quản lý departments
- ✅ Quản lý rule types
- ✅ Quản lý certificates
- ✅ Monitor system-wide statistics

#### Dashboard Components
- **Stats Overview** (8 metrics):
  - Total Users
  - Total Students  
  - Departments
  - Total Documents
  - Pending Approvals
  - Approval Rate
  - Active Users
  - New This Month

- **Pending Approvals**: Danh sách documents cần review
- **Department Overview**: Phân bổ students theo departments

#### Navigation Menu
```
Administration:
├── Dashboard
├── User Management
├── Departments
├── Document Approvals
├── Rule Management
├── Certificates
└── Reports

Settings:
└── Settings
```

---

### 2. **Head of Department**
**Route**: `/head/dashboard`

#### Chức Năng Chính
- ✅ Configure Document Matrix (TPR - Training Program Requirements)
- ✅ Approve/Revise document requirements
- ✅ Manage training programs
- ✅ Monitor compliance

#### Dashboard Components
- **Stats Overview** (4 metrics):
  - Training Programs
  - Document Matrices
  - Total Students
  - Compliance Rate

- **Pending Matrix Approvals**: Các ma trận cần phê duyệt
- **Quick Actions**: 
  - View All Matrices
  - Training Programs
  - Student Overview
  - Reports & Analytics

#### Key Features
- Configure matrix by training role (Pilot, Cabin Crew, Maintenance)
- Define mandatory/optional documents
- Set validity periods
- Define conditional rules (TOEIC ≥ 600, age < 18, etc.)

---

### 3. **Input Document Manager**
**Route**: `/manager/dashboard`

#### Chức Năng Chính
- ✅ Apply configured matrices to courses
- ✅ Review & approve/reject student documents
- ✅ Monitor submission progress
- ✅ Generate compliance reports
- ✅ Track deadlines

#### Dashboard Components
- **Stats Overview** (4 metrics):
  - Pending Reviews (urgent)
  - Approved Today
  - Rejected Today
  - Approval Rate

- **Recent Submissions**: Latest documents for review with actions:
  - View
  - Approve
  - Reject

- **Program Progress**: Student completion by program
  - Pilot Training
  - Cabin Crew
  - Aircraft Maintenance

#### Workflow
1. View submitted documents
2. Filter by status/program
3. Review system-validated files
4. Approve or reject with reason
5. Export reports

---

## 🎨 Design System

### Color Scheme
```tsx
// Stats Cards
Blue: Users/Documents (text-blue-600, bg-blue-50)
Green: Approvals/Success (text-green-600, bg-green-50)
Purple: Departments (text-purple-600, bg-purple-50)
Orange: Pending (text-orange-600, bg-orange-50)
Yellow: Warnings (text-yellow-600, bg-yellow-50)
Red: Rejections (text-red-600, bg-red-50)
Emerald: Rates (text-emerald-600, bg-emerald-50)
```

### Layout Structure
```
┌─────────────────────────────────────────┐
│           Navbar (Sticky)               │
├─────────┬───────────────────────────────┤
│ Sidebar │      Main Content             │
│ (Fixed) │   ┌─────────────────────┐     │
│         │   │  Page Header        │     │
│         │   ├─────────────────────┤     │
│         │   │  Stats Grid (4/8)   │     │
│         │   ├─────────────────────┤     │
│         │   │  Content Grid       │     │
│         │   │  ├─ 60% (col-3)     │     │
│         │   │  └─ 40% (col-2)     │     │
│         │   └─────────────────────┘     │
└─────────┴───────────────────────────────┘
```

---

## 📂 File Structure

```
features/admin/
├── types.ts                           # TypeScript definitions
├── hooks/
│   └── use-admin-data.ts              # Data fetching hook
└── components/
    ├── dashboard/
    │   ├── stats-overview.tsx         # Stats cards
    │   ├── pending-approvals.tsx      # Approval queue
    │   └── department-overview.tsx    # Department stats
    └── layout/
        ├── admin-navbar.tsx           # Top navbar
        ├── admin-sidebar.tsx          # Desktop sidebar
        └── admin-mobile-sidebar.tsx   # Mobile navigation

app/(dashboard)/
├── layout.tsx                         # Shared dashboard layout
├── admin/
│   └── dashboard/page.tsx             # Admin dashboard
├── head/
│   └── dashboard/page.tsx             # Head of Dept dashboard
└── manager/
    └── dashboard/page.tsx             # Manager dashboard
```

---

## 🔧 Technologies

### Core
- **Next.js 15** - App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### UI Components
- **Shadcn UI** - Component library
- **Lucide Icons** - Icon system
- **Recharts** - Charts (future)

---

## 📊 Mock Data Included

### Admin Dashboard
```typescript
- Total Users: 1,245
- Total Students: 987
- Departments: 12
- Total Documents: 6,891
- Pending Approvals: 156
- Approval Rate: 94.5%
- Active Users: 342
- New This Month: 48
```

### Head of Department
```typescript
- Training Programs: 5
- Document Matrices: 12
- Total Students: 342
- Compliance Rate: 96%
```

### Input Document Manager
```typescript
- Pending Reviews: 156
- Approved Today: 42
- Rejected Today: 8
- Approval Rate: 94%
```

---

## 🚀 Getting Started

### Access Dashboards

```bash
# Run development server
npm run dev

# Access dashboards
http://localhost:3000/admin/dashboard      # Admin
http://localhost:3000/head/dashboard       # Head of Department
http://localhost:3000/manager/dashboard    # Input Doc Manager
http://localhost:3000/students/dashboard   # Students
```

---

## 🎯 Key Features by Role

### Admin Can:
- [x] Manage all user accounts
- [x] CRUD departments
- [x] Configure rules and certificates
- [x] Monitor system-wide metrics
- [x] Export reports
- [x] View all pending approvals

### Head of Department Can:
- [x] Configure document matrices (TPR)
- [x] Define training program requirements
- [x] Set conditional rules
- [x] Approve/revise matrices
- [x] Monitor compliance rates
- [x] Manage training programs

### Input Document Manager Can:
- [x] Apply matrices to courses
- [x] Review submitted documents
- [x] Approve/reject with reasons
- [x] Track submission deadlines
- [x] Monitor program progress
- [x] Export Excel reports
- [x] Filter by status/program

---

## 📱 Responsive Design

### Breakpoints
```css
Mobile: < 1024px
  - Sidebar hidden (hamburger menu)
  - Single column stats
  - Full width content

Desktop: ≥ 1024px
  - Fixed sidebar
  - Multi-column stats grid
  - 3-2 content grid
```

---

## 🎨 Component Patterns

### Stats Card Pattern
```tsx
<Card>
  <div className="flex items-center justify-between">
    <div>
      <label>Metric Name</label>
      <value>Number</value>
      <change>+/- %</change>
    </div>
    <Icon in colored background />
  </div>
</Card>
```

### Action Card Pattern
```tsx
<Card>
  <Header>
    <Title + Description />
    <Badge with count />
  </Header>
  <Content>
    {items.map(item => (
      <Item>
        <Info />
        <Actions: View, Approve, Reject />
      </Item>
    ))}
  </Content>
</Card>
```

---

## 🔄 Workflows

### Admin Workflow
```
1. Login → Admin Dashboard
2. View system stats
3. Check pending approvals
4. Manage users/departments
5. Export reports
```

### Head of Department Workflow
```
1. Login → Department Dashboard
2. Configure document matrix
3. Define requirements & rules
4. Review pending matrices
5. Approve → Activate for use
```

### Input Document Manager Workflow
```
1. Login → Manager Dashboard
2. View pending submissions
3. Review documents
4. Approve/Reject with feedback
5. Monitor progress
6. Generate compliance reports
```

---

## 📈 Future Enhancements

### Admin
- [ ] User activity logs
- [ ] System health monitoring
- [ ] Advanced analytics dashboard
- [ ] Bulk operations

### Head of Department
- [ ] Template library
- [ ] Version control for matrices
- [ ] Conditional logic builder UI
- [ ] Matrix comparison tool

### Manager
- [ ] Batch approval
- [ ] Advanced filtering
- [ ] Custom report builder
- [ ] Automated reminders
- [ ] Document preview
- [ ] Rejection templates

---

## 🎯 Status

**Admin Dashboard**: ✅ Complete  
**Head of Department Dashboard**: ✅ Complete  
**Input Document Manager Dashboard**: ✅ Complete  
**Student Portal**: ✅ Complete (from previous work)

**Total Pages Built**: 4 dashboards  
**Total Components**: 15+ components  
**Ready for Backend**: ✅ Yes

---

## 🔗 Related Documentation

- `features/students/README.md` - Student portal documentation
- `PROJECT_SUMMARY.md` - Overall project summary
- System requirements document

---

**Built with ❤️ for Aviation Academy**  
**Last Updated**: October 8, 2024  
**Version**: 1.0.0

