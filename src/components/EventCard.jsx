import { useState, useEffect } from 'react'
import { EmptyState } from './ui'

const API_BASE = 'http://localhost:3001/api'

const statusStyles = {
  hot: 'bg-[#FBE9F2] text-[#C47A9C]',
  onsale: 'bg-[#EAF6F0] text-[#3D9B74]',
  soon: 'bg-[#EEF2FF] text-[#6366F1]',
  soldout: 'bg-[#F7F9FC] text-[#B0BEC5]',
}

export default function EventCard({ limit }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchEvents() {
      try {
        const res = await fetch(`${API_BASE}/weibo/schedule`)
        if (!res.ok) return
        const json = await res.json()
        
        if (!cancelled) {
          // 从行程数据中筛选活动类
          const activityEvents = (json.data || [])
            .filter(s => s.type === 'fanmeeting' || s.type === 'business')
            .map(s => ({
              ...s,
              name: s.title,
              venue: s.location,
              status: 'onsale',
              statusText: '查看来源',
              cover: `https://picsum.photos/seed/event${s.id}/600/400`,
            }))
            .slice(0, limit || 10)
          
          setEvents(activityEvents)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setEvents([])
          setLoading(false)
        }
      }
    }
    fetchEvents()
    return () => { cancelled = true }
  }, [limit])

  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#EDF0F5] animate-pulse">
            <div className="aspect-video bg-[#F0F3F8]" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-[#F0F3F8] rounded w-3/4" />
              <div className="h-3 bg-[#F0F3F8] rounded w-full" />
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
      {events.map(event => (
        <div key={event.id} className="bg-white rounded-2xl overflow-hidden border border-[#EDF0F5] card-hover">
          <div className="aspect-video relative overflow-hidden">
            <img
              src={event.cover}
              alt={event.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <span className={`absolute top-2.5 right-2.5 px-3 py-1 rounded-md text-[13px] font-medium ${statusStyles[event.status]}`}>
              {event.statusText}
            </span>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-[#2D3748] text-[16px] mb-3">{event.name}</h3>

            <div className="space-y-2.5 text-[14px] text-[#5A6577] mb-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#B0BEC5] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#B0BEC5] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="block w-full bg-[#5B8DEF] hover:bg-[#4A7DE0] text-white text-[14px] font-medium px-4 py-2.5 rounded-lg transition-colors no-underline text-center"
              >
                查看来源
              </a>
            ) : (
              <span className="block w-full bg-[#F7F9FC] text-[#B0BEC5] text-[14px] font-medium px-4 py-2.5 rounded-lg text-center">
                暂无链接
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
