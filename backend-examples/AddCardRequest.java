package com.example.HomeServices.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AddCardRequest {
    @NotBlank(message = "Номер карты обязателен")
    @Pattern(regexp = "^[0-9]{13,19}$", message = "Номер карты должен содержать от 13 до 19 цифр")
    private String cardNumber;

    @NotBlank(message = "Месяц истечения обязателен")
    @Pattern(regexp = "^(0[1-9]|1[0-2])$", message = "Месяц должен быть от 01 до 12")
    private String expiryMonth;

    @NotBlank(message = "Год истечения обязателен")
    @Pattern(regexp = "^[0-9]{2}$", message = "Год должен быть в формате YY")
    private String expiryYear;

    @NotBlank(message = "Имя держателя карты обязательно")
    @Size(min = 2, max = 255, message = "Имя должно содержать от 2 до 255 символов")
    private String cardholderName;

    @NotBlank(message = "CVV обязателен")
    @Pattern(regexp = "^[0-9]{3,4}$", message = "CVV должен содержать 3 или 4 цифры")
    private String cvv;
}

