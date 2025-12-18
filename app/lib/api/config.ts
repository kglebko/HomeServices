export const API_CONFIG = {
    BASE_URL: 'http://25.21.56.83:5001',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/api/auth/login',
            VERIFY: '/api/auth/verify',
            LOGOUT: '/api/auth/logout',
        },
        NEWS: {
            ADMIN_LIST: '/api/admin/news',
            CREATE: '/api/admin/news',
            UPDATE: '/api/admin/news/:id',
            DELETE: '/api/admin/news/:id',
        }
    }
} as const;