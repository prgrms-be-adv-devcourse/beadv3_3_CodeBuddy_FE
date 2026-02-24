import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Home, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { orderService } from '@/services/orderService';

export function OrderSuccessPage() {
    const { orderId } = useParams<{ orderId: string }>();

    const { data: order, isLoading, error } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => orderService.getOrderDetail(Number(orderId)),
        enabled: !!orderId,
    });

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">주문 정보를 불러오는 중입니다...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-semibold mb-4">주문 정보를 찾을 수 없습니다</h2>
                <Button asChild>
                    <Link to="/">홈으로 돌아가기</Link>
                </Button>
            </div>
        );
    }

    const isSuccess = ['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(order.orderStatus);

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            {/* Status Message Banner (Center) */}
            <div className="flex flex-col items-center justify-center text-center mb-12 animate-in fade-in zoom-in duration-500">
                <div className={`${!isSuccess ? 'bg-red-100' : 'bg-green-100'} p-4 rounded-full mb-6`}>
                    {!isSuccess ? (
                        <XCircle className="h-16 w-16 text-red-600" />
                    ) : (
                        <CheckCircle2 className="h-16 w-16 text-green-600" />
                    )}
                </div>
                <h1 className={`text-4xl font-extrabold mb-4 tracking-tight ${!isSuccess ? 'text-red-600' : ''}`}>
                    {!isSuccess ? '주문에 실패했습니다' : '주문이 완료되었습니다!'}
                </h1>
                <p className="text-xl text-muted-foreground">
                    {!isSuccess
                        ? '결제 중 오류가 발생하여 주문이 처리되지 않았습니다.\n잔액 또는 결제 수단을 확인해 주세요.'
                        : 'ClosetBuddy를 이용해 주셔서 감사합니다.\n주문하신 상품이 곧 배송될 예정입니다.'}
                </p>
            </div>

            {/* Order Details Card */}
            <Card className="shadow-lg border-2 mb-8">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>주문 상세 정보</span>
                        <span className="text-sm font-normal text-muted-foreground">주문번호: #{order.orderId}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="space-y-4">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-lg">{item.productName}</p>
                                    <p className="text-sm text-muted-foreground">{item.storeName} | {item.orderCount}개</p>
                                </div>
                                <p className="font-semibold">{formatPrice(item.orderPrice)}</p>
                            </div>
                        ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">주문 일시</span>
                            <span>{new Date(order.createdAt).toLocaleString('ko-KR')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">배송 상태</span>
                            <span className={`font-medium ${!isSuccess ? 'text-destructive' : 'text-primary'}`}>
                                {order.orderStatus === 'PENDING' ? '결제 대기' :
                                    order.orderStatus === 'CONFIRMED' ? '주문 확인' :
                                        order.orderStatus === 'SHIPPED' ? '배송 중' :
                                            order.orderStatus === 'DELIVERED' ? '배송 완료' : '주문 실패(취소)'}
                            </span>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xl font-bold">최종 결제 금액</span>
                        <span className="text-2xl font-black text-primary">{formatPrice(order.orderAmount)}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="default" size="lg" className="flex-1 h-14 text-lg">
                    <Link to="/">
                        <Home className="mr-2 h-5 w-5" />
                        홈 화면으로 돌아가기
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1 h-14 text-lg">
                    <Link to="/products">
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        계속 쇼핑하기
                    </Link>
                </Button>
            </div>
        </div>
    );
}
