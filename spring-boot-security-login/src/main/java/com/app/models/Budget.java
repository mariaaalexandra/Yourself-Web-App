package com.app.models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name = "budgets")
public class Budget {
    @Id
    private Long userId;

    private Double creditCard;

    private Double debitCard;

    private Double mealVouchers;

    private Double holidayVouchers;

    private Double totalIncome;

    // Getters and setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getCreditCard() {
        return creditCard;
    }

    public void setCreditCard(Double creditCard) {
        this.creditCard = creditCard;
    }

    public Double getDebitCard() {
        return debitCard;
    }

    public void setDebitCard(Double debitCard) {
        this.debitCard = debitCard;
    }

    public Double getMealVouchers() {
        return mealVouchers;
    }

    public void setMealVouchers(Double mealVouchers) {
        this.mealVouchers = mealVouchers;
    }

    public Double getHolidayVouchers() {
        return holidayVouchers;
    }

    public void setHolidayVouchers(Double holidayVouchers) {
        this.holidayVouchers = holidayVouchers;
    }

    public Double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(Double totalIncome) {
        this.totalIncome = totalIncome;
    }
}
