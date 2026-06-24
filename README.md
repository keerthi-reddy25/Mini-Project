# BookSmart — Appointment Booking System

A full-stack appointment booking web application built with **React.js**, **Spring Boot**, and **MySQL**.

---

## Project Structure

```
appointment-booking-system/
├── backend/                         # Spring Boot (Java 17)
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/appointment/
│       │   ├── AppointmentBookingApplication.java
│       │   ├── config/
│       │   │   └── SecurityConfig.java         # JWT + CORS + Spring Security
│       │   ├── controller/
│       │   │   ├── AuthController.java
│       │   │   ├── ServiceController.java
│       │   │   ├── AppointmentController.java
│       │   │   └── UserController.java
│       │   ├── dto/
│       │   │   ├── RegisterRequest.java
│       │   │   ├── LoginRequest.java
│       │   │   ├── AuthResponse.java
│       │   │   ├── UserDTO.java
│       │   │   ├── ServiceDTO.java / ServiceRequest.java
│       │   │   ├── AppointmentDTO.java / AppointmentRequest.java
│       │   │   ├── StatusUpdateRequest.java
│       │   │   ├── UpdateProfileRequest.java
│       │   │   ├── DashboardStats.java
│       │   │   └── ApiResponse.java
│       │   ├── entity/
│       │   │   ├── User.java
│       │   │   ├── Service.java
│       │   │   └── Appointment.java
│       │   ├── exception/
│       │   │   ├── GlobalExceptionHandler.java
│       │   │   ├── ResourceNotFoundException.java
│       │   │   └── BadRequestException.java
│       │   ├── repository/
│       │   │   ├── UserRepository.java
│       │   │   ├── ServiceRepository.java
│       │   │   └── AppointmentRepository.java
│       │   ├── security/
│       │   │   ├── JwtUtils.java
│       │   │   ├── JwtAuthFilter.java
│       │   │   └── UserDetailsServiceImpl.java
│       │   └── service/
│       │       ├── AuthService.java
│       │       ├── AppointmentService.java
│       │       ├── ServiceManagementService.java
│       │       └── UserService.java
│       └── resources/
│           └── application.properties
│
├── frontend/                        # React 18
│   ├── package.json
│   └── src/
│       ├── App.js                   # Router + Protected routes
│       ├── App.css                  # Global design system
│       ├── index.js
│       ├── context/
│       │   └── AuthContext.js       # JWT auth state
│       ├── services/
│       │   └── api.js               # Axios + all API calls
│       ├── components/
│       │   └── common/
│       │       ├── Layout.js
│       │       ├── Sidebar.js
│       │       └── StatusBadge.js
│       └── pages/
│           ├── auth/
│           │   ├── LoginPage.js
│           │   └── RegisterPage.js
│           ├── customer/
│           │   ├── CustomerDashboard.js
│           │   ├── ServicesPage.js
│           │   ├── BookingPage.js
│           │   ├── AppointmentsPage.js
│           │   └── ProfilePage.js
│           └── admin/
│               ├── AdminDashboard.js
│               ├── AdminAppointments.js
│               ├── AdminServices.js
│               └── AdminUsers.js
│
├── database/
│   └── schema.sql                   # MySQL DDL + seed data
│
└── docs/
    └── API_DOCUMENTATION.md
```

---

## Prerequisites

| Tool        | Version  |
|-------------|----------|
| Java        | 17+      |
| Maven       | 3.8+     |
| Node.js     | 18+      |
| MySQL       | 8.0+     |

---

## Setup Instructions

### 1. Database

```bash
mysql -u root -p < database/schema.sql
```

This creates the `appointment_db` database with all tables and seeds:
- 1 admin account (`admin@bookapp.com` / `Admin@123`)
- 5 sample services

---

### 2. Backend (Spring Boot)

**Edit** `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/appointment_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

**Run:**

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend starts at: `http://localhost:8080`

---

### 3. Frontend (React)

```bash
cd frontend
npm install
npm start
```

Frontend starts at: `http://localhost:3000`

> The React dev server proxies `/api` requests to `http://localhost:8080` via the `"proxy"` field in `package.json`.

---

## Default Credentials

| Role     | Email                | Password   |
|----------|----------------------|------------|
| Admin    | admin@bookapp.com    | Admin@123  |
| Customer | Register via UI      | Your choice|

---

## Features

### Customer
- Register & Login with JWT authentication
- Browse & search available services
- Book appointments with date + time slot picker
- View appointment history with status tracking
- Cancel pending/approved appointments
- Booking confirmation screen
- Update profile (name, phone, address)

### Admin
- Dashboard with live statistics
- Manage all appointments (filter by status/date, search)
- Approve or Reject pending appointments with remarks
- Add / Edit / Deactivate services
- Manage customers (view, activate/deactivate)

---

## Appointment Workflow

```
1. Customer registers and logs in
2. Customer browses services → selects one
3. Customer picks a date → available slots are fetched
4. Customer selects a slot and submits booking
5. Appointment saved as PENDING in MySQL
6. Admin reviews → Approves or Rejects with remarks
7. Customer tracks status: PENDING → APPROVED / REJECTED
8. Customer can cancel PENDING or APPROVED appointments
```

---

## Tech Stack

| Layer          | Technology                           |
|----------------|--------------------------------------|
| Frontend       | React 18, React Router v6, Axios     |
| Styling        | Custom CSS (design system, no framework) |
| Backend        | Spring Boot 3.2, Spring Security     |
| Auth           | JWT (jjwt 0.12.x)                    |
| ORM            | Spring Data JPA / Hibernate          |
| Database       | MySQL 8                              |
| Validation     | Jakarta Bean Validation              |
| Build (BE)     | Maven                                |
| Build (FE)     | Create React App                     |

---

## API Quick Reference

| Method | Endpoint                               | Role     | Description              |
|--------|----------------------------------------|----------|--------------------------|
| POST   | /api/auth/register                     | Public   | Register customer         |
| POST   | /api/auth/login                        | Public   | Login → JWT               |
| GET    | /api/services                          | Public   | List active services      |
| GET    | /api/services/admin/all                | Admin    | All services incl. inactive|
| POST   | /api/services                          | Admin    | Create service            |
| PUT    | /api/services/{id}                     | Admin    | Update service            |
| DELETE | /api/services/{id}                     | Admin    | Deactivate service        |
| GET    | /api/appointments/slots                | Auth     | Available time slots      |
| POST   | /api/appointments                      | Customer | Book appointment          |
| GET    | /api/appointments/my                   | Customer | My appointments           |
| PATCH  | /api/appointments/{id}/cancel          | Customer | Cancel appointment        |
| GET    | /api/appointments/admin/all            | Admin    | All appointments          |
| PATCH  | /api/appointments/admin/{id}/status    | Admin    | Approve/Reject            |
| GET    | /api/appointments/admin/stats          | Admin    | Dashboard stats           |
| GET    | /api/users/profile                     | Auth     | Get own profile           |
| PUT    | /api/users/profile                     | Auth     | Update own profile        |
| GET    | /api/users/admin/all                   | Admin    | List all customers        |
| PATCH  | /api/users/admin/{id}/toggle           | Admin    | Toggle user active status |

See `docs/API_DOCUMENTATION.md` for full request/response examples.

---

## Security Notes

- Passwords are hashed with BCrypt (cost 10)
- JWT expiry: 24 hours
- Role-based access enforced at both method level (`@PreAuthorize`) and HTTP security config
- CORS locked to `http://localhost:3000` in development
- Services are soft-deleted (set `is_active = false`) to preserve appointment history integrity
