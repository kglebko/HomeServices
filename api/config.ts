// api/config.ts
import { Platform } from 'react-native';

// ==== ВАЖНО: ЗАМЕНИТЕ НА СВОЙ IP! ====
// Узнайте IP командой: ipconfig (Windows) или ifconfig (Mac/Linux)
// Ищите IPv4 адрес (обычно 192.168.1.xxx или 192.168.0.xxx)
const LOCAL_IP = '192.168.0.104'; // ← ЗАМЕНИТЕ НА СВОЙ!

// Базовый URL для всех запросов
export const BASE_URL = `http://${LOCAL_IP}:8080`;
export const API_BASE_URL = `${BASE_URL}/api`;

console.log(`📱 Платформа: ${Platform.OS}`);
console.log(`🌐 IP сервера: ${LOCAL_IP}`);
console.log(`🌐 Базовый URL: ${BASE_URL}`);
console.log(`🌐 API URL: ${API_BASE_URL}`);

// Функция для получения полного URL изображения
export const getFullImageUrl = (imageUrl: string): string => {
    if (!imageUrl || imageUrl.trim() === '') {
        return '';
    }

    // Если уже полный URL
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }

    // Если относительный путь
    if (imageUrl.startsWith('/uploads/')) {
        return `${BASE_URL}${imageUrl}`;
    }

    // Если только имя файла
    return `${BASE_URL}/uploads/${imageUrl}`;
};