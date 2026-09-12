import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import NewsFeed from '../components/NewsFeed'
import EventCard from '../components/EventCard'
import CityPicker from '../components/CityPicker'
import { AnimateOnScroll } from '../components/ui'
import { useLocalStorage } from '../hooks'
import { fetchSchedule } from '../api/dataApi'

const typeColorVar = {
  filming: 'var(--color-type-filming)',
  variety: 'var(--color-type-variety)',
  business: 'var(--color-type-business)',
  fanmeeting: 'var(--color-type-fanmeeting)',
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

/* ===== 分段一：白底特大标题 hero ===== */
function Hero() {
  return (
    <section className="text-center" style={{ padding: '72px 0 64px' }}>
      <div className="container-apple">
        <p className="text-[15px] sm:text-[17px] font-medium m-0 mb-3" style={{ color: '#b64400' }}>
          任嘉伦 · 行程助手
        </p>
        <h1 className="hero-title m-0">嘉期如梦</h1>
        <p className="text-[17px] sm:text-[21px] m-0 mt-4" style={{ color: '#6e6e73' }}>
          行程、资讯、活动与出行，一站掌握。
        </p>
        <div className="flex items-center justify-center gap-8 mt-6">
          <Link to="/schedule" className="link-apple text-[15px] sm:text-[17px]">
            查看近期行程 <span className="chevron">›</span>
          </Link>
          <Link to="/news" className="link-apple text-[15px] sm:text-[17px]">
            最新资讯 <span className="chevron">›</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ===== 分段二：浅灰底 · 近期行程（Apple 分组行 + 就近匹配） ===== */
function UpcomingSchedule() {
  const [myCity] = useLocalStorage('my-city')
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

  const matchedCount = myCity ? schedule.filter(s => s.city === myCity).length : 0

  return (
    <section style={{ background: '#f5f5f7', padding: '64px 0' }}>
      <div className="container-apple">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-2">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="section-title m-0">近期行程</h2>
            {myCity && matchedCount > 0 && (
              <span className="text-[13px] font-medium" style={{ color: '#0066cc' }}>
                {matchedCount} 条在你所在城市
              </span>
            )}
          </div>
          <div className="flex items-center gap-5">
            <CityPicker />
            <Link to="/schedule" className="link-apple text-[14px]">
              查看全部 <span className="chevron">›</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#fff' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="px-5 py-4" style={{ borderBottom: i < 3 ? '1px solid #f0f0f2' : 'none' }}>
                <div className="h-3.5 rounded skeleton-shimmer mb-2" style={{ width: '38%' }} />
                <div className="h-4 rounded skeleton-shimmer" style={{ width: '72%' }} />
              </div>
            ))}
          </div>
        ) : schedule.length === 0 ? (
          <div className="rounded-2xl text-center py-14" style={{ background: '#fff' }}>
            <p className="text-[17px] font-semibold m-0" style={{ color: '#1d1d1f' }}>暂无近期行程</p>
            <p className="text-[13px] m-0 mt-1.5" style={{ color: '#86868b' }}>
              行程数据来自工作室官方微博，发布后自动更新
            </p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: '#fff' }}>
            {schedule.map((s, idx) => {
              const isMine = myCity && s.city === myCity
              return (
                <Link
                  key={s.id}
                  to="/schedule"
                  className="flex items-center gap-4 px-5 py-4 no-underline"
                  style={{
                    borderBottom: idx < schedule.length - 1 ? '1px solid #f0f0f2' : 'none',
                    background: isMine ? 'rgba(0,113,227,0.05)' : 'transparent',
                  }}
                >
                  <span className="text-[15px] font-semibold tabular-nums flex-shrink-0" style={{ color: '#1d1d1f', width: 48 }}>
                    {formatDate(s.date)}
                  </span>
                  <span className="flex-shrink-0" style={{ fontSize: 12, fontWeight: 500, padding: '2px 10px', borderRadius: 980, background: 'rgba(0,0,0,0.04)', color: typeColorVar[s.type] || 'var(--color-type-filming)' }}>
                    {s.typeName}
                  </span>
                  <span className="flex-1 min-w-0 text-[15px] font-medium truncate" style={{ color: '#1d1d1f' }}>
                    {s.title}
                  </span>
                  {isMine && (
                    <span className="flex-shrink-0" style={{ fontSize: 11, fontWeight: 500, color: '#0066cc', background: 'rgba(0,113,227,0.08)', padding: '3px 9px', borderRadius: 980 }}>
                      就在你的城市
                    </span>
                  )}
                  <span className="text-[13px] flex-shrink-0 hidden sm:block" style={{ color: '#86868b' }}>{s.city}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

/* ===== 分段三：白底 · 最新资讯 ===== */
function LatestNews() {
  return (
    <section style={{ padding: '64px 0' }}>
      <div className="container-apple">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="section-title m-0">最新资讯</h2>
          <Link to="/news" className="link-apple text-[14px]">
            查看全部 <span className="chevron">›</span>
          </Link>
        </div>
        <NewsFeed limit={3} />
      </div>
    </section>
  )
}

/* ===== 分段四：浅灰底 · 活动门票 + 出行推荐 ===== */
function EventsAndTravel() {
  return (
    <section style={{ background: '#f5f5f7', padding: '64px 0 80px' }}>
      <div className="container-apple">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div className="rounded-2xl p-6 sm:p-8" style={{ background: '#fff' }}>
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-[21px] sm:text-[24px] font-semibold m-0" style={{ letterSpacing: '-0.01em' }}>活动门票</h2>
              <Link to="/events" className="link-apple text-[14px]">
                查看全部 <span className="chevron">›</span>
              </Link>
            </div>
            <EventCard limit={2} />
          </div>

          <div className="rounded-2xl p-6 sm:p-8 flex flex-col justify-between" style={{ background: '#fff' }}>
            <div>
              <h2 className="text-[21px] sm:text-[24px] font-semibold m-0 mb-2" style={{ letterSpacing: '-0.01em' }}>出行推荐</h2>
              <p className="text-[15px] leading-relaxed m-0" style={{ color: '#6e6e73' }}>
                选定要参加的活动与出发城市，一键跳转携程航班与 12306 高铁查询。
              </p>
            </div>
            <div className="mt-6">
              <Link to="/travel" className="btn-pill btn-pill-primary">
                查看出行方案
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div>
      <Hero />
      <AnimateOnScroll><UpcomingSchedule /></AnimateOnScroll>
      <AnimateOnScroll><LatestNews /></AnimateOnScroll>
      <AnimateOnScroll><EventsAndTravel /></AnimateOnScroll>
    </div>
  )
}
