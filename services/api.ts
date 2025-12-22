import { Platform } from 'react-native';

// Для Android эмулятора используем 10.0.2.2 (это localhost эмулятора)
// Для iOS симулятора используем localhost
// Для веб-версии используем localhost
// Для реального устройства используйте IP адрес вашего компьютера в локальной сети
// 
// ВАЖНО: Для работы с реальным iPhone:
// 1. Убедитесь, что iPhone и компьютер подключены к одной Wi-Fi сети
// 2. Узнайте IP адрес вашего компьютера:
//    - Windows: ipconfig (ищите IPv4 адрес, например 192.168.1.100)
//    - Mac/Linux: ifconfig или ip addr
// 3. Замените YOUR_COMPUTER_IP ниже на ваш IP адрес
// 4. Убедитесь, что порт 8080 открыт в firewall

declare const __DEV__: boolean;

// IP адрес вашего компьютера в локальной сети
// 
// Как узнать IP:
// Windows: ipconfig (ищите IPv4-адрес в разделе Wi-Fi)
// Mac: ifconfig | grep "inet " | grep -v 127.0.0.1
// Linux: ip addr show или hostname -I
//
// Можно также использовать переменную окружения EXPO_PUBLIC_API_IP
const DEVICE_IP = process.env.EXPO_PUBLIC_API_IP || '192.168.0.105';

// Определяем, запущено ли на реальном устройстве
// В Expo можно использовать Constants.executionEnvironment для более точного определения
const isRealDevice = () => {
  // Если не в режиме разработки - это реальное устройство
  if (!__DEV__) return true;
  
  // Для веб - это не реальное устройство
  if (Platform.OS === 'web') return false;
  
  // Используем expo-constants для определения окружения
  // executionEnvironment может быть: 'standalone', 'storeClient', 'bare', 'bareWorkflow'
  // Для Expo Go на реальном устройстве это будет 'storeClient'
  // Для симулятора это также может быть 'storeClient', но localhost работает
  // Поэтому для iOS: если IP установлен и это не дефолтное значение, используем IP
  // Это будет работать и на симуляторе, и на реальном устройстве
  if (Platform.OS === 'ios') {
    // Если IP установлен (не дефолтное значение), используем его
    // Это работает и на симуляторе, и на реальном устройстве
    return DEVICE_IP !== 'YOUR_COMPUTER_IP' && DEVICE_IP !== '';
  }
  
  // Для Android в режиме разработки всегда используем эмулятор адрес
  return false;
};

const getApiBaseUrl = () => {
  if (!__DEV__) {
    // Продакшен - используйте реальный URL вашего сервера
    return 'https://your-production-server.com/api';
  }
  
  // В режиме разработки
  if (Platform.OS === 'android') {
    // Android эмулятор использует специальный адрес
    return 'http://10.0.2.2:8081/api';
  } else if (Platform.OS === 'web') {
    // Веб-версия
    return 'http://localhost:8081/api';
  } else if (Platform.OS === 'ios') {
    // iOS
    if (isRealDevice()) {
      // Реальное устройство - используем IP адрес компьютера
      if (!DEVICE_IP || DEVICE_IP === 'YOUR_COMPUTER_IP') {
        console.error('❌ ОШИБКА: Не указан IP адрес компьютера!');
        console.warn('⚠️ Для работы с реальным iPhone:');
        console.warn('1. Узнайте IP адрес вашего компьютера (ipconfig на Windows, ifconfig на Mac/Linux)');
        console.warn('2. Откройте services/api.ts');
        console.warn('3. Замените YOUR_COMPUTER_IP на ваш IP адрес (например: 192.168.1.100)');
        console.warn('4. Убедитесь, что iPhone и компьютер в одной Wi-Fi сети');
        // Fallback на localhost (не будет работать на реальном устройстве)
        return 'http://localhost:8081/api';
      }
      const url = `http://${DEVICE_IP}:8081/api`;
      console.log(`📱 Используется IP адрес для реального устройства: ${url}`);
      return url;
    } else {
      // iOS симулятор
      return 'http://localhost:8081/api';
    }
  }
  
  // Fallback
  return 'http://localhost:8081/api';
};

const API_BASE_URL = getApiBaseUrl();

// Логируем используемый URL для отладки
if (__DEV__) {
  console.log('🌐 API Base URL:', API_BASE_URL);
  console.log('📱 Platform:', Platform.OS);
  if (Platform.OS === 'ios' && (DEVICE_IP === 'YOUR_COMPUTER_IP' || !DEVICE_IP)) {
    console.warn('⚠️ Для работы с реальным iPhone установите DEVICE_IP в services/api.ts');
  }
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    phone: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    patronymic: string | null;
    address: string | null;
    accountNumber: string | null;
    residentsCount: number | null;
  };
}

export interface PaymentCard {
  id: number;
  cardNumberLast4: string;
  cardType: string | null;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AddCardRequest {
  cardNumber: string; // Полный номер карты (будет хэширован на бэкенде)
  expiryMonth: string; // MM
  expiryYear: string; // YY
  cardholderName: string;
  cvv: string; // Будет хэширован на бэкенде
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Получаем токен для авторизованных запросов
    const token = await this.getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Логируем тело запроса для регистрации
    if (endpoint === '/auth/register' && options.body) {
      try {
        const bodyData = JSON.parse(options.body as string);
        console.log('=== REQUEST BODY DEBUG ===');
        console.log('Endpoint:', endpoint);
        console.log('Body data:', bodyData);
        console.log('Role in body:', bodyData.role);
        console.log('Body string:', options.body);
        console.log('==========================');
      } catch (e) {
        console.log('Could not parse request body for logging');
      }
    }

    try {
      // Добавляем таймаут для запроса (15 секунд)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Для отладки: логируем статус и заголовки
      if (response.status === 403) {
        console.warn('API 403 Forbidden:', {
          endpoint,
          hasToken: !!token,
          tokenLength: token?.length,
        });
      }
      
      // Проверяем, есть ли тело ответа
      const contentType = response.headers.get('content-type');
      const hasJsonContent = contentType && contentType.includes('application/json');
      
      // Получаем текст ответа для проверки
      const responseText = await response.text();
      
      // Если ответ пустой, но статус OK, возвращаем успешный ответ с пустыми данными
      if (responseText.trim() === '' && response.ok) {
        console.warn('Empty response body for:', endpoint);
        return {
          success: true,
          message: null,
          data: null as any,
        };
      }
      
      // Пытаемся распарсить JSON
      let data;
      try {
        // Если ответ пустой, но статус OK, возвращаем успешный ответ
        if (responseText.trim() === '' && response.ok) {
          console.warn('Empty response body for:', endpoint, '- returning success');
          // Для GET запросов возвращаем пустой массив, для остальных - null с сообщением
          if (options.method === 'GET' || !options.method) {
            return {
              success: true,
              message: null,
              data: [] as any,
            };
          }
          // Для POST/PUT/DELETE возвращаем успешный ответ
          return {
            success: true,
            message: 'Операция выполнена успешно',
            data: null as any,
          };
        }
        
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', {
          endpoint,
          status: response.status,
          statusText: response.statusText,
          responseText: responseText.substring(0, 200), // Первые 200 символов
          hasJsonContent,
          parseError: parseError instanceof Error ? parseError.message : String(parseError),
        });
        
        // Если это не JSON, но статус OK, возвращаем успешный ответ
        if (response.ok) {
          // Для GET запросов возвращаем пустой массив, для POST/PUT - объект с success
          if (options.method === 'GET' || !options.method) {
            return {
              success: true,
              message: null,
              data: [] as any,
            };
          }
          // Для POST/PUT запросов возвращаем успешный ответ с данными из responseText или null
          // Если responseText пустой, это может быть нормально для некоторых endpoints
          if (responseText.trim() === '') {
            return {
              success: true,
              message: 'Операция выполнена успешно',
              data: null as any,
            };
          }
          return {
            success: true,
            message: null,
            data: responseText || null as any,
          };
        }
        
        // Если ошибка, выбрасываем исключение
        const error = new Error(`Invalid JSON response: ${responseText.substring(0, 100) || 'empty response'}`) as Error & { status?: number };
        error.status = response.status;
        throw error;
      }
      
      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          endpoint,
          errorData: data,
        });
        const error = new Error(data.message || 'Request failed') as Error & { status?: number };
        error.status = response.status;
        throw error;
      }
      
      return data;
    } catch (error) {
      // Обработка таймаута
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('API Request Timeout:', {
          endpoint,
          timeout: '15 seconds',
        });
        const timeoutError = new Error('Превышено время ожидания сервера') as Error & { status?: number };
        timeoutError.status = 408;
        throw timeoutError;
      }
      
      console.error('API Error:', {
        endpoint,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  private async getToken(): Promise<string | null> {
    try {
      const { storage } = await import('./storage');
      return await storage.getToken();
    } catch {
      return null;
    }
  }

  /**
   * Отправка SMS кода
   */
  async sendCode(contact: string): Promise<ApiResponse<string>> {
    return this.request<string>('/auth/send-code', {
      method: 'POST',
      body: JSON.stringify({ contact }),
    });
  }

  /**
   * Проверка SMS кода
   */
  async verifyCode(contact: string, code: string): Promise<ApiResponse<boolean>> {
    return this.request<boolean>('/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ contact, code }),
    });
  }

  /**
   * Регистрация
   */
  async register(data: {
    contact: string;
    password: string;
    firstName?: string;
    lastName?: string;
    patronymic?: string;
    address?: string;
    accountNumber?: string;
    residentsCount?: number;
    role?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    // Убеждаемся, что role всегда передается
    const registerData = {
      ...data,
      role: data.role || 'user', // Устанавливаем значение по умолчанию, если не указано
    };
    
    console.log('=== REGISTER REQUEST ===');
    console.log('Register data being sent:', JSON.stringify(registerData, null, 2));
    console.log('Role value:', registerData.role);
    console.log('Has role field:', 'role' in registerData);
    console.log('========================');
    
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
  }

  /**
   * Логин
   */
  async login(contact: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ contact, password }),
    });
  }

  /**
   * Получение профиля пользователя
   */
  async getProfile(): Promise<ApiResponse<AuthResponse['user']>> {
    return this.request<AuthResponse['user']>('/auth/profile', {
      method: 'GET',
    });
  }

  /**
   * Смена пароля (для авторизованных пользователей)
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<string>> {
    return this.request<string>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  /**
   * Сброс пароля (для восстановления пароля после проверки кода)
   */
  async resetPassword(contact: string, code: string, newPassword: string): Promise<ApiResponse<string>> {
    return this.request<string>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ contact, code, newPassword }),
    });
  }

  /**
   * Health check
   */
  async health(): Promise<ApiResponse<string>> {
    return this.request<string>('/auth/health', {
      method: 'GET',
    });
  }

  /**
   * Получение списка карт пользователя
   */
  async getCards(): Promise<ApiResponse<PaymentCard[]>> {
    console.log('Fetching cards from /api/cards');
    try {
      const response = await this.request<PaymentCard[]>('/cards', {
        method: 'GET',
      });
      console.log('Cards response received:', response);
      return response;
    } catch (error: any) {
      console.error('Error in getCards:', error);
      throw error;
    }
  }

  /**
   * Добавление новой карты
   */
  async addCard(cardData: AddCardRequest): Promise<ApiResponse<PaymentCard>> {
    return this.request<PaymentCard>('/cards', {
      method: 'POST',
      body: JSON.stringify(cardData),
    });
  }

  /**
   * Удаление карты
   */
  async deleteCard(cardId: number): Promise<ApiResponse<string>> {
    return this.request<string>(`/cards/${cardId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Установка карты по умолчанию
   */
  async setDefaultCard(cardId: number): Promise<ApiResponse<PaymentCard>> {
    return this.request<PaymentCard>(`/cards/${cardId}/set-default`, {
      method: 'PUT',
    });
  }
}

export const apiService = new ApiService();

