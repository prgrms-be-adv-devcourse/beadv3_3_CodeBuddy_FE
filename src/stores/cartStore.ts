import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    lastAddedCount: number; // 아이템 추가될 때마다 증가 → 추천 트리거

    // Computed
    totalItems: () => number;
    totalPrice: () => number;

    // Actions
    setItems: (items: CartItem[]) => void;
    addItem: (item: CartItem) => void;
    updateItemQuantity: (cartItemId: number, quantity: number) => void;
    removeItem: (cartItemId: number) => void;
    clearCart: () => void;
    setIsOpen: (isOpen: boolean) => void;
    toggleCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            lastAddedCount: 0,

            totalItems: () => {
                return get().items.reduce((sum, item) => sum + item.cartCount, 0);
            },

            totalPrice: () => {
                return get().items.reduce((sum, item) => sum + item.cartPrice, 0);
            },

            setItems: (items) => set({ items }),

            addItem: (item) => {
                const currentItems = get().items;
                const existingIndex = currentItems.findIndex(i => i.productId === item.productId);

                if (existingIndex >= 0) {
                    const updatedItems = [...currentItems];
                    updatedItems[existingIndex] = {
                        ...updatedItems[existingIndex],
                        cartCount: updatedItems[existingIndex].cartCount + item.cartCount,
                        cartPrice: updatedItems[existingIndex].cartPrice + item.cartPrice,
                    };
                    set({ items: updatedItems });
                } else {
                    set({ items: [...currentItems, item], lastAddedCount: get().lastAddedCount + 1 });
                }
            },

            updateItemQuantity: (cartItemId, quantity) => {
                const updatedItems = get().items.map(item => {
                    if (item.cartItemId === cartItemId) {
                        const unitPrice = item.cartPrice / item.cartCount;
                        return { ...item, cartCount: quantity, cartPrice: unitPrice * quantity };
                    }
                    return item;
                });
                set({ items: updatedItems });
            },

            removeItem: (cartItemId) => {
                const updatedItems = get().items.filter(item => item.cartItemId !== cartItemId);
                set({ items: updatedItems });
            },

            clearCart: () => set({ items: [] }),

            setIsOpen: (isOpen) => set({ isOpen }),

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ items: state.items }),
        }
    )
);
