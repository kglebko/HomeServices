// api/servicesApi.ts
import { Platform } from 'react-native';

const getBaseUrl = (): string => {
    if (__DEV__) {
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:8080';
        }
        if (Platform.OS === 'ios') {
            return 'http://localhost:8080';
        }
    }
    return 'http://192.168.0.104:8080';
};

const API_BASE_URL = `${getBaseUrl()}/api`;

export type ServiceItem = {
    id: number;
    name: string;
    price: number;
    workHours: string;
    timeAgo?: string;
    createdAt?: string;
    updatedAt?: string;
};

// Общая функция для выполнения запросов
const apiFetch = async <T>(endpoint: string): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🌐 Запрос к API: ${url}`);

    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Ошибка ${response.status} для ${endpoint}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
};

// Получить все услуги
export const fetchAllServices = async (): Promise<ServiceItem[]> => {
    try {
        const data = await apiFetch<ServiceItem[]>('/services');
        console.log(`✅ Получено услуг: ${data.length}`);
        return data;
    } catch (error: any) {
        console.error('❌ Ошибка загрузки услуг:', error.message);
        throw error; // Пробрасываем ошибку дальше
    }
};

// Получить последние услуги (для главной страницы)
export const fetchLatestServices = async (): Promise<ServiceItem[]> => {
    try {
        const data = await apiFetch<ServiceItem[]>('/services/latest');
        console.log(`✅ Получено последних услуг: ${data.length}`);
        return data;
    } catch (error: any) {
        console.error('❌ Ошибка загрузки последних услуг:', error.message);
        throw error; // Пробрасываем ошибку дальше
    }
};

// Получить услугу по ID
export const fetchServiceById = async (id: number): Promise<ServiceItem> => {
    try {
        const data = await apiFetch<ServiceItem>(`/services/${id}`);
        console.log(`✅ Получена услуга: ${data.name}`);
        return data;
    } catch (error: any) {
        console.error(`❌ Ошибка загрузки услуги #${id}:`, error.message);
        throw error; // Пробрасываем ошибку дальше
    }
};

// Создать новую услугу (если нужно)
export const createService = async (serviceData: Omit<ServiceItem, 'id'>): Promise<ServiceItem> => {
    try {
        const url = `${API_BASE_URL}/services`;
        console.log(`🌐 Создание услуги: ${url}`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(serviceData),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`✅ Создана услуга: ${data.name}`);
        return data;
    } catch (error: any) {
        console.error('❌ Ошибка создания услуги:', error.message);
        throw error;
    }
};

// Обновить услугу
export const updateService = async (id: number, serviceData: Partial<ServiceItem>): Promise<ServiceItem> => {
    try {
        const url = `${API_BASE_URL}/services/${id}`;
        console.log(`🌐 Обновление услуги #${id}: ${url}`);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(serviceData),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`✅ Обновлена услуга: ${data.name}`);
        return data;
    } catch (error: any) {
        console.error(`❌ Ошибка обновления услуги #${id}:`, error.message);
        throw error;
    }
};

// Удалить услугу
export const deleteService = async (id: number): Promise<void> => {
    try {
        const url = `${API_BASE_URL}/services/${id}`;
        console.log(`🌐 Удаление услуги #${id}: ${url}`);

        const response = await fetch(url, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        console.log(`✅ Услуга #${id} удалена`);
    } catch (error: any) {
        console.error(`❌ Ошибка удаления услуги #${id}:`, error.message);
        throw error;
    }
};