import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { productService } from '@/services/productService';
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
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Click outside to close suggestions
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch suggestions with debounce
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const results = await productService.getSuggestions(searchQuery);
                setSuggestions(results);
            } catch (error) {
                console.error('Failed to fetch suggestions', error);
            }
        };

        const timer = setTimeout(() => {
            fetchSuggestions();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1" ref={wrapperRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="상품 검색..."
                    value={searchQuery}
                    onChange={(e) => {
                        onSearchChange(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="pl-10"
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                                onClick={() => {
                                    onSearchChange(suggestion);
                                    setShowSuggestions(false);
                                }}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
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
