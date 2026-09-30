import { useTheme } from '../hooks/useTheme'

// 注意：这些必须是「组件函数」而不是 JSX 字面量。
// 若写成 `system: (<svg/>)`，取出来的是 React 元素对象，
// `<Icon />` 会把它当组件类型渲染，抛 React error #130
// （"Did you accidentally export a JSX literal instead of a component?"）。
const ICONS = {
  system: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M8.5 21h7M12 17v4" />
    </svg>
  ),
  light: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
    </svg>
  ),
  dark: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.5 14.5A8.6 8.6 0 1 1 9.5 3.5a6.8 6.8 0 0 0 11 11z" />
    </svg>
  ),
}

const LABEL = { system: '跟随系统', light: '浅色', dark: '深色' }

/** 三态主题切换：跟随系统 → 浅色 → 深色 → 跟随系统 */
export default function ThemeToggle() {
  const { theme, cycle, resolved } = useTheme()
  const Icon = ICONS[theme] || ICONS.system

  return (
    <button
      type="button"
      onClick={cycle}
      title={`外观：${LABEL[theme]}（点击切换）`}
      aria-label={`外观：${LABEL[theme]}，点击切换`}
      className="inline-flex items-center justify-center bg-transparent border-0 p-1.5 ml-0.5 rounded-md cursor-pointer"
      style={{ color: 'var(--color-text-secondary)' }}
    >
      <Icon data-resolved={resolved} style={{ width: 17, height: 17, display: 'block' }} />
    </button>
  )
}
