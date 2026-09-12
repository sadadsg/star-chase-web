// 行程结构化抽取：工作室帖文 → data/schedule.json
// 用法: node scripts/extract-schedule.cjs
// 双路径：
//   文字帖 → GLM 文本模型结构化（无 key 时降级为「类型关键词+显式日期」保守抽取）
//   行程海报图 → 下载 → GLM 视觉模型抽取（无 key 时跳过，只保留原文链接）
// 所有条目经 validateItems 校验（日期窗口/城市/类型），宁缺毋滥

const fs = require('node:fs')
const path = require('node:path')
const config = require('./artists.config.cjs')
const { validateItems, mergeSchedule, classifyType, extractDatesFallback, cleanTitle } = require('./lib/schedule-model.cjs')
const { fetchText, fetchBinary, sleep } = require('./lib/http.cjs')
const glm = require('./lib/glm.cjs')

const DATA_DIR = path.join(__dirname, '..', 'data')

const TEXT_PROMPT = (post) => `你是行程信息抽取助手。以下是一条艺人工作室微博（发布于 ${post.time || '未知时间'}）。请抽取其中明确的、有日期的行程或活动安排，输出 JSON 数组，每项 {"date","city","typeName","title","description"}。
规则：
- date 为 YYYY-MM-DD；「今天/今晚/明天」等相对日期基于发布时间推算
- city 为城市名（如上海、青岛），推不出用 "待定"
- typeName 只能是：影视拍摄/综艺录制/商务活动/演出活动
- title 不超过40字，概括事项本身（如「深渊无间 18:00 爱奇艺播出」）
- 只提取明确提及日期或相对日期的事项；正文只是宣传文案没有日期就不输出该项
- 不编造、不猜测；无任何可提取事项时输出 []
帖文正文：
${post.text}
只输出 JSON 数组，不要其他文字。`

const VISION_PROMPT = (monthHint) => `这是一张艺人工作室微博发布的行程海报。请把海报中的行程条目整理为 JSON 数组，每项 {"date","city","typeName","title"}。
规则：
- date 为海报标注的日期 YYYY-MM-DD（若海报只写了几月几号，月份按 ${monthHint} 推断）
- typeName 只能是：影视拍摄/综艺录制/商务活动/演出活动
- title 为该条行程的事项名（不超过40字）
- city 为城市名，海报没写用 "待定"
- 只整理海报上明确写出的条目；日期或事项看不清就不要输出该条
- 若海报不是行程（纯产品/剧集宣传图）则输出 []
只输出 JSON 数组，不要其他文字。`

function findCity(text) {
  return config.cities.find(c => text.includes(c)) || '待定'
}

// 文字路径（无 GLM 降级）：类型命中 + 显式日期才产出
function extractFromTextFallback(post) {
  const type = classifyType(post.text, config.scheduleKeywords)
  if (!type) return []
  const dates = extractDatesFallback(post.text, post.time)
  return dates.map(date => ({
    date,
    type,
    typeName: config.typeNames[type],
    title: cleanTitle(post.text) || '工作室行程更新',
    description: post.text.slice(0, 200),
    city: findCity(post.text),
    source: 'studio_weibo',
    postId: post.id,
    newsUrl: post.detailUrl,
  }))
}

// GLM 文本抽取（失败抛错由调用方降级）
async function extractFromTextGLM(post) {
  const content = await glm.chat({
    model: glm.textModel(),
    messages: [{ role: 'user', content: TEXT_PROMPT(post) }],
  })
  const arr = glm.extractJSON(content)
  const postId = post.id
  const newsUrl = post.detailUrl
  return (Array.isArray(arr) ? arr : []).map(it => ({ ...it, source: 'studio_weibo', postId, newsUrl }))
}

// GLM 视觉抽取：下载海报 → base64 → glm-4v
async function extractFromPic(picUrl, monthHint) {
  const buf = await fetchBinary(picUrl)
  const mime = /\.png($|\?)/i.test(picUrl) ? 'image/png' : 'image/jpeg'
  const b64 = buf.toString('base64')
  if (b64.length > 8 * 1024 * 1024) throw new Error('图片过大')
  const content = await glm.chat({
    model: glm.visionModel(),
    timeoutMs: 120000,
    messages: [{
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: `data:${mime};base64,${b64}` } },
        { type: 'text', text: VISION_PROMPT(monthHint) },
      ],
    }],
  })
  const arr = glm.extractJSON(content)
  return Array.isArray(arr) ? arr : []
}

async function main() {
  const postsPath = path.join(DATA_DIR, 'weibo-posts.json')
  const schedulePath = path.join(DATA_DIR, 'schedule.json')

  if (!fs.existsSync(postsPath)) {
    console.error('[extract] 缺少 data/weibo-posts.json（先运行 fetch-weibo.cjs），保留既有 schedule.json')
    return
  }

  const hasKey = Boolean(glm.apiKey())
  if (!hasKey) {
    console.log('[extract] 未配置 ZHIPU_API_KEY，使用保守降级抽取（仅显式日期）')
  }

  const existing = fs.existsSync(schedulePath)
    ? JSON.parse(fs.readFileSync(schedulePath, 'utf8'))
    : { data: [] }

  const allRaw = []
  let glmCalls = 0
  let picsProcessed = 0
  const stats = { glmTextItems: 0, glmPicItems: 0, fallbackItems: 0, errors: 0 }

  const weiboData = JSON.parse(fs.readFileSync(postsPath, 'utf8'))

  for (const artist of config.artists) {
    const bundle = weiboData.artists && weiboData.artists[artist.id]
    const candidates = (bundle && bundle.scheduleCandidates) || []
    console.log(`[extract] ${artist.name}: ${candidates.length} 条候选帖`)

    for (const post of candidates) {
      let got = false

      if (hasKey) {
        try {
          const items = await extractFromTextGLM(post)
          allRaw.push(...items)
          stats.glmTextItems += items.length
          glmCalls++
          got = true
          await sleep(1500)
        } catch (err) {
          stats.errors++
          console.warn(`  [warn] GLM 文本抽取失败 ${post.id}: ${err.message}`)
        }
      }

      if (!got) {
        const items = extractFromTextFallback(post)
        allRaw.push(...items)
        stats.fallbackItems += items.length
      }

      // 海报图路径（仅 GLM，且限流）
      if (hasKey && post.pics && post.pics.length && picsProcessed < config.extraction.maxPicsPerRun) {
        const monthHint = `${(post.time || '').slice(0, 7)} 前后`
        for (const pic of post.pics) {
          if (picsProcessed >= config.extraction.maxPicsPerRun) break
          try {
            const items = await extractFromPic(pic, monthHint)
            allRaw.push(...items.map(it => ({
              ...it, source: 'studio_weibo', postId: post.id, newsUrl: post.detailUrl,
            })))
            stats.glmPicItems += items.length
            picsProcessed++
            glmCalls++
            await sleep(2000)
          } catch (err) {
            stats.errors++
            console.warn(`  [warn] GLM 视觉抽取失败 ${pic.slice(0, 60)}: ${err.message}`)
          }
        }
      }
    }
  }

  const { items, dropped } = validateItems(allRaw, {
    cities: config.cities,
    typeNames: config.typeNames,
    dateWindowMonths: config.extraction.dateWindowMonths,
  })

  const merged = mergeSchedule(existing.data, items, {
    retentionDays: config.extraction.scheduleRetentionDays,
  })

  const out = {
    data: merged,
    total: merged.length,
    updatedAt: new Date().toISOString(),
    source: 'studio_weibo',
    runStats: {
      validated: items.length,
      dropped: dropped.length,
      dropReasons: dropped.reduce((acc, d) => ({ ...acc, [d.reason]: (acc[d.reason] || 0) + 1 }), {}),
      glmCalls,
      ...stats,
    },
  }

  fs.writeFileSync(schedulePath, JSON.stringify(out, null, 2))
  console.log(`[extract] 校验通过 ${items.length} 条（丢弃 ${dropped.length}），schedule.json 合计 ${merged.length} 条`)
  if (dropped.length) {
    console.log(`[extract] 丢弃原因分布: ${JSON.stringify(out.runStats.dropReasons)}`)
  }
}

main().catch(err => {
  console.error('[extract] Error:', err)
  process.exit(1)
})
