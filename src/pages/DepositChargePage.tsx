import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { payService } from '@/services/payService';
import { useQuery } from '@tanstack/react-query';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

const TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_Poxy1XQL8RP6Awdl0kwLV7nO5Wml';

const QUICK_AMOUNTS = [10000, 30000, 50000, 100000, 200000];

function formatPrice(price: number) {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
}

export function DepositChargePage() {
    const navigate = useNavigate();
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { data: balanceData } = useQuery({
        queryKey: ['account-balance'],
        queryFn: payService.getBalance,
    });

    const chargeAmount = selectedAmount ?? (customAmount ? parseInt(customAmount.replace(/,/g, ''), 10) : 0);

    const handleCharge = async () => {
        if (!chargeAmount || chargeAmount < 1000) {
            toast.error('최소 충전 금액은 1,000원입니다.');
            return;
        }
        setIsLoading(true);
        try {
            const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
            const payment = tossPayments.payment({ customerKey: `codebuddy-user-${Date.now()}` });

            const orderId = `deposit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

            await payment.requestPayment({
                method: 'CARD',
                amount: { currency: 'KRW', value: chargeAmount },
                orderId,
                orderName: `예치금 충전 ${formatPrice(chargeAmount)}`,
                successUrl: `${window.location.origin}/deposit/success`,
                failUrl: `${window.location.origin}/deposit?error=true`,
            });
        } catch (error: any) {
            if (error?.code !== 'USER_CANCEL') {
                toast.error(error?.message || '결제 요청 중 오류가 발생했습니다.');
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('error') === 'true') {
            toast.error('결제가 취소되었거나 실패했습니다.');
        }
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-lg mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">예치금 충전</h1>
                </div>

                {/* Current Balance */}
                <Card className="mb-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-1">
                            <Wallet className="h-5 w-5 text-primary" />
                            <span className="text-sm text-muted-foreground">현재 잔액</span>
                        </div>
                        <p className="text-3xl font-black text-primary">
                            {balanceData !== undefined ? formatPrice(balanceData.balance) : '—'}
                        </p>
                    </CardContent>
                </Card>

                {/* Amount Selection */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            충전 금액 선택
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                            {QUICK_AMOUNTS.map((amount) => (
                                <button
                                    key={amount}
                                    onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                                    className={`rounded-lg border py-3 px-2 text-sm font-medium transition-all ${selectedAmount === amount
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border bg-card hover:border-primary/50 hover:bg-accent'
                                        }`}
                                >
                                    {formatPrice(amount)}
                                </button>
                            ))}
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <label className="text-sm font-medium">직접 입력</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="금액 입력 (원)"
                                    value={customAmount}
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(/[^0-9]/g, '');
                                        setCustomAmount(raw);
                                        setSelectedAmount(null);
                                    }}
                                />
                                <span className="text-sm text-muted-foreground whitespace-nowrap">원</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary */}
                {chargeAmount > 0 && (
                    <Card className="mb-6">
                        <CardContent className="pt-6 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">충전 금액</span>
                                <span>{formatPrice(chargeAmount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">충전 후 잔액</span>
                                <span className="font-semibold text-primary">
                                    {formatPrice((balanceData?.balance ?? 0) + chargeAmount)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCharge}
                    disabled={isLoading || !chargeAmount || chargeAmount < 1000}
                >
                    {isLoading ? '결제 처리 중...' : chargeAmount > 0 ? `${formatPrice(chargeAmount)} 충전하기` : '금액을 선택해주세요'}
                </Button>
            </div>
        </div>
    );
}

export default DepositChargePage;
