-- ============================================================
--  Appointment Booking System — MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS appointment_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE appointment_db;

-- ─────────────────────────────────────────────
--  TABLE: users
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100)        NOT NULL,
    email         VARCHAR(150)        NOT NULL UNIQUE,
    password      VARCHAR(255)        NOT NULL,
    phone         VARCHAR(20),
    address       TEXT,
    role          ENUM('CUSTOMER','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    is_active     BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role  (role)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
--  TABLE: services
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(150)        NOT NULL,
    description   TEXT,
    duration      INT                 NOT NULL COMMENT 'Duration in minutes',
    price         DECIMAL(10,2)       NOT NULL DEFAULT 0.00,
    is_active     BOOLEAN             NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_services_name (name)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
--  TABLE: appointments
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT              NOT NULL,
    service_id      BIGINT              NOT NULL,
    appointment_date DATE               NOT NULL,
    time_slot       VARCHAR(20)         NOT NULL COMMENT 'e.g. 09:00-09:30',
    status          ENUM('PENDING','APPROVED','REJECTED','CANCELLED')
                                        NOT NULL DEFAULT 'PENDING',
    notes           TEXT,
    admin_remarks   TEXT,
    created_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_appt_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    CONSTRAINT fk_appt_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT,
    INDEX idx_appt_user        (user_id),
    INDEX idx_appt_service     (service_id),
    INDEX idx_appt_date        (appointment_date),
    INDEX idx_appt_status      (status)
) ENGINE=InnoDB;

-- ─────────────────────────────────────────────
--  SEED DATA
-- ─────────────────────────────────────────────

-- Default admin + sample customer (password: Admin@123 / User@123 — BCrypt hash)
-- Uses ON DUPLICATE KEY UPDATE so the seed is idempotent and safe to re-run.
INSERT INTO users (name, email, password, phone, role) VALUES
('System Admin', 'admin@bookapp.com',
 '$2b$12$6viOe0N8DZfyAzrgFxb2yeTj636/r8874GAS1dsarCaM0PLLWqWum',
 '9000000001', 'ADMIN'),
('Sample User', 'user@bookapp.com',
 '$2b$12$aYKdOy/pYgFZrgo45q1omOoHokMLwV.gMnh3ibG04aZijUJvErYCu',
 '9000000002', 'CUSTOMER')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    password = VALUES(password),
    phone = VALUES(phone),
    role = VALUES(role),
    updated_at = CURRENT_TIMESTAMP;

-- Sample services
INSERT INTO services (name, description, duration, price) VALUES
('General Consultation', 'Initial consultation with a specialist.', 30, 500.00),
('Follow-up Consultation', 'Follow-up session after the initial visit.', 20, 300.00),
('Diagnostic Test', 'Comprehensive diagnostic test package.', 60, 1200.00),
('Physiotherapy Session', 'One-on-one physiotherapy session.', 45, 800.00),
('Nutrition Counselling', 'Personalised diet and nutrition plan.', 30, 600.00);
