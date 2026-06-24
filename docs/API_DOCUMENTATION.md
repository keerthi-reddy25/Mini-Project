# BookSmart — REST API Documentation

**Base URL:** `http://localhost:8080/api`  
**Auth:** Bearer JWT token in `Authorization` header  
**Content-Type:** `application/json`

---

## Response Envelope

All responses follow this shape:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { }
}
```

---

## 1. Auth Endpoints  `/api/auth`

### POST `/api/auth/register`
Register a new customer.

**Request Body:**
```json
{
  "name":     "Jane Doe",
  "email":    "jane@example.com",
  "password": "secret123",
  "phone":    "9876543210",
  "address":  "123 MG Road, Bengaluru"
}
```

**Validations:** name ≥ 2 chars · email valid · password ≥ 6 chars · phone 10 digits

**201 Created:**
```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "id": 2, "name": "Jane Doe", "email": "jane@example.com",
    "phone": "9876543210", "role": "CUSTOMER", "active": true, "createdAt": "..."
  }
}
```

---

### POST `/api/auth/login`
Authenticate and receive JWT.

**Request Body:**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

**200 OK:**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type":  "Bearer",
    "id":    2,
    "name":  "Jane Doe",
    "email": "jane@example.com",
    "role":  "CUSTOMER"
  }
}
```

---

## 2. Services Endpoints  `/api/services`

### GET `/api/services`  _(public)_
List all active services. Optional query param `search`.

```
GET /api/services?search=consult
```

**200 OK:**
```json
{
  "success": true,
  "message": "Services fetched.",
  "data": [
    {
      "id": 1, "name": "General Consultation",
      "description": "...", "duration": 30,
      "price": 500.00, "active": true
    }
  ]
}
```

---

### GET `/api/services/{id}`  _(public)_
Get a single service by ID.

---

### GET `/api/services/admin/all`  _(ADMIN)_
Get all services including inactive ones.

---

### POST `/api/services`  _(ADMIN)_
Create a new service.

**Request Body:**
```json
{
  "name":        "Physiotherapy Session",
  "description": "One-on-one session",
  "duration":    45,
  "price":       800.00
}
```

**201 Created** — returns created `ServiceDTO`.

---

### PUT `/api/services/{id}`  _(ADMIN)_
Update an existing service. Same body as POST.

**200 OK** — returns updated `ServiceDTO`.

---

### DELETE `/api/services/{id}`  _(ADMIN)_
Soft-delete (deactivate) a service.

**200 OK:**
```json
{ "success": true, "message": "Service deactivated." }
```

---

## 3. Appointments Endpoints  `/api/appointments`

### GET `/api/appointments/slots`  _(authenticated)_
Get available time slots for a service on a given date.

```
GET /api/appointments/slots?serviceId=1&date=2025-07-15
```

**200 OK:**
```json
{
  "success": true,
  "message": "Slots fetched.",
  "data": ["09:00-09:30", "09:30-10:00", "10:00-10:30", "14:00-14:30"]
}
```

---

### POST `/api/appointments`  _(CUSTOMER)_
Book a new appointment.

**Request Body:**
```json
{
  "serviceId":       1,
  "appointmentDate": "2025-07-15",
  "timeSlot":        "10:00-10:30",
  "notes":           "First visit"
}
```

**201 Created:**
```json
{
  "success": true,
  "message": "Appointment booked successfully.",
  "data": {
    "id": 5,
    "userId": 2, "userName": "Jane Doe", "userEmail": "jane@example.com",
    "serviceId": 1, "serviceName": "General Consultation", "servicePrice": 500.00,
    "appointmentDate": "2025-07-15", "timeSlot": "10:00-10:30",
    "status": "PENDING", "notes": "First visit",
    "adminRemarks": null, "createdAt": "..."
  }
}
```

---

### GET `/api/appointments/my`  _(CUSTOMER)_
Get the logged-in customer's appointment history (newest first).

**200 OK** — array of `AppointmentDTO`.

---

### PATCH `/api/appointments/{id}/cancel`  _(CUSTOMER)_
Cancel an appointment owned by the current user.

**200 OK** — returns updated `AppointmentDTO` with status `CANCELLED`.

---

### GET `/api/appointments/admin/all`  _(ADMIN)_
Get all appointments with optional filters.

```
GET /api/appointments/admin/all?status=PENDING&date=2025-07-15&search=Jane
```

| Param    | Type   | Description                                    |
|----------|--------|------------------------------------------------|
| `status` | string | PENDING · APPROVED · REJECTED · CANCELLED      |
| `date`   | date   | ISO date `YYYY-MM-DD`                          |
| `search` | string | Matches customer name or service name          |

**200 OK** — array of `AppointmentDTO`.

---

### PATCH `/api/appointments/admin/{id}/status`  _(ADMIN)_
Approve, reject, or cancel any appointment.

**Request Body:**
```json
{
  "status":       "APPROVED",
  "adminRemarks": "Your slot is confirmed. Please arrive 5 minutes early."
}
```

Valid `status` values: `APPROVED` · `REJECTED` · `CANCELLED`

**200 OK** — returns updated `AppointmentDTO`.

---

### GET `/api/appointments/admin/stats`  _(ADMIN)_
Get dashboard statistics.

**200 OK:**
```json
{
  "success": true,
  "message": "Stats fetched.",
  "data": {
    "totalUsers":           15,
    "totalServices":         5,
    "totalAppointments":    42,
    "pendingAppointments":   8,
    "approvedAppointments": 28,
    "rejectedAppointments":  3,
    "cancelledAppointments": 3,
    "todayAppointments":     4
  }
}
```

---

## 4. Users Endpoints  `/api/users`

### GET `/api/users/profile`  _(authenticated)_
Get the current user's profile.

**200 OK** — returns `UserDTO`.

---

### PUT `/api/users/profile`  _(authenticated)_
Update the current user's profile.

**Request Body:**
```json
{ "name": "Jane Smith", "phone": "9123456789", "address": "New Address" }
```

**200 OK** — returns updated `UserDTO`.

---

### GET `/api/users/admin/all`  _(ADMIN)_
List all customers. Optional `search` param matches name or email.

```
GET /api/users/admin/all?search=jane
```

**200 OK** — array of `UserDTO`.

---

### PATCH `/api/users/admin/{id}/toggle`  _(ADMIN)_
Toggle a user's active/inactive status.

**200 OK:**
```json
{ "success": true, "message": "User status toggled." }
```

---

## Error Responses

| HTTP Code | When                                    |
|-----------|-----------------------------------------|
| 400       | Validation failure or bad request       |
| 401       | Missing or invalid JWT                  |
| 403       | Insufficient role                       |
| 404       | Resource not found                      |
| 500       | Unexpected server error                 |

**Validation error (400) example:**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email":    "must be a well-formed email address",
    "password": "size must be between 6 and 40"
  }
}
```

---

## Appointment Status Flow

```
PENDING ──► APPROVED ──► CANCELLED (admin)
        └──► REJECTED

PENDING ──► CANCELLED (customer)
APPROVED ──► CANCELLED (customer)
```

---

## Available Time Slots

Slots are generated in 30-minute blocks:

```
09:00-09:30  09:30-10:00  10:00-10:30  10:30-11:00
11:00-11:30  11:30-12:00  12:00-12:30  12:30-13:00
14:00-14:30  14:30-15:00  15:00-15:30  15:30-16:00
16:00-16:30  16:30-17:00
```

Slots already taken (status = APPROVED) for a given service + date are excluded from the response.
