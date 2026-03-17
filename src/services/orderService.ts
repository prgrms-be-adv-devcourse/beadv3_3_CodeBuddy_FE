import api from '@/lib/axios';
import type { OrderResponse, OrderDetailResponse, OrderCreateRequest } from '@/types';

const ORDER_BASE = '/api/v1/orders';

export const orderService = {
    // 주문 생성
    createOrder: async (request: OrderCreateRequest): Promise<number> => {
        const response = await api.post(ORDER_BASE, request);
        const data = response.data;

        // 백엔드가 OrderResult 객체로 { message: '...', data: 123 } 형태를 반환하는 경우
        if (typeof data === 'object' && data !== null && 'data' in data) {
            return Number(data.data);
        }

        // 과거 로직 대응용 (데이터가 직접 떨어지거나 orderId를 포함한 경우)
        if (typeof data === 'object' && data !== null && 'orderId' in data) {
            return data.orderId;
        }

        return Number(data);
    },

    // 주문 목록 조회
    getOrders: async (): Promise<OrderResponse[]> => {
        const response = await api.get(`${ORDER_BASE}/orderList`);
        const data = response.data;
        if (typeof data === 'object' && data !== null && 'data' in data) {
            return data.data as OrderResponse[];
        }
        return data as OrderResponse[];
    },

    // 주문 상세 조회
    getOrderDetail: async (orderId: number): Promise<OrderDetailResponse> => {
        const response = await api.get(`${ORDER_BASE}/${orderId}`);
        const data = response.data;
        if (typeof data === 'object' && data !== null && 'data' in data) {
            return data.data as OrderDetailResponse;
        }
        return data as OrderDetailResponse;
    },

    // 주문 취소
    cancelOrder: async (orderId: number): Promise<void> => {
        await api.patch(`${ORDER_BASE}/${orderId}/status`);
    },

    // 장바구니에서 주문 생성
    createOrderFromCart: async (cartItemId: number): Promise<number> => {
        const response = await api.post(`${ORDER_BASE}/cart/${cartItemId}`);
        const data = response.data;

        // 백엔드가 OrderResult 객체로 { message: '...', data: 123 } 형태를 반환하는 경우
        if (typeof data === 'object' && data !== null && 'data' in data) {
            return Number(data.data);
        }

        // 과거 로직 대응용 (데이터가 직접 떨어지거나 orderId를 포함한 경우)
        if (typeof data === 'object' && data !== null && 'orderId' in data) {
            return data.orderId;
        }

        return Number(data);
    },
};

export default orderService;
