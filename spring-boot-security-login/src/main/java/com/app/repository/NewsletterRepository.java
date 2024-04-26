package com.app.repository;

import com.app.models.Newsletter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface NewsletterRepository extends JpaRepository<Newsletter, String> {
    // Custom query methods can be defined here if needed
    Optional<Newsletter> findByEmail(String email);
    boolean existsByEmail(String email);
}
