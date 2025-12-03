package com.readhub.bookmanagement.controller;

import com.readhub.bookmanagement.model.Notification;
import com.readhub.bookmanagement.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // Endpoint to get notifications for the logged-in user
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        String email = authentication.getName();
        // Ensure you have a service method to get notifications by email
        return ResponseEntity.ok(notificationService.getMyNotifications(email));
    }

    @org.springframework.web.bind.annotation.PutMapping("/read") // PUT /api/notifications/read
    public ResponseEntity<Void> markAsRead(Authentication authentication) {
        notificationService.markAllAsRead(authentication.getName());
        return ResponseEntity.ok().build();
    }
}