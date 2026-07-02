import EventCard from '../components/EventCard'

export default function EventsPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-semibold font-serif-display" style={{ color: '#1C1917' }}>活动门票</h1>
        <p className="text-[14px] mt-0.5" style={{ color: '#78716C' }}>任嘉伦最新活动、见面会门票信息，直达购票链接</p>
      </div>

      <EventCard />
    </div>
  )
}
