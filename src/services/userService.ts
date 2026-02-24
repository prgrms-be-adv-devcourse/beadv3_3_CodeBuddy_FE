import api from '@/lib/axios';
import type { MemberResponse, MemberUpdateRequest } from '@/types';

const MEMBER_BASE = '/api/v1/members';

export const userService = {
    // 내 정보 조회
    getMe: async () => {
        const response = await api.get<MemberResponse>(`${MEMBER_BASE}/me`);
        return response.data;
    },

    // 내 정보 수정
    updateMe: async (data: MemberUpdateRequest) => {
        const response = await api.patch<MemberResponse>(`${MEMBER_BASE}/me`, data);
        return response.data;
    },

    // 회원 탈퇴
    deleteMe: async () => {
        await api.delete(`${MEMBER_BASE}/me`);
    },

    // 판매자 권한 신청
    registerSellerRole: async () => {
        await api.post(`${MEMBER_BASE}/me/seller`);
    }
};
