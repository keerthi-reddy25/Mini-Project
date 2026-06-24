# BookIt — Appointment Booking System

A appointment booking web application built with **React.js**, **Spring Boot**, and **MySQL**.


Tools Used-----

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

See `docs/API_DOCUMENTATION.md` for full request/response examples.

---

## Security Notes

- Passwords are hashed with BCrypt (cost 10)
- JWT expiry: 24 hours
- Role-based access enforced at both method level (`@PreAuthorize`) and HTTP security config
- CORS locked to `http://localhost:3000` in development
- Services are soft-deleted (set `is_active = false`) to preserve appointment history integrity
