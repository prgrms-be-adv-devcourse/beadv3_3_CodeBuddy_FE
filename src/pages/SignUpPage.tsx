import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import type { SignUpRequest } from '@/types';

export function SignUpPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpRequest & { confirmPassword: string }>({
        defaultValues: {
            username: '',
            memberId: '',
            email: '',
            password: '',
            confirmPassword: '',
            address: '',
            phone: '',
        },
    });

    const password = watch('password');

    const onSubmit = async (data: SignUpRequest & { confirmPassword: string }) => {
        setIsLoading(true);
        try {
            const { confirmPassword, ...signUpData } = data;
            await authService.signUp(signUpData);
            toast.success('회원가입이 완료되었습니다! 로그인해주세요.');
            navigate('/login');
        } catch (error) {
            toast.error('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
                    <CardDescription>
                        정보를 입력하고 시작하세요
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="username" className="text-sm font-medium">
                                    이름
                                </label>
                                <Input
                                    id="username"
                                    placeholder="이름"
                                    {...register('username', {
                                        required: '이름을 입력해주세요',
                                    })}
                                />
                                {errors.username && (
                                    <p className="text-xs text-destructive">{errors.username.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="memberId" className="text-sm font-medium">
                                    아이디
                                </label>
                                <Input
                                    id="memberId"
                                    placeholder="아이디"
                                    {...register('memberId', {
                                        required: '아이디를 입력해주세요',
                                        minLength: { value: 4, message: '최소 4자 이상' }
                                    })}
                                />
                                {errors.memberId && (
                                    <p className="text-xs text-destructive">{errors.memberId.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                이메일
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@email.com"
                                {...register('email', {
                                    required: '이메일을 입력해주세요',
                                    pattern: {
                                        value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                        message: '올바른 이메일 형식이 아닙니다'
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                비밀번호
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="8자 이상"
                                    {...register('password', {
                                        required: '비밀번호를 입력해주세요',
                                        minLength: { value: 8, message: '비밀번호는 최소 8자 이상이어야 합니다' },
                                        pattern: {
                                            value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                            message: '영문, 숫자, 특수문자를 포함해야 합니다'
                                        }
                                    })}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">
                                비밀번호 확인
                            </label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="비밀번호 재입력"
                                {...register('confirmPassword', {
                                    required: '비밀번호를 다시 입력해주세요',
                                    validate: value => value === password || '비밀번호가 일치하지 않습니다'
                                })}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium">
                                전화번호
                            </label>
                            <Input
                                id="phone"
                                placeholder="010-1234-5678"
                                {...register('phone', {
                                    required: '전화번호를 입력해주세요',
                                    pattern: {
                                        value: /^\d{2,3}-\d{3,4}-\d{4}$/,
                                        message: '형식: 010-1234-5678'
                                    }
                                })}
                            />
                            {errors.phone && (
                                <p className="text-sm text-destructive">{errors.phone.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address" className="text-sm font-medium">
                                주소
                            </label>
                            <Input
                                id="address"
                                placeholder="주소를 입력하세요"
                                {...register('address', {
                                    required: '주소를 입력해주세요',
                                })}
                            />
                            {errors.address && (
                                <p className="text-sm text-destructive">{errors.address.message}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? '가입 처리 중...' : '회원가입'}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <Separator />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                            또는 소셜 가입
                        </span>
                    </div>

                    <Button variant="outline" className="w-full" disabled>
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google로 계속하기
                    </Button>
                </CardContent>

                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        이미 계정이 있으신가요?{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline">
                            로그인
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
