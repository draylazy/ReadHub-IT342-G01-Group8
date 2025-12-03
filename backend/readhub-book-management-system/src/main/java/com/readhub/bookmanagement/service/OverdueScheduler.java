package com.readhub.bookmanagement.service;

import com.readhub.bookmanagement.model.Transaction;
import com.readhub.bookmanagement.model.TransactionStatus;
import com.readhub.bookmanagement.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OverdueScheduler {

    private final TransactionRepository transactionRepository;
    private final NotificationService notificationService;

    // --- TEST MODE: Runs every 10 seconds ---
    // @Scheduled(fixedRate = 10000)
    @Scheduled(cron = "0 0 8 * * ?") // Runs every day at 8 AM
    @Transactional
    public void runScheduler() {
        System.out.println("--- ⏰ SCHEDULER TICK ---");
        checkOverdueBooks();
        checkUpcomingDueDates();
    }

    // 1. Mark items as OVERDUE
    public void checkOverdueBooks() {
        List<Transaction> overdueList = transactionRepository.findOverdueTransactions();

        if (!overdueList.isEmpty()) {
            System.out.println("⚠️ Found " + overdueList.size() + " overdue items.");
            
            for (Transaction txn : overdueList) {
                // Update Status
                txn.setStatus(TransactionStatus.OVERDUE);
                
                // Notify Student
                String message = "URGENT: '" + txn.getBook().getTitle() + "' is OVERDUE! (Due: " + txn.getDueDate() + "). Please return it immediately.";
                notificationService.sendNotification(txn.getUser(), message, txn);
            }
            transactionRepository.saveAll(overdueList);
        }
    }

    // 2. Send REMINDERS for items due in 2 days
    public void checkUpcomingDueDates() {
        LocalDate reminderDate = LocalDate.now().plusDays(2);
        List<Transaction> dueSoonList = transactionRepository.findByDueDate(reminderDate);

        if (!dueSoonList.isEmpty()) {
            System.out.println("ℹ️ Found " + dueSoonList.size() + " items due in 2 days.");
            
            for (Transaction txn : dueSoonList) {
                String message = "REMINDER: '" + txn.getBook().getTitle() + "' is due on " + txn.getDueDate() + " (2 days left).";
                notificationService.sendNotification(txn.getUser(), message, txn);
                
                System.out.println(" -> Sent reminder for Transaction ID " + txn.getTransactionId());
            }
        }
    }
}