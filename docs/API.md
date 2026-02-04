# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Routes

### Register User

**POST** `/auth/register`

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "ADMIN" | "EMPLOYEE"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN"
  },
  "token": "jwt_token"
}
```

### Login

**POST** `/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN"
  },
  "token": "jwt_token"
}
```

### Get Profile

**GET** `/auth/profile`
**Response (200):**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## Project Routes

### Get All Projects

**GET** `/projects`
**Response (200):**

```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "Project Name",
      "description": "Project description",
      "billingRate": 100,
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00Z",
      "user": {
        "id": "uuid",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "_count": {
        "timeLogs": 5
      }
    }
  ]
}
```

### Create Project (Admin Only)

**POST** `/projects`

```json
{
  "name": "New Project",
  "description": "Project description",
  "billingRate": 100
}
```

**Response (201):**

```json
{
  "message": "Project created successfully",
  "project": {
    "id": "uuid",
    "name": "New Project",
    "description": "Project description",
    "billingRate": 100,
    "status": "ACTIVE",
    "userId": "uuid"
  }
}
```

### Get Project by ID

**GET** `/projects/:id`
**Response (200):**

```json
{
  "project": {
    "id": "uuid",
    "name": "Project Name",
    "description": "Project description",
    "billingRate": 100,
    "status": "ACTIVE",
    "user": {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "timeLogs": [
      {
        "id": "uuid",
        "hours": 4,
        "notes": "Work done",
        "logDate": "2024-01-01T00:00:00Z",
        "status": "DONE",
        "user": {
          "id": "uuid",
          "name": "Employee"
        }
      }
    ]
  }
}
```

### Update Project (Admin Only)

**PUT** `/projects/:id`

```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "billingRate": 150,
  "status": "COMPLETED"
}
```

### Archive Project (Admin Only)

**PATCH** `/projects/:id/archive`
**Response (200):**

```json
{
  "message": "Project archived successfully",
  "project": {
    "id": "uuid",
    "status": "ARCHIVED"
  }
}
```

### Get Billing Summary

**GET** `/projects/:id/billing-summary`
**Response (200):**

```json
{
  "summary": {
    "projectId": "uuid",
    "projectName": "Project Name",
    "billingRate": 100,
    "totalHours": 45.5,
    "totalAmount": 4550,
    "hoursByUser": [
      {
        "name": "Admin User",
        "hours": 20.5
      },
      {
        "name": "Employee",
        "hours": 25
      }
    ],
    "hoursByDate": {
      "2024-01-01": 8,
      "2024-01-02": 6.5
    },
    "timeLogCount": 10
  }
}
```

---

## Time Log Routes

### Get Time Logs

**GET** `/time-logs`
**Response (200):**

```json
{
  "timeLogs": [
    {
      "id": "uuid",
      "projectId": "uuid",
      "userId": "uuid",
      "hours": 4,
      "notes": "Work done",
      "logDate": "2024-01-01T00:00:00Z",
      "status": "TODO",
      "createdAt": "2024-01-01T00:00:00Z",
      "project": {
        "id": "uuid",
        "name": "Project Name",
        "billingRate": 100
      }
    }
  ]
}
```

### Create Time Log

**POST** `/time-logs`

```json
{
  "projectId": "uuid",
  "hours": 4,
  "notes": "Work done",
  "logDate": "2024-01-01",
  "status": "TODO"
}
```

**Response (201):**

```json
{
  "message": "Time log created successfully",
  "timeLog": {
    "id": "uuid",
    "projectId": "uuid",
    "userId": "uuid",
    "hours": 4,
    "notes": "Work done",
    "logDate": "2024-01-01T00:00:00Z",
    "status": "TODO"
  }
}
```

### Update Time Log

**PUT** `/time-logs/:id`

```json
{
  "hours": 6,
  "notes": "Updated notes",
  "status": "IN_PROGRESS"
}
```

### Update Time Log Status (Drag & Drop)

**PATCH** `/time-logs/:id/status`

```json
{
  "status": "DONE"
}
```

**Response (200):**

```json
{
  "message": "Time log status updated successfully",
  "timeLog": {
    "id": "uuid",
    "status": "DONE"
  }
}
```

### Delete Time Log

**DELETE** `/time-logs/:id`
**Response (200):**

```json
{
  "message": "Time log deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "message": "Access denied"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

---

## Validation Rules

### Time Log Validation

- `hours`: Required, must be positive (min 0.5)
- Total hours per day: Maximum 12 hours
- `notes`: Optional, max 500 characters
- `logDate`: Required, date format

### Project Validation

- `name`: Required, min 3 characters
- `description`: Optional, max 1000 characters
- `billingRate`: Required, must be positive

---

## Rate Limiting

Billing summary endpoint is cached for 30 seconds.

---

## Performance Optimizations

- Database indexes on `projectId`, `userId`, `logDate` for time logs
- 30-second cache for billing summary endpoint
