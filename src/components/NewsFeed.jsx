import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchNews } from '../api/dataApi'
import { SkeletonCard } from './ui'
import { EASE_OUT_EXPO, SPRING_SNAP, SPRING_SOFT } from '../lib/motion'

const categories = ['全部', '影视', '综艺', '时尚', '演出', '日常']

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月']

const cardMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.15 } },
}

export default function NewsFeed({ limit }) {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [officialOnly, setOfficialOnly] = useState(false)
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

  // 首页摘要区（limit 模式）优先官方来源；官方不足时回退全量前 N 条，避免首页开天窗
  const displayNews = limit
    ? (() => {
      const official = filteredNews.filter(n => n.official)
      return (official.length ? official : filteredNews).slice(0, limit)
    })()
    : (officialOnly ? filteredNews.filter(n => n.official) : filteredNews)

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
    const inner = <NewsCardContent news={news} />
    const cardStyle = { background: '#fff', border: '1px solid #e8e8ed' }

    if (newsUrl(news)) {
      return (
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl overflow-hidden no-underline block card-hover h-full"
          style={cardStyle}
        >
          {inner}
        </a>
      )
    }
    return (
      <div className="group rounded-2xl overflow-hidden h-full" style={cardStyle}>
        {inner}
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
      <div className="p-4 sm:p-5 flex flex-col h-full">
        <p className="text-[12px] font-medium m-0 mb-1.5" style={{ color: '#86868b' }}>
          {news.category || '资讯'} · {news.source}
        </p>
        {/* 标题/摘要均锁 2 行并预留 2 行高度，日期行贴底，保证同行卡片等高 */}
        <h3
          className="font-semibold text-[16px] leading-snug mb-2 line-clamp-2 m-0 transition-colors group-hover:text-[#0066cc]"
          style={{ color: '#1d1d1f', minHeight: '2.75em' }}
        >
          {news.title}
        </h3>
        {news.summary && news.summary !== news.title && (
          <p
            className="text-[14px] leading-relaxed line-clamp-2 mb-3 m-0"
            style={{ color: '#6e6e73', minHeight: '3.25em' }}
          >
            {news.summary}
          </p>
        )}
        <p className="text-[13px] m-0 mt-auto" style={{ color: '#86868b' }}>
          {(news.time || news.date || '').slice(0, 10)}
        </p>
      </div>
    </>
  )

  function newsUrl(n) {
    return n.url && n.url !== '#' && !n.url.startsWith('/')
  }

  // 资讯页（无 limit）双列拉宽行长至 ~33 字；首页摘要区保持三列紧凑
  const gridCls = limit
    ? 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3'
    : 'grid gap-3 sm:grid-cols-2'

  const renderCards = (items) => (
    <AnimatePresence mode="popLayout" initial={false}>
      {items.map((news, idx) => (
        <motion.div
          key={news.id}
          layout
          className="h-full"
          variants={cardMotion}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.35,
            ease: EASE_OUT_EXPO,
            delay: Math.min(idx, 8) * 0.03,
            layout: { duration: 0.35, ease: EASE_OUT_EXPO },
          }}
        >
          <NewsCard news={news} />
        </motion.div>
      ))}
    </AnimatePresence>
  )

  return (
    <div>
      {!limit && (
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="inline-flex flex-wrap gap-0 p-1 rounded-full relative" style={{ background: '#f5f5f7' }}>
            {categories.map(cat => {
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="relative px-4 py-1.5 rounded-full text-[13px] sm:text-[14px] font-medium whitespace-nowrap cursor-pointer"
                  style={{
                    color: active ? '#1d1d1f' : '#6e6e73',
                    background: 'transparent',
                    border: 'none',
                    transition: 'color 150ms ease',
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="news-seg-thumb"
                      className="absolute inset-0 rounded-full"
                      style={{ background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }}
                      transition={SPRING_SNAP}
                    />
                  )}
                  <span className="relative">{cat}</span>
                </button>
              )
            })}
          </div>

          {/* 只看官方（工作室/官方账号） */}
          <label
            className="inline-flex items-center gap-2 m-0 cursor-pointer"
            style={{ fontSize: 13, color: '#6e6e73' }}
          >
            <span className="whitespace-nowrap">只看官方</span>
            <input
              type="checkbox"
              checked={officialOnly}
              onChange={e => setOfficialOnly(e.target.checked)}
              style={{ display: 'none' }}
            />
            <motion.span
              style={{ width: 36, height: 21, borderRadius: 980, position: 'relative', flexShrink: 0, display: 'inline-block' }}
              animate={{ backgroundColor: officialOnly ? '#0071e3' : '#e8e8ed' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <motion.span
                style={{
                  position: 'absolute', top: 2, width: 17, height: 17, borderRadius: '50%',
                  background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
                animate={{ x: officialOnly ? 17 : 0 }}
                transition={SPRING_SOFT}
              />
            </motion.span>
          </label>
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.div
            key="skeleton"
            className={gridCls}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {[1, 2, 3].map(i => <SkeletonCard key={i} hasImage={false} lines={2} />)}
          </motion.div>
        ) : displayNews.length === 0 ? (
          <motion.div
            key="empty"
            className="py-16 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT_EXPO } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <p className="font-semibold text-[17px] mb-1.5 m-0" style={{ color: '#1d1d1f' }}>暂无相关资讯</p>
            <p className="text-[14px] m-0" style={{ color: '#86868b' }}>资讯来自工作室微博与百度资讯，更新后自动展示</p>
          </motion.div>
        ) : limit ? (
          <motion.div key="limited" className={gridCls} {...gridPresence}>
            {renderCards(displayNews)}
          </motion.div>
        ) : groupedByMonth ? (
          <motion.div key="grouped" className="space-y-10" {...gridPresence}>
            {groupedByMonth.map((group) => (
              <section key={group.key}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-[21px] font-semibold m-0" style={{ letterSpacing: '-0.01em', color: '#1d1d1f' }}>
                    {group.year}年{monthNames[group.month - 1]}
                  </h2>
                  <span className="text-[14px]" style={{ color: '#86868b' }}>{group.items.length} 条</span>
                  <div className="flex-1 h-px" style={{ background: '#d2d2d7' }} />
                </div>
                <div className={gridCls}>
                  {renderCards(group.items)}
                </div>
              </section>
            ))}
          </motion.div>
        ) : (
          <motion.div key="flat" className={gridCls} {...gridPresence}>
            {renderCards(displayNews)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 外层容器入场（首次加载/布局形态切换）
const gridPresence = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}
