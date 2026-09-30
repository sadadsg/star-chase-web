const { test } = require('node:test')
const assert = require('node:assert')
const {
  pickBaseline,
  diffAgainstBaseline,
  SOURCE_DEPLOYED,
  SOURCE_GIT,
  SOURCE_NONE,
} = require('../lib/notify-baseline.cjs')

const key = n => n.title

// ── P0 回归防线 ──────────────────────────────────────────────
// 背景：CI 从不把 data/*.json commit 回 main，`git show HEAD:data/schedule.json`
// 永远是某次手动提交的快照。若把它当唯一基线，每轮 CI 都会把「快照至今的全部数据」
// 判成新增 —— 配了 webhook 就会每 7 小时全量轰炸一次。

test('pickBaseline: 优先线上产物', () => {
  const r = pickBaseline({
    deployed: [{ title: '线上A' }],
    gitHead: [{ title: 'gitA' }, { title: 'gitB' }],
  })
  assert.strictEqual(r.source, SOURCE_DEPLOYED)
  assert.deepStrictEqual(r.data, [{ title: '线上A' }])
})

test('pickBaseline: 线上拿不到时回退 git HEAD', () => {
  for (const deployed of [null, undefined]) {
    const r = pickBaseline({ deployed, gitHead: [{ title: 'gitA' }] })
    assert.strictEqual(r.source, SOURCE_GIT)
    assert.deepStrictEqual(r.data, [{ title: 'gitA' }])
  }
})

test('pickBaseline: 线上返回空数组时也回退（首次部署的线上是空壳）', () => {
  // 若把空数组当基线，diff 会把全部历史判成新增 —— 与原 bug 等价
  const r = pickBaseline({ deployed: [], gitHead: [{ title: 'gitA' }] })
  assert.strictEqual(r.source, SOURCE_GIT)
  assert.deepStrictEqual(r.data, [{ title: 'gitA' }])
})

test('pickBaseline: 两边都空 → null + SOURCE_NONE，触发首轮跳过', () => {
  for (const [d, g] of [[null, null], [[], []], [undefined, undefined], [null, []]]) {
    const r = pickBaseline({ deployed: d, gitHead: g })
    assert.strictEqual(r.data, null)
    assert.strictEqual(r.source, SOURCE_NONE)
  }
})

test('diffAgainstBaseline: 无基线时返回空数组而不是全部当新增', () => {
  const current = [{ title: 'A' }, { title: 'B' }]
  for (const baseline of [null, undefined]) {
    assert.deepStrictEqual(diffAgainstBaseline(current, baseline, key), [])
  }
})

test('diffAgainstBaseline: 正常增量（保持 current 顺序）', () => {
  const current = [{ title: 'A' }, { title: 'C' }, { title: 'B' }]
  const baseline = [{ title: 'A' }, { title: 'B' }]
  assert.deepStrictEqual(diffAgainstBaseline(current, baseline, key), [{ title: 'C' }])
})

test('diffAgainstBaseline: 线上基线比本地旧时只报真正新增的', () => {
  // 复现真实场景：线上已有 9-13 至今累积的全部数据，本地 git HEAD 只有一份旧快照。
  // 正确行为：拿线上做基线 → 0 新增，而不是全量。
  const online = [{ title: 'X1' }, { title: 'X2' }, { title: 'X3' }]
  const gitSnapshot = [{ title: 'X1' }] // 手动提交的旧快照
  const baseline = pickBaseline({ deployed: online, gitHead: gitSnapshot })

  assert.strictEqual(baseline.source, SOURCE_DEPLOYED)
  assert.deepStrictEqual(diffAgainstBaseline(online, baseline.data, key), [])

  // 若（错误地）用了 git 快照，就会炸出 2 条「新增」
  const wrong = diffAgainstBaseline(online, gitSnapshot, key)
  assert.strictEqual(wrong.length, 2, '这正是原 bug 的表现，用来说明为什么必须用线上基线')
})

test('diffAgainstBaseline: 空基线数组 → 全部当新增（这是期望行为）', () => {
  const current = [{ title: 'A' }]
  assert.deepStrictEqual(diffAgainstBaseline(current, [], key), current)
})
