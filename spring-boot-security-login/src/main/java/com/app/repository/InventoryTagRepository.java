package com.app.repository;

import com.app.models.InventoryTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryTagRepository extends JpaRepository<InventoryTag, Long> {
    // Custom query methods can be defined here
    @Query("SELECT t FROM InventoryTag t WHERE t.title IS NOT NULL")
    List<InventoryTag> findAllNonNullTitles();
}
