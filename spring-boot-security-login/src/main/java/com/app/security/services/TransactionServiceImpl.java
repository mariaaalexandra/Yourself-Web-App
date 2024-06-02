package com.app.security.services;


import com.app.models.Transaction;
import com.app.repository.TransactionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import javax.persistence.TypedQuery;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @Override
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllByOrderByDateDesc();
    }

    @Override
    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id).orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    @Override
    public Transaction updateTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    @Override
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    @Override
    public List<Double> getCategoryStats() {
        String[] categories = {
                "Investments",
                "House expenses",
                "Credit loan",
                "Income",
                "Business",
                "Free Time",
                "Presents",
                "Holidays"
        };

        int currentYear = LocalDate.now().getYear();
        int currentMonth = LocalDate.now().getMonthValue();

        List<Double> categoryStats = Stream.of(categories)
                .map(category -> {
                    Double sum = transactionRepository.sumBalanceByCategoryAndMonth(category, currentYear, currentMonth);
                    return sum != null ? sum : 0.0; // Replace null with 0.0
                })
                .collect(Collectors.toList());

        return categoryStats;
    }


    @Override
    public List<List<Double>> getMonthlyCategoryStats() {
        String[] categories = {
                "Investments", "House expenses", "Credit loan", "Income",
                "Business", "Free Time", "Presents", "Holidays"
        };

        int currentYear = LocalDate.now().getYear();
        List<List<Double>> allCategoryStats = new ArrayList<>();

        for (String category : categories) {
            List<Double> monthlySums = new ArrayList<>(Collections.nCopies(12, 0.0)); // Initialize with 0.0 for each month
            List<Object[]> monthlyResults = transactionRepository.sumBalanceByCategoryForEachMonth(category, currentYear);

            for (Object[] result : monthlyResults) {
                Integer monthIndex = (Integer) result[0] - 1; // MONTH returns 1-12, list index is 0-11
                Double sum = (Double) result[1];
                monthlySums.set(monthIndex, sum);
            }

            allCategoryStats.add(monthlySums);
        }

        return allCategoryStats;
    }

    @Override
    public List<Transaction> getLastFiveTransactions() {
        return transactionRepository.findLastFiveTransactions(PageRequest.of(0, 5));
    }

}
