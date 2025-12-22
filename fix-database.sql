-- SQL скрипт для проверки и исправления структуры таблицы users
-- Выполните этот скрипт в MySQL Workbench

-- 1. Проверяем текущую структуру таблицы
DESCRIBE users;

-- 2. Проверяем, есть ли поле role
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'users' 
AND COLUMN_NAME = 'role';

-- 3. Если поля role нет, добавляем его
-- Раскомментируйте следующую строку, если поле role отсутствует:
-- ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user' AFTER residents_count;

-- 4. Если поле role есть, но не имеет значения по умолчанию, обновляем его:
-- ALTER TABLE users MODIFY COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user';

-- 5. Проверяем, что поле role добавлено правильно
DESCRIBE users;

-- 6. Обновляем существующие записи, у которых role = NULL (если такие есть)
-- UPDATE users SET role = 'user' WHERE role IS NULL;

-- 7. Проверяем данные
SELECT id, phone, email, full_name, role FROM users LIMIT 5;

