# 嘉期如梦 (Star Chase) — Web 版本设计文档

## 1. 项目概述

**项目名称**：嘉期如梦 (Star Chase)
**项目定位**：追星族行程助手 — 追踪艺人行程、新闻资讯、活动门票和出行推荐
**当前艺人**：任嘉伦 (Allen Ren)
**数据来源**：任嘉伦工作室官方微博（sina 镜像页免登录抓取）+ 百度资讯；行程经 GLM 结构化抽取
**线上地址**：https://sadadsg.github.io/star-chase-web/
**代码仓库**：https://github.com/sadadsg/star-chase-web

## 2. 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 19.2.6 |
| 构建工具 | Vite | 8.0.12 |
| CSS 框架 | Tailwind CSS | 4.3.0 |
| 路由 | React Router DOM | 7.15.1 |
| 后端（本地开发） | Express | 5.2.1 |
| HTML 解析 | Cheerio | 1.2.0 |
| 部署平台 | GitHub Pages | — |
| CI/CD | GitHub Actions | — |
| 运行时 | Node.js | 20 |

## 3. 设计系统

### 3.1 视觉风格：Apple.com 式极简（v2.0，替代液态玻璃）

> v1 为液态玻璃 + Bento Grid，v2 全面重构为 Apple 官网式极简分段布局。

核心原则：
- **全宽分段式布局**：白底与浅灰 `#f5f5f7` 分段交替，内容区 `max-width: 980px` 居中
- **系统字体栈**：`-apple-system, PingFang SC, Helvetica Neue`（不再引入 Google Fonts 衬线体）
- **发丝线分隔**：`#d2d2d7` 1px 边框代替阴影与模糊
- **无玻璃拟态**：全站唯一 `backdrop-filter` 在 44px 高的粘性导航上（Apple 官网同款做法）
- **蓝色链接 CTA**：文本链接 `#0066cc` + `›` 箭头；实心按钮 `#0071e3` 圆角 980px
- **行程类型色降饱和**（白底可读）：影视 `#5856d6` / 综艺 `#248a3d` / 商务 `#b45309` / 演出 `#d6336c`

关键 CSS 令牌（`src/index.css` `@theme`）：

```css
--color-surface: #f5f5f7;      /* 浅灰分段背景 */
--color-text: #1d1d1f;         /* 主文字 */
--color-text-secondary: #6e6e73;
--color-hairline: #d2d2d7;     /* 发丝线 */
--color-link: #0066cc;         /* 文本链接 */
--color-btn: #0071e3;          /* 实心按钮 */
```

排版类：`.hero-title`（clamp 40-72px/600/-0.015em）、`.section-title`（clamp 24-32px）、`.container-apple`（980px 居中）。

旧玻璃类 `.glass/.glass-strong/.glass-warm` 类名保留但实现已替换为 Apple 实底（白卡+发丝线 / 浅灰卡），JSX 无需感知。

### 3.2 Bento Grid 布局

首页采用模块化网格布局，卡片跨列组合：

```
┌─────────────────────────┬──────────┐
│   HeroBanner (艺人信息)  │          │
├─────────────────────────┤ Sidebar  │
│   近期行程 (2列宽)       │ (艺人    │
│                         │  详情)   │
├─────────────────────────┤          │
│   最新资讯 (2列宽)       │          │
├────────────┬────────────┼──────────┤
│ 活动门票    │ 出行推荐    │          │
└────────────┴────────────┴──────────┘
```

关键 CSS：
```css
.grid {
  grid-template-columns: 1fr;          /* 移动端单列 */
}
@media (min-width: 768px) {
  grid { grid-template-columns: 1fr 1fr; }    /* 平板双列 */
}
@media (min-width: 1024px) {
  grid { grid-template-columns: 1fr 1fr 1fr; } /* 桌面三列 */
}
```

## 4. 项目结构

```
star-chase/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions 原子化部署
├── scripts/
│   └── fetch-data.cjs          # 百度热搜抓取脚本
├── server/
│   ├── index.js                # Express API 服务（本地开发）
│   └── newsService.js          # 新闻抓取与行程提取
├── src/
│   ├── api/
│   │   └── dataApi.js          # 静态 JSON 数据接口
│   ├── components/
│   │   ├── ui/                 # 通用 UI 组件
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   └── index.js
│   │   ├── travel/             # 出行推荐子组件
│   │   ├── EventCard.jsx       # 活动门票卡片
│   │   ├── HeroBanner.jsx      # 艺人信息横幅
│   │   ├── Navbar.jsx          # 导航栏（桌面/移动双模式）
│   │   ├── NewsFeed.jsx        # 新闻资讯流
│   │   ├── ScheduleCalendar.jsx # 行程日历
│   │   ├── Sidebar.jsx         # 艺人详情侧边栏
│   │   └── TravelRecommend.jsx # 出行推荐
│   ├── data/
│   │   └── rjlData.js          # 艺人静态数据（任嘉伦）
│   ├── hooks/
│   │   ├── useDataFetch.js     # 数据获取 Hook
│   │   └── index.js
│   ├── pages/
│   │   ├── HomePage.jsx        # 首页（Bento Grid）
│   │   ├── SchedulePage.jsx    # 行程日历页
│   │   ├── NewsPage.jsx        # 新闻资讯页
│   │   ├── EventsPage.jsx      # 活动门票页
│   │   └── TravelPage.jsx      # 出行推荐页
│   ├── App.jsx                 # 路由配置
│   ├── config.js               # API 地址配置
│   ├── index.css               # 全局样式 + 设计系统
│   └── main.jsx                # 入口
├── data/                       # 抓取的数据 JSON
├── dist/                       # 构建输出
├── vite.config.js              # Vite 配置
├── package.json
└── README.md
```

## 5. 核心功能模块

### 5.1 数据获取层

#### 架构设计：零服务器成本（v2 — 工作室微博为行程正源）

```
GitHub Actions (每小时)
  ├─ fetch-weibo.cjs     → sina.cn 镜像页 SSR 解析 → data/weibo-posts.json
  ├─ extract-schedule.cjs → GLM 文本/视觉抽取 + 校验 → data/schedule.json
  └─ fetch-data.cjs      → 百度资讯 + 工作室帖文 → data/news.json / events.json
                                    ↓
                       npm test → build → data/*.json 并入 dist/api/ → gh-pages
                                    ↑
前端 (GitHub Pages) ← fetch() ← dataApi.js ← /api/*.json ───┘
```

#### 为什么弃用「新闻关键词猜行程」

v1 从百度热搜/资讯标题里匹配「开机/杀青/代言」等关键词提取行程。实测（2026-09）：管道正常运行，但 `schedule.json` 长期为空 —— 新闻标题天然不含未来日期、场馆和城市，热搜是「已发生的讨论」，行程是「未来要做的事」。

#### 行程正源：工作室微博镜像（免登录）

微博官方 API 匿名访问已全面封锁（m.weibo.cn 返回 432/登录跳转，老 WAP 站 weibo.cn 已死，RSSHub 公共实例路由 503）。**可行路径是新浪的新闻镜像页**：`https://www.sina.cn/media/<uid>`（免登录、SSR 直出、国内可达）：

- 信息流页：100 条帖文全文 + 精确时间戳 + 稳定帖子 ID（`/news/detail/<mid>.html`）
- 详情页：帖文配图（`wx*.sinaimg.cn`，无时效签名；`tvax*` 头像图带 Expires 需即时消费）
- 解析器：`scripts/lib/parse-mirror.cjs`（纯函数，有真实页面 fixture 单测）

#### GLM 结构化抽取（extract-schedule.cjs）

- 文字行程帖 → `glm-4-flash` 按 JSON schema 抽取（日期/城市/类型/标题）
- 行程海报图（如「X月嘉书」）→ 下载 → `glm-4v-flash` 视觉抽取
- **校验闸门（宁缺毋滥）**：日期必须严格 YYYY-MM-DD、落在当前月 ±1、城市在配置表内、类型四选一，任一不过即丢弃并记录原因
- 未配置 `ZHIPU_API_KEY` 时自动降级为「类型关键词 + 显式日期正则」的保守抽取
- 环境变量：`ZHIPU_API_KEY`（必填才启用 GLM）、`GLM_TEXT_MODEL`/`GLM_VISION_MODEL`（默认 glm-4-flash / glm-4v-flash）、`GLM_API_BASE`

#### 配置单一来源

`scripts/artists.config.cjs`：艺人关键词、工作室 UID、行程/类型关键词、城市表、抽取参数。抓取脚本与 dev server 共用；`worker/`、`scf-deploy/` 作为自包含部署产物有意保持独立。

#### dataApi.js 静态接口（未变）

```js
fetchSchedule() / fetchNews(count) / fetchEvents()
// 失败时返回 { data: [], total: 0 }，保证前端不崩溃
```

#### dataApi.js 静态接口

```js
const BASE_URL = 'https://sadadsg.github.io/star-chase-web/api'
// 开发环境: http://localhost:3001/api
// 生产环境: /star-chase-web/api (GitHub Pages)

export async function fetchSchedule() { /* ... */ }
export async function fetchNews(count) { /* ... */ }
export async function fetchEvents() { /* ... */ }
```

所有接口失败时返回 `{ data: [], total: 0 }`，保证前端不崩溃。

### 5.2 前端路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | HomePage | Bento Grid 首页 |
| `/schedule` | SchedulePage | 行程日历 |
| `/news` | NewsPage | 新闻资讯（按月分组） |
| `/events` | EventsPage | 活动门票 |
| `/travel` | TravelPage | 出行推荐 |

### 5.3 组件设计

#### Navbar — 双模式导航

桌面端：单行水平导航，标题 + 导航项
移动端：双行布局，标题居中 + 导航项均匀分布

关键响应式：
- 桌面：`hidden sm:flex` 单行
- 移动：`flex sm:hidden` 双行
- 标题防换行：`whitespace-nowrap flex-shrink-0`

#### ScheduleCalendar — 行程日历

- 7 列网格日历，每格显示日期 + 行程标签
- 支持月份切换、点击查看详情
- 月度统计条（影视/综艺/商务/演出数量）
- 图例行显示颜色含义
- 移动端：格子高度从 80px 缩至 56px

#### HeroBanner — 艺人信息

紧凑横条式设计，包含：
- 艺人首字图标（渐变背景）
- 姓名 + 英文名 + 粉丝名
- 粉丝数标签（桌面端显示）

#### Sidebar — 艺人详情

固定侧边栏（`sm:sticky sm:top-[68px]`），包含：
- 头像区域（渐变背景 + 首字）
- 基本信息（生日/星座/出生地/身高/学历/经纪公司）
- 人物简介（可展开/收起）
- 代表作品列表
- 获奖记录
- 标签云
- 夸克百科来源链接

#### NewsFeed — 新闻资讯

- 分类筛选（全部/影视/综艺/时尚/日常）
- 新闻卡片：封面图 + 标题 + 摘要 + 来源 + 日期
- 无新闻时显示友好空状态
- 按月分组展示（新闻页）

#### EventCard — 活动门票

- 活动封面 + 状态标签（热卖/在售/即将/售罄）
- 日期 + 地点信息
- 外链跳转到百度搜索

#### TravelRecommend — 出行推荐

三步流程：
1. 选择活动（从行程中筛选演出/商务类）
2. 选择出发城市（20 个城市可选）
3. 展示出行方案（携程航班 + 12306 高铁链接）

## 6. 响应式设计

### 断点策略

以 `sm: 640px` 为唯一隔离边界，`md:` 和 `lg:` 仅用于 Bento Grid 列数：

| 断点 | 导航 | 日历格子 | 卡片间距 | Bento Grid |
|------|------|----------|----------|------------|
| < 640px | 双行 | 56px | gap-2, p-4 | 1 列 |
| ≥ 640px | 单行 | 80px | gap-3, p-5 | 2-3 列 |

### 移动端适配规则

- 所有字号使用 `text-[14px] sm:text-[16px]` 模式
- 所有间距使用 `gap-2 sm:gap-3`, `p-4 sm:p-5` 模式
- 日历格子：`min-h-[56px] sm:min-h-[80px]`
- 导航栏：移动端 `px-2.5 text-[12px]`，桌面端 `px-4 text-[14px]`
- 标题防换行：`whitespace-nowrap flex-shrink-0`
- 侧边栏：移动端关闭 `sticky`（`sm:sticky sm:top-[68px]`）

### 参考设备

iPhone 14 Pro Max（430 × 932 points）

## 7. 部署架构

### GitHub Pages 原子化部署

```yaml
# .github/workflows/deploy.yml
name: Build & Deploy
on:
  schedule:
    - cron: '0 * * * *'  # 每小时自动运行
  workflow_dispatch:       # 支持手动触发

jobs:
  build-and-deploy:
    steps:
      1. checkout + setup-node (20)
      2. npm ci
      3. node scripts/fetch-weibo.cjs      # 工作室微博镜像抓取
      4. node scripts/extract-schedule.cjs # GLM 行程抽取（secrets.ZHIPU_API_KEY，缺省降级）
      5. node scripts/fetch-data.cjs       # 资讯汇总 + 派生活动
      6. node --test scripts/test/*.test.cjs
      7. npm run build
      8. mkdir -p dist/api && cp data/*.json dist/api/
      9. peaceiris/actions-gh-pages@v4
```

**Secrets 配置**：仓库 Settings → Secrets and variables → Actions → New repository secret：
- `ZHIPU_API_KEY`（可选但强推荐）：智谱开放平台 API Key，启用 GLM 行程抽取；未配置时管道自动降级，行程只剩显式日期的保守抽取

**关键设计**：数据 + 前端在同一 workflow 中原子化部署；数据脚本失败不阻塞部署（extract/fetch 失败保留旧数据，仅全失败时 exit 1）。

### 部署决策过程

| 方案 | 结果 | 原因 |
|------|------|------|
| Vercel | ❌ | 中国大陆无法访问 |
| Netlify | ❌ | 中国大陆无法访问 |
| Cloudflare | ❌ | 需要认证，操作复杂 |
| 腾讯云 SCF | ❌ | 用户反馈收费 |
| cpolar 内网穿透 | ❌ | 用户不能一直开着电脑 |
| GitHub Pages | ✅ | 免费、稳定、中国可访问 |

### Vite 构建配置

```js
// vite.config.js
export default defineConfig({
  base: '/star-chase-web/',  // GitHub Pages 子路径
  plugins: [react(), tailwindcss()],
  server: {
    proxy: { '/api': 'http://localhost:3001' }  // 开发环境代理
  }
})
```

### API 地址切换

```js
// src/config.js
export const API_BASE = import.meta.env.VITE_API_BASE
  || (import.meta.env.PROD ? '/star-chase-web/api' : 'http://localhost:3001/api')
```

## 8. 开发过程记录

### 8.1 使用的 Skills

在开发过程中，使用了以下 AI 辅助 Skills：

| Skill | 用途 | 阶段 |
|-------|------|------|
| `ui-ux-pro-max` | UI/UX 设计智能 — 50+ 风格、161 调色板、57 字体配对、响应式设计指南 | 设计阶段 |
| `ckm:design` | 综合设计 — 品牌标识、设计令牌、UI 样式、Logo 生成、信息图 | 视觉设计 |
| `ckm:ui-styling` | UI 样式 — shadcn/ui 组件、Tailwind CSS 工具类、响应式布局 | 样式实现 |
| `ckm:design-system` | 设计系统 — 三层令牌架构、CSS 变量、间距/排版比例 | 设计规范 |
| `planning-with-files-zh` | 文件规划系统 — 任务分解、进度跟踪 | 项目管理 |

### 8.2 开发阶段

#### 阶段 1：初始化与基础架构

- 创建 React 19 + Vite 8 项目
- 配置 Tailwind CSS 4
- 搭建 Express 5 后端
- 实现百度热搜抓取脚本
- 设计 API 接口

#### 阶段 2：核心功能开发

- 行程日历组件（ScheduleCalendar）
- 新闻资讯流（NewsFeed）
- 活动门票卡片（EventCard）
- 出行推荐（TravelRecommend）
- 艺人信息侧边栏（Sidebar）

#### 阶段 3：设计系统迭代

经过多轮设计迭代（部分被回退）：

1. **设计系统重构** — 建立液态玻璃 + Bento Grid 设计系统
2. **暗色模式** — 已回退（用户不需要）
3. **首页视觉升级** — 已回退
4. **动效增强** — 已回退
5. **移动端体验** — 已回退
6. **玻璃风格适配** — 最终确定，所有组件统一液态玻璃风格

最终保留的设计决策：
- `.glass` 卡片系统（55% 白色 + blur 20px）
- 渐变背景（薰衣草→粉色→天蓝→薄荷）
- Bento Grid 网格布局
- 行程类型颜色编码（影视紫/综艺绿/商务金/演出粉）

#### 阶段 4：部署与上线

- 初始化 Git 仓库
- 推送到 GitHub（sadadsg/star-chase-web）
- 修复 ESLint 错误
- 配置 GitHub Pages 部署
- 创建原子化 deploy.yml workflow
- 修复 GitHub Actions 权限问题（`gh api -X PUT`）
- 验证 GitHub Pages 可访问性

#### 阶段 5：响应式优化

两轮移动端优化：

**Round 1 — 全面响应式优化**（9 个文件）：
- `index.css`：添加 `.cal-cell-mobile` 媒体查询
- `ScheduleCalendar.jsx`：日历格子缩小（56px vs 80px）
- `HomePage.jsx`：单列行程卡片
- `Navbar.jsx`：移动端紧凑导航
- `Sidebar.jsx`：移动端关闭 sticky
- `NewsFeed.jsx`：分类筛选间距
- `EventCard.jsx`：卡片内边距
- `TravelRecommend.jsx`：响应式排版

**Round 2 — 标题换行修复**：
- `Navbar.jsx`：添加 `whitespace-nowrap`、`flex-shrink-0`、响应式字号

### 8.3 遇到的关键问题与解决方案

| 问题 | 根因 | 解决方案 |
|------|------|----------|
| GitHub Pages 白屏 | `vite.config.js` 缺少 `base`、`config.js` API 地址错误、BrowserRouter 缺少 `basename` | 三处同时修复 |
| GitHub Actions 403 | workflow 权限为 read-only | `gh api -X PUT` 改为 write |
| GitHub Pages 数据 404 | 前端和数据分开部署，后者覆盖前者 | 合并为原子化 deploy.yml |
| `gh workflow run` 404 | 仓库默认分支不是 main | 检查 `gh api` 确认默认分支 |
| 移动端日历文字截断 | 7 列网格 80px 格子太小 | 缩至 56px + 更小字号 |
| 移动端标题换行 | "嘉期如梦" 4 字在窄屏换行 | `whitespace-nowrap` + `flex-shrink-0` |
| 移动端侧边栏浮动 | `sticky` 在移动端导致内容重叠 | `sm:sticky sm:top-[68px]` |
| fetch-data.cjs 报错 | `package.json` 设置了 `"type": "module"` | 重命名为 `.cjs` |
| `git push` 超时 | gh-pages 分支可能很大或偏离严重 | 改用 `peaceiris/actions-gh-pages` |
| **v2** 微博 API 匿名 432/登录墙 | m.weibo.cn 反爬升级，`ok:-100` 跳 SSO | 改走 sina.cn 镜像页 SSR（免登录） |
| **v2** weibo.cn 老 WAP 站失效 | 已改为与 weibo.com 同源 SPA | 放弃该路线 |
| **v2** RSSHub 公共实例 503 | 实例侧 weibo 路由需自身 cookie | 仅作备选，不进主链路 |
| **v2** 镜像页图床 URL 有时效 | `tvax*` 头像图带 Expires 签名 | 海报图抓取时立即下载消费，前端只存结构化结果 |
| **v2** 新闻猜行程永远为空 | 新闻标题不含未来日期/场馆 | 行程源改为工作室微博 + GLM 抽取 |
| **v2** fullPage 截图内容重复 | sticky 导航 + 滚动入场动画的拼接伪影 | 验证用视口截图 + DOM 断言 |
| **v2** 资讯摘要带超话标记 | 工作室帖文原文含 `#xx[超话]#` | `cleanTitle()` 清洗后入 news.json |

## 9. 设计原则

### 9.1 零假数据原则

> 用户明确拒绝：显示假数据冒充真实数据

当百度热搜没有艺人相关内容时，返回空数组，前端显示"数据来源于实时热搜，无相关内容时不显示"。

### 9.2 零服务器成本原则

> 用户明确要求：全免费方案

生产环境完全静态化：
- GitHub Pages 托管前端 + 数据
- GitHub Actions 定时抓取数据
- 无需任何付费服务器

### 9.3 移动端不影响桌面端原则

> 用户明确约束：优化手机端排版不能影响电脑端

所有移动端优化使用 Tailwind `sm:` 断点隔离，`md:` 和 `lg:` 类不受影响。

## 10. 数据流

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│   百度热搜 API    │ ──→ │ fetch-data.cjs│ ──→ │ data/*.json │
│ top.baidu.com    │     │  (Node.js)   │     │  (静态文件)  │
└─────────────────┘     └──────────────┘     └──────┬──────┘
                                                     │
                                              GitHub Actions
                                              (每小时触发)
                                                     │
                                              ┌──────▼──────┐
                                              │  gh-pages   │
                                              │  /api/*.json│
                                              └──────┬──────┘
                                                     │
                                              fetch() 请求
                                                     │
                                              ┌──────▼──────┐
                                              │  dataApi.js │
                                              │ (前端接口层) │
                                              └──────┬──────┘
                                                     │
                         ┌─────────────┬─────────────┼─────────────┬─────────────┐
                         ▼             ▼             ▼             ▼             ▼
                    ScheduleCalendar  NewsFeed    EventCard   TravelRecommend  Sidebar
```

## 11. 未来扩展方向

- [ ] GLM 视觉抽取实测调优（需配置 `ZHIPU_API_KEY` 后观察「月度嘉书」抽取质量）
- [ ] GitHub Actions 美区 IP 抓 sina 镜像页的连通性验证（本地已通，CI 待首次运行确认）
- [ ] ICS 日历订阅（schedule.json → webcal，粉丝一键订阅系统日历）
- [ ] 出行推荐接入真实航班/高铁查询 API
- [ ] 多艺人支持（配置已就绪，扩展 `artists.config.cjs` 即可）
- [ ] 演出票务平台（大麦/猫眼）结构化接入
- [ ] 用户收藏/提醒功能
- [ ] 暗色模式（用户曾回退，可重新评估）

---

*文档版本：v2.0 | 最后更新：2026-09-12 | v2 变更：行程源重构（工作室微博+GLM 抽取）、UI 重构（Apple 式极简分段布局）、数据管道 TDD 化*
