import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SchedulePage from './pages/SchedulePage'
import NewsPage from './pages/NewsPage'
import EventsPage from './pages/EventsPage'
import TravelPage from './pages/TravelPage'
import { NetworkStatus } from './components/ui'
import { useNetworkStatus } from './hooks'

export default function App() {
  const isOnline = useNetworkStatus()

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        {/* 全局网络状态提示 */}
        <NetworkStatus isOnline={isOnline} />
        
        <Navbar />
        <main className="max-w-6xl mx-auto px-5 sm:px-8 py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/travel" element={<TravelPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#EDF0F5] mt-10">
          <div className="max-w-6xl mx-auto px-5 py-8 text-center">
            <p className="text-[#B0BEC5] text-[13px]">
              嘉期如梦 — 你的爱豆行程助手
            </p>
            <p className="text-[#D3DAE6] text-[13px] mt-1">
              数据仅供参考，实际行程以官方发布为准
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
