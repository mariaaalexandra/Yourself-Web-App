package com.app.security.services;

import com.app.models.Newsletter;
import com.app.repository.NewsletterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class NewsletterServiceImpl implements NewsletterService {

    @Autowired
    private NewsletterRepository newsletterRepository;

    // Regular expression for a valid email address
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@(.+)$";

    @Override
    public Newsletter createNewsletter(Newsletter newsletter) {
        // Validate email format
        if (!isValidEmail(newsletter.getEmail())) {
            throw new IllegalArgumentException("Invalid email address format.");
        }

        // Check if the email already exists
        if (newsletterRepository.existsByEmail(newsletter.getEmail())) {
            throw new IllegalArgumentException("Email already exists in the database!");
        }

        // Proceed with insertion
        return newsletterRepository.save(newsletter);
    }

    // Validate email format using regex
    private boolean isValidEmail(String email) {
        return Pattern.matches(EMAIL_REGEX, email);
    }

    @Override
    public Newsletter updateNewsletter(String id, Newsletter newsletterData) {
        Newsletter newsletter = newsletterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Newsletter not found with id: " + id));
        newsletter.setEmail(newsletterData.getEmail());
        return newsletterRepository.save(newsletter);
    }

    @Override
    public void deleteNewsletter(String id) {
        newsletterRepository.deleteById(id);
    }

    @Override
    public List<Newsletter> getAllNewsletters() {
        return newsletterRepository.findAll();
    }

    @Override
    public Newsletter getNewsletterById(String id) {
        return newsletterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Newsletter not found with id: " + id));
    }
}
