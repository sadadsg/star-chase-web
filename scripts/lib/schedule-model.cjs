// 行程数据模型 —— 纯函数：校验、合并、去重、降级抽取
// 设计原则：宁缺毋滥（零假数据），任何校验不过的条目直接丢弃

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const VALID_TYPES = ['filming', 'variety', 'business', 'fanmeeting']

function isValidDate(s) {
  if (typeof s !== 'string' || !DATE_RE.test(s)) return false
  const d = new Date(`${s}T00:00:00Z`)
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

// 条目距离当前月份的月数（用于行程图日期合理性检查）
function monthsFromNow(dateStr, now = new Date()) {
  const d = new Date(`${dateStr}T00:00:00Z`)
  return (d.getUTCFullYear() - now.getUTCFullYear()) * 12 + (d.getUTCMonth() - now.getUTCMonth())
}

// 校验并清洗 LLM/正则抽取出的行程条目
// 返回 { items: [...], dropped: [{ item, reason }] }
function validateItems(rawItems, { cities, typeNames, dateWindowMonths = 1, now = new Date() } = {}) {
  const items = []
  const dropped = []
  for (const raw of rawItems || []) {
    const date = typeof raw.date === 'string' ? raw.date.trim() : ''
    const title = typeof raw.title === 'string' ? raw.title.trim().slice(0, 60) : ''
    const city = typeof raw.city === 'string' ? raw.city.trim() : '待定'

    if (!title) { dropped.push({ item: raw, reason: 'empty_title' }); continue }
    if (!isValidDate(date)) { dropped.push({ item: raw, reason: 'bad_date' }); continue }
    if (Math.abs(monthsFromNow(date, now)) > dateWindowMonths) {
      dropped.push({ item: raw, reason: 'date_out_of_window' }); continue
    }
    let type = raw.type
    if (!VALID_TYPES.includes(type) && typeNames) {
      const nameToType = Object.entries(typeNames).find(([, n]) => n === raw.typeName)
      type = nameToType ? nameToType[0] : null
    }
    if (!type) { dropped.push({ item: raw, reason: 'bad_type' }); continue }
    if (city !== '待定' && Array.isArray(cities) && cities.length && !cities.includes(city)) {
      dropped.push({ item: raw, reason: 'unknown_city' }); continue
    }
    items.push({
      date, type, title, city,
      typeName: typeNames ? typeNames[type] : type,
      description: (raw.description || title).slice(0, 200),
      source: raw.source || 'studio_weibo',
      postId: raw.postId || null,
      newsUrl: raw.newsUrl || null,
    })
  }
  return { items, dropped }
}

// 行程合并：按 date+title 去重，过期出清，按日期升序
function mergeSchedule(existing, incoming, { retentionDays = 120, now = new Date() } = {}) {
  const seen = new Set()
  const cutoff = Date.now() - retentionDays * 86400 * 1000
  const out = []
  for (const s of [...(existing || []), ...(incoming || [])]) {
    if (!isValidDate(s.date)) continue
    const t = new Date(`${s.date}T00:00:00Z`).getTime()
    if (t < cutoff) continue
    const key = `${s.date}|${(s.title || '').replace(/\s+/g, '')}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(s)
  }
  out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : (a.title || '').localeCompare(b.title || '')))
  return out
}

// 资讯合并：按标题去重，保留 retentionDays 窗口，按时间倒序，cap maxItems
function mergeNews(existing, incoming, { retentionDays = 90, maxItems = 60, now = new Date() } = {}) {
  const seen = new Set()
  const cutoff = now.getTime() - retentionDays * 86400 * 1000
  const out = []
  for (const n of [...(incoming || []), ...(existing || [])]) {
    const key = (n.title || '').replace(/\s+/g, '')
    if (!key || seen.has(key)) continue
    seen.add(key)
    const t = Date.parse(n.time || '')
    out.push(t && !isNaN(t) ? { ...n, _ts: t } : { ...n, _ts: 0 })
  }
  return out
    .filter(n => n._ts === 0 || n._ts >= cutoff) // 无日期的保留（宁可多展示）
    .sort((a, b) => b._ts - a._ts)
    .slice(0, maxItems)
    .map(({ _ts, ...n }) => n)
}

// 从帖文文本分类行程类型（返回类型 key 或 null）
function classifyType(text, scheduleKeywords = {}) {
  for (const [type, kws] of Object.entries(scheduleKeywords)) {
    if (kws.some(kw => text.includes(kw))) return type
  }
  return null
}

// 无 LLM 时的保守日期抽取：只认显式日期/相对日期，返回 YYYY-MM-DD 数组
// 相对日期基于 postTime（帖文发布时间的日历日期）推算，全程用本地日期分量避免时区偏移
function extractDatesFallback(text, postTime) {
  const ymd = postTime && postTime.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  const base = ymd ? new Date(+ymd[1], +ymd[2] - 1, +ymd[3]) : new Date()
  if (isNaN(base.getTime())) return []
  const pad = n => String(n).padStart(2, '0')
  const fmt = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const dates = new Set()
  for (const m of text.matchAll(/(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})日?/g)) {
    dates.add(`${+m[1]}-${pad(+m[2])}-${pad(+m[3])}`)
  }
  for (const m of text.matchAll(/(?<!\d)(\d{1,2})[月/](\d{1,2})日?(?!\d)/g)) {
    if (+m[1] >= 1 && +m[1] <= 12 && +m[2] >= 1 && +m[2] <= 31) dates.add(`${base.getFullYear()}-${pad(+m[1])}-${pad(+m[2])}`)
  }
  if (/今晚|今天|今日/.test(text)) dates.add(fmt(base))
  if (/明晚|明天|次日/.test(text)) dates.add(fmt(new Date(base.getFullYear(), base.getMonth(), base.getDate() + 1)))
  return [...dates]
}

// 清洗帖文为可展示标题：去超话标记/话题/@/链接/零宽字符
function cleanTitle(text) {
  return (text || '')
    .replace(/#\w*\[超话\]#/g, ' ')
    .replace(/#[^#\n]{1,40}#/g, ' ')
    .replace(/@[\w\u4e00-\u9fa5_-]+/g, ' ')
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/[\u200b\u200c\u200d\ufe0f\u3000]/g, '')
    .replace(/来自.*?客户端/, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 60)
}

module.exports = { isValidDate, monthsFromNow, validateItems, mergeSchedule, mergeNews, classifyType, extractDatesFallback, cleanTitle }
