package com.app.security.services;



import com.app.models.Book;
import com.app.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository bookRepository;

    @Override
    public Book save(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public Book findOne(int id) {
        return bookRepository.findById(id).orElse(null);
    }

    @Override
    public List<Book> findAll() {
         List<Book> bookList = (List<Book>) bookRepository.findAll();

         List<Book> activeBookList = new ArrayList<>();

         for (Book book: bookList){
                 activeBookList.add(book);
         }
         return activeBookList;
    }

    @Override
    public List<Book> searchByTitle(String title) {
        List<Book> bookList = bookRepository.findByTitleContaining(title);
        System.out.println("title " + title);
        List<Book> activeBookList = new ArrayList<>();
        for (Book book: bookList){

                activeBookList.add(book);

        }
        return activeBookList;
    }

    public List<Book> getBooksByCategory(@RequestParam("category") String category) {
        return bookRepository.findByCategory(category);
    }

    public List<Book> getBooksSortedByPrice(@RequestParam("direction") String direction) {
        if (direction.equals("desc")) {
            return bookRepository.findAll(Sort.by(Sort.Direction.DESC, "ourPrice"));
        } else {
            return bookRepository.findAll(Sort.by(Sort.Direction.ASC, "ourPrice"));
        }
    }

    public List<Book> getBooksSorted(String sortParam) {
        Sort sort = Sort.unsorted();
        if (sortParam.contains(",")) {
            String[] params = sortParam.split(",");
            String field = params[0];
            Sort.Direction direction = params[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            sort = Sort.by(direction, field);
        }
        return bookRepository.findAll(sort);
    }


    @Override
    public void removeOne(int id) {
        bookRepository.deleteById(id);
    }
}
