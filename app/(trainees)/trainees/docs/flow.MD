trainee-submission-controller


PUT
/api/trainee_submission/update/{submissionID}



POST
/api/trainee_submission/create_trainee_submission_by_trainee


Parameters
Cancel
Reset
No parameters

Request body

multipart/form-data
documentID
string
string
Send empty value
traineeApplicationId
string
string
Send empty value
submissionName
string
string
Send empty value
takeNote
string
string
Send empty value
submissionDocumentFile
string($binary)
Không có tệp nào được chọn
Send empty value
Execute
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
/api/trainee_submission/get_trainee_submission_detail/{trainee_submission_id}


trainee-application-controller


PUT
/api/trainee_application/{traineeApplicationId}/complete



POST
/api/trainee_application/upload_trainee_application/{trainee_application_id}



GET
/api/trainee_application/get_trainee_application_detail_by_trainee/{id}


Parameters
Cancel
Name	Description
id *
integer($int64)
(path)
3
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api/trainee_application/get_trainee_application_detail_by_trainee/3' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJkZXBhcnRtZW50TmFtZSI6IlRBTSIsImdtYWlsIjoidGV0ZWhpZXBAZ21haWwuY29tIiwicm9sZSI6IlRSQUlORUUiLCJkZXBhcnRtZW50SWQiOiI0Iiwic3ViIjoiS2hhbmgiLCJpYXQiOjE3NjQ2OTEyMzcsImV4cCI6MTc2NDcwOTIzN30.EmHGEKXDnm7QRmkAId0C1FrmHYtUcW2bfVVkLcXLesI'
Request URL
https://manage-and-automate-aviation-academy-application-production.up.railway.app/api/trainee_application/get_trainee_application_detail_by_trainee/3
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
    "traineeApplicationStatus": "Pending",
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
        "submissionId": null,
        "documentId": 6,
        "requiredDocumentName": "tài liệu y tế",
        "submissionStatus": "Pending"
      },
      {
        "submissionId": null,
        "documentId": 8,
        "requiredDocumentName": "tài liệu học thuật",
        "submissionStatus": "Pending"
      },
      {
        "submissionId": null,
        "documentId": 7,
        "requiredDocumentName": "bằng ngôn ngữ",
        "submissionStatus": "Pending"
      },
      {
        "submissionId": null,
        "documentId": 1,
        "requiredDocumentName": "bằng cấp 3",
        "submissionStatus": "Pending"
      }
    ]
  }
}
Response headers
 cache-control: no-cache,no-store,max-age=0,must-revalidate 
 content-type: application/json 
 date: Tue,02 Dec 2025 16:01:27 GMT 
 expires: 0 
 pragma: no-cache 
 server: railway-edge 
 vary: Origin,Access-Control-Request-Method,Access-Control-Request-Headers 
 x-content-type-options: nosniff 
 x-frame-options: DENY 
 x-railway-edge: railway/asia-southeast1-eqsg3a 
 x-railway-request-id: 3HBuTUefRTmpNL-GAQeqjw 
 x-xss-protection: 0 
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
/api/trainee_application/get_all_application_by_trainee


Parameters
Cancel
No parameters

Execute
Clear
Responses
Curl

curl -X 'GET' \
  'https://manage-and-automate-aviation-academy-application-production.up.railway.app/api/trainee_application/get_all_application_by_trainee' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJkZXBhcnRtZW50TmFtZSI6IlRBTSIsImdtYWlsIjoidGV0ZWhpZXBAZ21haWwuY29tIiwicm9sZSI6IlRSQUlORUUiLCJkZXBhcnRtZW50SWQiOiI0Iiwic3ViIjoiS2hhbmgiLCJpYXQiOjE3NjQ2OTEyMzcsImV4cCI6MTc2NDcwOTIzN30.EmHGEKXDnm7QRmkAId0C1FrmHYtUcW2bfVVkLcXLesI'
Request URL
https://manage-and-automate-aviation-academy-application-production.up.railway.app/api/trainee_application/get_all_application_by_trainee
Server response
Code	Details
200	
Response body
Download
{
  "status": "200 OK",
  "message": "Trainee application list",
  "data": [
    {
      "traineeApplicationId": 3,
      "traineeApplicationStatus": "Pending",
      "positionName": "bộ phận mặt đất ",
      "departmentName": "GO",
      "traineeApplicationCreateAt": "2025-11-25T14:17:58.727988",
      "traineeApplicationUpdateAt": null,
      "active": true
    }
  ]
}
Response headers
 cache-control: no-cache,no-store,max-age=0,must-revalidate 
 content-type: application/json 
 date: Tue,02 Dec 2025 16:01:11 GMT 
 expires: 0 
 pragma: no-cache 
 server: railway-edge 
 vary: Origin,Access-Control-Request-Method,Access-Control-Request-Headers 
 x-content-type-options: nosniff 
 x-frame-options: DENY 
 x-railway-edge: railway/asia-southeast1-eqsg3a 
 x-railway-request-id: C7hvjEFWR7CaHIo9AQeqjw 
 x-xss-protection: 0 
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
/api/trainee_application/getAllTraineeApplicationByStaffAcademic



GET
/api/trainee_application/filter-trainee-application-by-position-by-staff-academic