// ПРИМЕР: Код сервера для обработки регистрации
// Скопируйте этот код в ваш серверный проект

const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// Конфигурация подключения к БД
const dbConfig = {
  host: 'localhost',
  user: 'root', // замените на вашего пользователя
  password: 'ваш_пароль', // замените на ваш пароль
  database: 'название_базы_данных', // замените на название вашей БД
  port: 3306
};

// Создаем пул подключений
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Эндпоинт регистрации
app.post('/api/auth/register', async (req, res) => {
  let connection;
  
  try {
    const { 
      contact, 
      password, 
      fullName, 
      address, 
      accountNumber, 
      residentsCount, 
      role // ВАЖНО: получаем поле role из запроса
    } = req.body;

    console.log('=== REGISTER REQUEST ===');
    console.log('Received data:', req.body);
    console.log('Role value:', role);
    console.log('========================');

    // Валидация
    if (!contact || !password) {
      return res.status(400).json({
        success: false,
        message: 'Контакт и пароль обязательны'
      });
    }

    // Определяем email или phone
    const isEmail = contact.includes('@');
    const email = isEmail ? contact : null;
    const phone = isEmail ? null : contact;

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Получаем подключение из пула
    connection = await pool.getConnection();

    // ВАЖНО: SQL запрос с полем role
    const insertQuery = `
      INSERT INTO users (
        account_number,
        address,
        created_at,
        email,
        full_name,
        password,
        phone,
        residents_count,
        role,  -- ВАЖНО: добавляем поле role
        updated_at
      ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, NOW())
    `;

    const insertValues = [
      accountNumber || null,
      address || null,
      email,
      fullName || null,
      hashedPassword,
      phone,
      residentsCount || null,
      role || 'user', // ВАЖНО: используем переданное значение или 'user' по умолчанию
    ];

    console.log('=== SQL QUERY ===');
    console.log('Query:', insertQuery);
    console.log('Values:', insertValues);
    console.log('==================');

    // Выполняем INSERT
    const [result] = await connection.execute(insertQuery, insertValues);

    console.log('Insert result:', result);

    // Получаем созданного пользователя
    const [users] = await connection.execute(
      'SELECT id, phone, email, full_name, address, account_number, residents_count, role FROM users WHERE id = ?',
      [result.insertId]
    );

    const user = users[0];

    // Генерируем токен
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Освобождаем подключение
    connection.release();

    // Возвращаем успешный ответ
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          email: user.email,
          fullName: user.full_name,
          address: user.address,
          accountNumber: user.account_number,
          residentsCount: user.residents_count,
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Освобождаем подключение в случае ошибки
    if (connection) {
      connection.release();
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Ошибка при регистрации'
    });
  }
});

// Тестовый эндпоинт для проверки подключения к БД
app.get('/api/auth/test-db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Проверяем структуру таблицы
    const [structure] = await connection.execute('DESCRIBE users');
    
    // Проверяем подключение
    const [test] = await connection.execute('SELECT 1 as test');
    
    connection.release();
    
    res.json({
      success: true,
      message: 'Подключение к БД работает',
      tableStructure: structure,
      testQuery: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`API доступен по адресу: http://localhost:${PORT}/api`);
});

