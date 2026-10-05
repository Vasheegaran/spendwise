package com.spendwise.repository;

import com.spendwise.entity.Expense;
import com.spendwise.entity.PaymentMethod;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public final class ExpenseSpecification {

    private ExpenseSpecification() {
    }

    public static Specification<Expense> hasSearch(String search) {

        return (root, query, criteriaBuilder) -> {

            if (search == null || search.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            String pattern = "%" + search.trim().toLowerCase() + "%";

            return criteriaBuilder.or(
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("description")),
                            pattern
                    ),
                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("category").get("name")),
                            pattern
                    )
            );
        };
    }

    public static Specification<Expense> hasCategory(Long categoryId) {

        return (root, query, criteriaBuilder) -> {

            if (categoryId == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("category").get("id"),
                    categoryId
            );
        };
    }

    public static Specification<Expense> hasPaymentMethod(
            PaymentMethod paymentMethod) {

        return (root, query, criteriaBuilder) -> {

            if (paymentMethod == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("paymentMethod"),
                    paymentMethod
            );
        };
    }

    public static Specification<Expense> hasStartDate(
            LocalDate startDate) {

        return (root, query, criteriaBuilder) -> {

            if (startDate == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.greaterThanOrEqualTo(
                    root.get("expenseDate"),
                    startDate
            );
        };
    }

    public static Specification<Expense> hasEndDate(
            LocalDate endDate) {

        return (root, query, criteriaBuilder) -> {

            if (endDate == null) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.lessThanOrEqualTo(
                    root.get("expenseDate"),
                    endDate
            );
        };
    }
}