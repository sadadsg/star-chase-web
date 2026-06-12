import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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

const typeStyle = {
  filming: { color: '#7C3AED', bg: 'rgba(139,92,246,0.1)', label: '影视' },
  variety: { color: '#059669', bg: 'rgba(16,185,129,0.1)', label: '综艺' },
  business: { color: '#D97706', bg: 'rgba(245,158,11,0.1)', label: '商务' },
  fanmeeting: { color: '#DB2777', bg: 'rgba(236,72,153,0.1)', label: '演出' },
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
          <div key={i} className="glass rounded-3xl p-5 animate-pulse">
            <div className="h-6 rounded-lg mb-3" style={{ background: 'rgba(139,92,246,0.06)', width: '33%' }} />
            <div className="h-4 rounded-lg" style={{ background: 'rgba(139,92,246,0.04)', width: '50%' }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* 活动选择 */}
      <div className="glass rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full text-white text-[13px] font-bold flex items-center justify-center" style={{ background: '#7C3AED' }}>1</span>
          <h3 className="text-[16px] font-semibold" style={{ color: '#1E1B4B' }}>选择你想参加的活动</h3>
        </div>
        {events.length === 0 ? (
          <div className="py-10 text-center">
            <svg className="w-12 h-12 mx-auto mb-3" style={{ color: '#D1D5DB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-semibold text-[15px] mb-1" style={{ color: '#1E1B4B' }}>暂无活动数据</p>
            <p className="text-[14px]" style={{ color: '#6B7280' }}>活动信息会从新闻中自动提取</p>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {events.map((event, i) => {
              const ts = typeStyle[event.type] || typeStyle.business
              const isActive = selectedEvent === i
              return (
                <button key={event.id} onClick={() => setSelectedEvent(isActive ? null : i)}
                  className="p-4 rounded-2xl text-left transition-all"
                  style={{
                    background: isActive ? '#7C3AED' : 'rgba(255,255,255,0.4)',
                    color: isActive ? 'white' : '#1E1B4B',
                    border: `1px solid ${isActive ? '#7C3AED' : 'rgba(255,255,255,0.4)'}`,
                  }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[12px] px-2 py-0.5 rounded-lg font-medium"
                      style={{ background: isActive ? 'rgba(255,255,255,0.2)' : ts.bg, color: isActive ? 'rgba(255,255,255,0.8)' : ts.color }}>
                      {ts.label}
                    </span>
                    <span className="text-[13px]" style={{ color: isActive ? 'rgba(255,255,255,0.5)' : '#9CA3AF' }}>{event.date}</span>
                  </div>
                  <div className="font-semibold text-[15px] mb-0.5">{event.title}</div>
                  <div className="text-[13px]" style={{ color: isActive ? 'rgba(255,255,255,0.6)' : '#6B7280' }}>{event.location}</div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 出发城市 */}
      {activeEvent && (
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full text-white text-[13px] font-bold flex items-center justify-center" style={{ background: '#7C3AED' }}>2</span>
            <h3 className="text-[16px] font-semibold" style={{ color: '#1E1B4B' }}>选择你的出发城市</h3>
          </div>
          <div className="text-[14px] mb-3" style={{ color: '#6B7280' }}>
            目的地：<span className="font-medium" style={{ color: '#1E1B4B' }}>{activeEvent.city || activeEvent.location}</span>
          </div>
          <select value={fromCity} onChange={e => setFromCity(e.target.value)}
            className="w-full sm:w-56 px-4 py-2.5 rounded-xl text-[15px] cursor-pointer"
            style={{ border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.4)', color: '#1E1B4B' }}>
            {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
      )}

      {/* 出行方案 */}
      {activeEvent && fromCity !== (activeEvent.city || activeEvent.location) && (
        <div className="glass rounded-3xl overflow-hidden">
          <div className="p-5" style={{ background: 'rgba(139,92,246,0.06)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[18px]" style={{ color: '#1E1B4B' }}>{fromCity} → {activeEvent.city || activeEvent.location}</h3>
                <p className="text-[14px] mt-0.5" style={{ color: '#6B7280' }}>{activeEvent.title}</p>
              </div>
              <div className="text-right text-[14px]">
                <div className="font-medium" style={{ color: '#7C3AED' }}>{activeEvent.date}</div>
              </div>
            </div>
          </div>
          <div className="p-5">
            <h4 className="font-semibold text-[15px] mb-3" style={{ color: '#1E1B4B' }}>出行方案</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <a href={`https://flights.ctrip.com/online/list/oneway-${fromCity.substring(0,2)}-${(activeEvent.city || activeEvent.location).substring(0,2)}?depdate=${activeEvent.date}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl transition-all no-underline group"
                style={{ border: '1px solid rgba(255,255,255,0.4)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,92,246,0.1)' }}>
                  <svg className="w-5 h-5" style={{ color: '#7C3AED' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold group-hover:text-[#7C3AED] transition-colors" style={{ color: '#1E1B4B' }}>
                    携程 · 查看航班
                  </div>
                  <div className="text-[13px]" style={{ color: '#6B7280' }}>{activeEvent.date} 直达/中转航班</div>
                </div>
              </a>
              <a href={`https://kyfw.12306.cn/otn/leftTicket/init?leftTicketDTO.train_date=${activeEvent.date}&leftTicketDTO.from_station=${stationCodes[fromCity] || ''}&leftTicketDTO.to_station=${stationCodes[activeEvent.city] || ''}&purpose_codes=ADULT`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl transition-all no-underline group"
                style={{ border: '1px solid rgba(255,255,255,0.4)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  <svg className="w-5 h-5" style={{ color: '#059669' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-4 4v3m-6 0h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold group-hover:text-[#059669] transition-colors" style={{ color: '#1E1B4B' }}>
                    12306 · 查看车次
                  </div>
                  <div className="text-[13px]" style={{ color: '#6B7280' }}>{activeEvent.date} 高铁/动车</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 本地活动提示 */}
      {activeEvent && fromCity === (activeEvent.city || activeEvent.location) && (
        <div className="glass rounded-3xl py-12 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(16,185,129,0.1)' }}>
            <svg className="w-6 h-6" style={{ color: '#059669' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-semibold text-[16px]" style={{ color: '#1E1B4B' }}>活动就在你的城市！</p>
          <p className="text-[14px] mt-1" style={{ color: '#6B7280' }}>无需出行，直接去现场就行啦</p>
        </div>
      )}
    </div>
  )
}
