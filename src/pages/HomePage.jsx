import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroBanner from '../components/HeroBanner'
import Sidebar from '../components/Sidebar'
import NewsFeed from '../components/NewsFeed'
import EventCard from '../components/EventCard'

const API_BASE = 'http://localhost:3001/api'

const typeDots = {
  filming: 'bg-[#5B8DEF]',
  variety: 'bg-[#7EC8A8]',
  business: 'bg-[#F5A882]',
  fanmeeting: 'bg-[#E8A0BF]',
}

export default function HomePage() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchSchedule() {
      try {
        const res = await fetch(`${API_BASE}/weibo/schedule`)
        if (!res.ok) return
        const json = await res.json()
        if (!cancelled) {
          const now = new Date()
          const upcoming = (json.data || [])
            .filter(s => new Date(s.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5)
          setSchedule(upcoming)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setSchedule([])
          setLoading(false)
        }
      }
    }
    fetchSchedule()
    return () => { cancelled = true }
  }, [])

  return (
    <div>
      <HeroBanner />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Sidebar />
        </div>

        <div className="lg:col-span-3 order-1 lg:order-2 space-y-7">
          {/* 近期行程 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">近期行程</h2>
              <Link to="/schedule" className="text-[#6366F1] text-[14px] font-medium hover:text-[#4F46E5] no-underline">
                查看全部
              </Link>
            </div>
            
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-[#EDF0F5] animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F0F3F8] rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[#F0F3F8] rounded w-1/3" />
                        <div className="h-3 bg-[#F0F3F8] rounded w-2/3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : schedule.length === 0 ? (
              <div className="bg-white rounded-xl p-8 border border-[#EDF0F5] text-center">
                <svg className="w-10 h-10 mx-auto text-[#D3DAE6] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-[#2D3748] font-semibold text-[15px] mb-1">暂无近期行程</p>
                <p className="text-[#8E99A8] text-[14px]">行程会从新闻中自动提取</p>
              </div>
            ) : (
              <div className="space-y-2">
                {schedule.map(s => (
                  <div key={s.id} className="bg-white rounded-xl p-4 border border-[#EDF0F5] card-hover flex items-center gap-4">
                    <div className="text-center min-w-[52px]">
                      <div className="text-2xl font-bold text-[#6366F1]">
                        {new Date(s.date).getDate()}
                      </div>
                      <div className="text-[13px] text-[#B0BEC5]">
                        {new Date(s.date).getMonth() + 1}月
                      </div>
                    </div>
                    <div className={`w-0.5 h-10 rounded-full ${typeDots[s.type] || 'bg-[#F5A882]'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`w-2 h-2 rounded-full ${typeDots[s.type] || 'bg-[#F5A882]'}`} />
                        <span className="text-[13px] text-[#8E99A8]">{s.typeName}</span>
                      </div>
                      <h3 className="font-bold text-[#1E293B] text-[16px] truncate">{s.title}</h3>
                      <p className="text-[13px] text-[#B0BEC5] mt-0.5">
                        {s.location} · {s.time}
                      </p>
                    </div>
                    {s.newsUrl && s.newsUrl !== '#' && (
                      <a
                        href={s.newsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] font-medium text-[#6366F1] hover:text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] px-3 py-1.5 rounded-lg transition-colors no-underline whitespace-nowrap"
                      >
                        查看来源
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 最新资讯 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">最新资讯</h2>
              <Link to="/news" className="text-[#6366F1] text-[14px] font-medium hover:text-[#4F46E5] no-underline">
                查看全部
              </Link>
            </div>
            <NewsFeed limit={3} />
          </section>

          {/* 活动门票 */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">活动门票</h2>
              <Link to="/events" className="text-[#6366F1] text-[14px] font-medium hover:text-[#4F46E5] no-underline">
                查看全部
              </Link>
            </div>
            <EventCard limit={2} />
          </section>

          {/* 出行推荐 */}
          <section className="gradient-soft rounded-2xl p-6">
            <h2 className="section-title mb-1">出行推荐</h2>
            <p className="text-[#8E99A8] text-[14px] mb-4">
              输入出发城市，自动匹配去爱豆活动的机票和高铁
            </p>
            <Link
              to="/travel"
              className="inline-block bg-[#6366F1] text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#4F46E5] transition no-underline"
            >
              查看出行方案
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
