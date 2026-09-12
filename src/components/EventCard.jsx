import { useState, useEffect } from 'react'
import { EmptyState } from './ui'
import { fetchEvents } from '../api/dataApi'

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

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="rounded-2xl p-5" style={{ border: '1px solid #e8e8ed' }}>
            <div className="h-4 rounded skeleton-shimmer mb-2.5" style={{ width: '70%' }} />
            <div className="h-3 rounded skeleton-shimmer" style={{ width: '45%' }} />
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <EmptyState
        title="暂无活动"
        message="活动信息来自工作室微博，发布后自动更新"
      />
    )
  }

  return (
    <div className="space-y-3">
      {events.map(event => (
        <div key={event.id} className="rounded-2xl p-4 sm:p-5 card-hover" style={{ background: '#fff', border: '1px solid #e8e8ed' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-[15px] sm:text-[16px] m-0 mb-1.5 truncate" style={{ color: '#1d1d1f' }}>
                {event.name}
              </h3>
              <p className="text-[13px] m-0" style={{ color: '#86868b' }}>
                {event.date} · {event.location || event.city}
              </p>
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
        </div>
      ))}
    </div>
  )
}
