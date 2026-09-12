import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchSchedule } from '../api/dataApi'

const CITIES = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '南京', '武汉',
  '重庆', '西安', '长沙', '天津', '苏州', '青岛', '大连', '郑州',
  '昆明', '厦门', '福州', '合肥',
]

const stationCodes = {
  '北京': 'BJP', '上海': 'SHH', '广州': 'GZQ', '深圳': 'SZQ',
  '成都': 'CDW', '杭州': 'HZH', '南京': 'NJH', '武汉': 'WHN',
  '重庆': 'CQW', '西安': 'XAY', '长沙': 'CSQ', '天津': 'TJP',
  '苏州': 'SZH', '青岛': 'QDK', '大连': 'DLT', '郑州': 'ZZF',
  '昆明': 'KMM', '厦门': 'XMS', '福州': 'FZS', '合肥': 'HFH',
}

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
        style={{ background: '#f5f5f7', color: '#1d1d1f' }}>{no}</span>
      <h3 className="text-[17px] font-semibold m-0" style={{ letterSpacing: '-0.01em', color: '#1d1d1f' }}>{title}</h3>
    </div>
  )
}

export default function TravelRecommend() {
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId')
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
          const activityEvents = (result.data || [])
            .filter(s => s.type === 'fanmeeting' || s.type === 'business')
            .map(s => ({ ...s, name: s.title, venue: s.location }))
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
      const idx = events.findIndex(e => e.id === Number(eventId))
      if (idx >= 0) setSelectedEvent(idx) // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [eventId, events])

  const activeEvent = selectedEvent !== null ? events[selectedEvent] : null

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="rounded-2xl p-5" style={{ border: '1px solid #e8e8ed' }}>
            <div className="h-4 rounded skeleton-shimmer mb-3" style={{ width: '33%' }} />
            <div className="h-3 rounded skeleton-shimmer" style={{ width: '50%' }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 第一步：选择活动 */}
      <div className="rounded-2xl p-4 sm:p-5" style={{ background: '#fff', border: '1px solid #d2d2d7' }}>
        <StepHeader no={1} title="选择你想参加的活动" />
        {events.length === 0 ? (
          <div className="py-10 text-center">
            <p className="font-semibold text-[16px] m-0 mb-1" style={{ color: '#1d1d1f' }}>暂无活动数据</p>
            <p className="text-[14px] m-0" style={{ color: '#86868b' }}>活动信息来自工作室微博，发布后自动更新</p>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {events.map((event, i) => {
              const isActive = selectedEvent === i
              return (
                <button key={event.id} onClick={() => setSelectedEvent(isActive ? null : i)}
                  className="p-4 rounded-xl text-left transition-all cursor-pointer"
                  style={{
                    background: isActive ? '#f5f9ff' : '#ffffff',
                    border: '1px solid ' + (isActive ? '#0071e3' : '#e8e8ed'),
                  }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[12px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: '#f5f5f7', color: '#6e6e73' }}>
                      {typeLabel[event.type] || '活动'}
                    </span>
                    <span className="text-[13px]" style={{ color: '#86868b' }}>{event.date}</span>
                  </div>
                  <div className="font-semibold text-[15px] mb-0.5" style={{ color: '#1d1d1f' }}>{event.title}</div>
                  <div className="text-[13px]" style={{ color: '#86868b' }}>{event.location || event.city}</div>
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
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="rounded-2xl p-4 sm:p-5"
            style={{ background: '#fff', border: '1px solid #d2d2d7' }}
          >
            <StepHeader no={2} title="选择你的出发城市" />
            <p className="text-[14px] mb-3 m-0" style={{ color: '#6e6e73' }}>
              目的地：<span className="font-medium" style={{ color: '#1d1d1f' }}>{activeEvent.city || activeEvent.location}</span>
            </p>
            <select value={fromCity} onChange={e => setFromCity(e.target.value)}
              className="w-full sm:w-56 px-4 py-2.5 rounded-xl text-[15px] cursor-pointer"
              style={{ border: '1px solid #d2d2d7', background: '#fff', color: '#1d1d1f' }}>
              {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 第三步：出行方案 */}
      <AnimatePresence>
        {activeEvent && fromCity !== (activeEvent.city || activeEvent.location) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="rounded-2xl overflow-hidden"
            style={{ background: '#fff', border: '1px solid #d2d2d7' }}
          >
            <div className="p-4 sm:p-5" style={{ borderBottom: '1px solid #e8e8ed' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[16px] sm:text-[18px] m-0" style={{ letterSpacing: '-0.01em', color: '#1d1d1f' }}>
                    {fromCity} → {activeEvent.city || activeEvent.location}
                  </h3>
                  <p className="text-[13px] sm:text-[14px] mt-0.5 m-0" style={{ color: '#86868b' }}>{activeEvent.title}</p>
                </div>
                <div className="text-[14px] font-medium" style={{ color: '#0066cc' }}>{activeEvent.date}</div>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <h4 className="font-semibold text-[14px] sm:text-[15px] mb-2 sm:mb-3 m-0" style={{ color: '#1d1d1f' }}>出行方案</h4>
              <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
                <a href={`https://flights.ctrip.com/online/list/oneway-${fromCity.substring(0,2)}-${(activeEvent.city || activeEvent.location).substring(0,2)}?depdate=${activeEvent.date}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl no-underline group transition-colors"
                  style={{ background: '#f5f5f7' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#ffffff' }}>
                    <svg className="w-5 h-5" style={{ color: '#1d1d1f' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-medium transition-colors group-hover:text-[#0066cc]" style={{ color: '#1d1d1f' }}>
                      携程 · 查看航班
                    </div>
                    <div className="text-[13px]" style={{ color: '#86868b' }}>{activeEvent.date} 直达/中转航班</div>
                  </div>
                  <span className="chevron text-[#0066cc]">›</span>
                </a>
                <a href={`https://kyfw.12306.cn/otn/leftTicket/init?leftTicketDTO.train_date=${activeEvent.date}&leftTicketDTO.from_station=${stationCodes[fromCity] || ''}&leftTicketDTO.to_station=${stationCodes[activeEvent.city] || ''}&purpose_codes=ADULT`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl no-underline group transition-colors"
                  style={{ background: '#f5f5f7' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#ffffff' }}>
                    <svg className="w-5 h-5" style={{ color: '#1d1d1f' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-4 4v3m-6 0h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-medium transition-colors group-hover:text-[#0066cc]" style={{ color: '#1d1d1f' }}>
                      12306 · 查看车次
                    </div>
                    <div className="text-[13px]" style={{ color: '#86868b' }}>{activeEvent.date} 高铁/动车</div>
                  </div>
                  <span className="chevron text-[#0066cc]">›</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 本地活动提示 */}
      <AnimatePresence>
        {activeEvent && fromCity === (activeEvent.city || activeEvent.location) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl py-12 text-center"
            style={{ background: '#fff', border: '1px solid #d2d2d7' }}
          >
            <p className="font-semibold text-[16px] m-0" style={{ color: '#1d1d1f' }}>活动就在你的城市</p>
            <p className="text-[14px] mt-1 m-0" style={{ color: '#86868b' }}>无需出行，直接去现场就行</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
