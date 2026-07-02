import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroBanner from '../components/HeroBanner'
import NewsFeed from '../components/NewsFeed'
import EventCard from '../components/EventCard'
import { AnimateOnScroll } from '../components/ui'
import { fetchSchedule } from '../api/dataApi'

const typeColor = {
  filming: '#7C3AED',
  variety: '#059669',
  business: '#D97706',
  fanmeeting: '#DB2777',
}

function ArrowIcon() {
  return (
    <svg className="btn-pill-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6.3333 3.66665H12.3333V9.66665" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.848 12.152L12.3333 3.66665" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function HomePage() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function loadData() {
      try {
        const result = await fetchSchedule()
        if (!cancelled) {
          const now = new Date()
          const upcoming = (result.data || [])
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
    loadData()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="space-y-5 sm:space-y-6">
      <HeroBanner />

      {/* 近期行程 */}
      <AnimateOnScroll delay={0.05}>
        <section className="glass-warm rounded-2xl p-5 sm:p-7">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-5 rounded-full" style={{ background: '#A78BFA' }} />
            <h2 className="text-[17px] sm:text-[19px] font-bold font-serif-display" style={{ color: '#1C1917' }}>
              近期行程
            </h2>
          </div>
          <Link to="/schedule" className="btn-pill">
            查看全部
            <ArrowIcon />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-xl p-4 skeleton-shimmer" style={{ background: 'rgba(139,92,246,0.04)' }}>
                <div className="h-3 rounded-lg mb-2" style={{ background: 'rgba(139,92,246,0.06)', width: '40%' }} />
                <div className="h-4 rounded-lg mb-1.5" style={{ background: 'rgba(139,92,246,0.08)', width: '80%' }} />
                <div className="h-3 rounded-lg" style={{ background: 'rgba(139,92,246,0.05)', width: '60%' }} />
              </div>
            ))}
          </div>
        ) : schedule.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[14px]" style={{ color: '#78716C' }}>暂无近期行程</p>
            <p className="text-[12px] mt-1" style={{ color: '#A8A29E' }}>数据来源于实时热搜，无相关内容时不显示</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {schedule.map((s, idx) => (
              <AnimateOnScroll key={s.id} delay={idx * 0.08} y={12}>
                <Link to="/schedule" className="block rounded-xl p-4 transition-all no-underline card-hover"
                  style={{ background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.3)' }}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: typeColor[s.type] || '#7C3AED' }} />
                  <span className="text-[11px] font-medium" style={{ color: typeColor[s.type] || '#7C3AED' }}>{s.typeName}</span>
                </div>
                <h3 className="text-[14px] sm:text-[15px] font-semibold truncate mb-1.5" style={{ color: '#1C1917' }}>{s.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[12px]" style={{ color: '#A8A29E' }}>{new Date(s.date).getMonth() + 1}月{new Date(s.date).getDate()}日</span>
                  <span className="text-[12px]" style={{ color: '#A8A29E' }}>{s.city}</span>
                </div>
              </Link>
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </section>
      </AnimateOnScroll>

      {/* 最新资讯 */}
      <AnimateOnScroll delay={0.1}>
        <section className="glass-warm rounded-2xl p-5 sm:p-7">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-5 rounded-full" style={{ background: '#60A5FA' }} />
            <h2 className="text-[17px] sm:text-[19px] font-bold font-serif-display" style={{ color: '#1C1917' }}>
              最新资讯
            </h2>
          </div>
          <Link to="/news" className="btn-pill">
            查看全部
            <ArrowIcon />
          </Link>
        </div>
        <NewsFeed limit={3} />
      </section>
      </AnimateOnScroll>

      {/* 底部两列：活动门票 + 出行推荐 */}
      <AnimateOnScroll delay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* 活动门票 */}
        <section className="glass-warm rounded-2xl p-5 sm:p-7">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-1 h-5 rounded-full" style={{ background: '#F472B6' }} />
              <h2 className="text-[17px] sm:text-[19px] font-bold font-serif-display" style={{ color: '#1C1917' }}>
                活动门票
              </h2>
            </div>
            <Link to="/events" className="btn-pill">
              查看全部
              <ArrowIcon />
            </Link>
          </div>
          <EventCard limit={2} />
        </section>

        {/* 出行推荐 */}
        <section className="glass-warm rounded-2xl p-5 sm:p-7 flex flex-col justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(250,247,242,0.5), rgba(237,233,254,0.3))' }}>
          <div>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(139,92,246,0.1)' }}>
              <svg className="w-5 h-5" style={{ color: '#7C3AED' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h2 className="text-[17px] sm:text-[19px] font-bold font-serif-display mb-1.5" style={{ color: '#1C1917' }}>出行推荐</h2>
            <p className="text-[13px] sm:text-[14px] leading-relaxed" style={{ color: '#78716C' }}>
              自动匹配去爱豆活动的机票和高铁方案
            </p>
          </div>
          <Link to="/travel" className="btn-pill-primary btn-pill mt-5 self-start">
            查看出行方案
            <ArrowIcon />
          </Link>
        </section>
      </div>
      </AnimateOnScroll>
    </div>
  )
}
