package com.readhub.bookmanagement.repository;

import com.readhub.bookmanagement.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    // UPDATED: Now searches Title OR Author OR ISBN
    List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrIsbnContainingIgnoreCase(String title, String author, String isbn);
    
    // Find all books in a specific category
    List<Book> findByCategory_Name(String categoryName);
}