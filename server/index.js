import express from 'express'
import cors from 'cors'
import { fetchNews, fetchSchedule, checkStatus } from './newsService.js'

const app = express()
app.use(cors())
app.use(express.json())

// ========== 模拟数据 ==========
const artistData = {
  rjl: {
    info: {
      id: 'rjl',
      name: '任嘉伦',
      englishName: 'Allen Ren',
      birthday: '1989-04-11',
      birthplace: '山东青岛',
      agency: '欢瑞世纪',
      fansName: '嘉人',
      fansCount: '3682万',
    },
    schedule: [
      { id: 1, date: '2026-06-05', type: 'filming', typeName: '影视拍摄', title: '《长风破浪》剧组拍摄', location: '浙江横店', city: '金华', time: '全天' },
      { id: 2, date: '2026-06-08', type: 'variety', typeName: '综艺录制', title: '《你好星期六》录制', location: '湖南广电中心', city: '长沙', time: '14:00-22:00' },
      { id: 3, date: '2026-06-12', type: 'business', typeName: '商务活动', title: 'FENDI 品牌活动', location: '上海恒隆广场', city: '上海', time: '15:00-18:00' },
      { id: 4, date: '2026-06-15', type: 'fanmeeting', typeName: '粉丝见面会', title: '「嘉人有约」粉丝见面会', location: '北京国家会议中心', city: '北京', time: '19:00-21:30' },
      { id: 5, date: '2026-06-20', type: 'variety', typeName: '综艺录制', title: '《现在就出发》第三季', location: '云南大理', city: '大理', time: '全天' },
      { id: 6, date: '2026-06-25', type: 'fanmeeting', typeName: '粉丝见面会', title: '「嘉人有约」粉丝见面会·上海站', location: '上海梅赛德斯奔驰文化中心', city: '上海', time: '19:00-21:30' },
    ],
    news: [
      { id: 1, title: '任嘉伦新剧《长风破浪》横店开机', summary: '古装武侠剧正式开机，路透照引发热议', source: '新浪娱乐', category: '影视', date: '2026-05-25' },
      { id: 2, title: '任嘉伦出席FENDI 2026春夏大秀', summary: '亮相米兰时装周，获外媒盛赞', source: 'ELLE', category: '时尚', date: '2026-05-22' },
      { id: 3, title: '《暮色心约》豆瓣开分8.2', summary: '演技获观众高度评价', source: '豆瓣电影', category: '影视', date: '2026-05-20' },
    ],
    events: [
      { id: 1, name: '「嘉人有约」粉丝见面会·北京站', date: '2026-06-15', venue: '北京国家会议中心', city: '北京', priceRange: '680-1680', status: 'hot', platform: '大麦网' },
      { id: 2, name: '「嘉人有约」粉丝见面会·上海站', date: '2026-06-25', venue: '上海梅赛德斯奔驰文化中心', city: '上海', priceRange: '680-1680', status: 'onsale', platform: '大麦网' },
    ],
  }
}

// ========== API 路由 ==========

// 艺人信息
app.get('/api/artist/:id/info', (req, res) => {
  const data = artistData[req.params.id]
  if (!data) return res.status(404).json({ error: '艺人不存在' })
  res.json(data.info)
})

// 行程列表
app.get('/api/artist/:id/schedule', (req, res) => {
  const data = artistData[req.params.id]
  if (!data) return res.status(404).json({ error: '艺人不存在' })

  let schedule = data.schedule
  if (req.query.month) {
    schedule = schedule.filter(s => s.date.startsWith(req.query.month))
  }
  if (req.query.date) {
    schedule = schedule.filter(s => s.date === req.query.date)
  }
  res.json(schedule)
})

// 新闻列表
app.get('/api/artist/:id/news', (req, res) => {
  const data = artistData[req.params.id]
  if (!data) return res.status(404).json({ error: '艺人不存在' })

  let news = data.news
  if (req.query.category && req.query.category !== '全部') {
    news = news.filter(n => n.category === req.query.category)
  }
  res.json(news)
})

// 活动列表
app.get('/api/artist/:id/events', (req, res) => {
  const data = artistData[req.params.id]
  if (!data) return res.status(404).json({ error: '艺人不存在' })
  res.json(data.events)
})

// 出行推荐
app.get('/api/travel/recommend', (req, res) => {
  const { from, to, date } = req.query
  // TODO: 接入真实航班/高铁 API
  // 推荐接入方案:
  // 1. 航班: 接入携程/飞猪开放平台 API
  // 2. 高铁: 接入 12306 第三方 API 或爬虫方案
  res.json({
    from,
    to,
    date,
    flights: [
      { airline: '中国国航', flightNo: 'CA1502', depart: '07:30', arrive: '10:05', duration: '2h35m', price: 1280 },
      { airline: '东方航空', flightNo: 'MU5101', depart: '08:50', arrive: '11:20', duration: '2h30m', price: 1150 },
    ],
    trains: [
      { type: '高铁', trainNo: 'G2', depart: '06:36', arrive: '11:18', duration: '4h42m', price: 553, seats: '二等座' },
      { type: '高铁', trainNo: 'G104', depart: '08:00', arrive: '13:12', duration: '5h12m', price: 553, seats: '二等座' },
    ],
    note: '当前为模拟数据，接入真实 API 后返回实时价格和余票信息'
  })
})

// ========== 微博 API 代理 ==========

// 微博新闻资讯
app.get('/api/weibo/news', async (req, res) => {
  const uid = req.query.uid || process.env.WEIBO_UID
  const count = parseInt(req.query.count) || 30
  try {
    const result = await fetchNews(uid, count)
    res.json(result)
  } catch (err) {
    res.json({ data: [], source: 'fallback', error: err.message })
  }
})

// 微博行程
app.get('/api/weibo/schedule', async (req, res) => {
  const uid = req.query.uid || process.env.WEIBO_UID
  try {
    const result = await fetchSchedule(uid)
    res.json(result)
  } catch (err) {
    res.json({ data: [], source: 'fallback', error: err.message })
  }
})

// 微博 API 状态
app.get('/api/weibo/status', async (req, res) => {
  try {
    const status = await checkStatus()
    res.json(status)
  } catch (err) {
    res.json({ configured: false, message: err.message })
  }
})

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`API 服务运行在 http://localhost:${PORT}`)
  console.log('可用接口:')
  console.log('  GET /api/artist/:id/info')
  console.log('  GET /api/artist/:id/schedule')
  console.log('  GET /api/artist/:id/news')
  console.log('  GET /api/artist/:id/events')
  console.log('  GET /api/travel/recommend?from=上海&to=北京&date=2026-06-15')
  console.log('  GET /api/weibo/news?count=30')
  console.log('  GET /api/weibo/schedule')
  console.log('  GET /api/weibo/status')
})
