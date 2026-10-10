package com.spendwise.service;

import com.spendwise.dto.CategorySpendingResponse;
import com.spendwise.dto.DashboardSummaryResponse;
import com.spendwise.dto.RecentExpenseResponse;
import com.spendwise.entity.Expense;
import com.spendwise.entity.User;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.repository.SubscriptionRepository;
import com.spendwise.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
    private final UserRepository userRepository;

    public DashboardService(
            ExpenseRepository expenseRepository,
            SubscriptionRepository subscriptionRepository,
            UserRepository userRepository
    ) {
        this.expenseRepository = expenseRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    }

    public DashboardSummaryResponse getDashboardSummary() {

        User currentUser = getCurrentUser();
        Long userId = currentUser.getId();

        LocalDate today = LocalDate.now();

        YearMonth currentMonth = YearMonth.from(today);

        LocalDate monthStart =
                currentMonth.atDay(1);

        LocalDate monthEnd =
                currentMonth.atEndOfMonth();

        BigDecimal totalExpenses =
                expenseRepository.getTotalExpenses(userId);

        BigDecimal currentMonthExpenses =
                expenseRepository.getExpensesBetween(
                        userId,
                        monthStart,
                        monthEnd
                );

        BigDecimal todayExpenses =
                expenseRepository.getExpensesBetween(
                        userId,
                        today,
                        today
                );

        long activeSubscriptions =
        subscriptionRepository
                .countByUserIdAndActiveTrue(userId);

        BigDecimal estimatedMonthlySubscriptionCost =
                calculateMonthlySubscriptionCost();

        List<CategorySpendingResponse> categorySpending =
                expenseRepository.getCategorySpending(userId);

        List<Expense> recentExpenseEntities =
                expenseRepository
                        .findTop5ByUserIdOrderByExpenseDateDescIdDesc(
                                userId
                        );

        List<RecentExpenseResponse> recentExpenses =
                recentExpenseEntities.stream()
                        .map(this::mapToRecentExpense)
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

       return subscriptionRepository
        .findByUserIdAndActiveTrue(
                getCurrentUser().getId()
        )
        .stream()
                .map(subscription -> {

                    BigDecimal amount =
                            subscription.getAmount();

                    return switch (
                            subscription.getBillingCycle()
                    ) {
                        case WEEKLY ->
                                amount.multiply(
                                        BigDecimal.valueOf(52)
                                ).divide(
                                        BigDecimal.valueOf(12),
                                        2,
                                        RoundingMode.HALF_UP
                                );

                        case MONTHLY ->
                                amount;

                        case YEARLY ->
                                amount.divide(
                                        BigDecimal.valueOf(12),
                                        2,
                                        RoundingMode.HALF_UP
                                );
                    };
                })
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );
    }

    private RecentExpenseResponse mapToRecentExpense(
            Expense expense
    ) {

        RecentExpenseResponse response =
                new RecentExpenseResponse();

        response.setId(expense.getId());
        response.setDescription(expense.getDescription());
        response.setAmount(expense.getAmount());
        response.setExpenseDate(expense.getExpenseDate());

        if (expense.getCategory() != null) {
            response.setCategoryName(
                    expense.getCategory().getName()
            );
        }

        return response;
    }

    private User getCurrentUser() {

        Object principal =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        if (!(principal instanceof UserDetails userDetails)) {
            throw new IllegalStateException(
                    "Authenticated user not found"
            );
        }

        return userRepository.findByEmail(
                        userDetails.getUsername()
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Authenticated user not found"
                        )
                );
    }
}