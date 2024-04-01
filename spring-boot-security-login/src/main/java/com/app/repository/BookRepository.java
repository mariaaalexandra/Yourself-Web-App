package com.app.repository;


import com.app.models.Book;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface BookRepository extends JpaRepository<Book, Integer> {
    List<Book> findByTitleContaining(String title);

    List<Book> findByCategory(String category);

    List<Book> findAll(Sort sort);
}
