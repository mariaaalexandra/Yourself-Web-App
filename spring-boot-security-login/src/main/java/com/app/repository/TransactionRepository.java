package com.app.repository;

import com.app.models.Transaction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    long countByCategory(String category);

    @Query("SELECT SUM(t.balance) FROM Transaction t WHERE t.category = :category")
    Double sumBalanceByCategory(String category);

    @Query("SELECT COALESCE(SUM(t.balance), 0) FROM Transaction t WHERE t.category = :category " +
            "AND YEAR(t.date) = :year AND (MONTH(t.date) = :month OR MONTH(t.date) = LPAD(:month, 2, '0'))")
    Double sumBalanceByCategoryAndMonth(@Param("category") String category,
                                        @Param("year") int year,
                                        @Param("month") int month);


    @Query("SELECT MONTH(t.date), COALESCE(SUM(t.balance), 0) " +
            "FROM Transaction t " +
            "WHERE t.category = :category AND YEAR(t.date) = :year " +
            "GROUP BY MONTH(t.date) " +
            "ORDER BY MONTH(t.date)")
    List<Object[]> sumBalanceByCategoryForEachMonth(@Param("category") String category,
                                                    @Param("year") int year);

    @Query("SELECT t FROM Transaction t ORDER BY t.date DESC")
    List<Transaction> findLastFiveTransactions(Pageable pageable);

    List<Transaction> findAllByOrderByDateDesc();
}

