import api from '@/lib/axios';
import type { SignUpRequest, MemberResponse, MemberUpdateRequest } from '@/types';

const AUTH_BASE = '/api/v1';

export const authService = {
    // 회원가입
    signUp: async (request: SignUpRequest): Promise<string> => {
        const response = await api.post<string>(`${AUTH_BASE}/authc`, request);
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

    // 내 정보 조회
    getMe: async (): Promise<MemberResponse> => {
        const response = await api.get<MemberResponse>(`${AUTH_BASE}/members/me`);
        return response.data;
    },

    // 내 정보 수정
    updateMe: async (request: MemberUpdateRequest): Promise<MemberResponse> => {
        const response = await api.patch<MemberResponse>(`${AUTH_BASE}/members/me`, request);
        return response.data;
    },

    // 회원 탈퇴
    deleteMe: async (): Promise<void> => {
        await api.delete(`${AUTH_BASE}/members/me`);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
    },

    // 판매자 등록
    registerSeller: async (): Promise<void> => {
        await api.post(`${AUTH_BASE}/members/me/seller`);
    },
};

export default authService;
