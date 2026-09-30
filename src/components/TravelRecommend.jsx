import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchSchedule } from '../api/dataApi'
import { CITIES } from '../data/cities'
import { EASE_OUT_EXPO } from '../lib/motion'
import { normalizeCity, buildCtripFlightUrl, buildTrain12306Url, eventKey } from '../lib/travel-links'

const typeLabel = {
  filming: '影视',
  variety: '综艺',
  business: '商务',
  fanmeeting: '演出',
}

function StepHeader({ no, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
      <span className="w-6 h-6 rounded-full text-[13px] font-semibold flex items-center justify-center"
        style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>{no}</span>
      <h3 className="text-[17px] font-semibold m-0" style={{ letterSpacing: '-0.01em', color: 'var(--color-text)' }}>{title}</h3>
    </div>
  )
}

export default function TravelRecommend({ initialEventId = null }) {
  const [searchParams] = useSearchParams()
  // URL 参数优先；TravelPage 也会把 eventId 作为 initialEventId 传下来，两者取其一即可
  const eventId = searchParams.get('eventId') || initialEventId
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [fromCity, setFromCity] = useState('北京')

  useEffect(() => {
    let cancelled = false
    async function loadData() {
      try {
        const result = await fetchSchedule()
        if (!cancelled) {
          // schedule.json 无 location 字段（曾映射 s.location → venue 恒为 undefined）；
          // 目的地只认 city，且「待定」归一为 null
          const activityEvents = (result.data || [])
            .filter(s => s.type === 'fanmeeting' || s.type === 'business')
            .map(s => ({ ...s, destCity: normalizeCity(s.city) }))
          setEvents(activityEvents)
          setLoading(false)
        }
      } catch {
        if (!cancelled) { setEvents([]); setLoading(false) }
      }
    }
    loadData()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (eventId && events.length > 0) {
      // schedule.json 无 id 字段，早期用 e.id 匹配恒为 -1；改用 postId
      const idx = events.findIndex(e => eventKey(e) === String(eventId))
      if (idx >= 0) setSelectedEvent(idx) // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [eventId, events])

  const activeEvent = selectedEvent !== null ? events[selectedEvent] : null
  const destCity = activeEvent ? activeEvent.destCity : null
  const isLocal = Boolean(activeEvent && destCity && fromCity === destCity)
  const flightUrl = activeEvent ? buildCtripFlightUrl(fromCity, destCity, activeEvent.date) : null
  const trainUrl = activeEvent ? buildTrain12306Url(fromCity, destCity, activeEvent.date) : null

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="rounded-2xl p-5" style={{ border: '1px solid var(--color-surface-deep)' }}>
            <div className="h-4 rounded skeleton-shimmer mb-3" style={{ width: '33%' }} />
            <div className="h-3 rounded skeleton-shimmer" style={{ width: '50%' }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div layout className="space-y-4 sm:space-y-5" transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}>
      {/* 第一步：选择活动 */}
      <div className="rounded-2xl p-4 sm:p-5" style={{ background: 'var(--color-bg)', border: '1px solid var(--color-hairline)' }}>
        <StepHeader no={1} title="选择你想参加的活动" />
        {events.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-semibold text-[16px] m-0 mb-1" style={{ color: 'var(--color-text)' }}>暂无活动数据</p>
            <p className="text-[14px] m-0" style={{ color: 'var(--color-text-muted)' }}>活动信息来自工作室微博，发布后自动更新</p>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {events.map((event, i) => {
              const isActive = selectedEvent === i
              return (
                <button key={eventKey(event) || i} onClick={() => setSelectedEvent(isActive ? null : i)}
                  className="p-4 rounded-xl text-left transition-all cursor-pointer"
                  style={{
                    background: isActive ? '#f5f9ff' : 'var(--color-bg)',
                    border: '1px solid ' + (isActive ? 'var(--color-btn)' : 'var(--color-surface-deep)'),
                  }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[12px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}>
                      {typeLabel[event.type] || '活动'}
                    </span>
                    <span className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>{event.date}</span>
                  </div>
                  <div className="font-semibold text-[15px] mb-0.5" style={{ color: 'var(--color-text)' }}>{event.title}</div>
                  <div className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>{event.destCity || '目的地待官方公布'}</div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 第二步：出发城市 */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.15, ease: 'easeOut' } }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            className="rounded-2xl p-4 sm:p-5"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-hairline)' }}
          >
            <StepHeader no={2} title="选择你的出发城市" />
            <p className="text-[14px] mb-3 m-0" style={{ color: 'var(--color-text-secondary)' }}>
              目的地：<span className="font-medium" style={{ color: 'var(--color-text)' }}>{destCity || '待官方公布'}</span>
            </p>
            <select value={fromCity} onChange={e => setFromCity(e.target.value)}
              className="w-full sm:w-56 px-4 py-2.5 rounded-xl text-[15px] cursor-pointer"
              style={{ border: '1px solid var(--color-hairline)', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 第三步：出行方案 */}
      <AnimatePresence>
        {activeEvent && !isLocal && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.15, ease: 'easeOut' } }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-hairline)' }}
          >
            <div className="p-4 sm:p-5" style={{ borderBottom: '1px solid var(--color-surface-deep)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[16px] sm:text-[18px] m-0" style={{ letterSpacing: '-0.01em', color: 'var(--color-text)' }}>
                    {fromCity} → {destCity || '待定'}
                  </h3>
                  <p className="text-[13px] sm:text-[14px] mt-0.5 m-0" style={{ color: 'var(--color-text-muted)' }}>{activeEvent.title}</p>
                </div>
                <div className="text-[14px] font-medium" style={{ color: 'var(--color-link)' }}>{activeEvent.date}</div>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <h4 className="font-semibold text-[14px] sm:text-[15px] mb-2 sm:mb-3 m-0" style={{ color: 'var(--color-text)' }}>出行方案</h4>
              {flightUrl && trainUrl ? (
                <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
                  <a href={flightUrl}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl no-underline group transition-colors"
                    style={{ background: 'var(--color-surface)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-bg)' }}>
                      <svg className="w-5 h-5" style={{ color: 'var(--color-text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-medium transition-colors group-hover:text-[var(--color-link)]" style={{ color: 'var(--color-text)' }}>
                        携程 · 查看航班
                      </div>
                      <div className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>{activeEvent.date} 直达/中转航班</div>
                    </div>
                    <span className="chevron text-[var(--color-link)]">›</span>
                  </a>
                  <a href={trainUrl}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl no-underline group transition-colors"
                    style={{ background: 'var(--color-surface)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-bg)' }}>
                      <svg className="w-5 h-5" style={{ color: 'var(--color-text)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-4 4v3m-6 0h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-medium transition-colors group-hover:text-[var(--color-link)]" style={{ color: 'var(--color-text)' }}>
                        12306 · 查看车次
                      </div>
                      <div className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>{activeEvent.date} 高铁/动车</div>
                    </div>
                    <span className="chevron text-[var(--color-link)]">›</span>
                  </a>
                </div>
              ) : (
                // 目的地未知时不产出购票链接（早期版本会生成 oneway-北京-待定 这类死链）
                <div className="py-8 text-center" style={{ background: 'var(--color-surface)', borderRadius: 12 }}>
                  <p className="font-medium text-[15px] m-0 mb-1" style={{ color: 'var(--color-text)' }}>活动目的地尚未公布</p>
                  <p className="text-[13px] m-0" style={{ color: 'var(--color-text-muted)' }}>
                    官方微博暂未写明举办城市，公布后可一键查询机票与高铁
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 本地活动提示 */}
      <AnimatePresence>
        {isLocal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.15, ease: 'easeOut' } }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl py-12 text-center"
            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-hairline)' }}
          >
            <p className="font-semibold text-[16px] m-0" style={{ color: 'var(--color-text)' }}>活动就在你的城市</p>
            <p className="text-[14px] mt-1 m-0" style={{ color: 'var(--color-text-muted)' }}>无需出行，直接去现场就行</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
