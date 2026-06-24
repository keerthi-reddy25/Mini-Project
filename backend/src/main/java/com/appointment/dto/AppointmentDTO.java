package com.appointment.dto;
import com.appointment.entity.Appointment;
import lombok.*;
import java.math.BigDecimal;
import java.time.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AppointmentDTO {
    private Long       id;
    private Long       userId;
    private String     userName;
    private String     userEmail;
    private Long       serviceId;
    private String     serviceName;
    private BigDecimal servicePrice;
    private LocalDate  appointmentDate;
    private String     timeSlot;
    private String     status;
    private String     notes;
    private String     adminRemarks;
    private LocalDateTime createdAt;

    public static AppointmentDTO from(Appointment a) {
        return AppointmentDTO.builder()
            .id(a.getId())
            .userId(a.getUser().getId())
            .userName(a.getUser().getName())
            .userEmail(a.getUser().getEmail())
            .serviceId(a.getService().getId())
            .serviceName(a.getService().getName())
            .servicePrice(a.getService().getPrice())
            .appointmentDate(a.getAppointmentDate())
            .timeSlot(a.getTimeSlot())
            .status(a.getStatus().name())
            .notes(a.getNotes())
            .adminRemarks(a.getAdminRemarks())
            .createdAt(a.getCreatedAt())
            .build();
    }
}
