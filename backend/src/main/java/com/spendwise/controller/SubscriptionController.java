package com.spendwise.controller;

import com.spendwise.dto.SubscriptionRequest;
import com.spendwise.dto.SubscriptionResponse;
import com.spendwise.service.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(
            SubscriptionService subscriptionService) {

        this.subscriptionService = subscriptionService;
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionResponse>>
    getAllSubscriptions() {

        return ResponseEntity.ok(
                subscriptionService.getAllSubscriptions()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionResponse>
    getSubscriptionById(@PathVariable Long id) {

        SubscriptionResponse subscription =
                subscriptionService.getSubscriptionById(id);

        return ResponseEntity.ok(subscription);
    }

    @PostMapping
    public ResponseEntity<SubscriptionResponse>
    createSubscription(
            @Valid @RequestBody SubscriptionRequest request) {

        SubscriptionResponse createdSubscription =
                subscriptionService.createSubscription(request);

        return ResponseEntity
                .status(201)
                .body(createdSubscription);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionResponse>
    updateSubscription(
            @PathVariable Long id,
            @Valid @RequestBody SubscriptionRequest request) {

        SubscriptionResponse updatedSubscription =
                subscriptionService.updateSubscription(
                        id,
                        request
                );

        return ResponseEntity.ok(updatedSubscription);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(
            @PathVariable Long id) {

        subscriptionService.deleteSubscription(id);

        return ResponseEntity.noContent().build();
    }
}