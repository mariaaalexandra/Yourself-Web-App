package com.app.controllers;

import com.app.models.Book;
import com.app.security.services.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.List;


@RestController
@RequestMapping("/book")
@CrossOrigin(origins = "http://localhost:8081")
public class BookController {

    @Autowired
    private BookService bookService;

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Book addBook(@RequestBody Book book) {
      return  bookService.save(book);
    }

    @RequestMapping(value = "/books", method = RequestMethod.GET)
    public List<Book> getBooksByCategory(@RequestParam("category") String category) {
        return bookService.getBooksByCategory(category);
    }

    @GetMapping("/sort")
    public ResponseEntity<List<Book>> getBooksSorted(@RequestParam("sort") String sortParam) {
        List<Book> books = bookService.getBooksSorted(sortParam);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }



    @RequestMapping(value = "/add/image", method = RequestMethod.POST)
    public ResponseEntity uploadImage(@RequestParam("id") int id, HttpServletResponse response, HttpServletRequest request) {
        try {
        Book book = bookService.findOne(id);
        System.out.println(book);
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        Iterator<String> it = multipartRequest.getFileNames();
        MultipartFile multipartFile = multipartRequest.getFile(it.next());
        String fileName = id+".jpg";

        byte[] bytes = multipartFile.getBytes();
        BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File("src/main/resources/static/image/book/"+ fileName)));
        stream.write(bytes);
        stream.close();

            // Additional path
        String additionalPath = "../../../../../../../../../../angular-15-client/src/assets/image/"; // Set this to your new path
        BufferedOutputStream stream2 = new BufferedOutputStream(new FileOutputStream(new File("../angular-15-client/src/assets/image/book" + fileName)));
        stream2.write(bytes);
        stream2.close();
            return new ResponseEntity("Upload Success!", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity("Upload Failed!", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/bookList")
    @CrossOrigin(origins = "http://localhost:8081")
    @RequestMapping("/bookList")
    public List<Book> getBookList() {
      return bookService.findAll();
    }

    @RequestMapping("/{id}")
    public Book getBook(@PathVariable("id") int id) {
        Book book = bookService.findOne(id);
        return book;
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public Book updateBook(@RequestBody Book book) {
        return bookService.save(book);
    }

    @RequestMapping(value = "/update/image", method = RequestMethod.POST)
    public ResponseEntity updateImage(@RequestParam("id") int id, HttpServletRequest request, HttpServletResponse response) {
        try {
            Book book = bookService.findOne(id);
            MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
            Iterator<String> it = multipartRequest.getFileNames();
            MultipartFile multipartFile = multipartRequest.getFile(it.next());
            String fileName = id+".png";

            Files.delete(Paths.get("src/main/resources/static/image/book/"+ fileName));

            byte[] bytes = multipartFile.getBytes();
            BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File("src/main/resources/static/image/book/"+ fileName)));
            stream.write(bytes);
            stream.close();
            return new ResponseEntity("Upload Success!", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity("Upload Failed!", HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(value = "/remove", method = RequestMethod.POST)
    public ResponseEntity removeBook(@RequestBody String id) throws IOException {
        bookService.removeOne(Integer.parseInt(id));
        return new ResponseEntity("Remove Success!", HttpStatus.OK);
    }
    @CrossOrigin(origins = "http://localhost:8081")
    @RequestMapping(value = "/search", method = RequestMethod.POST)
    public List<Book> searchByTitle(@RequestBody String keyword) {
        List<Book> bookList = bookService.searchByTitle(keyword);
        return bookList;
    }

    @PutMapping("/setCompletion/{id}")
    public Book setActiveStatus(@PathVariable("id") int id, @RequestParam("active") boolean active) {
        Book book = bookService.findOne(id);
        if (book != null) {
            book.setActive(active);
            bookService.save(book); // Save the updated object
            return book;
        } else {
            throw new NullPointerException("Object with ID " + id + " not found.");
        }
    }
}
