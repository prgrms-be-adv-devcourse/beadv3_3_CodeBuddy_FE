import api from '@/lib/axios';
import type { ProductResponse, ProductCreateRequest, UpdateProductRequest, CatalogResult } from '@/types';

const CATALOG_BASE = '/api/v1/catalog';

export const productService = {
    // 전체 상품 조회
    getAllProducts: async (): Promise<ProductResponse[]> => {
        const response = await api.get<ProductResponse[]>(`${CATALOG_BASE}/products`);
        return response.data;
    },

    // 상품 단건 조회
    getProduct: async (productId: number): Promise<ProductResponse> => {
        const response = await api.get<ProductResponse>(`${CATALOG_BASE}/products/${productId}`);
        return response.data;
    },

    // 특정 상점의 상품 목록 조회
    getProductsByStore: async (storeId: number): Promise<ProductResponse[]> => {
        const response = await api.get<ProductResponse[]>(`${CATALOG_BASE}/products/${storeId}/products`);
        return response.data;
    },

    // 상품 등록
    createProduct: async (storeId: number, request: ProductCreateRequest): Promise<CatalogResult<void>> => {
        const response = await api.post<CatalogResult<void>>(`${CATALOG_BASE}/stores/${storeId}/products`, request);
        return response.data;
    },

    // 상품 수정
    updateProduct: async (productId: number, request: UpdateProductRequest): Promise<CatalogResult<void>> => {
        const response = await api.put<CatalogResult<void>>(`${CATALOG_BASE}/products/${productId}`, request);
        return response.data;
    },

    // 상품 삭제
    deleteProduct: async (productId: number): Promise<CatalogResult<void>> => {
        const response = await api.delete<CatalogResult<void>>(`${CATALOG_BASE}/products/${productId}`);
        return response.data;
    },
};

export default productService;
