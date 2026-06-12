import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroBanner from '../components/HeroBanner'
import Sidebar from '../components/Sidebar'
import NewsFeed from '../components/NewsFeed'
import EventCard from '../components/EventCard'
import { API_BASE } from '../config'

const typeColor = {
  filming: '#7C3AED',
  variety: '#059669',
  business: '#D97706',
  fanmeeting: '#DB2777',
}

export default function HomePage() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchSchedule() {
      try {
        const res = await fetch(`${API_BASE}/weibo/schedule`)
        if (!res.ok) throw new Error('API error')
        const json = await res.json()
        if (!cancelled) {
          const now = new Date()
          const upcoming = (json.data || [])
            .filter(s => new Date(s.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 4)
          setSchedule(upcoming)
          setLoading(false)
        }
      } catch {
        if (!cancelled) { setSchedule([]); setLoading(false) }
      }
    }
    fetchSchedule()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="space-y-5">
      <HeroBanner />

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">

        {/* 近期行程 - 大卡片 (2列) */}
        <div className="md:col-span-2 glass rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full" style={{ background: '#A78BFA' }} />
              <h2 className="text-[16px] font-bold" style={{ color: '#1E1B4B' }}>近期行程</h2>
            </div>
            <Link to="/schedule" className="text-[13px] font-medium no-underline" style={{ color: '#7C3AED' }}>
              查看全部 →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-2xl p-3 animate-pulse" style={{ background: 'rgba(139,92,246,0.04)' }}>
                  <div className="h-3 rounded-lg mb-2" style={{ background: 'rgba(139,92,246,0.06)', width: '40%' }} />
                  <div className="h-4 rounded-lg mb-1" style={{ background: 'rgba(139,92,246,0.08)', width: '80%' }} />
                  <div className="h-3 rounded-lg" style={{ background: 'rgba(139,92,246,0.05)', width: '60%' }} />
                </div>
              ))}
            </div>
          ) : schedule.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[14px]" style={{ color: '#6B7280' }}>暂无近期行程</p>
              <p className="text-[12px] mt-1" style={{ color: '#9CA3AF' }}>数据来源于实时热搜，无相关内容时不显示</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {schedule.map(s => (
                <Link key={s.id} to="/schedule" className="block rounded-2xl p-3 transition-all no-underline"
                  style={{ background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: typeColor[s.type] || '#7C3AED' }} />
                    <span className="text-[11px] font-medium" style={{ color: typeColor[s.type] || '#7C3AED' }}>{s.typeName}</span>
                  </div>
                  <h3 className="text-[14px] font-semibold truncate mb-1" style={{ color: '#1E1B4B' }}>{s.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px]" style={{ color: '#9CA3AF' }}>{new Date(s.date).getMonth() + 1}/{new Date(s.date).getDate()}</span>
                    <span className="text-[12px]" style={{ color: '#9CA3AF' }}>{s.city}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 艺人信息 - 侧边栏 */}
        <div className="lg:row-span-2">
          <Sidebar />
        </div>

        {/* 最新资讯 (2列) */}
        <div className="md:col-span-2 glass rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full" style={{ background: '#60A5FA' }} />
              <h2 className="text-[16px] font-bold" style={{ color: '#1E1B4B' }}>最新资讯</h2>
            </div>
            <Link to="/news" className="text-[13px] font-medium no-underline" style={{ color: '#7C3AED' }}>
              查看全部 →
            </Link>
          </div>
          <NewsFeed limit={3} />
        </div>

        {/* 活动门票 */}
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 rounded-full" style={{ background: '#F472B6' }} />
              <h2 className="text-[16px] font-bold" style={{ color: '#1E1B4B' }}>活动门票</h2>
            </div>
            <Link to="/events" className="text-[13px] font-medium no-underline" style={{ color: '#7C3AED' }}>
              查看全部 →
            </Link>
          </div>
          <EventCard limit={2} />
        </div>

        {/* 出行推荐 - CTA 卡片 */}
        <div className="glass rounded-3xl p-5 flex flex-col justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(96,165,250,0.06))' }}>
          <div>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'rgba(139,92,246,0.12)' }}>
              <svg className="w-5 h-5" style={{ color: '#7C3AED' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h2 className="text-[16px] font-bold mb-1" style={{ color: '#1E1B4B' }}>出行推荐</h2>
            <p className="text-[13px] leading-relaxed" style={{ color: '#6B7280' }}>
              自动匹配去爱豆活动的机票和高铁方案
            </p>
          </div>
          <Link to="/travel"
            className="inline-flex items-center justify-center mt-4 text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl no-underline"
            style={{ background: '#7C3AED' }}>
            查看出行方案
          </Link>
        </div>

      </div>
    </div>
  )
}
