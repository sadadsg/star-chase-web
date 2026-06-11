const stationCodes = {
  '北京': 'BJP', '上海': 'SHH', '广州': 'GZQ', '深圳': 'SZQ',
  '成都': 'CDW', '杭州': 'HZH', '南京': 'NJH', '武汉': 'WHN',
  '重庆': 'CQW', '西安': 'XAY', '长沙': 'CSQ', '天津': 'TJP',
  '苏州': 'SZH', '青岛': 'QDK', '大连': 'DLT', '郑州': 'ZZF',
  '昆明': 'KMM', '厦门': 'XMS', '福州': 'FZS', '合肥': 'HFH',
}

const flightCodes = {
  '北京': 'BJS', '上海': 'SHA', '广州': 'CAN', '深圳': 'SZX',
  '成都': 'CTU', '杭州': 'HGH', '南京': 'NKG', '武汉': 'WUH',
  '重庆': 'CKG', '西安': 'SIA', '长沙': 'CSX', '天津': 'TSN',
  '苏州': 'SZV', '青岛': 'TAO', '大连': 'DLC', '郑州': 'CGO',
  '昆明': 'KMG', '厦门': 'XMN', '福州': 'FOC', '合肥': 'HFE',
}

function ctripFlightUrl(from, to, date) {
  return `https://flights.ctrip.com/online/list/oneway-${flightCodes[from] || from}-${flightCodes[to] || to}?depdate=${date}`
}

function train12306Url(from, to, date) {
  const f = stationCodes[from] || ''
  const t = stationCodes[to] || ''
  return `https://kyfw.12306.cn/otn/leftTicket/init?leftTicketDTO.train_date=${date}&leftTicketDTO.from_station=${f}&leftTicketDTO.to_station=${t}&purpose_codes=ADULT`
}

export default function RouteCard({ route, fromCity, destCity, date }) {
  const isFlight = route.type === 'flight'
  const no = route.flightNo || route.trainNo
  const bookUrl = isFlight ? ctripFlightUrl(fromCity, destCity, date) : train12306Url(fromCity, destCity, date)

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="min-w-[60px]">
            <div className="text-[13px]" style={{ color: '#6B7280' }}>{route.airline || (isFlight ? '航班' : route.type)}</div>
            <span className="text-[14px] font-bold px-2 py-0.5 rounded-lg"
              style={{ background: isFlight ? 'rgba(139,92,246,0.1)' : 'rgba(16,185,129,0.1)', color: isFlight ? '#7C3AED' : '#059669' }}>
              {no}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="font-bold text-[17px] leading-tight" style={{ color: '#1E1B4B' }}>{route.depart}</div>
              <div className="text-[12px] mt-0.5" style={{ color: '#9CA3AF' }}>{route.from || fromCity}</div>
            </div>
            <div className="flex flex-col items-center text-[12px] min-w-[70px]" style={{ color: '#9CA3AF' }}>
              <span>{route.duration}</span>
              <div className="w-16 h-px relative my-1" style={{ background: '#D1D5DB' }}>
                <div className="absolute -right-0.5 -top-[3px] w-0 h-0 border-l-[4px] border-y-[2px] border-y-transparent" style={{ borderLeftColor: '#9CA3AF' }} />
              </div>
              <span>{isFlight ? '直飞' : '直达'}</span>
            </div>
            <div className="text-center">
              <div className="font-bold text-[17px] leading-tight" style={{ color: '#1E1B4B' }}>{route.arrive}</div>
              <div className="text-[12px] mt-0.5" style={{ color: '#9CA3AF' }}>{destCity}</div>
            </div>
          </div>
        </div>
        <div className="text-right flex items-center gap-3">
          <div>
            <div className="text-[17px] font-bold" style={{ color: '#E11D48' }}>¥{route.price}</div>
            <div className="text-[12px]" style={{ color: '#9CA3AF' }}>{route.seats || ''}</div>
          </div>
          <a href={bookUrl} target="_blank" rel="noopener noreferrer"
            className="text-[13px] font-medium px-4 py-2 rounded-xl no-underline text-white whitespace-nowrap"
            style={{ background: isFlight ? '#7C3AED' : '#059669' }}>
            {isFlight ? '订机票' : '订车票'}
          </a>
        </div>
      </div>
    </div>
  )
}
