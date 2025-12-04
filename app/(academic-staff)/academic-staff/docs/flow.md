trainee-application-controller


PUT
/api/trainee_application/{traineeApplicationId}/complete


Parameters
Cancel
Name	Description
traineeApplicationId *
integer($int64)
(path)
5
Execute
Clear
Responses
Curl

curl -X 'PUT' \
  'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api/trainee_application/5/complete' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJkZXBhcnRtZW50TmFtZSI6IkNDIiwicm9sZSI6IkFDQURFTUlDX1NUQUZGX0FGRkFJUiIsImRlcGFydG1lbnRJZCI6IjIiLCJzdWIiOiJI4bqjaSIsImlhdCI6MTc2NDc3ODMyMSwiZXhwIjoxNzY0ODIxNTIxfQ.ph8lwz-NSGFfoGNPGLCwcG0BjHzE0jx7XEkda89Txzk'
Request URL
https://manage-and-automate-aviation-academy-application-production.up.railway.app/api/trainee_application/5/complete
Server response
Code	Details
200	
Response body
Download
{
  "status": "200 OK",
  "message": "Successfully set Trainee Application ID 5 status to 'Complete'.",
  "data": {
    "createAt": "2025-12-02T15:49:11.273448",
    "updateAt": null,
    "deleteAt": null,
    "statusEnum": "Complete",
    "active": true,
    "id": 5
  }
}
Response headers
 cache-control: no-cache,no-store,max-age=0,must-revalidate 
 content-type: application/json 
 expires: 0 
 pragma: no-cache 
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "status": "string",
  "message": "string",
  "data": {}
}
No links

POST
/api/trainee_application/upload_trainee_application/{trainee_application_id}



GET
/api/trainee_application/get_trainee_application_list_by_status_by_staff_academic_staff_affair


Parameters
Cancel
Name	Description
statusEnum *
string
(query)

InProgress
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api/trainee_application/get_trainee_application_list_by_status_by_staff_academic_staff_affair?statusEnum=InProgress' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJkZXBhcnRtZW50TmFtZSI6IkNDIiwicm9sZSI6IkFDQURFTUlDX1NUQUZGX0FGRkFJUiIsImRlcGFydG1lbnRJZCI6IjIiLCJzdWIiOiJI4bqjaSIsImlhdCI6MTc2NDc3ODMyMSwiZXhwIjoxNzY0ODIxNTIxfQ.ph8lwz-NSGFfoGNPGLCwcG0BjHzE0jx7XEkda89Txzk'
Request URL
https://manage-and-automate-aviation-academy-application-production.up.railway.app/api/trainee_application/get_trainee_application_list_by_status_by_staff_academic_staff_affair?statusEnum=InProgress
Server response
Code	Details
200	
Response body
Download
{
  "status": "200 OK",
  "message": "Trainee application List",
  "data": [
    {
      "createAt": "2025-12-02T15:49:11.273448",
      "updateAt": null,
      "deleteAt": null,
      "statusEnum": "InProgress",
      "active": true,
      "id": 5
    }
  ]
}
Response headers
 cache-control: no-cache,no-store,max-age=0,must-revalidate 
 content-type: application/json 
 expires: 0 
 pragma: no-cache 
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "status": "string",
  "message": "string",
  "data": {}
}
No links

GET
/api/trainee_application/get_trainee_application_detail_by_trainee/{id}



GET
/api/trainee_application/get_all_trainee_application_by_staff_academic_affair


Parameters
Cancel
No parameters

Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api/trainee_application/get_all_trainee_application_by_staff_academic_affair' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJkZXBhcnRtZW50TmFtZSI6IkNDIiwicm9sZSI6IkFDQURFTUlDX1NUQUZGX0FGRkFJUiIsImRlcGFydG1lbnRJZCI6IjIiLCJzdWIiOiJI4bqjaSIsImlhdCI6MTc2NDc3ODMyMSwiZXhwIjoxNzY0ODIxNTIxfQ.ph8lwz-NSGFfoGNPGLCwcG0BjHzE0jx7XEkda89Txzk'
Request URL
https://manage-and-automate-aviation-academy-application-production.up.railway.app/api/trainee_application/get_all_trainee_application_by_staff_academic_affair
Server response
Code	Details
200	
Response body
Download
{
  "status": "200 OK",
  "message": "Trainee application List",
  "data": [
    {
      "createAt": "2025-11-29T06:26:19.407153",
      "updateAt": null,
      "deleteAt": null,
      "statusEnum": "Pending",
      "active": true,
      "id": 4
    },
    {
      "createAt": "2025-12-02T15:49:11.273448",
      "updateAt": null,
      "deleteAt": null,
      "statusEnum": "InProgress",
      "active": true,
      "id": 5
    },
    {
      "createAt": "2025-11-25T14:17:58.727988",
      "updateAt": null,
      "deleteAt": null,
      "statusEnum": "Complete",
      "active": true,
      "id": 3
    }
  ]
}
Response headers
 cache-control: no-cache,no-store,max-age=0,must-revalidate 
 content-type: application/json 
 expires: 0 
 pragma: no-cache 
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "status": "string",
  "message": "string",
  "data": {}
}
No links
GET
/api/trainee_application/get_trainee_application_detail_by_staff/{trainee_application_id}


Parameters
Cancel
Name	Description
trainee_application_id *
integer($int64)
(path)
3
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api/trainee_application/get_trainee_application_detail_by_staff/3' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJkZXBhcnRtZW50TmFtZSI6IkNDIiwicm9sZSI6IkFDQURFTUlDX1NUQUZGX0FGRkFJUiIsImRlcGFydG1lbnRJZCI6IjIiLCJzdWIiOiJI4bqjaSIsImlhdCI6MTc2NDc4MTE2MywiZXhwIjoxNzY0ODI0MzYzfQ.DG-WOAVgsQMP-EvA9gu4GHMB4ZAAml0qakSF5Na01hc'
Request URL
https://manage-and-automate-aviation-academy-application-production.up.railway.app/api/trainee_application/get_trainee_application_detail_by_staff/3
Server response
Code	Details
200	
Response body
Download
{
  "status": "200 OK",
  "message": "Trainee application detail",
  "data": {
    "traineeApplicationId": 3,
    "traineeApplicationStatus": "Complete",
    "traineeApplicationCreateAt": "2025-11-25T14:17:58.727988",
    "traineeApplicationUpdateAt": null,
    "positionId": 6,
    "positionName": "bộ phận mặt đất ",
    "departmentName": "GO",
    "positionDescription": "212",
    "accountId": 1,
    "fullName": "Khanh",
    "submittedDocuments": [
      {
        "submissionId": 1,
        "documentId": 6,
        "requiredDocumentName": "tài liệu y tế",
        "apply_or_not": "Applied",
        "submissionStatus": "Reject",
        "url": "https://ifdfxmtxxgbaxvppxyly.supabase.co/storage/v1/object/public/TraineeAplicationAcademicAviation/application_3/document_6/1764693721331_Screenshot 2025-06-02 235447.png"
      },
      {
        "submissionId": 2,
        "documentId": 8,
        "requiredDocumentName": "tài liệu học thuật",
        "apply_or_not": "Applied",
        "submissionStatus": "Reject",
        "url": "https://ifdfxmtxxgbaxvppxyly.supabase.co/storage/v1/object/public/TraineeAplicationAcademicAviation/application_3/document_8/1764766240540_Screenshot 2025-06-04 030336.png"
      },
      {
        "submissionId": 3,
        "documentId": 7,
        "requiredDocumentName": "bằng ngôn ngữ",
        "apply_or_not": "Applied",
        "submissionStatus": "Reject",
        "url": "https://ifdfxmtxxgbaxvppxyly.supabase.co/storage/v1/object/public/TraineeAplicationAcademicAviation/application_3/document_7/1764768116900_Screenshot 2025-06-03 001921.png"
      },
      {
        "submissionId": 4,
        "documentId": 1,
        "requiredDocumentName": "bằng cấp 3",
        "apply_or_not": "Applied",
        "submissionStatus": "Reject",
        "url": "https://ifdfxmtxxgbaxvppxyly.supabase.co/storage/v1/object/public/TraineeAplicationAcademicAviation/application_3/document_1/1764769186387_Screenshot 2025-06-03 001921.png"
      }
    ]
  }
}
Response headers
 cache-control: no-cache,no-store,max-age=0,must-revalidate 
 content-type: application/json 
 expires: 0 
 pragma: no-cache 
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "status": "string",
  "message": "string",
  "data": {}
}

## Aca
demic Staff Approvals Flow

### APIs Used:

1. **GET /api/trainee_application/get_all_trainee_application_by_staff_academic_affair**
   - Hiển thị tất cả đơn đăng ký
   - Không cần parameters
   - Requires Authorization token

2. **GET /api/trainee_application/get_trainee_application_list_by_status_by_staff_academic_staff_affair**
   - Filter đơn đăng ký theo status
   - Parameters: `statusEnum` (Pending, Approve, Reject, Complete, InProgress)
   - Requires Authorization token

3. **GET /api/trainee_application/get_trainee_application_detail_by_staff/{trainee_application_id}**
   - Xem chi tiết đơn đăng ký
   - Parameters: `trainee_application_id` (path parameter)
   - Returns: Full application details including submitted documents
   - Requires Authorization token

4. **PUT /api/trainee_application/{traineeApplicationId}/complete**
   - Đánh dấu hoàn thành đơn đăng ký
   - Chỉ được phép khi status là "Approve"
   - Parameters: `traineeApplicationId` (path parameter)
   - Requires Authorization token

### Features:

- **View Modes**: Toggle between Card view and Table view
- **Filter by Status**: All, Pending, Approve, Reject, Complete, InProgress
- **View Details**: Click "View" button to see full application details and submitted documents
- **Complete Action**: Only available for applications with "Approve" status
- **Statistics**: Display counts for Pending, Approve, and Reject applications
