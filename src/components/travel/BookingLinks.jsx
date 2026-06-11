/**
 * 购票链接组件
 * 用于显示携程和12306的快捷入口
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

function ctripSearchUrl(from, to, date) {
  return `https://flights.ctrip.com/online/list/oneway-${flightCodes[from] || from}-${flightCodes[to] || to}?depdate=${date}`
}

function train12306Url(from, to, date) {
  const f = stationCodes[from] || ''
  const t = stationCodes[to] || ''
  return `https://kyfw.12306.cn/otn/leftTicket/init?leftTicketDTO.train_date=${date}&leftTicketDTO.from_station=${f}&leftTicketDTO.to_station=${t}&purpose_codes=ADULT`
}

export default function BookingLinks({ fromCity, destCity, date, hasDirectRoutes = false }) {
  return (
    <div>
      <h4 className="font-semibold text-[#1E293B] text-[15px] mb-3">
        {hasDirectRoutes ? '更多中转方案' : '出行方案'}
      </h4>
      <div className="grid gap-3 sm:grid-cols-2">
        {/* 携程 */}
        <a
          href={ctripSearchUrl(fromCity, destCity, date)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-xl border border-[#EDF0F5] hover:border-[#D4E2FA] hover:bg-[#FAFCFF] transition-all no-underline group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EEF3FD] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#5B8DEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold text-[#2D3748] group-hover:text-[#5B8DEF] transition-colors">
              携程 · 查看{fromCity}→{destCity}航班
            </div>
            <div className="text-[13px] text-[#8E99A8]">{date} 直达/中转航班一站搜索</div>
          </div>
          <svg className="w-4 h-4 text-[#B0BEC5] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        {/* 12306 */}
        <a
          href={train12306Url(fromCity, destCity, date)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-xl border border-[#EDF0F5] hover:border-[#C8E6D9] hover:bg-[#F5FBF8] transition-all no-underline group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#EAF6F0] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#4AA87C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-4 4v3m-6 0h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold text-[#2D3748] group-hover:text-[#4AA87C] transition-colors">
              12306 · 查看{fromCity}→{destCity}车次
            </div>
            <div className="text-[13px] text-[#8E99A8]">{date} 高铁/动车/中转方案</div>
          </div>
          <svg className="w-4 h-4 text-[#B0BEC5] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  )
}
