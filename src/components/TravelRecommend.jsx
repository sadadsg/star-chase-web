import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const API_BASE = 'http://localhost:3001/api'

// 城市列表
const CITIES = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '南京', '武汉',
  '重庆', '西安', '长沙', '天津', '苏州', '青岛', '大连', '郑州',
  '昆明', '厦门', '福州', '合肥',
]

// 城市 → 12306 车站代码
const stationCodes = {
  '北京': 'BJP', '上海': 'SHH', '广州': 'GZQ', '深圳': 'SZQ',
  '成都': 'CDW', '杭州': 'HZH', '南京': 'NJH', '武汉': 'WHN',
  '重庆': 'CQW', '西安': 'XAY', '长沙': 'CSQ', '天津': 'TJP',
  '苏州': 'SZH', '青岛': 'QDK', '大连': 'DLT', '郑州': 'ZZF',
  '昆明': 'KMM', '厦门': 'XMS', '福州': 'FZS', '合肥': 'HFH',
}

const typeIcon = {
  filming: { color: 'text-[#5B8DEF]', bg: 'bg-[#EEF3FD]', label: '影视' },
  variety: { color: 'text-[#4AA87C]', bg: 'bg-[#EAF6F0]', label: '综艺' },
  business: { color: 'text-[#D4845A]', bg: 'bg-[#FDF0EB]', label: '商务' },
  fanmeeting: { color: 'text-[#C96A9A]', bg: 'bg-[#FBE9F2]', label: '演出' },
}

export default function TravelRecommend() {
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId')

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [fromCity, setFromCity] = useState('北京')

  // 获取活动列表
  useEffect(() => {
    let cancelled = false
    async function fetchEvents() {
      try {
        const res = await fetch(`${API_BASE}/weibo/schedule`)
        if (!res.ok) return
        const json = await res.json()
        
        if (!cancelled) {
          const activityEvents = (json.data || [])
            .filter(s => s.type === 'fanmeeting' || s.type === 'business')
            .map(s => ({
              ...s,
              name: s.title,
              venue: s.location,
            }))
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
  }, [])

  // 根据 URL 参数选中活动
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
          <div key={i} className="bg-white rounded-2xl p-5 border border-[#EDF0F5] animate-pulse">
            <div className="h-6 bg-[#F0F3F8] rounded w-1/3 mb-3" />
            <div className="h-4 bg-[#F0F3F8] rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* 活动选择 */}
      <div className="bg-white rounded-2xl p-5 border border-[#EDF0F5]">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-[#6366F1] text-white text-[13px] font-bold flex items-center justify-center">1</span>
          <h3 className="text-[16px] font-semibold text-[#2D3748]">选择你想参加的活动</h3>
        </div>

        {events.length === 0 ? (
          <div className="py-10 text-center">
            <svg className="w-12 h-12 mx-auto text-[#D3DAE6] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[#2D3748] font-semibold text-[15px] mb-1">暂无活动数据</p>
            <p className="text-[#8E99A8] text-[14px]">活动信息会从新闻中自动提取</p>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {events.map((event, i) => {
              const ti = typeIcon[event.type] || typeIcon.business
              const isActive = selectedEvent === i
              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(isActive ? null : i)}
                  className={`p-4 rounded-xl text-left transition-all border
                    ${isActive
                      ? 'bg-[#6366F1] text-white border-[#6366F1]'
                      : 'bg-white text-[#2D3748] border-[#EDF0F5] hover:border-[#D3DAE6]'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[12px] px-2 py-0.5 rounded-md font-medium
                      ${isActive ? 'bg-white/20 text-white/80' : `${ti.bg} ${ti.color}`}`}>
                      {ti.label}
                    </span>
                    <span className={`text-[13px] ${isActive ? 'text-white/50' : 'text-[#B0BEC5]'}`}>
                      {event.date}
                    </span>
                  </div>
                  <div className="font-semibold text-[15px] mb-0.5">{event.title}</div>
                  <div className={`text-[13px] ${isActive ? 'text-white/60' : 'text-[#8E99A8]'}`}>
                    {event.location}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 出发城市 */}
      {activeEvent && (
        <div className="bg-white rounded-2xl p-5 border border-[#EDF0F5]">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-[#6366F1] text-white text-[13px] font-bold flex items-center justify-center">2</span>
            <h3 className="text-[16px] font-semibold text-[#2D3748]">选择你的出发城市</h3>
          </div>
          <div className="text-[14px] text-[#8E99A8] mb-3">
            目的地：<span className="text-[#2D3748] font-medium">{activeEvent.city || activeEvent.location}</span>
          </div>
          <select
            value={fromCity}
            onChange={e => setFromCity(e.target.value)}
            className="w-full sm:w-56 px-4 py-2.5 rounded-xl border border-[#EDF0F5] bg-[#F7F9FC] text-[#2D3748] text-[15px] focus:outline-none focus:ring-2 focus:ring-[#93B4F5] focus:border-[#5B8DEF] cursor-pointer"
          >
            {CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      )}

      {/* 出行方案 */}
      {activeEvent && fromCity !== (activeEvent.city || activeEvent.location) && (
        <div className="bg-white rounded-2xl border border-[#EDF0F5] overflow-hidden">
          <div className="bg-gradient-to-r from-[#EEF2FF] to-[#F3E8FF] p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#1E293B] text-[18px]">{fromCity} → {activeEvent.city || activeEvent.location}</h3>
                <p className="text-[#8E99A8] text-[14px] mt-0.5">{activeEvent.title}</p>
              </div>
              <div className="text-right text-[14px]">
                <div className="text-[#6366F1] font-medium">{activeEvent.date}</div>
              </div>
            </div>
          </div>

          <div className="p-5">
            <h4 className="font-semibold text-[#1E293B] text-[15px] mb-3">出行方案</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* 携程 */}
              <a
                href={`https://flights.ctrip.com/online/list/oneway-${fromCity.substring(0,2)}-${(activeEvent.city || activeEvent.location).substring(0,2)}?depdate=${activeEvent.date}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-[#EDF0F5] hover:border-[#D4E2FA] hover:bg-[#FAFCFF] transition-all no-underline group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EEF3FD] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#5B8DEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-[#2D3748] group-hover:text-[#5B8DEF] transition-colors">
                    携程 · 查看{fromCity}→{activeEvent.city || activeEvent.location}航班
                  </div>
                  <div className="text-[13px] text-[#8E99A8]">{activeEvent.date} 直达/中转航班</div>
                </div>
                <svg className="w-4 h-4 text-[#B0BEC5] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              {/* 12306 */}
              <a
                href={`https://kyfw.12306.cn/otn/leftTicket/init?leftTicketDTO.train_date=${activeEvent.date}&leftTicketDTO.from_station=${stationCodes[fromCity] || ''}&leftTicketDTO.to_station=${stationCodes[activeEvent.city] || ''}&purpose_codes=ADULT`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl border border-[#EDF0F5] hover:border-[#C8E6D9] hover:bg-[#F5FBF8] transition-all no-underline group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAF6F0] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#4AA87C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-4 4v3m-6 0h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-[#2D3748] group-hover:text-[#4AA87C] transition-colors">
                    12306 · 查看{fromCity}→{activeEvent.city || activeEvent.location}车次
                  </div>
                  <div className="text-[13px] text-[#8E99A8]">{activeEvent.date} 高铁/动车</div>
                </div>
                <svg className="w-4 h-4 text-[#B0BEC5] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 本地活动提示 */}
      {activeEvent && fromCity === (activeEvent.city || activeEvent.location) && (
        <div className="bg-white rounded-2xl py-12 text-center border border-[#EDF0F5]">
          <div className="w-12 h-12 rounded-full bg-[#EAF6F0] flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-[#4AA87C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-[#2D3748] font-semibold text-[16px]">活动就在你的城市！</p>
          <p className="text-[#8E99A8] text-[14px] mt-1">无需出行，直接去现场就行啦</p>
        </div>
      )}
    </div>
  )
}
