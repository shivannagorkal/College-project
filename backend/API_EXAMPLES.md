# API Examples

Use these examples with Postman, Insomnia, or cURL to test the API.

## Base URL
```
http://localhost:5000/api
```

## Authentication

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "admin@akrdevi.college",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Admin",
      "email": "admin@akrdevi.college",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer {token}
```

---

## Events

### Get All Events
```
GET /events
```

### Get Single Event
```
GET /events/{id}
```

### Create Event
```
POST /events
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Annual Sports Day",
  "description": "A grand sports event",
  "date": "2026-06-15",
  "category": "Sports",
  "isUpcoming": true,
  "image": "https://example.com/image.jpg"
}
```

### Update Event
```
PUT /events/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "isUpcoming": false
}
```

### Delete Event
```
DELETE /events/{id}
Authorization: Bearer {token}
```

---

## Results

### Get All Results (with filters)
```
GET /results
GET /results?year=2025&stream=Science
```

### Create Result
```
POST /results
Authorization: Bearer {token}
Content-Type: application/json

{
  "year": 2025,
  "class": "PCMB",
  "stream": "Science",
  "totalStudents": 45,
  "passedStudents": 43,
  "passPercentage": 95.5,
  "firstClass": 30,
  "distinction": 12
}
```

### Update Result
```
PUT /results/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "passPercentage": 96.0
}
```

### Delete Result
```
DELETE /results/{id}
Authorization: Bearer {token}
```

---

## Gallery

### Get All Gallery Items (with filters)
```
GET /gallery
GET /gallery?category=Sports&year=2025
```

### Upload Gallery Image
```
POST /gallery
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form data:
- image: (file upload)
- title: "Event Photo"
- category: "Sports"
- year: 2025
```

### Delete Gallery Image
```
DELETE /gallery/{id}
Authorization: Bearer {token}
```

---

## Toppers

### Get All Toppers (with filters)
```
GET /toppers
GET /toppers?year=2025&stream=Science
```

### Create Topper
```
POST /toppers
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Rahul Kumar",
  "year": 2025,
  "stream": "Science",
  "subject": "Physics",
  "marks": 98,
  "percentage": 99.0,
  "rank": 1,
  "photo": "https://example.com/photo.jpg"
}
```

### Update Topper
```
PUT /toppers/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "marks": 100
}
```

### Delete Topper
```
DELETE /toppers/{id}
Authorization: Bearer {token}
```

---

## Faculty

### Get All Faculty (with filters)
```
GET /faculty
GET /faculty?department=Science
```

### Create Faculty
```
POST /faculty
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Dr. Sharma",
  "subject": "Physics",
  "qualification": "PhD",
  "department": "Science",
  "experience": 15,
  "photo": "https://example.com/photo.jpg"
}
```

### Update Faculty
```
PUT /faculty/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "experience": 16
}
```

### Delete Faculty
```
DELETE /faculty/{id}
Authorization: Bearer {token}
```

---

## Announcements

### Get All Announcements
```
GET /announcements
```

### Create Announcement
```
POST /announcements
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Holiday Announcement",
  "description": "College will remain closed on Independence Day",
  "date": "2026-08-15",
  "isImportant": true,
  "fileUrl": "https://example.com/file.pdf"
}
```

### Update Announcement
```
PUT /announcements/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "isImportant": false
}
```

### Delete Announcement
```
DELETE /announcements/{id}
Authorization: Bearer {token}
```

---

## Admissions

### Submit Admission Enquiry
```
POST /admissions
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "stream": "Science",
  "message": "Interested in Science stream"
}
```

### Get All Admission Enquiries
```
GET /admissions
Authorization: Bearer {token}
```

### Update Admission Status
```
PUT /admissions/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "Contacted"
}
```

Valid statuses: `Pending`, `Contacted`, `Admitted`

---

## History

### Get All History Milestones
```
GET /history
```

### Create History Milestone
```
POST /history
Authorization: Bearer {token}
Content-Type: application/json

{
  "year": 1980,
  "title": "College Founded",
  "description": "AKRDevi PU College was established",
  "image": "https://example.com/image.jpg"
}
```

### Update History
```
PUT /history/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Updated description"
}
```

### Delete History
```
DELETE /history/{id}
Authorization: Bearer {token}
```

---

## Testing with cURL

Example login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@akrdevi.college","password":"admin123"}'
```

Example creating event with token:
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Annual Sports Day",
    "description": "Sports event",
    "date": "2026-06-15",
    "category": "Sports",
    "isUpcoming": true
  }'
```

---

## Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Server Error
