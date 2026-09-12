import { useSearchParams } from 'react-router-dom'
import TravelRecommend from '../components/TravelRecommend'

export default function TravelPage() {
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId')

  return (
    <div style={{ background: '#fff' }}>
      <div className="container-apple" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <h1 className="section-title m-0">出行推荐</h1>
        <p className="text-[15px] mt-1.5 mb-8" style={{ color: '#6e6e73' }}>
          选定活动与出发城市，一键查询机票和高铁
        </p>
        <TravelRecommend initialEventId={eventId ? Number(eventId) : null} />
      </div>
    </div>
  )
}
