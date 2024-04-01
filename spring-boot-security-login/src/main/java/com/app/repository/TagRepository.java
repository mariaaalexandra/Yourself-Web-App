package com.app.repository;

import com.app.models.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, String> {
    // You can define custom query methods here if needed
    @Query("SELECT t FROM Tag t JOIN t.userId u WHERE u = :userId")
    List<Tag> findByUserId(@Param("userId") Long userId);
}
