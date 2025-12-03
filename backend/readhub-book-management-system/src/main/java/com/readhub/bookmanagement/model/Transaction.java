package com.readhub.bookmanagement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    // The Student borrowing the book
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // The Book being borrowed
    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    // The Admin who approved the request (Optional until approved)
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private User admin;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    private LocalDateTime requestDate;
    private LocalDateTime borrowDate;
    private LocalDate dueDate;
    private LocalDateTime actualReturnDate;

    @PrePersist
    protected void onCreate() {
        this.requestDate = LocalDateTime.now();
        if (this.status == null) {
            this.status = TransactionStatus.PENDING;
        }
    }
}