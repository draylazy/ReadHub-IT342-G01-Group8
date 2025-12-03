package com.readhub.bookmanagement.controller;

import com.readhub.bookmanagement.dto.BookRequest;
import com.readhub.bookmanagement.model.Book;
import com.readhub.bookmanagement.model.Category;
import com.readhub.bookmanagement.repository.CategoryRepository;
import com.readhub.bookmanagement.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;
    private final CategoryRepository categoryRepository;

    // Public: Search or List all books
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(bookService.getAllBooks(keyword));
    }

    // Admin Only: Add a new book
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> addBook(@RequestBody BookRequest request) {
        return ResponseEntity.ok(bookService.addBook(request));
    }

    // --- NEW: Update Book ---
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody BookRequest request) {
        return ResponseEntity.ok(bookService.updateBook(id, request));
    }

    // --- NEW: Delete Book ---
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok("Book deleted successfully");
    }

    // Admin Only: Create a Category
    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> addCategory(@RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(bookService.createCategory(payload.get("name")));
    }

    // Temporary Fix Endpoint
    @GetMapping("/fix-categories")
    public ResponseEntity<String> fixCategories() {
        if (categoryRepository.count() == 0) {
            Category c1 = new Category(); c1.setName("Technology");
            Category c2 = new Category(); c2.setName("Science");
            Category c3 = new Category(); c3.setName("Fiction");
            Category c4 = new Category(); c4.setName("Self-help");
            Category c5 = new Category(); c4.setName("Other");
            categoryRepository.saveAll(Arrays.asList(c1, c2, c3, c4, c5));
            return ResponseEntity.ok("Fixed! Categories created.");
        }
        return ResponseEntity.ok("Categories already exist.");
    }
}