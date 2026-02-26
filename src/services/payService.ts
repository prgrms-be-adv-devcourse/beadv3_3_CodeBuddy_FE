import api from '@/lib/axios';
import type {
    AccountBalanceResponse,
    AccountHistoryResponse,
    PaymentConfirmRequest,
    PaymentResponse,
} from '@/types';

const ACCOUNT_BASE = '/api/v1/account';
const PAYMENT_BASE = '/api/v1/payments';

export const payService = {
    // 예치금 잔액 조회
    getBalance: async (): Promise<AccountBalanceResponse> => {
        const response = await api.get<AccountBalanceResponse>(`${ACCOUNT_BASE}/me`);
        return response.data;
    },

    // 예치금 충전 확정 (Toss Payments 콜백 후 호출)
    chargeDeposit: async (request: PaymentConfirmRequest): Promise<AccountHistoryResponse> => {
        const response = await api.post<AccountHistoryResponse>(`${ACCOUNT_BASE}/charge`, request);
        return response.data;
    },

    // 충전/사용 내역 전체 조회
    getHistory: async (): Promise<AccountHistoryResponse[]> => {
        const response = await api.get<AccountHistoryResponse[]>(`${ACCOUNT_BASE}/history`);
        return response.data;
    },

    // 결제 내역 목록 조회
    getPayments: async (): Promise<PaymentResponse[]> => {
        const response = await api.get<PaymentResponse[]>(PAYMENT_BASE);
        return response.data;
    },

    // 특정 주문의 결제 정보 조회
    getPaymentByOrderId: async (orderId: number): Promise<PaymentResponse> => {
        const response = await api.get<PaymentResponse>(`${PAYMENT_BASE}/${orderId}`);
        return response.data;
    },
};

export default payService;
