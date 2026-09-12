const { test } = require('node:test')
const assert = require('node:assert')
const {
  isValidDate, monthsFromNow, validateItems, mergeSchedule, mergeNews,
  classifyType, extractDatesFallback, cleanTitle,
} = require('../lib/schedule-model.cjs')

const CFG = {
  cities: ['上海', '青岛', '北京'],
  typeNames: { filming: '影视拍摄', variety: '综艺录制', business: '商务活动', fanmeeting: '演出活动' },
  dateWindowMonths: 1,
  now: new Date(Date.UTC(2026, 8, 12)), // 2026-09-12 固定时钟
}

const good = { date: '2026-09-20', type: 'fanmeeting', title: '青岛音乐节演出', city: '青岛', source: 'studio_weibo' }

test('isValidDate: 严格 YYYY-MM-DD 且真实存在', () => {
  assert.strictEqual(isValidDate('2026-09-12'), true)
  assert.strictEqual(isValidDate('2026-9-12'), false)
  assert.strictEqual(isValidDate('2026-02-30'), false)
  assert.strictEqual(isValidDate(null), false)
})

test('monthsFromNow: 跨年计算', () => {
  assert.strictEqual(monthsFromNow('2026-09-20', CFG.now), 0)
  assert.strictEqual(monthsFromNow('2026-10-01', CFG.now), 1)
  assert.strictEqual(monthsFromNow('2026-08-01', CFG.now), -1)
  assert.strictEqual(monthsFromNow('2027-01-01', CFG.now), 4)
})

test('validateItems: 合法条目通过并补全 typeName', () => {
  const { items, dropped } = validateItems([good], CFG)
  assert.strictEqual(items.length, 1)
  assert.strictEqual(items[0].typeName, '演出活动')
  assert.strictEqual(dropped.length, 0)
})

test('validateItems: 中文 typeName 映射为类型 key', () => {
  const { items } = validateItems([{ ...good, type: undefined, typeName: '商务活动' }], CFG)
  assert.strictEqual(items[0].type, 'business')
})

test('validateItems: 各种脏数据按原因丢弃（宁缺毋滥）', () => {
  const raw = [
    { ...good, title: '' },                                // empty_title
    { ...good, date: '2026-09-2' },                        // bad_date
    { ...good, date: '2027-06-01' },                       // date_out_of_window
    { ...good, type: 'unknown', typeName: '外星活动' },      // bad_type
    { ...good, city: '克拉玛依' },                           // unknown_city
  ]
  const { items, dropped } = validateItems(raw, CFG)
  assert.strictEqual(items.length, 0)
  assert.deepStrictEqual(dropped.map(d => d.reason), [
    'empty_title', 'bad_date', 'date_out_of_window', 'bad_type', 'unknown_city',
  ])
})

test('mergeSchedule: 按 date+title 去重、过期出清、日期升序', () => {
  const existing = [
    { date: '2026-09-20', title: '甲', type: 'business' },
    { date: '2025-01-01', title: '过期行程', type: 'business' },
  ]
  const incoming = [
    { date: '2026-09-20', title: '甲', type: 'business' }, // 重复
    { date: '2026-10-05', title: '乙', type: 'filming' },
  ]
  const merged = mergeSchedule(existing, incoming, { retentionDays: 120, now: CFG.now })
  assert.deepStrictEqual(merged.map(s => s.title), ['甲', '乙'])
  assert.ok(merged[0].date <= merged[1].date)
})

test('mergeNews: 去重、倒序、容量截断、无日期条目保留', () => {
  const existing = [
    { title: '旧闻', time: '2026-05-01', source: '百度搜索' },
    { title: '无日期帖', time: '', source: '工作室微博' },
  ]
  const incoming = [
    { title: '新闻B', time: '2026-09-11' },
    { title: '新聞B'.replace('聞', '闻'), time: '2026-09-12' }, // 与新聞B同标题 → 去重后保留后者
    { title: '旧闻', time: '2026-05-01' },                      // 重复
  ]
  const merged = mergeNews(existing, incoming, { retentionDays: 90, maxItems: 10, now: CFG.now })
  const titles = merged.map(n => n.title)
  assert.strictEqual(titles.filter(t => t === '新聞B'.replace('聞', '闻')).length, 1)
  assert.ok(!titles.includes('旧闻'), '窗口外旧闻被出清')
  assert.ok(titles.includes('无日期帖'), '无日期条目保留')
  const times = merged.filter(n => n.time).map(n => n.time)
  assert.deepStrictEqual(times, [...times].sort().reverse())
})

test('classifyType: 按配置顺序命中', () => {
  const KW = {
    fanmeeting: ['演唱会', '音乐节', '见面会', '舞台'],
    filming: ['追剧日历', '锁定', '开播'],
    business: ['品牌', '直播', '专辑'],
  }
  assert.strictEqual(classifyType('今晚18:00锁定爱奇艺迷雾剧场', KW), 'filming')
  assert.strictEqual(classifyType('演唱会预售开启', KW), 'fanmeeting')
  assert.strictEqual(classifyType('全新专辑上线', KW), 'business')
  assert.strictEqual(classifyType('随手拍的猫', KW), null)
})

test('extractDatesFallback: 显式日期与相对日期', () => {
  const base = '2026-09-09 11:30'
  assert.deepStrictEqual(extractDatesFallback('9月20日 见面会', base), ['2026-09-20'])
  assert.ok(extractDatesFallback('2026-10-01 定档', base).includes('2026-10-01'))
  assert.deepStrictEqual(extractDatesFallback('今晚18:00 锁定剧场', base), ['2026-09-09'])
  assert.deepStrictEqual(extractDatesFallback('明天见', base), ['2026-09-10'])
  assert.deepStrictEqual(extractDatesFallback('没有任何日期', base), [])
})

test('extractDatesFallback: 无 postTime 时回退当前时间且不崩溃', () => {
  const out = extractDatesFallback('明天见', '')
  assert.strictEqual(out.length, 1)
})

test('cleanTitle: 去超话标记、话题、@、链接与零宽字符', () => {
  const raw = '#任嘉伦[超话]# #剧集深渊无间# 今晚18:00 锁定爱奇艺迷雾剧场 @任嘉伦Allen https://t.cn/abc \u200b'
  assert.strictEqual(cleanTitle(raw), '今晚18:00 锁定爱奇艺迷雾剧场')
})
