import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

                <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
                            나만의 옷장{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                ClosetBuddy
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
                            숨겨진 취향까지 찾아드릴게요
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                            <Button size="lg" asChild className="text-lg h-14 px-8">
                                <Link to="/products">
                                    쇼핑하기
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="text-lg h-14 px-8 bg-white/10 border-white/30 hover:bg-white/20">
                                <Link to="/products?category=TOP">
                                    상의 보기
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background shadow-lg hover-lift">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Sparkles className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">프리미엄 품질</h3>
                            <p className="text-muted-foreground">
                                최고급 소재로 제작된 엄선된 아이템으로 오래도록 스타일을 유지하세요.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background shadow-lg hover-lift">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <Truck className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">무료 배송</h3>
                            <p className="text-muted-foreground">
                                ₩50,000 이상 주문 시 무료 배송을 즐기세요.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background shadow-lg hover-lift">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">간편 반품</h3>
                            <p className="text-muted-foreground">
                                만족하지 않으셨다면 30일 이내 전액 환불이 가능합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">카테고리별 쇼핑</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            정성스럽게 구성된 컬렉션에서 원하는 아이템을 찾아보세요
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Tops Category */}
                        <Link
                            to="/products?category=TOP"
                            className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800"
                                alt="상의 컬렉션"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8">
                                <h3 className="text-3xl font-bold text-white mb-2">상의</h3>
                                <p className="text-white/80 mb-4">티셔츠, 블라우스 등</p>
                                <span className="inline-flex items-center text-white font-medium">
                                    보러가기 <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                </span>
                            </div>
                        </Link>

                        {/* Bottoms Category */}
                        <Link
                            to="/products?category=PANTS"
                            className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"
                                alt="하의 컬렉션"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8">
                                <h3 className="text-3xl font-bold text-white mb-2">바지</h3>
                                <p className="text-white/80 mb-4">청바지, 슬랙스, 반바지</p>
                                <span className="inline-flex items-center text-white font-medium">
                                    보러가기 <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        옷장을 업그레이드할 준비 되셨나요?
                    </h2>
                    <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                        수천 명의 만족한 고객들과 함께 나만의 스타일을 완성해 보세요.
                    </p>
                    <Button size="lg" variant="secondary" asChild className="text-lg h-14 px-8">
                        <Link to="/products">
                            컬렉션 둘러보기
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
