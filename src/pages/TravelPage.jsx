import { useSearchParams } from 'react-router-dom'
import TravelRecommend from '../components/TravelRecommend'

export default function TravelPage() {
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId')

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-[#2D3748]">出行推荐</h1>
        <p className="text-[#8E99A8] text-[14px] mt-0.5">选择出发城市，自动匹配去爱豆活动的机票和高铁方案</p>
      </div>

      <TravelRecommend initialEventId={eventId ? Number(eventId) : null} />
    </div>
  )
}
