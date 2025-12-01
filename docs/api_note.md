
domain api :https://manage-and-automate-aviation-academy.onrender.com/api

/v3/api-docs
Explore
API Documentation
 1.0
OAS 3.1
/v3/api-docs
API for your project

Servers

https://manage-and-automate-aviation-academy.onrender.com - Render Server URL

Authorize

trainee-submission-controller

PUT
/api/trainee_submission/update/{submissionID}

Parameters
Try it out
Name	Description
submissionID *
integer($int64)
(path)
submissionID
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
/api/trainee_submission/create_trainee_submission_by_trainee

Parameters
Try it out
No parameters

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

Parameters
Try it out
Name	Description
trainee_submission_id *
integer($int64)
(path)
trainee_submission_id
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

trainee-application-controller

PUT
/api/trainee_application/{traineeApplicationId}/complete

Parameters
Try it out
Name	Description
traineeApplicationId *
integer($int64)
(path)
traineeApplicationId
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

Parameters
Try it out
Name	Description
trainee_application_id *
integer($int64)
(path)
trainee_application_id
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

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
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
Try it out
No parameters

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

Parameters
Try it out
No parameters

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
/api/trainee_application/filter-trainee-application-by-position-by-staff-academic

Parameters
Try it out
No parameters

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

position-controller


PUT
/api/position/updatePositionById{id}


Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
Request body

multipart/form-data
positionName
string
positionDescription
string
positionImage
string($binary)
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
/api/position/createPosition


Parameters
Try it out
No parameters

Request body

multipart/form-data
positionName
string
positionDescription
string
positionImage
string($binary)
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
/api/position/getPositionById/{id}


Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
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
/api/position/getAllPossition


Parameters
Try it out
No parameters

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

DELETE
/api/position/deletePositionById{id}


Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
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

input-document-matrix-controller

PUT
/api/matrix/setCompleteStatusToActive

Parameters
Try it out
No parameters

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

PUT
/api/matrix/set-status/department/{departmentId}

Parameters
Try it out
Name	Description
departmentId *
integer($int64)
(path)
departmentId
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
/api/matrix/setPendintStatusMatrix_for_training_director

Parameters
Try it out
No parameters

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
/api/matrix/clickToCellMatrix_for_head_of_department

Parameters
Try it out
No parameters

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
/api/matrix/addRow_for_training_director

Parameters
Try it out
No parameters

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
/api/matrix/addMultipleRow_for_training_director

Parameters
Try it out
No parameters

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
/api/matrix/addMultipleColum_for_training_director

Parameters
Try it out
No parameters

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
/api/matrix/addColum_for_training_director

Parameters
Try it out
No parameters

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
/api/matrix/getAllMatrix

Parameters
Try it out
No parameters

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
/api/matrix/department/{departmentID}

Parameters
Try it out
Name	Description
departmentID *
integer($int64)
(path)
departmentID
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

DELETE
/api/matrix/deleteRow_for_training_director/{positionId}

Parameters
Try it out
Name	Description
positionId *
integer($int64)
(path)
positionId
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

DELETE
/api/matrix/deleteColumn_for_training_director/{documentId}

Parameters
Try it out
Name	Description
documentId *
integer($int64)
(path)
documentId
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

DELETE
/api/matrix/deleteAllRow_for_training_director

Parameters
Try it out
No parameters

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

DELETE
/api/matrix/deleteAllColumns_for_training_director

Parameters
Try it out
No parameters

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

DELETE
/api/matrix/clearMatrix_for_training_director

Parameters
Try it out
No parameters

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

document-rule-value-controller

PUT
/api/document_rule_value/update_document_rule_value

Parameters
Try it out
No parameters

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
/api/document_rule_value/create_document_rule_value

Parameters
Try it out
No parameters

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

upload-controller


PUT
/api/admin/uploads/file
Update a file


Updates a file on Cloudinary by replacing the old one and returns the new URL

Parameters
Try it out
Name	Description
oldPublicId *
string
(query)
oldPublicId
Request body

multipart/form-data
file *
string($binary)
File to upload

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
/api/admin/uploads/file
Upload a file


Uploads a file to Cloudinary and returns the URL

Parameters
Try it out
No parameters

Request body

multipart/form-data
file *
string($binary)
File to upload

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
document-controller


GET
/api/admin/documents/{id}


Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
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

PUT
/api/admin/documents/{id}


Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
Request body

application/json
Example Value
Schema
{
  "documentName": "string",
  "documentDescription": "string"
}
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

DELETE
/api/admin/documents/{id}


Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
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
/api/admin/documents/create


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "documentName": "string",
  "documentDescription": "string"
}
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
/api/admin/documents/create-with-rules


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "documentName": "string",
  "documentDescription": "string",
  "rules": []
}
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
/api/admin/documents


Parameters
Try it out
No parameters

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
/api/admin/documents/{id}/with-rules


Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
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
/api/admin/documents/all-with-rules


Parameters
Try it out
No parameters

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
document-rule-controller


GET
/api/admin/document-rules/{id}


Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
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

PUT
/api/admin/document-rules/{id}



DELETE
/api/admin/document-rules/{id}



POST
/api/admin/document-rules/create



GET
/api/admin/document-rules


department-controller


GET
/api/admin/departments/{id}



PUT
/api/admin/departments/{id}



DELETE
/api/admin/departments/{id}



POST
/api/admin/departments/create



GET
/api/admin/departments


account-controller

POST
/api/account/v1/verify-otp


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "gmail": "string",
  "otp": "string"
}
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
/api/account/v1/send-otp-again


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "gmail": "string"
}
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
/api/account/v1/createUser


Parameters
Try it out
Name	Description
accountDTO *
object
(query)
{
  "userName": "string",
  "password": "string",
  "accountImage": "string",
  "gmail": "string"
}
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
/api/account/v1/createRole


Parameters
Try it out
Name	Description
roleDTO *
object
(query)
{
  "roleName": "ACADEMIC_STAFF_AFFAIR"
}
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
/api/account/v1/authenticateAccount


Parameters
Try it out
Name	Description
loginDTO *
object
(query)
{
  "userName": "string",
  "password": "string"
}
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
/api/account/import


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "accounts": []
}
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
/api/account/add_position_to_account


Parameters
Try it out
No parameters

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
/api/account/v1/getAllUser


Parameters
Try it out
No parameters

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
/api/account/v1/getAllRole


Parameters
Try it out
No parameters

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

Schemas
ResponseObjExpand allobject
DocumentRuleValueUpdateDTOExpand allobject
RuleCellUpdateDTOExpand allobject
DocumentDTOExpand allobject
DocumentRuleDTOExpand allobject
TimeMatrixDTOExpand allobject
CellMatrixDTOExpand allobject
PositionRequestDTOExpand allobject
DocumentRequestDTOExpand allobject
DocumentRuleValueDTOExpand allobject
RuleCellCreationDTOExpand allobject
CreateDocumentWithRulesDTOExpand allobject
OtpVerifyDTOExpand allobject
AccountDTOExpand allobject
RoleDTOExpand allobject
LoginDTOExpand allobject
MultipleAccountDTOExpand allobject