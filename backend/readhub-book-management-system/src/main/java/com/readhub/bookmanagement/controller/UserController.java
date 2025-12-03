package com.readhub.bookmanagement.controller;

import com.readhub.bookmanagement.dto.UserProfileDto;
import com.readhub.bookmanagement.dto.UserUpdateDto;
import com.readhub.bookmanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List; // <--- THIS WAS MISSING

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // --- CURRENT USER ENDPOINTS ---

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMyProfile(Authentication authentication) {
        String email = authentication.getName(); 
        return ResponseEntity.ok(userService.getCurrentUserProfile(email));
    }

    @PutMapping("/me")
    public ResponseEntity<String> updateMyProfile(@RequestBody UserUpdateDto request, Authentication authentication) {
        String email = authentication.getName();
        userService.updateUserProfile(email, request);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("avatar") MultipartFile file, Authentication authentication) {
        String email = authentication.getName();
        try {
            String fileUrl = userService.uploadAvatar(email, file);
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to upload avatar");
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteMyAccount(Authentication authentication) {
        String email = authentication.getName();
        userService.deleteAccount(email);
        return ResponseEntity.ok("Account deleted successfully");
    }

    // --- ADMIN ENDPOINTS (FR-10) ---

    // 1. List All Students
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfileDto>> getAllStudents() {
        return ResponseEntity.ok(userService.getAllStudents());
    }

    // 2. Delete Specific User
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}