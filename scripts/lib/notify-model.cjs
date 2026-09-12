// 通知消息模型 —— 纯函数：增量 diff、消息组装、长度截断
// 无状态设计：previous 来自 git HEAD 版本的数据文件，git 即状态

const SITE_URL = 'https://sadadsg.github.io/star-chase-web/'

// 企业微信 webhook 文本上限 2048 字节（中文 3 字节/字），留余量按 1800 字节截断
const MAX_BYTES = 1800
const MAX_SCHEDULE_ITEMS = 5
const MAX_NEWS_ITEMS = 3

function scheduleKey(s) {
  return `${s.date}|${(s.title || '').replace(/\s+/g, '')}`
}

function newsKey(n) {
  return (n.title || '').replace(/\s+/g, '')
}

// current 中不在 previous 里的条目（保持 current 顺序）
function diffByKey(current, previous, keyFn) {
  const seen = new Set((previous || []).map(keyFn))
  return (current || []).filter(item => !seen.has(keyFn(item)))
}

function byteLength(s) {
  return Buffer.byteLength(s, 'utf8')
}

// 截断到 maxBytes 字节（不切断代理对，尾部加省略标记）
function truncateBytes(s, maxBytes) {
  if (byteLength(s) <= maxBytes) return s
  let out = ''
  let bytes = 0
  for (const ch of s) {
    const b = byteLength(ch)
    if (bytes + b > maxBytes - 3) break
    out += ch
    bytes += b
  }
  return out + '…'
}

// 未来行程取最早 N 条，资讯取最新 N 条，组装纯文本消息
function buildNotifyMessage({ scheduleNew = [], newsNew = [], now = new Date(), siteUrl = SITE_URL } = {}) {
  const lines = [`官方更新 ${formatDate(now)}`]
  const meta = { scheduleShown: 0, newsShown: 0, omitted: 0 }

  const schedules = scheduleNew.slice(0, MAX_SCHEDULE_ITEMS)
  const news = newsNew.slice(0, MAX_NEWS_ITEMS)
  meta.scheduleShown = schedules.length
  meta.newsShown = news.length
  meta.omitted = Math.max(0, scheduleNew.length - schedules.length + newsNew.length - news.length)

  if (schedules.length) {
    lines.push('○ 行程新增')
    for (const s of schedules) {
      const city = s.city && s.city !== '待定' ? ` · ${s.city}` : ''
      lines.push(`${s.date.slice(5).replace('-', '.')}【${s.typeName || '活动'}】${s.title}${city}`)
    }
  }
  if (news.length) {
    lines.push('○ 资讯新增')
    for (const n of news) {
      lines.push(`· ${n.title}`)
    }
  }
  if (meta.omitted > 0) {
    lines.push(`（其余 ${meta.omitted} 条见网站）`)
  }
  lines.push(`详情：${siteUrl}`)

  let message = lines.join('\n')
  if (byteLength(message) > MAX_BYTES) {
    const suffix = '\n（内容过长，请到网站查看全部）'
    message = truncateBytes(message, MAX_BYTES - byteLength(suffix)) + suffix
  }
  return { message, meta }
}

function formatDate(d) {
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

module.exports = { scheduleKey, newsKey, diffByKey, buildNotifyMessage, truncateBytes, MAX_SCHEDULE_ITEMS, MAX_NEWS_ITEMS }
