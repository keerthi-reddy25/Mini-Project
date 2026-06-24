package com.appointment.repository;

import com.appointment.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByActiveTrue();
    List<Service> findByNameContainingIgnoreCase(String name);
    List<Service> findByActiveTrueAndNameContainingIgnoreCase(String name);
}
