package com.readhub.bookmanagement.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookId;

    @Column(unique = true, nullable = false)
    private String isbn;

    @Column(nullable = false)
    private String title;

    private String author;
    private Integer publicationYear;

    private int totalCopies;
    private int availableCopies;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}