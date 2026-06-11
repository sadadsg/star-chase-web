import { useMemo } from 'react'
import { scheduleList } from '../../data/rjlData'

const typeStyle = {
  filming: { color: '#7C3AED', bg: 'rgba(139,92,246,0.1)', label: '影视' },
  variety: { color: '#059669', bg: 'rgba(16,185,129,0.1)', label: '综艺' },
  business: { color: '#D97706', bg: 'rgba(245,158,11,0.1)', label: '商务' },
  fanmeeting: { color: '#DB2777', bg: 'rgba(236,72,153,0.1)', label: '见面会' },
}

export default function EventSelector({ selectedEventIndex, onEventSelect, compactMode = false, onShowAllEvents }) {
  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return scheduleList.filter(s => new Date(s.date) >= now && s.type !== 'filming').sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [])

  const activeEvent = selectedEventIndex !== null ? upcomingEvents[selectedEventIndex] : null

  if (compactMode && activeEvent) {
    const ts = typeStyle[activeEvent.type]
    return (
      <div className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[12px] px-2 py-0.5 rounded-lg font-medium" style={{ background: ts.bg, color: ts.color }}>{ts.label}</span>
            <div>
              <span className="font-semibold text-[15px]" style={{ color: '#1E1B4B' }}>{activeEvent.title}</span>
              <span className="text-[14px] ml-2" style={{ color: '#9CA3AF' }}>{activeEvent.date}</span>
            </div>
          </div>
          <button onClick={onShowAllEvents} className="text-[13px] font-medium" style={{ color: '#7C3AED' }}>更换活动</button>
        </div>
      </div>
    )
  }

  if (!compactMode) {
    return (
      <div className="glass rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full text-white text-[13px] font-bold flex items-center justify-center" style={{ background: '#7C3AED' }}>1</span>
          <h3 className="text-[16px] font-semibold" style={{ color: '#1E1B4B' }}>选择你想参加的活动</h3>
        </div>
        {upcomingEvents.length === 0 ? (
          <div className="py-10 text-center text-[14px]" style={{ color: '#9CA3AF' }}>暂无近期活动</div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {upcomingEvents.map((event, i) => {
              const ts = typeStyle[event.type]
              const isActive = selectedEventIndex === i
              return (
                <button key={event.id} onClick={() => onEventSelect(isActive ? null : i)}
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
                  <div className="text-[13px]" style={{ color: isActive ? 'rgba(255,255,255,0.6)' : '#6B7280' }}>{event.location} · {event.time}</div>
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
