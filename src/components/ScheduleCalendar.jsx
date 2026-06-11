import { useState, useEffect, useMemo } from 'react'
import { SkeletonCalendar } from './ui'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const typeColor = {
  filming: { bg: 'bg-[#EEF3FD]', text: 'text-[#5B8DEF]', dot: 'bg-[#5B8DEF]', border: 'border-[#D4E2FA]' },
  variety: { bg: 'bg-[#EAF6F0]', text: 'text-[#4AA87C]', dot: 'bg-[#7EC8A8]', border: 'border-[#C8E6D9]' },
  business: { bg: 'bg-[#FDF0EB]', text: 'text-[#D4845A]', dot: 'bg-[#F5A882]', border: 'border-[#F0D4C4]' },
  fanmeeting: { bg: 'bg-[#FBE9F2]', text: 'text-[#C96A9A]', dot: 'bg-[#E8A0BF]', border: 'border-[#F0D0E0]' },
}

const API_BASE = 'http://localhost:3001/api'

function shortTitle(title) {
  const cleaned = title
    .replace(/^《[^》]+》/, '')
    .replace(/^「[^」]+」/, '')
  if (cleaned.length <= 6) return cleaned
  return cleaned.slice(0, 6) + '…'
}

export default function ScheduleCalendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState(null)
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)

  // 获取行程数据
  useEffect(() => {
    let cancelled = false
    
    async function fetchSchedule() {
      try {
        setLoading(true)
        const res = await fetch(`${API_BASE}/weibo/schedule`)
        if (!res.ok) throw new Error('请求失败')
        const json = await res.json()
        
        if (!cancelled) {
          setSchedule(json.data || [])
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[schedule] 获取行程失败:', err.message)
          setSchedule([])
          setLoading(false)
        }
      }
    }
    
    fetchSchedule()
    return () => { cancelled = true }
  }, [])

  // 当前月份的行程
  const monthSchedule = useMemo(() => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`
    return schedule.filter(s => s.date && s.date.startsWith(prefix))
  }, [schedule, year, month])

  // 选中日期的行程
  const selectedSchedule = selectedDate
    ? schedule.filter(s => s.date === selectedDate)
    : []

  // 日历格子
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1).getDay()
    const daysInMonth = new Date(year, month, 0).getDate()
    const days = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(d)
    return days
  }, [year, month])

  const getDayEvents = (day) => {
    if (!day) return []
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return schedule.filter(s => s.date === dateStr)
  }

  const handleDayClick = (day) => {
    if (!day) return
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(dateStr === selectedDate ? null : dateStr)
  }

  const prevMonth = () => {
    if (month === 1) { setYear(year - 1); setMonth(12) }
    else setMonth(month - 1)
    setSelectedDate(null)
  }

  const nextMonth = () => {
    if (month === 12) { setYear(year + 1); setMonth(1) }
    else setMonth(month + 1)
    setSelectedDate(null)
  }

  const isToday = (day) => {
    return day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear()
  }

  const monthStats = useMemo(() => {
    const stats = { filming: 0, variety: 0, business: 0, fanmeeting: 0 }
    monthSchedule.forEach(s => { if (stats[s.type] !== undefined) stats[s.type]++ })
    return stats
  }, [monthSchedule])

  // 加载状态
  if (loading) {
    return <SkeletonCalendar />
  }

  return (
    <div>
      {/* 无数据提示 */}
      {schedule.length === 0 && (
        <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-lg px-4 py-3 mb-4">
          <div className="flex items-center gap-2 text-[14px] text-[#6366F1]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>暂无行程数据，行程会从新闻中自动提取</span>
          </div>
        </div>
      )}

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-[#F7F9FC] rounded-lg transition text-[#8E99A8] hover:text-[#2D3748]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-[#2D3748]">{year}年 {MONTHS[month - 1]}</h3>
        <button onClick={nextMonth} className="p-2 hover:bg-[#F7F9FC] rounded-lg transition text-[#8E99A8] hover:text-[#2D3748]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 月度统计条 */}
      {monthSchedule.length > 0 && (
        <div className="flex gap-3 mb-3 text-[13px]">
          {[
            { type: 'filming', label: '影视' },
            { type: 'variety', label: '综艺' },
            { type: 'business', label: '商务' },
            { type: 'fanmeeting', label: '演出' },
          ].map(item => (
            monthStats[item.type] > 0 && (
              <span key={item.type} className={`${typeColor[item.type].text} font-medium`}>
                {item.label} {monthStats[item.type]}条
              </span>
            )
          ))}
          <span className="text-[#B0BEC5]">共{monthSchedule.length}条行程</span>
        </div>
      )}

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-0.5">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[13px] font-semibold text-[#8E99A8] py-2">{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-[#EDF0F5] rounded-xl overflow-hidden">
        {calendarDays.map((day, i) => {
          const events = getDayEvents(day)
          const dateStr = day ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''
          const isSelected = day && selectedDate === dateStr
          const todayFlag = isToday(day)

          return (
            <button
              key={i}
              onClick={() => handleDayClick(day)}
              disabled={!day}
              className={`
                min-h-[80px] p-1.5 text-left transition-all relative
                ${!day ? 'bg-[#FAFBFC] cursor-default' : 'bg-white cursor-pointer hover:bg-[#FAFBFC]'}
                ${isSelected ? 'ring-2 ring-inset ring-[#5B8DEF]' : ''}
              `}
            >
              {day && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`
                      text-[14px] leading-none
                      ${todayFlag ? 'bg-[#5B8DEF] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold' : 'text-[#5A6577]'}
                      ${isSelected && !todayFlag ? 'text-[#5B8DEF] font-bold' : ''}
                    `}>
                      {day}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {events.slice(0, 2).map((ev, j) => {
                      const c = typeColor[ev.type] || typeColor.business
                      return (
                        <div key={j} className={`${c.bg} ${c.text} text-[11px] leading-tight px-1 py-0.5 rounded truncate font-medium`}>
                          {shortTitle(ev.title)}
                        </div>
                      )
                    })}
                    {events.length > 2 && (
                      <div className="text-[12px] text-[#B0BEC5] px-0.5">+{events.length - 2}</div>
                    )}
                  </div>
                </>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3">
        {[
          { type: 'filming', label: '影视拍摄' },
          { type: 'variety', label: '综艺录制' },
          { type: 'business', label: '商务活动' },
          { type: 'fanmeeting', label: '演出活动' },
        ].map(item => (
          <div key={item.type} className="flex items-center gap-1.5 text-[13px] text-[#8E99A8]">
            <span className={`w-2.5 h-2.5 rounded-sm ${typeColor[item.type].dot}`} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Selected Date Schedule Detail */}
      {selectedDate && selectedSchedule.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-[14px] font-medium text-[#8E99A8]">{selectedDate} 的行程</h4>
          {selectedSchedule.map(s => {
            const c = typeColor[s.type] || typeColor.business
            return (
              <div key={s.id} className={`p-4 rounded-xl border ${c.bg} ${c.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                  <span className={`text-[13px] font-medium ${c.text}`}>{s.typeName}</span>
                  <span className="text-[13px] text-[#B0BEC5] ml-auto">{s.time}</span>
                </div>
                <h4 className="font-semibold text-[#2D3748] text-[16px]">{s.title}</h4>
                <p className="text-[14px] mt-1 text-[#5A6577] leading-relaxed">{s.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-[13px] text-[#8E99A8]">{s.location}</div>
                  {s.newsUrl && s.newsUrl !== '#' && (
                    <a
                      href={s.newsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] font-medium text-[#6366F1] hover:text-[#4F46E5] bg-[#EEF2FF] hover:bg-[#E0E7FF] px-3 py-1.5 rounded-lg transition-colors no-underline"
                    >
                      查看来源
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedDate && selectedSchedule.length === 0 && (
        <div className="mt-4 text-center py-6 text-[#B0BEC5] text-[14px]">
          这天暂无行程安排
        </div>
      )}
    </div>
  )
}
