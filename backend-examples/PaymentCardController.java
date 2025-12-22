package com.example.HomeServices.controller;

import com.example.HomeServices.dto.AddCardRequest;
import com.example.HomeServices.dto.PaymentCardDto;
import com.example.HomeServices.service.PaymentCardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class PaymentCardController {
    private final PaymentCardService paymentCardService;

    /**
     * Получить все карты текущего пользователя
     */
    @GetMapping
    public ResponseEntity<?> getUserCards() {
        try {
            List<PaymentCardDto> cards = paymentCardService.getUserCards();
            return ResponseEntity.ok(new ApiResponse<>(true, null, cards));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Не удалось загрузить карты: " + e.getMessage(), null));
        }
    }

    /**
     * Добавить новую карту
     */
    @PostMapping
    public ResponseEntity<?> addCard(@Valid @RequestBody AddCardRequest request) {
        try {
            PaymentCardDto card = paymentCardService.addCard(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Карта успешно добавлена", card));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Не удалось добавить карту: " + e.getMessage(), null));
        }
    }

    /**
     * Удалить карту
     */
    @DeleteMapping("/{cardId}")
    public ResponseEntity<?> deleteCard(@PathVariable Long cardId) {
        try {
            paymentCardService.deleteCard(cardId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Карта успешно удалена", "OK"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Не удалось удалить карту: " + e.getMessage(), null));
        }
    }

    /**
     * Установить карту по умолчанию
     */
    @PutMapping("/{cardId}/set-default")
    public ResponseEntity<?> setDefaultCard(@PathVariable Long cardId) {
        try {
            PaymentCardDto card = paymentCardService.setDefaultCard(cardId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Карта установлена по умолчанию", card));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Не удалось установить карту по умолчанию: " + e.getMessage(), null));
        }
    }

    // Вспомогательный класс для ответов API
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;

        public ApiResponse(boolean success, String message, T data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }

        // Getters and setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public T getData() { return data; }
        public void setData(T data) { this.data = data; }
    }
}

