
domain api :https://manage-and-automate-aviation-academy.onrender.com/api

/v3/api-docs
Explore
API Documentation
 1.0 
OAS 3.1
/v3/api-docs
API for your project

Servers

https://manage-and-automate-aviation-academy.onrender.com - Generated server url

Authorize
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
DocumentDTOExpand allobject
DocumentRuleDTOExpand allobject
AccountDTOExpand allobject
RoleDTOExpand allobject
LoginDTOExpand allobject