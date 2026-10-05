package com.spendwise.repository;

import com.spendwise.dto.CategorySpendingResponse;
import com.spendwise.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository
        extends JpaRepository<Expense, Long>,
                JpaSpecificationExecutor<Expense> {

    @Query("""
            SELECT COALESCE(SUM(e.amount), 0)
            FROM Expense e
            """)
    BigDecimal getTotalExpenses();

    @Query("""
            SELECT COALESCE(SUM(e.amount), 0)
            FROM Expense e
            WHERE e.expenseDate BETWEEN :startDate AND :endDate
            """)
    BigDecimal getExpensesBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
            SELECT new com.spendwise.dto.CategorySpendingResponse(
                c.id,
                c.name,
                SUM(e.amount)
            )
            FROM Expense e
            JOIN e.category c
            GROUP BY c.id, c.name
            ORDER BY SUM(e.amount) DESC
            """)
    List<CategorySpendingResponse> getCategorySpending();

    List<Expense> findTop5ByOrderByExpenseDateDescIdDesc();
}