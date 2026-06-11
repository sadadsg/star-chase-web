import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 严格的艺人关键词 - 必须包含这些词才算艺人新闻
const ARTIST_KEYWORDS = ['任嘉伦', 'Allen Ren', '任国超', '佳偶天成', '陆千乔', '暮色心约', '风与潮', '37·单枪匹马', '无忧渡']
const DEFAULT_UID = '6492637583'

// 缓存
const cache = {
  news: null,
  newsTimestamp: 0,
  schedule: null,
  scheduleTimestamp: 0,
  CACHE_TTL: 10 * 60 * 1000,
}

function isCacheValid(key) {
  const now = Date.now()
  return cache[key] && (now - cache[`${key}Timestamp`]) < cache.CACHE_TTL
}

function setCache(key, data) {
  cache[key] = data
  cache[`${key}Timestamp`] = Date.now()
}

// ========== 实时数据源 ==========

async function fetchToutiaoHot() {
  try {
    const url = 'https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc'
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
      }
    })
    if (!res.ok) return []
    const json = await res.json()
    
    const results = []
    const items = json.data || []
    
    for (const item of items) {
      if (!item.Title) continue
      
      results.push({
        title: item.Title,
        url: item.Url || `https://www.toutiao.com/trending/${item.ClusterIdStr}/`,
        cover: item.Image?.url || '',
        summary: item.Title,
        source: '今日头条',
        category: mapCategory(item.InterestCategory),
        time: new Date().toISOString().split('T')[0],
      })
    }

    console.log(`[news] 今日头条热搜获取 ${results.length} 条`)
    return results
  } catch (err) {
    console.error('[news] 今日头条获取失败:', err.message)
    return []
  }
}

async function fetchBaiduHot() {
  try {
    const url = 'https://top.baidu.com/board?tab=realtime'
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    })
    if (!res.ok) return []
    const html = await res.text()
    
    const matches = html.match(/"word":"([^"]+)"/g) || []
    const results = matches.map((match, i) => {
      const word = match.replace(/"word":"/, '').replace(/"$/, '')
      return {
        title: word,
        url: `https://www.baidu.com/s?wd=${encodeURIComponent(word)}`,
        cover: '',
        summary: word,
        source: '百度热搜',
        category: '日常',
        time: new Date().toISOString().split('T')[0],
      }
    })

    console.log(`[news] 百度热搜获取 ${results.length} 条`)
    return results
  } catch (err) {
    console.error('[news] 百度热搜获取失败:', err.message)
    return []
  }
}

// ========== 从新闻提取行程 ==========

// 行程关键词
const SCHEDULE_KEYWORDS = {
  filming: ['开机', '杀青', '拍摄', '剧组', '新剧', '主演', '剧集'],
  variety: ['综艺', '录制', '节目', '晚会', '春晚'],
  business: ['品牌', '代言', '活动', '发布会', '时装周', '秀场', '直播'],
  fanmeeting: ['演唱会', '音乐节', '见面会', '巡演', '签售'],
}

// 城市列表
const CITIES = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '南京', '武汉',
  '重庆', '西安', '长沙', '天津', '苏州', '青岛', '大连', '郑州',
  '昆明', '厦门', '福州', '合肥', '大理', '横店', '金华', '青岛',
  '贵州', '泸州', '嘉善', '阜阳', '厦门', '澳门',
]

// 从新闻中提取行程（只提取艺人相关新闻）
function extractScheduleFromNews(newsItems) {
  const schedules = []
  let id = 10000

  for (const news of newsItems) {
    const text = `${news.title} ${news.summary || ''}`
    
    // 严格检查：必须包含艺人关键词
    const isArtistNews = ARTIST_KEYWORDS.some(kw => text.includes(kw))
    if (!isArtistNews) continue

    // 检测类型
    let type = null
    for (const [t, keywords] of Object.entries(SCHEDULE_KEYWORDS)) {
      for (const kw of keywords) {
        if (text.includes(kw)) {
          type = t
          break
        }
      }
      if (type) break
    }
    
    if (!type) continue

    // 检测城市
    let city = '待定'
    for (const c of CITIES) {
      if (text.includes(c)) {
        city = c
        break
      }
    }

    let date = news.date || news.time || new Date().toISOString().split('T')[0]

    const typeNames = {
      filming: '影视拍摄',
      variety: '综艺录制',
      business: '商务活动',
      fanmeeting: '演出活动',
    }

    schedules.push({
      id: id++,
      date: date,
      type: type,
      typeName: typeNames[type] || '活动',
      title: news.title.slice(0, 60),
      description: (news.summary || news.title).slice(0, 200),
      location: city,
      city: city,
      time: '全天',
      source: 'news',
      newsUrl: news.url,
    })
  }

  return schedules
}

// ========== 辅助函数 ==========

function mapCategory(categories) {
  if (!categories || categories.length === 0) return '日常'
  const cat = categories[0]
  const map = {
    'entertainment': '日常',
    'sports': '体育',
    'finance': '财经',
    'education': '教育',
    'technology': '科技',
    'car': '汽车',
  }
  return map[cat] || '日常'
}

function matchesArtist(item) {
  const text = `${item.title} ${item.summary || ''}`
  return ARTIST_KEYWORDS.some(kw => text.includes(kw))
}

// ========== 核心导出 ==========

export async function fetchNews(uid = DEFAULT_UID, count = 30) {
  console.log('[news] 获取新闻...')

  if (isCacheValid('news')) {
    console.log('[news] 使用缓存数据')
    return cache.news
  }

  const [toutiaoItems, baiduItems] = await Promise.all([
    fetchToutiaoHot(),
    fetchBaiduHot(),
  ])

  const realtimeItems = [...toutiaoItems, ...baiduItems]
  const artistNews = realtimeItems.filter(matchesArtist)

  let result

  if (artistNews.length > 0) {
    console.log(`[news] 找到 ${artistNews.length} 条艺人相关新闻`)
    result = {
      data: artistNews.slice(0, count),
      source: 'realtime',
      total: artistNews.length,
      artistMatch: true,
    }
  } else {
    console.log('[news] 未找到艺人新闻')
    result = {
      data: [],
      source: 'none',
      total: 0,
      artistMatch: false,
    }
  }

  setCache('news', result)
  return result
}

// 获取行程（只从艺人相关新闻中提取）
export async function fetchSchedule(uid = DEFAULT_UID) {
  console.log('[news] 从艺人新闻提取行程...')

  if (isCacheValid('schedule')) {
    console.log('[news] 使用行程缓存')
    return cache.schedule
  }

  const [toutiaoItems, baiduItems] = await Promise.all([
    fetchToutiaoHot(),
    fetchBaiduHot(),
  ])

  const allNews = [...toutiaoItems, ...baiduItems]
  
  // 只从艺人相关新闻中提取行程
  const artistNews = allNews.filter(matchesArtist)
  const schedules = extractScheduleFromNews(artistNews)

  const result = {
    data: schedules,
    source: artistNews.length > 0 ? 'artist_news' : 'none',
    total: schedules.length,
  }

  setCache('schedule', result)
  return result
}

// 获取活动门票（从行程数据中筛选活动类）
export async function fetchEvents(uid = DEFAULT_UID) {
  console.log('[news] 获取活动门票...')

  const scheduleResult = await fetchSchedule()
  const schedule = scheduleResult.data || []
  
  // 只保留活动类（演唱会、音乐节、见面会）
  const events = schedule.filter(s => s.type === 'fanmeeting')

  return {
    data: events.map(e => ({
      ...e,
      name: e.title,
      venue: e.location,
      status: 'onsale',
      statusText: '查看来源',
      cover: 'https://picsum.photos/seed/event/600/400',
    })),
    source: 'schedule',
    total: events.length,
  }
}

export async function checkStatus() {
  const [toutiaoItems, baiduItems] = await Promise.all([
    fetchToutiaoHot(),
    fetchBaiduHot(),
  ])

  const realtimeItems = [...toutiaoItems, ...baiduItems]
  const artistCount = realtimeItems.filter(matchesArtist).length
  const schedules = extractScheduleFromNews(realtimeItems.filter(matchesArtist))

  return {
    configured: true,
    message: `实时热搜: ${realtimeItems.length} 条, 艺人相关: ${artistCount} 条, 提取行程: ${schedules.length} 条`,
    sources: {
      toutiao: toutiaoItems.length,
      baidu: baiduItems.length,
      artistNews: artistCount,
      schedules: schedules.length,
    },
  }
}
