import { motion } from 'framer-motion'
import { useNotificationPermission } from '../hooks/useNotificationPermission'
import { SPRING_SOFT } from '../lib/motion'

/**
 * 行程提醒开关（iOS 式弹簧开关）。
 *
 * 为什么放在前端：服务端推送（企微/Bark/TG）需要用户配 secret，没配就完全没有提醒能力。
 * 这里走浏览器原生通知 —— 数据是静态 JSON + SW 的 stale-while-revalidate，
 * 拿到新的 schedule.json 就能比对出新增条目，零后端、零 secret，开箱可用。
 */
export default function NotifyToggle({ className = '' }) {
  const { supported, permission, enabled, toggle, isIOS, isStandalone } = useNotificationPermission()

  if (!supported) return null

  // iOS 上未添加到主屏时无法弹通知，如实说明而不是让用户点了没反应
  const blockedByIOS = isIOS && !isStandalone
  const disabled = blockedByIOS || permission === 'denied'

  const hint = blockedByIOS
    ? 'iPhone / iPad 需先把本站「添加到主屏幕」，再回来开启'
    : permission === 'denied'
      ? '已被浏览器拒绝，请在系统设置里允许本站发送通知'
      : '工作室发布新行程时在本机提醒你'

  return (
    <div className={className}>
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-pressed={enabled}
        className="inline-flex items-center gap-2 bg-transparent border-0 p-0"
        style={{
          fontSize: 13,
          color: 'var(--color-text-secondary)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.45 : 1,
        }}
        title={hint}
      >
        <span className="whitespace-nowrap">行程提醒</span>
        <motion.span
          aria-hidden="true"
          style={{
            width: 40, height: 24, borderRadius: 980, position: 'relative',
            flexShrink: 0, display: 'inline-block',
          }}
          animate={{ backgroundColor: enabled ? 'var(--color-btn)' : 'var(--color-surface-deep)' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <motion.span
            style={{
              position: 'absolute', top: 2, left: 0, width: 20, height: 20, borderRadius: '50%',
              background: 'var(--color-bg)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
            animate={{ x: enabled ? 20 : 0 }}
            transition={SPRING_SOFT}
          />
        </motion.span>
      </button>
      {blockedByIOS && (
        <p className="text-[12px] m-0 mt-1.5" style={{ color: 'var(--color-text-muted)' }}>
          添加到主屏幕后才能开启提醒
        </p>
      )}
    </div>
  )
}
