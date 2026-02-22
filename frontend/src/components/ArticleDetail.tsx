import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
    ArrowLeft, ExternalLink, Quote, User, Calendar, Layers, List, ChevronUp,
} from 'lucide-react'
import type { Article } from '../types'
import ReactMarkdown from 'react-markdown'

interface Props {
    article: Article
    onBack: () => void
}

// ── ID 生成（无状态，幂等） ───────────────────────────────────────────────────

function slugify(text: string): string {
    return text
        .replace(/\*\*/g, '').replace(/[*_`]/g, '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fa5-]/g, '')
}

// ── TOC ──────────────────────────────────────────────────────────────────────

interface TocItem {
    level: number
    text: string
    id: string
}

/**
 * 从 Markdown 提取标题列表。
 * ID 生成：slugify(text)；同名标题追加 -2, -3 避免重复。
 */
function buildToc(markdown: string): TocItem[] {
    const toc: TocItem[] = []
    const seen: Record<string, number> = {}

    for (const line of markdown.split('\n')) {
        const m = line.match(/^(#{1,3})\s+(.+)/)
        if (!m) continue
        const level = m[1].length
        const text = m[2].replace(/\*\*/g, '').replace(/[*_`]/g, '').trim()
        const base = slugify(text)
        const n = seen[base] ?? 0
        seen[base] = n + 1
        toc.push({ level, text, id: n === 0 ? base : `${base}-${n}` })
    }
    return toc
}

/**
 * 从 TOC 构建 "标题文字 → id" 的 Map，供 Markdown 渲染器查表。
 * 使用 slugify(text) 作为 key，与渲染器保持一致。
 */
function buildTextIdMap(toc: TocItem[]): Map<string, string> {
    const map = new Map<string, string>()
    for (const item of toc) {
        // 用 slugify 后的形式作 key，与渲染器一致
        const key = slugify(item.text)
        if (!map.has(key)) map.set(key, item.id) // 重复时保留第一个
    }
    return map
}

// ── React children → 纯文本 ──────────────────────────────────────────────────

function childrenToText(children: React.ReactNode): string {
    if (typeof children === 'string') return children
    if (typeof children === 'number') return String(children)
    if (Array.isArray(children)) return children.map(childrenToText).join('')
    if (children !== null && typeof children === 'object' && 'props' in (children as object)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return childrenToText((children as any).props?.children)
    }
    return ''
}

// ── Heading renderer（无副作用，查表获取 id） ─────────────────────────────────

function makeComponents(textIdMap: Map<string, string>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const heading = (Tag: 'h1' | 'h2' | 'h3') => ({ children }: any) => {
        const text = childrenToText(children)
        const key = slugify(text)
        const id = textIdMap.get(key) ?? key   // 查表；查不到就直接用 slug
        return <Tag id={id}>{children}</Tag>
    }
    return { h1: heading('h1'), h2: heading('h2'), h3: heading('h3') }
}

// ── TableOfContents ───────────────────────────────────────────────────────────

function TableOfContents({
    items, activeId, onClickItem,
}: {
    items: TocItem[], activeId: string, onClickItem: (id: string) => void
}) {
    if (items.length === 0) return null

    return (
        <nav className="hidden xl:block w-52 flex-shrink-0">
            <div className="sticky top-32 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">
                    <List size={13} />
                    <span>目录</span>
                </div>
                <ul className="space-y-0.5">
                    {items.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onClickItem(item.id)}
                                className={`
                  w-full text-left text-xs leading-snug py-1.5 px-2 rounded-lg transition-all duration-150
                  ${item.level === 1 ? 'font-semibold' : item.level === 2 ? 'pl-4' : 'pl-7 text-[11px]'}
                  ${activeId === item.id
                                        ? 'text-accent bg-accent/10 font-medium'
                                        : 'text-textSecondary hover:text-textPrimary hover:bg-gray-50'}
                `}
                            >
                                {item.text}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ArticleDetail({ article, onBack }: Props) {
    const tags = article.tags.filter((t) => t && !t.includes('无匹配'))

    const tocItems = useMemo(() => buildToc(article.summary), [article.summary])

    // ✅ 查表 map：稳定，只在文章变化时重建
    const textIdMap = useMemo(() => buildTextIdMap(tocItems), [tocItems])

    // ✅ components：稳定，只在 map 变化时重建；无内部状态，多次渲染安全
    const mdComponents = useMemo(() => makeComponents(textIdMap), [textIdMap])

    const [activeId, setActiveId] = useState('')
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [tocOpen, setTocOpen] = useState(false)

    const scrollToHeading = useCallback((id: string) => {
        const el = document.getElementById(id)
        if (!el) {
            console.warn('[TOC] element not found for id:', id)
            return
        }
        const OFFSET = 130
        const y = el.getBoundingClientRect().top + window.scrollY - OFFSET
        window.scrollTo({ top: y, behavior: 'smooth' })
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400)
            let current = ''
            for (const { id } of tocItems) {
                const el = document.getElementById(id)
                if (el && el.getBoundingClientRect().top <= 150) current = id
            }
            setActiveId(current)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="min-h-screen">

            {/* 顶部返回栏 */}
            <div className="sticky top-[57px] z-40 bg-white/80 backdrop-blur-md border-b border-[#e8efe6]">
                <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-textSecondary hover:text-accent text-sm font-medium transition-colors"
                        >
                            <ArrowLeft size={16} />
                            返回列表
                        </button>

                        {tocItems.length > 0 && (
                            <button
                                onClick={() => setTocOpen((v) => !v)}
                                className="xl:hidden flex items-center gap-1.5 text-textSecondary hover:text-accent text-sm transition-colors"
                            >
                                <List size={15} />
                                <span>目录</span>
                            </button>
                        )}
                    </div>

                    {article.original_link && (
                        <a
                            href={article.original_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-accent text-sm font-medium
                         px-3 py-1.5 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors"
                        >
                            <ExternalLink size={14} />
                            原文链接
                        </a>
                    )}
                </div>

                {/* 移动端目录下拉 */}
                {tocOpen && tocItems.length > 0 && (
                    <div className="xl:hidden border-t border-[#e8efe6] bg-white/95 px-6 py-3 max-h-56 overflow-y-auto">
                        <ul className="space-y-1">
                            {tocItems.map((item) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => { scrollToHeading(item.id); setTocOpen(false) }}
                                        className={`
                      w-full text-left text-xs py-1 px-2 rounded transition-colors
                      ${item.level === 2 ? 'pl-5' : item.level === 3 ? 'pl-8' : ''}
                      ${activeId === item.id
                                                ? 'text-accent font-medium'
                                                : 'text-textSecondary hover:text-textPrimary'}
                    `}
                                    >
                                        {item.text}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* 主体 */}
            <div className="max-w-6xl mx-auto px-6 py-10 flex gap-10">

                <TableOfContents items={tocItems} activeId={activeId} onClickItem={scrollToHeading} />

                <article className="flex-1 min-w-0 max-w-3xl mx-auto">

                    {/* 封面图 */}
                    {article.cover_image && (
                        <div className="mb-8 rounded-2xl overflow-hidden shadow-sm border border-[#e8efe6] aspect-video">
                            <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* 标签 */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium border border-accent/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* 标题 */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-textPrimary leading-tight mb-5">
                        {article.title}
                    </h1>

                    {/* 元信息 */}
                    <div className="flex flex-wrap items-center gap-4 text-textSecondary text-sm mb-8 pb-8 border-b border-[#e8efe6]">
                        {article.guest && <span className="flex items-center gap-1.5"><User size={14} /> {article.guest}</span>}
                        {article.publish_date && <span className="flex items-center gap-1.5"><Calendar size={14} /> {article.publish_date}</span>}
                        {article.source_platform && <span className="flex items-center gap-1.5"><Layers size={14} /> {article.source_platform}</span>}
                    </div>

                    {/* 金句 */}
                    {article.quotes.length > 0 && (
                        <div className="mb-10 p-6 bg-[#f3f7f2] rounded-2xl border border-accent/20 space-y-4">
                            <div className="flex items-center gap-2 text-accent text-sm font-medium">
                                <Quote size={16} /> <span>精华金句</span>
                            </div>
                            {article.quotes.map((q, i) => (
                                <blockquote key={i} className="pl-4 border-l-2 border-accent/40 text-textPrimary text-sm leading-relaxed italic">
                                    {q.replace(/["""]/g, '').trim()}
                                </blockquote>
                            ))}
                        </div>
                    )}

                    {/* Markdown 正文 */}
                    <div className="prose prose-sm max-w-none
                          prose-headings:text-textPrimary prose-headings:font-bold
                          prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                          prose-p:text-textSecondary prose-p:leading-relaxed
                          prose-strong:text-textPrimary
                          prose-blockquote:border-accent/40 prose-blockquote:text-textSecondary prose-blockquote:not-italic
                          prose-hr:border-[#e8efe6]
                          prose-li:text-textSecondary">
                        <ReactMarkdown components={mdComponents}>
                            {article.summary}
                        </ReactMarkdown>
                    </div>
                </article>
            </div>

            {/* 回到顶部 */}
            {showScrollTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-8 right-8 z-50 w-10 h-10 bg-accent text-white rounded-full
                     shadow-lg flex items-center justify-center
                     hover:bg-accent/80 transition-all duration-200 hover:scale-110"
                    title="回到顶部"
                >
                    <ChevronUp size={20} />
                </button>
            )}
        </div>
    )
}
