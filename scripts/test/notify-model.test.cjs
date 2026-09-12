const { test } = require('node:test')
const assert = require('node:assert')
const { scheduleKey, newsKey, diffByKey, buildNotifyMessage, truncateBytes } = require('../lib/notify-model.cjs')

const NOW = new Date(2026, 8, 12, 20, 0, 0)

test('diffByKey: 按 key 识别新增，保持顺序', () => {
  const prev = [{ date: '2026-09-20', title: '旧行程' }]
  const cur = [
    { date: '2026-09-20', title: '旧行程' },
    { date: '2026-09-25', title: '新行程A' },
    { date: '2026-10-01', title: '新行程B' },
  ]
  const added = diffByKey(cur, prev, scheduleKey)
  assert.deepStrictEqual(added.map(s => s.title), ['新行程A', '新行程B'])
})

test('diffByKey: previous 为空时全部视为新增', () => {
  const added = diffByKey([{ date: '2026-09-20', title: 'A' }], [], scheduleKey)
  assert.strictEqual(added.length, 1)
})

test('buildNotifyMessage: 完整格式（行程+资讯+链接+日期）', () => {
  const { message } = buildNotifyMessage({
    scheduleNew: [{ date: '2026-09-20', typeName: '演出活动', title: '青岛音乐节', city: '青岛' }],
    newsNew: [{ title: '新剧定档' }],
    now: NOW,
  })
  assert.ok(message.includes('官方更新 2026-09-12'))
  assert.ok(message.includes('09.20【演出活动】青岛音乐节 · 青岛'))
  assert.ok(message.includes('· 新剧定档'))
  assert.ok(message.includes('详情：https://sadadsg.github.io/star-chase-web/'))
})

test('buildNotifyMessage: 城市待定不显示、截断条数', () => {
  const scheduleNew = Array.from({ length: 8 }, (_, i) => ({
    date: `2026-10-${String(i + 1).padStart(2, '0')}`,
    typeName: '商务活动', title: `活动${i}`, city: '待定',
  }))
  const { message, meta } = buildNotifyMessage({ scheduleNew, now: NOW })
  assert.ok(!message.includes('· 待定'), '待定城市不显示')
  assert.strictEqual(meta.scheduleShown, 5)
  assert.ok(message.includes('（其余 3 条见网站）'), '溢出提示')
})

test('truncateBytes: 按字节截断且不产生半字', () => {
  const s = '嘉'.repeat(1000)
  const out = truncateBytes(s, 100)
  assert.ok(byteLengthOf(out) <= 100)
  assert.ok(out.endsWith('…'))
})

function byteLengthOf(s) {
  return Buffer.byteLength(s, 'utf8')
}

test('newsKey: 空白归一', () => {
  assert.strictEqual(newsKey({ title: 'A B　C' }), newsKey({ title: 'AB C' }))
})
