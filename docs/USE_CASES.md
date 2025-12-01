# Use Case Documentation - Student Admission System

## Document Information
- **Version:** 1.0
- **Date:** November 30, 2025
- **Project:** Student Admission Support System

---

## Table of Contents
- [1. Authentication & Account Management](#1-authentication--account-management)
  - [1.1 Login](#11-login-uc-001)
  - [1.2 Logout](#12-logout-uc-002)
  - [1.3 Forgot Password](#13-forgot-password-uc-003)
  - [1.4 Change Password](#14-change-password-uc-004)
  - [1.5 Create Account](#15-create-account-uc-005)
  - [1.6 Update Account](#16-update-account-uc-006)
  - [1.7 Ban Account](#17-ban-account-uc-007)
  - [1.8 Unban Account](#18-unban-account-uc-008)
  - [1.9 View Account](#19-view-account-uc-009)
- [2. Department Management](#2-department-management)
  - [2.1 Create Department](#21-create-department-uc-010)
  - [2.2 Update Department](#22-update-department-uc-011)
  - [2.3 Delete Department](#23-delete-department-uc-012)
  - [2.4 View Department](#24-view-department-uc-013)
- [3. Rule Type Management](#3-rule-type-management)
  - [3.1 Create Rule Type](#31-create-rule-type-uc-014)
  - [3.2 Update Rule Type](#32-update-rule-type-uc-015)
  - [3.3 Delete Rule Type](#33-delete-rule-type-uc-016)
  - [3.4 View Rule Type](#34-view-rule-type-uc-017)
- [4. Document Management](#4-document-management)
  - [4.1 Create Document](#41-create-document-uc-018)
  - [4.2 Update Document](#42-update-document-uc-019)
  - [4.3 Delete Document](#43-delete-document-uc-020)
  - [4.4 View Document](#44-view-document-uc-021)
- [5. Profile Management](#5-profile-management)
  - [5.1 Update Profile](#51-update-profile-uc-022)
  - [5.2 View Profile](#52-view-profile-uc-023)
- [6. Academic Staff Affairs](#6-academic-staff-affairs)
  - [6.1 Send Reason](#61-send-reason-uc-024)
  - [6.2 Final Approve/Reject Document](#62-final-approvereject-document-uc-025)
- [7. Position Management](#7-position-management)
  - [7.1 Create Position](#71-create-position-uc-026)
  - [7.2 Update Position](#72-update-position-uc-027)
  - [7.3 Delete Position](#73-delete-position-uc-028)
  - [7.4 View Position](#74-view-position-uc-029)
- [8. Rule Values Management](#8-rule-values-management)
  - [8.1 Create Rule Values](#81-create-rule-values-uc-030)
  - [8.2 Update Rule Values](#82-update-rule-values-uc-031)
  - [8.3 Delete Rule Values](#83-delete-rule-values-uc-032)
  - [8.4 View Rule Values](#84-view-rule-values-uc-033)
- [9. Input Document Matrix Management](#9-input-document-matrix-management)
  - [9.1 View Input Document Matrix](#91-view-input-document-matrix-uc-034)
  - [9.2 Add Row (Position)](#92-add-row-position-uc-035)
  - [9.3 Add Column (Document)](#93-add-column-document-uc-036)
  - [9.4 Delete Row (Position)](#94-delete-row-position-uc-037)
  - [9.5 Delete Column (Document)](#95-delete-column-document-uc-038)
- [10. Result Management](#10-result-management)
  - [10.1 View Result](#101-view-result-uc-039)

---

## 1. Authentication & Account Management

### 1.1 Login [UC-001]

**Actors:** Student, Head of Department, Input Document Manager, Admin

**Description:** Users log in to the system by entering their credentials to access their respective functionalities based on their role.

**Preconditions:**
- User must have a valid account
- Account must not be banned

**Main Flow:**
1. User navigates to the login page
2. System displays login form
3. User enters email/username and password
4. User clicks "Login" button
5. System validates credentials
6. System verifies account status (not banned)
7. System generates authentication token (JWT)
8. System redirects user to appropriate dashboard based on role
9. Use case ends

**Alternative Flows:**

**A1: Invalid Credentials**
- 5a. System detects invalid credentials
  - 5a1. System displays error message "Invalid email/password"
  - 5a2. User returns to step 3

**A2: Banned Account**
- 6a. System detects account is banned
  - 6a1. System displays error message "Account has been suspended"
  - 6a2. Use case ends

**Postconditions:**
- User is authenticated and has active session
- User is redirected to role-appropriate dashboard

---

### 1.2 Logout [UC-002]

**Actors:** Student, Head of Department, Input Document Manager, Admin

**Description:** Users sign out to end their session securely.

**Preconditions:**
- User must be logged in

**Main Flow:**
1. User clicks "Logout" button
2. System invalidates user session
3. System clears authentication token
4. System redirects user to login page
5. Use case ends

**Postconditions:**
- User session is terminated
- Authentication token is cleared
- User is logged out

---

### 1.3 Forgot Password [UC-003]

**Actors:** Student, Head of Department, Input Document Manager, Admin

**Description:** Provides a way for users to reset their password if forgotten.

**Preconditions:**
- User must have a registered email in the system

**Main Flow:**
1. User clicks "Forgot Password" link on login page
2. System displays password reset form
3. User enters registered email address
4. User clicks "Send Reset Link" button
5. System validates email exists in database
6. System generates password reset token
7. System sends reset link to user's email
8. System displays confirmation message
9. User clicks reset link from email
10. System validates reset token
11. System displays new password form
12. User enters new password and confirmation
13. System validates password strength
14. System updates password in database
15. System displays success message
16. Use case ends

**Alternative Flows:**

**A1: Email Not Found**
- 5a. System cannot find email in database
  - 5a1. System displays error message "Email not registered"
  - 5a2. User returns to step 3

**A2: Invalid/Expired Token**
- 10a. System detects invalid or expired token
  - 10a1. System displays error message "Reset link is invalid or expired"
  - 10a2. Use case ends

**A3: Weak Password**
- 13a. System detects password doesn't meet requirements
  - 13a1. System displays error message with password requirements
  - 13a2. User returns to step 12

**Postconditions:**
- User password is successfully reset
- Old password is no longer valid

---

### 1.4 Change Password [UC-004]

**Actors:** Guest, Student, Head of Department, Input Document Manager, Admin

**Description:** Allows users to update their password for security purposes.

**Preconditions:**
- User must be logged in (except Guest)

**Main Flow:**
1. User navigates to profile settings
2. System displays profile page
3. User clicks "Change Password" option
4. System displays password change form
5. User enters current password
6. User enters new password
7. User confirms new password
8. User clicks "Update Password" button
9. System validates current password
10. System validates new password strength
11. System verifies password confirmation matches
12. System updates password in database
13. System displays success message
14. Use case ends

**Alternative Flows:**

**A1: Incorrect Current Password**
- 9a. System detects current password is incorrect
  - 9a1. System displays error message "Current password is incorrect"
  - 9a2. User returns to step 5

**A2: Weak New Password**
- 10a. System detects password doesn't meet requirements
  - 10a1. System displays error message with password requirements
  - 10a2. User returns to step 6

**A3: Password Mismatch**
- 11a. System detects confirmation doesn't match new password
  - 11a1. System displays error message "Passwords do not match"
  - 11a2. User returns to step 6

**Postconditions:**
- User password is successfully changed
- Old password is no longer valid

---

### 1.5 Create Account [UC-005]

**Actors:** Admin

**Description:** Admin creates a new system account for users with assigned roles.

**Preconditions:**
- Admin must be logged in
- Admin must have account creation permissions

**Main Flow:**
1. Admin navigates to account management section
2. System displays account list
3. Admin clicks "Create New Account" button
4. System displays account creation form
5. Admin enters user information (name, email, role, department)
6. Admin sets initial password
7. Admin clicks "Create Account" button
8. System validates email uniqueness
9. System validates required fields
10. System creates new account in database
11. System sends welcome email with credentials
12. System displays success message
13. Use case ends

**Alternative Flows:**

**A1: Email Already Exists**
- 8a. System detects email already registered
  - 8a1. System displays error message "Email already exists"
  - 8a2. Admin returns to step 5

**A2: Missing Required Fields**
- 9a. System detects missing required information
  - 9a1. System displays error message indicating missing fields
  - 9a2. Admin returns to step 5

**Postconditions:**
- New user account is created
- Welcome email is sent to user
- Account appears in account list

---

### 1.6 Update Account [UC-006]

**Actors:** Admin

**Description:** Admin modifies details of an existing account.

**Preconditions:**
- Admin must be logged in
- Target account must exist

**Main Flow:**
1. Admin navigates to account management section
2. System displays list of accounts
3. Admin selects account to update
4. System displays account details form
5. Admin modifies account information
6. Admin clicks "Update Account" button
7. System validates changes
8. System updates account in database
9. System displays success message
10. Use case ends

**Alternative Flows:**

**A1: Email Already Used by Another Account**
- 7a. System detects email conflict
  - 7a1. System displays error message "Email already in use"
  - 7a2. Admin returns to step 5

**A2: Invalid Role Assignment**
- 7a. System detects invalid role for user's department
  - 7a1. System displays error message
  - 7a2. Admin returns to step 5

**Postconditions:**
- Account information is updated
- Changes are reflected in the system

---

### 1.7 Ban Account [UC-007]

**Actors:** Admin

**Description:** Admin suspends a user's account due to policy violations.

**Preconditions:**
- Admin must be logged in
- Target account must exist and be active

**Main Flow:**
1. Admin navigates to account management section
2. System displays list of accounts
3. Admin selects account to ban
4. System displays account details
5. Admin clicks "Ban Account" button
6. System prompts for ban reason
7. Admin enters ban reason
8. Admin confirms ban action
9. System updates account status to "banned"
10. System logs ban action with timestamp and reason
11. System sends notification email to user
12. System displays success message
13. Use case ends

**Alternative Flows:**

**A1: Account Already Banned**
- 9a. System detects account is already banned
  - 9a1. System displays message "Account is already banned"
  - 9a2. Use case ends

**Postconditions:**
- Account status is set to banned
- User cannot log in
- Ban action is logged in audit trail

---

### 1.8 Unban Account [UC-008]

**Actors:** Admin

**Description:** Admin reactivates a previously banned account.

**Preconditions:**
- Admin must be logged in
- Target account must be banned

**Main Flow:**
1. Admin navigates to account management section
2. System displays list of accounts (filter by banned)
3. Admin selects banned account
4. System displays account details with ban information
5. Admin clicks "Unban Account" button
6. System prompts for unban reason
7. Admin enters unban reason
8. Admin confirms unban action
9. System updates account status to "active"
10. System logs unban action with timestamp and reason
11. System sends reactivation email to user
12. System displays success message
13. Use case ends

**Alternative Flows:**

**A1: Account Not Banned**
- 9a. System detects account is not banned
  - 9a1. System displays message "Account is not banned"
  - 9a2. Use case ends

**Postconditions:**
- Account status is set to active
- User can log in again
- Unban action is logged in audit trail

---

### 1.9 View Account [UC-009]

**Actors:** Admin

**Description:** Admin views detailed information about system accounts.

**Preconditions:**
- Admin must be logged in

**Main Flow:**
1. Admin navigates to account management section
2. System displays list of accounts with basic information
3. Admin can filter/search accounts by various criteria
4. Admin selects specific account
5. System displays comprehensive account details including:
   - Personal information
   - Role and permissions
   - Account status
   - Creation date
   - Last login
   - Activity history
   - Ban/unban history (if applicable)
6. Use case ends

**Alternative Flows:**

**A1: No Accounts Found**
- 2a. System has no accounts matching criteria
  - 2a1. System displays "No accounts found"
  - 2a2. Use case ends

**Postconditions:**
- Admin has viewed account information
- No changes to account data

---

## 2. Department Management

### 2.1 Create Department [UC-010]

**Actors:** Admin

**Description:** Admin adds a new department to the system for organizational structure.

**Preconditions:**
- Admin must be logged in
- Admin must have department management permissions

**Main Flow:**
1. Admin navigates to department management section
2. System displays list of existing departments
3. Admin clicks "Create Department" button
4. System displays department creation form
5. Admin enters department information:
   - Department name
   - Department code
   - Description
   - Head of Department (optional)
6. Admin clicks "Create" button
7. System validates department code uniqueness
8. System validates required fields
9. System creates department in database
10. System displays success message
11. Use case ends

**Alternative Flows:**

**A1: Duplicate Department Code**
- 7a. System detects department code already exists
  - 7a1. System displays error "Department code already exists"
  - 7a2. Admin returns to step 5

**A2: Missing Required Fields**
- 8a. System detects missing required information
  - 8a1. System highlights missing fields
  - 8a2. Admin returns to step 5

**Postconditions:**
- New department is created
- Department appears in department list
- Department is available for user assignment

---

### 2.2 Update Department [UC-011]

**Actors:** Admin

**Description:** Admin edits details of an existing department.

**Preconditions:**
- Admin must be logged in
- Target department must exist

**Main Flow:**
1. Admin navigates to department management section
2. System displays list of departments
3. Admin selects department to update
4. System displays department details form
5. Admin modifies department information
6. Admin clicks "Update" button
7. System validates changes
8. System updates department in database
9. System displays success message
10. Use case ends

**Alternative Flows:**

**A1: Department Code Conflict**
- 7a. System detects code conflict with another department
  - 7a1. System displays error message
  - 7a2. Admin returns to step 5

**A2: Department Has Active Users**
- 7a. Admin attempts to change critical info while users are assigned
  - 7a1. System displays warning about affected users
  - 7a2. Admin confirms or cancels update
  - 7a3. If confirmed, system proceeds to step 8

**Postconditions:**
- Department information is updated
- Changes are reflected throughout the system

---

### 2.3 Delete Department [UC-012]

**Actors:** Admin

**Description:** Admin removes a department from the system.

**Preconditions:**
- Admin must be logged in
- Target department must exist

**Main Flow:**
1. Admin navigates to department management section
2. System displays list of departments
3. Admin selects department to delete
4. System displays department details
5. Admin clicks "Delete" button
6. System checks for dependencies (users, positions, rules)
7. System displays confirmation dialog with dependency information
8. Admin confirms deletion
9. System removes department from database
10. System displays success message
11. Use case ends

**Alternative Flows:**

**A1: Department Has Dependencies**
- 6a. System detects users or data linked to department
  - 6a1. System displays error "Cannot delete department with active users/data"
  - 6a2. System suggests reassigning users first
  - 6a3. Use case ends

**A2: Admin Cancels Deletion**
- 8a. Admin clicks "Cancel"
  - 8a1. System returns to department list
  - 8a2. Use case ends

**Postconditions:**
- Department is removed from system
- Department no longer appears in lists

---

### 2.4 View Department [UC-013]

**Actors:** Admin

**Description:** Admin views detailed information about departments.

**Preconditions:**
- Admin must be logged in

**Main Flow:**
1. Admin navigates to department management section
2. System displays list of departments
3. Admin can filter/search departments
4. Admin selects specific department
5. System displays department details including:
   - Basic information
   - Head of Department
   - Number of assigned users
   - Associated positions
   - Associated rules
   - Creation and modification history
6. Use case ends

**Postconditions:**
- Admin has viewed department information
- No changes to department data

---

## 3. Rule Type Management

### 3.1 Create Rule Type [UC-014]

**Actors:** Admin

**Description:** Admin defines a new type of admission rule in the system.

**Preconditions:**
- Admin must be logged in
- Admin must have rule management permissions

**Main Flow:**
1. Admin navigates to rule type management section
2. System displays list of existing rule types
3. Admin clicks "Create Rule Type" button
4. System displays rule type creation form
5. Admin enters rule type information:
   - Rule type name
   - Rule type code
   - Description
   - Data type (number, text, boolean, etc.)
   - Validation rules
6. Admin clicks "Create" button
7. System validates rule type code uniqueness
8. System validates required fields
9. System creates rule type in database
10. System displays success message
11. Use case ends

**Alternative Flows:**

**A1: Duplicate Rule Type Code**
- 7a. System detects rule type code already exists
  - 7a1. System displays error "Rule type code already exists"
  - 7a2. Admin returns to step 5

**A2: Invalid Data Type**
- 7a. System detects invalid data type configuration
  - 7a1. System displays error message
  - 7a2. Admin returns to step 5

**Postconditions:**
- New rule type is created
- Rule type is available for rule values creation

---

### 3.2 Update Rule Type [UC-015]

**Actors:** Admin

**Description:** Admin edits rule type information.

**Preconditions:**
- Admin must be logged in
- Target rule type must exist

**Main Flow:**
1. Admin navigates to rule type management section
2. System displays list of rule types
3. Admin selects rule type to update
4. System displays rule type details form
5. Admin modifies rule type information
6. Admin clicks "Update" button
7. System validates changes
8. System checks impact on existing rule values
9. System updates rule type in database
10. System displays success message
11. Use case ends

**Alternative Flows:**

**A1: Breaking Changes Detected**
- 8a. System detects changes that affect existing rule values
  - 8a1. System displays warning about affected rule values
  - 8a2. Admin confirms or cancels update
  - 8a3. If confirmed, system proceeds to step 9

**Postconditions:**
- Rule type information is updated
- Existing rule values remain compatible or are flagged for review

---

### 3.3 Delete Rule Type [UC-016]

**Actors:** Admin

**Description:** Admin deletes an existing rule type.

**Preconditions:**
- Admin must be logged in
- Target rule type must exist

**Main Flow:**
1. Admin navigates to rule type management section
2. System displays list of rule types
3. Admin selects rule type to delete
4. System displays rule type details
5. Admin clicks "Delete" button
6. System checks for dependencies (rule values using this type)
7. System displays confirmation dialog
8. Admin confirms deletion
9. System removes rule type from database
10. System displays success message
11. Use case ends

**Alternative Flows:**

**A1: Rule Type Has Dependencies**
- 6a. System detects rule values using this type
  - 6a1. System displays error "Cannot delete rule type in use"
  - 6a2. System shows list of dependent rule values
  - 6a3. Use case ends

**Postconditions:**
- Rule type is removed from system
- Rule type no longer available for new rule values

---

### 3.4 View Rule Type [UC-017]

**Actors:** Admin

**Description:** Admin views detailed information about rule types.

**Preconditions:**
- Admin must be logged in

**Main Flow:**
1. Admin navigates to rule type management section
2. System displays list of rule types
3. Admin can filter/search rule types
4. Admin selects specific rule type
5. System displays rule type details including:
   - Basic information
   - Data type configuration
   - Validation rules
   - Number of rule values using this type
   - Usage in departments
6. Use case ends

**Postconditions:**
- Admin has viewed rule type information
- No changes to rule type data

---

## 4. Document Management

### 4.1 Create Document [UC-018]

**Actors:** Admin

**Description:** Admin creates a new document type in the system for admission requirements.

**Preconditions:**
- Admin must be logged in
- Admin must have document management permissions

**Main Flow:**
1. Admin navigates to document management section
2. System displays list of existing documents
3. Admin clicks "Create Document" button
4. System displays document creation form
5. Admin enters document information:
   - Document name
   - Document code
   - Description
   - Category
   - Required format
6. Admin clicks "Create" button
7. System validates document code uniqueness
8. System validates required fields
9. System creates document in database
10. System displays success message
11. Use case ends

**Alternative Flows:**

**A1: Duplicate Document Code**
- 7a. System detects document code already exists
  - 7a1. System displays error "Document code already exists"
  - 7a2. Admin returns to step 5

**Postconditions:**
- New document type is created
- Document is available for matrix configuration

---

### 4.2 Update Document [UC-019]

**Actors:** Admin

**Description:** Admin updates document type details.

**Preconditions:**
- Admin must be logged in
- Target document must exist

**Main Flow:**
1. Admin navigates to document management section
2. System displays list of documents
3. Admin selects document to update
4. System displays document details form
5. Admin modifies document information
6. Admin clicks "Update" button
7. System validates changes
8. System updates document in database
9. System displays success message
10. Use case ends

**Alternative Flows:**

**A1: Document Code Conflict**
- 7a. System detects code conflict with another document
  - 7a1. System displays error message
  - 7a2. Admin returns to step 5

**Postconditions:**
- Document information is updated
- Changes are reflected in matrix and submission forms

---

### 4.3 Delete Document [UC-020]

**Actors:** Admin

**Description:** Admin deletes a document type from the system.

**Preconditions:**
- Admin must be logged in
- Target document must exist

**Main Flow:**
1. Admin navigates to document management section
2. System displays list of documents
3. Admin selects document to delete
4. System displays document details
5. Admin clicks "Delete" button
6. System checks for dependencies (matrix entries, submissions)
7. System displays confirmation dialog
8. Admin confirms deletion
9. System removes document from database
10. System displays success message
11. Use case ends

**Alternative Flows:**

**A1: Document Has Dependencies**
- 6a. System detects document is used in matrix or has submissions
  - 6a1. System displays error "Cannot delete document in use"
  - 6a2. System shows dependency details
  - 6a3. Use case ends

**Postconditions:**
- Document type is removed from system
- Document no longer available in matrix

---

### 4.4 View Document [UC-021]

**Actors:** Admin

**Description:** Admin views detailed information about document types.

**Preconditions:**
- Admin must be logged in

**Main Flow:**
1. Admin navigates to document management section
2. System displays list of documents
3. Admin can filter/search documents
4. Admin selects specific document
5. System displays document details including:
   - Basic information
   - Category and format requirements
   - Positions requiring this document
   - Number of submissions
6. Use case ends

**Postconditions:**
- Admin has viewed document information
- No changes to document data

---

## 5. Profile Management

### 5.1 Update Profile [UC-022]

**Actors:** Admin, Student, Input Document Manager, Head of Department

**Description:** Users update their personal profile information.

**Preconditions:**
- User must be logged in

**Main Flow:**
1. User navigates to profile page
2. System displays current profile information
3. User clicks "Edit Profile" button
4. System displays editable profile form
5. User modifies information (name, phone, address, etc.)
6. User uploads new profile picture (optional)
7. User clicks "Save Changes" button
8. System validates updated information
9. System updates profile in database
10. System displays success message
11. Use case ends

**Alternative Flows:**

**A1: Invalid Phone Number Format**
- 8a. System detects invalid phone format
  - 8a1. System displays error message
  - 8a2. User returns to step 5

**A2: Image Upload Fails**
- 6a. System cannot process uploaded image
  - 6a1. System displays error "Invalid image format or size"
  - 6a2. User returns to step 6

**Postconditions:**
- User profile is updated
- Changes are visible across the system

---

### 5.2 View Profile [UC-023]

**Actors:** Admin, Student, Input Document Manager, Head of Department

**Description:** Users view their own profile information.

**Preconditions:**
- User must be logged in

**Main Flow:**
1. User navigates to profile page
2. System retrieves user profile data
3. System displays profile information including:
   - Personal details
   - Contact information
   - Role and department
   - Account status
   - Profile picture
4. Use case ends

**Postconditions:**
- User has viewed their profile
- No changes to profile data

---

## 6. Academic Staff Affairs

### 6.1 Send Reason [UC-024]

**Actors:** Academic Staff Affair

**Description:** Academic Staff Affair sends reasons for rejection or requests additional information from students.

**Preconditions:**
- Academic Staff Affair must be logged in
- Student application must exist

**Main Flow:**
1. Academic Staff navigates to student applications
2. System displays list of applications
3. Academic Staff selects specific application
4. System displays application details
5. Academic Staff clicks "Send Reason" button
6. System displays reason form
7. Academic Staff selects reason type (rejection/request info)
8. Academic Staff enters detailed message
9. Academic Staff clicks "Send" button
10. System validates message
11. System saves reason in database
12. System sends notification to student
13. System updates application status
14. System displays success message
15. Use case ends

**Alternative Flows:**

**A1: Empty Message**
- 10a. System detects empty message field
  - 10a1. System displays error "Please enter a reason"
  - 10a2. Academic Staff returns to step 8

**Postconditions:**
- Reason is recorded in system
- Student receives notification
- Application status is updated

---

### 6.2 Final Approve/Reject Document [UC-025]

**Actors:** Academic Staff Affair

**Description:** Academic Staff Affair makes final decision to approve or reject student admission profile.

**Preconditions:**
- Academic Staff Affair must be logged in
- Student application must be complete and reviewed

**Main Flow:**
1. Academic Staff navigates to pending applications
2. System displays applications ready for final decision
3. Academic Staff selects application to review
4. System displays complete application with all documents
5. Academic Staff reviews all information and documents
6. Academic Staff clicks "Approve" or "Reject" button
7. If rejecting, system prompts for rejection reason
8. Academic Staff confirms decision
9. System updates application status
10. System records decision with timestamp
11. System sends notification to student
12. System generates admission letter (if approved) or rejection letter
13. System displays success message
14. Use case ends

**Alternative Flows:**

**A1: Missing Documents**
- 5a. Academic Staff identifies missing required documents
  - 5a1. Academic Staff uses "Send Reason" instead
  - 5a2. Use case ends

**A2: Rejection Requires Reason**
- 7a. Academic Staff selects "Reject" but provides no reason
  - 7a1. System displays error "Please provide rejection reason"
  - 7a2. Academic Staff returns to step 7

**Postconditions:**
- Application has final decision
- Student is notified
- Admission/rejection letter is generated
- Application cannot be modified

---

## 7. Position Management

### 7.1 Create Position [UC-026]

**Actors:** Head of Department

**Description:** Head of Department creates a new admission position for their department.

**Preconditions:**
- Head of Department must be logged in
- User must be assigned as head of a department

**Main Flow:**
1. Head of Department navigates to position management
2. System displays existing positions for their department
3. Head of Department clicks "Create Position" button
4. System displays position creation form
5. Head of Department enters position information:
   - Position name
   - Position code
   - Description
   - Number of slots available
   - Academic year
6. Head of Department clicks "Create" button
7. System validates position code uniqueness within department
8. System validates required fields
9. System creates position in database
10. System displays success message
11. Use case ends

**Alternative Flows:**

**A1: Duplicate Position Code**
- 7a. System detects position code already exists in department
  - 7a1. System displays error "Position code already exists"
  - 7a2. Head of Department returns to step 5

**A2: Invalid Slot Number**
- 7a. System detects invalid or negative slot number
  - 7a1. System displays error "Please enter valid number of slots"
  - 7a2. Head of Department returns to step 5

**Postconditions:**
- New position is created
- Position is available in input document matrix
- Position can accept student applications

---

### 7.2 Update Position [UC-027]

**Actors:** Head of Department

**Description:** Head of Department edits position details.

**Preconditions:**
- Head of Department must be logged in
- Position must exist in their department

**Main Flow:**
1. Head of Department navigates to position management
2. System displays positions for their department
3. Head of Department selects position to update
4. System displays position details form
5. Head of Department modifies position information
6. Head of Department clicks "Update" button
7. System validates changes
8. System updates position in database
9. System displays success message
10. Use case ends

**Alternative Flows:**

**A1: Cannot Reduce Slots Below Applications**
- 7a. System detects slot reduction would exceed accepted applications
  - 7a1. System displays error "Cannot reduce slots below current applications"
  - 7a2. Head of Department returns to step 5

**Postconditions:**
- Position information is updated
- Changes are reflected in matrix and applications

---

### 7.3 Delete Position [UC-028]

**Actors:** Head of Department

**Description:** Head of Department deletes a position.

**Preconditions:**
- Head of Department must be logged in
- Position must exist in their department

**Main Flow:**
1. Head of Department navigates to position management
2. System displays positions for their department
3. Head of Department selects position to delete
4. System displays position details
5. Head of Department clicks "Delete" button
6. System checks for dependencies (applications, matrix entries)
7. System displays confirmation dialog
8. Head of Department confirms deletion
9. System removes position from database
10. System displays success message
11. Use case ends

**Alternative Flows:**

**A1: Position Has Applications**
- 6a. System detects existing applications for position
  - 6a1. System displays error "Cannot delete position with applications"
  - 6a2. System shows number of applications
  - 6a3. Use case ends

**Postconditions:**
- Position is removed from system
- Position removed from input document matrix

---

### 7.4 View Position [UC-029]

**Actors:** Head of Department

**Description:** Head of Department views position information.

**Preconditions:**
- Head of Department must be logged in

**Main Flow:**
1. Head of Department navigates to position management
2. System displays positions for their department
3. Head of Department can filter/search positions
4. Head of Department selects specific position
5. System displays position details including:
   - Basic information
   - Number of slots and applications
   - Required documents
   - Associated rules
   - Application statistics
6. Use case ends

**Postconditions:**
- Head of Department has viewed position information
- No changes to position data

---

## 8. Rule Values Management

### 8.1 Create Rule Values [UC-030]

**Actors:** Head of Department

**Description:** Head of Department creates specific rule values for admission criteria in their department.

**Preconditions:**
- Head of Department must be logged in
- Rule types must exist in the system

**Main Flow:**
1. Head of Department navigates to rule values management
2. System displays existing rule values for their department
3. Head of Department clicks "Create Rule Value" button
4. System displays rule value creation form
5. Head of Department selects rule type
6. System displays appropriate input fields based on rule type
7. Head of Department enters:
   - Rule name
   - Rule value (number/text based on type)
   - Position (if applicable)
   - Academic year
8. Head of Department clicks "Create" button
9. System validates rule value format
10. System validates rule constraints
11. System creates rule value in database
12. System displays success message
13. Use case ends

**Alternative Flows:**

**A1: Invalid Rule Value Format**
- 9a. System detects value doesn't match rule type
  - 9a1. System displays error "Invalid value format"
  - 9a2. Head of Department returns to step 7

**A2: Duplicate Rule for Position**
- 10a. System detects duplicate rule assignment
  - 10a1. System displays error "Rule already exists for this position"
  - 10a2. Head of Department returns to step 7

**Postconditions:**
- New rule value is created
- Rule is applied to student evaluation

---

### 8.2 Update Rule Values [UC-031]

**Actors:** Head of Department

**Description:** Head of Department updates existing rule values.

**Preconditions:**
- Head of Department must be logged in
- Rule value must exist in their department

**Main Flow:**
1. Head of Department navigates to rule values management
2. System displays rule values for their department
3. Head of Department selects rule to update
4. System displays rule value details form
5. Head of Department modifies rule value
6. Head of Department clicks "Update" button
7. System validates changes
8. System updates rule value in database
9. System recalculates affected student evaluations
10. System displays success message
11. Use case ends

**Alternative Flows:**

**A1: Invalid New Value**
- 7a. System detects invalid value format
  - 7a1. System displays error message
  - 7a2. Head of Department returns to step 5

**Postconditions:**
- Rule value is updated
- Student evaluations are recalculated

---

### 8.3 Delete Rule Values [UC-032]

**Actors:** Head of Department

**Description:** Head of Department deletes a rule value.

**Preconditions:**
- Head of Department must be logged in
- Rule value must exist in their department

**Main Flow:**
1. Head of Department navigates to rule values management
2. System displays rule values for their department
3. Head of Department selects rule to delete
4. System displays rule details
5. Head of Department clicks "Delete" button
6. System checks impact on student evaluations
7. System displays confirmation dialog with impact details
8. Head of Department confirms deletion
9. System removes rule value from database
10. System recalculates affected student evaluations
11. System displays success message
12. Use case ends

**Alternative Flows:**

**A1: Critical Rule Cannot Be Deleted**
- 6a. System detects rule is critical for admission process
  - 6a1. System displays error "Cannot delete required rule"
  - 6a2. Use case ends

**Postconditions:**
- Rule value is removed
- Student evaluations are recalculated without this rule

---

### 8.4 View Rule Values [UC-033]

**Actors:** Head of Department

**Description:** Head of Department views rule value information.

**Preconditions:**
- Head of Department must be logged in

**Main Flow:**
1. Head of Department navigates to rule values management
2. System displays rule values for their department
3. Head of Department can filter by rule type, position, year
4. Head of Department selects specific rule
5. System displays rule details including:
   - Rule type and value
   - Associated position
   - Academic year
   - Number of students affected
   - Creation and modification history
6. Use case ends

**Postconditions:**
- Head of Department has viewed rule information
- No changes to rule data

---

## 9. Input Document Matrix Management

### 9.1 View Input Document Matrix [UC-034]

**Actors:** Head of Department, Trainee, Admin, Academic Staff Affair, Guest

**Description:** Users view the input document matrix showing document requirements for each position.

**Preconditions:**
- None (available to all user types including guests)

**Main Flow:**
1. User navigates to input document matrix page
2. System retrieves matrix data for selected department/year
3. System displays matrix with:
   - Rows representing positions
   - Columns representing documents
   - Cells showing requirement status (required/optional/not required)
4. User can filter by department or academic year
5. User can view document details by clicking document name
6. User can view position details by clicking position name
7. Use case ends

**Alternative Flows:**

**A1: No Matrix Data**
- 2a. System has no matrix configured
  - 2a1. System displays "No matrix data available"
  - 2a2. Use case ends

**Postconditions:**
- User has viewed matrix information
- No changes to matrix data

---

### 9.2 Add Row (Position) [UC-035]

**Actors:** Training Director

**Description:** Training Director adds a position (row) to the input document matrix.

**Preconditions:**
- Training Director must be logged in
- Position must exist in the system

**Main Flow:**
1. Training Director navigates to matrix management
2. System displays current matrix
3. Training Director clicks "Add Row" button
4. System displays position selection dialog
5. Training Director selects position from available positions
6. Training Director sets default document requirements
7. Training Director clicks "Add" button
8. System validates position not already in matrix
9. System adds new row to matrix
10. System displays success message
11. Use case ends

**Alternative Flows:**

**A1: Position Already in Matrix**
- 8a. System detects position already exists in matrix
  - 8a1. System displays error "Position already in matrix"
  - 8a2. Training Director returns to step 5

**Postconditions:**
- New row is added to matrix
- Position document requirements are configured

---

### 9.3 Add Column (Document) [UC-036]

**Actors:** Training Director

**Description:** Training Director adds a document (column) to the input document matrix.

**Preconditions:**
- Training Director must be logged in
- Document type must exist in the system

**Main Flow:**
1. Training Director navigates to matrix management
2. System displays current matrix
3. Training Director clicks "Add Column" button
4. System displays document selection dialog
5. Training Director selects document from available documents
6. Training Director sets default requirement status for positions
7. Training Director clicks "Add" button
8. System validates document not already in matrix
9. System adds new column to matrix
10. System displays success message
11. Use case ends

**Alternative Flows:**

**A1: Document Already in Matrix**
- 8a. System detects document already exists in matrix
  - 8a1. System displays error "Document already in matrix"
  - 8a2. Training Director returns to step 5

**Postconditions:**
- New column is added to matrix
- Document requirements are set for all positions

---

### 9.4 Delete Row (Position) [UC-037]

**Actors:** Training Director

**Description:** Training Director removes a position (row) from the input document matrix.

**Preconditions:**
- Training Director must be logged in
- Position row must exist in matrix

**Main Flow:**
1. Training Director navigates to matrix management
2. System displays current matrix
3. Training Director selects row to delete
4. Training Director clicks "Delete Row" button
5. System checks for dependencies (applications using this position)
6. System displays confirmation dialog
7. Training Director confirms deletion
8. System removes row from matrix
9. System displays success message
10. Use case ends

**Alternative Flows:**

**A1: Position Has Applications**
- 5a. System detects applications for this position
  - 5a1. System displays error "Cannot remove position with applications"
  - 5a2. Use case ends

**Postconditions:**
- Row is removed from matrix
- Position document requirements are cleared

---

### 9.5 Delete Column (Document) [UC-038]

**Actors:** Training Director

**Description:** Training Director removes a document (column) from the input document matrix.

**Preconditions:**
- Training Director must be logged in
- Document column must exist in matrix

**Main Flow:**
1. Training Director navigates to matrix management
2. System displays current matrix
3. Training Director selects column to delete
4. Training Director clicks "Delete Column" button
5. System checks for dependencies (submitted documents)
6. System displays confirmation dialog
7. Training Director confirms deletion
8. System removes column from matrix
9. System displays success message
10. Use case ends

**Alternative Flows:**

**A1: Document Has Submissions**
- 5a. System detects submitted documents of this type
  - 5a1. System displays error "Cannot remove document with submissions"
  - 5a2. Use case ends

**Postconditions:**
- Column is removed from matrix
- Document is no longer required for any position

---

## 10. Result Management

### 10.1 View Result [UC-039]

**Actors:** Head of Department, Admin

**Description:** Head of Department or Admin views student admission results and statistics.

**Preconditions:**
- User must be logged in
- User must have appropriate permissions

**Main Flow:**
1. User navigates to results section
2. System displays result filters (department, year, status)
3. User selects filter criteria
4. User clicks "View Results" button
5. System retrieves filtered results
6. System displays results including:
   - Student information
   - Applied position
   - Application status
   - Evaluation scores
   - Final decision
   - Decision date
7. User can export results to various formats (PDF, Excel)
8. User can view detailed result for specific student
9. Use case ends

**Alternative Flows:**

**A1: No Results Found**
- 5a. System finds no results matching criteria
  - 5a1. System displays "No results found"
  - 5a2. User returns to step 3

**A2: Export Results**
- 7a. User clicks "Export" button
  - 7a1. System prompts for export format
  - 7a2. User selects format
  - 7a3. System generates export file
  - 7a4. System downloads file
  - 7a5. Use case continues at step 8

**Postconditions:**
- User has viewed admission results
- Export file generated if requested
- No changes to result data

---

## Actors Summary

| Actor | Description |
|-------|-------------|
| **Student** | Applicants applying for admission positions |
| **Head of Department** | Manages department-specific positions, rules, and requirements |
| **Input Document Manager** | Manages document types and matrix configuration |
| **Admin** | System administrator with full access to all management functions |
| **Academic Staff Affair** | Reviews and makes final decisions on student applications |
| **Training Director** | Manages input document matrix structure |
| **Guest** | Unauthenticated users with view-only access to public information |

---

## System-Wide Business Rules

1. **Authentication**: All users must be authenticated except for viewing public matrix
2. **Role-Based Access**: Each function is restricted to specific user roles
3. **Department Isolation**: Department heads can only manage their own department data
4. **Data Integrity**: No deletion of entities with active dependencies
5. **Audit Trail**: All critical actions are logged with user and timestamp
6. **Academic Year**: Most entities are scoped to specific academic years
7. **Workflow State**: Applications follow defined workflow states
8. **Notifications**: System sends notifications for critical state changes

---

## Glossary

| Term | Definition |
|------|------------|
| **Position** | An admission slot within a department that students can apply to |
| **Rule Type** | A category of admission criteria (e.g., GPA, test score) |
| **Rule Value** | Specific threshold or requirement for a rule type |
| **Input Document Matrix** | Grid showing which documents are required for each position |
| **Academic Staff Affair** | Staff responsible for final admission decisions |
| **Training Director** | Role responsible for matrix configuration |
| **Department** | Organizational unit offering admission positions |

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-30 | System | Initial use case documentation |

---

**End of Document**
