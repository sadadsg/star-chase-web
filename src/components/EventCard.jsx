import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EmptyState, SkeletonCard } from './ui'
import { fetchEvents } from '../api/dataApi'
import { EASE_OUT_EXPO, staggerChild } from '../lib/motion'

const CHANNELS = [
  { name: '大麦购票', url: 'https://search.damai.cn/search.html?keyword=%E4%BB%BB%E5%98%89%E4%BC%A6' },
  { name: '秀动搜索', url: 'https://www.showstart.com/search?keyword=%E4%BB%BB%E5%98%89%E4%BC%A6' },
]

export default function EventCard({ limit }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function loadEvents() {
      try {
        const result = await fetchEvents()
        if (!cancelled) {
          const events = (result.data || []).slice(0, limit || 10)
          setEvents(events)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setEvents([])
          setLoading(false)
        }
      }
    }
    loadEvents()
    return () => { cancelled = true }
  }, [limit])

  return (
    <AnimatePresence mode="wait" initial={false}>
      {loading ? (
        <motion.div
          key="skeleton"
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          {[1, 2].map(i => <SkeletonCard key={i} hasImage={false} lines={1} />)}
        </motion.div>
      ) : events.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT_EXPO } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          <EmptyState
            title="暂无活动"
            message="活动信息来自工作室微博，发布后自动更新"
          />
        </motion.div>
      ) : (
        <motion.div
          key="list"
          className="space-y-3"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
        >
          {events.map(event => (
            <motion.div
              key={event.id}
              variants={staggerChild}
              className="rounded-2xl p-4 sm:p-5 card-hover"
              style={{ background: '#fff', border: '1px solid #e8e8ed' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-[15px] sm:text-[16px] m-0 mb-1.5 truncate" style={{ color: '#1d1d1f' }}>
                    {event.name}
                  </h3>
                  <p className="text-[13px] m-0" style={{ color: '#86868b' }}>
                    {event.date} · {event.location || event.city}
                  </p>
                  <div className="flex gap-4 mt-2">
                    {CHANNELS.map(c => (
                      <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer" className="link-apple text-[13px]">
                        {c.name} <span className="chevron">›</span>
                      </a>
                    ))}
                  </div>
                </div>
                {event.newsUrl && event.newsUrl !== '#' ? (
                  <a
                    href={event.newsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-apple text-[14px] flex-shrink-0 whitespace-nowrap"
                  >
                    查看来源 <span className="chevron">›</span>
                  </a>
                ) : (
                  <span className="text-[13px] flex-shrink-0" style={{ color: '#aeaeb2' }}>暂无链接</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
