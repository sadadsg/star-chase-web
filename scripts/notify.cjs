// 增量通知：与「上一次用户可见的数据」对比，新行程/资讯推送到已配置的通道
// 用法: node scripts/notify.cjs（在 generate-feeds 之后运行）
// 通道（env，未配置自动跳过）:
//   WECHAT_WEBHOOK   企业微信群机器人 webhook（大陆最易得）
//   BARK_URL         Bark 服务器+key，如 https://api.day.app/yourkey
//   TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
//   NOTIFY_DRY_RUN=1 只打印不发送
//
// 基线（2026-09-30 修复）：
//   原本用 `git show HEAD:data/*.json` 当「上次状态」，但 CI 从不把生成的数据 commit 回
//   main，HEAD 永远停在某次手动提交 → 每轮都把快照至今的全部数据判成新增，配了 webhook
//   就会每轮全量轰炸。现改为优先读线上已部署的 JSON（CI 中本步骤跑在 deploy 之前，
//   线上正是上一轮产物），git HEAD 降级为兜底。
//   NOTIFY_BASELINE=git 可强制走 git（仅本地排查用）

const { execSync } = require('node:child_process')
const path = require('node:path')
const config = require('./artists.config.cjs')
const { scheduleKey, newsKey, buildNotifyMessage } = require('./lib/notify-model.cjs')
const { pickBaseline, diffAgainstBaseline, SOURCE_DEPLOYED, SOURCE_GIT, SOURCE_NONE } = require('./lib/notify-baseline.cjs')

const DATA_DIR = path.join(__dirname, '..', 'data')
const SITE_URL = process.env.NOTIFY_BASELINE_URL || 'https://sadadsg.github.io/star-chase-web/'

function readCurrent(name) {
  try {
    return JSON.parse(require('node:fs').readFileSync(path.join(DATA_DIR, name), 'utf8')).data || []
  } catch {
    return []
  }
}

function readPreviousFromGit(name) {
  try {
    const out = execSync(`git show HEAD:data/${name}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
    return JSON.parse(out).data || []
  } catch {
    return null // 首次运行/无历史
  }
}

// 读取线上已部署的产物作为基线。任何失败都返回 null，绝不抛出 —— 拿不到就退回 git。
async function readDeployed(name) {
  try {
    const res = await fetch(`${SITE_URL}api/${name}`, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) return null
    const json = await res.json()
    return Array.isArray(json.data) ? json.data : null
  } catch {
    return null
  }
}

async function resolveBaseline(name) {
  const forceGit = process.env.NOTIFY_BASELINE === 'git'
  const deployed = forceGit ? null : await readDeployed(name)
  return pickBaseline({ deployed, gitHead: readPreviousFromGit(name) })
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

  const scheduleBase = await resolveBaseline('schedule.json')
  const newsBase = await resolveBaseline('news.json')

  const SOURCE_LABEL = { [SOURCE_DEPLOYED]: '线上产物', [SOURCE_GIT]: 'git HEAD', [SOURCE_NONE]: '无' }
  console.log(`[notify] 基线来源: schedule=${SOURCE_LABEL[scheduleBase.source]} news=${SOURCE_LABEL[newsBase.source]}`)

  if (scheduleBase.data === null && newsBase.data === null) {
    console.log('[notify] 无可用基线（首次部署），跳过通知避免全量轰炸')
    return
  }

  const scheduleNew = diffAgainstBaseline(readCurrent('schedule.json'), scheduleBase.data, scheduleKey)
  const newsNew = diffAgainstBaseline(readCurrent('news.json'), newsBase.data, newsKey)

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
  const failed = []
  for (const [name, channel] of active) {
    try {
      await channel.send(message, title)
      console.log(`[notify] ${name} ✓`)
    } catch (err) {
      failures++
      failed.push(name)
      console.error(`[notify] ${name} 失败: ${err.message}`)
    }
  }
  console.log(`[notify] 完成：${active.length - failures}/${active.length} 个通道成功`)
  // GitHub Actions 会在有 ::warning:: 时于运行摘要里高亮，避免通道静默失效
  if (failures > 0) {
    console.log(`::warning::[notify] 推送通道部分失败（${failed.join(', ')}），数据仍已正常部署，检查对应 webhook/token 是否有效`)
  }
}

main().catch(err => {
  console.error('[notify] Error:', err.message)
  process.exit(0) // 通知失败不阻塞部署
})
