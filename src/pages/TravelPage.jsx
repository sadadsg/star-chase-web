import { useSearchParams } from 'react-router-dom'
import TravelRecommend from '../components/TravelRecommend'

export default function TravelPage() {
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId')

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-semibold" style={{ color: '#1E1B4B' }}>出行推荐</h1>
        <p className="text-[14px] mt-0.5" style={{ color: '#6B7280' }}>选择出发城市，自动匹配去爱豆活动的机票和高铁方案</p>
      </div>

      <TravelRecommend initialEventId={eventId ? Number(eventId) : null} />
    </div>
  )
}
