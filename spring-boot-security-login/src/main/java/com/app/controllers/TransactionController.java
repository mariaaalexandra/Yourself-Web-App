package com.app.controllers;

import com.app.models.Budget;
import com.app.models.Transaction;
import com.app.security.services.BudgetService;
import com.app.security.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    private BudgetService budgetService;


    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.saveTransaction(transaction));
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @PutMapping
    public ResponseEntity<Transaction> updateTransaction(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.updateTransaction(transaction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok("Transaction deleted successfully");
    }

    @GetMapping("/category-stats")
    public List<Double> getCategoryStats() {
        return transactionService.getCategoryStats();
    }

    @GetMapping("/monthly")
    public List<List<Double>> getMonthlyCategoryStats() {
        return transactionService.getMonthlyCategoryStats();
    }

    @PostMapping("/budgets")
    public ResponseEntity<Budget> addBudget(@RequestBody Budget budget) {
        Double totalIncome = budget.getCreditCard() + budget.getDebitCard() + budget.getHolidayVouchers() + budget.getMealVouchers();
        budget.setTotalIncome(totalIncome);
        Budget savedBudget = budgetService.saveBudget(budget);

        return ResponseEntity.ok(savedBudget);
    }

    @GetMapping("/budgets/totalIncome")
    public ResponseEntity<Double> getTotalIncomeByUserId(@RequestParam Long userId) {
        Double totalIncome = budgetService.getTotalIncomeByUserId(userId);
        if (totalIncome != null) {
            return ResponseEntity.ok(totalIncome);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/transactions/last5")
    public ResponseEntity<List<Transaction>> getLastFiveTransactions() {
        List<Transaction> transactions = transactionService.getLastFiveTransactions();
        if (transactions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(transactions);
    }
}
