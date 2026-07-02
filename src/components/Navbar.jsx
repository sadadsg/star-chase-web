import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

const navItems = [
  { path: '/', label: '首页' },
  { path: '/schedule', label: '行程日历' },
  { path: '/news', label: '新闻资讯' },
  { path: '/events', label: '活动门票' },
  { path: '/travel', label: '出行推荐' },
]

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 10)
  })

  return (
    <motion.nav
      className="sticky top-0 z-50 glass-strong"
      style={{ borderRadius: 0, borderBottom: '1px solid rgba(255,255,255,0.35)' }}
      animate={{ boxShadow: scrolled ? '0 4px 30px rgba(124,58,237,0.08)' : '0 0px 0px rgba(0,0,0,0)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        {/* 桌面端：单行布局 */}
        <div className="hidden sm:flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
            <span className="text-[22px] font-bold gradient-text whitespace-nowrap font-serif-display logo-shimmer">
              嘉期如梦
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-[14px] font-medium no-underline transition-colors nav-link-underline
                  ${location.pathname === item.path
                    ? 'text-[#7C3AED] is-active'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 手机端：双行布局 */}
        <div className="flex sm:hidden flex-col py-2.5">
          <Link to="/" className="text-center no-underline mb-2">
            <span className="text-[17px] font-bold gradient-text font-serif-display logo-shimmer">
              嘉期如梦
            </span>
          </Link>

          <div className="flex items-center justify-around">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-1.5 py-1.5 text-[12px] font-medium whitespace-nowrap no-underline text-center flex-1 transition-colors
                  ${location.pathname === item.path
                    ? 'text-[#7C3AED]'
                    : 'text-[#A8A29E]'
                  }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.span
                    layoutId="mobile-nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#7C3AED]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
