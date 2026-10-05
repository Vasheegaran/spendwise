
package com.spendwise.dto;

import java.math.BigDecimal;

public class CategorySpendingResponse {

    private Long categoryId;
    private String categoryName;
    private BigDecimal totalAmount;

    public CategorySpendingResponse() {
    }

    public CategorySpendingResponse(
            Long categoryId,
            String categoryName,
            BigDecimal totalAmount) {

        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.totalAmount = totalAmount;
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

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}
