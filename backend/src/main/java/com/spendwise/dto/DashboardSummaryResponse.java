
package com.spendwise.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryResponse {

    private BigDecimal totalExpenses;
    private BigDecimal currentMonthExpenses;
    private BigDecimal todayExpenses;
    private long activeSubscriptions;
    private BigDecimal estimatedMonthlySubscriptionCost;
    private List<CategorySpendingResponse> categorySpending;
    private List<RecentExpenseResponse> recentExpenses;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(
            BigDecimal totalExpenses,
            BigDecimal currentMonthExpenses,
            BigDecimal todayExpenses,
            long activeSubscriptions,
            BigDecimal estimatedMonthlySubscriptionCost,
            List<CategorySpendingResponse> categorySpending,
            List<RecentExpenseResponse> recentExpenses) {

        this.totalExpenses = totalExpenses;
        this.currentMonthExpenses = currentMonthExpenses;
        this.todayExpenses = todayExpenses;
        this.activeSubscriptions = activeSubscriptions;
        this.estimatedMonthlySubscriptionCost =
                estimatedMonthlySubscriptionCost;
        this.categorySpending = categorySpending;
        this.recentExpenses = recentExpenses;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getCurrentMonthExpenses() {
        return currentMonthExpenses;
    }

    public void setCurrentMonthExpenses(BigDecimal currentMonthExpenses) {
        this.currentMonthExpenses = currentMonthExpenses;
    }

    public BigDecimal getTodayExpenses() {
        return todayExpenses;
    }

    public void setTodayExpenses(BigDecimal todayExpenses) {
        this.todayExpenses = todayExpenses;
    }

    public long getActiveSubscriptions() {
        return activeSubscriptions;
    }

    public void setActiveSubscriptions(long activeSubscriptions) {
        this.activeSubscriptions = activeSubscriptions;
    }

    public BigDecimal getEstimatedMonthlySubscriptionCost() {
        return estimatedMonthlySubscriptionCost;
    }

    public void setEstimatedMonthlySubscriptionCost(
            BigDecimal estimatedMonthlySubscriptionCost) {

        this.estimatedMonthlySubscriptionCost =
                estimatedMonthlySubscriptionCost;
    }

    public List<CategorySpendingResponse> getCategorySpending() {
        return categorySpending;
    }

    public void setCategorySpending(
            List<CategorySpendingResponse> categorySpending) {

        this.categorySpending = categorySpending;
    }

    public List<RecentExpenseResponse> getRecentExpenses() {
        return recentExpenses;
    }

    public void setRecentExpenses(
            List<RecentExpenseResponse> recentExpenses) {

        this.recentExpenses = recentExpenses;
    }
}
