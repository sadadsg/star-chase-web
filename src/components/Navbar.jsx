import { Link, useLocation } from 'react-router-dom'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

const navItems = [
  { path: '/', label: '首页' },
  { path: '/schedule', label: '行程' },
  { path: '/news', label: '资讯' },
  { path: '/events', label: '活动' },
  { path: '/travel', label: '出行' },
]

// 品牌标识：楷体疏排 + 红印章「嘉」（楷体栈全平台内置，零网络请求；
// 印章色与首页眉题 #b64400 呼应）
const LOGO_FONT = "'Kaiti SC', 'STKaiti', 'KaiTi', 'BiauKai', 'DFKai-SB', serif"

// Apple 式全局导航：44px 细高、半透明白 + saturate blur、发丝线底边
// 滚动后浮现极淡投影，增强层深提示（motion-meaning：内容开始从其下滑过）
export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 8)
  })

  return (
    <motion.nav
      className="sticky top-0 z-50"
      initial={false}
      animate={{
        boxShadow: scrolled
          ? '0 1px 12px rgba(0,0,0,0.06)'
          : '0 1px 0px rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div className="container-apple">
        <div className="flex items-center justify-between h-11">
          <Link to="/" className="no-underline flex-shrink-0 flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center"
              style={{
                width: 24, height: 24, borderRadius: 6, background: '#b64400',
                color: '#ffffff', fontSize: 15, lineHeight: 1, fontFamily: LOGO_FONT,
                paddingTop: 1,
              }}
            >
              嘉
            </span>
            <span
              className="whitespace-nowrap"
              style={{
                fontFamily: LOGO_FONT, fontSize: 22, fontWeight: 400,
                letterSpacing: '0.14em', color: '#1d1d1f',
              }}
            >
              嘉期如梦
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2 sm:px-2.5 py-1.5 text-[13px] sm:text-[14px] whitespace-nowrap no-underline nav-link-underline ${location.pathname === item.path ? 'is-active font-medium' : ''
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </motion.nav>
  )
}
