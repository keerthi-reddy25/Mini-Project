package com.appointment.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AppointmentRequest {
    @NotNull  public Long      serviceId;
    @NotNull  public LocalDate appointmentDate;
    @NotBlank public String    timeSlot;
    public String notes;
}
