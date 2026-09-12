const { test } = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')
const { parseFeed, parseDetailPics, stripTags } = require('../lib/parse-mirror.cjs')

const FIXTURES = path.join(__dirname, 'fixtures')
const feedHtml = fs.readFileSync(path.join(FIXTURES, 'mirror-feed.html'), 'utf8')
const detailHtml = fs.readFileSync(path.join(FIXTURES, 'mirror-detail.html'), 'utf8')

test('parseFeed: 从真实镜像页 fixture 解析出全部帖子', () => {
  const posts = parseFeed(feedHtml)
  assert.strictEqual(posts.length, 4)
})

test('parseFeed: 提取稳定帖子 ID、时间戳与纯文本正文', () => {
  const posts = parseFeed(feedHtml)
  const first = posts[0]
  assert.strictEqual(first.id, '5341199482487268')
  assert.strictEqual(first.detailUrl, 'https://www.sina.cn/news/detail/5341199482487268.html')
  assert.strictEqual(first.time, '2026-09-09 11:30')
  assert.ok(first.text.includes('追剧日历'), '正文含追剧日历')
  assert.ok(!/<[a-z]/.test(first.text), '正文不含 HTML 标签')
  assert.ok(first.text.includes('#剧集深渊无间#'), '话题标签保留')
})

test('parseFeed: 含「今日行程」的帖子可被找到（行程筛选的前置条件）', () => {
  const posts = parseFeed(feedHtml)
  const schedulePost = posts.find(p => p.text.includes('今日行程'))
  assert.ok(schedulePost, '存在今日行程帖')
  assert.ok(schedulePost.text.includes('陆千乔'))
})

test('parseDetailPics: 提取详情页帖子配图，排除头像与站内装饰图', () => {
  const pics = parseDetailPics(detailHtml)
  assert.ok(pics.length >= 1, '至少提取到一张帖子配图')
  assert.ok(pics.some(u => /sinaimg\.cn\/middle\//.test(u)), '含 middle 尺寸图')
  assert.ok(pics.every(u => !/tvax\d*\.sinaimg/.test(u)), '不含头像')
  assert.ok(pics.every(u => !/n\.sinaimg\.cn\/default\//.test(u)), '不含站内装饰图')
})

test('stripTags: 实体与换行处理', () => {
  assert.strictEqual(stripTags('<a href="#">A&amp;B</a>&nbsp;C'), 'A&B C')
})
