import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: '首页' },
  { path: '/schedule', label: '行程' },
  { path: '/news', label: '资讯' },
  { path: '/events', label: '活动' },
  { path: '/travel', label: '出行' },
]

// Apple 式全局导航：44px 细高、半透明白 + saturate blur、发丝线底边
export default function Navbar() {
  const location = useLocation()

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div className="container-apple">
        <div className="flex items-center justify-between h-11">
          <Link to="/" className="no-underline flex-shrink-0">
            <span className="text-[18px] font-semibold whitespace-nowrap" style={{ color: '#1d1d1f', letterSpacing: '-0.01em' }}>
              嘉期如梦
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2 sm:px-2.5 py-1.5 text-[12px] sm:text-[13px] whitespace-nowrap no-underline nav-link-underline ${location.pathname === item.path ? 'is-active font-medium' : ''
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  )
}
