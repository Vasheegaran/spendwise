package com.spendwise.controller;

import com.spendwise.dto.ExpenseRequest;
import com.spendwise.dto.ExpenseResponse;
import com.spendwise.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.spendwise.entity.PaymentMethod;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }
@GetMapping
public ResponseEntity<Page<ExpenseResponse>> getAllExpenses(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) PaymentMethod paymentMethod,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate startDate,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate endDate,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

    Page<ExpenseResponse> expenses =
            expenseService.getAllExpenses(
                    search,
                    categoryId,
                    paymentMethod,
                    startDate,
                    endDate,
                    PageRequest.of(page, size)
            );

    return ResponseEntity.ok(expenses);
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