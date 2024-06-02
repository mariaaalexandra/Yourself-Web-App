package com.app.security.services;


import com.app.models.Transaction;

import java.util.List;
import java.util.Map;

public interface TransactionService {
    Transaction saveTransaction(Transaction transaction);
    List<Transaction> getAllTransactions();
    Transaction getTransactionById(Long id);
    Transaction updateTransaction(Transaction transaction);
    void deleteTransaction(Long id);

    List<Double> getCategoryStats();

    List<List<Double>> getMonthlyCategoryStats();

    List<Transaction> getLastFiveTransactions();

}
