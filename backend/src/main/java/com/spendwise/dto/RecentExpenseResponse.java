
package com.spendwise.dto;

import com.spendwise.entity.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RecentExpenseResponse {

    private Long id;
    private BigDecimal amount;
    private Long categoryId;
    private String categoryName;
    private String description;
    private LocalDate expenseDate;
    private PaymentMethod paymentMethod;

    public RecentExpenseResponse() {
    }

    public RecentExpenseResponse(
            Long id,
            BigDecimal amount,
            Long categoryId,
            String categoryName,
            String description,
            LocalDate expenseDate,
            PaymentMethod paymentMethod) {

        this.id = id;
        this.amount = amount;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.description = description;
        this.expenseDate = expenseDate;
        this.paymentMethod = paymentMethod;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
