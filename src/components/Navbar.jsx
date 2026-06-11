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
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#EDF0F5]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <span className="text-[24px] font-bold gradient-text" style={{ fontFamily: "'ZCOOL XiaoWei', serif" }}>
              嘉期如梦
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-[15px] font-medium transition-all duration-200 no-underline
                  ${location.pathname === item.path
                    ? 'text-[#5B8DEF] bg-[#EEF3FD]'
                    : 'text-[#8E99A8] hover:text-[#2D3748] hover:bg-[#F7F9FC]'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex md:hidden items-center gap-0.5 overflow-x-auto">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium whitespace-nowrap transition-all no-underline
                  ${location.pathname === item.path
                    ? 'text-[#5B8DEF] bg-[#EEF3FD]'
                    : 'text-[#8E99A8]'
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
