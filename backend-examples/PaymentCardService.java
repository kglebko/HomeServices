package com.example.HomeServices.service;

import com.example.HomeServices.dto.AddCardRequest;
import com.example.HomeServices.dto.PaymentCardDto;
import com.example.HomeServices.entity.PaymentCard;
import com.example.HomeServices.entity.User;
import com.example.HomeServices.repository.PaymentCardRepository;
import com.example.HomeServices.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentCardService {
    private final PaymentCardRepository paymentCardRepository;
    private final UserRepository userRepository;

    /**
     * Получить текущего пользователя из контекста безопасности
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByPhoneOrEmail(username, username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
    }

    /**
     * Хэширование данных с использованием SHA-256
     */
    private String hashData(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Ошибка хэширования", e);
        }
    }

    /**
     * Определение типа карты по первой цифре
     */
    private String determineCardType(String cardNumber) {
        if (cardNumber == null || cardNumber.isEmpty()) {
            return null;
        }
        char firstDigit = cardNumber.charAt(0);
        if (firstDigit == '4') return "Visa";
        if (firstDigit == '5') return "MasterCard";
        if (firstDigit == '3') return "American Express";
        return "Unknown";
    }

    /**
     * Получить все карты текущего пользователя
     */
    public List<PaymentCardDto> getUserCards() {
        User user = getCurrentUser();
        return paymentCardRepository.findByUserIdAndIsActiveTrue(user.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Добавить новую карту
     */
    @Transactional
    public PaymentCardDto addCard(AddCardRequest request) {
        User user = getCurrentUser();

        // Хэшируем номер карты и CVV
        String cardNumberHash = hashData(request.getCardNumber());
        String cvvHash = hashData(request.getCvv());

        // Получаем последние 4 цифры
        String last4 = request.getCardNumber().substring(request.getCardNumber().length() - 4);

        // Определяем тип карты
        String cardType = determineCardType(request.getCardNumber());

        // Если это первая карта, делаем её картой по умолчанию
        boolean isDefault = paymentCardRepository.countByUserIdAndIsActiveTrue(user.getId()) == 0;

        // Если устанавливаем как карту по умолчанию, снимаем флаг с других карт
        if (isDefault) {
            paymentCardRepository.removeDefaultFromUserCards(user.getId());
        }

        PaymentCard card = new PaymentCard();
        card.setUserId(user.getId());
        card.setCardNumberHash(cardNumberHash);
        card.setCardNumberLast4(last4);
        card.setExpiryMonth(request.getExpiryMonth());
        card.setExpiryYear(request.getExpiryYear());
        card.setCardholderName(request.getCardholderName().toUpperCase());
        card.setCvvHash(cvvHash);
        card.setCardType(cardType);
        card.setIsDefault(isDefault);
        card.setIsActive(true);

        PaymentCard savedCard = paymentCardRepository.save(card);
        return toDto(savedCard);
    }

    /**
     * Удалить карту
     */
    @Transactional
    public void deleteCard(Long cardId) {
        User user = getCurrentUser();
        PaymentCard card = paymentCardRepository.findByIdAndUserId(cardId, user.getId())
                .orElseThrow(() -> new RuntimeException("Карта не найдена"));

        // Если удаляем карту по умолчанию, устанавливаем первую активную карту как карту по умолчанию
        if (card.getIsDefault()) {
            List<PaymentCard> otherCards = paymentCardRepository
                    .findByUserIdAndIsActiveTrueAndIdNot(user.getId(), cardId);
            if (!otherCards.isEmpty()) {
                PaymentCard newDefault = otherCards.get(0);
                newDefault.setIsDefault(true);
                paymentCardRepository.save(newDefault);
            }
        }

        card.setIsActive(false);
        paymentCardRepository.save(card);
    }

    /**
     * Установить карту по умолчанию
     */
    @Transactional
    public PaymentCardDto setDefaultCard(Long cardId) {
        User user = getCurrentUser();
        PaymentCard card = paymentCardRepository.findByIdAndUserId(cardId, user.getId())
                .orElseThrow(() -> new RuntimeException("Карта не найдена"));

        // Снимаем флаг по умолчанию со всех карт пользователя
        paymentCardRepository.removeDefaultFromUserCards(user.getId());

        // Устанавливаем выбранную карту как карту по умолчанию
        card.setIsDefault(true);
        PaymentCard savedCard = paymentCardRepository.save(card);
        return toDto(savedCard);
    }

    /**
     * Преобразование Entity в DTO
     */
    private PaymentCardDto toDto(PaymentCard card) {
        PaymentCardDto dto = new PaymentCardDto();
        dto.setId(card.getId());
        dto.setCardNumberLast4(card.getCardNumberLast4());
        dto.setCardType(card.getCardType());
        dto.setCardholderName(card.getCardholderName());
        dto.setExpiryMonth(card.getExpiryMonth());
        dto.setExpiryYear(card.getExpiryYear());
        dto.setIsDefault(card.getIsDefault());
        dto.setIsActive(card.getIsActive());
        dto.setCreatedAt(card.getCreatedAt());
        return dto;
    }
}

