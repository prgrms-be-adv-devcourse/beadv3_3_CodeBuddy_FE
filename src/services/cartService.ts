import api from '@/lib/axios';
import type { CartItem, RecommendProductInfoResponse } from '@/types';

const CART_BASE = '/api/v1/carts';

export const cartService = {
    // 장바구니 조회
    getCart: async (): Promise<CartItem[]> => {
        const response = await api.get<{
            message: string;
            data: Array<{
                cartItemId: number;
                productId: number;
                productName: string;
                productPrice: number;  // 단가
                cartCount: number;
                storeName: string;
                imageUrl?: string;
            }>
        }>(CART_BASE);
        return (response.data.data ?? []).map(item => ({
            cartItemId: item.cartItemId,
            productId: item.productId,
            productName: item.productName,
            cartCount: item.cartCount,
            cartPrice: item.productPrice * item.cartCount,  // 총 금액으로 변환
            imageUrl: item.imageUrl,
        }));
    },

    // 장바구니에 상품 추가 (백엔드: productCount 필드명 사용)
    addToCart: async (request: { productId: number; productCount: number }): Promise<number> => {
        const response = await api.post<{ message: string; data: number }>(`${CART_BASE}/items`, request);
        return response.data.data;
    },

    // 장바구니 수량 수정 (백엔드: body에 {cartItemId, cartCount})
    updateCartItem: async (cartItemId: number, cartCount: number): Promise<void> => {
        await api.patch(`${CART_BASE}/items`, { cartItemId, cartCount });
    },

    // 장바구니 상품 삭제 (백엔드: body에 {cartItemList: [id, ...]})
    deleteCartItem: async (cartItemId: number): Promise<void> => {
        await api.delete(`${CART_BASE}/items`, {
            data: { cartItemList: [cartItemId] },
        });
    },

    // 장바구니 기반 상품 추천
    getRecommendedProducts: async (): Promise<RecommendProductInfoResponse[]> => {
        const response = await api.get<{ message: string; data: RecommendProductInfoResponse[] }>(`${CART_BASE}/recommend/items`);
        return response.data.data;
    },
};

export default cartService;
