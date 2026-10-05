package com.spendwise.service;

import com.spendwise.dto.CategorySpendingResponse;
import com.spendwise.dto.DashboardSummaryResponse;
import com.spendwise.dto.RecentExpenseResponse;
import com.spendwise.entity.Expense;
import com.spendwise.entity.Subscription;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class DashboardService {

    private final ExpenseRepository expenseRepository;
    private final SubscriptionRepository subscriptionRepository;

    public DashboardService(
            ExpenseRepository expenseRepository,
            SubscriptionRepository subscriptionRepository) {

        this.expenseRepository = expenseRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    public DashboardSummaryResponse getDashboardSummary() {

        LocalDate today = LocalDate.now();

        YearMonth currentMonth = YearMonth.from(today);

        LocalDate monthStart = currentMonth.atDay(1);
        LocalDate monthEnd = currentMonth.atEndOfMonth();

        BigDecimal totalExpenses =
                expenseRepository.getTotalExpenses();

        BigDecimal currentMonthExpenses =
                expenseRepository.getExpensesBetween(
                        monthStart,
                        monthEnd
                );

        BigDecimal todayExpenses =
                expenseRepository.getExpensesBetween(
                        today,
                        today
                );

        long activeSubscriptions =
                subscriptionRepository.count();

        BigDecimal estimatedMonthlySubscriptionCost =
                calculateMonthlySubscriptionCost();

        List<CategorySpendingResponse> categorySpending =
                expenseRepository.getCategorySpending();

        List<RecentExpenseResponse> recentExpenses =
                expenseRepository.findTop5ByOrderByExpenseDateDescIdDesc()
                        .stream()
                        .map(this::mapRecentExpense)
                        .toList();

        return new DashboardSummaryResponse(
                totalExpenses,
                currentMonthExpenses,
                todayExpenses,
                activeSubscriptions,
                estimatedMonthlySubscriptionCost,
                categorySpending,
                recentExpenses
        );
    }

    private BigDecimal calculateMonthlySubscriptionCost() {

        List<Subscription> subscriptions =
                subscriptionRepository.findAll();

        BigDecimal monthlyCost = BigDecimal.ZERO;

        for (Subscription subscription : subscriptions) {

            BigDecimal amount = subscription.getAmount();

            switch (subscription.getBillingCycle()) {

                case WEEKLY:
                    monthlyCost = monthlyCost.add(
                            amount.multiply(BigDecimal.valueOf(52))
                                    .divide(
                                            BigDecimal.valueOf(12),
                                            2,
                                            RoundingMode.HALF_UP
                                    )
                    );
                    break;

                case MONTHLY:
                    monthlyCost = monthlyCost.add(amount);
                    break;

                case YEARLY:
                    monthlyCost = monthlyCost.add(
                            amount.divide(
                                    BigDecimal.valueOf(12),
                                    2,
                                    RoundingMode.HALF_UP
                            )
                    );
                    break;
            }
        }

        return monthlyCost.setScale(2, RoundingMode.HALF_UP);
    }

    private RecentExpenseResponse mapRecentExpense(
            Expense expense) {

        return new RecentExpenseResponse(
                expense.getId(),
                expense.getAmount(),
                expense.getCategory().getId(),
                expense.getCategory().getName(),
                expense.getDescription(),
                expense.getExpenseDate(),
                expense.getPaymentMethod()
        );
    }
}