package com.app.security.services;

import com.app.models.Newsletter;

import java.util.List;

public interface NewsletterService {
    Newsletter createNewsletter(Newsletter newsletter);
    Newsletter updateNewsletter(String id, Newsletter newsletterData);
    void deleteNewsletter(String id);
    List<Newsletter> getAllNewsletters();
    Newsletter getNewsletterById(String id);
}
