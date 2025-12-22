// api/newsApi.ts
import { Platform } from 'react-native';

// Для Android эмулятора используем специальный адрес
const getBaseUrl = (): string => {
    // Android эмулятор - специальный адрес 10.0.2.2
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8081'; // Android эмулятор
    }

    // Для iOS или физического устройства - используем тот же IP, что и в services/api.ts
    const DEVICE_IP = process.env.EXPO_PUBLIC_API_IP || '192.168.0.105';
    return `http://${DEVICE_IP}:8081`;
};

const API_BASE_URL = `${getBaseUrl()}/api`;
const BASE_URL = getBaseUrl(); // Для изображений

console.log(`🌐 Платформа: ${Platform.OS}`);
console.log(`🌐 Базовый URL: ${BASE_URL}`);
console.log(`🌐 API URL: ${API_BASE_URL}`);

export type NewsItem = {
    id: number;
    title: string;
    content: string;
    fullContent: string;
    category: string;
    imageUrl: string;
    author: string;
    updatedAt: string;
    viewCount: number;
    likesCount: number;
    commentsCount: number;
    isActive?: boolean;
    timeAgo?: string;
    createdAt?: string;
};

// ИСПРАВЛЕНО: функция для получения полного URL изображения
export const getFullImageUrl = (imageUrl: string): string => {
    if (!imageUrl || imageUrl.trim() === '') {
        return '';
    }

    // Если уже полный URL, возвращаем как есть
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }

    // Если относительный путь начинается с /uploads/
    if (imageUrl.startsWith('/uploads/')) {
        return `${BASE_URL}${imageUrl}`;
    }

    // Если только имя файла, добавляем /uploads/
    return `${BASE_URL}/uploads/${imageUrl}`;
};

export const getRelativeTime = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'только что';
        if (diffMins < 60) return `${diffMins} мин назад`;
        if (diffHours < 24) return `${diffHours} час назад`;
        if (diffDays === 1) return 'вчера';
        if (diffDays < 7) return `${diffDays} дня назад`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед назад`;
        return `${Math.floor(diffDays / 30)} мес назад`;
    } catch {
        return 'недавно';
    }
};

const apiFetch = async (endpoint: string) => {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        console.log(`🌐 Запрос к API: ${url}`);
        
        // Добавляем таймаут для запроса
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.error(`⏰ Таймаут запроса ${endpoint}`);
            throw new Error('Превышено время ожидания сервера');
        }
        console.error(`❌ Ошибка запроса ${endpoint}:`, error.message);
        throw error;
    }
};

// Вспомогательная функция для обработки URL изображения
const processImageUrl = (item: any): string => {
    const imageUrl = item.image_url || item.imageUrl || '';

    if (!imageUrl || imageUrl.trim() === '') {
        return '';
    }

    // Если API возвращает уже полный URL
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }

    // Если API возвращает относительный путь
    return imageUrl;
};

export const fetchLatestNews = async (): Promise<NewsItem[]> => {
    try {
        const data = await apiFetch('/news/latest?count=6');

        return data.map((item: any) => {
            const processedImageUrl = processImageUrl(item);

            return {
                id: item.id,
                title: item.title || 'Без заголовка',
                content: item.content || '',
                fullContent: item.full_content || item.fullContent || item.content || '',
                category: item.category || 'Общая',
                imageUrl: processedImageUrl, // Используем обработанный URL
                author: item.author || 'Администрация',
                updatedAt: item.updated_at || item.updatedAt || item.created_at || item.createdAt || new Date().toISOString(),
                viewCount: item.view_count || item.viewCount || 0,
                likesCount: item.likes_count || item.likesCount || 0,
                commentsCount: item.comments_count || item.commentsCount || 0,
                timeAgo: item.timeAgo || item.time_ago || getRelativeTime(item.updated_at || item.updatedAt || item.created_at || item.createdAt),
                createdAt: item.created_at || item.createdAt,
                isActive: item.isActive !== undefined ? item.isActive : true,
            };
        });
    } catch (error: any) {
        console.error('❌ Ошибка загрузки новостей:', error.message);
        return [];
    }
};

export const fetchAllNews = async (): Promise<NewsItem[]> => {
    try {
        const response = await apiFetch('/news?page=0&size=20');
        const data = response.content || response || [];

        return data.map((item: any) => {
            const processedImageUrl = processImageUrl(item);

            return {
                id: item.id,
                title: item.title || 'Без заголовка',
                content: item.content || '',
                fullContent: item.full_content || item.fullContent || item.content || '',
                category: item.category || 'Общая',
                imageUrl: processedImageUrl, // Используем обработанный URL
                author: item.author || 'Администрация',
                updatedAt: item.updated_at || item.updatedAt || item.created_at || item.createdAt || new Date().toISOString(),
                viewCount: item.view_count || item.viewCount || 0,
                likesCount: item.likes_count || item.likesCount || 0,
                commentsCount: item.comments_count || item.commentsCount || 0,
                timeAgo: item.timeAgo || item.time_ago || getRelativeTime(item.updated_at || item.updatedAt || item.created_at || item.createdAt),
                createdAt: item.created_at || item.createdAt,
                isActive: item.isActive !== undefined ? item.isActive : true,
            };
        });
    } catch (error: any) {
        console.error('❌ Ошибка загрузки всех новостей:', error.message);
        return [];
    }
};

export const fetchNewsById = async (id: number): Promise<NewsItem | null> => {
    try {
        const item = await apiFetch(`/news/${id}`);
        const processedImageUrl = processImageUrl(item);

        return {
            id: item.id,
            title: item.title || 'Без заголовка',
            content: item.content || '',
            fullContent: item.full_content || item.fullContent || item.content || '',
            category: item.category || 'Общая',
            imageUrl: processedImageUrl, // Используем обработанный URL
            author: item.author || 'Администрация',
            updatedAt: item.updated_at || item.updatedAt || item.created_at || item.createdAt || new Date().toISOString(),
            viewCount: item.view_count || item.viewCount || 0,
            likesCount: item.likes_count || item.likesCount || 0,
            commentsCount: item.comments_count || item.commentsCount || 0,
            timeAgo: item.timeAgo || item.time_ago || getRelativeTime(item.updated_at || item.updatedAt || item.created_at || item.createdAt),
            createdAt: item.created_at || item.createdAt,
            isActive: item.isActive !== undefined ? item.isActive : true,
        };
    } catch (error: any) {
        console.error(`❌ Ошибка загрузки новости #${id}:`, error.message);
        return null;
    }
};