import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cartService } from '@/services/cartService';
import { useCartStore } from '@/stores/cartStore';
import type { RecommendProductInfoResponse, CartCreateRequest } from '@/types';
import { toast } from 'sonner';

export function CartRecommendations() {
    const navigate = useNavigate();
    const { addItem, setIsOpen, lastAddedCount, items } = useCartStore();
    const [recommended, setRecommended] = useState<RecommendProductInfoResponse[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    // 장바구니에 상품이 있을 때 && 새로 상품이 추가될 때만 추천 호출
    useEffect(() => {
        if (lastAddedCount === 0 || items.length === 0) return;
        cartService.getRecommendedProducts()
            .then((data) => {
                if (data && data.length > 0) {
                    setRecommended(data);
                    setIsVisible(true);
                }
            })
            .catch(() => setRecommended([]));
    }, [lastAddedCount]);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);

    const handleAddToCart = async (product: RecommendProductInfoResponse) => {
        const request: CartCreateRequest = { productId: product.productId, cartCount: 1 };
        try {
            const cartItemId = await cartService.addToCart(request);
            addItem({
                cartItemId,
                productId: product.productId,
                productName: product.productName,
                cartCount: 1,
                cartPrice: product.productPrice,
                imageUrl: product.imageUrl,
            });
            toast.success('장바구니에 추가되었습니다');
        } catch {
            toast.error('장바구니 추가에 실패했습니다');
        }
    };

    const handleGoToProduct = (productId: number) => {
        setIsOpen(false);
        navigate(`/products/${productId}`);
    };

    if (!isVisible || recommended.length === 0) return null;

    return (
        <div className="mt-3 border-t pt-3">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-2 px-1">
                <div>
                    <p className="text-sm font-semibold">이 상품 어때세요? 👀</p>
                    <p className="text-xs text-muted-foreground">함께 구매하면 좋아요</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full flex-shrink-0"
                    onClick={() => setIsVisible(false)}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* 추천 상품 가로 스크롤 */}
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {recommended.map((product) => {
                    const imageUrl =
                        product.imageUrl ||
                        `https://picsum.photos/seed/${product.productId}/120/120`;
                    return (
                        <div
                            key={product.productId}
                            className="flex-shrink-0 w-28 rounded-xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-all"
                        >
                            <button className="block w-full" onClick={() => handleGoToProduct(product.productId)}>
                                <img
                                    src={imageUrl}
                                    alt={product.productName}
                                    className="w-full h-28 object-cover"
                                />
                            </button>
                            <div className="p-2">
                                <p
                                    className="text-xs font-medium truncate cursor-pointer hover:underline"
                                    onClick={() => handleGoToProduct(product.productId)}
                                >
                                    {product.productName}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {formatPrice(product.productPrice)}
                                </p>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-full mt-1 text-xs"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                    담기
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
