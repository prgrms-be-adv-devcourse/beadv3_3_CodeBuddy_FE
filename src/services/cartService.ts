import api from '@/lib/axios';
import type { CartItem, CartCreateRequest, RecommendProductInfoResponse } from '@/types';

const CART_BASE = '/api/v1/carts';

export const cartService = {
    // 장바구니 조회
    getCart: async (): Promise<CartItem[]> => {
        const response = await api.get<CartItem[]>(CART_BASE);
        return response.data;
    },

    // 장바구니에 상품 추가
    addToCart: async (request: CartCreateRequest): Promise<number> => {
        const response = await api.post<number>(CART_BASE, request);
        return response.data;
    },

    // 장바구니 수량 수정
    updateCartItem: async (cartItemId: number, cartCount: number): Promise<void> => {
        await api.patch(`${CART_BASE}/items/${cartItemId}`, null, {
            params: { cartCount },
        });
    },

    // 장바구니 상품 삭제
    deleteCartItem: async (cartItemId: number): Promise<void> => {
        await api.delete(`${CART_BASE}/items/${cartItemId}`);
    },

    // 장바구니 기반 상품 추천
    getRecommendedProducts: async (): Promise<RecommendProductInfoResponse[]> => {
        const response = await api.get<{ message: string; data: RecommendProductInfoResponse[] }>(`${CART_BASE}/recommend/items`);
        return response.data.data;
    },
};

export default cartService;
