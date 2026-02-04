import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

// OAuth2 콜백 페이지 - Google 로그인 성공 후 토큰을 받아 저장
export function OAuthCallbackPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setAuth, setTokens } = useAuthStore();

    useEffect(() => {
        const handleOAuthCallback = async () => {
            const accessToken = searchParams.get('access');
            const refreshToken = searchParams.get('refresh');

            if (accessToken && refreshToken) {
                try {
                    // 토큰 저장
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);

                    // JWT 토큰에서 사용자 정보 추출 (Base64 디코딩)
                    const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));

                    const user = {
                        id: tokenPayload.memberId || tokenPayload.sub,
                        memberId: tokenPayload.memberId || tokenPayload.sub,
                        name: tokenPayload.name || 'User',
                        email: tokenPayload.email || '',
                        role: tokenPayload.role || 'USER',
                        address: '',
                        phone: '',
                    };

                    // userId와 userRole 저장 (백엔드 API 호출용)
                    localStorage.setItem('userId', String(user.id));
                    localStorage.setItem('userRole', user.role);

                    setAuth(user, accessToken);
                    setTokens(accessToken, refreshToken);

                    toast.success('Google 로그인 성공!');
                    navigate('/');
                } catch (error) {
                    console.error('OAuth callback error:', error);
                    toast.error('로그인 처리 중 오류가 발생했습니다.');
                    navigate('/login');
                }
            } else {
                toast.error('로그인에 실패했습니다.');
                navigate('/login');
            }
        };

        handleOAuthCallback();
    }, [searchParams, navigate, setAuth, setTokens]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">로그인 처리 중...</p>
            </div>
        </div>
    );
}
