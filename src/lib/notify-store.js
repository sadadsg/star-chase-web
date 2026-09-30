// 浏览器内行程提醒的纯逻辑 —— 供 src（ESM）与 Service Worker 共用
//
// 背景：服务端推送通道（企微/Bark/Telegram）需要用户配 secret，没配就完全没有提醒能力。
// 但本站的数据是静态 JSON + Service Worker stale-while-revalidate，天然可以零后端做提醒：
// 每次拿到新的 schedule.json，跟本地记录的已知 postId 比对，出现新条目就弹原生 Notification。
//
// sw.js 无法 import src/ 下的 ESM，所以 public/sw.js 里有一份等价的内联实现。
// 两边必须保持一致，改动时同步修改。

// localStorage / Cache API 里存放「已知行程」的键
export const KNOWN_KEY = 'star_chase_known_schedule'
export const KNOWN_CACHE = 'star-chase-known'
export const KNOWN_REQUEST_PATH = '/__known_schedule'

/**
 * 取出可用的行程条目身份键。
 * 优先 postId（数据里唯一稳定标识）；退化到 newsUrl；都没有则返回 null 跳过。
 * 注意：不能退化到 date+title —— 标题是 60 字截断的原文，官方改文案就会误判成新行程。
 * @param {object} item
 * @returns {string|null}
 */
export function postKey(item) {
  if (!item) return null
  if (item.postId !== undefined && item.postId !== null && item.postId !== '') return String(item.postId)
  if (item.newsUrl) return String(item.newsUrl)
  return null
}

/**
 * current 中不在 known 里的条目（保持 current 顺序）
 * known 为空集合（首次开启）时返回全部 —— 首次打开就该把现有行程告知用户
 * @param {Array} current
 * @param {Iterable<string>|Array<string>} known
 * @returns {Array}
 */
export function diffNewPosts(current, known) {
  const seen = new Set(known || [])
  return (current || []).filter(item => {
    const key = postKey(item)
    if (!key) return false
    return !seen.has(key)
  })
}

/**
 * 回收已不在数据里的键，避免集合无限增长
 * @param {Iterable<string>} known
 * @param {Array} current
 * @returns {string[]}
 */
export function pruneKnown(known, current) {
  const alive = new Set((current || []).map(postKey).filter(Boolean))
  return [...(known || [])].filter(k => alive.has(k))
}

/**
 * 生成通知内容。刻意做短：锁屏横幅只有一行，长标题会被截断
 * @param {object} item
 * @returns {{title: string, body: string, tag: string, url: string}}
 */
export function buildNotification(item) {
  const date = item.date || ''
  const time = item.time && item.time !== '全天' ? ` ${item.time}` : ''
  const title = (item.title || '官方行程更新').slice(0, 40)
  const key = postKey(item) || date
  return {
    title: '任嘉伦有新行程',
    body: `${date}${time} ${title}`.trim(),
    // 同一 postId 只保留一条通知，多次更新不会堆叠
    tag: `schedule-${key}`,
    url: `/schedule?eventId=${encodeURIComponent(key)}`,
  }
}
