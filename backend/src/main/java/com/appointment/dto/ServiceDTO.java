package com.appointment.dto;
import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ServiceDTO {
    private Long       id;
    private String     name;
    private String     description;
    private Integer    duration;
    private BigDecimal price;
    private boolean    active;
}
