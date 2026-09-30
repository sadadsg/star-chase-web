// 嘉期如梦 Service Worker
// 策略：
//   - 导航请求（页面）：网络优先，失败回退缓存的 start_url
//   - /api/*.json|ics|xml（数据）：stale-while-revalidate（先回缓存，后台更新）
//   - 构建产物 /assets/*：缓存优先（文件名带 hash，内容不可变）
//   - schedule.json 刷新后：与本地「已知行程」比对，新条目弹原生通知（零后端提醒）
// 数据文件变更频繁，缓存 KEY 随部署更新：改 VERSION 使旧缓存失效

const VERSION = 'star-chase-v2.2'
const SHELL_CACHE = `${VERSION}-shell`
const DATA_CACHE = `${VERSION}-data`
const ASSET_CACHE = `${VERSION}-assets`
// 「已知行程」集合独立于 VERSION：主题/缓存策略迭代不应让用户重新收到一遍旧行程提醒
const KNOWN_CACHE = 'star-chase-known'
const KNOWN_REQUEST = '/__known_schedule'

// ── 通知比对逻辑（与 src/lib/notify-store.js 保持一致；SW 无法 import ESM，故内联）──
function postKey(item) {
  if (!item) return null
  if (item.postId !== undefined && item.postId !== null && item.postId !== '') return String(item.postId)
  if (item.newsUrl) return String(item.newsUrl)
  return null
}

function diffNewPosts(current, known) {
  const seen = new Set(known || [])
  return (current || []).filter(item => {
    const key = postKey(item)
    return key ? !seen.has(key) : false
  })
}

function pruneKnown(known, current) {
  const alive = new Set((current || []).map(postKey).filter(Boolean))
  return [...(known || [])].filter(k => alive.has(k))
}

async function readKnown(cache) {
  try {
    const res = await cache.match(KNOWN_REQUEST)
    if (!res) return []
    const arr = await res.json()
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

async function writeKnown(cache, ids) {
  await cache.put(KNOWN_REQUEST, new Response(JSON.stringify(ids), {
    headers: { 'Content-Type': 'application/json' },
  }))
}

async function checkScheduleNotification(items) {
  if (typeof self.Notification === 'undefined') return
  // 用户没授权就不做任何事（也不写 known，保持未开启状态干净）
  if (Notification.permission !== 'granted') return

  const cache = await caches.open(KNOWN_CACHE)
  const known = await readKnown(cache)
  const fresh = diffNewPosts(items, known)

  // 首次开启（known 为空）时全部视为新增，会一次性弹很多条。
  // 只提示最早的 3 条，避免刚开启就被通知刷屏。
  const toNotify = fresh.slice(0, 3)
  for (const item of toNotify) {
    const date = item.date || ''
    const time = item.time && item.time !== '全天' ? ` ${item.time}` : ''
    const title = (item.title || '官方行程更新').slice(0, 40)
    try {
      await self.registration.showNotification('任嘉伦有新行程', {
        body: `${date}${time} ${title}`.trim(),
        tag: `schedule-${postKey(item) || date}`,
        icon: './icon-192.png',
        badge: './icon-192.png',
        data: { url: `/schedule?eventId=${encodeURIComponent(postKey(item) || '')}` },
      })
    } catch {
      // 单条失败不影响其余
    }
  }

  await writeKnown(cache, pruneKnown([...known, ...toNotify.map(postKey).filter(Boolean)], items))
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = (event.notification.data && event.notification.data.url) || '/schedule'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) return client.focus()
      }
      return self.clients.openWindow(target)
    })
  )
})

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(['./', './index.html']))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        // KNOWN_CACHE 不随 VERSION 清理：SW 升级不应让用户重新收到一遍旧行程提醒
        keys
          .filter((k) => !k.startsWith(VERSION) && k !== KNOWN_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  // 数据文件：stale-while-revalidate
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      caches.open(DATA_CACHE).then(async (cache) => {
        const cached = await cache.match(req)
        const network = fetch(req)
          .then(async (res) => {
            if (res.ok) {
              // 两个 clone：一个进缓存，一个用于解析 —— 同一个 clone 用两次会因 body 被消费而失败
              const forCache = res.clone()
              const forParse = res.clone()
              cache.put(req, forCache)
              // schedule.json 拿到新内容后比对「已知行程」，有新条目就提醒
              if (url.pathname.endsWith('/schedule.json')) {
                try {
                  const json = await forParse.json()
                  if (Array.isArray(json.data)) {
                    checkScheduleNotification(json.data).catch(() => {})
                  }
                } catch {
                  // 非 JSON 或解析失败：静默，不影响数据缓存
                }
              }
            }
            return res
          })
          .catch(() => cached)
        return cached || network
      })
    )
    return
  }

  // 带 hash 的构建产物：缓存优先
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const cached = await cache.match(req)
        if (cached) return cached
        const res = await fetch(req)
        if (res.ok) cache.put(req, res.clone())
        return res
      })
    )
    return
  }

  // 页面导航：网络优先，离线回退首页
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          caches.open(SHELL_CACHE).then((cache) => cache.put('./index.html', res.clone()))
          return res
        })
        .catch(async () => {
          const cache = await caches.open(SHELL_CACHE)
          return (await cache.match(req)) || (await cache.match('./index.html'))
        })
    )
  }
})
