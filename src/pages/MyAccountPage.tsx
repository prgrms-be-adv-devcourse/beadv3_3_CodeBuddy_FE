import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { sellerService } from '@/services/sellerService';
import { storeService } from '@/services/storeService';
import { User, Store, ShoppingBag } from 'lucide-react';

export function MyAccountPage() {
    const { user, updateUser } = useAuthStore();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("profile");

    // === Profile Logic ===
    const { data: profile } = useQuery({
        queryKey: ['me'],
        queryFn: userService.getMe,
        initialData: user, // Start with auth store data
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

    // === Seller Logic ===
    const { data: sellerInfo } = useQuery({
        queryKey: ['my-seller'],
        queryFn: sellerService.getMyInfo,
        enabled: user?.role === 'SELLER', // Only fetch if user has SELLER role
        retry: false,
    });

    const registerSellerMutation = useMutation({
        mutationFn: async (name: string) => {
            // sellerService.register 내부에서 user-service의 권한 변경까지 처리함
            await sellerService.register({ sellerName: name });
        },
        onSuccess: () => {
            toast.success('판매자로 등록되었습니다!');
            queryClient.invalidateQueries({ queryKey: ['my-seller'] });
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
        onError: () => toast.error('판매자 등록 실패'),
    });

    // === Store Logic ===
    const { data: myStores } = useQuery({
        queryKey: ['my-stores'],
        queryFn: storeService.getMyStores,
        enabled: !!sellerInfo, // Only fetch if user is a seller
    });

    const createStoreMutation = useMutation({
        mutationFn: storeService.createStore,
        onSuccess: () => {
            toast.success('새 상점이 개설되었습니다.');
            queryClient.invalidateQueries({ queryKey: ['my-stores'] });
        },
        onError: () => toast.error('상점 개설 실패'),
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">내 계정</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> 프로필
                    </TabsTrigger>
                    <TabsTrigger value="seller" className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" /> 판매자
                    </TabsTrigger>
                    <TabsTrigger value="stores" className="flex items-center gap-2" disabled={!sellerInfo}>
                        <Store className="h-4 w-4" /> 상점
                    </TabsTrigger>
                </TabsList>

                {/* === Profile Tab === */}
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

                {/* === Seller Tab === */}
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
                                    <p className="text-muted-foreground">
                                        상점 탭에서 상점을 관리할 수 있습니다.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h3 className="font-semibold">판매자 등록</h3>
                                    <p className="text-sm text-muted-foreground">
                                        ClosetBuddy에서 나만의 상품을 판매해보세요.
                                    </p>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.currentTarget);
                                            registerSellerMutation.mutate(formData.get('sellerName') as string);
                                        }}
                                        className="flex gap-2"
                                    >
                                        <Input
                                            name="sellerName"
                                            placeholder="판매자/브랜드 이름 입력"
                                            required
                                            className="max-w-sm"
                                        />
                                        <Button type="submit" disabled={registerSellerMutation.isPending}>
                                            판매자 등록
                                        </Button>
                                    </form>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* === Stores Tab === */}
                <TabsContent value="stores">
                    <Card>
                        <CardHeader>
                            <CardTitle>내 상점</CardTitle>
                            <CardDescription>상점과 상품을 관리하세요.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        createStoreMutation.mutate({ storeName: formData.get('storeName') as string });
                                    }}
                                    className="flex gap-2 items-end"
                                >
                                    <div className="grid gap-2 flex-1 max-w-sm">
                                        <Label htmlFor="storeName">새 상점 이름</Label>
                                        <Input id="storeName" name="storeName" placeholder="예: 여름 컬렉션" required />
                                    </div>
                                    <Button type="submit" disabled={createStoreMutation.isPending}>
                                        상점 만들기
                                    </Button>
                                </form>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {myStores?.map((store) => (
                                    <Card key={store.storeId} className="bg-card">
                                        <CardHeader>
                                            <CardTitle className="text-lg">{store.storeName}</CardTitle>
                                            <CardDescription>ID: {store.storeId}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button variant="outline" className="w-full">
                                                상품 관리
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                                {myStores?.length === 0 && (
                                    <p className="text-muted-foreground col-span-full text-center py-8">
                                        상점이 없습니다. 위에서 첫 번째 상점을 만들어보세요!
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
