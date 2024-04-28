package com.app.controllers;

import com.app.models.Newsletter;
import com.app.security.services.NewsletterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
@CrossOrigin(origins = "http://localhost:8081")
public class NewsletterController {

    @Autowired
    private NewsletterService newsletterService;

    @PostMapping
    public ResponseEntity<Newsletter> createNewsletter(@RequestBody Newsletter newsletter) {
        return ResponseEntity.ok(newsletterService.createNewsletter(newsletter));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Newsletter> updateNewsletter(@PathVariable String id, @RequestBody Newsletter newsletter) {
        return ResponseEntity.ok(newsletterService.updateNewsletter(id, newsletter));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNewsletter(@PathVariable String id) {
        newsletterService.deleteNewsletter(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Newsletter>> getAllNewsletters() {
        return ResponseEntity.ok(newsletterService.getAllNewsletters());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Newsletter> getNewsletterById(@PathVariable String id) {
        return ResponseEntity.ok(newsletterService.getNewsletterById(id));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
}
