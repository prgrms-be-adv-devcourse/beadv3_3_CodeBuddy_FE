import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { userService } from '@/services/userService';
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
                    // 1단계: 토큰 저장 (getMe 호출 전에 먼저 저장해야 Authorization 헤더가 붙음)
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    setTokens(accessToken, refreshToken);

                    // 2단계: 토큰으로 내 정보 조회 (JWT 직접 파싱 대신 API 사용)
                    const me = await userService.getMe();

                    // 3단계: userId, userRole 저장 (백엔드 API 호출용 헤더)
                    localStorage.setItem('userId', String(me.id));
                    localStorage.setItem('userRole', me.role);

                    // 4단계: authStore에 인증 상태 저장
                    setAuth(me, accessToken);

                    toast.success('Google 로그인 성공!');
                    navigate('/');
                } catch (error) {
                    console.error('OAuth callback error:', error);
                    // getMe 실패 시 토큰 삭제 후 로그인 페이지로
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
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
