package com.readhub.bookmanagement.service;

import com.readhub.bookmanagement.dto.AuthResponse;
import com.readhub.bookmanagement.dto.LoginRequest;
import com.readhub.bookmanagement.dto.RegisterRequest;
import com.readhub.bookmanagement.model.Role;
import com.readhub.bookmanagement.model.User;
import com.readhub.bookmanagement.repository.UserRepository;
import com.readhub.bookmanagement.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // Fix: Use Builder correctly with the fields from our User.java
        var user = User.builder()
                .firstName(request.getFirstName()) // Matches User.java
                .lastName(request.getLastName())   // Matches User.java
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword())) // Matches User.java (passwordHash)
                .role(Role.STUDENT) // Fix: Use the Enum constant directly
                .build();

        userRepository.save(user);

        // Generate token
        var jwtToken = jwtUtils.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        ));

        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var jwtToken = jwtUtils.generateToken(new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        ));

        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }
}