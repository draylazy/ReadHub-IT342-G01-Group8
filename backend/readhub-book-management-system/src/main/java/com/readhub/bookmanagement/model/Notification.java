package com.readhub.bookmanagement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Who receives the notification

    @ManyToOne
    @JoinColumn(name = "transaction_id")
    private Transaction transaction; // Context (optional)

    private String message;
    
    private boolean isRead;
    
    private LocalDateTime sentDate;

    @PrePersist
    protected void onCreate() {
        this.sentDate = LocalDateTime.now();
        this.isRead = false;
    }
}