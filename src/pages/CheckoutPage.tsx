import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Package, Wallet, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/stores/cartStore';
import { orderService } from '@/services/orderService';
import { payService } from '@/services/payService';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

export function CheckoutPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { items, totalPrice, clearCart } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);

    // 바로 구매(단건 주문)인지 장바구니(다건 주문)인지 확인
    // location.state가 없을 경우 sessionStorage에서 복구 (예치금 충전 후 리다이렉트 등)
    const stateBuyNowItem = location.state?.buyNowItem;
    const [buyNowItem] = useState(() => {
        if (stateBuyNowItem) {
            sessionStorage.setItem('buyNowItem', JSON.stringify(stateBuyNowItem));
            return stateBuyNowItem;
        }
        const saved = sessionStorage.getItem('buyNowItem');
        return saved ? JSON.parse(saved) : null;
    });
    const checkoutItems = buyNowItem ? [buyNowItem] : items;
    const checkoutTotalPrice = buyNowItem ? buyNowItem.cartPrice * buyNowItem.cartCount : totalPrice();

    const { data: balanceData } = useQuery({
        queryKey: ['account-balance'],
        queryFn: payService.getBalance,
    });

    const balance = balanceData?.balance ?? 0;
    const hasEnoughBalance = balance >= checkoutTotalPrice;

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);

    // 주문할 상품이 없으면 홈으로
    if (checkoutItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">주문할 상품이 없습니다</h2>
                <p className="text-muted-foreground mb-6">구매를 계속하시려면 상품을 선택해주세요.</p>
                <Button onClick={() => navigate('/products')}>상품 둘러보기</Button>
            </div>
        );
    }

    const handleOrder = async () => {
        if (!hasEnoughBalance) {
            toast.error('예치금이 부족합니다. 충전 후 다시 시도해주세요.');
            return;
        }
        setIsLoading(true);
        try {
            let orderId: number;

            if (buyNowItem) {
                // 바로 구매: POST /api/v1/orders (orderItems 배열로 요청)
                orderId = await orderService.createOrder({
                    orderItems: [{
                        productId: buyNowItem.productId,
                        orderCount: buyNowItem.cartCount,
                    }],
                });
            } else {
                // 장바구니 주문: 각 cartItem마다 POST /api/v1/orders/cart/{cartItemId}
                let lastOrderId = 0;
                for (const item of checkoutItems) {
                    lastOrderId = await orderService.createOrderFromCart(item.cartItemId);
                }
                orderId = lastOrderId;
                clearCart();
            }

            // 주문 완료 후 sessionStorage 정리
            sessionStorage.removeItem('buyNowItem');
            toast.success('주문이 완료되었습니다!');
            navigate(`/orders/${orderId}`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || '주문 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* 헤더 */}
                <div className="flex items-center gap-3 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">주문 확인</h1>
                </div>

                {/* 주문 상품 목록 */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Package className="h-4 w-4" />
                            주문 상품 ({checkoutItems.length}개)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {checkoutItems.map((item) => (
                            <div key={item.cartItemId} className="flex items-center gap-4">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        className="w-16 h-16 object-cover rounded-lg border"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{item.productName}</p>
                                    <p className="text-sm text-muted-foreground">수량: {item.cartCount}개</p>
                                </div>
                                <p className="font-semibold whitespace-nowrap">{formatPrice(item.cartPrice)}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 결제 금액 요약 */}
                <Card className="mb-6">
                    <CardContent className="pt-6 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">상품 금액</span>
                            <span>{formatPrice(checkoutTotalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">배송비</span>
                            <span className="text-green-600">무료</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>총 결제 금액</span>
                            <span>{formatPrice(checkoutTotalPrice)}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* 예치금 잔액 */}
                <Card className={`mb-6 ${hasEnoughBalance ? 'border-primary/30 bg-primary/5' : 'border-destructive/30 bg-destructive/5'}`}>
                    <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Wallet className={`h-4 w-4 ${hasEnoughBalance ? 'text-primary' : 'text-destructive'}`} />
                                <span className="text-sm font-medium">예치금 잔액</span>
                            </div>
                            <span className={`font-bold ${hasEnoughBalance ? 'text-primary' : 'text-destructive'}`}>
                                {formatPrice(balance)}
                            </span>
                        </div>
                        {hasEnoughBalance ? (
                            <p className="text-xs text-muted-foreground mt-1 pl-6">
                                결제 후 잔액: {formatPrice(balance - checkoutTotalPrice)}
                            </p>
                        ) : (
                            <div className="mt-2 pl-6 flex items-center justify-between">
                                <p className="text-xs text-destructive flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {formatPrice(checkoutTotalPrice - balance)} 부족합니다
                                </p>
                                <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                                    <Link to="/deposit?returnUrl=/checkout">충전하기</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 주문하기 버튼 */}
                <Button
                    className="w-full"
                    size="lg"
                    onClick={handleOrder}
                    disabled={isLoading || !hasEnoughBalance}
                >
                    {isLoading ? '주문 처리 중...' : hasEnoughBalance
                        ? `예치금으로 ${formatPrice(checkoutTotalPrice)} 결제하기`
                        : '예치금이 부족합니다'}
                </Button>
            </div>
        </div>
    );
}

export default CheckoutPage;
