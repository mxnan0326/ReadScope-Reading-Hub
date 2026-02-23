import { useState, useMemo, useEffect } from 'react'
import type { Article } from './types'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import TagFilter from './components/TagFilter'
import ArticleGrid from './components/ArticleGrid'
import ArticleDetail from './components/ArticleDetail'
import Footer from './components/Footer'

function App() {
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // 动态加载数据
  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        const sortedData = (data as Article[]).reverse()
        setArticles(sortedData)
      })
      .catch(err => console.error('加载数据失败:', err))
  }, [])

  // 提取所有唯一标签，过滤无效标签
  const allTags = useMemo(() => {
    return Array.from(
      new Set(
        articles.flatMap(a =>
          a.tags.filter(t => t && !t.includes('无匹配'))
        )
      )
    ).sort()
  }, [articles])

  const filtered = useMemo(() => {
    return articles.filter(article => {
      const tagMatch = !selectedTag || article.tags.includes(selectedTag)
      const q = searchQuery.toLowerCase()
      const textMatch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        article.guest.toLowerCase().includes(q)
      return tagMatch && textMatch
    })
  }, [selectedTag, searchQuery, articles])

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearch={setSearchQuery} />

      {selectedArticle ? (
        <ArticleDetail
          article={selectedArticle}
          onBack={() => setSelectedArticle(null)}
        />
      ) : (
        <>
          <HeroSection total={articles.length} />
          <TagFilter
            tags={allTags}
            selected={selectedTag}
            onSelect={setSelectedTag}
          />
          <ArticleGrid
            articles={filtered}
            onSelect={setSelectedArticle}
          />
        </>
      )}

      <Footer />
    </div>
  )
}

export default App
