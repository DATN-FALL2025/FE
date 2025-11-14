# Student Portal - IDMAWA

## Overview

This is the student interface for the **Admission Document Management and Workflow Automation (IDMAWA)** system for an Aviation Academy. The portal allows students to manage their admission documents, track submission progress, and communicate with administrators.

## Features

### 🎯 Dashboard
- **Progress Overview**: Visual progress tracking with completion percentage
- **Document Statistics**: Real-time stats for submitted, approved, rejected, and pending documents
- **Deadline Tracking**: Countdown timer showing days remaining until submission deadline
- **Recent Activity**: Timeline of recent document uploads and status changes
- **Student Information Card**: Personal and academic information display

### 📄 Document Management
- **Document Upload**: Drag-and-drop interface for uploading documents
- **File Validation**: Automatic validation for file format, size, and requirements
- **Status Tracking**: Real-time status updates (Not Submitted, Pending, Approved, Rejected)
- **Rejection Handling**: View rejection reasons and resubmit corrected documents
- **Document Filters**: Filter by status, requirement type, and search by name
- **Conditional Rules Display**: View specific requirements for each document type

### 👤 Profile Management
- **Personal Information**: View and edit contact details
- **Academic Information**: Display program, course, and training role details
- **Avatar Management**: Upload and update profile picture
- **Account Status**: View enrollment date and account status

### 🔔 Notifications
- **Real-time Alerts**: Instant notifications for document approvals/rejections
- **Deadline Reminders**: Automated reminders for approaching deadlines
- **Notification Center**: Centralized view of all notifications with read/unread status
- **Action Links**: Direct links from notifications to relevant pages

### ⚙️ Settings
- **Notification Preferences**: Configure email and push notifications
- **Appearance**: Toggle dark mode and language settings
- **Security**: Password management and two-factor authentication
- **Privacy**: Account data download and deactivation options

### 💬 Help & Support
- **FAQ Section**: Comprehensive frequently asked questions
- **Contact Information**: Multiple contact channels (email, phone, live chat)
- **Support Form**: Submit questions and issues directly to support team
- **Quick Help Cards**: Fast access to guides and tutorials

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide Icons
- **State Management**: React Hooks

## Folder Structure

```
features/students/
├── components/
│   ├── dashboard/
│   │   ├── progress-overview.tsx        # Progress tracking component
│   │   ├── student-info-card.tsx        # Student info display
│   │   └── recent-activity.tsx          # Activity timeline
│   ├── documents/
│   │   ├── document-upload-card.tsx     # Upload interface
│   │   └── document-filter.tsx          # Filtering component
│   ├── layout/
│   │   ├── navbar.tsx                   # Main navigation bar
│   │   ├── sidebar.tsx                  # Desktop sidebar
│   │   └── mobile-sidebar.tsx           # Mobile navigation
│   └── notifications/
│       └── notification-center.tsx      # Notification dropdown
├── hooks/
│   └── use-student-data.ts              # Custom hook for data fetching
├── types.ts                             # TypeScript type definitions
└── README.md                            # This file

app/(students)/
├── layout.tsx                           # Student portal layout
└── students/
    ├── dashboard/
    │   └── page.tsx                     # Dashboard page
    ├── documents/
    │   └── page.tsx                     # Documents management page
    ├── profile/
    │   └── page.tsx                     # Profile page
    ├── help/
    │   └── page.tsx                     # Help & support page
    └── settings/
        └── page.tsx                     # Settings page
```

## Routes

| Route | Description |
|-------|-------------|
| `/students/dashboard` | Main dashboard with progress overview |
| `/students/documents` | Document upload and management |
| `/students/profile` | Student profile and information |
| `/students/help` | Help center and FAQs |
| `/students/settings` | Account settings and preferences |

## Document Types

The system supports the following document types:

1. **High School/College/University Diploma** (Required)
2. **ID Card / Passport** (Required)
3. **3x4 Photo** (Required)
   - White background
   - Recent (within 6 months)
   - Max 1MB
4. **TOEIC/IELTS Certificate** (Required)
   - Minimum TOEIC: 600
   - Valid for 2 years
5. **Medical Certificate** (Required)
   - Valid for 6 months
   - Aviation medical examiner
6. **Judicial Record** (Required)
   - Valid for 3 months
7. **Professional Certificate** (Optional)
8. **Guardian Consent** (Conditional)
   - Required if student < 18 years old

## Document Statuses

- **Not Submitted**: Document hasn't been uploaded yet
- **Submitted/Pending Review**: Document uploaded, awaiting admin review
- **Approved**: Document accepted by administrator
- **Rejected**: Document rejected with reason provided

## File Requirements

### Accepted Formats
- **Documents**: PDF
- **Images**: JPG, PNG

### Size Limits
- **PDF Files**: Maximum 5MB
- **Image Files**: Maximum 1MB

### Validation Rules
1. Format check (PDF/JPG/PNG)
2. Size validation
3. Virus scan (integrated with ClamAV API)
4. Conditional logic (TOEIC score, photo standards, etc.)

## Components

### ProgressOverview
Displays overall submission progress with:
- Completion percentage
- Document statistics
- Deadline countdown
- Status badges

### DocumentUploadCard
Individual document card with:
- Drag-and-drop upload
- File validation
- Status display
- Rejection reasons
- Resubmit functionality

### NotificationCenter
Notification dropdown with:
- Unread count badge
- Notification list
- Mark as read functionality
- Action links

### StudentInfoCard
Profile summary with:
- Avatar
- Personal details
- Contact information
- Academic information

## Custom Hooks

### useStudentData
```typescript
const {
  student,        // Student information
  documents,      // List of required documents
  progress,       // Submission progress data
  notifications,  // User notifications
  loading,        // Loading state
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = useStudentData();
```

## Type Definitions

Key TypeScript interfaces:

```typescript
interface StudentInfo {
  id: string;
  fullName: string;
  studentCode: string;
  email: string;
  phone: string;
  program: string;
  trainingRole: "Pilot" | "Cabin Crew" | "Maintenance" | "Other";
  courseCode: string;
  courseName: string;
}

interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  required: boolean;
  maxSize: number;
  allowedFormats: string[];
  conditionalRules?: string[];
}

interface SubmissionProgress {
  totalDocuments: number;
  submittedDocuments: number;
  approvedDocuments: number;
  rejectedDocuments: number;
  completionPercentage: number;
  deadline: Date;
  daysRemaining: number;
}
```

## Future Enhancements

- [ ] Real-time WebSocket notifications
- [ ] Document preview functionality
- [ ] Batch document upload
- [ ] Export document history
- [ ] Multi-language support (Vietnamese, English)
- [ ] Mobile app integration
- [ ] Progress analytics dashboard
- [ ] Document template downloads

## API Integration

Currently using mock data. To integrate with backend:

1. Replace mock data in `use-student-data.ts` with API calls
2. Implement upload handler in document upload component
3. Add authentication middleware
4. Configure API endpoints in environment variables

Example API endpoints:
- `GET /api/students/me` - Get student info
- `GET /api/students/documents` - Get document list
- `POST /api/students/documents/upload` - Upload document
- `GET /api/students/progress` - Get progress data
- `GET /api/students/notifications` - Get notifications

## Development

To run the student portal:

```bash
npm run dev
```

Navigate to `http://localhost:3000/students/dashboard`

## Support

For issues or questions, contact:
- **Email**: support@idmawa.edu.vn
- **Phone**: +84 123 456 789
- **Live Chat**: Available 8AM - 5PM

---

**Built with ❤️ for Aviation Academy Students**

