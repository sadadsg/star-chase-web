import { useState, useEffect } from 'react'
import { EmptyState } from './ui'
import { fetchEvents } from '../api/dataApi'

const statusStyles = {
  hot: { bg: 'rgba(236,72,153,0.1)', color: '#DB2777' },
  onsale: { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
  soon: { bg: 'rgba(139,92,246,0.1)', color: '#7C3AED' },
  soldout: { bg: 'rgba(107,114,128,0.08)', color: '#9CA3AF' },
}

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
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2].map(i => (
          <div key={i} className="glass rounded-3xl overflow-hidden animate-pulse">
            <div className="aspect-video" style={{ background: 'rgba(139,92,246,0.05)' }} />
            <div className="p-4 space-y-3">
              <div className="h-4 rounded-lg" style={{ background: 'rgba(139,92,246,0.06)', width: '75%' }} />
              <div className="h-3 rounded-lg" style={{ background: 'rgba(139,92,246,0.04)', width: '100%' }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon="🎫"
        title="暂无活动"
        message="当前没有相关活动信息"
      />
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {events.map(event => {
        const ss = statusStyles[event.status] || statusStyles.onsale
        return (
          <div key={event.id} className="glass rounded-3xl overflow-hidden card-hover">
            <div className="aspect-video relative overflow-hidden">
              <img
                src={event.cover}
                alt={event.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute top-2.5 right-2.5 px-3 py-1 rounded-xl text-[13px] font-medium backdrop-blur-sm"
                style={{ background: ss.bg, color: ss.color }}>
                {event.statusText}
              </span>
            </div>

              <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-[15px] sm:text-[16px] mb-2 sm:mb-3" style={{ color: '#1E1B4B' }}>{event.name}</h3>

              <div className="space-y-2.5 text-[14px] mb-3" style={{ color: '#4B5563' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#9CA3AF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#9CA3AF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
              </div>

              {event.newsUrl && event.newsUrl !== '#' ? (
                <a
                  href={event.newsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-white text-[14px] font-medium px-4 py-2.5 rounded-xl transition-colors no-underline text-center"
                  style={{ background: '#7C3AED' }}
                >
                  查看来源
                </a>
              ) : (
                <span className="block w-full text-[14px] font-medium px-4 py-2.5 rounded-xl text-center"
                  style={{ background: 'rgba(107,114,128,0.06)', color: '#9CA3AF' }}>
                  暂无链接
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
