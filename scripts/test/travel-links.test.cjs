// 购票深链生成 —— 直接 import 前端 ESM 模块（node --test 支持 CJS 内动态 import ESM）
const { test } = require('node:test')
const assert = require('node:assert')
const path = require('node:path')

// src/lib/travel-links.js 是前端 ESM 模块，从 CJS 测试里用动态 import 加载并缓存。
// 注意：不能在模块顶层解构 —— before() 钩子早于顶层 test 注册执行。
const modPath = path.join(__dirname, '..', '..', 'src', 'lib', 'travel-links.js')
let _TL
function load() {
  if (!_TL) _TL = import(modPath)
  return _TL
}

test('normalizeCity: 「待定」/空值 → null，其余原样', async () => {
  const { normalizeCity } = await load()
  assert.strictEqual(normalizeCity('待定'), null)
  assert.strictEqual(normalizeCity(' 待定 '), null)
  assert.strictEqual(normalizeCity(''), null)
  assert.strictEqual(normalizeCity('   '), null)
  assert.strictEqual(normalizeCity(undefined), null)
  assert.strictEqual(normalizeCity(null), null)
  assert.strictEqual(normalizeCity('上海'), '上海')
  assert.strictEqual(normalizeCity(' 上海 '), '上海')
})

test('hasTravelCodes: 只有码表覆盖的城市才可生成链接', async () => {
  const { hasTravelCodes } = await load()
  assert.strictEqual(hasTravelCodes('上海'), true)
  assert.strictEqual(hasTravelCodes('待定'), false)
  assert.strictEqual(hasTravelCodes('大理'), false) // 在 config.cities 里但无三字码
  assert.strictEqual(hasTravelCodes(null), false)
})

test('buildCtripFlightUrl: 用 IATA 三字码，不再是汉字 substring', async () => {
  const { buildCtripFlightUrl } = await load()
  // 回归防线：旧实现产出 oneway-北京-上海，携程打不开
  const url = buildCtripFlightUrl('北京', '上海', '2026-10-01')
  assert.strictEqual(url, 'https://flights.ctrip.com/online/list/oneway-BJS-SHA?depdate=2026-10-01')
  assert.ok(!/[一-龥]/.test(url), 'URL 不含中文')
  assert.strictEqual(buildCtripFlightUrl('上海', '成都', '2026-11-02'),
    'https://flights.ctrip.com/online/list/oneway-SHA-CTU?depdate=2026-11-02')
})

test('buildCtripFlightUrl: 目的地未知返回 null，不产出死链', async () => {
  const { buildCtripFlightUrl } = await load()
  // 线上真实数据：65/65 条 schedule 的 city 都是「待定」
  assert.strictEqual(buildCtripFlightUrl('北京', '待定', '2026-10-01'), null)
  assert.strictEqual(buildCtripFlightUrl('北京', undefined, '2026-10-01'), null)
  assert.strictEqual(buildCtripFlightUrl('待定', '上海', '2026-10-01'), null)
  assert.strictEqual(buildCtripFlightUrl('大理', '上海', '2026-10-01'), null) // 缺码
  assert.strictEqual(buildCtripFlightUrl('北京', '上海', null), null)
})

test('buildTrain12306Url: 用车站电报码，两端齐全', async () => {
  const { buildTrain12306Url } = await load()
  const url = buildTrain12306Url('北京', '上海', '2026-10-01')
  assert.ok(url.startsWith('https://kyfw.12306.cn/otn/leftTicket/init?'))
  assert.ok(url.includes('from_station=BJP'), '出发站码为 BJP')
  assert.ok(url.includes('to_station=SHH'), '到达站码为 SHH')
  assert.ok(url.includes('train_date=2026-10-01'))
  assert.ok(!/to_station=&/.test(url), '终点站码不为空')
})

test('buildTrain12306Url: 目的地未知返回 null', async () => {
  const { buildTrain12306Url } = await load()
  assert.strictEqual(buildTrain12306Url('北京', '待定', '2026-10-01'), null)
  assert.strictEqual(buildTrain12306Url('北京', null, '2026-10-01'), null)
})

test('eventKey: 用 postId 作稳定标识（schedule.json 无 id 字段）', async () => {
  const { eventKey } = await load()
  // 回归防线：旧实现用 e.id 匹配，findIndex 恒为 -1，深链从不生效
  assert.strictEqual(eventKey({ postId: '5341199482487268' }), '5341199482487268')
  assert.strictEqual(eventKey({ postId: 534 }), '534')
  assert.strictEqual(eventKey({ id: 999 }), null) // 只有 id 不够
  assert.strictEqual(eventKey({}), null)
  assert.strictEqual(eventKey(null), null)
})

test('eventKey: 深链匹配路径（URL 字符串 vs postId）', async () => {
  const { eventKey } = await load()
  const events = [
    { postId: '111', title: 'A' },
    { postId: '222', title: 'B' },
  ]
  const fromUrl = '222'
  assert.strictEqual(events.findIndex(e => eventKey(e) === fromUrl), 1)
})
