import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types';

interface ProductFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedCategory: Category | 'ALL';
    onCategoryChange: (category: Category | 'ALL') => void;
}

const categories: { label: string; value: Category | 'ALL' }[] = [
    { label: '전체', value: 'ALL' },
    { label: '상의', value: 'TOP' },
    { label: '하의', value: 'PANTS' },
];

export function ProductFilters({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
}: ProductFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="상품 검색..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
                {categories.map((cat) => (
                    <Button
                        key={cat.value}
                        variant={selectedCategory === cat.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onCategoryChange(cat.value)}
                        className="min-w-[80px]"
                    >
                        {cat.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}
