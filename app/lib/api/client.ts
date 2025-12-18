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

    private async getHeaders(withAuth: boolean = true): Promise<HeadersInit> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

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
            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || 'Произошла ошибка',
                    message: data.message,
                };
            }

            return {
                success: true,
                data: data,
                message: data.message,
            };
        } catch (error) {
            return {
                success: false,
                error: 'Ошибка обработки ответа сервера',
            };
        }
    }

    async post<T>(endpoint: string, data: any, requiresAuth: boolean = true): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: await this.getHeaders(requiresAuth),
                body: JSON.stringify(data),
            });

            return await this.handleResponse<T>(response);
        } catch (error) {
            console.error('POST request failed:', error);
            return {
                success: false,
                error: 'Ошибка сети. Проверьте подключение к интернету',
            };
        }
    }
}

export const apiClient = new ApiClient();