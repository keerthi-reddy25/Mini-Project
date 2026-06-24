package com.appointment.dto;
import lombok.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class DashboardStats {
    private long totalUsers;
    private long totalServices;
    private long totalAppointments;
    private long pendingAppointments;
    private long approvedAppointments;
    private long rejectedAppointments;
    private long cancelledAppointments;
    private long todayAppointments;
}
