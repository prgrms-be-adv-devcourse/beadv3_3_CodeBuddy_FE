import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MemberResponse } from '@/types';

interface AuthState {
    isAuthenticated: boolean;
    user: MemberResponse | null;
    accessToken: string | null;
    refreshToken: string | null;

    // Actions
    setAuth: (user: MemberResponse, token: string) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
    updateUser: (user: MemberResponse) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            refreshToken: null,

            setAuth: (user, token) => {
                localStorage.setItem('accessToken', token);
                localStorage.setItem('userId', String(user.id));
                localStorage.setItem('userRole', user.role);
                set({ isAuthenticated: true, user, accessToken: token });
            },

            setTokens: (accessToken, refreshToken) => {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                set({ accessToken, refreshToken });
            },

            logout: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('userId');
                localStorage.removeItem('userRole');
                set({ isAuthenticated: false, user: null, accessToken: null, refreshToken: null });
            },

            updateUser: (user) => set({ user }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        }
    )
);

