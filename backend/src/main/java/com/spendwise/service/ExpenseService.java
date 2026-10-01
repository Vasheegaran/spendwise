package com.spendwise.service;

import com.spendwise.dto.ExpenseRequest;
import com.spendwise.dto.ExpenseResponse;
import com.spendwise.entity.Category;
import com.spendwise.entity.Expense;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;

    public ExpenseService(
            ExpenseRepository expenseRepository,
            CategoryRepository categoryRepository) {

        this.expenseRepository = expenseRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ExpenseResponse> getAllExpenses() {
        return expenseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = findExpenseById(id);

        return mapToResponse(expense);
    }

    public ExpenseResponse createExpense(ExpenseRequest request) {
        Expense expense = mapToEntity(request);

        Expense savedExpense = expenseRepository.save(expense);

        return mapToResponse(savedExpense);
    }

    public ExpenseResponse updateExpense(
            Long id,
            ExpenseRequest request) {

        Expense expense = findExpenseById(id);

        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setPaymentMethod(request.getPaymentMethod());

        Category category = findCategoryById(request.getCategoryId());
        expense.setCategory(category);

        Expense updatedExpense =
                expenseRepository.save(expense);

        return mapToResponse(updatedExpense);
    }

    public void deleteExpense(Long id) {
        Expense expense = findExpenseById(id);

        expenseRepository.delete(expense);
    }

    private Expense findExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Expense not found with id: " + id
                        )
                );
    }

    private Category findCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found with id: " + categoryId
                        )
                );
    }

    private Expense mapToEntity(ExpenseRequest request) {
        Expense expense = new Expense();

        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setPaymentMethod(request.getPaymentMethod());

        Category category = findCategoryById(request.getCategoryId());
        expense.setCategory(category);

        return expense;
    }

    private ExpenseResponse mapToResponse(Expense expense) {
    ExpenseResponse response = new ExpenseResponse();

    response.setId(expense.getId());
    response.setAmount(expense.getAmount());

    if (expense.getCategory() != null) {
        response.setCategoryId(expense.getCategory().getId());
        response.setCategoryName(expense.getCategory().getName());
    }

    response.setDescription(expense.getDescription());
    response.setExpenseDate(expense.getExpenseDate());
    response.setPaymentMethod(expense.getPaymentMethod());
    response.setCreatedAt(expense.getCreatedAt());
    response.setUpdatedAt(expense.getUpdatedAt());

    return response;
}
}