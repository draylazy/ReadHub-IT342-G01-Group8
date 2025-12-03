package com.readhub.bookmanagement.dto; // Must match folder
import lombok.Data;

@Data
public class BookRequest {
    private String isbn;
    private String title;
    private String author;
    private Integer publicationYear;
    private int totalCopies;
    private Long categoryId;
}