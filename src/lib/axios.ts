import axios from 'axios';

// Use relative paths - Vite proxy will forward /api/* to Gateway
// In production, configure nginx or similar to proxy /api to the gateway
const API_BASE_URL = '';

// Create axios instance configured for the Gateway
export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 인증이 필요 없는 공개 API 경로
const PUBLIC_PATHS = ['/api/v1/authc', '/api/v1/auth/login'];

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const requestPath = config.url || '';
        const isPublicPath = PUBLIC_PATHS.some(path => requestPath.includes(path));

        // 공개 API에는 인증 헤더를 첨부하지 않음
        if (!isPublicPath) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Add user ID and role headers for backend services
            const userId = localStorage.getItem('userId');
            if (userId) {
                config.headers['X-User-Id'] = userId;
            }

            const userRole = localStorage.getItem('userRole');
            if (userRole) {
                config.headers['X-User-Role'] = userRole;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 401 - Token expired
        if (error.response?.status === 401) {
            // Clear tokens and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
