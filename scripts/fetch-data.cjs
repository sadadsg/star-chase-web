// 资讯抓取与汇总 → data/news.json + data/events.json
// 用法: node scripts/fetch-data.cjs
// 职责（v2）：
//   1. 百度资讯搜索 + 百度热搜 → 艺人相关资讯
//   2. 工作室微博帖文（data/weibo-posts.json，由 fetch-weibo.cjs 产出）→ 并入资讯流
//   3. 增量去重合并（90 天窗口，按标题去重，容量截断）
//   4. 从 data/schedule.json（由 extract-schedule.cjs 产出）派生活动门票数据
// 不再从新闻中猜测行程 —— 行程唯一来源是工作室微博（extract-schedule.cjs）

const fs = require('node:fs')
const path = require('node:path')
const config = require('./artists.config.cjs')
const { mergeNews, cleanTitle } = require('./lib/schedule-model.cjs')
const { fetchText } = require('./lib/http.cjs')

const DATA_DIR = path.join(__dirname, '..', 'data')
const UA_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

const ALL_KEYWORDS = config.artists.flatMap(a => a.keywords)
const ARTIST_NAME = config.artists[0].name

function matchesArtist(text) {
  return ALL_KEYWORDS.some(kw => text.includes(kw))
}

function decodeHtmlEntities(str) {
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
}

// 从 URL 中提取发布日期（百度资讯结果页 URL 常带日期）
function extractDateFromUrl(url) {
  const patterns = [/\/(\d{4})(\d{2})(\d{2})\//, /\/(\d{4})\/(\d{2})\/(\d{2})/, /[-_](\d{4})(\d{2})(\d{2})[-_]/]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) {
      const date = `${m[1]}-${m[2]}-${m[3]}`
      if (!isNaN(new Date(date).getTime())) return date
    }
  }
  return null
}

function guessCategory(text) {
  if (/影视|剧|电影|主演|拍摄|开机|杀青|定档|开播|剧场/.test(text)) return '影视'
  if (/综艺|节目|晚会|录制/.test(text)) return '综艺'
  if (/时尚|品牌|代言|时装|杂志|封面|秀场|专辑/.test(text)) return '时尚'
  if (/演出|演唱会|音乐节|见面会|巡演|舞台/.test(text)) return '演出'
  return '日常'
}

// ===== 百度资讯搜索 =====
async function fetchBaiduNews() {
  const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(ARTIST_NAME)}&tn=news&rtt=1&bsst=1&cl=2&medium=0`
  const html = await fetchText(searchUrl, { headers: UA_HEADERS })
  const news = []

  // 方法1: news-title 链接
  const titleRegex = /<a[^>]*class="[^"]*news-title[^"]*"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/gi
  let m
  while ((m = titleRegex.exec(html)) !== null) {
    const url = m[1]
    const title = m[2].replace(/<[^>]*>/g, '').trim()
    if (title && title.length > 4) {
      news.push({
        title, summary: title, source: '百度资讯', url: decodeHtmlEntities(url),
        cover: '', category: guessCategory(title),
        time: extractDateFromUrl(url) || new Date().toISOString().split('T')[0],
      })
    }
  }

  // 方法2: 通用 <h3> 结果
  if (news.length === 0) {
    const h3Regex = /<h3[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h3>/gi
    while ((m = h3Regex.exec(html)) !== null) {
      const url = m[1]
      const title = m[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
      if (title && title.length > 4 && matchesArtist(title)) {
        news.push({
          title, summary: title, source: '百度搜索', url: decodeHtmlEntities(url),
          cover: '', category: guessCategory(title),
          time: extractDateFromUrl(url) || new Date().toISOString().split('T')[0],
        })
      }
    }
  }

  console.log(`[news] 百度资讯: ${news.length} 条`)
  return news
}

// ===== 百度实时热搜（备用） =====
async function fetchBaiduHot() {
  const html = await fetchText('https://top.baidu.com/board?tab=realtime', { headers: UA_HEADERS })
  const matches = html.match(/"word":"([^"]+)"/g) || []
  const news = matches
    .map(x => x.replace(/"word":"/, '').replace(/"$/, ''))
    .filter(matchesArtist)
    .map(word => ({
      title: word, summary: word, source: '百度热搜',
      url: `https://www.baidu.com/s?wd=${encodeURIComponent(word)}`,
      cover: '', category: guessCategory(word),
      time: new Date().toISOString().split('T')[0],
    }))
  console.log(`[news] 百度热搜命中: ${news.length} 条`)
  return news
}

// ===== 工作室微博帖文 → 资讯 =====
function studioPostsAsNews() {
  const postsPath = path.join(DATA_DIR, 'weibo-posts.json')
  if (!fs.existsSync(postsPath)) return []
  const bundle = JSON.parse(fs.readFileSync(postsPath, 'utf8'))
  const news = []
  for (const artist of config.artists) {
    const posts = (bundle.artists && bundle.artists[artist.id] && bundle.artists[artist.id].recentPosts) || []
    for (const p of posts) {
      const title = cleanTitle(p.text) || '工作室微博更新'
      news.push({
        title: title.slice(0, 60),
        summary: p.text.slice(0, 140),
        source: artist.weibo.accountName,
        url: p.detailUrl,
        cover: '',
        category: guessCategory(p.text),
        time: p.time || new Date().toISOString().split('T')[0],
      })
    }
  }
  console.log(`[news] 工作室微博帖文: ${news.length} 条`)
  return news
}

// ===== 活动门票（从行程派生） =====
function deriveEvents() {
  const schedulePath = path.join(DATA_DIR, 'schedule.json')
  const schedule = fs.existsSync(schedulePath)
    ? (JSON.parse(fs.readFileSync(schedulePath, 'utf8')).data || [])
    : []
  const events = schedule
    .filter(s => s.type === 'fanmeeting' || s.type === 'business')
    .map(s => ({
      ...s,
      name: s.title,
      venue: s.location || s.city,
      status: 'onsale',
      statusText: '查看来源',
      cover: '', // 零假数据：无真实海报不放占位图
      newsUrl: s.newsUrl || null,
    }))
  console.log(`[events] 从行程派生活动: ${events.length} 条`)
  return events
}

async function main() {
  console.log(`[news] 抓取「${ARTIST_NAME}」资讯…`)

  const existing = fs.existsSync(path.join(DATA_DIR, 'news.json'))
    ? JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'news.json'), 'utf8'))
    : { data: [] }

  const batches = await Promise.allSettled([fetchBaiduNews(), fetchBaiduHot()])
  const incoming = [
    ...studioPostsAsNews(),
    ...batches.flatMap(b => (b.status === 'fulfilled' ? b.value : [])),
  ]
  for (const b of batches) {
    if (b.status === 'rejected') console.error('[news] 抓取失败:', b.reason?.message || b.reason)
  }

  const merged = mergeNews(existing.data, incoming, {
    retentionDays: config.news.retentionDays,
    maxItems: config.news.maxItems,
  })

  const now = new Date().toISOString()
  fs.writeFileSync(path.join(DATA_DIR, 'news.json'), JSON.stringify({ data: merged, total: merged.length, updatedAt: now }, null, 2))
  console.log(`[news] news.json 合计 ${merged.length} 条`)

  const events = deriveEvents()
  fs.writeFileSync(path.join(DATA_DIR, 'events.json'), JSON.stringify({ data: events, total: events.length, updatedAt: now }, null, 2))
  console.log('[news] events.json 已更新')
}

main().catch(err => {
  console.error('[news] Error:', err)
  process.exit(1)
})
