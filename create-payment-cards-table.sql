-- Таблица для хранения платежных карт
-- Данные карт хэшируются для безопасности

CREATE TABLE IF NOT EXISTS payment_cards (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    
    -- Хэшированные данные карты
    card_number_hash VARCHAR(255) NOT NULL COMMENT 'Хэш номера карты (SHA-256)',
    card_number_last4 VARCHAR(4) NOT NULL COMMENT 'Последние 4 цифры для отображения',
    
    -- Зашифрованные данные (можно использовать AES)
    expiry_month VARCHAR(2) NOT NULL COMMENT 'Месяц истечения (MM)',
    expiry_year VARCHAR(2) NOT NULL COMMENT 'Год истечения (YY)',
    cardholder_name VARCHAR(255) NOT NULL COMMENT 'Имя держателя карты',
    cvv_hash VARCHAR(255) NOT NULL COMMENT 'Хэш CVV кода',
    
    -- Тип карты (определяется по первой цифре)
    card_type VARCHAR(50) DEFAULT NULL COMMENT 'Visa, MasterCard, etc.',
    
    -- Метаданные
    is_default BOOLEAN DEFAULT FALSE COMMENT 'Карта по умолчанию',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Активна ли карта',
    
    -- Временные метки
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Внешний ключ
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Индексы
    INDEX idx_user_id (user_id),
    INDEX idx_card_number_hash (card_number_hash),
    INDEX idx_is_default (is_default),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Комментарии к таблице
ALTER TABLE payment_cards COMMENT = 'Таблица для хранения платежных карт пользователей с хэшированием чувствительных данных';

