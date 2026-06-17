import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: '首页' },
  { path: '/schedule', label: '行程日历' },
  { path: '/news', label: '新闻资讯' },
  { path: '/events', label: '活动门票' },
  { path: '/travel', label: '出行推荐' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 glass-strong" style={{ borderRadius: 0, borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* 桌面端：单行布局 */}
        <div className="hidden sm:flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
            <span className="text-[22px] font-bold gradient-text whitespace-nowrap" style={{ fontFamily: "'Newsreader', serif" }}>
              嘉期如梦
            </span>
          </Link>

          <div className="flex items-center gap-0.5">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-xl text-[14px] font-medium transition-all duration-200 no-underline
                  ${location.pathname === item.path
                    ? 'text-[#7C3AED] bg-[rgba(139,92,246,0.1)]'
                    : 'text-[#6B7280] hover:text-[#1E1B4B] hover:bg-[rgba(255,255,255,0.5)]'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 手机端：双行布局 */}
        <div className="flex sm:hidden flex-col py-2">
          <Link to="/" className="text-center no-underline mb-2">
            <span className="text-[17px] font-bold gradient-text" style={{ fontFamily: "'Newsreader', serif" }}>
              嘉期如梦
            </span>
          </Link>

          <div className="flex items-center justify-around">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-1 py-1 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all no-underline text-center flex-1
                  ${location.pathname === item.path
                    ? 'text-[#7C3AED] bg-[rgba(139,92,246,0.1)]'
                    : 'text-[#9CA3AF]'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
