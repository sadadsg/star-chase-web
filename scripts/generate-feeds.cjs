// 生成订阅源 → data/schedule.ics + data/rss.xml
// 用法: node scripts/generate-feeds.cjs（在 fetch-data.cjs 之后运行）

const fs = require('node:fs')
const path = require('node:path')
const config = require('./artists.config.cjs')
const { buildICS, buildRSS } = require('./lib/feeds.cjs')

const DATA_DIR = path.join(__dirname, '..', 'data')
const SITE_URL = 'https://sadadsg.github.io/star-chase-web/'

function readJSON(name, fallback) {
  const p = path.join(DATA_DIR, name)
  if (!fs.existsSync(p)) return fallback
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch {
    return fallback
  }
}

function main() {
  const now = new Date()
  const artistName = config.artists[0].name

  // ICS 日历
  const schedule = readJSON('schedule.json', { data: [] }).data || []
  const ics = buildICS(schedule, {
    calendarName: `嘉期如梦 · ${artistName}行程`,
    now,
  })
  fs.writeFileSync(path.join(DATA_DIR, 'schedule.ics'), ics)
  console.log(`[feeds] schedule.ics: ${schedule.length} 个条目`)

  // RSS 资讯
  const news = readJSON('news.json', { data: [] }).data || []
  const rss = buildRSS(news, {
    siteUrl: SITE_URL,
    title: `嘉期如梦 · ${artistName}资讯`,
    description: `${artistName}工作室动态与资讯更新（非官方粉丝项目）`,
    now,
  })
  fs.writeFileSync(path.join(DATA_DIR, 'rss.xml'), rss)
  console.log(`[feeds] rss.xml: ${Math.min(news.length, 30)} 条`)
}

main()
