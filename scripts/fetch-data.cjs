const https = require('https')
const fs = require('fs')
const path = require('path')

const ARTIST_NAME = '任嘉伦'
const ARTIST_KEYWORDS = ['任嘉伦', 'Allen Ren', '任国超', '嘉伦']
const SCHEDULE_KEYWORDS = {
  filming: ['开机', '杀青', '拍摄', '剧组', '新剧', '主演', '剧集', '补拍', '定档', '开播'],
  variety: ['综艺', '录制', '节目', '晚会', '春晚', '哥哥', '出发'],
  business: ['品牌', '代言', '活动', '发布会', '时装周', '秀场', '直播', '杂志', '封面', '晚宴'],
  fanmeeting: ['演唱会', '音乐节', '见面会', '巡演', '签售', '生日会']
}
const CITIES = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '南京', '武汉',
  '重庆', '西安', '长沙', '天津', '苏州', '青岛', '大连', '郑州',
  '昆明', '厦门', '福州', '合肥', '大理', '横店', '澳门', '香港',
  '台北', '米兰', '巴黎', '伦敦', '纽约', '东京', '首尔'
]

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      }
    }, (res) => {
      // 处理重定向
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchUrl(res.headers.location).then(resolve).catch(reject)
        return
      }
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')) })
    req.end()
  })
}

function decodeHtmlEntities(str) {
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
}

function matchesArtist(text) {
  return ARTIST_KEYWORDS.some(kw => text.includes(kw))
}

// 从百度资讯搜索结果中提取新闻
function extractNewsFromBaidu(html) {
  const news = []
  let id = 1

  // 方法1: 匹配百度资讯搜索结果中的标题和摘要
  // 百度资讯搜索结果格式: <a ...>标题</a> 和 <span class="c-color-text">摘要</span>
  const titleRegex = /<a[^>]*class="[^"]*news-title[^"]*"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi
  let match
  while ((match = titleRegex.exec(html)) !== null) {
    const url = match[1]
    const title = match[2].replace(/<[^>]*>/g, '').trim()
    if (title && title.length > 4) {
      const pubDate = extractDateFromUrl(url) || new Date().toISOString().split('T')[0]
      news.push({ id: id++, title, summary: title, source: '百度资讯', url: decodeHtmlEntities(url), cover: '', category: guessCategory(title), time: pubDate })
    }
  }

  // 方法2: 匹配更通用的百度搜索结果
  if (news.length === 0) {
    // 尝试匹配 <h3> 标签中的标题
    const h3Regex = /<h3[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h3>/gi
    while ((match = h3Regex.exec(html)) !== null) {
      const url = match[1]
      const title = match[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
      if (title && title.length > 4 && matchesArtist(title)) {
        const pubDate = extractDateFromUrl(url) || new Date().toISOString().split('T')[0]
        news.push({ id: id++, title, summary: title, source: '百度搜索', url: decodeHtmlEntities(url), cover: '', category: guessCategory(title), time: pubDate })
      }
    }
  }

  // 方法3: 从百度热搜API中查找（备用）
  if (news.length === 0) {
    const wordRegex = /"word":"([^"]+)"/g
    while ((match = wordRegex.exec(html)) !== null) {
      const word = match[1]
      if (matchesArtist(word)) {
        news.push({
          id: id++, title: word, summary: word, source: '百度热搜',
          url: `https://www.baidu.com/s?wd=${encodeURIComponent(word)}`,
          cover: '', category: guessCategory(word),
          time: new Date().toISOString().split('T')[0]
        })
      }
    }
  }

  return news
}

function guessCategory(text) {
  if (/影视|剧|电影|主演|拍摄|开机|杀青|定档|开播/.test(text)) return '影视'
  if (/综艺|节目|哥哥|出发|春晚|晚会/.test(text)) return '综艺'
  if (/时尚|品牌|代言|时装|杂志|封面|秀场/.test(text)) return '时尚'
  return '日常'
}

// 从 URL 中提取发布日期
function extractDateFromUrl(url) {
  // 格式1: /news/20220920/ 或 /20220920/
  const m1 = url.match(/\/(\d{4})(\d{2})(\d{2})\//)
  if (m1) {
    const [, y, m, d] = m1
    const date = new Date(`${y}-${m}-${d}`)
    if (!isNaN(date.getTime())) return `${y}-${m}-${d}`
  }
  // 格式2: /2022/03/25/
  const m2 = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})/)
  if (m2) {
    const [, y, m, d] = m2
    const date = new Date(`${y}-${m}-${d}`)
    if (!isNaN(date.getTime())) return `${y}-${m}-${d}`
  }
  // 格式3: -20220920- 或 _20220920_
  const m3 = url.match(/[-_](\d{4})(\d{2})(\d{2})[-_]/)
  if (m3) {
    const [, y, m, d] = m3
    const date = new Date(`${y}-${m}-${d}`)
    if (!isNaN(date.getTime())) return `${y}-${m}-${d}`
  }
  return null
}

// 判断日期是否在最近一年内
function isWithinOneYear(dateStr) {
  if (!dateStr) return true // 无法判断日期的保留（宁可多展示）
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return true
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  return d >= oneYearAgo
}

function extractScheduleFromNews(newsItems) {
  const schedules = []
  let id = 10000

  for (const item of newsItems) {
    const text = item.title + ' ' + item.summary
    let type = null
    for (const [t, keywords] of Object.entries(SCHEDULE_KEYWORDS)) {
      if (keywords.some(kw => text.includes(kw))) { type = t; break }
    }
    if (!type) continue

    let city = '待定'
    for (const c of CITIES) { if (text.includes(c)) { city = c; break } }

    const typeNames = { filming: '影视拍摄', variety: '综艺录制', business: '商务活动', fanmeeting: '演出活动' }
    schedules.push({
      id: id++,
      date: new Date().toISOString().split('T')[0],
      type, typeName: typeNames[type] || '活动',
      title: item.title.slice(0, 60),
      description: item.summary || item.title,
      location: city, city, time: '全天',
      newsUrl: item.url
    })
  }
  return schedules
}

function extractEvents(schedules) {
  return schedules
    .filter(s => s.type === 'fanmeeting' || s.type === 'business')
    .map(s => ({
      ...s, name: s.title, venue: s.location,
      status: 'onsale', statusText: '查看来源',
      cover: `https://picsum.photos/seed/event${s.id}/600/400`
    }))
}

async function main() {
  console.log(`Searching for "${ARTIST_NAME}" news...`)

  let allNews = []

  // 策略1: 百度资讯搜索（最可靠）
  try {
    const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(ARTIST_NAME)}&tn=news&rtt=1&bsst=1&cl=2&medium=0`
    console.log('  Fetching Baidu News search...')
    const html = await fetchUrl(searchUrl)
    const news = extractNewsFromBaidu(html)
    console.log(`  Baidu News: found ${news.length} items`)
    allNews.push(...news)
  } catch (err) {
    console.error('  Baidu News fetch failed:', err.message)
  }

  // 策略2: 百度实时热搜（备用，偶尔能命中）
  try {
    console.log('  Fetching Baidu hot search...')
    const html = await fetchUrl('https://top.baidu.com/board?tab=realtime')
    const news = extractNewsFromBaidu(html)
    console.log(`  Baidu Hot Search: found ${news.length} items`)
    allNews.push(...news)
  } catch (err) {
    console.error('  Baidu Hot Search fetch failed:', err.message)
  }

  // 去重
  const seen = new Set()
  allNews = allNews.filter(n => {
    const key = n.title
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // 过滤超过一年的新闻
  const beforeFilter = allNews.length
  allNews = allNews.filter(n => isWithinOneYear(n.time))
  const filtered = beforeFilter - allNews.length
  if (filtered > 0) console.log(`  Filtered out ${filtered} news items older than 1 year`)

  console.log(`\nTotal unique news: ${allNews.length}`)

  const schedule = extractScheduleFromNews(allNews)
  const events = extractEvents(schedule)

  const dataDir = path.join(__dirname, '..', 'data')
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

  const now = new Date().toISOString()
  fs.writeFileSync(path.join(dataDir, 'schedule.json'), JSON.stringify({ data: schedule, total: schedule.length, updatedAt: now }, null, 2))
  fs.writeFileSync(path.join(dataDir, 'news.json'), JSON.stringify({ data: allNews, total: allNews.length, updatedAt: now }, null, 2))
  fs.writeFileSync(path.join(dataDir, 'events.json'), JSON.stringify({ data: events, total: events.length, updatedAt: now }, null, 2))

  console.log('\nData saved:')
  console.log(`  news: ${allNews.length} items`)
  console.log(`  schedule: ${schedule.length} items`)
  console.log(`  events: ${events.length} items`)

  if (allNews.length > 0) {
    console.log('\nSample news:')
    allNews.slice(0, 3).forEach((n, i) => console.log(`  ${i+1}. ${n.title} [${n.source}]`))
  }
}

main().catch(err => { console.error('Error:', err); process.exit(1) })
