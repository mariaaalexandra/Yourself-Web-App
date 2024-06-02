package com.app.security.services;

import com.app.models.Budget;

import com.app.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BudgetServiceImpl implements BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Override
    @Transactional
    public Budget saveBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    @Override
    public Double getTotalIncomeByUserId(Long userId) {
        return budgetRepository.findTotalIncomeByUserId(userId);
    }


}
