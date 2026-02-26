import api from '@/lib/axios';
import type { OrderResponse, OrderDetailResponse, OrderCreateRequest } from '@/types';

const ORDER_BASE = '/api/v1/orders';

export const orderService = {
    // 주문 생성
    createOrder: async (request: OrderCreateRequest): Promise<number> => {
        const response = await api.post(ORDER_BASE, request);
        const data = response.data;
        // 백엔드가 OrderResponse 객체를 반환하는 경우 orderId 추출
        if (typeof data === 'object' && data !== null && 'orderId' in data) {
            return data.orderId;
        }
        // 숫자를 직접 반환하는 경우
        return Number(data);
    },

    // 주문 목록 조회
    getOrders: async (): Promise<OrderResponse[]> => {
        const response = await api.get<OrderResponse[]>(`${ORDER_BASE}/orderList`);
        return response.data;
    },

    // 주문 상세 조회
    getOrderDetail: async (orderId: number): Promise<OrderDetailResponse> => {
        const response = await api.get<OrderDetailResponse>(`${ORDER_BASE}/${orderId}`);
        return response.data;
    },

    // 주문 취소
    cancelOrder: async (orderId: number): Promise<void> => {
        await api.patch(`${ORDER_BASE}/${orderId}/status`);
    },

    // 장바구니에서 주문 생성
    createOrderFromCart: async (cartItemId: number): Promise<number> => {
        const response = await api.post(`${ORDER_BASE}/cart/${cartItemId}`);
        const data = response.data;
        // 백엔드가 OrderResponse 객체를 반환하는 경우 orderId 추출
        if (typeof data === 'object' && data !== null && 'orderId' in data) {
            return data.orderId;
        }
        return Number(data);
    },
};

export default orderService;
