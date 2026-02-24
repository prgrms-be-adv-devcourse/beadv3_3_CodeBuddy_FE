import api from '@/lib/axios';
import type {
    SellerResponse,
    SellerUpsertRequest,
    CatalogResult
} from '@/types';

const SELLER_BASE = '/api/v1/catalog/sellers';

export const sellerService = {
    // 판매자 등록
    register: async (data: SellerUpsertRequest) => {
        const response = await api.post<CatalogResult<void>>(`${SELLER_BASE}`, data);
        return response.data;
    },

    // 내 판매자 정보 조회
    getMyInfo: async () => {
        const response = await api.get<SellerResponse>(`${SELLER_BASE}/me`);
        return response.data;
    },

    // 판매자 정보 수정
    update: async (data: SellerUpsertRequest) => {
        const response = await api.put<CatalogResult<void>>(`${SELLER_BASE}/me`, data);
        return response.data;
    },

    // 판매자 등록 해제
    unregister: async () => {
        const response = await api.delete<CatalogResult<void>>(`${SELLER_BASE}/me`);
        return response.data;
    }
};
