import api from '@/lib/axios';
import type { CartItem, RecommendProductInfoResponse, RecommendItem, RecommendPollingResponse } from '@/types';

const CART_BASE = '/api/v1/carts';
const RECOMMEND_BASE = '/api/v1/carts/recommend';

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

    // ──────────────────────────────────────────
    // 장바구니 기반 AI 추천 (비동기 폴링 방식)
    // 1) POST /api/v1/carts/recommend → requestId 수신
    // 2) GET  /api/v1/carts/recommend/{requestId} 폴링
    // ──────────────────────────────────────────

    /** 추천 요청 전송 → requestId 반환 */
    requestRecommend: async (items: RecommendItem[]): Promise<string> => {
        const response = await api.post<{ requestId: string }>(RECOMMEND_BASE, items);
        return response.data.requestId;
    },

    /** requestId로 추천 결과 폴링 (1회) */
    pollRecommendResult: async (requestId: string): Promise<RecommendPollingResponse> => {
        const response = await api.get<RecommendPollingResponse>(`${RECOMMEND_BASE}/${requestId}`);
        return response.data;
    },

    /**
     * 장바구니 상품 정보로 추천 결과를 요청-폴링하여 최종 결과를 반환
     * @param cartItems 현재 장바구니 상품 목록 (imageUrl, category 전달용)
     * @param maxRetries 최대 폴링 횟수 (기본 10)
     * @param intervalMs 폴링 간격 ms (기본 1500)
     */
    getRecommendedProducts: async (
        cartItems?: Array<{ imageUrl?: string; category?: string }>,
        maxRetries = 10,
        intervalMs = 1500,
    ): Promise<RecommendProductInfoResponse[]> => {
        // cartItems가 비어있으면 빈 배열 반환
        if (!cartItems || cartItems.length === 0) return [];

        // 1) 추천 요청
        const recommendItems: RecommendItem[] = cartItems.map(item => ({
            imageUrl: item.imageUrl || '',
            category: item.category || '',
        }));

        const requestId = await cartService.requestRecommend(recommendItems);

        // 2) 폴링
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        for (let i = 0; i < maxRetries; i++) {
            await delay(intervalMs);
            const result = await cartService.pollRecommendResult(requestId);

            if (result.status === 'COMPLETED' && result.data) {
                // RecommendResultItem → RecommendProductInfoResponse 변환
                // data에는 카테고리별 추천 productId 목록이 있으므로 평탄화
                const products: RecommendProductInfoResponse[] = [];
                for (const resultItem of result.data) {
                    for (const pid of resultItem.productIds) {
                        products.push({
                            productId: Number(pid),
                            productName: '',  // 추후 상품 상세에서 보여줌
                            productPrice: 0,
                            imageUrl: resultItem.imageUrl || undefined,
                            storeName: '',
                            categoryCode: resultItem.category,
                        });
                    }
                }
                return products;
            }

            if (result.status === 'FAILED') {
                console.warn('추천 처리 실패:', result.message);
                return [];
            }
            // PROCESSING → 다음 폴링 대기
        }

        // 최대 횟수 초과
        console.warn('추천 폴링 타임아웃');
        return [];
    },
};

export default cartService;
