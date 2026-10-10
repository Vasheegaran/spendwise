package com.spendwise.repository;

import com.spendwise.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository
        extends JpaRepository<Expense, Long>,
        JpaSpecificationExecutor<Expense> {

    @Query("""
        SELECT COALESCE(SUM(e.amount), 0)
        FROM Expense e
        WHERE e.user.id = :userId
        """)
    BigDecimal getTotalExpenses(@Param("userId") Long userId);

    @Query("""
        SELECT COALESCE(SUM(e.amount), 0)
        FROM Expense e
        WHERE e.user.id = :userId
        AND e.expenseDate BETWEEN :startDate AND :endDate
        """)
    BigDecimal getExpensesBetween(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
        SELECT new com.spendwise.dto.CategorySpendingResponse(
            c.id, c.name, SUM(e.amount)
        )
        FROM Expense e
        JOIN e.category c
        WHERE e.user.id = :userId
        GROUP BY c.id, c.name
        ORDER BY SUM(e.amount) DESC
        """)
    List<com.spendwise.dto.CategorySpendingResponse> getCategorySpending(
            @Param("userId") Long userId
    );

    List<Expense> findTop5ByUserIdOrderByExpenseDateDescIdDesc(
            Long userId
    );

    Optional<Expense> findByIdAndUserId(Long id, Long userId);
}