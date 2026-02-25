export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold">ClosetBuddy</span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        © {currentYear} ClosetBuddy. 모든 권리 보유.
                    </p>

                    <div className="flex items-center space-x-4">
                        <a
                            href="#"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            개인정보처리방침
                        </a>
                        <a
                            href="#"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            이용약관
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
