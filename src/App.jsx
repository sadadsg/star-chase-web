import { BrowserRouter, Routes, Route, useLocation, useNavigationType, Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SchedulePage from './pages/SchedulePage'
import NewsPage from './pages/NewsPage'
import EventsPage from './pages/EventsPage'
import TravelPage from './pages/TravelPage'
import PageTransition from './components/ui/PageTransition'
import { NetworkStatus } from './components/ui'
import { useNetworkStatus } from './hooks'

function AnimatedRoutes() {
  const location = useLocation()
  const navType = useNavigationType()
  // PUSH/REPLACE = 前进（从下进入）；POP（浏览器后退）= 返回（从上进入）
  const direction = navType === 'POP' ? -1 : 1

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition direction={direction}><HomePage /></PageTransition>} />
        <Route path="/schedule" element={<PageTransition direction={direction}><SchedulePage /></PageTransition>} />
        <Route path="/news" element={<PageTransition direction={direction}><NewsPage /></PageTransition>} />
        <Route path="/events" element={<PageTransition direction={direction}><EventsPage /></PageTransition>} />
        <Route path="/travel" element={<PageTransition direction={direction}><TravelPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

const footerNav = [
  { path: '/schedule', label: '行程日历' },
  { path: '/news', label: '新闻资讯' },
  { path: '/events', label: '活动门票' },
  { path: '/travel', label: '出行推荐' },
]

// Apple 式页脚：浅灰底、多列小字链接、发丝线分隔、法律声明行
function Footer() {
  return (
    <footer style={{ background: '#f5f5f7', borderTop: '1px solid #d2d2d7' }}>
      <div className="container-apple py-8 sm:py-10">
        <div className="flex flex-wrap gap-x-7 gap-y-2.5 pb-5" style={{ borderBottom: '1px solid #d2d2d7' }}>
          {footerNav.map(item => (
            <Link key={item.path} to={item.path} className="text-[12px] no-underline" style={{ color: '#424245' }}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="pt-5 space-y-2.5">
          <p className="text-[12px] leading-relaxed m-0" style={{ color: '#86868b' }}>
            数据来源：任嘉伦工作室官方微博、百度资讯。行程仅供参考，实际安排以官方发布为准。
          </p>
          <p className="text-[12px] leading-relaxed m-0" style={{ color: '#86868b' }}>
            嘉期如梦 · 非官方粉丝项目 · 2026
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const isOnline = useNetworkStatus()

  return (
    <BrowserRouter basename="/star-chase-web">
      <div className="min-h-screen flex flex-col" style={{ background: '#ffffff' }}>
        <NetworkStatus isOnline={isOnline} />

        <Navbar />
        {/* 全宽分段式布局：背景与留白由各页面的 section 自己控制 */}
        <main className="flex-1">
          <AnimatedRoutes />
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}
