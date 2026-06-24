package com.appointment.dto;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class StatusUpdateRequest {
    @NotBlank public String status;
    public String adminRemarks;
}
