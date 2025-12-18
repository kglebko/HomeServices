import { router } from 'expo-router';

// Утилита для безопасной навигации
export const navigate = {
    toAdmin: () => router.push('/(admin)' as any),
    toAdminLogin: () => router.push('/(admin)/login' as any),
    toAdminNews: () => router.push('/(admin)/news' as any),
    toAdminNewsCreate: () => router.push('/(admin)/news/create' as any),
    toAdminServices: () => router.push('/(admin)/services' as any),
    toAdminServicesCreate: () => router.push('/(admin)/services/create' as any),
    toAdminPosts: () => router.push('/(admin)/posts' as any),
    toAdminPostsCreate: () => router.push('/(admin)/posts/create' as any),
    back: () => router.back(),
    replace: (path: string) => router.replace(path as any),
};