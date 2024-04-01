package com.app.repository;

import com.app.models.TaskManagement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskManagementRepository extends JpaRepository<TaskManagement, Integer> {
    // You can define custom query methods here if needed

    @Query("SELECT tm FROM TaskManagement tm JOIN tm.userId u WHERE u = :userId")
    List<TaskManagement> findByUserId(@Param("userId") Long userId);
}
