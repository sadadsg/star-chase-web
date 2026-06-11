import EventCard from '../components/EventCard'

export default function EventsPage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: '#1E1B4B' }}>活动门票</h1>
        <p className="text-[14px] mt-0.5" style={{ color: '#6B7280' }}>任嘉伦最新活动、见面会门票信息，直达购票链接</p>
      </div>

      <EventCard />
    </div>
  )
}
