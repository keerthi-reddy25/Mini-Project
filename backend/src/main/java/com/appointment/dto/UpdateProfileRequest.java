package com.appointment.dto;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UpdateProfileRequest {
    @NotBlank @Size(min=2,max=100) public String name;
    @Pattern(regexp="^[0-9]{10}$") public String phone;
    public String address;
}
