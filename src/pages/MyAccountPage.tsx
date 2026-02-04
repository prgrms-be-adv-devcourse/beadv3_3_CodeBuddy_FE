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
    const { data: sellerInfo, isLoading: isSellerLoading } = useQuery({
        queryKey: ['my-seller'],
        queryFn: sellerService.getMyInfo,
        retry: false,
    });

    const registerSellerMutation = useMutation({
        mutationFn: async (name: string) => {
            await userService.registerSellerRole(); // 권한 변경
            await sellerService.register({ sellerName: name }); // 판매자 등록
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
            <h1 className="text-3xl font-bold mb-8">My Account</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="seller" className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4" /> Seller
                    </TabsTrigger>
                    <TabsTrigger value="stores" className="flex items-center gap-2" disabled={!sellerInfo}>
                        <Store className="h-4 w-4" /> Stores
                    </TabsTrigger>
                </TabsList>

                {/* === Profile Tab === */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" defaultValue={profile?.name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" defaultValue={profile?.email} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" name="phone" defaultValue={profile?.phone} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" name="address" defaultValue={profile?.address} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Role</Label>
                                    <Input value={profile?.role} disabled className="bg-muted" />
                                </div>
                                <Button type="submit" disabled={updateProfileMutation.isPending}>
                                    {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* === Seller Tab === */}
                <TabsContent value="seller">
                    <Card>
                        <CardHeader>
                            <CardTitle>Seller Management</CardTitle>
                            <CardDescription>Manage your seller profile.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {sellerInfo ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
                                        Currently active as a seller: <strong>{sellerInfo.sellerName}</strong>
                                    </div>
                                    <p className="text-muted-foreground">
                                        You can manage your stores in the Stores tab.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-muted p-4 rounded-md">
                                        <h3 className="font-semibold mb-2">Become a Seller</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Start selling your own products on Fashion Store.
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
                                                placeholder="Enter your seller/brand name"
                                                required
                                                className="max-w-sm"
                                            />
                                            <Button type="submit" disabled={registerSellerMutation.isPending}>
                                                Register as Seller
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* === Stores Tab === */}
                <TabsContent value="stores">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Stores</CardTitle>
                            <CardDescription>Manage your stores and products.</CardDescription>
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
                                        <Label htmlFor="storeName">New Store Name</Label>
                                        <Input id="storeName" name="storeName" placeholder="e.g. Summer Collection" required />
                                    </div>
                                    <Button type="submit" disabled={createStoreMutation.isPending}>
                                        Create Store
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
                                                Manage Products
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                                {myStores?.length === 0 && (
                                    <p className="text-muted-foreground col-span-full text-center py-8">
                                        No stores found. Create your first store above!
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
