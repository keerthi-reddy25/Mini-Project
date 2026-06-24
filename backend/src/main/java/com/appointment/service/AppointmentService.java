package com.appointment.service;

import com.appointment.dto.*;
import com.appointment.entity.*;
import com.appointment.entity.Appointment.Status;
import com.appointment.exception.*;
import com.appointment.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired private AppointmentRepository appointmentRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private ServiceRepository serviceRepo;

    // ── Time slots generator ─────────────────────────────────────
    public List<String> getAvailableSlots(Long serviceId, LocalDate date) {
        List<String> allSlots = generateSlots();
        List<Appointment> booked = appointmentRepo
            .findByServiceIdAndAppointmentDateAndStatus(serviceId, date, Status.APPROVED);
        Set<String> bookedSlots = booked.stream()
            .map(Appointment::getTimeSlot).collect(Collectors.toSet());
        allSlots.removeAll(bookedSlots);
        return allSlots;
    }

    private List<String> generateSlots() {
        List<String> slots = new ArrayList<>();
        int[][] times = {
            {9,0},{9,30},{10,0},{10,30},{11,0},{11,30},
            {12,0},{12,30},{14,0},{14,30},{15,0},{15,30},{16,0},{16,30}
        };
        for (int[] t : times) {
            int endMin = t[1] + 30;
            int endHr  = t[0] + endMin / 60;
            endMin %= 60;
            slots.add(String.format("%02d:%02d-%02d:%02d", t[0], t[1], endHr, endMin));
        }
        return slots;
    }

    // ── Customer: book ───────────────────────────────────────────
    @Transactional
    public AppointmentDTO book(Long userId, AppointmentRequest req) {
        if (req.appointmentDate.isBefore(LocalDate.now())) {
            throw new BadRequestException("Appointment date must be in the future.");
        }
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        com.appointment.entity.Service service = serviceRepo.findById(req.serviceId)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        if (!service.isActive()) throw new BadRequestException("Service is not available.");

        Appointment appt = Appointment.builder()
            .user(user).service(service)
            .appointmentDate(req.appointmentDate)
            .timeSlot(req.timeSlot)
            .notes(req.notes)
            .status(Status.PENDING)
            .build();
        return AppointmentDTO.from(appointmentRepo.save(appt));
    }

    // ── Customer: my appointments ────────────────────────────────
    public List<AppointmentDTO> getMyAppointments(Long userId) {
        return appointmentRepo.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(AppointmentDTO::from).collect(Collectors.toList());
    }

    // ── Customer: cancel ─────────────────────────────────────────
    @Transactional
    public AppointmentDTO cancel(Long appointmentId, Long userId) {
        Appointment appt = appointmentRepo.findById(appointmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        if (!appt.getUser().getId().equals(userId)) {
            throw new BadRequestException("Not your appointment.");
        }
        if (appt.getStatus() == Status.CANCELLED) {
            throw new BadRequestException("Already cancelled.");
        }
        appt.setStatus(Status.CANCELLED);
        return AppointmentDTO.from(appointmentRepo.save(appt));
    }

    // ── Admin: all appointments ──────────────────────────────────
    public List<AppointmentDTO> getAll() {
        return appointmentRepo.findAllByOrderByCreatedAtDesc()
            .stream().map(AppointmentDTO::from).collect(Collectors.toList());
    }

    // ── Admin: update status ─────────────────────────────────────
    @Transactional
    public AppointmentDTO updateStatus(Long id, StatusUpdateRequest req) {
        Appointment appt = appointmentRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        try {
            appt.setStatus(Status.valueOf(req.status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + req.status);
        }
        if (req.adminRemarks != null) appt.setAdminRemarks(req.adminRemarks);
        return AppointmentDTO.from(appointmentRepo.save(appt));
    }

    // ── Admin: search ────────────────────────────────────────────
    public List<AppointmentDTO> search(String query) {
        return appointmentRepo.searchAppointments(query)
            .stream().map(AppointmentDTO::from).collect(Collectors.toList());
    }

    // ── Admin: filter ────────────────────────────────────────────
    public List<AppointmentDTO> filter(String statusStr, LocalDate date) {
        Status status = (statusStr != null && !statusStr.isBlank())
            ? Status.valueOf(statusStr.toUpperCase()) : null;
        return appointmentRepo.findByOptionalFilters(status, date)
            .stream().map(AppointmentDTO::from).collect(Collectors.toList());
    }

    // ── Admin: dashboard stats ───────────────────────────────────
    public DashboardStats getStats() {
        return DashboardStats.builder()
            .totalUsers(userRepo.count())
            .totalServices(serviceRepo.count())
            .totalAppointments(appointmentRepo.count())
            .pendingAppointments(appointmentRepo.countByStatus(Status.PENDING))
            .approvedAppointments(appointmentRepo.countByStatus(Status.APPROVED))
            .rejectedAppointments(appointmentRepo.countByStatus(Status.REJECTED))
            .cancelledAppointments(appointmentRepo.countByStatus(Status.CANCELLED))
            .todayAppointments(appointmentRepo.countTodayAppointments())
            .build();
    }
}
