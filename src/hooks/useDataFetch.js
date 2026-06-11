/**
 * 数据获取 Hook
 */

import { useState, useEffect, useCallback, useRef } from 'react'

const CACHE_PREFIX = 'star_chase_cache_'
const DEFAULT_CACHE_TTL = 30 * 60 * 1000

export function useDataFetch(fetchFn, options = {}) {
  const {
    immediate = true,
    cacheable = false,
    cacheTTL = DEFAULT_CACHE_TTL,
    cacheKey,
  } = options

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fromCache, setFromCache] = useState(false)
  
  const mountedRef = useRef(true)
  const fetchIdRef = useRef(0)
  const fetchFnRef = useRef(fetchFn)

  useEffect(() => {
    fetchFnRef.current = fetchFn
  }, [fetchFn])

  const getCacheKey = useCallback(() => {
    if (cacheKey) return `${CACHE_PREFIX}${cacheKey}`
    return `${CACHE_PREFIX}default`
  }, [cacheKey])

  const readCache = useCallback(() => {
    if (!cacheable) return null
    
    try {
      const key = getCacheKey()
      const cached = localStorage.getItem(key)
      if (!cached) return null

      const { data, timestamp } = JSON.parse(cached)
      const now = Date.now()
      
      if (now - timestamp > cacheTTL) {
        localStorage.removeItem(key)
        return null
      }

      return data
    } catch {
      return null
    }
  }, [cacheable, getCacheKey, cacheTTL])

  const writeCache = useCallback((data) => {
    if (!cacheable || !data) return
    
    try {
      const key = getCacheKey()
      const cacheData = {
        data,
        timestamp: Date.now(),
      }
      localStorage.setItem(key, JSON.stringify(cacheData))
    } catch {
      // 静默处理
    }
  }, [cacheable, getCacheKey])

  const fetchData = useCallback(async (...args) => {
    const fetchId = ++fetchIdRef.current
    
    setLoading(true)
    setError(null)
    setFromCache(false)

    const cachedData = readCache()
    if (cachedData) {
      setData(cachedData)
      setFromCache(true)
      setLoading(false)
      return cachedData
    }

    try {
      const result = await fetchFnRef.current(...args)
      
      if (!mountedRef.current) return result
      if (fetchId !== fetchIdRef.current) return result

      setData(result)
      setFromCache(false)
      setLoading(false)
      writeCache(result)
      
      return result
    } catch (err) {
      if (!mountedRef.current) return
      if (fetchId !== fetchIdRef.current) return

      const error = {
        type: getErrorType(err),
        message: err.message || '未知错误',
        original: err,
      }
      
      setError(error)
      setLoading(false)
      
      return null
    }
  }, [readCache, writeCache])

  const retry = useCallback(() => {
    return fetchData()
  }, [fetchData])

  const reset = useCallback(() => {
    setData(null)
    setLoading(false)
    setError(null)
    setFromCache(false)
  }, [])

  const clearCache = useCallback(() => {
    if (!cacheable) return
    try {
      const key = getCacheKey()
      localStorage.removeItem(key)
    } catch {
      // 静默处理
    }
  }, [cacheable, getCacheKey])

  useEffect(() => {
    if (immediate) {
      fetchData() // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [immediate]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  return {
    data,
    loading,
    error,
    fromCache,
    fetchData,
    retry,
    reset,
    clearCache,
  }
}

function getErrorType(error) {
  if (!error) return 'unknown'
  
  const message = error.message?.toLowerCase() || ''
  
  if (message.includes('network') || message.includes('fetch')) {
    return 'network'
  }
  if (message.includes('timeout') || message.includes('超时')) {
    return 'timeout'
  }
  if (message.includes('server') || message.includes('500') || message.includes('502') || message.includes('503')) {
    return 'server'
  }
  if (message.includes('404') || message.includes('not found')) {
    return 'data'
  }
  
  return 'unknown'
}

/**
 * 轮询 Hook
 */
export function usePolling(fetchFn, interval = 60000, options = {}) {
  const { enabled = true, ...fetchOptions } = options
  
  const result = useDataFetch(fetchFn, {
    ...fetchOptions,
    immediate: false,
  })

  useEffect(() => {
    if (!enabled) return

    result.fetchData()

    const timer = setInterval(() => {
      result.fetchData()
    }, interval)

    return () => clearInterval(timer)
  }, [enabled, interval]) // eslint-disable-line react-hooks/exhaustive-deps

  return result
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

export default useDataFetch
