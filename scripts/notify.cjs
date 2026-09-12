// 增量通知：与 git HEAD 的数据文件对比，新行程/资讯推送到已配置的通道
// 用法: node scripts/notify.cjs（在 generate-feeds 之后运行）
// 通道（env，未配置自动跳过）:
//   WECHAT_WEBHOOK   企业微信群机器人 webhook（大陆最易得）
//   BARK_URL         Bark 服务器+key，如 https://api.day.app/yourkey
//   TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
//   NOTIFY_DRY_RUN=1 只打印不发送

const { execSync } = require('node:child_process')
const path = require('node:path')
const config = require('./artists.config.cjs')
const { scheduleKey, newsKey, diffByKey, buildNotifyMessage } = require('./lib/notify-model.cjs')

const DATA_DIR = path.join(__dirname, '..', 'data')
const SITE_URL = 'https://sadadsg.github.io/star-chase-web/'

function readCurrent(name) {
  try {
    return JSON.parse(require('node:fs').readFileSync(path.join(DATA_DIR, name), 'utf8')).data || []
  } catch {
    return []
  }
}

function readPrevious(name) {
  try {
    const out = execSync(`git show HEAD:data/${name}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
    return JSON.parse(out).data || []
  } catch {
    return null // 首次运行/无历史
  }
}

async function postJSON(url, payload) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 120)}`)
    return res.json().catch(() => ({}))
  } finally {
    clearTimeout(timer)
  }
}

// 各通道发送实现（payload 差异收口在这里）
const channels = {
  wechat: {
    enabled: () => Boolean(process.env.WECHAT_WEBHOOK),
    send: (msg, title) => postJSON(process.env.WECHAT_WEBHOOK, {
      msgtype: 'text',
      text: { content: `${title}\n${msg}` },
    }),
  },
  bark: {
    enabled: () => Boolean(process.env.BARK_URL),
    send: (msg, title) => postJSON(`${process.env.BARK_URL.replace(/\/$/, '')}/push`, {
      title,
      body: msg,
      group: 'star-chase',
      url: SITE_URL,
    }),
  },
  telegram: {
    enabled: () => Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    send: (msg, title) => postJSON(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      { chat_id: process.env.TELEGRAM_CHAT_ID, text: `${title}\n${msg}`, disable_web_page_preview: true }
    ),
  },
}

async function main() {
  const artistName = config.artists[0].name
  const title = `嘉期如梦 · ${artistName}官方更新`

  const prevSchedule = readPrevious('schedule.json')
  const prevNews = readPrevious('news.json')
  if (prevSchedule === null && prevNews === null) {
    console.log('[notify] git 无历史数据（首次运行），跳过通知避免全量轰炸')
    return
  }

  const scheduleNew = prevSchedule === null ? [] : diffByKey(readCurrent('schedule.json'), prevSchedule, scheduleKey)
  const newsNew = prevNews === null ? [] : diffByKey(readCurrent('news.json'), prevNews, newsKey)

  if (scheduleNew.length === 0 && newsNew.length === 0) {
    console.log('[notify] 无新增，不推送')
    return
  }

  const { message, meta } = buildNotifyMessage({ scheduleNew, newsNew })
  console.log(`[notify] 新增 行程 ${scheduleNew.length} 条 / 资讯 ${newsNew.length} 条`)

  if (process.env.NOTIFY_DRY_RUN === '1') {
    console.log('[notify] DRY_RUN 消息内容：')
    console.log('---')
    console.log(`${title}\n${message}`)
    console.log('---')
    return
  }

  const active = Object.entries(channels).filter(([, c]) => c.enabled())
  if (active.length === 0) {
    console.log('[notify] 未配置任何推送通道（WECHAT_WEBHOOK / BARK_URL / TELEGRAM_*），跳过发送')
    return
  }

  let failures = 0
  for (const [name, channel] of active) {
    try {
      await channel.send(message, title)
      console.log(`[notify] ${name} ✓`)
    } catch (err) {
      failures++
      console.error(`[notify] ${name} 失败: ${err.message}`)
    }
  }
  console.log(`[notify] 完成：${active.length - failures}/${active.length} 个通道成功`)
}

main().catch(err => {
  console.error('[notify] Error:', err.message)
  process.exit(0) // 通知失败不阻塞部署
})
