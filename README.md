# 嘉期如梦 (Star Chase)

你的爱豆行程助手 — 追踪艺人行程、新闻资讯、活动门票和出行推荐。

## 功能

- **行程日历** — 工作室官方微博行程（GLM 结构化抽取），日历视图展示，支持一键订阅到系统日历（ICS）
- **新闻资讯** — 工作室微博动态 + 百度资讯聚合，支持 RSS 订阅
- **活动门票** — 演出/商务活动汇总，内置大麦、秀动购票搜索深链
- **出行推荐** — 根据活动城市自动匹配携程航班和 12306 高铁
- **PWA** — 可安装到手机主屏，离线缓存页面与数据

## 技术栈

- **前端**: React 19 + Vite 8 + Tailwind CSS 4
- **后端**: Express 5 + Node.js
- **数据源**: 今日头条热搜、百度热搜（实时抓取）

## 快速开始

```bash
# 安装依赖
npm install

# 启动前端开发服务器
npm run dev

# 启动后端 API 服务（新终端）
npm run server
```

前端运行在 `http://localhost:5173`，后端 API 运行在 `http://localhost:3001`，开发模式下 Vite 会自动代理 `/api` 请求到后端。

## 环境变量

复制 `.env.example` 为 `.env` 并填入微博开放平台凭证（可选，用于微博数据源）：

```bash
cp .env.example .env
```

## 项目结构

```
star-chase/
├── server/
│   ├── index.js          # Express API 服务
│   └── newsService.js    # 新闻抓取与行程提取
├── src/
│   ├── components/       # React 组件
│   │   ├── travel/       # 出行推荐子组件
│   │   └── ui/           # 通用 UI 组件
│   ├── hooks/            # 自定义 Hooks
│   ├── pages/            # 页面组件
│   └── api/              # API 封装
└── public/               # 静态资源
```

## API 接口

| 接口 | 说明 |
|------|------|
| `GET /api/artist/:id/info` | 艺人信息 |
| `GET /api/artist/:id/schedule` | 行程列表 |
| `GET /api/artist/:id/news` | 新闻列表 |
| `GET /api/artist/:id/events` | 活动列表 |
| `GET /api/weibo/news` | 微博新闻 |
| `GET /api/weibo/schedule` | 微博行程 |
| `GET /api/schedule.ics` | 日历订阅（webcal 一键订阅系统日历） |
| `GET /api/rss.xml` | RSS 资讯订阅 |
| `GET /api/health` | 健康检查 |

## 数据说明

行程数据来自**任嘉伦工作室官方微博**（经新浪镜像页抓取，GLM 结构化抽取，未配置 ZHIPU_API_KEY 时降级为保守抽取）；资讯聚合工作室动态与百度资讯。数据仅供参考，实际行程以官方发布为准。
