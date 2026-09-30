const { test } = require('node:test')
const assert = require('node:assert')
const {
  DEFAULT_SCHEDULE_ACCOUNT_TYPES,
  isScheduleAccountType,
  filterScheduleCandidates,
  countByAccountType,
  mergeSchedule,
  validateItems,
} = require('../lib/schedule-model.cjs')

test('默认白名单只认工作室官微', () => {
  assert.deepStrictEqual(DEFAULT_SCHEDULE_ACCOUNT_TYPES, ['studio'])
  assert.strictEqual(isScheduleAccountType('studio'), true)
  assert.strictEqual(isScheduleAccountType('drama'), false)
  assert.strictEqual(isScheduleAccountType('brand'), false)
  assert.strictEqual(isScheduleAccountType('fanclub'), false)
  assert.strictEqual(isScheduleAccountType(undefined), false)
})

test('白名单未配置/为空时回退 studio-only，而不是全放行', () => {
  // 回归防线：配置缺失曾导致后援会/剧集帖全部进入日程
  assert.strictEqual(isScheduleAccountType('fanclub', undefined), false)
  assert.strictEqual(isScheduleAccountType('fanclub', []), false)
  assert.strictEqual(isScheduleAccountType('fanclub', null), false)
  assert.strictEqual(isScheduleAccountType('studio', []), true)
})

test('白名单可显式放宽（想纳入品牌/剧集时）', () => {
  const wl = ['studio', 'brand']
  assert.strictEqual(isScheduleAccountType('brand', wl), true)
  assert.strictEqual(isScheduleAccountType('drama', wl), false)
})

test('filterScheduleCandidates: 后援会/剧集帖被挡在日程外', () => {
  const candidates = [
    { id: '1', accountType: 'studio', text: '10月1日 上海 行程' },
    { id: '2', accountType: 'fanclub', text: '10月2日 演唱会 应援' },
    { id: '3', accountType: 'drama', text: '10月3日 追剧日历 定档' },
    { id: '4', accountType: 'brand', text: '10月4日 直播 品牌活动' },
    { id: '5', accountType: 'studio', text: '10月5日 录制' },
  ]
  const kept = filterScheduleCandidates(candidates, ['studio'])
  assert.deepStrictEqual(kept.map(c => c.id), ['1', '5'])
  assert.strictEqual(kept.length, 2)
})

test('filterScheduleCandidates: 入参容错', () => {
  assert.deepStrictEqual(filterScheduleCandidates(null, ['studio']), [])
  assert.deepStrictEqual(filterScheduleCandidates(undefined, ['studio']), [])
  assert.deepStrictEqual(filterScheduleCandidates([], ['studio']), [])
})

test('countByAccountType: 暴露各类型候选量，供 CI 日志观测', () => {
  const dist = countByAccountType([
    { accountType: 'studio' }, { accountType: 'studio' }, { accountType: 'fanclub' },
    { accountName: '无类型账号' },
  ])
  assert.strictEqual(dist.studio, 2)
  assert.strictEqual(dist.fanclub, 1)
  assert.strictEqual(dist.unknown, 1)
  assert.deepStrictEqual(countByAccountType([]), {})
})

// ── 存量清理：mergeSchedule 按白名单自愈 ────────────────────────────────
// 背景：账号矩阵扩到 9 个号后，schedule.json 里已积压 46 条来自剧集/品牌/后援会的脏条目。
// 只在 fetch 侧过滤不够 —— 存量必须一并清掉，否则要等 120 天 retention 自然过期。

test('mergeSchedule: 白名单外来源的存量条目被清除', () => {
  const polluted = [
    { date: '2026-09-20', title: '爱奇艺追剧日历', accountType: 'drama' },
    { date: '2026-09-21', title: '后援会应援', accountType: 'fanclub' },
    { date: '2026-09-22', title: '品牌直播', accountType: 'brand' },
    { date: '2026-09-23', title: '工作室行程', accountType: 'studio' },
  ]
  const out = mergeSchedule(polluted, [], { allowedAccountTypes: ['studio'] })
  assert.deepStrictEqual(out.map(s => s.title), ['工作室行程'])
  assert.strictEqual(out.dropped.sourceNotAllowed, 3)
})

test('mergeSchedule: 无 accountType 的历史条目视为不合规并清除', () => {
  // 2026-09-30 之前写入的条目都没有 accountType 字段，无法证明来源可信
  const legacy = [
    { date: '2026-09-20', title: '来路不明的条目' },
    { date: '2026-09-23', title: '工作室行程', accountType: 'studio' },
  ]
  const out = mergeSchedule(legacy, [], { allowedAccountTypes: ['studio'] })
  assert.deepStrictEqual(out.map(s => s.title), ['工作室行程'])
  assert.strictEqual(out.dropped.sourceNotAllowed, 1)
})

test('mergeSchedule: 不传白名单时保持旧行为（向后兼容）', () => {
  const items = [
    { date: '2026-09-20', title: 'A' },
    { date: '2026-09-21', title: 'B', accountType: 'fanclub' },
  ]
  const out = mergeSchedule(items, [], {})
  assert.strictEqual(out.length, 2)
  assert.strictEqual(out.dropped.sourceNotAllowed, 0)
})

test('validateItems: accountType 随条目透传，供 merge 阶段判来源', () => {
  const { items } = validateItems(
    [{ date: '2026-10-01', typeName: '影视拍摄', title: 'X', city: '上海', accountType: 'studio' }],
    { cities: ['上海'], typeNames: { filming: '影视拍摄' } }
  )
  assert.strictEqual(items[0].accountType, 'studio')
})

test('全链路：9 账号矩阵 → 白名单过滤 → 抽取 → 合并，只剩工作室条目', () => {
  // 复现线上 2026-09-30 的真实分布
  const mk = (accountType, date, text) => ({ accountType, date, title: text, text })
  const candidates = [
    ...Array(10).fill(0).map((_, i) => mk('studio', `2026-10-0${(i % 9) + 1}`, `工作室行程${i}`)),
    ...Array(23).fill(0).map((_, i) => mk('drama', `2026-10-0${(i % 9) + 1}`, `追剧日历${i}`)),
    ...Array(21).fill(0).map((_, i) => mk('drama', `2026-10-0${(i % 9) + 1}`, `播出${i}`)),
    ...Array(15).fill(0).map((_, i) => mk('fanclub', `2026-10-0${(i % 9) + 1}`, `演唱会${i}`)),
    ...Array(2).fill(0).map((_, i) => mk('brand', `2026-10-0${(i % 9) + 1}`, `直播${i}`)),
  ]
  const kept = filterScheduleCandidates(candidates, ['studio'])
  assert.strictEqual(kept.length, 10)
  assert.deepStrictEqual(countByAccountType(kept), { studio: 10 })

  const merged = mergeSchedule([], kept, { allowedAccountTypes: ['studio'] })
  assert.strictEqual(merged.length, 10)
  assert.ok(merged.every(s => s.accountType === 'studio'))
  // 其余 61 条（drama/fanclub/brand）在合并阶段也不应回流
  assert.strictEqual(merged.filter(s => s.accountType !== 'studio').length, 0)
})
