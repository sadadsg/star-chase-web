import { useCallback, useState } from 'react'

const STORAGE_KEY = 'star_chase_notify_pref'

// 浏览器原生通知的三种状态 + 一个「不支持」
function currentPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  return Notification.permission // 'default' | 'granted' | 'denied'
}

// 惰性初始化：偏好只在首帧读一次，不放进 effect（避免级联渲染 + set-state-in-effect 报错）
function initialPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    // 隐私模式下 localStorage 可能抛错
    return false
  }
}

/**
 * 行程提醒的权限状态与开关逻辑。
 * 偏好存 localStorage（用户主动开/关），权限本身由浏览器管，两者分开。
 * @returns {{supported: boolean, permission: string, enabled: boolean, toggle: () => Promise<string>}}
 */
export function useNotificationPermission() {
  const [permission, setPermission] = useState(currentPermission)
  const [enabled, setEnabled] = useState(initialPreference)

  const persist = useCallback((v) => {
    try { localStorage.setItem(STORAGE_KEY, v ? '1' : '0') } catch { /* ignore */ }
  }, [])

  const toggle = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
    // 再次点击表示关闭
    if (enabled && Notification.permission === 'granted') {
      setEnabled(false)
      persist(false)
      return Notification.permission
    }
    // 必须在用户手势中调用 requestPermission（iOS 强制要求）
    const result = await Notification.requestPermission()
    setPermission(result)
    setEnabled(result === 'granted')
    persist(result === 'granted')
    return result
  }, [enabled, persist])

  // iOS Safari 只有「已添加到主屏」的 PWA 才允许弹通知
  const isIOS = typeof navigator !== 'undefined' &&
    /iP(hone|ad|od)/.test(navigator.userAgent || '')
  const isStandalone = typeof window !== 'undefined' &&
    (window.matchMedia?.('(display-mode: standalone)').matches === true ||
      window.navigator.standalone === true)

  return {
    supported: permission !== 'unsupported',
    permission,
    enabled: enabled && permission === 'granted',
    toggle,
    isIOS,
    isStandalone,
  }
}
