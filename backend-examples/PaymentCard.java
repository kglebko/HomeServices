package com.example.HomeServices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "payment_cards")
@Data
public class PaymentCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "card_number_hash", nullable = false, length = 255)
    private String cardNumberHash;

    @Column(name = "card_number_last4", nullable = false, length = 4)
    private String cardNumberLast4;

    @Column(name = "expiry_month", nullable = false, length = 2)
    private String expiryMonth;

    @Column(name = "expiry_year", nullable = false, length = 2)
    private String expiryYear;

    @Column(name = "cardholder_name", nullable = false)
    private String cardholderName;

    @Column(name = "cvv_hash", nullable = false, length = 255)
    private String cvvHash;

    @Column(name = "card_type", length = 50)
    private String cardType;

    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now(ZoneId.of("Europe/Minsk"));
        updatedAt = LocalDateTime.now(ZoneId.of("Europe/Minsk"));
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now(ZoneId.of("Europe/Minsk"));
    }
}

