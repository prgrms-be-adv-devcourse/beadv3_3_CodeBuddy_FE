import api from '@/lib/axios';
import type { OrderResponse, OrderDetailResponse, OrderCreateRequest } from '@/types';

const ORDER_BASE = '/api/v1/orders';

export const orderService = {
    // 주문 생성
    createOrder: async (request: OrderCreateRequest): Promise<number> => {
        const response = await api.post<number>(ORDER_BASE, request);
        return response.data;
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
    createOrderFromCart: async (orderId: number): Promise<number> => {
        const response = await api.post<number>(`${ORDER_BASE}/cart/${orderId}`);
        return response.data;
    },
};

export default orderService;
