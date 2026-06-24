package com.appointment.repository;

import com.appointment.entity.Appointment;
import com.appointment.entity.Appointment.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUserId(Long userId);
    List<Appointment> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Appointment> findByStatus(Status status);
    List<Appointment> findAllByOrderByCreatedAtDesc();

    List<Appointment> findByServiceIdAndAppointmentDateAndStatus(
            Long serviceId, LocalDate date, Status status);

    @Query("SELECT a FROM Appointment a WHERE " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:date IS NULL OR a.appointmentDate = :date)")
    List<Appointment> findByOptionalFilters(
            @Param("status") Status status,
            @Param("date") LocalDate date);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status")
    long countByStatus(@Param("status") Status status);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.appointmentDate = CURRENT_DATE")
    long countTodayAppointments();

    @Query("SELECT COUNT(DISTINCT a.user.id) FROM Appointment a")
    long countDistinctUsers();

    @Query("SELECT a FROM Appointment a WHERE " +
           "LOWER(a.user.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.service.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Appointment> searchAppointments(@Param("query") String query);
}
