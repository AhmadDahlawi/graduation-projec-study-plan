# API Usage Guide

This guide provides detailed examples of how to use the Study Plan API.

## Base URL

```
http://localhost:8000
```

## Authentication

Currently, no authentication is required. This may be added in future versions.

## Content Type

All requests and responses use `application/json`.

---

## Course Endpoints

### 1. Get All Courses

**Request:**
```http
GET /courses
```

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum number of records (default: 100)
- `semester` (optional): Filter by semester (e.g., "1", "2")
- `type` (optional): Filter by type ("Required" or "Elective")
- `department` (optional): Filter by department

**Example:**
```bash
curl http://localhost:8000/courses?semester=1&type=Required
```

**Response:**
```json
[
  {
    "id": 1,
    "semester": "1",
    "name_ar": "مقدمة في البرمجة",
    "name_en": "Introduction to Programming",
    "code": "CS101",
    "credits": 3,
    "type": "Required",
    "mode": "In-Person",
    "lecture_hours": 2,
    "lab_hours": 1,
    "training_hours": 0,
    "department": "Computer Science",
    "prerequisite_codes": [],
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
]
```

---

### 2. Get Single Course

**Request:**
```http
GET /courses/{course_id}
```

**Example:**
```bash
curl http://localhost:8000/courses/1
```

**Response:**
```json
{
  "id": 1,
  "semester": "1",
  "name_ar": "مقدمة في البرمجة",
  "name_en": "Introduction to Programming",
  "code": "CS101",
  "credits": 3,
  "type": "Required",
  "mode": "In-Person",
  "lecture_hours": 2,
  "lab_hours": 1,
  "training_hours": 0,
  "department": "Computer Science",
  "description": "Introduction to programming concepts",
  "objectives": "Learn basic programming",
  "assessment": "Assignments and exams",
  "instructor": "Dr. Ahmed Al-Rashid",
  "materials": "Programming textbook",
  "grading": "A: 90-100, B: 80-89, C: 70-79",
  "schedule": "Sun, Tue, Thu 10:00-11:30",
  "office_hours": "Mon, Wed 2:00-4:00 PM",
  "notes": "Laptop required",
  "prerequisite_codes": [],
  "created_at": "2024-01-15T10:30:00",
  "updated_at": "2024-01-15T10:30:00"
}
```

---

### 3. Create Course

**Request:**
```http
POST /courses
Content-Type: application/json
```

**Body:**
```json
{
  "semester": "1",
  "name_ar": "مقدمة في البرمجة",
  "name_en": "Introduction to Programming",
  "code": "CS101",
  "credits": 3,
  "type": "Required",
  "mode": "In-Person",
  "lecture_hours": 2,
  "lab_hours": 1,
  "training_hours": 0,
  "department": "Computer Science",
  "description": "Introduction to programming concepts",
  "objectives": "Learn basic programming",
  "assessment": "Assignments and exams",
  "instructor": "Dr. Ahmed Al-Rashid",
  "materials": "Programming textbook",
  "grading": "A: 90-100, B: 80-89",
  "schedule": "Sun, Tue, Thu 10:00-11:30",
  "office_hours": "Mon, Wed 2:00-4:00 PM",
  "notes": "Laptop required",
  "prerequisite_codes": []
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/courses \
  -H "Content-Type: application/json" \
  -d '{
    "semester": "1",
    "name_ar": "مقدمة في البرمجة",
    "name_en": "Introduction to Programming",
    "code": "CS101",
    "credits": 3,
    "type": "Required",
    "mode": "In-Person",
    "lecture_hours": 2,
    "lab_hours": 1,
    "training_hours": 0,
    "department": "Computer Science",
    "prerequisite_codes": []
  }'
```

**Response:** Same as Get Single Course (201 Created)

---

### 4. Update Course

**Request:**
```http
PUT /courses/{course_id}
Content-Type: application/json
```

**Body (all fields optional):**
```json
{
  "semester": "2",
  "credits": 4,
  "instructor": "Dr. New Instructor",
  "prerequisite_codes": ["CS101"]
}
```

**Example:**
```bash
curl -X PUT http://localhost:8000/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "instructor": "Dr. Sarah Al-Mahmoud"
  }'
```

**Response:** Updated course object

---

### 5. Delete Course

**Request:**
```http
DELETE /courses/{course_id}
```

**Example:**
```bash
curl -X DELETE http://localhost:8000/courses/1
```

**Response:**
```json
{
  "message": "Course deleted successfully"
}
```

---

### 6. Search Courses

**Request:**
```http
GET /courses/search/?q={query}
```

**Query Parameters:**
- `q`: Search term (searches in name_ar, name_en, and code)

**Example:**
```bash
curl "http://localhost:8000/courses/search/?q=برمجة"
```

**Response:** Array of matching courses

---

## Plan Endpoints

### 1. Get All Plans

**Request:**
```http
GET /plans
```

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum number of records (default: 100)

**Example:**
```bash
curl http://localhost:8000/plans
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Computer Science Bachelor's Plan",
    "max_credits_per_semester": 18,
    "courses": [...],
    "total_credits": 120,
    "semesters": 8,
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
]
```

---

### 2. Get Single Plan

**Request:**
```http
GET /plans/{plan_id}
```

**Example:**
```bash
curl http://localhost:8000/plans/1
```

**Response:** Plan object with all associated courses

---

### 3. Create Plan

**Request:**
```http
POST /plans
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Computer Science Bachelor's Plan",
  "max_credits_per_semester": 18,
  "course_ids": [1, 2, 3, 4]
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Computer Science Plan",
    "max_credits_per_semester": 18,
    "course_ids": [1, 2, 3]
  }'
```

**Response:** Created plan object (201 Created)

---

### 4. Update Plan

**Request:**
```http
PUT /plans/{plan_id}
Content-Type: application/json
```

**Body (all fields optional):**
```json
{
  "name": "Updated Plan Name",
  "max_credits_per_semester": 20,
  "course_ids": [1, 2, 3, 4, 5]
}
```

**Example:**
```bash
curl -X PUT http://localhost:8000/plans/1 \
  -H "Content-Type: application/json" \
  -d '{
    "course_ids": [1, 2, 3, 4, 5]
  }'
```

**Response:** Updated plan object

---

### 5. Delete Plan

**Request:**
```http
DELETE /plans/{plan_id}
```

**Example:**
```bash
curl -X DELETE http://localhost:8000/plans/1
```

**Response:**
```json
{
  "message": "Plan deleted successfully"
}
```

---

### 6. Search Plans

**Request:**
```http
GET /plans/search/?q={query}
```

**Query Parameters:**
- `q`: Search term (searches in plan name)

**Example:**
```bash
curl "http://localhost:8000/plans/search/?q=Computer"
```

**Response:** Array of matching plans

---

## Error Responses

### 404 Not Found
```json
{
  "detail": "Course not found"
}
```

### 400 Bad Request
```json
{
  "detail": "Course code already exists"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "credits"],
      "msg": "ensure this value is greater than 0",
      "type": "value_error"
    }
  ]
}
```

---

## JavaScript/React Example

```javascript
// Create a new course
const createCourse = async (courseData) => {
  try {
    const response = await fetch('http://localhost:8000/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create course');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Get all courses
const getCourses = async () => {
  try {
    const response = await fetch('http://localhost:8000/courses');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Search courses
const searchCourses = async (query) => {
  try {
    const response = await fetch(
      `http://localhost:8000/courses/search/?q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

---

## Testing with Python

```python
import requests

BASE_URL = "http://localhost:8000"

# Create a course
course_data = {
    "semester": "1",
    "name_ar": "مقدمة في البرمجة",
    "name_en": "Introduction to Programming",
    "code": "CS101",
    "credits": 3,
    "type": "Required",
    "mode": "In-Person",
    "lecture_hours": 2,
    "lab_hours": 1,
    "training_hours": 0,
    "department": "Computer Science",
    "prerequisite_codes": []
}

response = requests.post(f"{BASE_URL}/courses", json=course_data)
print(response.json())

# Get all courses
response = requests.get(f"{BASE_URL}/courses")
print(response.json())

# Search courses
response = requests.get(f"{BASE_URL}/courses/search/", params={"q": "برمجة"})
print(response.json())
```

---

## Interactive API Documentation

For interactive API testing, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These interfaces allow you to test all endpoints directly from your browser.
