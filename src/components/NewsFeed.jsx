import { useState, useEffect, useMemo } from 'react'
import { fetchWeiboNews } from '../api/weiboApi'

const categories = ['全部', '影视', '综艺', '时尚', '日常']

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月']

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#EDF0F5] animate-pulse">
      <div className="aspect-video bg-[#F0F3F8]" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[#F0F3F8] rounded w-3/4" />
        <div className="h-3 bg-[#F0F3F8] rounded w-full" />
        <div className="flex justify-between">
          <div className="h-3 bg-[#F0F3F8] rounded w-16" />
          <div className="h-3 bg-[#F0F3F8] rounded w-20" />
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
    fetchWeiboNews(30).then(data => {
      if (!cancelled) {
        setLiveNews(data || [])
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

  // 新闻卡片组件
  const NewsCard = ({ news }) => {
    const newsUrl = news.url
    
    // 有有效链接：打开新闻源
    if (newsUrl && newsUrl !== '#' && !newsUrl.startsWith('/')) {
      return (
        <a
          href={newsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-white rounded-2xl overflow-hidden border border-[#EDF0F5] card-hover no-underline block"
        >
          <NewsCardContent news={news} />
        </a>
      )
    }
    
    // 无链接：原地展示，不跳转
    return (
      <div className="group bg-white rounded-2xl overflow-hidden border border-[#EDF0F5]">
        <NewsCardContent news={news} />
      </div>
    )
  }

  // 新闻内容组件
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
          <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-[#5A6577] text-[13px] font-medium px-2.5 py-1 rounded-md">
            {news.category || '资讯'}
          </span>
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-[#2D3748] text-[16px] leading-snug mb-2 line-clamp-2 group-hover:text-[#5B8DEF] transition-colors">
          {news.title}
        </h3>
        {news.summary && news.summary !== news.title && (
          <p className="text-[#8E99A8] text-[14px] leading-relaxed line-clamp-2 mb-3">
            {news.summary}
          </p>
        )}
        <div className="flex items-center justify-between text-[13px] text-[#B0BEC5]">
          <span>{news.source}</span>
          <span>{news.date || news.time}</span>
        </div>
      </div>
    </>
  )

  return (
    <div>
      {!limit && (
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-[14px] font-medium whitespace-nowrap transition-all
                ${activeCategory === cat
                  ? 'text-[#5B8DEF] bg-[#EEF3FD]'
                  : 'text-[#8E99A8] hover:text-[#2D3748] hover:bg-[#F7F9FC]'
                }`}
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
        <div className="bg-white rounded-2xl py-16 text-center border border-[#EDF0F5]">
          <svg className="w-12 h-12 mx-auto text-[#D3DAE6] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-[#2D3748] font-semibold text-[16px] mb-1">暂无相关新闻</p>
          <p className="text-[#8E99A8] text-[14px]">当前热搜榜上没有任嘉伦相关新闻</p>
          <p className="text-[#B0BEC5] text-[13px] mt-2">新闻会实时更新，稍后再来看看</p>
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
                  <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#6366F1] to-[#A78BFA]" />
                  <h2 className="text-[18px] font-bold text-[#1E293B]">
                    {group.year}年{monthNames[group.month - 1]}
                  </h2>
                </div>
                <span className="text-[14px] text-[#B0BEC5]">{group.items.length} 条资讯</span>
                <div className="flex-1 h-px bg-[#EDF0F5]" />
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
