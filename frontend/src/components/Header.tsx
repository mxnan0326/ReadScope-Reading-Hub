import { Search, BookOpen } from 'lucide-react'

interface Props {
    searchQuery: string
    onSearch: (q: string) => void
}

export default function Header({ searchQuery, onSearch }: Props) {
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e8efe6]">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center">
                {/* Logo */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-sm">
                        <BookOpen size={16} className="text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-textPrimary text-lg tracking-tight">阅界</span>
                        <span className="text-textSecondary text-sm ml-1.5 hidden sm:inline">专注收藏馆</span>
                    </div>
                </div>

                {/* Search - centered with some margin */}
                <div className="flex-1 max-w-md mx-auto relative px-6">
                    <Search size={16} className="absolute left-9 top-1/2 -translate-y-1/2 text-textSecondary" />
                    <input
                        type="text"
                        placeholder="搜索文章、嘉宾..."
                        value={searchQuery}
                        onChange={e => onSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#f3f7f2] border border-transparent
                       focus:outline-none focus:border-accent/50 focus:bg-white
                       text-sm text-textPrimary placeholder-textSecondary transition-all"
                    />
                </div>

                {/* Author Info - pushed to the far right */}
                <div className="flex items-center gap-3 pl-4 flex-shrink-0">
                    <span className="text-base font-bold text-textPrimary hidden md:inline">绚蓝</span>
                    <div className="relative p-0.5 bg-gradient-to-tr from-accent/20 to-accent/5 rounded-full border border-[#e8efe6] shadow-sm">
                        <img src="/logo.png" alt="绚蓝" className="w-9 h-9 rounded-full object-cover" />
                    </div>
                </div>
            </div>
        </header>
    )
}
