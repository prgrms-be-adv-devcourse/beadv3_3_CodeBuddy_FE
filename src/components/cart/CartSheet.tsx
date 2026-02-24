import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CartItem } from './CartItem';
import { CartRecommendations } from './CartRecommendations';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

export function CartSheet() {
    const navigate = useNavigate();
    const { items, isOpen, setIsOpen, totalItems, totalPrice, clearCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
        }).format(price);
    };

    const handleCheckout = () => {
        setIsOpen(false);
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    const handleViewProducts = () => {
        setIsOpen(false);
        navigate('/products');
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent className="w-full sm:max-w-md flex flex-col px-3">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        장바구니
                        {totalItems() > 0 && (
                            <span className="text-sm text-muted-foreground">
                                ({totalItems()}개)
                            </span>
                        )}
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">장바구니가 비어 있습니다</h3>
                        <p className="text-muted-foreground mb-6">
                            아직 추가된 상품이 없습니다.
                        </p>
                        <Button onClick={handleViewProducts}>
                            상품 둘러보기
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 -mx-6 px-6">
                            <div className="space-y-2">
                                {items.map((item) => (
                                    <CartItem key={item.cartItemId} item={item} />
                                ))}
                            </div>
                        </ScrollArea>

                        <CartRecommendations />

                        <div className="mt-auto pt-4">
                            <Separator className="mb-4" />

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">소계</span>
                                    <span>{formatPrice(totalPrice())}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">배송비</span>
                                    <span className="text-green-600">무료</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>합계</span>
                                    <span>{formatPrice(totalPrice())}</span>
                                </div>
                            </div>

                            <SheetFooter className="mt-6 flex-col gap-2 sm:flex-col">
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={handleCheckout}
                                >
                                    결제하기
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        clearCart();
                                    }}
                                >
                                    장바구니 비우기
                                </Button>
                            </SheetFooter>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
