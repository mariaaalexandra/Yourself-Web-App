package com.app.repository;

import com.app.models.ConstructiveFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConstructiveFeedbackRepository extends JpaRepository<ConstructiveFeedback, Long> {
    // Custom query methods can be defined here if needed
}
