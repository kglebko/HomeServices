import { Platform } from 'react-native';


const getBaseUrl = (): string => {
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8080';
    }
    return 'http://192.168.0.104:8080';
};

const API_BASE_URL = `${getBaseUrl()}/api`;
const BASE_URL = getBaseUrl();

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
    isLiked?: boolean;
};

export const getFullImageUrl = (imageUrl: string): string => {
    if (!imageUrl || imageUrl.trim() === '') {
        return '';
    }

    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }

    if (imageUrl.startsWith('/uploads/')) {
        return `${BASE_URL}${imageUrl}`;
    }

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
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error(`❌ Ошибка запроса ${endpoint}:`, error.message);
        throw error;
    }
};

const processImageUrl = (item: any): string => {
    const imageUrl = item.image_url || item.imageUrl || '';

    if (!imageUrl || imageUrl.trim() === '') {
        return '';
    }

    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }

    return imageUrl;
};

// ========== СТАРЫЕ ФУНКЦИИ (для обратной совместимости) ==========

export const fetchLatestNewsLegacy = async (): Promise<NewsItem[]> => {
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
                imageUrl: processedImageUrl,
                author: item.author || 'Администрация',
                updatedAt: item.updated_at || item.updatedAt || item.created_at || item.createdAt || new Date().toISOString(),
                viewCount: item.view_count || item.viewCount || 0,
                likesCount: item.likes_count || item.likesCount || 0,
                commentsCount: item.comments_count || item.commentsCount || 0,
                timeAgo: item.timeAgo || item.time_ago || getRelativeTime(item.updated_at || item.updatedAt || item.created_at || item.createdAt),
                createdAt: item.created_at || item.createdAt,
                isActive: item.isActive !== undefined ? item.isActive : true,
                isLiked: false,
            };
        });
    } catch (error: any) {
        console.error('❌ Ошибка загрузки новостей (legacy):', error.message);
        return [];
    }
};

// Основная функция для загрузки всех новостей (теперь с лайками)
export const fetchAllNews = async (userId: number = 1): Promise<NewsItem[]> => {
    try {
        const response = await apiFetch(`/news?page=0&size=20&userId=${userId}`);
        const data = response.content || response || [];

        return data.map((item: any) => {
            const processedImageUrl = processImageUrl(item);

            return {
                id: item.id,
                title: item.title || 'Без заголовка',
                content: item.content || '',
                fullContent: item.full_content || item.fullContent || item.content || '',
                category: item.category || 'Общая',
                imageUrl: processedImageUrl,
                author: item.author || 'Администрация',
                updatedAt: item.updated_at || item.updatedAt || item.created_at || item.createdAt || new Date().toISOString(),
                viewCount: item.view_count || item.viewCount || 0,
                likesCount: item.likes_count || item.likesCount || 0,
                commentsCount: item.comments_count || item.commentsCount || 0,
                timeAgo: item.timeAgo || item.time_ago || getRelativeTime(item.updated_at || item.updatedAt || item.created_at || item.createdAt),
                createdAt: item.created_at || item.createdAt,
                isActive: item.isActive !== undefined ? item.isActive : true,
                isLiked: item.isLiked || false,
            };
        });
    } catch (error: any) {
        console.error('❌ Ошибка загрузки всех новостей:', error.message);
        return [];
    }
};

export const fetchNewsByIdLegacy = async (id: number): Promise<NewsItem | null> => {
    try {
        const item = await apiFetch(`/news/${id}`);
        const processedImageUrl = processImageUrl(item);

        return {
            id: item.id,
            title: item.title || 'Без заголовка',
            content: item.content || '',
            fullContent: item.full_content || item.fullContent || item.content || '',
            category: item.category || 'Общая',
            imageUrl: processedImageUrl,
            author: item.author || 'Администрация',
            updatedAt: item.updated_at || item.updatedAt || item.created_at || item.createdAt || new Date().toISOString(),
            viewCount: item.view_count || item.viewCount || 0,
            likesCount: item.likes_count || item.likesCount || 0,
            commentsCount: item.comments_count || item.commentsCount || 0,
            timeAgo: item.timeAgo || item.time_ago || getRelativeTime(item.updated_at || item.updatedAt || item.created_at || item.createdAt),
            createdAt: item.created_at || item.createdAt,
            isActive: item.isActive !== undefined ? item.isActive : true,
            isLiked: false,
        };
    } catch (error: any) {
        console.error(`❌ Ошибка загрузки новости #${id} (legacy):`, error.message);
        return null;
    }
};

// ========== НОВЫЕ ФУНКЦИИ (с поддержкой лайков) ==========

// Основная функция для загрузки последних новостей (теперь с лайками)
export const fetchLatestNews = async (userId: number = 1): Promise<NewsItem[]> => {
    try {
        const data = await apiFetch(`/news/latest-with-likes?count=6&userId=${userId}`);

        return data.map((item: any) => {
            const processedImageUrl = processImageUrl(item);

            return {
                id: item.id,
                title: item.title || 'Без заголовка',
                content: item.content || '',
                fullContent: item.full_content || item.fullContent || item.content || '',
                category: item.category || 'Общая',
                imageUrl: processedImageUrl,
                author: item.author || 'Администрация',
                updatedAt: item.updated_at || item.updatedAt || item.created_at || item.createdAt || new Date().toISOString(),
                viewCount: item.view_count || item.viewCount || 0,
                likesCount: item.likes_count || item.likesCount || 0,
                commentsCount: item.comments_count || item.commentsCount || 0,
                timeAgo: item.timeAgo || item.time_ago || getRelativeTime(item.updated_at || item.updatedAt || item.created_at || item.createdAt),
                createdAt: item.created_at || item.createdAt,
                isActive: item.isActive !== undefined ? item.isActive : true,
                isLiked: item.isLiked || false,
            };
        });
    } catch (error: any) {
        console.error('❌ Ошибка загрузки новостей с лайками:', error.message);
        // Пробуем старый метод как запасной вариант
        return await fetchLatestNewsLegacy();
    }
};

// Основная функция для загрузки новости по ID (теперь с лайками)
export const fetchNewsById = async (id: number, userId: number = 1): Promise<NewsItem | null> => {
    try {
        const item = await apiFetch(`/news/${id}/with-likes?userId=${userId}`);
        const processedImageUrl = processImageUrl(item);

        return {
            id: item.id,
            title: item.title || 'Без заголовка',
            content: item.content || '',
            fullContent: item.full_content || item.fullContent || item.content || '',
            category: item.category || 'Общая',
            imageUrl: processedImageUrl,
            author: item.author || 'Администрация',
            updatedAt: item.updated_at || item.updatedAt || item.created_at || item.createdAt || new Date().toISOString(),
            viewCount: item.view_count || item.viewCount || 0,
            likesCount: item.likes_count || item.likesCount || 0,
            commentsCount: item.comments_count || item.commentsCount || 0,
            timeAgo: item.timeAgo || item.time_ago || getRelativeTime(item.updated_at || item.updatedAt || item.created_at || item.createdAt),
            createdAt: item.created_at || item.createdAt,
            isActive: item.isActive !== undefined ? item.isActive : true,
            isLiked: item.isLiked || false,
        };
    } catch (error: any) {
        console.error(`❌ Ошибка загрузки новости #${id} с лайками:`, error.message);
        // Пробуем старый метод как запасной вариант
        return await fetchNewsByIdLegacy(id);
    }
};

// Функция для переключения лайка
export const toggleNewsLike = async (newsId: number, userId: number = 1): Promise<any> => {
    try {
        console.log(`🔄 Отправка лайка для новости ${newsId}, пользователь ${userId}`);

        const response = await fetch(`${API_BASE_URL}/news/${newsId}/toggle-like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Ошибка сервера:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Лайк обновлен:', result);
        return result;
    } catch (error: any) {
        console.error('❌ Ошибка при обновлении лайка:', error.message);
        throw error;
    }
};

// Функция для проверки статуса лайка
export const checkLikeStatus = async (newsId: number, userId: number = 1): Promise<any> => {
    try {
        console.log(`🔄 Проверка статуса лайка для новости ${newsId}`);

        const response = await fetch(`${API_BASE_URL}/news/${newsId}/like-status/${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Статус лайка:', result);
        return result;
    } catch (error: any) {
        console.error('❌ Ошибка при проверке статуса лайка:', error.message);
        throw error;
    }
};

// Дополнительная функция для загрузки новостей с пагинацией
export const fetchNewsWithPagination = async (
    page: number = 0,
    size: number = 10,
    userId: number = 1
): Promise<{content: NewsItem[], totalItems: number, totalPages: number}> => {
    try {
        const response = await apiFetch(`/news?page=${page}&size=${size}&userId=${userId}`);

        const content: NewsItem[] = (response.content || []).map((item: any) => {
            const processedImageUrl = processImageUrl(item);

            return {
                id: item.id,
                title: item.title || 'Без заголовка',
                content: item.content || '',
                fullContent: item.full_content || item.fullContent || item.content || '',
                category: item.category || 'Общая',
                imageUrl: processedImageUrl,
                author: item.author || 'Администрация',
                updatedAt: item.updated_at || item.updatedAt || item.created_at || item.createdAt || new Date().toISOString(),
                viewCount: item.view_count || item.viewCount || 0,
                likesCount: item.likes_count || item.likesCount || 0,
                commentsCount: item.comments_count || item.commentsCount || 0,
                timeAgo: item.timeAgo || item.time_ago || getRelativeTime(item.updated_at || item.updatedAt || item.created_at || item.createdAt),
                createdAt: item.created_at || item.createdAt,
                isActive: item.isActive !== undefined ? item.isActive : true,
                isLiked: item.isLiked || false,
            };
        });

        return {
            content,
            totalItems: response.totalItems || 0,
            totalPages: response.totalPages || 0
        };
    } catch (error: any) {
        console.error('❌ Ошибка загрузки новостей с пагинацией:', error.message);
        return {
            content: [],
            totalItems: 0,
            totalPages: 0
        };
    }
};

// Функция для поиска новостей
export const searchNews = async (query: string, userId: number = 1): Promise<{content: NewsItem[], totalItems: number, totalPages: number}> => {
    try {
        const response = await apiFetch(`/news/search?query=${query}&page=0&size=20&userId=${userId}`);

        const content: NewsItem[] = (response.content || []).map((item: any) => {
            const processedImageUrl = processImageUrl(item);

            return {
                id: item.id,
                title: item.title || 'Без заголовка',
                content: item.content || '',
                fullContent: item.full_content || item.fullContent || item.content || '',
                category: item.category || 'Общая',
                imageUrl: processedImageUrl,
                author: item.author || 'Администрация',
                updatedAt: item.updated_at || item.updatedAt || item.created_at || item.createdAt || new Date().toISOString(),
                viewCount: item.view_count || item.viewCount || 0,
                likesCount: item.likes_count || item.likesCount || 0,
                commentsCount: item.comments_count || item.commentsCount || 0,
                timeAgo: item.timeAgo || item.time_ago || getRelativeTime(item.updated_at || item.updatedAt || item.created_at || item.createdAt),
                createdAt: item.created_at || item.createdAt,
                isActive: item.isActive !== undefined ? item.isActive : true,
                isLiked: item.isLiked || false,
            };
        });

        return {
            content,
            totalItems: response.totalItems || 0,
            totalPages: response.totalPages || 0
        };
    } catch (error: any) {
        console.error('❌ Ошибка поиска новостей:', error.message);
        return {
            content: [],
            totalItems: 0,
            totalPages: 0
        };
    }
};