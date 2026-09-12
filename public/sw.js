// 嘉期如梦 Service Worker
// 策略：
//   - 导航请求（页面）：网络优先，失败回退缓存的 start_url
//   - /api/*.json|ics|xml（数据）：stale-while-revalidate（先回缓存，后台更新）
//   - 构建产物 /assets/*：缓存优先（文件名带 hash，内容不可变）
// 数据文件变更频繁，缓存 KEY 随部署更新：改 VERSION 使旧缓存失效

const VERSION = 'star-chase-v2.1'
const SHELL_CACHE = `${VERSION}-shell`
const DATA_CACHE = `${VERSION}-data`
const ASSET_CACHE = `${VERSION}-assets`

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
        keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))
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
          .then((res) => {
            if (res.ok) cache.put(req, res.clone())
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
