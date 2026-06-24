package com.appointment.controller;

import com.appointment.dto.*;
import com.appointment.service.ServiceManagementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired private ServiceManagementService serviceMgmt;

    // Public endpoints
    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceDTO>>> getAll(
            @RequestParam(required = false) String search) {
        List<ServiceDTO> list = (search != null && !search.isBlank())
            ? serviceMgmt.search(search) : serviceMgmt.getAll(false);
        return ResponseEntity.ok(ApiResponse.ok("Services fetched.", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Service fetched.", serviceMgmt.getById(id)));
    }

    // Admin endpoints
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ServiceDTO>>> getAllForAdmin() {
        return ResponseEntity.ok(ApiResponse.ok("Services fetched.", serviceMgmt.getAll(true)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ServiceDTO>> create(@Valid @RequestBody ServiceRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok("Service created.", serviceMgmt.create(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ServiceDTO>> update(
            @PathVariable Long id, @Valid @RequestBody ServiceRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Service updated.", serviceMgmt.update(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        serviceMgmt.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Service deactivated."));
    }
}
