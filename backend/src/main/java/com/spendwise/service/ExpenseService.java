package com.spendwise.service;

import com.spendwise.entity.Expense;
import com.spendwise.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Optional<Expense> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, Expense expenseDetails) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));

        expense.setAmount(expenseDetails.getAmount());
        expense.setCategory(expenseDetails.getCategory());
        expense.setDescription(expenseDetails.getDescription());
        expense.setExpenseDate(expenseDetails.getExpenseDate());
        expense.setPaymentMethod(expenseDetails.getPaymentMethod());

        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new RuntimeException("Expense not found with id: " + id);
        }

        expenseRepository.deleteById(id);
    }
}