/**
 * 活动选择组件
 * 用于选择要参加的活动
 */

import { useMemo } from 'react'
import { scheduleList } from '../../data/rjlData'

const typeIcon = {
  filming: { color: 'text-[#5B8DEF]', bg: 'bg-[#EEF3FD]', label: '影视' },
  variety: { color: 'text-[#4AA87C]', bg: 'bg-[#EAF6F0]', label: '综艺' },
  business: { color: 'text-[#D4845A]', bg: 'bg-[#FDF0EB]', label: '商务' },
  fanmeeting: { color: 'text-[#C96A9A]', bg: 'bg-[#FBE9F2]', label: '见面会' },
}

export default function EventSelector({
  selectedEventIndex,
  onEventSelect,
  compactMode = false,
  onShowAllEvents,
}) {
  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return scheduleList
      .filter(s => new Date(s.date) >= now && s.type !== 'filming')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [])

  const activeEvent = selectedEventIndex !== null ? upcomingEvents[selectedEventIndex] : null

  // 从日历来：紧凑活动信息条
  if (compactMode && activeEvent) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-[#EDF0F5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-[12px] px-2 py-0.5 rounded-md font-medium ${typeIcon[activeEvent.type].bg} ${typeIcon[activeEvent.type].color}`}>
              {typeIcon[activeEvent.type].label}
            </span>
            <div>
              <span className="font-semibold text-[#2D3748] text-[15px]">{activeEvent.title}</span>
              <span className="text-[#B0BEC5] text-[14px] ml-2">{activeEvent.date}</span>
            </div>
          </div>
          <button
            onClick={onShowAllEvents}
            className="text-[13px] text-[#6366F1] hover:text-[#4F46E5] font-medium"
          >
            更换活动
          </button>
        </div>
      </div>
    )
  }

  // 手动选择活动
  if (!compactMode) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-[#EDF0F5]">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-[#6366F1] text-white text-[13px] font-bold flex items-center justify-center">1</span>
          <h3 className="text-[16px] font-semibold text-[#2D3748]">选择你想参加的活动</h3>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="py-10 text-center text-[#B0BEC5] text-[14px]">暂无近期活动</div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {upcomingEvents.map((event, i) => {
              const ti = typeIcon[event.type]
              const isActive = selectedEventIndex === i
              return (
                <button
                  key={event.id}
                  onClick={() => onEventSelect(isActive ? null : i)}
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
                    {event.location} · {event.time}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return null
}
