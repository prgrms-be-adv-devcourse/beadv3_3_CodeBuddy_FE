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

    // 상품 데이터 페칭 (Elasticsearch 연동 백엔드 API + 초기 로드 대응)
    const { data: pageData, isLoading } = useQuery({
        queryKey: ['products', selectedCategory, debouncedSearchQuery, pageParam, sizeParam],
        queryFn: async () => {
            if (selectedCategory === 'ALL') {
                return productService.searchProducts(debouncedSearchQuery, pageParam, sizeParam);
            } else {
                // 백엔드 ES 검색 엔진이 topCategory(TOP/PANTS)를 파싱할 수 있게 카테고리명 자체를 검색어에 합쳐서 전송합니다.
                const combinedQuery = `${selectedCategory} ${debouncedSearchQuery}`.trim();
                return productService.searchProducts(combinedQuery, pageParam, sizeParam);
            }
        },
        retry: 1,
    });

    // 필터링된 상품 (이제 백엔드에서 받아온 content를 그대로 사용)
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
