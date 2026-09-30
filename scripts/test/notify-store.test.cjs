// 浏览器内行程提醒的纯逻辑（src/lib/notify-store.js 是 ESM，从 CJS 动态 import）
const { test } = require('node:test')
const assert = require('node:assert')
const path = require('node:path')

const modPath = path.join(__dirname, '..', '..', 'src', 'lib', 'notify-store.js')
let _M
function load() {
  if (!_M) _M = import(modPath)
  return _M
}

test('postKey: 优先 postId，退化 newsUrl，都没有则 null', async () => {
  const { postKey } = await load()
  assert.strictEqual(postKey({ postId: '5341199482487268' }), '5341199482487268')
  assert.strictEqual(postKey({ postId: 534 }), '534')
  assert.strictEqual(postKey({ postId: '', newsUrl: 'https://x/1' }), 'https://x/1')
  assert.strictEqual(postKey({ newsUrl: 'https://x/1' }), 'https://x/1')
  assert.strictEqual(postKey({ title: '无标识' }), null)
  assert.strictEqual(postKey(null), null)
})

test('postKey: 不退化到 date+title（标题是 60 字截断原文，改文案会误判成新行程）', async () => {
  const { postKey } = await load()
  const item = { date: '2026-10-01', title: '某工作室行程文案' }
  assert.strictEqual(postKey(item), null, '无稳定标识时应跳过而非退化为标题')
})

test('diffNewPosts: 新条目被识别，顺序保持', async () => {
  const { diffNewPosts } = await load()
  const current = [
    { postId: '1', title: 'A' },
    { postId: '2', title: 'B' },
    { postId: '3', title: 'C' },
  ]
  const known = ['1', '3']
  assert.deepStrictEqual(diffNewPosts(current, known).map(x => x.postId), ['2'])
})

test('diffNewPosts: 首次开启（known 为空）时全部视为新增', async () => {
  const { diffNewPosts } = await load()
  const current = [{ postId: '1' }, { postId: '2' }]
  assert.strictEqual(diffNewPosts(current, []).length, 2)
  assert.strictEqual(diffNewPosts(current, null).length, 2)
  assert.strictEqual(diffNewPosts(current, undefined).length, 2)
})

test('diffNewPosts: 重复触发不重复通知（回归防线）', async () => {
  const { diffNewPosts } = await load()
  const current = [{ postId: '1' }, { postId: '2' }]
  const known = ['1', '2']
  assert.deepStrictEqual(diffNewPosts(current, known), [])
  // 再来一轮仍为空 —— SW 每次拿到 schedule.json 都会调用
  assert.deepStrictEqual(diffNewPosts(current, known), [])
})

test('diffNewPosts: 无稳定标识的条目被跳过，不会每次都弹', async () => {
  const { diffNewPosts } = await load()
  const current = [
    { title: '无 id 的条目' },
    { postId: '1' },
  ]
  assert.deepStrictEqual(diffNewPosts(current, []).map(x => x.postId), ['1'])
})

test('pruneKnown: 回收已出清条目的键，集合不无限增长', async () => {
  const { pruneKnown } = await load()
  const known = ['1', '2', '3', '4']
  const current = [{ postId: '2' }, { postId: '4' }]
  assert.deepStrictEqual(pruneKnown(known, current).sort(), ['2', '4'])
})

test('pruneKnown: 入参容错', async () => {
  const { pruneKnown } = await load()
  assert.deepStrictEqual(pruneKnown(null, [{ postId: '1' }]), [], '已知集合为空则保留结果也为空')
  assert.deepStrictEqual(pruneKnown(['1'], null), [], '当前数据为空则全部回收')
  assert.deepStrictEqual(pruneKnown(['1'], []), [])
})

test('pruneKnown: 真实滚动 120 天窗口下的稳态', async () => {
  const { diffNewPosts, pruneKnown } = await load()
  // 模拟：known 里混有 3 条已过期（retentionDays=120 会被 mergeSchedule 出清）
  let known = ['old1', 'old2', 'old3', 'live1']
  const current = [{ postId: 'live1' }, { postId: 'new1' }]
  const fresh = diffNewPosts(current, known)
  assert.deepStrictEqual(fresh.map(x => x.postId), ['new1'])
  known = pruneKnown([...known, 'new1'], current)
  assert.deepStrictEqual(known.sort(), ['live1', 'new1'])
  // 下一轮：只报真正新增的
  assert.deepStrictEqual(diffNewPosts([...current, { postId: 'new2' }], known).map(x => x.postId), ['new2'])
})

test('buildNotification: 标题固定、正文短、带稳定 tag 与深链', async () => {
  const { buildNotification } = await load()
  const n = buildNotification({ date: '2026-10-01', time: '18:00', title: '深渊无间 爱奇艺播出', postId: '999' })
  assert.strictEqual(n.title, '任嘉伦有新行程')
  assert.strictEqual(n.body, '2026-10-01 18:00 深渊无间 爱奇艺播出')
  assert.strictEqual(n.tag, 'schedule-999')
  assert.strictEqual(n.url, '/schedule?eventId=999')
})

test('buildNotification: 「全天」不带时刻，超长标题截断到 40 字', async () => {
  const { buildNotification } = await load()
  const a = buildNotification({ date: '2026-10-01', time: '全天', title: '短标题', postId: '1' })
  assert.strictEqual(a.body, '2026-10-01 短标题')

  const long = '标'.repeat(80)
  const b = buildNotification({ date: '2026-10-01', title: long, postId: '2' })
  assert.ok(b.body.length <= 40 + '2026-10-01 '.length, '标题被截断，避免锁屏横幅被切')
})

test('buildNotification: 同一 postId 产出同一 tag（更新不堆叠通知）', async () => {
  const { buildNotification } = await load()
  const a = buildNotification({ postId: '5', date: '2026-10-01', title: '旧标题' })
  const b = buildNotification({ postId: '5', date: '2026-10-01', title: '新标题' })
  assert.strictEqual(a.tag, b.tag)
})
