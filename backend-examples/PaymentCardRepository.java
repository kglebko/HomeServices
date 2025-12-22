package com.example.HomeServices.repository;

import com.example.HomeServices.entity.PaymentCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentCardRepository extends JpaRepository<PaymentCard, Long> {
    /**
     * Найти все активные карты пользователя
     */
    List<PaymentCard> findByUserIdAndIsActiveTrue(Long userId);

    /**
     * Найти карту по ID и ID пользователя
     */
    Optional<PaymentCard> findByIdAndUserId(Long id, Long userId);

    /**
     * Подсчитать количество активных карт пользователя
     */
    long countByUserIdAndIsActiveTrue(Long userId);

    /**
     * Найти активные карты пользователя, исключая указанную
     */
    List<PaymentCard> findByUserIdAndIsActiveTrueAndIdNot(Long userId, Long excludeId);

    /**
     * Снять флаг "по умолчанию" со всех карт пользователя
     */
    @Modifying
    @Query("UPDATE PaymentCard p SET p.isDefault = false WHERE p.userId = :userId AND p.isActive = true")
    void removeDefaultFromUserCards(@Param("userId") Long userId);
}

