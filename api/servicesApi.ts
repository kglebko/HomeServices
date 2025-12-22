import { Platform } from 'react-native';

// ==== ВАЖНО: ИСПОЛЬЗУЙТЕ ОДИН И ТОТ ЖЕ IP ДЛЯ ВСЕХ API! ====
const LOCAL_IP = process.env.EXPO_PUBLIC_API_IP || '192.168.0.105'; // ← Унифицированный IP

// Функция для получения базового URL
const getBaseUrl = (): string => {
    // В режиме разработки для эмуляторов/симуляторов
    if (__DEV__) {
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:8081'; // Android эмулятор
        }
        if (Platform.OS === 'ios') {
            // Для реального iOS устройства используем IP, для симулятора - localhost
            return `http://${LOCAL_IP}:8081`; // Всегда используем IP для iOS
        }
    }

    // Для физических устройств и продакшена
    return `http://${LOCAL_IP}:8081`;
};

const API_BASE_URL = `${getBaseUrl()}/api`;

console.log(`📱 Платформа: ${Platform.OS}`);
console.log(`🌐 Базовый URL: ${getBaseUrl()}`);
console.log(`🌐 API URL: ${API_BASE_URL}`);

export type ServiceItem = {
    id: number;
    name: string;
    price: number;
    workHours: string;
    timeAgo?: string;
    createdAt?: string;
    updatedAt?: string;
};

// Общая функция для выполнения запросов с обработкой ошибок
const apiFetch = async <T>(endpoint: string): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🌐 Запрос к API: ${url}`);

    try {
        // Добавляем таймаут для запроса
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 секунд

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Ошибка ${response.status} для ${endpoint}:`, errorText);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.error(`⏰ Таймаут запроса: ${endpoint}`);
            throw new Error('Превышено время ожидания сервера');
        }
        console.error(`❌ Сетевая ошибка для ${endpoint}:`, error.message);
        throw error;
    }
};

// Получить все услуги
export const fetchAllServices = async (): Promise<ServiceItem[]> => {
    try {
        const data = await apiFetch<ServiceItem[]>('/services');
        console.log(`✅ Получено услуг: ${data.length}`);
        return data.map(item => ({
            ...item,
            workHours: item.workHours?.toString() || '10:00-20:00',
        }));
    } catch (error: any) {
        console.error('❌ Ошибка загрузки услуг:', error.message);
        return [];
    }
};

// Получить последние услуги (для главной страницы)
export const fetchLatestServices = async (): Promise<ServiceItem[]> => {
    try {
        const data = await apiFetch<ServiceItem[]>('/services/latest');
        console.log(`✅ Получено последних услуг: ${data.length}`);
        return data.map(item => ({
            ...item,
            workHours: item.workHours?.toString() || '10:00-20:00',
        }));
    } catch (error: any) {
        console.error('❌ Ошибка загрузки последних услуг:', error.message);
        return [];
    }
};

// Получить услугу по ID
export const fetchServiceById = async (id: number): Promise<ServiceItem | null> => {
    try {
        const data = await apiFetch<ServiceItem>(`/services/${id}`);
        console.log(`✅ Получена услуга: ${data.name}`);
        return {
            ...data,
            workHours: data.workHours?.toString() || '10:00-20:00',
        };
    } catch (error: any) {
        console.error(`❌ Ошибка загрузки услуги #${id}:`, error.message);
        return null;
    }
};