import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/stores/cartStore';
import { orderService } from '@/services/orderService';
import { toast } from 'sonner';

export function CheckoutPage() {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);

    // 장바구니가 비어있으면 홈으로
    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">장바구니가 비어 있습니다</h2>
                <p className="text-muted-foreground mb-6">주문할 상품을 먼저 장바구니에 담아주세요.</p>
                <Button onClick={() => navigate('/products')}>상품 둘러보기</Button>
            </div>
        );
    }

    const handleOrder = async () => {
        setIsLoading(true);
        try {
            const orderItems = items.map(item => ({
                productId: item.productId,
                orderCount: item.cartCount,
            }));
            await orderService.createOrder({ orderItems });
            clearCart();
            toast.success('주문이 완료되었습니다!');
            navigate('/account');
        } catch (error) {
            toast.error('주문 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* 헤더 */}
                <div className="flex items-center gap-3 mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">주문 확인</h1>
                </div>

                {/* 주문 상품 목록 */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Package className="h-4 w-4" />
                            주문 상품 ({items.length}개)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.map((item) => (
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
                                    <p className="text-sm text-muted-foreground">
                                        수량: {item.cartCount}개
                                    </p>
                                </div>
                                <p className="font-semibold whitespace-nowrap">
                                    {formatPrice(item.cartPrice)}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 결제 금액 요약 */}
                <Card className="mb-6">
                    <CardContent className="pt-6 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">상품 금액</span>
                            <span>{formatPrice(totalPrice())}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">배송비</span>
                            <span className="text-green-600">무료</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>총 결제 금액</span>
                            <span>{formatPrice(totalPrice())}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* 주문하기 버튼 */}
                <Button
                    className="w-full"
                    size="lg"
                    onClick={handleOrder}
                    disabled={isLoading}
                >
                    {isLoading ? '주문 처리 중...' : `${formatPrice(totalPrice())} 주문하기`}
                </Button>
            </div>
        </div>
    );
}

export default CheckoutPage;
