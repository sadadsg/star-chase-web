import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SkeletonCalendar } from './ui'
import CityPicker from './CityPicker'
import { useLocalStorage } from '../hooks'
import { fetchSchedule } from '../api/dataApi'
import { EASE_OUT_EXPO, SPRING_SOFT, SPRING_SNAP, staggerChild } from '../lib/motion'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

// 降饱和类型色（与全局设计令牌一致）
const typeColor = {
  filming: { bg: 'rgba(88,86,214,0.08)', text: '#5856d6', dot: '#5856d6' },
  variety: { bg: 'rgba(36,138,61,0.08)', text: '#248a3d', dot: '#248a3d' },
  business: { bg: 'rgba(180,83,9,0.08)', text: '#b45309', dot: '#b45309' },
  fanmeeting: { bg: 'rgba(214,51,108,0.08)', text: '#d6336c', dot: '#d6336c' },
}

function shortTitle(title) {
  const cleaned = (title || '')
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
  const [direction, setDirection] = useState(1) // 1 = 向后翻月，-1 = 向前
  const [myCity] = useLocalStorage('my-city')
  const [onlyMine, setOnlyMine] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      try {
        setLoading(true)
        const result = await fetchSchedule()

        if (!cancelled) {
          setSchedule(result.data || [])
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

    loadData()
    return () => { cancelled = true }
  }, [])

  // 「只看我的城市」过滤后的可见行程（日历/统计/详情统一走 visible）
  const visible = onlyMine && myCity ? schedule.filter(s => s.city === myCity) : schedule

  const monthSchedule = useMemo(() => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`
    return visible.filter(s => s.date && s.date.startsWith(prefix))
  }, [visible, year, month])

  const selectedSchedule = selectedDate
    ? visible.filter(s => s.date === selectedDate)
    : []

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
    return visible.filter(s => s.date === dateStr)
  }

  const handleDayClick = (day) => {
    if (!day) return
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(dateStr === selectedDate ? null : dateStr)
  }

  const prevMonth = () => {
    setDirection(-1)
    if (month === 1) { setYear(year - 1); setMonth(12) }
    else setMonth(month - 1)
    setSelectedDate(null)
  }

  const nextMonth = () => {
    setDirection(1)
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

  // 月份网格的方向性滑动（方向存 state，避免 render 期读 ref）
  const monthGridMotion = {
    initial: { opacity: 0, x: direction * 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.32, ease: EASE_OUT_EXPO } },
    exit: { opacity: 0, x: direction * -20, transition: { duration: 0.18, ease: 'easeOut' } },
  }

  if (loading) {
    return <SkeletonCalendar />
  }

  return (
    <div>
      {schedule.length === 0 && (
        <div className="rounded-xl px-4 py-3 mb-4" style={{ background: '#f5f5f7' }}>
          <p className="text-[14px] m-0" style={{ color: '#6e6e73' }}>
            暂无行程数据。行程来自工作室官方微博，发布后自动更新。
          </p>
        </div>
      )}

      {/* 月份切换 */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <button onClick={prevMonth} aria-label="上个月" className="cal-nav-btn p-1.5 sm:p-2 rounded-lg cursor-pointer bg-transparent" style={{ border: 'none' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-[17px] sm:text-[19px] font-semibold m-0" style={{ letterSpacing: '-0.01em', color: '#1d1d1f' }}>
          {year}年 {MONTHS[month - 1]}
        </h3>
        <button onClick={nextMonth} aria-label="下个月" className="cal-nav-btn p-1.5 sm:p-2 rounded-lg cursor-pointer bg-transparent" style={{ border: 'none' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 就近匹配：城市选择 + 只看我的城市（弹簧开关） */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <CityPicker />
        <label
          className="inline-flex items-center gap-2 m-0"
          style={{
            fontSize: 13,
            color: '#6e6e73',
            cursor: myCity ? 'pointer' : 'default',
            opacity: myCity ? 1 : 0.45,
          }}
          title={myCity ? '' : '先选择「我的城市」'}
        >
          <span className="whitespace-nowrap">只看我的城市</span>
          <input
            type="checkbox"
            checked={onlyMine && Boolean(myCity)}
            disabled={!myCity}
            onChange={e => { setOnlyMine(e.target.checked); setSelectedDate(null) }}
            style={{ display: 'none' }}
          />
          <motion.span
            style={{
              width: 40, height: 24, borderRadius: 980, position: 'relative',
              flexShrink: 0, display: 'inline-block',
            }}
            animate={{
              backgroundColor: onlyMine && myCity ? '#0071e3' : '#e8e8ed',
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <motion.span
              style={{
                position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%',
                background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
              animate={{ x: onlyMine && myCity ? 16 : 0 }}
              transition={SPRING_SOFT}
            />
          </motion.span>
        </label>
      </div>

      {/* 过滤后本月无行程的提示 */}
      {onlyMine && myCity && schedule.length > 0 && monthSchedule.length === 0 && (
        <p className="text-[13px] m-0 mb-2" style={{ color: '#86868b' }}>
          {year}年{MONTHS[month - 1]}你所在城市（{myCity}）暂无行程
        </p>
      )}

      {/* 月度统计条 */}
      {monthSchedule.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3 text-[12px] sm:text-[13px]">
          {[
            { type: 'filming', label: '影视' },
            { type: 'variety', label: '综艺' },
            { type: 'business', label: '商务' },
            { type: 'fanmeeting', label: '演出' },
          ].map(item => (
            monthStats[item.type] > 0 && (
              <span key={item.type} className="font-medium" style={{ color: typeColor[item.type].text }}>
                {item.label} {monthStats[item.type]}条
              </span>
            )
          ))}
          <span style={{ color: '#aeaeb2' }}>共{monthSchedule.length}条</span>
        </div>
      )}

      {/* 星期表头 */}
      <div className="grid grid-cols-7 mb-0.5">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[11px] sm:text-[13px] font-medium py-1 sm:py-2" style={{ color: '#86868b' }}>{d}</div>
        ))}
      </div>

      {/* 日期网格：方向性滑动切换月份 */}
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={`${year}-${month}`}
          custom={direction}
          variants={monthGridMotion}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="grid grid-cols-7 gap-px rounded-xl overflow-hidden" style={{ background: '#e8e8ed' }}>
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
                  className={`cal-cell min-h-[56px] sm:min-h-[80px] p-1 sm:p-1.5 text-left relative ${day ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {day && (
                    <>
                      {isSelected && (
                        <motion.span
                          layoutId="cal-selected-ring"
                          className="absolute inset-0.5 rounded-lg pointer-events-none"
                          style={{ boxShadow: 'inset 0 0 0 2px #1d1d1f' }}
                          transition={SPRING_SNAP}
                        />
                      )}
                      <div className="flex items-center justify-between mb-0.5 sm:mb-1 relative z-10">
                        <span className={`
                          text-[12px] sm:text-[14px] leading-none tabular-nums
                          ${todayFlag ? 'text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-semibold' : ''}
                        `}
                          style={{
                            background: todayFlag ? '#1d1d1f' : 'transparent',
                            color: '#1d1d1f',
                            fontWeight: isSelected || todayFlag ? 600 : 400,
                          }}>
                          {day}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        {events.slice(0, 2).map((ev, j) => {
                          const c = typeColor[ev.type] || typeColor.business
                          return (
                            <div key={j} className="text-[10px] sm:text-[11px] leading-tight px-0.5 sm:px-1 py-0.5 rounded truncate font-medium"
                              style={{ background: c.bg, color: c.text }}>
                              {shortTitle(ev.title)}
                            </div>
                          )
                        })}
                        {events.length > 2 && (
                          <div className="text-[12px] px-0.5" style={{ color: '#aeaeb2' }}>+{events.length - 2}</div>
                        )}
                      </div>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 图例 */}
      <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 sm:mt-3">
        {[
          { type: 'filming', label: '影视拍摄' },
          { type: 'variety', label: '综艺录制' },
          { type: 'business', label: '商务活动' },
          { type: 'fanmeeting', label: '演出活动' },
        ].map(item => (
          <div key={item.type} className="flex items-center gap-1 sm:gap-1.5 text-[12px] sm:text-[13px]" style={{ color: '#86868b' }}>
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm" style={{ background: typeColor[item.type].dot }} />
            {item.label}
          </div>
        ))}
      </div>

      {/* 选中日期详情：展开 + 卡片依次入场 */}
      <AnimatePresence>
        {selectedDate && selectedSchedule.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3, ease: EASE_OUT_EXPO } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
            className="mt-4 space-y-2 overflow-hidden"
          >
            <motion.h4
              className="text-[14px] font-medium m-0"
              style={{ color: '#86868b' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1, duration: 0.25 } }}
            >
              {selectedDate} 的行程
            </motion.h4>
            <motion.div
              className="space-y-2"
              initial="initial"
              animate="animate"
              variants={{ animate: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } }}
            >
              {selectedSchedule.map(s => {
                const c = typeColor[s.type] || typeColor.business
                return (
                  <motion.div
                    key={s.id}
                    variants={staggerChild}
                    className="p-4 rounded-xl"
                    style={{ background: '#fff', border: '1px solid #e8e8ed' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: c.dot }} />
                      <span className="text-[13px] font-medium" style={{ color: c.text }}>{s.typeName}</span>
                      {myCity && s.city === myCity && (
                        <span style={{ fontSize: 11, fontWeight: 500, color: '#0066cc', background: 'rgba(0,113,227,0.08)', padding: '2px 8px', borderRadius: 980 }}>
                          就在你的城市
                        </span>
                      )}
                      <span className="text-[13px] ml-auto" style={{ color: '#aeaeb2' }}>{s.time}</span>
                    </div>
                    <h4 className="font-semibold text-[16px] m-0" style={{ color: '#1d1d1f' }}>{s.title}</h4>
                    {s.description && s.description !== s.title && (
                      <p className="text-[14px] mt-1 leading-relaxed" style={{ color: '#6e6e73' }}>{s.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-[13px]" style={{ color: '#86868b' }}>{s.location}</div>
                      {s.newsUrl && s.newsUrl !== '#' && (
                        <a
                          href={s.newsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-apple text-[13px]"
                        >
                          查看来源 <span className="chevron">›</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedDate && selectedSchedule.length === 0 && (
        <div className="mt-4 text-center py-6 text-[14px]" style={{ color: '#86868b' }}>
          这天暂无行程安排
        </div>
      )}
    </div>
  )
}
