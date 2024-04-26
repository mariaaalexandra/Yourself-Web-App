package com.app.security.services;

import com.app.models.Newsletter;
import com.app.repository.NewsletterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class NewsletterServiceImpl implements NewsletterService {

    @Autowired
    private JavaMailSender emailSender;

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

        // Save the newsletter to the database
        Newsletter savedNewsletter = newsletterRepository.save(newsletter);

        // Send email to the user
        sendSubscriptionConfirmationEmail(savedNewsletter.getEmail());

        return savedNewsletter;
    }

    // Method to send subscription confirmation email
    private void sendSubscriptionConfirmationEmail(String email) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Subscription Confirmation");
        message.setText("Thank you for subscribing to our newsletter!");

        emailSender.send(message);
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
