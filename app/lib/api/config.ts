export const API_CONFIG = {
    BASE_URL: 'http://25.21.56.83:5001',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/api/auth/login',
            VERIFY: '/api/auth/verify',
        }
    }
} as const;

export const ADMIN_CREDENTIALS = {
    email: 'admin@gmail.com',
    password: '123456'
} as const;