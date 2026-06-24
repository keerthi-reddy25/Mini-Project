package com.appointment.service;

import com.appointment.dto.*;
import com.appointment.entity.User;
import com.appointment.exception.BadRequestException;
import com.appointment.repository.UserRepository;
import com.appointment.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authManager;
    @Autowired private JwtUtils jwtUtils;

    @Transactional
    public UserDTO register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.email)) {
            throw new BadRequestException("Email already registered.");
        }
        User user = User.builder()
            .name(req.name).email(req.email)
            .password(passwordEncoder.encode(req.password))
            .phone(req.phone).address(req.address)
            .role(User.Role.CUSTOMER).build();
        return UserDTO.from(userRepo.save(user));
    }

    public AuthResponse login(LoginRequest req) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.email, req.password));

        String token = jwtUtils.generateToken(auth);
        User user = userRepo.findByEmail(req.email)
            .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        return AuthResponse.builder()
            .token(token).type("Bearer")
            .id(user.getId()).name(user.getName())
            .email(user.getEmail()).role(user.getRole().name())
            .build();
    }
}
