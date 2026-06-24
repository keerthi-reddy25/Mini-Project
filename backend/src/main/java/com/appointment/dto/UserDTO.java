package com.appointment.dto;
import com.appointment.entity.User;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class UserDTO {
    private Long   id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String role;
    private boolean active;
    private LocalDateTime createdAt;

    public static UserDTO from(User u) {
        return UserDTO.builder()
            .id(u.getId()).name(u.getName()).email(u.getEmail())
            .phone(u.getPhone()).address(u.getAddress())
            .role(u.getRole().name()).active(u.isActive())
            .createdAt(u.getCreatedAt()).build();
    }
}
