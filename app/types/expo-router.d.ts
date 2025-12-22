/// <reference types="expo/types" />

// Для разрешения импортов с @
declare module '@/*' {
    // Пустой модуль для разрешения путей
}

// Или добавьте конкретные объявления
declare module '@/lib/api/client' {
    export interface ApiResponse<T = any> {
        data?: T;
        error?: string;
        message?: string;
        success: boolean;
    }

    export class ApiClient {
        post<T>(endpoint: string, data: any, requiresAuth?: boolean): Promise<ApiResponse<T>>;
    }

    export const apiClient: ApiClient;
}