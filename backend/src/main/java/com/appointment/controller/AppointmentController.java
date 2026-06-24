package com.appointment.controller;

import com.appointment.dto.*;
import com.appointment.entity.User;
import com.appointment.repository.UserRepository;
import com.appointment.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired private AppointmentService appointmentService;
    @Autowired private UserRepository userRepo;

    // ── Customer ─────────────────────────────────────────────────

    @GetMapping("/slots")
    public ResponseEntity<ApiResponse<List<String>>> getSlots(
            @RequestParam Long serviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.ok("Slots fetched.",
            appointmentService.getAvailableSlots(serviceId, date)));
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<AppointmentDTO>> book(
            @AuthenticationPrincipal UserDetails ud,
            @Valid @RequestBody AppointmentRequest req) {
        Long userId = resolveUserId(ud);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Appointment booked successfully.", appointmentService.book(userId, req)));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> myAppointments(
            @AuthenticationPrincipal UserDetails ud) {
        Long userId = resolveUserId(ud);
        return ResponseEntity.ok(ApiResponse.ok("Appointments fetched.",
            appointmentService.getMyAppointments(userId)));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<AppointmentDTO>> cancel(
            @PathVariable Long id, @AuthenticationPrincipal UserDetails ud) {
        Long userId = resolveUserId(ud);
        return ResponseEntity.ok(ApiResponse.ok("Appointment cancelled.",
            appointmentService.cancel(id, userId)));
    }

    // ── Admin ─────────────────────────────────────────────────────

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String search) {

        List<AppointmentDTO> result;
        if (search != null && !search.isBlank()) {
            result = appointmentService.search(search);
        } else {
            result = appointmentService.filter(status, date);
        }
        return ResponseEntity.ok(ApiResponse.ok("Appointments fetched.", result));
    }

    @PatchMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AppointmentDTO>> updateStatus(
            @PathVariable Long id, @Valid @RequestBody StatusUpdateRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated.",
            appointmentService.updateStatus(id, req)));
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStats>> stats() {
        return ResponseEntity.ok(ApiResponse.ok("Stats fetched.", appointmentService.getStats()));
    }

    // ── Helper ────────────────────────────────────────────────────

    private Long resolveUserId(UserDetails ud) {
        return userRepo.findByEmail(ud.getUsername()).orElseThrow().getId();
    }
}
