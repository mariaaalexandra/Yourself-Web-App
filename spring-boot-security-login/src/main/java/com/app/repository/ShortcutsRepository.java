package com.app.repository;

import com.app.models.Shortcuts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShortcutsRepository extends JpaRepository<Shortcuts, String> {
    // Custom query methods can be defined here if needed
}
