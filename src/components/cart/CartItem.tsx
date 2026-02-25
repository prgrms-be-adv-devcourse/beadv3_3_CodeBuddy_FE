import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { cartService } from '@/services/cartService';
import { toast } from 'sonner';

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const { updateItemQuantity, removeItem } = useCartStore();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
        }).format(price);
    };

    const handleUpdateQuantity = async (newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            await cartService.updateCartItem(item.cartItemId, newQuantity);
            updateItemQuantity(item.cartItemId, newQuantity);
        } catch (error) {
            // 로컬에서 동작하도록 fallback
            updateItemQuantity(item.cartItemId, newQuantity);
        }
    };

    const handleRemove = async () => {
        try {
            await cartService.deleteCartItem(item.cartItemId);
            removeItem(item.cartItemId);
            toast.success('장바구니에서 삭제되었습니다');
        } catch (error) {
            // 로컬에서 동작하도록 fallback
            removeItem(item.cartItemId);
            toast.success('장바구니에서 삭제되었습니다');
        }
    };

    const imageUrl = item.imageUrl ||
        `https://picsum.photos/seed/${item.productId}/100/100`;

    return (
        <div className="flex gap-4 py-4 border-b last:border-0 animate-fade-in">
            {/* Image */}
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img
                    src={imageUrl}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{item.productName}</h4>
                <p className="text-sm text-muted-foreground">
                    {formatPrice(item.cartPrice / item.cartCount)} 개당
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.cartCount - 1)}
                        disabled={item.cartCount <= 1}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.cartCount}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(item.cartCount + 1)}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* Price & Remove */}
            <div className="flex flex-col items-end justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={handleRemove}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
                <span className="font-semibold">{formatPrice(item.cartPrice)}</span>
            </div>
        </div>
    );
}
