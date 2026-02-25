import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MessageCircle, Eye, Send } from 'lucide-react';

interface Comment {
    id: number;
    author: string;
    content: string;
    timestamp: string;
    avatar?: string;
}

// 더미 게시글 상세 데이터
const postData: Record<string, {
    id: number;
    title: string;
    author: string;
    content: string;
    image: string;
    viewCount: number;
    createdAt: string;
    comments: Comment[];
}> = {
    '1': {
        id: 1,
        title: '오늘의 데일리 룩 🌟 캐주얼하면서도 세련된 코디',
        author: '패션스타일러',
        content: '오늘은 캐주얼하면서도 세련된 느낌을 주고 싶어서 이렇게 코디해봤어요! 데님 팬츠에 심플한 화이트 티셔츠를 매치하고, 포인트로 오버사이즈 재킷을 걸쳤습니다.\n\n날씨가 선선해서 레이어드하기 딱 좋은 계절이네요. 여러분도 이런 스타일 어떠세요? 😊',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
        viewCount: 234,
        createdAt: '2026-02-18',
        comments: [
            { id: 1, author: '패션러버', content: '정말 멋진 스타일이네요! 어디서 구매하셨어요?', timestamp: '2시간 전', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
            { id: 2, author: '스타일리스트김', content: '색 조합이 정말 좋아요 👍', timestamp: '5시간 전', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
        ],
    },
};

// 기본 게시글 데이터 (ID가 매칭되지 않을 때)
const defaultPost = {
    id: 0,
    title: '스타일 게시글',
    author: '작성자',
    content: '게시글 내용이 여기에 표시됩니다.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    viewCount: 0,
    createdAt: '2026-02-18',
    comments: [],
};

export function BoardDetailPage() {
    const { postId } = useParams<{ postId: string }>();
    const post = postData[postId || ''] || defaultPost;

    const [comments, setComments] = useState<Comment[]>(post.comments);
    const [newComment, setNewComment] = useState('');

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            const comment: Comment = {
                id: comments.length + 1,
                author: '나',
                content: newComment,
                timestamp: '방금 전',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
            };
            setComments([...comments, comment]);
            setNewComment('');
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <Link
                    to="/board"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    목록으로 돌아가기
                </Link>

                {/* Main Post Card */}
                <Card className="overflow-hidden shadow-xl">
                    {/* Post Header */}
                    <CardHeader className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
                                <AvatarFallback>{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{post.author}</h3>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span>{post.createdAt}</span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-3.5 w-3.5" />
                                        {post.viewCount}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">{post.title}</h1>
                        </div>
                    </CardHeader>

                    {/* Post Image */}
                    <div className="relative aspect-[4/3] md:aspect-[16/9] max-h-[400px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                        <img
                            src={post.image}
                            alt="패션 스냅"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Post Content */}
                    <CardContent className="pt-6 space-y-4">
                        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                            {post.content.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="text-foreground leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </CardContent>

                    <Separator />

                    {/* Comments Section */}
                    <CardFooter className="flex-col items-start pt-6 space-y-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <MessageCircle className="h-5 w-5" />
                            <span className="font-semibold">댓글 {comments.length}개</span>
                        </div>

                        {/* Comments List */}
                        <div className="w-full space-y-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3 animate-fade-in">
                                    <Avatar className="h-10 w-10 flex-shrink-0">
                                        <AvatarImage src={comment.avatar} />
                                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm">{comment.author}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {comment.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-sm text-foreground bg-muted/50 rounded-lg px-3 py-2">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Comment Input */}
                        <form onSubmit={handleSubmitComment} className="w-full">
                            <div className="flex gap-2">
                                <Avatar className="h-10 w-10 flex-shrink-0">
                                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=me" />
                                    <AvatarFallback>나</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 flex gap-2">
                                    <Input
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="댓글을 입력하세요..."
                                        className="flex-1"
                                    />
                                    <Button type="submit" size="icon" disabled={!newComment.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
