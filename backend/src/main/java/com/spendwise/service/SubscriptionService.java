package com.spendwise.service;

import com.spendwise.dto.SubscriptionRequest;
import com.spendwise.dto.SubscriptionResponse;
import com.spendwise.entity.Category;
import com.spendwise.entity.Subscription;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final CategoryRepository categoryRepository;

    public SubscriptionService(
            SubscriptionRepository subscriptionRepository,
            CategoryRepository categoryRepository) {

        this.subscriptionRepository = subscriptionRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<SubscriptionResponse> getAllSubscriptions() {
        return subscriptionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public SubscriptionResponse getSubscriptionById(Long id) {
        Subscription subscription = findSubscriptionById(id);

        return mapToResponse(subscription);
    }

    public SubscriptionResponse createSubscription(
            SubscriptionRequest request) {

        Subscription subscription = mapToEntity(request);

        Subscription savedSubscription =
                subscriptionRepository.save(subscription);

        return mapToResponse(savedSubscription);
    }

    public SubscriptionResponse updateSubscription(
            Long id,
            SubscriptionRequest request) {

        Subscription subscription = findSubscriptionById(id);

        subscription.setName(request.getName().trim());
        subscription.setAmount(request.getAmount());
        subscription.setBillingCycle(request.getBillingCycle());
        subscription.setStartDate(request.getStartDate());
        subscription.setNextBillingDate(
                request.getNextBillingDate()
        );
        subscription.setDescription(request.getDescription());

        Category category =
                findCategoryById(request.getCategoryId());

        subscription.setCategory(category);

        Subscription updatedSubscription =
                subscriptionRepository.save(subscription);

        return mapToResponse(updatedSubscription);
    }

    public void deleteSubscription(Long id) {
        Subscription subscription = findSubscriptionById(id);

        subscriptionRepository.delete(subscription);
    }

    private Subscription findSubscriptionById(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Subscription not found with id: " + id
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

    private Subscription mapToEntity(
            SubscriptionRequest request) {

        Subscription subscription = new Subscription();

        subscription.setName(request.getName().trim());
        subscription.setAmount(request.getAmount());
        subscription.setBillingCycle(request.getBillingCycle());
        subscription.setStartDate(request.getStartDate());
        subscription.setNextBillingDate(
                request.getNextBillingDate()
        );
        subscription.setDescription(request.getDescription());

        Category category =
                findCategoryById(request.getCategoryId());

        subscription.setCategory(category);

        return subscription;
    }

    private SubscriptionResponse mapToResponse(
            Subscription subscription) {

        SubscriptionResponse response =
                new SubscriptionResponse();

        response.setId(subscription.getId());
        response.setName(subscription.getName());
        response.setAmount(subscription.getAmount());
        response.setBillingCycle(
                subscription.getBillingCycle()
        );
        response.setStartDate(subscription.getStartDate());
        response.setNextBillingDate(
                subscription.getNextBillingDate()
        );

        if (subscription.getCategory() != null) {
            response.setCategoryId(
                    subscription.getCategory().getId()
            );

            response.setCategoryName(
                    subscription.getCategory().getName()
            );
        }

        response.setDescription(
                subscription.getDescription()
        );
        response.setCreatedAt(
                subscription.getCreatedAt()
        );
        response.setUpdatedAt(
                subscription.getUpdatedAt()
        );

        return response;
    }
}