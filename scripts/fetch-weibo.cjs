// 抓取艺人相关微博账号矩阵（sina 镜像页，免登录 SSR）→ data/weibo-posts.json
// 用法: node scripts/fetch-weibo.cjs
// 输出结构: { updatedAt, source, artists: { <id>: { accounts: [...], scheduleCandidates: [...], recentPosts: [...] } } }
// accounts: 每账号独立的抓取结果；scheduleCandidates/recentPosts: 全账号合并（带 accountName/accountType 标注）
// 单账号失败仅警告不阻断，其余账号照常产出

const fs = require('node:fs')
const path = require('node:path')
const config = require('./artists.config.cjs')
const { parseFeed, parseDetailPics } = require('./lib/parse-mirror.cjs')
const { classifyType, filterScheduleCandidates, countByAccountType } = require('./lib/schedule-model.cjs')
const { fetchText } = require('./lib/http.cjs')

const DETAIL_LIMIT = 8 // 每账号每次最多为多少条候选帖抓详情页配图

// 兼容新旧 config 结构：mirrorAccounts[] 优先，回退单账号 mirrorUrl
function accountsOf(artist) {
  if (Array.isArray(artist.weibo.mirrorAccounts) && artist.weibo.mirrorAccounts.length) {
    return artist.weibo.mirrorAccounts.map(m => ({
      uid: m.uid,
      name: m.name,
      type: m.type || 'studio',
      mirrorUrl: m.mirrorUrl || `https://www.sina.cn/media/${m.uid}`,
    }))
  }
  return [{ uid: artist.weibo.uid, name: artist.weibo.accountName, type: 'studio', mirrorUrl: artist.weibo.mirrorUrl }]
}

async function fetchAccount(account, artist) {
  const html = await fetchText(account.mirrorUrl)
  const posts = parseFeed(html)
  if (posts.length === 0) {
    throw new Error('镜像页解析到 0 条帖文（页面结构可能变化或被反爬）')
  }

  // 行程候选 = 命中关键词 ∩ 账号类型在白名单内。
  // 白名单外的账号（剧集/品牌/后援会）仍产出 recentPosts 进资讯流，但不进日程。
  const allowedTypes = artist.weibo.scheduleAccountTypes
  const keywordHits = posts.filter(p =>
    artist.schedulePostKeywords.some(kw => p.text.includes(kw))
  )
  const candidates = filterScheduleCandidates(
    keywordHits.map(p => ({ ...p, accountType: account.type })),
    allowedTypes
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
    uid: account.uid,
    name: account.name,
    type: account.type,
    postCount: posts.length,
    latestPostTime: posts[0].time || null,
    // 被白名单挡掉的量，供 CI 日志与上游观测
    keywordHitCount: keywordHits.length,
    excludedCount: keywordHits.length - candidates.length,
    scheduleCandidates: candidates.map(c => ({
      ...c,
      accountName: account.name,
      accountType: account.type,
      hint: classifyType(c.text, config.scheduleKeywords),
    })),
    recentPosts: posts.slice(0, artist.newsMaxPosts || 30).map(p => ({
      ...p,
      accountName: account.name,
      accountType: account.type,
    })),
  }
}

async function main() {
  console.log('[weibo] 抓取微博账号矩阵…')
  const artists = {}

  for (const artist of config.artists) {
    const accounts = accountsOf(artist)
    const results = []
    let failures = 0

    for (const account of accounts) {
      try {
        const result = await fetchAccount(account, artist)
        results.push(result)
        const filterNote = result.excludedCount > 0
          ? `，白名单外过滤 ${result.excludedCount} 条`
          : ''
        console.log(`  [${artist.id}] ${account.name}(${account.type}): ${result.postCount} 帖, 候选 ${result.scheduleCandidates.length} 条${filterNote} (最新: ${result.latestPostTime})`)
      } catch (err) {
        failures++
        console.error(`  [${artist.id}] ${account.name} 抓取失败: ${err.message}`)
      }
    }

    if (results.length === 0) {
      console.error(`  [${artist.id}] 全部账号抓取失败，跳过该艺人（保留既有数据）`)
      continue
    }
    if (failures > 0) {
      process.exitCode = 1 // 有失败但非全军覆没：标记供 CI 观测，不阻断部署
    }

    const mergedCandidates = results.flatMap(r => r.scheduleCandidates)
    const typeDist = countByAccountType(mergedCandidates)
    const allowed = (artist.weibo.scheduleAccountTypes || ['studio']).join('/')
    console.log(`  [${artist.id}] 行程候选合计 ${mergedCandidates.length} 条（白名单: ${allowed}）类型分布: ${JSON.stringify(typeDist)}`)
    // 白名单失效的自检：出现非白名单类型说明配置与实现脱节
    const leaked = Object.keys(typeDist).filter(t => !typeDist[t] || t === 'unknown' || !(artist.weibo.scheduleAccountTypes || ['studio']).includes(t))
    if (leaked.length > 0) {
      console.error(`  [${artist.id}] 警告：行程候选中出现白名单外类型 ${leaked.join('/')}，过滤逻辑可能未生效`)
      process.exitCode = 1
    }

    artists[artist.id] = {
      // 合并字段（带来源标注），供 extract-schedule / fetch-data 直接消费
      scheduleCandidates: mergedCandidates,
      recentPosts: results.flatMap(r => r.recentPosts),
      accounts: results,
      accountCount: results.length,
      failureCount: failures,
      scheduleAccountTypes: artist.weibo.scheduleAccountTypes || ['studio'],
      scheduleCandidateTypes: typeDist,
    }
  }

  if (Object.keys(artists).length === 0) {
    console.error('[weibo] 所有艺人全部账号失败，保留既有数据文件')
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
