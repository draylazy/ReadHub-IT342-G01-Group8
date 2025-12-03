package com.readhub.bookmanagement.controller;

import com.readhub.bookmanagement.dto.TransactionRequest;
import com.readhub.bookmanagement.model.Transaction;
import com.readhub.bookmanagement.model.TransactionStatus;
import com.readhub.bookmanagement.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    // Student: Request to borrow a book
    @PostMapping("/borrow")
    // FIX: Allow ADMIN to borrow too (for testing purposes)
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')") 
    public ResponseEntity<Transaction> borrowBook(@RequestBody TransactionRequest request, Authentication authentication) {
        String email = authentication.getName(); // Get email from JWT
        return ResponseEntity.ok(transactionService.requestBook(request.getBookId(), email));
    }

    // Admin: Update status (Approve, Reject, Confirm Borrow, Confirm Return)
    @PutMapping("/{id}/status")
    // Keep this as ADMIN only (Students shouldn't approve their own requests!)
    @PreAuthorize("hasRole('ADMIN')") 
    public ResponseEntity<Transaction> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            Authentication authentication
    ) {
        String adminEmail = authentication.getName();
        TransactionStatus status = TransactionStatus.valueOf(payload.get("status"));
        return ResponseEntity.ok(transactionService.updateStatus(id, status, adminEmail));
    }

    // Admin: View all transactions
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    // Student: View my history
    @GetMapping("/my-history")
    public ResponseEntity<List<Transaction>> getMyHistory(Authentication authentication) {
        return ResponseEntity.ok(transactionService.getMyHistory(authentication.getName()));
    }
}