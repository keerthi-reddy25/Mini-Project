package com.appointment.dto;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RegisterRequest {
    @NotBlank @Size(min=2,max=100) public String name;
    @NotBlank @Email               public String email;
    @NotBlank @Size(min=6,max=40)  public String password;
    @Pattern(regexp="^[0-9]{10}$") public String phone;
    public String address;
}
