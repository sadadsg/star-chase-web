import EventCard from '../components/EventCard'

export default function EventsPage() {
  return (
    <div style={{ background: '#fff' }}>
      <div className="container-apple" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <h1 className="section-title m-0">活动门票</h1>
        <p className="text-[15px] mt-1.5 mb-8" style={{ color: '#6e6e73' }}>
          演出与商务活动信息，直达来源链接
        </p>
        <EventCard />
      </div>
    </div>
  )
}
