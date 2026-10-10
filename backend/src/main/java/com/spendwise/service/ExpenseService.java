package com.spendwise.service;

import com.spendwise.dto.ExpenseRequest;
import com.spendwise.dto.ExpenseResponse;
import com.spendwise.entity.Category;
import com.spendwise.entity.Expense;
import com.spendwise.entity.User;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.repository.ExpenseRepository;
import com.spendwise.repository.ExpenseSpecification;
import com.spendwise.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.spendwise.entity.PaymentMethod;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository
    ) {
        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public List<ExpenseResponse> getAllExpenses() {

        return getAllExpenses(
                null,
                null,
                null,
                null,
                null,
                Pageable.unpaged()
        ).getContent();
    }

    public Page<ExpenseResponse> getAllExpenses(
            String search,
            Long categoryId,
            PaymentMethod paymentMethod,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    ) {

        Long userId = getCurrentUser().getId();

        Specification<Expense> specification =
                Specification
                        .where(ExpenseSpecification.hasSearch(search))
                        .and(ExpenseSpecification.hasCategory(categoryId))
                        .and(ExpenseSpecification.hasPaymentMethod(paymentMethod))
                        .and(ExpenseSpecification.hasStartDate(startDate))
                        .and(ExpenseSpecification.hasEndDate(endDate))
                        .and((root, query, criteriaBuilder) ->
                                criteriaBuilder.equal(
                                        root.get("user").get("id"),
                                        userId
                                )
                        );

        return expenseRepository
                .findAll(specification, pageable)
                .map(this::mapToResponse);
    }

    public ExpenseResponse getExpenseById(Long id) {

        Long userId = getCurrentUser().getId();

        Expense expense = expenseRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Expense not found with id: " + id
                        )
                );

        return mapToResponse(expense);
    }

    public ExpenseResponse createExpense(ExpenseRequest request) {

        User user = getCurrentUser();

        Expense expense = mapToEntity(request);
        expense.setUser(user);

        Expense savedExpense =
                expenseRepository.save(expense);

        return mapToResponse(savedExpense);
    }

    public ExpenseResponse updateExpense(
            Long id,
            ExpenseRequest request
    ) {

        Long userId = getCurrentUser().getId();

        Expense expense = expenseRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Expense not found with id: " + id
                        )
                );

        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setPaymentMethod(request.getPaymentMethod());

        Category category =
                findCategoryById(request.getCategoryId());

        expense.setCategory(category);

        Expense updatedExpense =
                expenseRepository.save(expense);

        return mapToResponse(updatedExpense);
    }

    public void deleteExpense(Long id) {

        Long userId = getCurrentUser().getId();

        Expense expense = expenseRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Expense not found with id: " + id
                        )
                );

        expenseRepository.delete(expense);
    }

    private User getCurrentUser() {

        Object principal =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        String email;

        if (principal instanceof UserDetails userDetails) {
            email = userDetails.getUsername();
        } else {
            throw new IllegalStateException(
                    "Authenticated user not found"
            );
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user not found"
                        )
                );
    }

    private Category findCategoryById(Long categoryId) {

        return categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found with id: "
                                        + categoryId
                        )
                );
    }

    private Expense mapToEntity(ExpenseRequest request) {

        Expense expense = new Expense();

        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setPaymentMethod(request.getPaymentMethod());

        Category category =
                findCategoryById(request.getCategoryId());

        expense.setCategory(category);

        return expense;
    }

    private ExpenseResponse mapToResponse(
            Expense expense
    ) {

        ExpenseResponse response =
                new ExpenseResponse();

        response.setId(expense.getId());
        response.setAmount(expense.getAmount());

        if (expense.getCategory() != null) {
            response.setCategoryId(
                    expense.getCategory().getId()
            );

            response.setCategoryName(
                    expense.getCategory().getName()
            );
        }

        response.setDescription(
                expense.getDescription()
        );

        response.setExpenseDate(
                expense.getExpenseDate()
        );

        response.setPaymentMethod(
                expense.getPaymentMethod()
        );

        response.setCreatedAt(
                expense.getCreatedAt()
        );

        response.setUpdatedAt(
                expense.getUpdatedAt()
        );

        return response;
    }
}