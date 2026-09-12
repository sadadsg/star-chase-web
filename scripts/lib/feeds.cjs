// 订阅源生成 —— 纯函数：ICS (RFC 5545) 日历 + RSS 2.0
// ICS 关键约束：CRLF 行尾、文本转义（\\ ; , 换行）、≤75 八字节折行（后续行以空格开头）
// 全天事件：DTSTART;VALUE=DATE=当天，DTEND=次日（排他）

const crypto = require('node:crypto')

function pad2(n) {
  return String(n).padStart(2, '0')
}

// 日期对象 → ICS UTC 基本格式 20260912T000000Z
function icsUTC(d) {
  return `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}${pad2(d.getUTCSeconds())}Z`
}

// YYYY-MM-DD → 20260920
function icsDate(dateStr) {
  return dateStr.replace(/-/g, '')
}

// 次日 YYYY-MM-DD（DTEND 排他）
function nextDay(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + 1))
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`
}

function escapeICSText(s) {
  return String(s || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

// 按字节数折行：单行（含行名）超过 73 字节时折行，续行以一个空格开头
function foldICSLine(line) {
  const maxBytes = 73
  const out = []
  let cur = ''
  let curBytes = 0
  for (const ch of line) {
    const chBytes = Buffer.byteLength(ch, 'utf8')
    if (curBytes + chBytes > maxBytes) {
      out.push(cur)
      cur = ' ' + ch
      curBytes = 1 + chBytes
    } else {
      cur += ch
      curBytes += chBytes
    }
  }
  out.push(cur)
  return out.join('\r\n')
}

function stableId(seed) {
  return crypto.createHash('sha1').update(seed).digest('hex').slice(0, 12)
}

// schedule 条目数组 → ICS 文本（CRLF）
function buildICS(schedule, { calendarName, now = new Date() } = {}) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//star-chase-web//schedule 2.0//CN',
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${escapeICSText(calendarName || '嘉期如梦')}`,
    'X-WR-TIMEZONE:Asia/Shanghai',
  ]
  const stamp = icsUTC(now)

  for (const s of schedule || []) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.date || '')) continue
    const uid = `star-chase-${stableId(`${s.date}|${s.title || ''}`)}@star-chase-web`
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${uid}`)
    lines.push(`DTSTAMP:${stamp}`)
    lines.push(`DTSTART;VALUE=DATE:${icsDate(s.date)}`)
    lines.push(`DTEND;VALUE=DATE:${icsDate(nextDay(s.date))}`)
    lines.push(foldICSLine(`SUMMARY:${escapeICSText(`【${s.typeName || '活动'}】${s.title || ''}`)}`))
    if (s.city && s.city !== '待定') lines.push(foldICSLine(`LOCATION:${escapeICSText(s.city)}`))
    if (s.description) lines.push(foldICSLine(`DESCRIPTION:${escapeICSText(s.description.slice(0, 300))}`))
    if (s.newsUrl) lines.push(foldICSLine(`URL:${s.newsUrl}`))
    lines.push('SEQUENCE:0')
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n') + '\r\n'
}

function escapeXML(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// 数据源时间为北京时间；无时区的 YYYY-MM-DD HH:MM 显式按 +08:00 解析
function parseCST(s) {
  if (!s) return null
  const str = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(s) ? `${s.slice(0, 16)}:00+08:00` : s
  const d = new Date(str)
  return isNaN(d.getTime()) ? null : d
}

// news 条目数组 → RSS 2.0 文本
function buildRSS(news, { siteUrl, title, description, now = new Date(), maxItems = 30 } = {}) {
  const items = (news || []).slice(0, maxItems).map(n => {
    const link = n.url || siteUrl
    const guid = stableId(n.title || link)
    const pub = parseCST(n.time)
    const pubDate = pub ? pub.toUTCString() : now.toUTCString()
    return [
      '<item>',
      `  <title>${escapeXML((n.title || '').slice(0, 120))}</title>`,
      `  <link>${escapeXML(link)}</link>`,
      `  <guid isPermaLink="false">star-chase-${guid}</guid>`,
      `  <pubDate>${pubDate}</pubDate>`,
      `  <description>${escapeXML((n.summary || n.title || '').slice(0, 200))}</description>`,
      `  <category>${escapeXML(n.category || '资讯')}</category>`,
      `  <source url="${escapeXML(siteUrl)}">${escapeXML(n.source || '嘉期如梦')}</source>`,
      '</item>',
    ].join('\n')
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXML(title || '嘉期如梦 · 资讯')}</title>
  <link>${escapeXML(siteUrl)}</link>
  <description>${escapeXML(description || '任嘉伦行程与资讯更新')}</description>
  <lastBuildDate>${now.toUTCString()}</lastBuildDate>
  <generator>star-chase-web</generator>
${items.join('\n')}
</channel>
</rss>
`
}

module.exports = { buildICS, buildRSS, escapeICSText, escapeXML, foldICSLine, icsUTC, nextDay, stableId }
