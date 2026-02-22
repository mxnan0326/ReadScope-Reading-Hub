import { Calendar, Radio, User } from 'lucide-react'
import type { Article } from '../types'

// 平台颜色映射
const platformColors: Record<string, string> = {
    'YouTube': 'bg-red-50 text-red-500',
    'B站': 'bg-blue-50 text-blue-500',
    '小宇宙': 'bg-purple-50 text-purple-500',
    '得到': 'bg-orange-50 text-orange-500',
}

function getPlatformStyle(platform: string) {
    return platformColors[platform] || 'bg-gray-50 text-gray-500'
}

// 无封面图时的占位背景（按文章ID取哈希选颜色）
const bgColors = [
    'from-[#a8d8a8] to-[#7bbf7b]',
    'from-[#b8d4e8] to-[#89b4d6]',
    'from-[#e8d4b0] to-[#d4b880]',
    'from-[#d4b8d4] to-[#c096c0]',
    'from-[#b0d8c8] to-[#80c4aa]',
    'from-[#e0c8b0] to-[#c8a880]',
]

function getBgColor(id: string): string {
    let hash = 0
    for (const c of id) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffffff
    return bgColors[Math.abs(hash) % bgColors.length]
}

interface CardProps {
    article: Article
    onSelect: (a: Article) => void
}

function ArticleCard({ article, onSelect }: CardProps) {
    const hasCover = Boolean(article.cover_image)
    const tags = article.tags.filter(t => t && !t.includes('无匹配'))

    return (
        <article
            onClick={() => onSelect(article)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden
                 border border-[#e8efe6] shadow-sm
                 hover:shadow-md hover:-translate-y-1 hover:border-accent/30
                 transition-all duration-300"
        >
            {/* 封面图区域 */}
            <div className="relative h-44 overflow-hidden">
                {hasCover ? (
                    <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getBgColor(article.id)} flex items-center justify-center`}>
                        <span className="text-white/60 text-4xl font-serif">阅</span>
                    </div>
                )}
                {/* 平台徽章 */}
                {article.source_platform && (
                    <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium ${getPlatformStyle(article.source_platform)}`}>
                        {article.source_platform}
                    </span>
                )}
            </div>

            {/* 内容区域 */}
            <div className="p-4">
                {/* 标签 */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                        {tags.slice(0, 2).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* 标题 */}
                <h2 className="font-semibold text-textPrimary text-[15px] leading-snug mb-2
                       line-clamp-2 group-hover:text-accent transition-colors">
                    {article.title}
                </h2>

                {/* 元信息 */}
                <div className="flex items-center gap-3 text-textSecondary text-xs">
                    {article.guest && (
                        <span className="flex items-center gap-1">
                            <User size={11} />
                            {article.guest}
                        </span>
                    )}
                    {article.publish_date && (
                        <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {article.publish_date}
                        </span>
                    )}
                </div>

                {/* 摘要（取前两行） */}
                {article.summary && (
                    <p className="mt-2 text-textSecondary text-xs leading-relaxed line-clamp-2">
                        {article.summary.replace(/#+\s*/g, '').slice(0, 120)}
                    </p>
                )}

                {/* 金句预览 */}
                {article.quotes.length > 0 && (
                    <blockquote className="mt-3 pl-3 border-l-2 border-accent/40 text-textSecondary text-xs italic line-clamp-2">
                        {article.quotes[0].replace(/["""]/g, '')}
                    </blockquote>
                )}
            </div>

            {/* 底部"阅读全文"提示 */}
            <div className="px-4 pb-4">
                <div className="flex items-center gap-1 text-accent text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <Radio size={11} />
                    <span>点击阅读全文</span>
                </div>
            </div>
        </article>
    )
}

interface Props {
    articles: Article[]
    onSelect: (a: Article) => void
}

export default function ArticleGrid({ articles, onSelect }: Props) {
    if (articles.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-24 text-center">
                <p className="text-textSecondary text-lg">没有找到相关内容 🍃</p>
            </div>
        )
    }

    return (
        <main className="max-w-6xl mx-auto px-6 pb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {articles.map(article => (
                    <ArticleCard key={article.id} article={article} onSelect={onSelect} />
                ))}
            </div>
        </main>
    )
}
