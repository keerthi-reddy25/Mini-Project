package com.appointment.service;

import com.appointment.dto.*;
import com.appointment.entity.Service;
import com.appointment.exception.ResourceNotFoundException;
import com.appointment.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class ServiceManagementService {

    @Autowired private ServiceRepository serviceRepo;

    public List<ServiceDTO> getAll(boolean adminView) {
        List<Service> list = adminView ? serviceRepo.findAll() : serviceRepo.findByActiveTrue();
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ServiceDTO> search(String name) {
        return serviceRepo.findByActiveTrueAndNameContainingIgnoreCase(name)
            .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ServiceDTO getById(Long id) {
        return toDTO(serviceRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found")));
    }

    @Transactional
    public ServiceDTO create(ServiceRequest req) {
        Service s = Service.builder()
            .name(req.name).description(req.description)
            .duration(req.duration).price(req.price).active(true).build();
        return toDTO(serviceRepo.save(s));
    }

    @Transactional
    public ServiceDTO update(Long id, ServiceRequest req) {
        Service s = serviceRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        s.setName(req.name); s.setDescription(req.description);
        s.setDuration(req.duration); s.setPrice(req.price);
        return toDTO(serviceRepo.save(s));
    }

    @Transactional
    public void delete(Long id) {
        Service s = serviceRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        s.setActive(false);        // soft-delete
        serviceRepo.save(s);
    }

    private ServiceDTO toDTO(Service s) {
        return ServiceDTO.builder()
            .id(s.getId()).name(s.getName()).description(s.getDescription())
            .duration(s.getDuration()).price(s.getPrice()).active(s.isActive())
            .build();
    }
}
