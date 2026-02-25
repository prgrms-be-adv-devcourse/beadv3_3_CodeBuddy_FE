import api from '@/lib/axios';
import type { SignUpRequest, LoginRequest } from '@/types';

const AUTH_BASE = '/api/v1';

export const authService = {
    // 회원가입
    signUp: async (request: SignUpRequest): Promise<string> => {
        const response = await api.post<string>(`${AUTH_BASE}/authc`, request);
        return response.data;
    },

    // 로그인
    login: async (request: LoginRequest): Promise<{ accessToken: string; refreshToken: string }> => {
        const params = new URLSearchParams();
        params.append('memberId', request.memberId);
        params.append('password', request.password);

        const response = await api.post<{ accessToken: string; refreshToken: string }>(
            `${AUTH_BASE}/auth/login`,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data;
    },

    // 로그아웃
    logout: async (): Promise<void> => {
        await api.post(`${AUTH_BASE}/auth/logout`);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
    },
};

export default authService;
