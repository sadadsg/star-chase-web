import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion'
import NewsFeed from '../components/NewsFeed'
import EventCard from '../components/EventCard'
import CityPicker from '../components/CityPicker'
import ArtistIntroSection from '../components/ArtistIntroSection'
import { AnimateOnScroll } from '../components/ui'
import { useLocalStorage } from '../hooks'
import { fetchSchedule } from '../api/dataApi'
import { EASE_OUT_EXPO, staggerChild } from '../lib/motion'

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
/* 入场编排：eyebrow → 大标题(模糊聚焦) → 副题 → CTA，80ms 间隔 */
/* 滚动叙事：标题块随滚动轻微上移并淡出（仅桌面、非 reduced-motion） */
function Hero() {
  const reduced = useReducedMotion()
  const isDesktop = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches,
    []
  )
  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 480], [0, -24])
  const parallaxOpacity = useTransform(scrollY, [0, 480], [1, 0.25])
  const applyParallax = !reduced && isDesktop

  const container = {
    animate: { transition: { staggerChildren: 0.08 } },
  }
  const item = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
  }
  const titleItem = {
    initial: { opacity: 0, y: 14, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: EASE_OUT_EXPO } },
  }

  return (
    <motion.section
      className="text-center"
      style={{ padding: '72px 0 64px', ...(applyParallax ? { y: parallaxY, opacity: parallaxOpacity } : {}) }}
    >
      <div className="container-apple">
        <motion.div
          variants={reduced ? undefined : container}
          initial={reduced ? false : 'initial'}
          animate="animate"
        >
          <motion.p className="text-[15px] sm:text-[17px] font-medium m-0 mb-3" style={{ color: '#b64400' }} variants={item}>
            任嘉伦 · 行程助手
          </motion.p>
          <motion.h1 className="hero-title m-0" variants={reduced ? undefined : titleItem}>
            嘉期如梦
          </motion.h1>
          <motion.p className="text-[17px] sm:text-[21px] m-0 mt-4" style={{ color: '#6e6e73' }} variants={item}>
            行程、资讯、活动与出行，一站掌握。
          </motion.p>
          <motion.div className="flex items-center justify-center gap-8 mt-6" variants={item}>
            <Link to="/schedule" className="link-apple text-[15px] sm:text-[17px]">
              查看近期行程 <span className="chevron">›</span>
            </Link>
            <Link to="/news" className="link-apple text-[15px] sm:text-[17px]">
              最新资讯 <span className="chevron">›</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

/* ===== 分段三：白底 · 近期行程（分组行 + 就近匹配 + 行级 stagger） ===== */
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
    <section style={{ background: '#ffffff', padding: '64px 0' }}>
      <div className="container-apple">
        <AnimateOnScroll y={10} duration={0.45}>
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-3">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="section-title m-0">近期行程</h2>
              <AnimatePresence mode="popLayout" initial={false}>
                {myCity && matchedCount > 0 && (
                  <motion.span
                    key={matchedCount}
                    className="text-[13px] font-medium inline-block"
                    style={{ color: '#0066cc' }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE_OUT_EXPO } }}
                    exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
                  >
                    {matchedCount} 条在你所在城市
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-5">
              <CityPicker />
              <Link to="/schedule" className="link-apple text-[14px]">
                查看全部 <span className="chevron">›</span>
              </Link>
            </div>
          </div>
          {/* Apple 分段签名：发丝线从左划出 */}
          <motion.div
            className="h-px mb-6 origin-left"
            style={{ background: '#d2d2d7' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          />
        </AnimateOnScroll>

        <AnimatePresence mode="wait" initial={false}>
          {loading ? (
            <motion.div
              key="skeleton"
              className="rounded-2xl overflow-hidden"
              style={{ background: '#fff' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {[1, 2, 3].map(i => (
                <div key={i} className="px-5 py-4" style={{ borderBottom: i < 3 ? '1px solid #f0f0f2' : 'none' }}>
                  <div className="h-3.5 rounded skeleton-shimmer mb-2" style={{ width: '38%' }} />
                  <div className="h-4 rounded skeleton-shimmer" style={{ width: '72%' }} />
                </div>
              ))}
            </motion.div>
          ) : schedule.length === 0 ? (
            <motion.div
              key="empty"
              className="rounded-2xl text-center py-14"
              style={{ background: '#fff' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT_EXPO } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <p className="text-[17px] font-semibold m-0" style={{ color: '#1d1d1f' }}>暂无近期行程</p>
              <p className="text-[13px] m-0 mt-1.5" style={{ color: '#86868b' }}>
                行程数据来自工作室官方微博，发布后自动更新
              </p>
            </motion.div>
          ) : (
            <AnimateOnScroll key="list" stagger staggerInterval={0.05} y={0} duration={0.4}>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#fff' }}>
                {schedule.map((s, idx) => {
                  const isMine = myCity && s.city === myCity
                  return (
                    <motion.div key={s.id} variants={staggerChild}>
                      <Link
                        to="/schedule"
                        className="flex items-center gap-4 px-5 py-4 no-underline"
                        style={{
                          borderBottom: idx < schedule.length - 1 ? '1px solid #f0f0f2' : 'none',
                          background: isMine ? 'rgba(0,113,227,0.05)' : 'transparent',
                          transition: 'background-color 200ms ease',
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
                    </motion.div>
                  )
                })}
              </div>
            </AnimateOnScroll>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

/* ===== 分段二：浅灰底 · 最新资讯 ===== */
function LatestNews() {
  return (
    <section style={{ background: '#f5f5f7', padding: '64px 0' }}>
      <div className="container-apple">
        <AnimateOnScroll y={10} duration={0.45}>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="section-title m-0">最新资讯</h2>
            <Link to="/news" className="link-apple text-[14px]">
              查看全部 <span className="chevron">›</span>
            </Link>
          </div>
          <motion.div
            className="h-px mb-6 origin-left"
            style={{ background: '#d2d2d7' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          />
        </AnimateOnScroll>
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
      <LatestNews />
      <UpcomingSchedule />
      <EventsAndTravel />
      <ArtistIntroSection />
    </div>
  )
}
