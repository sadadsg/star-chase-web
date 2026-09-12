// sina.cn/media/<uid> 镜像页 SSR 解析 —— 纯函数，无网络请求
// 信息流结构（2026-09 实测）：
//   <a class="post-link" href="/news/detail/<mid>.html">
//     <article class="post">
//       <div class="post-head">…<div class="meta"><div class="uname">…</div>
//         <div class="time">2026-09-09 11:30<span class="src">来自…</span></div></div></div>
//       <div class="post-text">正文…</div>
//       …
//     </article>
//   </a>
// 详情页结构：正文图片为 wx*/n.sinaimg.cn/{middle,large,orj…}/…jpg，头像为 tvax*.sinaimg.cn/crop…

function stripTags(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim()
}

// 解析信息流页 → [{ id, detailUrl, time, text }]
function parseFeed(html) {
  const posts = []
  const re = /<a class="post-link" href="(\/news\/detail\/(\d+)\.html)">([\s\S]*?)<\/article>/g
  let m
  while ((m = re.exec(html)) !== null) {
    const [, href, mid, block] = m
    const textMatch = block.match(/<div class="post-text">([\s\S]*?)<\/div>/)
    if (!textMatch) continue
    const timeMatch = block.match(/<div class="time">([^<]+)</)
    posts.push({
      id: mid,
      detailUrl: `https://www.sina.cn${href}`,
      time: timeMatch ? timeMatch[1].trim() : '',
      text: stripTags(textMatch[1]),
    })
  }
  return posts
}

// 解析详情页 → 帖子配图 URL 列表（排除头像/站内装饰图）
function parseDetailPics(html) {
  const urls = []
  const re = /<img[^>]+src="(https?:\/\/[^"]+sinaimg\.cn\/[^"]+)"/g
  let m
  while ((m = re.exec(html)) !== null) {
    const url = m[1]
    if (/tvax\d*\.sinaimg/.test(url)) continue // 头像
    if (/\/crop\./.test(url)) continue // 裁剪头像
    if (/n\.sinaimg\.cn\/default\//.test(url)) continue // 新浪站内装饰图
    if (urls.indexOf(url) === -1) urls.push(url)
  }
  return urls
}

module.exports = { parseFeed, parseDetailPics, stripTags }
