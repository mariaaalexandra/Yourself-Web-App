package com.app.security.services;

import com.app.models.Budget;

public interface BudgetService {
    Budget saveBudget(Budget budget);

    Double getTotalIncomeByUserId(Long userId);

}
