import { useState, useEffect, useMemo } from 'react'
import { fetchNews } from '../api/dataApi'

const categories = ['全部', '影视', '综艺', '时尚', '日常']

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月']

function SkeletonCard() {
  return (
    <div className="glass rounded-3xl overflow-hidden animate-pulse">
      <div className="aspect-video" style={{ background: 'rgba(139,92,246,0.05)' }} />
      <div className="p-4 space-y-3">
        <div className="h-4 rounded-lg" style={{ background: 'rgba(139,92,246,0.06)', width: '75%' }} />
        <div className="h-3 rounded-lg" style={{ background: 'rgba(139,92,246,0.04)', width: '100%' }} />
        <div className="flex justify-between">
          <div className="h-3 rounded-lg" style={{ background: 'rgba(139,92,246,0.04)', width: '64px' }} />
          <div className="h-3 rounded-lg" style={{ background: 'rgba(139,92,246,0.04)', width: '80px' }} />
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
      const [y, m] = (news.date || '').split('-')
      const key = `${y}-${m}`
      if (!map.has(key)) {
        const entry = { key, year: y, month: parseInt(m), items: [] }
        map.set(key, entry)
        groups.push(entry)
      }
      map.get(key).items.push(news)
    }
    return groups
  }, [displayNews, limit])

  const NewsCard = ({ news }) => {
    const newsUrl = news.url

    if (newsUrl && newsUrl !== '#' && !newsUrl.startsWith('/')) {
      return (
        <a
          href={newsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group glass rounded-3xl overflow-hidden card-hover no-underline block"
        >
          <NewsCardContent news={news} />
        </a>
      )
    }

    return (
      <div className="group glass rounded-3xl overflow-hidden">
        <NewsCardContent news={news} />
      </div>
    )
  }

  const NewsCardContent = ({ news }) => (
    <>
      {news.cover && (
        <div className="aspect-video overflow-hidden relative">
          <img
            src={news.cover}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            loading="lazy"
          />
          <span className="absolute top-2.5 left-2.5 backdrop-blur-sm text-[13px] font-medium px-2.5 py-1 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.8)', color: '#4B5563' }}>
            {news.category || '资讯'}
          </span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-[16px] leading-snug mb-2 line-clamp-2 group-hover:text-[#7C3AED] transition-colors"
          style={{ color: '#1E1B4B' }}>
          {news.title}
        </h3>
        {news.summary && news.summary !== news.title && (
          <p className="text-[14px] leading-relaxed line-clamp-2 mb-3" style={{ color: '#6B7280' }}>
            {news.summary}
          </p>
        )}
        <div className="flex items-center justify-between text-[13px]" style={{ color: '#9CA3AF' }}>
          <span>{news.source}</span>
          <span>{news.date || news.time}</span>
        </div>
      </div>
    </>
  )

  return (
    <div>
      {!limit && (
        <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[13px] sm:text-[14px] font-medium whitespace-nowrap transition-all"
              style={{
                color: activeCategory === cat ? '#7C3AED' : '#6B7280',
                background: activeCategory === cat ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.4)',
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
        <div className="glass rounded-3xl py-16 text-center">
          <svg className="w-12 h-12 mx-auto mb-3" style={{ color: '#D1D5DB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="font-semibold text-[16px] mb-1" style={{ color: '#1E1B4B' }}>暂无相关新闻</p>
          <p className="text-[14px]" style={{ color: '#6B7280' }}>当前热搜榜上没有任嘉伦相关新闻</p>
          <p className="text-[13px] mt-2" style={{ color: '#9CA3AF' }}>新闻会实时更新，稍后再来看看</p>
        </div>
      ) : limit ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayNews.map(news => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {groupedByMonth && groupedByMonth.map((group) => (
            <section key={group.key}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-6 rounded-full" style={{ background: 'linear-gradient(to bottom, #A78BFA, #C084FC)' }} />
                  <h2 className="text-[18px] font-bold" style={{ color: '#1E1B4B' }}>
                    {group.year}年{monthNames[group.month - 1]}
                  </h2>
                </div>
                <span className="text-[14px]" style={{ color: '#9CA3AF' }}>{group.items.length} 条资讯</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.4)' }} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map(news => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
