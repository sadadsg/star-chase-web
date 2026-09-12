import { useState, useEffect, useCallback } from 'react'

// localStorage 持久化状态（就近匹配/偏好设置的通用底座）
// 存取失败（隐私模式/禁用存储）静默降级为内存态
export function useLocalStorage(key, initial = '') {
  const storageKey = `star-chase:${key}`

  const read = useCallback(() => {
    try {
      return window.localStorage.getItem(storageKey) ?? initial
    } catch {
      return initial
    }
  }, [storageKey, initial])

  const [value, setValue] = useState(read)

  useEffect(() => {
    const sync = () => setValue(read())
    // 跨标签页同步
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [read])

  const update = useCallback((next) => {
    const v = typeof next === 'function' ? next(read()) : next
    try {
      if (v) window.localStorage.setItem(storageKey, v)
      else window.localStorage.removeItem(storageKey)
    } catch {
      // 写入失败仍更新内存态
    }
    setValue(v)
  }, [storageKey, read])

  return [value, update]
}
