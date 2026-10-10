package com.spendwise.repository;

import com.spendwise.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository
        extends JpaRepository<Subscription, Long> {

    List<Subscription> findAllByUserId(Long userId);

    Optional<Subscription> findByIdAndUserId(
            Long id,
            Long userId
    );

    long countByUserIdAndActiveTrue(Long userId);

    List<Subscription> findByUserIdAndActiveTrue(Long userId);
}