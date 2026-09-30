// 构建期预渲染 —— 为 5 个路由各生成一份含真实数据的静态 HTML
//
// 为什么需要：站点是纯 CSR（BrowserRouter），爬虫抓到 /schedule 只能看到一个空 <div id="root">，
// 实测内页 HTML 里含「任嘉伦」的次数只有 2（只有 meta description）。
// 数据本来就是构建期静态 JSON，所以最省事的做法是在 postbuild 阶段把内容塞进 HTML，
// 而不是引入 SSR 框架（那会改变部署形态与 GitHub Pages 的适配方式）。
//
// 关键约束：预渲染只往 #root 里加静态标记，main.jsx 的 createRoot().render() 会整棵替换。
// 替换瞬间可能导致闪烁，故给根节点加 data-prerendered，由 index.css 隐藏预渲染块，
// React 挂载后由 prerender-hide.css 反向隐藏 prerendered 标记 —— 二者靠 CSS 顺序保证不同时生效。

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const DATA = path.join(ROOT, 'data')

const SITE_URL = 'https://sadadsg.github.io/star-chase-web/'
const ARTIST = '任嘉伦'

// SITE_URL 末尾已有 /，路由 path 也以 / 开头，直接拼会得到双斜杠（/web//schedule）
const absUrl = (routePath) => `${SITE_URL}${routePath === '/' ? '' : routePath.replace(/^\//, '')}`

// 路由元信息：SEO 文案 + 用哪份数据
const ROUTES = [
  {
    path: '/',
    file: 'index.html',
    title: `嘉期如梦 — ${ARTIST}官方行程聚合与日历`,
    description: `${ARTIST}工作室官方微博行程聚合、ICS 日历订阅、新闻资讯与活动信息。只收录官方公开发布内容，发布后自动更新。`,
    priority: '1.0', changefreq: 'hourly', data: ['schedule', 'news', 'events'],
  },
  {
    path: '/schedule',
    file: 'schedule/index.html',
    title: `行程日历 — 嘉期如梦`,
    description: `${ARTIST}工作室官方微博发布的行程日历，支持 ICS 订阅到手机与电脑系统日历，发布后自动更新。`,
    priority: '0.9', changefreq: 'hourly', data: ['schedule'],
  },
  {
    path: '/news',
    file: 'news/index.html',
    title: `新闻资讯 — 嘉期如梦`,
    description: `${ARTIST}工作室官方微博动态与相关资讯聚合，按月整理，发布后自动更新。`,
    priority: '0.7', changefreq: 'hourly', data: ['news'],
  },
  {
    path: '/events',
    file: 'events/index.html',
    title: `活动门票 — 嘉期如梦`,
    description: `${ARTIST}演出、商务活动汇总，内置大麦、秀动购票搜索入口，信息来自官方公开发布。`,
    priority: '0.6', changefreq: 'daily', data: ['events'],
  },
  {
    path: '/travel',
    file: 'travel/index.html',
    title: `出行推荐 — 嘉期如梦`,
    description: `选定活动与出发城市，一键查询机票与高铁。目的地以官方公布信息为准。`,
    priority: '0.5', changefreq: 'daily', data: ['schedule'],
  },
]

const TYPE_LABEL = {
  filming: '影视拍摄', variety: '综艺录制',
  business: '商务活动', fanmeeting: '演出活动',
}

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

async function readData(name) {
  const p = path.join(DATA, `${name}.json`)
  if (!existsSync(p)) return []
  try {
    const json = JSON.parse(await readFile(p, 'utf8'))
    return Array.isArray(json.data) ? json.data : []
  } catch {
    return []
  }
}

// ── 内容片段 ────────────────────────────────────────────────
function scheduleList(items) {
  if (items.length === 0) {
    return '<p class="pr-empty">暂无行程数据。行程来自工作室官方微博，发布后自动更新。</p>'
  }
  const rows = items.slice(0, 40).map((s) => {
    const city = s.city && s.city !== '待定' ? ` · ${esc(s.city)}` : ''
    const type = TYPE_LABEL[s.type] || s.typeName || '行程'
    return `<li class="pr-item">
      <span class="pr-date">${esc(s.date)}</span>
      <span class="pr-type">${esc(type)}</span>
      <span class="pr-title">${esc(s.title)}</span>
      ${city}
    </li>`
  }).join('\n')
  return `<ul class="pr-list">${rows}</ul>`
}

function newsList(items) {
  if (items.length === 0) {
    return '<p class="pr-empty">暂无资讯。资讯来自工作室官方微博与公开新闻源。</p>'
  }
  const rows = items.slice(0, 30).map((n) => {
    const src = n.source ? ` — ${esc(n.source)}` : ''
    return `<li class="pr-item"><span class="pr-title">${esc(n.title)}</span>${src}</li>`
  }).join('\n')
  return `<ul class="pr-list">${rows}</ul>`
}

function eventsList(items) {
  if (items.length === 0) {
    return '<p class="pr-empty">暂无活动信息。活动信息会从官方发布中自动提取。</p>'
  }
  const rows = items.slice(0, 30).map((e) => {
    const type = TYPE_LABEL[e.type] || e.typeName || '活动'
    return `<li class="pr-item">
      <span class="pr-date">${esc(e.date)}</span>
      <span class="pr-type">${esc(type)}</span>
      <span class="pr-title">${esc(e.title)}</span>
    </li>`
  }).join('\n')
  return `<ul class="pr-list">${rows}</ul>`
}

function bodyFor(route, data) {
  switch (route.path) {
    case '/': return `${scheduleList(data.schedule)}${newsList(data.news).replace('<ul class="pr-list">', '<ul class="pr-list pr-sub">')}`
    case '/schedule': return scheduleList(data.schedule)
    case '/news': return newsList(data.news)
    case '/events': return eventsList(data.events)
    case '/travel': return scheduleList(data.schedule.filter(s => s.type === 'fanmeeting' || s.type === 'business'))
    default: return ''
  }
}

function ldJson(route, data) {
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      url: SITE_URL,
      name: '嘉期如梦',
      description: `${ARTIST}官方行程聚合与日历`,
      inLanguage: 'zh-CN',
    },
    {
      '@type': 'WebPage',
      '@id': `${absUrl(route.path)}#webpage`,
      url: absUrl(route.path),
      name: route.title,
      description: route.description,
      isPartOf: { '@id': `${SITE_URL}#website` },
      inLanguage: 'zh-CN',
    },
  ]
  // 只在确实有行程数据时才声明 ItemList，避免生成空列表这种无意义结构化数据
  if (route.path === '/schedule' && data.schedule.length > 0) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${SITE_URL}schedule#list`,
      name: `${ARTIST}行程列表`,
      numberOfItems: data.schedule.length,
      itemListElement: data.schedule.slice(0, 40).map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: s.title,
        dateCreated: s.date,
      })),
    })
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
}

function sitemapXml(lastmod) {
  const urls = ROUTES.map((r) => {
    const loc = absUrl(r.path)
    return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`
  }).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

// 预渲染块的样式。刻意**不做** [data-prerendered]{display:none}：
// 一旦隐藏，JS 加载失败（无 JS、网络问题、脚本 404）时用户会看到完全空白页。
// 改为默认可见 —— React 挂载时 createRoot 会清空 #root 的子节点，预渲染块自然消失。
// 代价是首帧有极短的「简单列表 → 真实 UI」切换，比空白页好得多（渐进增强）。
const PRERENDER_CSS = `
.pr{font:16px/1.6 -apple-system,"PingFang SC","Helvetica Neue",sans-serif;color:#1d1d1f;padding:24px;max-width:900px;margin:0 auto}
.pr h1{font-size:30px;margin:0 0 6px;letter-spacing:-.02em}
.pr-lead{color:#6e6e73;font-size:15px;margin:0 0 22px}
.pr-list{list-style:none;padding:0;margin:0}
.pr-sub{margin-top:34px;border-top:1px solid #d2d2d7;padding-top:22px}
.pr-item{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;padding:11px 0;border-bottom:1px solid #f0f0f2;font-size:15px}
.pr-date{font-variant-numeric:tabular-nums;color:#6e6e73;font-size:14px;min-width:88px}
.pr-type{font-size:12px;padding:2px 9px;border-radius:980px;background:#f5f5f7;color:#424245}
.pr-title{color:#1d1d1f}
.pr-empty{color:#86868b;font-size:15px;padding:14px 0}
`

function inject(html, { title, description, url, body, ld, css }) {
  let out = html
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  out = out.replace(
    /(<meta name="description" content=")[^"]*(")/,
    `$1${esc(description)}$2`
  )
  out = out.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${url}$2`
  )
  // og / twitter 同步
  out = out.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
  out = out.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
  out = out.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
  out = out.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
  out = out.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`)

  // 预渲染块：包在 #root 的**子元素**里，React 挂载时会把 #root 的子节点整体替换掉，
  // 预渲染块随之消失。不能把 data-prerendered 直接挂在 #root 上 ——
  // createRoot 只清空子节点、不删容器自身属性，那样 [data-prerendered]{display:none}
  // 会把整个应用藏起来（已实测确认）。
  const block = `<div id="root"><div data-prerendered="1">${body}</div></div>
<style>${css}</style>
<script type="application/ld+json">${ld}</script>`
  out = out.replace('<div id="root"></div>', block)
  return out
}

async function main() {
  const template = await readFile(path.join(DIST, 'index.html'), 'utf8')
  const lastmod = new Date().toISOString().slice(0, 10)

  const data = {
    schedule: await readData('schedule'),
    news: await readData('news'),
    events: await readData('events'),
  }
  console.log(`[prerender] 数据: schedule=${data.schedule.length} news=${data.news.length} events=${data.events.length}`)

  let written = 0
  for (const route of ROUTES) {
    const html = inject(template, {
      title: route.title,
      description: route.description,
      url: absUrl(route.path),
      body: `<div class="pr"><h1>${esc(route.title.split('—')[0].trim())}</h1>
<p class="pr-lead">${esc(route.description)}</p>${bodyFor(route, data)}</div>`,
      ld: ldJson(route, data),
      css: PRERENDER_CSS,
    })
    const outPath = path.join(DIST, route.file)
    await mkdir(path.dirname(outPath), { recursive: true })
    await writeFile(outPath, html, 'utf8')
    written++
    console.log(`[prerender] ✓ ${route.file}`)
  }

  // 404 兜底页也要带内容 —— GitHub Pages 对未知路径返回 404.html，
  // deep-link 场景下爬虫/分享预览拿到的正是这个文件
  const notFound = inject(template, {
    title: `页面未找到 — 嘉期如梦`,
    description: `${ARTIST}官方行程聚合与日历`,
    url: `${SITE_URL}`,
    body: `<div class="pr"><h1>页面未找到</h1><p class="pr-lead">该地址不存在，下面是最新行程。</p>${scheduleList(data.schedule)}</div>`,
    ld: ldJson(ROUTES[0], data),
    css: PRERENDER_CSS,
  })
  await writeFile(path.join(DIST, '404.html'), notFound, 'utf8')
  console.log('[prerender] ✓ 404.html')

  await writeFile(path.join(DIST, 'sitemap.xml'), sitemapXml(lastmod), 'utf8')
  console.log(`[prerender] ✓ sitemap.xml（lastmod=${lastmod}）`)

  console.log(`[prerender] 完成：${written} 个路由 + 404 + sitemap`)
}

main().catch((err) => {
  console.error('[prerender] 失败:', err)
  process.exit(1)
})
