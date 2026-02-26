import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Wallet, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { payService } from '@/services/payService';
import { useQueryClient } from '@tanstack/react-query';

function formatPrice(price: number) {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
}

export function DepositSuccessPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [newBalance, setNewBalance] = useState<number | null>(null);
    const [chargedAmount, setChargedAmount] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const paymentKey = params.get('paymentKey');
        const orderId = params.get('orderId');
        const amount = params.get('amount');

        if (!paymentKey || !orderId || !amount) {
            setErrorMessage('결제 정보가 올바르지 않습니다.');
            setStatus('error');
            return;
        }

        const amountNum = Number(amount);
        setChargedAmount(amountNum);

        payService
            .chargeDeposit({ paymentKey, orderId, amount: amountNum })
            .then(() => {
                // 잔액 재조회
                return payService.getBalance();
            })
            .then((balance) => {
                setNewBalance(balance.balance);
                queryClient.invalidateQueries({ queryKey: ['account-balance'] });
                queryClient.invalidateQueries({ queryKey: ['account-history'] });
                setStatus('success');
            })
            .catch((error: any) => {
                setErrorMessage(error?.response?.data?.message || '충전 처리 중 오류가 발생했습니다.');
                setStatus('error');
            });
    }, [queryClient]);

    if (status === 'loading') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">충전을 처리하고 있습니다...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="container mx-auto max-w-md px-4 py-16 text-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <XCircle className="h-16 w-16 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-red-600">충전 실패</h1>
                    <p className="text-muted-foreground">{errorMessage}</p>
                    <Button onClick={() => navigate('/deposit')}>다시 시도하기</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-md px-4 py-16">
            <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500">
                <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                </div>
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">충전 완료!</h1>
                    <p className="text-muted-foreground">예치금이 성공적으로 충전되었습니다.</p>
                </div>

                <Card className="w-full border-2 border-primary/20">
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">충전 금액</span>
                            <span className="font-semibold">{formatPrice(chargedAmount)}</span>
                        </div>
                        {newBalance !== null && (
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Wallet className="h-4 w-4" /> 현재 잔액
                                </span>
                                <span className="text-xl font-black text-primary">{formatPrice(newBalance)}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button asChild size="lg" className="flex-1">
                        <Link to="/account?tab=wallet">
                            <Wallet className="mr-2 h-4 w-4" />
                            내 지갑 보기
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="flex-1">
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            홈으로
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default DepositSuccessPage;
