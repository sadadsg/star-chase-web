# 嘉期如梦 (Star Chase)

你的爱豆行程助手 — 追踪艺人行程、新闻资讯、活动门票和出行推荐。

## 功能

- **行程日历** — 从新闻中自动提取艺人行程，日历视图展示
- **新闻资讯** — 实时抓取今日头条、百度热搜，筛选艺人相关新闻
- **活动门票** — 粉丝见面会、商务活动等信息汇总
- **出行推荐** — 根据活动城市自动匹配携程航班和 12306 高铁

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
| `GET /api/health` | 健康检查 |

## 数据说明

当前数据主要来自实时热搜抓取（今日头条、百度），行程通过关键词匹配从新闻中自动提取。数据仅供参考，实际行程以官方发布为准。
