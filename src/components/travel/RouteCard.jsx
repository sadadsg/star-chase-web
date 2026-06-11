/**
 * 路线卡片组件
 * 用于显示单条航班或高铁班次
 */

// 城市 → 12306 车站代码
const stationCodes = {
  '北京': 'BJP', '上海': 'SHH', '广州': 'GZQ', '深圳': 'SZQ',
  '成都': 'CDW', '杭州': 'HZH', '南京': 'NJH', '武汉': 'WHN',
  '重庆': 'CQW', '西安': 'XAY', '长沙': 'CSQ', '天津': 'TJP',
  '苏州': 'SZH', '青岛': 'QDK', '大连': 'DLT', '郑州': 'ZZF',
  '昆明': 'KMM', '厦门': 'XMS', '福州': 'FZS', '合肥': 'HFH',
}

// 城市 → 携程三字码
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
    <div className="border border-[#EDF0F5] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          {/* 航司/铁路局 */}
          <div className="min-w-[60px]">
            <div className="text-[13px] text-[#8E99A8]">{route.airline || (isFlight ? '航班' : route.type)}</div>
            <span className={`text-[14px] font-bold px-2 py-0.5 rounded-md ${isFlight ? 'bg-[#EEF3FD] text-[#5B8DEF]' : 'bg-[#EAF6F0] text-[#4AA87C]'}`}>
              {no}
            </span>
          </div>

          {/* 时间线 */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="font-bold text-[#1E293B] text-[17px] leading-tight">{route.depart}</div>
              <div className="text-[12px] text-[#B0BEC5] mt-0.5">{route.from || fromCity}</div>
            </div>
            <div className="flex flex-col items-center text-[12px] text-[#B0BEC5] min-w-[70px]">
              <span>{route.duration}</span>
              <div className="w-16 h-px bg-[#D3DAE6] relative my-1">
                <div className="absolute -right-0.5 -top-[3px] w-0 h-0 border-l-[4px] border-l-[#B0BEC5] border-y-[2px] border-y-transparent" />
              </div>
              <span>{isFlight ? '直飞' : '直达'}</span>
            </div>
            <div className="text-center">
              <div className="font-bold text-[#1E293B] text-[17px] leading-tight">{route.arrive}</div>
              <div className="text-[12px] text-[#B0BEC5] mt-0.5">{destCity}</div>
            </div>
          </div>
        </div>

        {/* 价格 + 购票 */}
        <div className="text-right flex items-center gap-3">
          <div>
            <div className="text-[17px] font-bold text-[#E85D3A]">¥{route.price}</div>
            <div className="text-[12px] text-[#B0BEC5]">{route.seats || ''}</div>
          </div>
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[13px] font-medium px-4 py-2 rounded-lg no-underline transition-colors whitespace-nowrap
              ${isFlight
                ? 'bg-[#5B8DEF] text-white hover:bg-[#4A7DE0]'
                : 'bg-[#4AA87C] text-white hover:bg-[#3D9B6A]'
              }`}
          >
            {isFlight ? '订机票' : '订车票'}
          </a>
        </div>
      </div>
    </div>
  )
}
