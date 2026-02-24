import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ProductGrid, ProductFilters } from '@/components/products';
import { productService } from '@/services/productService';
import type { Category, ProductResponse } from '@/types';

// 목업 데이터 (백엔드가 없을 때 사용)
const mockProducts: ProductResponse[] = [
    {
        productId: 1,
        productName: 'Classic White T-Shirt',
        productPrice: 29000,
        productStock: 50,
        category: 'TOP',
        storeName: 'Style Hub',
    },
    {
        productId: 2,
        productName: 'Elegant Summer Dress',
        productPrice: 89000,
        productStock: 25,
        category: 'TOP',
        storeName: 'Style Hub',
    },
    {
        productId: 3,
        productName: 'Slim Fit Jeans',
        productPrice: 59000,
        productStock: 30,
        category: 'PANTS',
        storeName: 'Denim Co',
    },
    {
        productId: 4,
        productName: 'Cotton Hoodie',
        productPrice: 79000,
        productStock: 15,
        category: 'TOP',
        storeName: 'Comfort Wear',
    },
    {
        productId: 5,
        productName: 'Chino Pants',
        productPrice: 49000,
        productStock: 40,
        category: 'PANTS',
        storeName: 'Classic Style',
    },
    {
        productId: 6,
        productName: 'Striped Polo Shirt',
        productPrice: 45000,
        productStock: 20,
        category: 'TOP',
        storeName: 'Style Hub',
    },
    {
        productId: 7,
        productName: 'Cargo Pants',
        productPrice: 69000,
        productStock: 3,
        category: 'PANTS',
        storeName: 'Urban Outfitters',
    },
    {
        productId: 8,
        productName: 'Linen Blouse',
        productPrice: 55000,
        productStock: 0,
        category: 'TOP',
        storeName: 'Elegant Fashion',
    },
];

export function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    // Debounce search query
    useMemo(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const categoryParam = searchParams.get('category') as Category | null;
    const selectedCategory: Category | 'ALL' = categoryParam || 'ALL';

    // 상품 데이터 페칭
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: productService.getAllProducts,
        // 백엔드가 없을 때 mock 데이터 사용
        placeholderData: mockProducts,
        retry: 1,
    });

    // 필터링된 상품
    const filteredProducts = useMemo(() => {
        let result = products.length > 0 ? products : mockProducts;

        // 카테고리 필터
        if (selectedCategory !== 'ALL') {
            result = result.filter((p) => p.category === selectedCategory);
        }

        // 검색 필터
        if (debouncedSearchQuery) {
            const query = debouncedSearchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.productName.toLowerCase().includes(query) ||
                    p.storeName.toLowerCase().includes(query)
            );
        }

        return result;
    }, [products, selectedCategory, debouncedSearchQuery]);

    const handleCategoryChange = (category: Category | 'ALL') => {
        if (category === 'ALL') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    {selectedCategory === 'ALL'
                        ? '전체 상품'
                        : selectedCategory === 'TOP'
                            ? '상의'
                            : '하의'}
                </h1>
                <p className="text-muted-foreground">
                    스타일리시한 의류 컬렉션을 둘러보세요
                </p>
            </div>

            {/* Filters */}
            <ProductFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
            />

            {/* Product Grid */}
            <ProductGrid products={filteredProducts} isLoading={isLoading} />
        </div>
    );
}
