import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Construction, PenSquare } from 'lucide-react';

export function BoardPage() {
    return (
        <div className="min-h-screen bg-muted/30 py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                <Card className="flex flex-col items-center justify-center py-24 px-6 text-center shadow-lg border-dashed border-2">
                    <div className="bg-amber-100 p-6 rounded-full mb-6 dark:bg-amber-900/30">
                        <Construction className="h-16 w-16 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">더 나은 경험을 위해 준비 중입니다</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        스타일 게시판은 현재 더 나은 사용자 경험을 제공하기 위해 고도화된 기능을 준비하고 있습니다.
                        곧 더 멋진 모습과 새로운 기능으로 찾아뵙겠습니다.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button variant="outline" asChild>
                            <Link to="/">홈으로 돌아가기</Link>
                        </Button>
                        <Button disabled>
                            <PenSquare className="mr-2 h-4 w-4" />
                            새 글 쓰기 (준비중)
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
