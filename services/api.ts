import { Platform } from 'react-native';

// Для Android эмулятора используем 10.0.2.2 (это localhost эмулятора)
// Для iOS симулятора используем localhost
// Для веб-версии используем localhost
// Для реального устройства используйте IP адрес вашего компьютера
// Например: 'http://192.168.1.100:8080/api'
declare const __DEV__: boolean;

const getApiBaseUrl = () => {
  if (!__DEV__) {
    return 'http://localhost:8080/api'; // Продакшен - замените на реальный URL
  }
  
  // В режиме разработки
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api'; // Android эмулятор
  } else if (Platform.OS === 'web') {
    return 'http://localhost:8080/api'; // Веб-версия
  } else {
    return 'http://localhost:8080/api'; // iOS симулятор
  }
};

const API_BASE_URL = getApiBaseUrl();

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
    fullName: string | null;
    address: string | null;
    accountNumber: string | null;
    residentsCount: number | null;
  };
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

    try {
      const response = await fetch(url, config);
      
      // Для отладки: логируем статус и заголовки
      if (response.status === 403) {
        console.warn('API 403 Forbidden:', {
          endpoint,
          hasToken: !!token,
          tokenLength: token?.length,
        });
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        const error = new Error(data.message || 'Request failed') as Error & { status?: number };
        error.status = response.status;
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
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
    fullName?: string;
    address?: string;
    accountNumber?: string;
    residentsCount?: number;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
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
   * Смена пароля
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<string>> {
    return this.request<string>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
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
}

export const apiService = new ApiService();

