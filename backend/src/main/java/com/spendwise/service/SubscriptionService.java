package com.spendwise.service;

import com.spendwise.dto.SubscriptionRequest;
import com.spendwise.dto.SubscriptionResponse;
import com.spendwise.entity.Category;
import com.spendwise.entity.Subscription;
import com.spendwise.entity.User;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.repository.SubscriptionRepository;
import com.spendwise.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public SubscriptionService(
            SubscriptionRepository subscriptionRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository) {

        this.subscriptionRepository = subscriptionRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public List<SubscriptionResponse> getAllSubscriptions() {

        Long userId = getCurrentUser().getId();

        return subscriptionRepository
                .findAllByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public SubscriptionResponse getSubscriptionById(Long id) {

        Long userId = getCurrentUser().getId();

        Subscription subscription =
                findSubscriptionById(id, userId);

        return mapToResponse(subscription);
    }

    public SubscriptionResponse createSubscription(
            SubscriptionRequest request) {

        User user = getCurrentUser();

        Subscription subscription =
                mapToEntity(request);

        subscription.setUser(user);

        if (request.getActive() != null) {
            subscription.setActive(
                    request.getActive()
            );
        }

        Subscription savedSubscription =
                subscriptionRepository.save(subscription);

        return mapToResponse(savedSubscription);
    }

    public SubscriptionResponse updateSubscription(
            Long id,
            SubscriptionRequest request) {

        Long userId = getCurrentUser().getId();

        Subscription subscription =
                findSubscriptionById(id, userId);

        subscription.setName(
                request.getName().trim()
        );

        subscription.setAmount(
                request.getAmount()
        );

        subscription.setBillingCycle(
                request.getBillingCycle()
        );

        subscription.setStartDate(
                request.getStartDate()
        );

        subscription.setNextBillingDate(
                request.getNextBillingDate()
        );

        subscription.setDescription(
                request.getDescription()
        );

        if (request.getActive() != null) {
            subscription.setActive(
                    request.getActive()
            );
        }

        Category category =
                findCategoryById(
                        request.getCategoryId()
                );

        subscription.setCategory(category);

        Subscription updatedSubscription =
                subscriptionRepository.save(subscription);

        return mapToResponse(updatedSubscription);
    }

    public void deleteSubscription(Long id) {

        Long userId = getCurrentUser().getId();

        Subscription subscription =
                findSubscriptionById(id, userId);

        subscriptionRepository.delete(subscription);
    }

    private Subscription findSubscriptionById(
            Long id,
            Long userId) {

        return subscriptionRepository
                .findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Subscription not found with id: "
                                        + id
                        )
                );
    }

    private Category findCategoryById(
            Long categoryId) {

        return categoryRepository
                .findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found with id: "
                                        + categoryId
                        )
                );
    }

    private Subscription mapToEntity(
            SubscriptionRequest request) {

        Subscription subscription =
                new Subscription();

        subscription.setName(
                request.getName().trim()
        );

        subscription.setAmount(
                request.getAmount()
        );

        subscription.setBillingCycle(
                request.getBillingCycle()
        );

        subscription.setStartDate(
                request.getStartDate()
        );

        subscription.setNextBillingDate(
                request.getNextBillingDate()
        );

        subscription.setDescription(
                request.getDescription()
        );

        Category category =
                findCategoryById(
                        request.getCategoryId()
                );

        subscription.setCategory(category);

        return subscription;
    }

    private SubscriptionResponse mapToResponse(
            Subscription subscription) {

        SubscriptionResponse response =
                new SubscriptionResponse();

        response.setId(
                subscription.getId()
        );

        response.setName(
                subscription.getName()
        );

        response.setAmount(
                subscription.getAmount()
        );

        response.setBillingCycle(
                subscription.getBillingCycle()
        );

        response.setStartDate(
                subscription.getStartDate()
        );

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

        response.setActive(
                subscription.isActive()
        );

        response.setCreatedAt(
                subscription.getCreatedAt()
        );

        response.setUpdatedAt(
                subscription.getUpdatedAt()
        );

        return response;
    }

    private User getCurrentUser() {

        Object principal =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        if (!(principal instanceof UserDetails userDetails)) {

            throw new IllegalStateException(
                    "Authenticated user not found"
            );
        }

        return userRepository
                .findByEmail(
                        userDetails.getUsername()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user not found"
                        )
                );
    }
}