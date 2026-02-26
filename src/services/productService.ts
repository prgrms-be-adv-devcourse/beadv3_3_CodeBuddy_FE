import api from '@/lib/axios';
import type { ProductResponse, ProductCreateRequest, UpdateProductRequest, CatalogResult, Page, ProductSearchResponse, Category } from '@/types';

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

    // ----------------------------------------------------
    // 검색 및 자동완성
    // ----------------------------------------------------

    // 전체 상품 검색 (페이징 지원)
    searchProducts: async (keyword: string, page: number = 0, size: number = 10): Promise<Page<ProductSearchResponse>> => {
        const response = await api.get<Page<ProductSearchResponse>>(`${CATALOG_BASE}/products/search`, {
            params: { keyword, page, size }
        });
        return response.data;
    },

    // 카테고리 기반 상품 검색 (페이징 지원)
    // keyword는 선택 사항이므로, 비어있을 경우 파라미터에서 제외합니다.
    searchByCategory: async (categoryName: Category, keyword?: string, page: number = 0, size: number = 10): Promise<Page<ProductSearchResponse>> => {
        const params: Record<string, any> = { page, size };
        if (keyword && keyword.trim() !== '') {
            params.keyword = keyword;
        }
        const response = await api.get<Page<ProductSearchResponse>>(`${CATALOG_BASE}/category/${categoryName}`, { params });
        return response.data;
    },

    // 자동완성
    getSuggestions: async (prefix: string, limit: number = 10): Promise<string[]> => {
        const response = await api.get<string[]>(`${CATALOG_BASE}/suggestions`, {
            params: { prefix, limit }
        });
        return response.data;
    },
};

export default productService;
