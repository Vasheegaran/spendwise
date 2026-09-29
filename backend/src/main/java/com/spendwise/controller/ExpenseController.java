package com.spendwise.controller;

import com.spendwise.dto.ExpenseRequest;
import com.spendwise.dto.ExpenseResponse;
import com.spendwise.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses() {
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

   @GetMapping("/{id}")
public ResponseEntity<ExpenseResponse> getExpenseById(
        @PathVariable Long id) {

    ExpenseResponse expense = expenseService.getExpenseById(id);

    return ResponseEntity.ok(expense);
}

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(
            @Valid @RequestBody ExpenseRequest request) {

        ExpenseResponse createdExpense =
                expenseService.createExpense(request);

        return ResponseEntity.status(201).body(createdExpense);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request) {

        ExpenseResponse updatedExpense =
                expenseService.updateExpense(id, request);

        return ResponseEntity.ok(updatedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long id) {

        expenseService.deleteExpense(id);

        return ResponseEntity.noContent().build();
    }
}