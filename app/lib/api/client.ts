import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from './config';

export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
    success: boolean;
}

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    private async getHeaders(withAuth: boolean = true, isFormData: boolean = false): Promise<HeadersInit> {
        const headers: HeadersInit = {};

        // Для FormData НЕ добавляем Content-Type - браузер сам его установит
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
            headers['Accept'] = 'application/json';
        }

        if (withAuth) {
            const token = await AsyncStorage.getItem('adminToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        try {
            // Если ответ пустой (например, при удалении)
            if (response.status === 204) {
                return {
                    success: true,
                    message: 'Успешно',
                };
            }

            const text = await response.text();
            const data = text ? JSON.parse(text) : {};

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || `Ошибка ${response.status}`,
                    message: data.message,
                };
            }

            return {
                success: true,
                data: data,
                message: data.message,
            };
        } catch (error) {
            console.error('Ошибка обработки ответа:', error);
            return {
                success: false,
                error: 'Ошибка обработки ответа сервера',
            };
        }
    }

    async post<T>(endpoint: string, data: any, requiresAuth: boolean = true, isFormData: boolean = false): Promise<ApiResponse<T>> {
        try {
            const headers = await this.getHeaders(requiresAuth, isFormData);

            let body: any;
            if (isFormData) {
                body = data; // data уже должен быть FormData
            } else {
                body = JSON.stringify(data);
            }

            console.log('Отправка POST запроса:', {
                url: `${this.baseUrl}${endpoint}`,
                headers,
                body: isFormData ? 'FormData' : body
            });

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers,
                body,
            });

            return await this.handleResponse<T>(response);
        } catch (error) {
            console.error('POST request failed:', error);
            return {
                success: false,
                error: 'Ошибка сети. Проверьте подключение к серверу',
            };
        }
    }
}

export const apiClient = new ApiClient();