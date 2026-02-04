import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartSheet } from '@/components/cart/CartSheet';
import { Toaster } from '@/components/ui/sonner';

export function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <CartSheet />
            <Toaster position="bottom-right" />
        </div>
    );
}
