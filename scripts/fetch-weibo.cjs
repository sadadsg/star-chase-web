// 抓取艺人工作室微博（sina 镜像页，免登录 SSR）→ data/weibo-posts.json
// 用法: node scripts/fetch-weibo.cjs
// 输出结构: { updatedAt, source, artists: { <id>: { accountName, postCount, scheduleCandidates[] } } }
// scheduleCandidates: 含行程关键词的帖文（附详情页配图 URL），供 extract-schedule.cjs 消费

const fs = require('node:fs')
const path = require('node:path')
const config = require('./artists.config.cjs')
const { parseFeed, parseDetailPics } = require('./lib/parse-mirror.cjs')
const { classifyType } = require('./lib/schedule-model.cjs')
const { fetchText } = require('./lib/http.cjs')

const DETAIL_LIMIT = 8 // 每次最多为多少条候选帖抓详情页配图

async function fetchArtist(artist) {
  const html = await fetchText(artist.weibo.mirrorUrl)
  const posts = parseFeed(html)
  if (posts.length === 0) {
    throw new Error('镜像页解析到 0 条帖文（页面结构可能变化或被反爬）')
  }

  const candidates = posts.filter(p =>
    artist.schedulePostKeywords.some(kw => p.text.includes(kw))
  )

  for (const cand of candidates.slice(0, DETAIL_LIMIT)) {
    try {
      const detailHtml = await fetchText(cand.detailUrl)
      cand.pics = parseDetailPics(detailHtml)
    } catch (err) {
      console.warn(`  [warn] 详情页抓取失败 ${cand.id}: ${err.message}`)
      cand.pics = []
    }
  }

  return {
    accountName: artist.weibo.accountName,
    postCount: posts.length,
    latestPostTime: posts[0].time || null,
    scheduleCandidates: candidates.map(c => ({
      ...c,
      hint: classifyType(c.text, config.scheduleKeywords),
    })),
    // 最近帖文（供 fetch-data.cjs 并入资讯流）
    recentPosts: posts.slice(0, artist.newsMaxPosts || 30),
  }
}

async function main() {
  console.log('[weibo] 抓取工作室微博镜像…')
  const artists = {}
  let failures = 0

  for (const artist of config.artists) {
    try {
      artists[artist.id] = await fetchArtist(artist)
      const { postCount, scheduleCandidates, latestPostTime } = artists[artist.id]
      console.log(`  [${artist.id}] ${artist.weibo.accountName}: ${postCount} 帖, 候选行程帖 ${scheduleCandidates.length} 条 (最新: ${latestPostTime})`)
    } catch (err) {
      failures++
      console.error(`  [${artist.id}] 抓取失败: ${err.message}`)
    }
  }

  if (failures === config.artists.length) {
    console.error('[weibo] 全部艺人抓取失败，保留既有数据文件')
    process.exitCode = 1
    return
  }

  const out = {
    updatedAt: new Date().toISOString(),
    source: 'sina_mirror',
    artists,
  }

  const dataDir = path.join(__dirname, '..', 'data')
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(path.join(dataDir, 'weibo-posts.json'), JSON.stringify(out, null, 2))
  console.log(`[weibo] 已写入 data/weibo-posts.json`)
}

main().catch(err => {
  console.error('[weibo] Error:', err)
  process.exit(1)
})
