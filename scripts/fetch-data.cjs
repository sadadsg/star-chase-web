const https = require('https')
const fs = require('fs')
const path = require('path')

const ARTIST_KEYWORDS = ['任嘉伦', 'Allen Ren', '任国超', '佳偶天成', '陆千乔', '暮色心约', '风与潮', '37·单枪匹马', '无忧渡']
const SCHEDULE_KEYWORDS = {
  filming: ['开机', '杀青', '拍摄', '剧组', '新剧', '主演', '剧集'],
  variety: ['综艺', '录制', '节目', '晚会', '春晚'],
  business: ['品牌', '代言', '活动', '发布会', '时装周', '秀场', '直播'],
  fanmeeting: ['演唱会', '音乐节', '见面会', '巡演', '签售']
}
const CITIES = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '南京', '武汉',
  '重庆', '西安', '长沙', '天津', '苏州', '青岛', '大连', '郑州',
  '昆明', '厦门', '福州', '合肥', '大理', '横店', '澳门'
]

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'top.baidu.com',
      path: '/board?tab=realtime',
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 15000
    }
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')) })
    req.end()
  })
}

function matchesArtist(text) {
  return ARTIST_KEYWORDS.some(kw => text.includes(kw))
}

function extractSchedule(hotWords) {
  const schedules = []
  let id = 10000
  for (const word of hotWords) {
    if (!matchesArtist(word)) continue
    let type = null
    for (const [t, keywords] of Object.entries(SCHEDULE_KEYWORDS)) {
      if (keywords.some(kw => word.includes(kw))) { type = t; break }
    }
    if (!type) continue
    let city = '待定'
    for (const c of CITIES) { if (word.includes(c)) { city = c; break } }
    const typeNames = { filming: '影视拍摄', variety: '综艺录制', business: '商务活动', fanmeeting: '演出活动' }
    schedules.push({
      id: id++, date: new Date().toISOString().split('T')[0],
      type, typeName: typeNames[type] || '活动',
      title: word.slice(0, 60), description: word,
      location: city, city, time: '全天',
      newsUrl: `https://www.baidu.com/s?wd=${encodeURIComponent(word)}`
    })
  }
  return schedules
}

function extractNews(hotWords) {
  return hotWords.filter(w => matchesArtist(w)).map(word => ({
    title: word, summary: word, source: '百度热搜',
    url: `https://www.baidu.com/s?wd=${encodeURIComponent(word)}`,
    cover: '', category: '日常',
    time: new Date().toISOString().split('T')[0]
  }))
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
  console.log('Fetching Baidu hot search...')
  const html = await fetchUrl('https://top.baidu.com/board?tab=realtime')
  const matches = html.match(/"word":"([^"]+)"/g) || []
  const hotWords = matches.map(m => m.replace(/"word":"/, '').replace(/"$/, ''))
  console.log(`Got ${hotWords.length} hot words`)

  const artistNews = hotWords.filter(w => matchesArtist(w))
  console.log(`Found ${artistNews.length} artist-related items`)

  const dataDir = path.join(__dirname, '..', 'data')
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

  const schedule = extractSchedule(hotWords)
  const news = extractNews(hotWords)
  const events = extractEvents(schedule)

  fs.writeFileSync(path.join(dataDir, 'schedule.json'), JSON.stringify({ data: schedule, total: schedule.length, updatedAt: new Date().toISOString() }, null, 2))
  fs.writeFileSync(path.join(dataDir, 'news.json'), JSON.stringify({ data: news, total: news.length, updatedAt: new Date().toISOString() }, null, 2))
  fs.writeFileSync(path.join(dataDir, 'events.json'), JSON.stringify({ data: events, total: events.length, updatedAt: new Date().toISOString() }, null, 2))

  console.log('Data saved:')
  console.log(`  schedule: ${schedule.length} items`)
  console.log(`  news: ${news.length} items`)
  console.log(`  events: ${events.length} items`)
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
