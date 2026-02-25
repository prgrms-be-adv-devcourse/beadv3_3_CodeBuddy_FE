// ============================
// Category Enum
// ============================
export type Category = 'TOP' | 'PANTS';

// ============================
// Product Types
// ============================
export interface ProductResponse {
    productId: number;
    productName: string;
    productPrice: number;
    productStock: number;
    category: Category;
    storeName: string;
    imageUrl?: string;
}

export interface RecommendProductInfoResponse {
    productId: number;
    productName: string;
    productPrice: number;
    imageUrl?: string;
    storeName: string;
    categoryCode: string;
}

export interface ProductCreateRequest {
    productName: string;
    productPrice: number;
    productStock: number;
    imgUrl?: string;
    categoryCode: Category;
}

export interface UpdateProductRequest {
    productName?: string;
    productPrice?: number;
    productStock?: number;
    imgUrl?: string;
    category?: Category;
}

// ============================
// Cart Types
// ============================
export interface CartCreateRequest {
    productId: number;
    cartCount: number;
}

export interface CartItem {
    cartItemId: number;
    productId: number;
    productName: string;
    cartCount: number;
    cartPrice: number;
    imageUrl?: string;
}

// ============================
// Order Types
// ============================
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItemCreateRequest {
    productId: number;
    orderCount: number;
}

export interface OrderCreateRequest {
    orderItems: OrderItemCreateRequest[];
}

export interface OrderItem {
    productId: number;
    storeName: string;
    productName: string;
    orderCount: number;
    orderPrice: number;
}

export interface OrderResponse {
    orderId: number;
    productName: string[];
    orderAmount: number;
}

export interface OrderDetailResponse {
    orderId: number;
    createdAt: string;
    orderStatus: OrderStatus;
    orderAmount: number;
    orderItems: OrderItem[];
}

// ============================
// User/Auth Types
// ============================
export interface SignUpRequest {
    username: string;
    memberId: string;
    email: string;
    password: string;
    address: string;
    phone: string;
}

export interface LoginRequest {
    memberId: string;
    password: string;
}

export interface MemberResponse {
    id: number;
    memberId: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    role: string;
}

export interface MemberUpdateRequest {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
}

// ============================
// API Response Types
// ============================
export interface CatalogResult<T> {
    message: string;
    data?: T;
}

export interface ApiError {
    message: string;
    status: number;
}

// ============================
// Seller Types
// ============================
export interface SellerResponse {
    sellerId: number;
    sellerName: string;
}

export interface SellerUpsertRequest {
    sellerName: string;
}

// ============================
// Store Types
// ============================
export interface StoreResponse {
    storeId: number;
    SellerName: string;
    storeName: string;
}

export interface UpsertStoreRequest {
    storeName: string;
}

export interface UpdateStoreRequest {
    storeName: string;
}

// ============================
// Pay / Deposit Types
// ============================
export type AccountHistoryType = 'CHARGE' | 'USE' | 'REFUND';

export interface AccountBalanceResponse {
    balance: number;
}

export interface AccountHistoryResponse {
    id: number;
    type: AccountHistoryType;
    amount: number;
    createdAt: string;
    description?: string;
}

export interface PaymentResponse {
    paymentId: number;
    orderId: number;
    amount: number;
    status: string;
    createdAt: string;
}

export interface PaymentConfirmRequest {
    paymentKey: string;
    orderId: string;
    amount: number;
}

