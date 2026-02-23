import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Eye, ChevronLeft, ChevronRight, Image } from 'lucide-react';

interface BoardPost {
    id: number;
    title: string;
    author: string;
    content: string;
    thumbnail: string;
    commentCount: number;
    viewCount: number;
    createdAt: string;
}

const POSTS_PER_PAGE = 10;

// 더미 데이터
const allPosts: BoardPost[] = [
    {
        id: 1,
        title: '오늘의 데일리 룩 🌟 캐주얼하면서도 세련된 코디',
        author: '패션스타일러',
        content: '데님 팬츠에 심플한 화이트 티셔츠를 매치하고, 포인트로 오버사이즈 재킷을 걸쳤습니다.',
        thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200',
        commentCount: 12,
        viewCount: 234,
        createdAt: '2026-02-18',
    },
    {
        id: 2,
        title: '봄맞이 파스텔톤 코디 추천 🌸',
        author: '코디왕',
        content: '봄이 다가오면서 파스텔톤 아이템들이 핫하네요! 라벤더 니트에 화이트 슬랙스 조합 어떠세요?',
        thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200',
        commentCount: 8,
        viewCount: 187,
        createdAt: '2026-02-17',
    },
    {
        id: 3,
        title: '출근룩 고민 해결! 오피스룩 코디',
        author: '직장인A',
        content: '매일 출근룩 고민하시는 분들을 위한 깔끔한 오피스 코디를 소개합니다.',
        thumbnail: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=200',
        commentCount: 15,
        viewCount: 321,
        createdAt: '2026-02-16',
    },
    {
        id: 4,
        title: '스트릿 패션 도전기 🔥',
        author: '힙스터김',
        content: '오버사이즈 후디에 와이드 팬츠, 스니커즈 조합으로 스트릿 무드를 완성했어요.',
        thumbnail: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200',
        commentCount: 22,
        viewCount: 456,
        createdAt: '2026-02-15',
    },
    {
        id: 5,
        title: '데이트룩 추천해주세요!',
        author: '러블리진',
        content: '주말에 데이트인데 뭐 입어야 할지 모르겠어요... 추천 부탁드려요 😊',
        thumbnail: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=200',
        commentCount: 31,
        viewCount: 578,
        createdAt: '2026-02-14',
    },
    {
        id: 6,
        title: '미니멀 코디의 정석',
        author: '심플이즈베스트',
        content: '블랙 & 화이트 조합으로 깔끔한 미니멀 룩을 완성했습니다. 액세서리는 최소한으로!',
        thumbnail: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=200',
        commentCount: 9,
        viewCount: 145,
        createdAt: '2026-02-13',
    },
    {
        id: 7,
        title: '겨울 아우터 코디 모음 🧥',
        author: '패피녀',
        content: '올겨울 핫한 아우터 코디를 모아봤어요. 롱코트부터 숏패딩까지!',
        thumbnail: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200',
        commentCount: 18,
        viewCount: 389,
        createdAt: '2026-02-12',
    },
    {
        id: 8,
        title: '빈티지 감성 코디 🎶',
        author: '레트로매니아',
        content: '코듀로이 팬츠에 빈티지 셔츠, 클래식 가죽 벨트로 레트로 무드를 연출했어요.',
        thumbnail: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=200',
        commentCount: 5,
        viewCount: 98,
        createdAt: '2026-02-11',
    },
    {
        id: 9,
        title: '워크웨어 스타일링 가이드',
        author: '워크맨',
        content: '카고 팬츠와 부츠를 활용한 워크웨어 스타일링입니다. 실용적이면서도 멋있어요!',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        commentCount: 7,
        viewCount: 167,
        createdAt: '2026-02-10',
    },
    {
        id: 10,
        title: '컬러 매칭의 기술 🎨',
        author: '컬러리스트',
        content: '같은 옷도 컬러 조합에 따라 다른 느낌! 톤온톤 vs 보색 대비 코디 비교해봤어요.',
        thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200',
        commentCount: 14,
        viewCount: 276,
        createdAt: '2026-02-09',
    },
    {
        id: 11,
        title: '운동 갈 때도 예쁘게! 애슬레저룩',
        author: '헬스걸',
        content: '레깅스에 크롭탑, 가볍게 걸칠 수 있는 집업으로 활동적이면서도 스타일리시하게!',
        thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200',
        commentCount: 11,
        viewCount: 203,
        createdAt: '2026-02-08',
    },
    {
        id: 12,
        title: '남자 봄 코디 필수 아이템 TOP 5',
        author: '멋쟁이남',
        content: '봄에 꼭 필요한 남성 필수 아이템 5가지를 선정해봤습니다.',
        thumbnail: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=200',
        commentCount: 20,
        viewCount: 412,
        createdAt: '2026-02-07',
    },
    {
        id: 13,
        title: '레이어드의 완성은 머플러!',
        author: '액세서리킹',
        content: '같은 코디여도 머플러 하나로 분위기가 확 달라져요. 머플러 활용법 모음!',
        thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200',
        commentCount: 6,
        viewCount: 134,
        createdAt: '2026-02-06',
    },
    {
        id: 14,
        title: '첫 출근 코디 후기 👔',
        author: '신입사원이',
        content: '첫 출근 때 뭘 입어야 할지 정말 고민 많았는데, 결국 이렇게 입었어요!',
        thumbnail: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=200',
        commentCount: 25,
        viewCount: 534,
        createdAt: '2026-02-05',
    },
    {
        id: 15,
        title: '여름 준비! 시원한 린넨 코디 ☀️',
        author: '여름좋아',
        content: '아직 이르지만 미리 준비하는 여름 린넨 코디! 시원하고 멋있는 조합을 모아봤어요.',
        thumbnail: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=200',
        commentCount: 3,
        viewCount: 89,
        createdAt: '2026-02-04',
    },
];

export function BoardPage() {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const currentPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">스타일 게시판</h1>
                    <p className="text-muted-foreground">
                        나만의 패션 스냅을 공유하고 영감을 받아보세요
                    </p>
                </div>

                {/* Post List */}
                <Card className="overflow-hidden shadow-lg">
                    {/* Table Header */}
                    <div className="hidden md:grid md:grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 bg-muted/50 border-b text-sm font-semibold text-muted-foreground">
                        <span>제목</span>
                        <span className="w-24 text-center">작성자</span>
                        <span className="w-20 text-center">조회</span>
                        <span className="w-24 text-center">작성일</span>
                    </div>

                    {/* Posts */}
                    <div className="divide-y divide-border">
                        {currentPosts.map((post) => (
                            <Link
                                key={post.id}
                                to={`/board/${post.id}`}
                                className="block hover:bg-muted/30 transition-colors"
                            >
                                <div className="px-6 py-4">
                                    {/* Desktop Layout */}
                                    <div className="hidden md:grid md:grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {/* Thumbnail */}
                                            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                                <img
                                                    src={post.thumbnail}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-medium text-sm truncate">
                                                    {post.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <MessageCircle className="h-3 w-3" />
                                                        {post.commentCount}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Image className="h-3 w-3" />
                                                        사진
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="w-24 text-center text-sm text-muted-foreground">
                                            {post.author}
                                        </span>
                                        <span className="w-20 text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
                                            <Eye className="h-3.5 w-3.5" />
                                            {post.viewCount}
                                        </span>
                                        <span className="w-24 text-center text-sm text-muted-foreground">
                                            {post.createdAt.slice(5)}
                                        </span>
                                    </div>

                                    {/* Mobile Layout */}
                                    <div className="md:hidden flex gap-3">
                                        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-muted">
                                            <img
                                                src={post.thumbnail}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-medium text-sm truncate">
                                                {post.title}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                <span>{post.author}</span>
                                                <span>{post.createdAt.slice(5)}</span>
                                                <span className="flex items-center gap-0.5">
                                                    <Eye className="h-3 w-3" />
                                                    {post.viewCount}
                                                </span>
                                                <span className="flex items-center gap-0.5">
                                                    <MessageCircle className="h-3 w-3" />
                                                    {post.commentCount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </Card>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 mt-8">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => goToPage(page)}
                            >
                                {page}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
