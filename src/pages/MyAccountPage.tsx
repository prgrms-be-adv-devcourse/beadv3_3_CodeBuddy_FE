import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { sellerService } from '@/services/sellerService';
import { storeService } from '@/services/storeService';
import { productService } from '@/services/productService';
import { payService } from '@/services/payService';
import type { UpdateProductRequest } from '@/types';
import { User, Store, ShoppingBag, Wallet, Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

// ─────────────────────────────────────────────
// Product Edit Mini-Form (inline)
// ─────────────────────────────────────────────
function ProductEditRow({
    product,
    onSaved,
    onDeleted,
}: {
    product: { productId: number; productName: string; productPrice: number; productStock: number; category: string; imageUrl?: string };
    onSaved: () => void;
    onDeleted: () => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState<UpdateProductRequest>({
        productName: product.productName,
        productPrice: product.productPrice,
        productStock: product.productStock,
        category: product.category as any,
        imgUrl: product.imageUrl,
    });

    const updateMutation = useMutation({
        mutationFn: () => productService.updateProduct(product.productId, form),
        onSuccess: () => {
            toast.success('상품이 수정되었습니다.');
            setIsEditing(false);
            onSaved();
        },
        onError: () => toast.error('상품 수정 실패'),
    });

    const deleteMutation = useMutation({
        mutationFn: () => productService.deleteProduct(product.productId),
        onSuccess: () => {
            toast.success('상품이 삭제되었습니다.');
            onDeleted();
        },
        onError: () => toast.error('상품 삭제 실패'),
    });

    return (
        <div className="border rounded-lg overflow-hidden">
            <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => setIsEditing(!isEditing)}
            >
                <div className="flex items-center gap-3 min-w-0">
                    {product.imageUrl && (
                        <img src={product.imageUrl} alt={product.productName} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                        <p className="font-medium truncate">{product.productName}</p>
                        <p className="text-xs text-muted-foreground">
                            {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(product.productPrice)} · 재고 {product.productStock}개
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-xs">{product.category}</Badge>
                    {isEditing ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
            </div>

            {isEditing && (
                <div className="border-t bg-muted/30 p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 grid gap-1">
                            <Label className="text-xs">상품명</Label>
                            <Input
                                value={form.productName ?? ''}
                                onChange={(e) => setForm({ ...form, productName: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="text-xs">가격 (원)</Label>
                            <Input
                                type="number"
                                value={form.productPrice ?? ''}
                                onChange={(e) => setForm({ ...form, productPrice: Number(e.target.value) })}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="text-xs">재고</Label>
                            <Input
                                type="number"
                                value={form.productStock ?? ''}
                                onChange={(e) => setForm({ ...form, productStock: Number(e.target.value) })}
                            />
                        </div>
                        <div className="col-span-2 grid gap-1">
                            <Label className="text-xs">카테고리</Label>
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                value={form.category ?? ''}
                                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                            >
                                <option value="TOP">TOP</option>
                                <option value="PANTS">PANTS</option>
                            </select>
                        </div>
                        <div className="col-span-2 grid gap-1">
                            <Label className="text-xs">이미지 URL (선택)</Label>
                            <Input
                                placeholder="https://..."
                                value={form.imgUrl ?? ''}
                                onChange={(e) => setForm({ ...form, imgUrl: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                        <Button
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); updateMutation.mutate(); }}
                            disabled={updateMutation.isPending}
                            className="flex items-center gap-1"
                        >
                            <Pencil className="h-3 w-3" />
                            {updateMutation.isPending ? '저장 중...' : '저장'}
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('정말 삭제하시겠습니까?')) deleteMutation.mutate();
                            }}
                            disabled={deleteMutation.isPending}
                            className="flex items-center gap-1"
                        >
                            <Trash2 className="h-3 w-3" />
                            삭제
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); setIsEditing(false); }}
                        >
                            취소
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────
// Product Add Form
// ─────────────────────────────────────────────
function AddProductForm({ storeId, onSuccess }: { storeId: number; onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ productName: '', productPrice: '', productStock: '', category: 'TOP', imgUrl: '' });

    const createMutation = useMutation({
        mutationFn: () =>
            productService.createProduct(storeId, {
                productName: form.productName,
                productPrice: Number(form.productPrice),
                productStock: Number(form.productStock),
                categoryCode: form.category as 'TOP' | 'PANTS',
                imgUrl: form.imgUrl || undefined,
            }),
        onSuccess: () => {
            toast.success('상품이 등록되었습니다.');
            setForm({ productName: '', productPrice: '', productStock: '', category: 'TOP', imgUrl: '' });
            setOpen(false);
            onSuccess();
        },
        onError: () => toast.error('상품 등록 실패'),
    });

    if (!open) {
        return (
            <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="flex items-center gap-1 w-full">
                <Plus className="h-3 w-3" /> 새 상품 등록
            </Button>
        );
    }

    return (
        <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-1"><Plus className="h-3 w-3" /> 새 상품 등록</h4>
            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 grid gap-1">
                    <Label className="text-xs">상품명 *</Label>
                    <Input
                        placeholder="예: 기본 화이트 티셔츠"
                        value={form.productName}
                        onChange={(e) => setForm({ ...form, productName: e.target.value })}
                        required
                    />
                </div>
                <div className="grid gap-1">
                    <Label className="text-xs">가격 (원) *</Label>
                    <Input
                        type="number"
                        placeholder="29000"
                        value={form.productPrice}
                        onChange={(e) => setForm({ ...form, productPrice: e.target.value })}
                    />
                </div>
                <div className="grid gap-1">
                    <Label className="text-xs">재고 *</Label>
                    <Input
                        type="number"
                        placeholder="10"
                        value={form.productStock}
                        onChange={(e) => setForm({ ...form, productStock: e.target.value })}
                    />
                </div>
                <div className="col-span-2 grid gap-1">
                    <Label className="text-xs">카테고리</Label>
                    <select
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                        <option value="TOP">TOP</option>
                        <option value="PANTS">PANTS</option>
                    </select>
                </div>
                <div className="col-span-2 grid gap-1">
                    <Label className="text-xs">이미지 URL (선택)</Label>
                    <Input
                        placeholder="https://..."
                        value={form.imgUrl}
                        onChange={(e) => setForm({ ...form, imgUrl: e.target.value })}
                    />
                </div>
            </div>
            <div className="flex gap-2">
                <Button size="sm" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.productName || !form.productPrice || !form.productStock}>
                    {createMutation.isPending ? '등록 중...' : '등록'}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>취소</Button>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Store Accordion with Products
// ─────────────────────────────────────────────
function StoreCard({ store }: { store: { storeId: number; storeName: string } }) {
    const [expanded, setExpanded] = useState(false);
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery({
        queryKey: ['store-products', store.storeId],
        queryFn: () => productService.getProductsByStore(store.storeId),
        enabled: expanded,
    });

    const refresh = () => queryClient.invalidateQueries({ queryKey: ['store-products', store.storeId] });

    return (
        <Card>
            <CardHeader
                className="cursor-pointer hover:bg-accent/50 transition-colors rounded-t-lg"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">{store.storeName}</CardTitle>
                        <CardDescription>ID: {store.storeId}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">{products?.length ?? '—'}개 상품</Badge>
                        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                </div>
            </CardHeader>

            {expanded && (
                <CardContent className="space-y-3 pt-0">
                    <Separator />
                    <h4 className="text-sm font-semibold flex items-center gap-1">
                        <ShoppingBag className="h-3 w-3" /> 상품 목록
                    </h4>
                    {isLoading ? (
                        <p className="text-sm text-muted-foreground">불러오는 중...</p>
                    ) : products && products.length > 0 ? (
                        <div className="space-y-2">
                            {products.map((p) => (
                                <ProductEditRow key={p.productId} product={p} onSaved={refresh} onDeleted={refresh} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">등록된 상품이 없습니다.</p>
                    )}
                    <AddProductForm storeId={store.storeId} onSuccess={refresh} />
                </CardContent>
            )}
        </Card>
    );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export function MyAccountPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, updateUser } = useAuthStore();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') ?? 'profile');

    // Profile
    const { data: profile } = useQuery({
        queryKey: ['me'],
        queryFn: userService.getMe,
        initialData: user,
    });

    const updateProfileMutation = useMutation({
        mutationFn: userService.updateMe,
        onSuccess: (updatedUser) => {
            updateUser(updatedUser);
            toast.success('프로필이 업데이트되었습니다.');
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
        onError: () => toast.error('프로필 업데이트 실패'),
    });

    const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateProfileMutation.mutate({
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            address: formData.get('address') as string,
        });
    };

    // Seller
    const { data: sellerInfo } = useQuery({
        queryKey: ['my-seller'],
        queryFn: sellerService.getMyInfo,
        enabled: user?.role === 'SELLER',
        retry: false,
    });

    const registerSellerMutation = useMutation({
        mutationFn: async (name: string) => { await sellerService.register({ sellerName: name }); },
        onSuccess: () => {
            toast.success('판매자로 등록되었습니다!');
            queryClient.invalidateQueries({ queryKey: ['my-seller'] });
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
        onError: () => toast.error('판매자 등록 실패'),
    });

    const unregisterSellerMutation = useMutation({
        mutationFn: sellerService.unregister,
        onSuccess: async () => {
            toast.success('일반 회원으로 전환되었습니다.');
            queryClient.invalidateQueries({ queryKey: ['my-seller'] });
            // 역할 변경 후 me 다시 조회하여 authStore 갱신
            const me = await userService.getMe();
            updateUser(me);
            queryClient.invalidateQueries({ queryKey: ['me'] });
            setActiveTab('profile');
        },
        onError: () => toast.error('역할 전환 실패'),
    });

    // Stores
    const { data: myStores } = useQuery({
        queryKey: ['my-stores'],
        queryFn: storeService.getMyStores,
        enabled: !!sellerInfo,
    });

    const createStoreMutation = useMutation({
        mutationFn: storeService.createStore,
        onSuccess: () => {
            toast.success('새 상점이 개설되었습니다.');
            queryClient.invalidateQueries({ queryKey: ['my-stores'] });
        },
        onError: () => toast.error('상점 개설 실패'),
    });

    // Wallet
    const { data: balanceData } = useQuery({
        queryKey: ['account-balance'],
        queryFn: payService.getBalance,
        enabled: activeTab === 'wallet',
    });

    const { data: historyData } = useQuery({
        queryKey: ['account-history'],
        queryFn: payService.getHistory,
        enabled: activeTab === 'wallet',
    });

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);

    const historyTypeLabel: Record<string, { label: string; color: string }> = {
        CHARGE: { label: '충전', color: 'text-green-600' },
        USE: { label: '결제', color: 'text-red-600' },
        REFUND: { label: '환불', color: 'text-blue-600' },
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">내 계정</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-[520px]">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> 프로필
                    </TabsTrigger>
                    <TabsTrigger value="seller" className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" /> 판매자
                    </TabsTrigger>
                    <TabsTrigger value="stores" className="flex items-center gap-2" disabled={!sellerInfo}>
                        <Store className="h-4 w-4" /> 상점
                    </TabsTrigger>
                    <TabsTrigger value="wallet" className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" /> 지갑
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>프로필 정보</CardTitle>
                            <CardDescription>개인 정보를 수정하세요.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">이름</Label>
                                    <Input id="name" name="name" defaultValue={profile?.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">이메일</Label>
                                    <Input id="email" name="email" type="email" defaultValue={profile?.email} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">전화번호</Label>
                                    <Input id="phone" name="phone" defaultValue={profile?.phone} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">주소</Label>
                                    <Input id="address" name="address" defaultValue={profile?.address} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>역할</Label>
                                    <Input value={profile?.role} disabled className="bg-muted" />
                                </div>
                                <Button type="submit" disabled={updateProfileMutation.isPending}>
                                    {updateProfileMutation.isPending ? '저장 중...' : '변경 저장'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Seller Tab */}
                <TabsContent value="seller">
                    <Card>
                        <CardHeader>
                            <CardTitle>판매자 관리</CardTitle>
                            <CardDescription>판매자 프로필을 관리하세요.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {sellerInfo ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
                                        현재 판매자로 활동 중: <strong>{sellerInfo.sellerName}</strong>
                                    </div>
                                    <p className="text-muted-foreground">상점 탭에서 상점과 상품을 관리할 수 있습니다.</p>
                                    <Separator />
                                    <div>
                                        <h3 className="font-semibold mb-1">역할 전환</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            판매자 등록을 해제하고 일반 회원으로 전환합니다. 보유한 상점과 상품은 유지됩니다.
                                        </p>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm('정말 일반 회원으로 전환하시겠습니까?')) {
                                                    unregisterSellerMutation.mutate();
                                                }
                                            }}
                                            disabled={unregisterSellerMutation.isPending}
                                        >
                                            {unregisterSellerMutation.isPending ? '전환 중...' : '일반 회원으로 전환'}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h3 className="font-semibold">판매자 등록</h3>
                                    <p className="text-sm text-muted-foreground">ClosetBuddy에서 나만의 상품을 판매해보세요.</p>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.currentTarget);
                                            registerSellerMutation.mutate(formData.get('sellerName') as string);
                                        }}
                                        className="flex gap-2"
                                    >
                                        <Input name="sellerName" placeholder="판매자/브랜드 이름 입력" required className="max-w-sm" />
                                        <Button type="submit" disabled={registerSellerMutation.isPending}>판매자 등록</Button>
                                    </form>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Stores Tab (with Product Management) */}
                <TabsContent value="stores">
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>새 상점 개설</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    createStoreMutation.mutate({ storeName: formData.get('storeName') as string });
                                    (e.target as HTMLFormElement).reset();
                                }}
                                className="flex gap-2 items-end"
                            >
                                <div className="grid gap-2 flex-1 max-w-sm">
                                    <Label htmlFor="storeName">상점 이름</Label>
                                    <Input id="storeName" name="storeName" placeholder="예: 여름 컬렉션" required />
                                </div>
                                <Button type="submit" disabled={createStoreMutation.isPending}>상점 만들기</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Store className="h-5 w-5" /> 내 상점 목록
                        </h2>
                        {myStores && myStores.length > 0 ? (
                            myStores.map((store) => <StoreCard key={store.storeId} store={store} />)
                        ) : (
                            <p className="text-muted-foreground text-center py-12">
                                상점이 없습니다. 위에서 첫 번째 상점을 만들어보세요!
                            </p>
                        )}
                    </div>
                </TabsContent>

                {/* Wallet Tab */}
                <TabsContent value="wallet">
                    <div className="space-y-6">
                        {/* Balance Card */}
                        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                                            <Wallet className="h-4 w-4" /> 예치금 잔액
                                        </p>
                                        <p className="text-4xl font-black text-primary">
                                            {balanceData !== undefined ? formatPrice(balanceData.balance) : '로딩 중...'}
                                        </p>
                                    </div>
                                    <Button onClick={() => navigate('/deposit')} size="lg" className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" /> 충전하기
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">거래 내역</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {historyData && historyData.length > 0 ? (
                                    <div className="space-y-1">
                                        {historyData.map((h, i) => {
                                            const info = historyTypeLabel[h.type] ?? { label: h.type, color: '' };
                                            const isPositive = h.type === 'CHARGE' || h.type === 'REFUND';
                                            return (
                                                <div key={h.id ?? i}>
                                                    {i > 0 && <Separator className="my-1" />}
                                                    <div className="flex items-center justify-between py-2">
                                                        <div>
                                                            <span className={`text-sm font-medium ${info.color}`}>{info.label}</span>
                                                            {h.description && (
                                                                <p className="text-xs text-muted-foreground">{h.description}</p>
                                                            )}
                                                            <p className="text-xs text-muted-foreground">
                                                                {new Date(h.createdAt).toLocaleString('ko-KR')}
                                                            </p>
                                                        </div>
                                                        <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                            {isPositive ? '+' : '-'}{formatPrice(h.amount)}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">거래 내역이 없습니다.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
