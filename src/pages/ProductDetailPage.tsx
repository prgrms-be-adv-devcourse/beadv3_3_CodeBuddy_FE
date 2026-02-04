import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ShoppingCart, Store, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { productService } from '@/services/productService';
import { cartService } from '@/services/cartService';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import type { ProductResponse } from '@/types';

// Mock detail for when backend is not available
const getMockProduct = (id: number): ProductResponse => ({
    productId: id,
    productName: 'Elegant Summer Dress',
    productPrice: 89000,
    productStock: 25,
    category: 'TOP',
    storeName: 'Style Hub',
});

export function ProductDetailPage() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const { addItem, setIsOpen } = useCartStore();

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', productId],
        queryFn: async () => {
            try {
                return await productService.getProduct(Number(productId));
            } catch {
                // fallback to mock data when API fails
                return getMockProduct(Number(productId));
            }
        },
        placeholderData: getMockProduct(Number(productId)),
        enabled: !!productId,
        retry: 0,
    });

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
        }).format(price);
    };

    const getCategoryLabel = (category: string) => {
        switch (category) {
            case 'TOP':
                return 'Tops';
            case 'PANTS':
                return 'Bottoms';
            default:
                return category;
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;

        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        try {
            const cartItemId = await cartService.addToCart({
                productId: product.productId,
                cartCount: 1,
            });

            addItem({
                cartItemId,
                productId: product.productId,
                productName: product.productName,
                cartCount: 1,
                cartPrice: product.productPrice,
                imageUrl: product.imageUrl,
            });

            toast.success(`${product.productName} added to cart`);
            setIsOpen(true);
        } catch (error) {
            addItem({
                cartItemId: Date.now(),
                productId: product.productId,
                productName: product.productName,
                cartCount: 1,
                cartPrice: product.productPrice,
                imageUrl: product.imageUrl,
            });
            toast.success(`${product.productName} added to cart`);
            setIsOpen(true);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-6 w-20 mb-8" />
                <div className="grid md:grid-cols-2 gap-12">
                    <Skeleton className="aspect-square rounded-2xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-10 w-1/3" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
                <p className="text-muted-foreground mb-6">
                    The product you're looking for doesn't exist or has been removed.
                </p>
                <Button asChild>
                    <Link to="/products">Back to Products</Link>
                </Button>
            </div>
        );
    }

    const imageUrl = product.imageUrl ||
        `https://picsum.photos/seed/${product.productId}/800/800`;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Back Link */}
            <Link
                to="/products"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
            </Link>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                    <img
                        src={imageUrl}
                        alt={product.productName}
                        className="w-full h-full object-cover"
                    />
                    {product.productStock < 5 && product.productStock > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute top-4 left-4"
                        >
                            Only {product.productStock} left
                        </Badge>
                    )}
                    {product.productStock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="secondary" className="text-xl px-6 py-3">
                                Out of Stock
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <Badge variant="outline" className="mb-3">
                            {getCategoryLabel(product.category)}
                        </Badge>
                        <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
                        <p className="text-3xl font-bold text-primary">
                            {formatPrice(product.productPrice)}
                        </p>
                    </div>

                    <Separator />

                    {/* Seller Info */}
                    <div className="p-4 bg-muted rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <Store className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Sold by</p>
                                <p className="font-semibold">{product.storeName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                            {product.productStock > 0
                                ? `${product.productStock} items in stock`
                                : 'Currently out of stock'}
                        </span>
                    </div>

                    {/* Description Placeholder */}
                    <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-muted-foreground">
                            Premium quality clothing made with the finest materials.
                            Perfect for any occasion, this piece combines style and comfort
                            for the modern wardrobe. Easy to care for and designed to last.
                        </p>
                    </div>

                    <Separator />

                    {/* Add to Cart */}
                    <Button
                        size="lg"
                        className="w-full text-lg h-14"
                        onClick={handleAddToCart}
                        disabled={product.productStock === 0}
                    >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {product.productStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
