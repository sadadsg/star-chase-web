import { useState, useEffect, useMemo } from 'react'
import { fetchNews } from '../api/dataApi'
import { AnimateOnScroll } from './ui'

const categories = ['全部', '影视', '综艺', '时尚', '演出', '日常']

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月']

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #e8e8ed' }}>
      <div className="p-4 space-y-3">
        <div className="h-4 rounded skeleton-shimmer" style={{ width: '75%' }} />
        <div className="h-3 rounded skeleton-shimmer" style={{ width: '100%' }} />
        <div className="flex justify-between">
          <div className="h-3 rounded skeleton-shimmer" style={{ width: 64 }} />
          <div className="h-3 rounded skeleton-shimmer" style={{ width: 80 }} />
        </div>
      </div>
    </div>
  )
}

export default function NewsFeed({ limit }) {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [liveNews, setLiveNews] = useState([])
  const [loading, setLoading] = useState(!limit)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchNews(30).then(result => {
      if (!cancelled) {
        setLiveNews(result.data || [])
        setLoading(false)
      }
    }).catch(() => {
      if (!cancelled) {
        setLiveNews([])
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [])

  const filteredNews = activeCategory === '全部'
    ? liveNews
    : liveNews.filter(n => n.category === activeCategory)

  const displayNews = limit ? filteredNews.slice(0, limit) : filteredNews

  const groupedByMonth = useMemo(() => {
    if (limit || displayNews.length === 0) return null
    const groups = []
    const map = new Map()
    for (const news of displayNews) {
      const timeStr = news.time || news.date || ''
      const [y, m] = timeStr.split('-')
      if (!y || !m) continue
      const key = `${y}-${m}`
      if (!map.has(key)) {
        const entry = { key, year: y, month: parseInt(m), items: [] }
        map.set(key, entry)
        groups.push(entry)
      }
      map.get(key).items.push(news)
    }
    return groups.length ? groups : null
  }, [displayNews, limit])

  const NewsCard = ({ news }) => {
    const newsUrl = news.url

    if (newsUrl && newsUrl !== '#' && !newsUrl.startsWith('/')) {
      return (
        <a
          href={newsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl overflow-hidden no-underline block card-hover"
          style={{ background: '#fff', border: '1px solid #e8e8ed' }}
        >
          <NewsCardContent news={news} />
        </a>
      )
    }

    return (
      <div className="group rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e8e8ed' }}>
        <NewsCardContent news={news} />
      </div>
    )
  }

  const NewsCardContent = ({ news }) => (
    <>
      {news.cover && (
        <div className="aspect-video overflow-hidden">
          <img
            src={news.cover}
            alt={news.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4 sm:p-5">
        <p className="text-[12px] font-medium m-0 mb-1.5" style={{ color: '#86868b' }}>
          {news.category || '资讯'} · {news.source}
        </p>
        <h3 className="font-semibold text-[16px] leading-snug mb-2 line-clamp-2 m-0 transition-colors group-hover:text-[#0066cc]"
          style={{ color: '#1d1d1f' }}>
          {news.title}
        </h3>
        {news.summary && news.summary !== news.title && (
          <p className="text-[14px] leading-relaxed line-clamp-2 mb-3" style={{ color: '#6e6e73' }}>
            {news.summary}
          </p>
        )}
        <p className="text-[13px] m-0" style={{ color: '#86868b' }}>
          {(news.time || news.date || '').slice(0, 10)}
        </p>
      </div>
    </>
  )

  return (
    <div>
      {!limit && (
        <div className="inline-flex flex-wrap gap-0 p-1 rounded-full mb-6" style={{ background: '#f5f5f7' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-[13px] sm:text-[14px] font-medium whitespace-nowrap cursor-pointer transition-all"
              style={{
                color: activeCategory === cat ? '#1d1d1f' : '#6e6e73',
                background: activeCategory === cat ? '#ffffff' : 'transparent',
                boxShadow: activeCategory === cat ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                border: 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : displayNews.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-semibold text-[17px] mb-1.5 m-0" style={{ color: '#1d1d1f' }}>暂无相关资讯</p>
          <p className="text-[14px] m-0" style={{ color: '#86868b' }}>资讯来自工作室微博与百度资讯，更新后自动展示</p>
        </div>
      ) : limit ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayNews.map((news, idx) => (
            <AnimateOnScroll key={news.id} delay={idx * 0.06} y={12}>
              <NewsCard news={news} />
            </AnimateOnScroll>
          ))}
        </div>
      ) : groupedByMonth ? (
        <div className="space-y-10">
          {groupedByMonth.map((group) => (
            <section key={group.key}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-[21px] font-semibold m-0" style={{ letterSpacing: '-0.01em', color: '#1d1d1f' }}>
                  {group.year}年{monthNames[group.month - 1]}
                </h2>
                <span className="text-[14px]" style={{ color: '#86868b' }}>{group.items.length} 条</span>
                <div className="flex-1 h-px" style={{ background: '#d2d2d7' }} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((news, idx) => (
                  <AnimateOnScroll key={news.id} delay={idx * 0.06} y={12}>
                    <NewsCard news={news} />
                  </AnimateOnScroll>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayNews.map((news, idx) => (
            <AnimateOnScroll key={news.id} delay={idx * 0.06} y={12}>
              <NewsCard news={news} />
            </AnimateOnScroll>
          ))}
        </div>
      )}
    </div>
  )
}
