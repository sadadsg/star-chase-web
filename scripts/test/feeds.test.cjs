const { test } = require('node:test')
const assert = require('node:assert')
const { buildICS, buildRSS, foldICSLine, nextDay } = require('../lib/feeds.cjs')

const NOW = new Date(Date.UTC(2026, 8, 12, 8, 0, 0))
const SAMPLE = [
  {
    date: '2026-09-20', type: 'fanmeeting', typeName: '演出活动',
    title: '青岛音乐节演出', city: '青岛', description: '9月20日 音乐节, 压轴演出',
    newsUrl: 'https://www.sina.cn/news/detail/1.html',
  },
  { date: 'bad-date', type: 'business', typeName: '商务活动', title: '无效条目' },
]

test('buildICS: CRLF 行尾 + VCALENDAR 骨架 + 跳过无效日期', () => {
  const ics = buildICS(SAMPLE, { calendarName: '嘉期如梦 · 任嘉伦行程', now: NOW })
  assert.ok(!ics.includes('\n[^\r]'), '不能有裸 LF')
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n'))
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'))
  assert.ok(ics.includes('X-WR-CALNAME:嘉期如梦 · 任嘉伦行程'))
  assert.strictEqual(ics.split('BEGIN:VEVENT').length - 1, 1, '无效日期条目被跳过')
})

test('buildICS: 全天事件 DTSTART/DTEND（次日排他）+ DTSTAMP UTC', () => {
  const ics = buildICS(SAMPLE, { now: NOW })
  assert.ok(ics.includes('DTSTART;VALUE=DATE:20260920'))
  assert.ok(ics.includes('DTEND;VALUE=DATE:20260921'))
  assert.ok(ics.includes('DTSTAMP:20260912T080000Z'))
  assert.strictEqual(nextDay('2026-12-31'), '2027-01-01')
})

test('buildICS: 文本转义（逗号/分号）+ 稳定 UID', () => {
  const ics = buildICS(SAMPLE, { now: NOW })
  assert.ok(ics.includes('音乐节\\, 压轴演出'), '逗号转义')
  const again = buildICS(SAMPLE, { now: NOW })
  const uidOf = s => s.match(/UID:(.+)/)[1]
  assert.strictEqual(uidOf(ics), uidOf(again), '同输入同 UID')
  assert.ok(uidOf(ics).endsWith('@star-chase-web'))
})

test('foldICSLine: 75 字节上限折行且续行空格开头，展开可还原', () => {
  const long = 'SUMMARY:' + '嘉'.repeat(60) // 8 + 180 字节
  const folded = foldICSLine(long)
  for (const line of folded.split('\r\n')) {
    assert.ok(Buffer.byteLength(line, 'utf8') <= 75, `行不超75字节: ${Buffer.byteLength(line, 'utf8')}`)
  }
  const unfolded = folded.split('\r\n').map((l, i) => (i === 0 ? l : l.slice(1))).join('')
  assert.strictEqual(unfolded, long)
})

test('buildICS: 带时刻条目转 UTC（北京-8h），DTEND +2h；无时刻保持全天', () => {
  const ics = buildICS([
    { date: '2026-09-20', typeName: '演出活动', title: '音乐节', city: '青岛', time: '18:00' },
    { date: '2026-09-21', typeName: '商务活动', title: '全天活动' },
    { date: '2026-09-22', typeName: '商务活动', title: '早场', time: '07:00' },
  ], { calendarName: '测试', now: NOW })
  // 18:00 北京 = 10:00Z 同日
  assert.ok(ics.includes('DTSTART:20260920T100000Z'))
  assert.ok(ics.includes('DTEND:20260920T120000Z'))
  // 07:00 北京 = 23:00Z 前一日（跨日回退）
  assert.ok(ics.includes('DTSTART:20260921T230000Z'))
  // 全天条目不受影响
  assert.ok(ics.includes('DTSTART;VALUE=DATE:20260921'))
})

test('buildRSS: XML 转义 + pubDate + 条目截断', () => {
  const news = Array.from({ length: 40 }, (_, i) => ({
    title: `标题<i>${i} & "引用"`,
    url: `https://example.com/${i}`,
    time: '2026-09-12 10:30',
    summary: `摘要 ${i}`,
    source: '任嘉伦工作室',
    category: '影视',
  }))
  const rss = buildRSS(news, { siteUrl: 'https://sadadsg.github.io/star-chase-web/', now: NOW })
  assert.ok(rss.startsWith('<?xml version="1.0" encoding="UTF-8"?>'))
  assert.ok(rss.includes('&lt;i&gt;'), 'XML 转义')
  assert.ok(rss.includes('&quot;引用&quot;'))
  assert.ok(!rss.includes('标题<i>'), '原文不应未转义出现')
  assert.ok(rss.includes('<pubDate>Sat, 12 Sep 2026 02:30:00'), 'pubDate RFC822（北京10:30=UTC02:30）')
  assert.strictEqual(rss.split('<item>').length - 1, 30, '默认截断 30 条')
})
