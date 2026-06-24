package com.appointment.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ServiceRequest {
    @NotBlank @Size(max=150) public String name;
    public String description;
    @NotNull @Min(1)          public Integer duration;
    @NotNull @DecimalMin("0") public BigDecimal price;
}
