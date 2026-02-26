import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ProductResponse, ProductSearchResponse } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { cartService } from '@/services/cartService';

interface ProductCardProps {
    product: ProductResponse | ProductSearchResponse;
}

export function ProductCard({ product }: ProductCardProps) {
    const { isAuthenticated } = useAuthStore();
    const { addItem, setIsOpen } = useCartStore();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
        }).format(price);
    };

    const getCategoryLabel = (cat?: string) => {
        if (!cat) return '';
        // 백엔드에서 TOP, PANTS 코드로 올 수도 있고, 상의, 바지 이름으로 올 수도 있음
        switch (cat.toUpperCase()) {
            case 'TOP':
            case '상의':
                return '상의';
            case 'PANTS':
            case '바지':
                return '바지';
            default:
                return cat;
        }
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error('장바구니에 담으려면 로그인해주세요');
            return;
        }

        try {
            const cartItemId = await cartService.addToCart({
                productId: product.productId,
                productCount: 1,
            });

            addItem({
                cartItemId,
                productId: product.productId,
                productName: product.productName,
                cartCount: 1,
                cartPrice: product.productPrice,
                imageUrl: product.imageUrl,
            });

            toast.success(`${product.productName} 장바구니에 담았습니다`);
            setIsOpen(true);
        } catch {
            toast.error('장바구니 추가에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 랜덤 이미지 (실제 이미지 URL이 없을 때 사용)
    const imageUrl = product.imageUrl ||
        `https://picsum.photos/seed/${product.productId}/400/500`;

    return (
        <Link to={`/products/${product.productId}`}>
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md">
                {/* Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img
                        src={imageUrl}
                        alt={product.productName}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />

                    {/* Stock Badge */}
                    {'productStock' in product && product.productStock < 5 && product.productStock > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute top-3 left-3"
                        >
                            {product.productStock}개 남음
                        </Badge>
                    )}
                    {'productStock' in product && product.productStock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="secondary" className="text-lg px-4 py-2">
                                품절
                            </Badge>
                        </div>
                    )}

                    {/* Quick Add Button (appears on hover) */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={handleAddToCart}
                            disabled={'productStock' in product && product.productStock === 0}
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            장바구니 담기
                        </Button>
                    </div>
                </div>

                {/* Product Info */}
                <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">
                        {getCategoryLabel(
                            'categoryName' in product ? product.categoryName :
                                'subCategory' in product ? product.subCategory :
                                    'categoryCode' in product ? product.categoryCode :
                                        'topCategory' in product ? product.topCategory : ''
                        )}
                    </Badge>
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {product.productName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {product.storeName}
                    </p>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {formatPrice(product.productPrice)}
                    </span>
                </CardFooter>
            </Card>
        </Link>
    );
}
