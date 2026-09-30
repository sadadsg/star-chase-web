// 出行推荐深链生成 —— 纯函数，无 React 依赖，可被 node --test 直接覆盖
// 背景：schedule.json 的 city 字段在正则降级抽取下几乎恒为「待定」，
// 此时任何购票链接都是死链（曾产出 oneway-北京-待定）。本模块对未知城市一律返回 null，
// 由调用方渲染「目的地待定」占位，而不是给用户一个打不开的链接。

// 携程机场三字码（IATA）
export const FLIGHT_CODES = {
  '北京': 'BJS', '上海': 'SHA', '广州': 'CAN', '深圳': 'SZX',
  '成都': 'CTU', '杭州': 'HGH', '南京': 'NKG', '武汉': 'WUH',
  '重庆': 'CKG', '西安': 'SIA', '长沙': 'CSX', '天津': 'TSN',
  '苏州': 'SZV', '青岛': 'TAO', '大连': 'DLC', '郑州': 'CGO',
  '昆明': 'KMG', '厦门': 'XMN', '福州': 'FOC', '合肥': 'HFE',
}

// 12306 车站电报码
export const STATION_CODES = {
  '北京': 'BJP', '上海': 'SHH', '广州': 'GZQ', '深圳': 'SZQ',
  '成都': 'CDW', '杭州': 'HZH', '南京': 'NJH', '武汉': 'WHN',
  '重庆': 'CQW', '西安': 'XAY', '长沙': 'CSQ', '天津': 'TJP',
  '苏州': 'SZH', '青岛': 'QDK', '大连': 'DLT', '郑州': 'ZZF',
  '昆明': 'KMM', '厦门': 'XMS', '福州': 'FZS', '合肥': 'HFH',
}

// 数据管道用「待定」表示城市未知；前端统一归一为 null
const UNKNOWN_CITY = '待定'

/**
 * 归一化城市名：空值 / 未知占位 / 前后空白 → null；其余原样返回
 * @param {string|undefined|null} city
 * @returns {string|null}
 */
export function normalizeCity(city) {
  if (typeof city !== 'string') return null
  const trimmed = city.trim()
  if (!trimmed || trimmed === UNKNOWN_CITY) return null
  return trimmed
}

/**
 * 城市是否可用于生成购票深链（需三字码覆盖）
 * @param {string|undefined|null} city
 * @returns {boolean}
 */
export function hasTravelCodes(city) {
  const c = normalizeCity(city)
  if (!c) return false
  return Boolean(FLIGHT_CODES[c]) && Boolean(STATION_CODES[c])
}

/**
 * 携程机票深链。两端城市缺码时返回 null（不产出死链）
 * @param {string} from 出发城市
 * @param {string} to 目的城市
 * @param {string} date YYYY-MM-DD
 * @returns {string|null}
 */
export function buildCtripFlightUrl(from, to, date) {
  const f = FLIGHT_CODES[normalizeCity(from)]
  const t = FLIGHT_CODES[normalizeCity(to)]
  if (!f || !t || !date) return null
  return `https://flights.ctrip.com/online/list/oneway-${f}-${t}?depdate=${date}`
}

/**
 * 12306 车次查询深链。两端缺站码时返回 null
 * @param {string} from 出发城市
 * @param {string} to 目的城市
 * @param {string} date YYYY-MM-DD
 * @returns {string|null}
 */
export function buildTrain12306Url(from, to, date) {
  const f = STATION_CODES[normalizeCity(from)]
  const t = STATION_CODES[normalizeCity(to)]
  if (!f || !t || !date) return null
  const q = new URLSearchParams({
    'leftTicketDTO.train_date': date,
    'leftTicketDTO.from_station': f,
    'leftTicketDTO.to_station': t,
    purpose_codes: 'ADULT',
  })
  return `https://kyfw.12306.cn/otn/leftTicket/init?${q.toString()}`
}

/**
 * 从 schedule 条目取稳定标识：postId 是数据里唯一可用作 React key / 深链的字段
 * （schedule.json 没有 id 字段，早期代码用 e.id 匹配导致深链恒不命中）
 * @param {object} item schedule 条目
 * @returns {string|null}
 */
export function eventKey(item) {
  if (!item) return null
  const pid = item.postId
  if (pid === undefined || pid === null || pid === '') return null
  return String(pid)
}
