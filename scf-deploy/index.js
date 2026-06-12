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

const ARTISTS = {
  rjl: {
    id: 'rjl', name: '任嘉伦', englishName: 'Allen Ren',
    birthday: '1989-04-11', birthplace: '山东青岛',
    agency: '欢瑞世纪', fansName: '嘉人',
  }
}

async function fetchBaiduHot() {
  const res = await fetch('https://top.baidu.com/board?tab=realtime', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  })
  if (!res.ok) return []
  const html = await res.text()
  const matches = html.match(/"word":"([^"]+)"/g) || []
  return matches.map(m => m.replace(/"word":"/, '').replace(/"$/, ''))
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(data, status = 200) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    body: JSON.stringify(data)
  }
}

exports.main_handler = async (event, context) => {
  const path = event.path || '/'
  const method = event.httpMethod || 'GET'

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' }
  }

  try {
    const hotWords = await fetchBaiduHot()

    if (path === '/api/health') {
      return json({ status: 'ok', timestamp: new Date().toISOString() })
    }

    if (path.match(/^\/api\/artist\/[^/]+\/info$/)) {
      const id = path.split('/')[3]
      const artist = ARTISTS[id]
      if (!artist) return json({ error: '艺人不存在' }, 404)
      return json(artist)
    }

    if (path.match(/^\/api\/artist\/[^/]+\/schedule$/)) {
      return json(extractSchedule(hotWords))
    }

    if (path.match(/^\/api\/artist\/[^/]+\/news$/)) {
      const count = parseInt(event.queryStringParameters?.count) || 30
      return json(extractNews(hotWords).slice(0, count))
    }

    if (path.match(/^\/api\/artist\/[^/]+\/events$/)) {
      return json(extractEvents(extractSchedule(hotWords)))
    }

    if (path === '/api/weibo/news') {
      const count = parseInt(event.queryStringParameters?.count) || 30
      const news = extractNews(hotWords)
      return json({ data: news.slice(0, count), source: 'realtime', total: news.length })
    }

    if (path === '/api/weibo/schedule') {
      const schedules = extractSchedule(hotWords)
      return json({ data: schedules, source: 'realtime', total: schedules.length })
    }

    if (path === '/api/weibo/status') {
      const artistCount = hotWords.filter(w => matchesArtist(w)).length
      return json({
        configured: true,
        message: `实时热搜: ${hotWords.length} 条, 艺人相关: ${artistCount} 条`,
      })
    }

    return json({ error: 'Not Found' }, 404)
  } catch (err) {
    return json({ error: err.message }, 500)
  }
}
