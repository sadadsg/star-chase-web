import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/schedule" element={<PageTransition><SchedulePage /></PageTransition>} />
        <Route path="/news" element={<PageTransition><NewsPage /></PageTransition>} />
        <Route path="/events" element={<PageTransition><EventsPage /></PageTransition>} />
        <Route path="/travel" element={<PageTransition><TravelPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const isOnline = useNetworkStatus()

  return (
    <BrowserRouter basename="/star-chase-web">
      <div className="min-h-screen">
        <NetworkStatus isOnline={isOnline} />

        <Navbar />
        <main className="max-w-5xl mx-auto px-5 sm:px-8 py-6">
          <AnimatedRoutes />
        </main>

        <footer className="mt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.3)' }}>
          <div className="max-w-5xl mx-auto px-5 py-6 text-center">
            <p className="text-[12px]" style={{ color: '#A8A29E' }}>
              嘉期如梦 · 你的爱豆行程助手 · 数据仅供参考，实际行程以官方发布为准
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
