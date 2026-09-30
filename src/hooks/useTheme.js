import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'star_chase_theme'
const THEMES = ['system', 'light', 'dark']

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return THEMES.includes(v) ? v : 'system'
  } catch {
    return 'system'
  }
}

function systemPrefersDark() {
  return typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches === true
}

/**
 * 把主题写到 <html> 的 class 上。
 * CSS 侧约定（src/index.css）：
 *   html.dark  → 强制深色
 *   html.light → 强制浅色（压过系统的深色偏好）
 *   都不加     → 跟随 @media (prefers-color-scheme)
 * 所以 system 模式下要把两个 class 都摘掉。
 */
function apply(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  if (theme === 'light') root.classList.add('light')
  else if (theme === 'dark') root.classList.add('dark')
  root.style.colorScheme = theme === 'system'
    ? (systemPrefersDark() ? 'dark' : 'light')
    : theme
}

/**
 * 主题偏好：system / light / dark，持久化到 localStorage。
 * 默认 system —— 跟随操作系统，用户不主动设置就是对的。
 * @returns {{theme: string, setTheme: (t: string) => void, resolved: 'light'|'dark', cycle: () => void}}
 */
export function useTheme() {
  const [theme, setThemeState] = useState(readStored)
  const [resolved, setResolved] = useState(() => (systemPrefersDark() ? 'dark' : 'light'))

  // 首次挂载 + 每次切换都应用到 <html>
  useEffect(() => {
    apply(theme)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResolved(theme === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : theme)
  }, [theme])

  // system 模式下要跟随系统实时变化（用户改了系统主题）
  useEffect(() => {
    if (theme !== 'system') return undefined
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return undefined
    const onChange = () => {
      apply('system')
      setResolved(mq.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  const setTheme = useCallback((next) => {
    if (!THEMES.includes(next)) return
    setThemeState(next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch { /* 隐私模式 */ }
  }, [])

  const cycle = useCallback(() => {
    setTheme(theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system')
  }, [theme, setTheme])

  return { theme, setTheme, resolved, cycle }
}
