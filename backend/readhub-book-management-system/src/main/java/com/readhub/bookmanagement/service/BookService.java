package com.readhub.bookmanagement.service;

import com.readhub.bookmanagement.dto.BookRequest;
import com.readhub.bookmanagement.model.Book;
import com.readhub.bookmanagement.model.Category;
import com.readhub.bookmanagement.repository.BookRepository;
import com.readhub.bookmanagement.repository.CategoryRepository;
import com.readhub.bookmanagement.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    // 1. Get All Books (UPDATED SEARCH)
    public List<Book> getAllBooks(String keyword) {
        if (keyword != null && !keyword.isEmpty()) {
            // Pass the keyword to Title, Author, AND ISBN checks
            return bookRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrIsbnContainingIgnoreCase(keyword, keyword, keyword);
        }
        return bookRepository.findAll();
    }

    // ... (Keep the rest of the file exactly the same: addBook, createCategory, updateBook, deleteBook) ...
    // 2. Add a new Book (Admin)
    public Book addBook(BookRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Book book = Book.builder()
                .isbn(request.getIsbn())
                .title(request.getTitle())
                .author(request.getAuthor())
                .publicationYear(request.getPublicationYear())
                .totalCopies(request.getTotalCopies())
                .availableCopies(request.getTotalCopies()) 
                .category(category)
                .build();

        return bookRepository.save(book);
    }
    
    public Category createCategory(String name) {
        if (categoryRepository.findByName(name).isPresent()) {
            throw new RuntimeException("Category already exists");
        }
        Category category = new Category();
        category.setName(name);
        return categoryRepository.save(category);
    }

    public Book updateBook(Long id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        book.setPublicationYear(request.getPublicationYear());
        book.setCategory(category);
        
        int difference = request.getTotalCopies() - book.getTotalCopies();
        book.setTotalCopies(request.getTotalCopies());
        book.setAvailableCopies(book.getAvailableCopies() + difference);

        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (transactionRepository.existsByBook(book)) {
            throw new RuntimeException("Cannot delete: This book is linked to active or past transactions.");
        }

        bookRepository.deleteById(id);
    }
}