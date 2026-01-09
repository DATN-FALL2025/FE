# 📚 Documentation Index

**Last Updated:** December 31, 2025  
**Project:** Aviation Academy Management System

---

## 🎯 Quick Start

### For Developers
1. **API Integration:** Start with [API_DOCUMENTATION_2025.md](./API_DOCUMENTATION_2025.md)
2. **Migration Guide:** Read [API_MIGRATION_GUIDE.md](./API_MIGRATION_GUIDE.md)
3. **Usage Examples:** Check [api-use.md](./api-use.md)

### For New Team Members
1. **System Overview:** [FINAL_SUMMARY.md](./FINAL_SUMMARY.md)
2. **Use Cases:** [USE_CASES.md](./USE_CASES.md)
3. **Authentication:** [AUTH_SYSTEM.md](./AUTH_SYSTEM.md)

---

## 📖 Documentation Structure

### 🔴 Critical - Must Read

| File | Description | Status |
|------|-------------|--------|
| [API_DOCUMENTATION_2025.md](./API_DOCUMENTATION_2025.md) | **Complete API reference** - All endpoints, request/response formats | ✅ Current |
| [API_MIGRATION_GUIDE.md](./API_MIGRATION_GUIDE.md) | **Migration from Render to Railway** - URL updates, API changes | 🚨 Action Required |
| [api-use.md](./api-use.md) | **Server Actions usage guide** - How to use APIs in Next.js | ✅ Current |

---

### 🔐 Authentication & Security

| File | Description |
|------|-------------|
| [AUTH_SYSTEM.md](./AUTH_SYSTEM.md) | Complete authentication system guide - JWT, hooks, components |
| [ROLE_BASED_ACCESS_CONTROL.md](./ROLE_BASED_ACCESS_CONTROL.md) | RBAC implementation - Middleware, RoleGuard, permissions |
| [JWT_DECODING.md](./JWT_DECODING.md) | JWT token decoding implementation details |

---

### 📋 Business Logic & Workflows

| File | Description |
|------|-------------|
| [USE_CASES.md](./USE_CASES.md) | Complete use case documentation - All user stories |
| [document_submission_flow.md](./document_submission_flow.md) | Document submission workflow - Trainee → Staff → Approval |

---

### 🎨 UI & Frontend

| File | Description |
|------|-------------|
| [UI_IMPLEMENTATION.md](./UI_IMPLEMENTATION.md) | UI components and pages implementation |
| [UI_VIETNAMESE_TRANSLATION.md](./UI_VIETNAMESE_TRANSLATION.md) | Vietnamese translation guide |
| [DASHBOARD_GUIDE.md](./DASHBOARD_GUIDE.md) | Dashboard implementation guide |
| [TOAST_IMPLEMENTATION.md](./TOAST_IMPLEMENTATION.md) | Toast notifications setup |
| [TOAST_MIGRATION.md](./TOAST_MIGRATION.md) | Migration from alert() to toast |

---

### 👥 Role-Specific Implementation

| File | Description |
|------|-------------|
| [TRAINEE_FEATURES_IMPLEMENTATION.md](./TRAINEE_FEATURES_IMPLEMENTATION.md) | Trainee-specific features |
| [TRAINING_DIRECTOR_IMPLEMENTATION_SUMMARY.md](./TRAINING_DIRECTOR_IMPLEMENTATION_SUMMARY.md) | Training Director features |
| [TRAINING_DIRECTOR_MISSING_FEATURES.md](./TRAINING_DIRECTOR_MISSING_FEATURES.md) | Pending Training Director features |

---

### 🐛 Troubleshooting & Fixes

| File | Description |
|------|-------------|
| [DEBUG_FILE_UPLOAD.md](./DEBUG_FILE_UPLOAD.md) | File upload debugging guide |
| [HYDRATION_FIX.md](./HYDRATION_FIX.md) | Next.js hydration error fixes |

---

### 📊 Project Summaries

| File | Description |
|------|-------------|
| [FINAL_SUMMARY.md](./FINAL_SUMMARY.md) | Complete project implementation summary |
| [CLEANUP_RECOMMENDATIONS.md](./CLEANUP_RECOMMENDATIONS.md) | Documentation cleanup guide |

---

## 🗂️ Documentation by Role

### Admin
- [API_DOCUMENTATION_2025.md](./API_DOCUMENTATION_2025.md) - All admin endpoints
- [ROLE_BASED_ACCESS_CONTROL.md](./ROLE_BASED_ACCESS_CONTROL.md) - Admin permissions
- [UI_IMPLEMENTATION.md](./UI_IMPLEMENTATION.md) - Admin UI pages

### Trainee
- [TRAINEE_FEATURES_IMPLEMENTATION.md](./TRAINEE_FEATURES_IMPLEMENTATION.md)
- [document_submission_flow.md](./document_submission_flow.md)
- [API_DOCUMENTATION_2025.md](./API_DOCUMENTATION_2025.md) - Trainee submission APIs

### Training Director
- [TRAINING_DIRECTOR_IMPLEMENTATION_SUMMARY.md](./TRAINING_DIRECTOR_IMPLEMENTATION_SUMMARY.md)
- [TRAINING_DIRECTOR_MISSING_FEATURES.md](./TRAINING_DIRECTOR_MISSING_FEATURES.md)
- [API_DOCUMENTATION_2025.md](./API_DOCUMENTATION_2025.md) - Matrix management APIs

### Head of Department
- [document_submission_flow.md](./document_submission_flow.md)
- [API_DOCUMENTATION_2025.md](./API_DOCUMENTATION_2025.md) - Review & approval APIs

### Academic Staff
- [document_submission_flow.md](./document_submission_flow.md)
- [API_DOCUMENTATION_2025.md](./API_DOCUMENTATION_2025.md) - Staff APIs

---

## 🔄 Recent Changes

### December 31, 2025
- ✅ Created comprehensive API documentation (API_DOCUMENTATION_2025.md)
- ✅ Created migration guide for Railway server (API_MIGRATION_GUIDE.md)
- ✅ Cleaned up outdated documentation files
- ❌ Removed: api_note.md, API_PARAMS_UPDATE.md, TRAINEE_DOCUMENTS_API_UPDATE.md, MATRIX_API_NOTES.md
- ❌ Removed: TOAST_MIGRATION_NEEDED.md, IMPLEMENTATION_SUMMARY.md, TRAINEE_DOCUMENTS_UPDATE.md

---

## 📝 Documentation Standards

### File Naming Convention
- **UPPERCASE_WITH_UNDERSCORES.md** - Major documentation files
- **lowercase-with-dashes.md** - Specific feature/topic guides
- **API_*.md** - API-related documentation
- **UI_*.md** - UI/Frontend documentation

### Content Structure
1. **Title & Metadata** - Version, date, status
2. **Table of Contents** - For long documents
3. **Overview** - Brief description
4. **Main Content** - Detailed information
5. **Examples** - Code samples
6. **References** - Related documents

---

## 🚀 Getting Started Checklist

### For Backend Developers
- [ ] Read [API_DOCUMENTATION_2025.md](./API_DOCUMENTATION_2025.md)
- [ ] Follow [API_MIGRATION_GUIDE.md](./API_MIGRATION_GUIDE.md)
- [ ] Review [api-use.md](./api-use.md) for server actions
- [ ] Understand [AUTH_SYSTEM.md](./AUTH_SYSTEM.md)

### For Frontend Developers
- [ ] Read [UI_IMPLEMENTATION.md](./UI_IMPLEMENTATION.md)
- [ ] Review [DASHBOARD_GUIDE.md](./DASHBOARD_GUIDE.md)
- [ ] Check [TOAST_IMPLEMENTATION.md](./TOAST_IMPLEMENTATION.md)
- [ ] Understand [ROLE_BASED_ACCESS_CONTROL.md](./ROLE_BASED_ACCESS_CONTROL.md)

### For QA/Testing
- [ ] Review [USE_CASES.md](./USE_CASES.md)
- [ ] Understand [document_submission_flow.md](./document_submission_flow.md)
- [ ] Check [DEBUG_FILE_UPLOAD.md](./DEBUG_FILE_UPLOAD.md)

### For Project Managers
- [ ] Read [FINAL_SUMMARY.md](./FINAL_SUMMARY.md)
- [ ] Review [USE_CASES.md](./USE_CASES.md)
- [ ] Check [TRAINING_DIRECTOR_MISSING_FEATURES.md](./TRAINING_DIRECTOR_MISSING_FEATURES.md)

---

## 🔍 Finding Information

### API Endpoints
→ [API_DOCUMENTATION_2025.md](./API_DOCUMENTATION_2025.md)

### How to use APIs in code
→ [api-use.md](./api-use.md)

### Authentication & Login
→ [AUTH_SYSTEM.md](./AUTH_SYSTEM.md)

### User Permissions
→ [ROLE_BASED_ACCESS_CONTROL.md](./ROLE_BASED_ACCESS_CONTROL.md)

### UI Components
→ [UI_IMPLEMENTATION.md](./UI_IMPLEMENTATION.md)

### Business Requirements
→ [USE_CASES.md](./USE_CASES.md)

### Troubleshooting
→ [DEBUG_FILE_UPLOAD.md](./DEBUG_FILE_UPLOAD.md), [HYDRATION_FIX.md](./HYDRATION_FIX.md)

---

## 📞 Support

If documentation is unclear or missing:
1. Check related files in this index
2. Search for keywords in all docs
3. Review code comments in `lib/actions/`
4. Check API documentation at `/v3/api-docs`

---

## 🎯 Priority Reading Order

### Day 1 - Essential
1. [API_DOCUMENTATION_2025.md](./API_DOCUMENTATION_2025.md)
2. [AUTH_SYSTEM.md](./AUTH_SYSTEM.md)
3. [ROLE_BASED_ACCESS_CONTROL.md](./ROLE_BASED_ACCESS_CONTROL.md)

### Day 2 - Implementation
4. [api-use.md](./api-use.md)
5. [UI_IMPLEMENTATION.md](./UI_IMPLEMENTATION.md)
6. [document_submission_flow.md](./document_submission_flow.md)

### Day 3 - Advanced
7. [USE_CASES.md](./USE_CASES.md)
8. [TRAINING_DIRECTOR_IMPLEMENTATION_SUMMARY.md](./TRAINING_DIRECTOR_IMPLEMENTATION_SUMMARY.md)
9. [DEBUG_FILE_UPLOAD.md](./DEBUG_FILE_UPLOAD.md)

---

**Total Files:** 20  
**Last Cleanup:** December 31, 2025  
**Status:** ✅ Up to date
