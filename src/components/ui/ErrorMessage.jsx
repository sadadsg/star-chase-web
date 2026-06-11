/**
 * 全局错误提示组件
 * 用于显示友好的错误信息
 */

import { useState, useEffect } from 'react'

// 错误类型配置
const errorTypes = {
  network: {
    icon: '📡',
    title: '网络连接失败',
    message: '无法连接到服务器，请检查网络连接',
    color: 'text-[#E85D3A]',
    bg: 'bg-[#FEF3F2]',
    border: 'border-[#FECDCA]',
  },
  server: {
    icon: '⚠️',
    title: '服务器错误',
    message: '服务器开小差了，请稍后再试',
    color: 'text-[#D97706]',
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FDE68A]',
  },
  data: {
    icon: '📊',
    title: '数据加载失败',
    message: '无法获取最新数据，显示的是缓存内容',
    color: 'text-[#6366F1]',
    bg: 'bg-[#EEF2FF]',
    border: 'border-[#C7D2FE]',
  },
  timeout: {
    icon: '⏱️',
    title: '请求超时',
    message: '服务器响应超时，请稍后再试',
    color: 'text-[#D97706]',
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FDE68A]',
  },
  unknown: {
    icon: '❌',
    title: '未知错误',
    message: '发生了意外错误，请刷新页面重试',
    color: 'text-[#E85D3A]',
    bg: 'bg-[#FEF3F2]',
    border: 'border-[#FECDCA]',
  },
}

export function ErrorMessage({
  type = 'unknown',
  title,
  message,
  onRetry,
  onDismiss,
  autoHide = false,
  duration = 5000,
  className = '',
}) {
  const [visible, setVisible] = useState(true)
  const config = errorTypes[type] || errorTypes.unknown

  useEffect(() => {
    if (autoHide && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false)
        onDismiss?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [autoHide, duration, onDismiss])

  if (!visible) return null

  return (
    <div className={`${config.bg} ${config.border} border rounded-xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{config.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-[15px] ${config.color}`}>
            {title || config.title}
          </h4>
          <p className="text-[14px] text-[#5A6577] mt-1">
            {message || config.message}
          </p>
          {(onRetry || onDismiss) && (
            <div className="flex gap-2 mt-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-[13px] font-medium bg-white px-3 py-1.5 rounded-lg border border-[#EDF0F5] hover:bg-[#F7F9FC] transition-colors"
                >
                  重试
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={() => {
                    setVisible(false)
                    onDismiss()
                  }}
                  className="text-[13px] font-medium text-[#8E99A8] px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
                >
                  关闭
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 内联错误提示（用于表单等场景）
export function InlineError({ message, className = '' }) {
  if (!message) return null

  return (
    <div className={`flex items-center gap-2 text-[13px] text-[#E85D3A] ${className}`}>
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  )
}

// 空状态提示
export function EmptyState({
  icon = '📭',
  title = '暂无数据',
  message = '这里空空如也',
  action,
  onAction,
  className = '',
}) {
  return (
    <div className={`bg-white rounded-2xl py-16 text-center border border-[#EDF0F5] ${className}`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold text-[#2D3748] text-[16px] mb-2">{title}</h3>
      <p className="text-[#8E99A8] text-[14px] mb-6">{message}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="bg-[#5B8DEF] text-white text-[14px] font-medium px-5 py-2.5 rounded-xl hover:bg-[#4A7DE0] transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  )
}

// 网络状态提示条
export function NetworkStatus({ isOnline = true, className = '' }) {
  if (isOnline) return null

  return (
    <div className={`bg-[#FFFBEB] border-b border-[#FDE68A] px-4 py-2 ${className}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-[13px] text-[#92400E]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
        </svg>
        <span>网络连接已断开，显示的是缓存内容</span>
      </div>
    </div>
  )
}

export default ErrorMessage
