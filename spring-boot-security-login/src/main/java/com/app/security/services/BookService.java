package com.app.security.services;


import com.app.models.Book;

import java.util.List;

public interface BookService {

    Book save(Book book);
    Book findOne(int id);
    List<Book> findAll();
    List<Book> searchByTitle(String title);
    void removeOne(int id);

    List<Book> getBooksByCategory(String category);

    List<Book> getBooksSortedByPrice(String direction);

    List<Book> getBooksSorted(String sortProperties);
}
