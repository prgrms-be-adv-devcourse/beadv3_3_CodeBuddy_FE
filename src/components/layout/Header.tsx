import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { cn } from '@/lib/utils';

const navLinks = [
    { name: '전체 상품', path: '/products' },
    { name: '상의', path: '/products?category=TOP' },
    { name: '바지', path: '/products?category=PANTS' },
    { name: '게시판', path: '/board' },
];

export function Header() {
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuthStore();
    const { items, toggleCart } = useCartStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const cartItemCount = items.reduce((sum, item) => sum + item.cartCount, 0);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2 text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
                    >
                        <span>ClosetBuddy</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-foreground/80",
                                    location.pathname + location.search === link.path
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Cart Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                            onClick={toggleCart}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cartItemCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                                >
                                    {cartItemCount > 99 ? '99+' : cartItemCount}
                                </Badge>
                            )}
                            <span className="sr-only">Cart</span>
                        </Button>

                        {/* Auth Buttons */}
                        {isAuthenticated ? (
                            <div className="hidden md:flex items-center space-x-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/account">
                                        <User className="h-4 w-4 mr-2" />
                                        계정
                                    </Link>
                                </Button>
                                <Button variant="outline" size="sm" onClick={logout}>
                                    로그아웃
                                </Button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center space-x-2">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/login">로그인</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link to="/signup">회원가입</Link>
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon">
                                    {mobileMenuOpen ? (
                                        <X className="h-5 w-5" />
                                    ) : (
                                        <Menu className="h-5 w-5" />
                                    )}
                                    <span className="sr-only">Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <nav className="flex flex-col space-y-4 mt-8">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                "text-lg font-medium transition-colors px-4 py-2 rounded-lg hover:bg-muted",
                                                location.pathname + location.search === link.path
                                                    ? "bg-muted text-foreground"
                                                    : "text-muted-foreground"
                                            )}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}

                                    <hr className="my-4" />

                                    {isAuthenticated ? (
                                        <>
                                            <Link
                                                to="/account"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="text-lg font-medium px-4 py-2 rounded-lg hover:bg-muted"
                                            >
                                                계정
                                            </Link>
                                            <Link
                                                to="/orders"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="text-lg font-medium px-4 py-2 rounded-lg hover:bg-muted"
                                            >
                                                내 주문
                                            </Link>
                                            <Button
                                                variant="outline"
                                                className="mx-4"
                                                onClick={() => {
                                                    logout();
                                                    setMobileMenuOpen(false);
                                                }}
                                            >
                                                로그아웃
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="text-lg font-medium px-4 py-2 rounded-lg hover:bg-muted"
                                            >
                                                로그인
                                            </Link>
                                            <Link
                                                to="/signup"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <Button className="w-full mx-4">회원가입</Button>
                                            </Link>
                                        </>
                                    )}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
