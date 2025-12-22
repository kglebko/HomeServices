package com.example.HomeServices.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PaymentCardDto {
    private Long id;
    private String cardNumberLast4;
    private String cardType;
    private String cardholderName;
    private String expiryMonth;
    private String expiryYear;
    private Boolean isDefault;
    private Boolean isActive;
    private LocalDateTime createdAt;
}

