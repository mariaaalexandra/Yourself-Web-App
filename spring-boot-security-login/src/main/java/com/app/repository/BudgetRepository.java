package com.app.repository;

import com.app.models.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    @Query("SELECT b.totalIncome FROM Budget b WHERE b.userId = ?1")
    Double findTotalIncomeByUserId(Long userId);
}
