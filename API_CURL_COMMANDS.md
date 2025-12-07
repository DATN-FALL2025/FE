# API CURL COMMANDS - IDMAWA Aviation Academy

Base URL: `https://manage-and-automate-aviation-academy.onrender.com/api`

## 📝 Lưu ý
- Thay `YOUR_TOKEN` bằng JWT token thực tế
- Thay các ID (1, 2, 3...) bằng ID thực tế từ database
- Các endpoint có 🔒 cần Bearer token

---

## 🔐 AUTHENTICATION APIs

### 1. Login (Đăng nhập)
```bash
curl -X POST "https://manage-and-automate-aviation-academy.onrender.com/api/account/v1/authenticateAccount?userName=admin&password=123456" \
  -H "accept: */*"
```

### 2. Create User (Tạo tài khoản)
```bash
curl -X POST "https://manage-and-automate-aviation-academy.onrender.com/api/account/v1/createUser?userName=newuser&password=123456&gmail=user@example.com&accountImage=" \
  -H "accept: */*"
```

### 3. Get All Users (Lấy danh sách user)
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/account/v1/getAllUser" \
  -H "Content-Type: application/json"
```

### 4. Create Role (Tạo role)
```bash
curl -X POST "https://manage-and-automate-aviation-academy.onrender.com/api/account/v1/createRole?roleName=TRAINEE" \
  -H "accept: */*"
```

### 5. Get All Roles (Lấy danh sách role)
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/account/v1/getAllRole" \
  -H "Content-Type: application/json"
```

### 6. Import Users (Import nhiều user từ Excel)
```bash
curl -X POST "https://manage-and-automate-aviation-academy.onrender.com/api/account/import" \
  -H "Content-Type: application/json" \
  -H "accept: */*" \
  -d '{
    "accounts": [
      {
        "userName": "user1",
        "password": "pass123",
        "gmail": "user1@example.com",
        "accountImage": "",
        "positionName": "Pilot",
        "departmentName": "Flight Operations"
      }
    ]
  }'
```

---

## 🏢 DEPARTMENT APIs

### 1. Get All Departments
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/admin/departments" \
  -H "Content-Type: application/json"
```

### 2. Get Department By ID
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/admin/departments/1" \
  -H "Content-Type: application/json"
```

### 3. Create Department
```bash
curl -X POST "https://manage-and-automate-aviation-academy.onrender.com/api/admin/departments/create" \
  -H "accept: */*" \
  -F "departmentName=Flight Operations" \
  -F "departmentDescription=Handles all flight operations" \
  -F "departmentImage=@/path/to/image.jpg"
```

### 4. Update Department
```bash
curl -X PUT "https://manage-and-automate-aviation-academy.onrender.com/api/admin/departments/1" \
  -H "accept: */*" \
  -F "departmentName=Updated Department" \
  -F "departmentDescription=Updated description"
```

### 5. Delete Department
```bash
curl -X DELETE "https://manage-and-automate-aviation-academy.onrender.com/api/admin/departments/1" \
  -H "Content-Type: application/json"
```

---

## 💼 POSITION APIs

### 1. Get All Positions 🔒
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/position/getAllPossition" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Get Position By ID 🔒
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/position/getPositionById/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Create Position 🔒
```bash
curl -X POST "https://manage-and-automate-aviation-academy.onrender.com/api/position/createPosition" \
  -H "accept: */*" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "positionName=Pilot Trainee" \
  -F "positionDescription=Entry level pilot position" \
  -F "departmentID=1" \
  -F "positionImage=@/path/to/image.jpg"
```

### 4. Update Position 🔒
```bash
curl -X PUT "https://manage-and-automate-aviation-academy.onrender.com/api/position/updatePositionById/1" \
  -H "accept: */*" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "positionName=Senior Pilot" \
  -F "positionDescription=Updated description" \
  -F "departmentID=1"
```

### 5. Delete Position 🔒
```bash
curl -X DELETE "https://manage-and-automate-aviation-academy.onrender.com/api/position/deletePositionById/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📄 DOCUMENT APIs

### 1. Get All Documents
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/admin/documents" \
  -H "Content-Type: application/json"
```

### 2. Get Document By ID
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/admin/documents/1" \
  -H "Content-Type: application/json"
```

### 3. Create Document
```bash
curl -X POST "https://manage-and-automate-aviation-academy.onrender.com/api/admin/documents/create" \
  -H "Content-Type: application/json" \
  -H "accept: */*" \
  -d '{
    "documentName": "Medical Certificate",
    "documentDescription": "Required medical certificate for pilots"
  }'
```

### 4. Update Document
```bash
curl -X PUT "https://manage-and-automate-aviation-academy.onrender.com/api/admin/documents/1" \
  -H "Content-Type: application/json" \
  -H "accept: */*" \
  -d '{
    "documentName": "Updated Medical Certificate",
    "documentDescription": "Updated description"
  }'
```

### 5. Delete Document
```bash
curl -X DELETE "https://manage-and-automate-aviation-academy.onrender.com/api/admin/documents/1" \
  -H "Content-Type: application/json"
```

---

## 📋 RULE APIs

### 1. Get All Rules
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/admin/rules" \
  -H "Content-Type: application/json"
```

### 2. Get Rule By ID
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/admin/rules/1" \
  -H "Content-Type: application/json"
```

### 3. Create Rule
```bash
curl -X POST "https://manage-and-automate-aviation-academy.onrender.com/api/admin/rules/create" \
  -H "Content-Type: application/json" \
  -H "accept: */*" \
  -d '{
    "ruleName": "Age Requirement",
    "ruleDescription": "Minimum age 18 years old",
    "ruleType": "ELIGIBILITY"
  }'
```

### 4. Update Rule
```bash
curl -X PUT "https://manage-and-automate-aviation-academy.onrender.com/api/admin/rules/1" \
  -H "Content-Type: application/json" \
  -H "accept: */*" \
  -d '{
    "ruleName": "Updated Age Requirement",
    "ruleDescription": "Minimum age 21 years old"
  }'
```

### 5. Delete Rule
```bash
curl -X DELETE "https://manage-and-automate-aviation-academy.onrender.com/api/admin/rules/1" \
  -H "Content-Type: application/json"
```

---

## 📝 TRAINEE SUBMISSION APIs (Client-side)

### 1. Create Trainee Submission 🔒 (Trainee nộp tài liệu)
```bash
curl -X POST "https://manage-and-automate-aviation-academy.onrender.com/api/trainee_submission/create_trainee_submission_by_trainee" \
  -H "accept: */*" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "documentID=1" \
  -F "traineeApplicationId=1" \
  -F "submissionName=Medical Certificate" \
  -F "takeNote=Submitted via web portal" \
  -F "submissionDocumentFile=@/path/to/document.pdf"
```

### 2. Update Trainee Submission 🔒 (Trainee nộp lại)
```bash
curl -X PUT "https://manage-and-automate-aviation-academy.onrender.com/api/trainee_submission/update/1" \
  -H "accept: */*" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "requireDocumentName=Medical Certificate" \
  -F "newTakeNote=Resubmitted with corrections" \
  -F "newSubmissionDocumentFile=@/path/to/new_document.pdf"
```

### 3. Get Trainee Submission Detail 🔒
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/trainee_submission/get_trainee_submission_detail/1" \
  -H "Content-Type: application/json" \
  -H "accept: */*" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 TRAINEE APPLICATION APIs

### 1. Get All Applications By Trainee 🔒
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/trainee_application/get_all_application_by_trainee" \
  -H "Content-Type: application/json" \
  -H "accept: */*" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Get Application Detail By Trainee 🔒
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/trainee_application/get_trainee_application_detail_by_trainee/1" \
  -H "Content-Type: application/json" \
  -H "accept: */*" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Upload/Submit Trainee Application 🔒 (Submit hồ sơ tổng)
```bash
curl -X POST "https://manage-and-automate-aviation-academy.onrender.com/api/trainee_application/upload_trainee_application/1" \
  -H "accept: */*" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Complete Trainee Application 🔒
```bash
curl -X PUT "https://manage-and-automate-aviation-academy.onrender.com/api/trainee_application/1/complete" \
  -H "accept: */*" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Get All Applications By Staff Academic 🔒
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/trainee_application/get_all_trainee_application_by_staff_academic_affair" \
  -H "Content-Type: application/json" \
  -H "accept: */*" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Filter Applications By Status 🔒
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/trainee_application/get_trainee_application_list_by_status_by_staff_academic_staff_affair?statusEnum=Pending" \
  -H "Content-Type: application/json" \
  -H "accept: */*" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Status Enum values:**
- `Pending`
- `InProgress`
- `Complete`
- `Approved`
- `Rejected`

### 7. Filter Applications By Position 🔒
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/trainee_application/filter-trainee-application-by-position-by-staff-academic?positionId=1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 8. Complete Application Status
```bash
curl -X PUT "https://manage-and-automate-aviation-academy.onrender.com/api/trainee-application/complete-status" \
  -H "Content-Type: application/json" \
  -H "accept: */*" \
  -d '{
    "traineeApplicationId": 1
  }'
```

### 9. Get Application Detail By Staff 🔒
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/trainee_application/get_trainee_application_detail_by_staff/1" \
  -H "Content-Type: application/json" \
  -H "accept: */*" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 10. Get Approved Active Applications
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/trainee-application/approved-active" \
  -H "Content-Type: application/json"
```

---

## 📤 FILE UPLOAD APIs

### 1. Upload File
```bash
curl -X POST "https://manage-and-automate-aviation-academy.onrender.com/api/admin/uploads/file" \
  -H "accept: */*" \
  -F "file=@/path/to/file.pdf"
```

### 2. Update File
```bash
curl -X PUT "https://manage-and-automate-aviation-academy.onrender.com/api/admin/uploads/file?oldPublicId=old_file_id" \
  -H "accept: */*" \
  -F "file=@/path/to/new_file.pdf"
```

---

## 🔗 DOCUMENT-RULE APIs

### 1. Get All Document Rules
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/admin/document-rules" \
  -H "Content-Type: application/json"
```

### 2. Get Document Rule By ID
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/admin/document-rules/1" \
  -H "Content-Type: application/json"
```

### 3. Create Document Rule
```bash
curl -X POST "https://manage-and-automate-aviation-academy.onrender.com/api/admin/document-rules/create" \
  -H "Content-Type: application/json" \
  -H "accept: */*" \
  -d '{
    "documentId": 1,
    "ruleId": 1
  }'
```

### 4. Update Document Rule
```bash
curl -X PUT "https://manage-and-automate-aviation-academy.onrender.com/api/admin/document-rules/1" \
  -H "Content-Type: application/json" \
  -H "accept: */*" \
  -d '{
    "documentId": 1,
    "ruleId": 2
  }'
```

### 5. Delete Document Rule
```bash
curl -X DELETE "https://manage-and-automate-aviation-academy.onrender.com/api/admin/document-rules/1" \
  -H "Content-Type: application/json"
```

---

## 💡 Tips

### Lấy Token từ Response
Sau khi login, lấy token từ response:
```bash
TOKEN=$(curl -s -X POST "https://manage-and-automate-aviation-academy.onrender.com/api/account/v1/authenticateAccount?userName=admin&password=123456" \
  -H "accept: */*" | jq -r '.data')

echo "Token: $TOKEN"
```

### Sử dụng Token trong các request tiếp theo
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/position/getAllPossition" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

### Test với file
```bash
# Tạo file test
echo "Test content" > test.txt

# Upload file
curl -X POST "https://manage-and-automate-aviation-academy.onrender.com/api/trainee_submission/create_trainee_submission_by_trainee" \
  -H "accept: */*" \
  -H "Authorization: Bearer $TOKEN" \
  -F "documentID=1" \
  -F "traineeApplicationId=1" \
  -F "submissionName=Test Document" \
  -F "takeNote=Test submission" \
  -F "submissionDocumentFile=@test.txt"
```

### Debug Response
Thêm `-v` để xem chi tiết request/response:
```bash
curl -v -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/admin/departments" \
  -H "Content-Type: application/json"
```

### Save Response to File
```bash
curl -X GET "https://manage-and-automate-aviation-academy.onrender.com/api/admin/departments" \
  -H "Content-Type: application/json" \
  -o response.json
```

---

## 📊 Common Response Formats

### Success Response
```json
{
  "status": "200 OK",
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error message",
  "data": null
}
```

---

**Lưu ý:** 
- Tất cả các endpoint đều trả về JSON
- Các endpoint có 🔒 yêu cầu Bearer token trong header
- Thay thế `YOUR_TOKEN`, ID, và file paths bằng giá trị thực tế
- Sử dụng `jq` để parse JSON response (cài đặt: `sudo apt install jq` hoặc `brew install jq`)
