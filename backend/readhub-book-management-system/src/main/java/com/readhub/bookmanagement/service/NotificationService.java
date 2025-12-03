package com.readhub.bookmanagement.service;

import com.readhub.bookmanagement.model.Notification;
import com.readhub.bookmanagement.model.Transaction;
import com.readhub.bookmanagement.model.User;
import com.readhub.bookmanagement.repository.NotificationRepository;
import com.readhub.bookmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService; // 1. Inject EmailService

    public void sendNotification(User user, String message, Transaction transaction) {
        // 2. Save Internal Notification (Bell Icon)
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .transaction(transaction)
                .isRead(false)
                .build();
        
        notificationRepository.save(notification);

        // 3. Send External Email (Gmail)
        // Check if user has a real email (contains @) to avoid errors with dummy data like "admin"
        if (user.getEmail() != null && user.getEmail().contains("@")) {
            String subject = "ReadHub Notification";
            
            // Make subject more specific if possible
            if (transaction != null) {
                subject = "ReadHub Update: " + transaction.getBook().getTitle();
            } else if (message.contains("URGENT")) {
                subject = "URGENT: ReadHub Overdue Alert";
            }

            // Fire and forget (Async)
            emailService.sendEmail(user.getEmail(), subject, message);
        }
    }

    public List<Notification> getMyNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUserOrderBySentDateDesc(user);
    }

    @Transactional
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Notification> unread = notificationRepository.findByUserAndIsReadFalse(user);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}