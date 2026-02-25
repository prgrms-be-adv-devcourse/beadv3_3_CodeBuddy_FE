import api from '@/lib/axios';
import type {
    StoreResponse,
    UpsertStoreRequest,
    UpdateStoreRequest,
    CatalogResult
} from '@/types';

const STORE_BASE = '/api/v1/catalog/stores';

export const storeService = {
    // 상점 등록
    createStore: async (data: UpsertStoreRequest) => {
        const response = await api.post<CatalogResult<void>>(`${STORE_BASE}`, data);
        return response.data;
    },

    // 내 상점 목록 조회
    getMyStores: async () => {
        const response = await api.get<StoreResponse[]>(`${STORE_BASE}/me`);
        return response.data;
    },

    // 전체 상점 목록 조회
    getAllStores: async () => {
        const response = await api.get<StoreResponse[]>(`${STORE_BASE}`);
        return response.data;
    },

    // 상점 단건 조회
    getStore: async (storeId: number) => {
        const response = await api.get<StoreResponse>(`${STORE_BASE}/${storeId}`);
        return response.data;
    },

    // 상점 정보 수정
    updateStore: async (storeId: number, data: UpdateStoreRequest) => {
        const response = await api.put<CatalogResult<void>>(`${STORE_BASE}/${storeId}`, data);
        return response.data;
    },

    // 상점 삭제
    deleteStore: async (storeId: number) => {
        const response = await api.delete<CatalogResult<void>>(`${STORE_BASE}/${storeId}`);
        return response.data;
    }
};
