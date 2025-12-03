package com.readhub.bookmanagement.service;

import com.readhub.bookmanagement.model.*;
import com.readhub.bookmanagement.repository.BookRepository;
import com.readhub.bookmanagement.repository.TransactionRepository;
import com.readhub.bookmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // 1. Student requests a book
    public Transaction requestBook(Long bookId, String userEmail) {
        User student = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Book is currently unavailable");
        }

        Transaction transaction = Transaction.builder()
                .user(student)
                .book(book)
                .status(TransactionStatus.PENDING)
                .build();

        Transaction savedTxn = transactionRepository.save(transaction);

        // --- NOTIFY ADMINS ---
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        for (User admin : admins) {
            String msg = "New Request: " + student.getFirstName() + " " + student.getLastName() + " requested '" + book.getTitle() + "'";
            notificationService.sendNotification(admin, msg, savedTxn);
        }

        return savedTxn;
    }

    // 2. Admin updates status
    @Transactional
    public Transaction updateStatus(Long transactionId, TransactionStatus newStatus, String adminEmail) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        switch (newStatus) {
            case APPROVED:
                if (transaction.getStatus() != TransactionStatus.PENDING) {
                    throw new RuntimeException("Can only approve PENDING requests");
                }
                transaction.setStatus(TransactionStatus.APPROVED);
                transaction.setAdmin(admin);
                // Student Message
                notificationService.sendNotification(transaction.getUser(), "Good news! Your request for '" + transaction.getBook().getTitle() + "' was APPROVED.", transaction);
                break;

            case REJECTED:
                if (transaction.getStatus() != TransactionStatus.PENDING) {
                    throw new RuntimeException("Can only reject PENDING requests");
                }
                transaction.setStatus(TransactionStatus.REJECTED);
                transaction.setAdmin(admin);
                // Student Message
                notificationService.sendNotification(transaction.getUser(), "Your request for '" + transaction.getBook().getTitle() + "' was REJECTED.", transaction);
                break;

            case BORROWED:
                if (transaction.getStatus() != TransactionStatus.APPROVED) {
                    throw new RuntimeException("Must be APPROVED first");
                }
                Book bookToBorrow = transaction.getBook();
                if (bookToBorrow.getAvailableCopies() <= 0) {
                    throw new RuntimeException("No copies left!");
                }
                
                bookToBorrow.setAvailableCopies(bookToBorrow.getAvailableCopies() - 1);
                bookRepository.save(bookToBorrow);

                transaction.setStatus(TransactionStatus.BORROWED);
                transaction.setBorrowDate(LocalDateTime.now());
                transaction.setDueDate(LocalDate.now().plusDays(7));
                
                // Student Message
                notificationService.sendNotification(transaction.getUser(), "You have successfully picked up '" + bookToBorrow.getTitle() + "'. Due date: " + transaction.getDueDate(), transaction);
                break;

            case RETURNED:
                if (transaction.getStatus() != TransactionStatus.BORROWED && transaction.getStatus() != TransactionStatus.OVERDUE) {
                    throw new RuntimeException("Invalid return");
                }
                Book bookToReturn = transaction.getBook();
                bookToReturn.setAvailableCopies(bookToReturn.getAvailableCopies() + 1);
                bookRepository.save(bookToReturn);

                transaction.setStatus(TransactionStatus.RETURNED);
                transaction.setActualReturnDate(LocalDateTime.now());
                
                // Student Message
                notificationService.sendNotification(transaction.getUser(), "Return confirmed for '" + bookToReturn.getTitle() + "'. Thank you!", transaction);
                break;

            default: 
                throw new RuntimeException("Invalid status transition");
        }

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    
    public List<Transaction> getMyHistory(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return transactionRepository.findByUser(user);
    }
}