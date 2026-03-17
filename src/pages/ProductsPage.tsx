import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { ProductGrid, ProductFilters } from '@/components/products';
import { productService } from '@/services/productService';
import type { Category, ProductSearchResponse } from '@/types';

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
    const pageParam = parseInt(searchParams.get('page') || '0', 10);
    const sizeParam = parseInt(searchParams.get('size') || '20', 10);

    // 상품 데이터 페칭
    // - 검색어 없음 + 카테고리 ALL → getAllProducts (DB 전체 조회)
    // - 검색어 없음 + 카테고리 선택 → searchByCategory (ES 카테고리 필터)
    // - 검색어 있음 → searchProducts (ES 키워드 검색)
    const { data: pageData, isLoading } = useQuery({
        queryKey: ['products', selectedCategory, debouncedSearchQuery, pageParam, sizeParam],
        queryFn: async () => {
            const hasKeyword = debouncedSearchQuery.trim().length > 0;

            if (!hasKeyword && selectedCategory === 'ALL') {
                // 기본 전체 조회: DB에서 가져옴 (ES가 아닌 getAllProducts)
                const allProducts = await productService.getAllProducts();
                // Page<ProductSearchResponse> 형태에 맞추기 위해 변환
                return {
                    content: allProducts.map(p => ({
                        productId: p.productId,
                        productName: p.productName,
                        productPrice: p.productPrice,
                        productStock: p.productStock,
                        topCategory: p.parentCategoryCode,
                        subCategory: p.categoryName,
                        storeName: p.storeName,
                        imageUrl: p.imageUrl,
                    })),
                    totalElements: allProducts.length,
                    totalPages: 1,
                    number: 0,
                    size: allProducts.length,
                } as any;
            }

            if (!hasKeyword && selectedCategory !== 'ALL') {
                // 카테고리만 선택, 키워드 없음 → 카테고리 전용 API
                return productService.searchByCategory(selectedCategory, undefined, pageParam, sizeParam);
            }

            if (selectedCategory !== 'ALL') {
                // 카테고리 + 키워드 검색
                return productService.searchByCategory(selectedCategory, debouncedSearchQuery, pageParam, sizeParam);
            }

            // ALL + 키워드 → ES 키워드 검색
            return productService.searchProducts(debouncedSearchQuery, pageParam, sizeParam);
        },
        retry: 1,
    });

    // 필터링된 상품 (백엔드에서 받아온 content를 그대로 사용)
    const filteredProducts: ProductSearchResponse[] = pageData?.content || [];

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
