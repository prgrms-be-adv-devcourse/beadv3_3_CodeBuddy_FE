import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cartService } from '@/services/cartService';
import { useCartStore } from '@/stores/cartStore';
import type { RecommendProductInfoResponse, CartCreateRequest } from '@/types';
import { toast } from 'sonner';

export function CartRecommendations() {
    const navigate = useNavigate();
    const { addItem, setIsOpen, isOpen, items } = useCartStore();
    const [recommended, setRecommended] = useState<RecommendProductInfoResponse[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasRequested, setHasRequested] = useState(false);
    const abortRef = useRef(false);

    // 장바구니가 닫히면 상태만 초기화 (자동 요청 X)
    useEffect(() => {
        if (!isOpen) {
            setIsVisible(false);
            setHasRequested(false);
            setRecommended([]);
            abortRef.current = true;
        }
    }, [isOpen]);

    const handleRequestRecommendation = () => {
        if (items.length === 0) return;

        setHasRequested(true);
        setIsLoading(true);
        abortRef.current = false;

        // 장바구니 아이템 정보로 비동기 추천 요청
        const cartItemsForRecommend = items.map(item => ({
            imageUrl: item.imageUrl || '',
            category: '', // 카테고리 정보가 CartItem에 없으므로 빈 문자열
        }));

        cartService.getRecommendedProducts(cartItemsForRecommend)
            .then((data) => {
                if (abortRef.current) return;
                if (data && data.length > 0) {
                    setRecommended(data);
                    setIsVisible(true);
                } else {
                    setRecommended([]);
                    setIsVisible(false);
                }
            })
            .catch(() => {
                if (abortRef.current) return;
                setRecommended([]);
                setIsVisible(false);
            })
            .finally(() => {
                if (!abortRef.current) setIsLoading(false);
            });
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);

    const handleAddToCart = async (product: RecommendProductInfoResponse) => {
        const request: CartCreateRequest = { productId: product.productId, productCount: 1 };
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

    // 로딩 중 UI
    if (isLoading && items.length > 0) {
        return (
            <div className="mt-3 border-t pt-3 px-6">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    <p className="text-sm font-semibold">AI 추천 상품을 찾고 있어요...</p>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex-shrink-0 w-28 rounded-xl border bg-muted/50 overflow-hidden animate-pulse">
                            <div className="w-full h-28 bg-muted" />
                            <div className="p-2 space-y-1.5">
                                <div className="h-3 bg-muted rounded w-3/4" />
                                <div className="h-3 bg-muted rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (items.length > 0 && !hasRequested && !isVisible) {
        return (
            <div className="mt-3 border-t pt-3 px-6 pb-2">
                <Button
                    variant="outline"
                    className="w-full border-dashed"
                    onClick={handleRequestRecommendation}
                >
                    <Sparkles className="h-4 w-4 mr-2 text-primary" />
                    AI에게 장바구니 맞춤 상품 추천받기
                </Button>
            </div>
        );
    }

    if (!isVisible || recommended.length === 0) return null;

    return (
        <div className="mt-3 border-t pt-3 px-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <div>
                        <p className="text-sm font-semibold">AI가 추천하는 상품 👀</p>
                        <p className="text-xs text-muted-foreground">장바구니 상품과 함께 구매하면 좋아요</p>
                    </div>
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
                                    {product.productName || `추천 상품 #${product.productId}`}
                                </p>
                                {product.productPrice > 0 && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {formatPrice(product.productPrice)}
                                    </p>
                                )}
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
