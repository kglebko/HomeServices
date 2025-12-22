# Инструкция по настройке сервера и подключению к БД

## Проблема
Сервер не добавляет поле `role` в SQL INSERT запрос при регистрации пользователя.

## Что нужно сделать

### 1. Проверьте подключение к базе данных

Убедитесь, что сервер правильно подключается к MySQL Workbench. Обычно это делается через файл конфигурации (например, `.env` или `config.js`):

```javascript
// Пример конфигурации подключения к БД
const dbConfig = {
  host: 'localhost',
  user: 'root', // ваш пользователь MySQL
  password: 'ваш_пароль',
  database: 'название_базы_данных',
  port: 3306
};
```

### 2. Исправьте код регистрации на сервере

В файле, который обрабатывает `/auth/register`, нужно:

#### Вариант A: Если используете Sequelize ORM

```javascript
// Пример с Sequelize
const User = require('./models/User');

app.post('/auth/register', async (req, res) => {
  try {
    const { contact, password, fullName, address, accountNumber, residentsCount, role } = req.body;
    
    const user = await User.create({
      phone: contact.includes('@') ? null : contact,
      email: contact.includes('@') ? contact : null,
      password: hashedPassword, // не забудьте хешировать пароль
      full_name: fullName,
      address: address,
      account_number: accountNumber,
      residents_count: residentsCount,
      role: role || 'user', // ВАЖНО: добавляем поле role
    });
    
    res.json({ success: true, data: { token, user } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

#### Вариант B: Если используете чистый SQL (mysql2)

```javascript
const mysql = require('mysql2/promise');

app.post('/auth/register', async (req, res) => {
  try {
    const { contact, password, fullName, address, accountNumber, residentsCount, role } = req.body;
    
    const connection = await mysql.createConnection(dbConfig);
    
    // ВАЖНО: добавляем поле role в INSERT запрос
    const query = `
      INSERT INTO users (
        account_number,
        address,
        created_at,
        email,
        full_name,
        password,
        phone,
        residents_count,
        role,  -- ВАЖНО: добавляем это поле
        updated_at
      ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const [result] = await connection.execute(query, [
      accountNumber,
      address,
      contact.includes('@') ? contact : null, // email
      fullName,
      hashedPassword, // не забудьте хешировать пароль
      contact.includes('@') ? null : contact, // phone
      residentsCount,
      role || 'user', // ВАЖНО: добавляем значение role
    ]);
    
    await connection.end();
    
    res.json({ success: true, data: { token, user } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### 3. Проверьте структуру таблицы в MySQL Workbench

Убедитесь, что в таблице `users` есть поле `role`:

```sql
-- Проверьте структуру таблицы
DESCRIBE users;

-- Если поля role нет, добавьте его:
ALTER TABLE users 
ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user' 
AFTER residents_count;
```

### 4. Проверьте подключение к БД

Создайте тестовый файл для проверки подключения:

```javascript
// test-db-connection.js
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'ваш_пароль',
      database: 'название_базы_данных',
      port: 3306
    });
    
    console.log('✅ Подключение к БД успешно!');
    
    // Проверяем структуру таблицы users
    const [rows] = await connection.execute('DESCRIBE users');
    console.log('Структура таблицы users:', rows);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error.message);
  }
}

testConnection();
```

## Быстрая проверка

1. Запустите сервер
2. Попробуйте зарегистрироваться через приложение
3. Проверьте логи сервера - должно быть видно, что приходит поле `role`
4. Проверьте логи MySQL - должен быть виден полный INSERT запрос с полем `role`

## Если проблема остается

Пришлите мне:
1. Код обработчика `/auth/register` на сервере
2. Структуру таблицы `users` (результат `DESCRIBE users`)
3. Логи сервера при попытке регистрации

