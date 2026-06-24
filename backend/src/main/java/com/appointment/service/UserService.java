package com.appointment.service;

import com.appointment.dto.*;
import com.appointment.entity.User;
import com.appointment.exception.*;
import com.appointment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;

    public List<UserDTO> getAllCustomers() {
        return userRepo.findByRole(User.Role.CUSTOMER)
            .stream().map(UserDTO::from).collect(Collectors.toList());
    }

    public UserDTO getProfile(String email) {
        return UserDTO.from(userRepo.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found")));
    }

    @Transactional
    public UserDTO updateProfile(String email, UpdateProfileRequest req) {
        User u = userRepo.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        u.setName(req.name); u.setPhone(req.phone); u.setAddress(req.address);
        return UserDTO.from(userRepo.save(u));
    }

    @Transactional
    public void toggleActive(Long userId) {
        User u = userRepo.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        u.setActive(!u.isActive());
        userRepo.save(u);
    }

    public List<UserDTO> search(String query) {
        return userRepo.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query)
            .stream().map(UserDTO::from).collect(Collectors.toList());
    }
}
